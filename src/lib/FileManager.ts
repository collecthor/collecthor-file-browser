import type ApiClient from './interfaces/ApiClient';
import type { external } from '$lib/interfaces/api.generated.d.ts';
import EventEmitter from 'eventemitter3';
import type FileBrowserError from './interfaces/FileBrowserError';
import type { PublicUri } from '$lib';
import { isFileBrowserError } from './interfaces/FileBrowserError';
import { BehaviorSubject, from, Observable } from 'rxjs';

type Node = external['models/Node.json'];
type Path = external['models/Path.json'];
type CreateRequest = external['models/CreateRequest.json'];

interface Events {
	error: (error: FileBrowserError) => void;
	pick: (file: PublicUri) => void;
}
/**
 * This class manages client side state of a file manager.
 * It exposes stores that UI components like PathBar can use.
 * It exposes mutators that can be triggered by UI components.
 */
export default class FileManager {
	private statusStore: BehaviorSubject<string> = new BehaviorSubject<string>('Initializing');

	private pathContentsStore: BehaviorSubject<Node[]> = new BehaviorSubject<Node[]>([]);
	private pathStackStore: BehaviorSubject<Node[]> = new BehaviorSubject<Node[]>([]);

	private client: ApiClient;
	private dispatcher: EventEmitter<Events>;

	public constructor(client: ApiClient, initialPath = '') {
		this.client = client;
		this.dispatcher = new EventEmitter();

		this.statusStore.next('Constructing');

		this.pathContentsStore = new BehaviorSubject<Node[]>([]);

		this.pathStackStore.subscribe(async (newValue) => {
			const path = newValue.length > 0 ? newValue[newValue.length - 1].path : '';
			this.statusStore.next(`Loading contents for path ${path}`);
			try {
				const contents = await this.client.viewPath(path);
				this.pathContentsStore.next(contents);
			} catch (error) {
				if (typeof error === 'string') {
					this.statusStore.next(`Failed loading contents with error ${error}`);
					return;
				} else if (error instanceof Error) {
					this.statusStore.next(
						`Failed loading contents with error ${error.name}: ${error.message}`
					);
					return;
				}
				console.error(error);
			}

			this.statusStore.next(`Ready`);
		});

		if (initialPath != '') {
			this.navigateToPath(initialPath);
		}
	}

	private async navigateToPath(path: Path) {
		let partialPath = '';
		const promises: Promise<Node>[] = [];
		for (const part of path.split('/')) {
			// Get all the files
			const filesInPath = this.client.viewPath(partialPath);
			partialPath = partialPath.length === 0 ? part : `${partialPath}/${part}`;
			const search = partialPath;

			// Look for the relevant file
			promises.push(
				filesInPath.then((nodes: Node[]) => {
					const node = nodes.find((node: Node) => node.path === search);
					if (typeof node == 'undefined') {
						console.warn('Did not find node', search, nodes);
						throw `Did not find node with path ${search}`;
					}
					return node;
				})
			);
		}
		console.log('Waiting for', promises.length, 'api calls');
		this.pathStackStore.next(await Promise.all(promises));
	}

	public getContents(): Observable<Node[]> {
		console.log('getContents');
		return from(this.pathContentsStore);
	}

	public getStatus(): Observable<string> {
		return from(this.statusStore);
	}
	public getPathStack(): Observable<Node[]> {
		return from(this.pathStackStore);
	}

	public async refresh() {
		this.pathStackStore.next(this.pathStackStore.value);
	}

	public getCurrentPathString(): string {
		const pathStack = this.pathStackStore.value;
		if (pathStack.length > 0) {
			return pathStack[pathStack.length - 1].path;
		} else {
			return '';
		}
	}

	public generatePathForFileName(name: string): string {
		const pathStack = this.pathStackStore.value;
		if (pathStack.length > 0) {
			return pathStack[pathStack.length - 1].path + '/' + name;
		} else {
			return name;
		}
	}

	public goHome(): void {
		this.pathStackStore.next([]);
	}

	public async goToNode(node: Node): Promise<void> {
		this.statusStore.next(`Navigating to path ${node.path}`);
		const pathStack = this.pathStackStore.value;
		let newStack: Node[];
		if (pathStack.length === 0) {
			newStack = [node];
		} else if (pathStack.some((n) => n.path === node.path)) {
			newStack = pathStack.slice(0, pathStack.findIndex((n) => n.path === node.path) + 1);
		} else if (node.path.startsWith(pathStack[pathStack.length - 1].path + '/')) {
			newStack = [...pathStack, node];
		} else {
			// This node is not yet on the stack and not a direct child of the stack
			console.warn(
				'Navigating to node not in stack, this requires recursive lookups to build the stack',
				pathStack,
				node
			);
			this.navigateToPath(node.path);
			return;
		}
		this.pathStackStore.next(newStack);
	}

	/**
	 * Add a new node to the current content, could be an optimistic UI update
	 */
	public addNode(node: Node): void {
		this.pathContentsStore.next([node, ...this.pathContentsStore.value]);
	}

	public removeNode(node: Node): void {
		this.pathContentsStore.next(
			this.pathContentsStore.value.filter((existing: Node) => existing !== node)
		);
	}

	public async createFile(request: CreateRequest): Promise<Node> {
		// Optimistic update
		const newNode: Node = {
			name: request.name,
			path: request.path,
			icon: null,
			size: 0,
			mimeType: request.mimeType + ';optimistic',
			permissions: {
				create: false,
				read: false,
				delete: false,
				write: false
			}
		};
		this.addNode(newNode);
		try {
			const createdNode = await this.client.createFile(request);
			this.addNode(createdNode);
			this.removeNode(newNode);
			return createdNode;
		} catch (error) {
			this.removeNode(newNode);
			if (isFileBrowserError(error)) {
				this.dispatcher.emit('error', error);
			}
			throw error;
		}
	}

	/**
	 * Rename a file in the same path
	 */
	public async move(source: Node, newPath: string): Promise<Node> {
		const oldName = source.name;
		const oldPath = source.path;
		source.path = newPath;

		try {
			const newNode = await this.client.moveFile(oldPath, newPath);
			// We update the old node with properties from the new node.
			Object.assign(source, newNode);
			console.log(source, newNode);
			this.refresh();
			return newNode;
		} catch (error) {
			source.name = oldName;
			source.path = oldPath;
			if (isFileBrowserError(error)) {
				this.dispatcher.emit('error', error);
			}
			throw error;
		}
	}

	public async delete(file: Node): Promise<void> {
		this.removeNode(file);
		try {
			await this.client.deleteFile(file.path);
		} catch {
			this.addNode(file);
		}
	}

	public async getUrl(file: Node): Promise<URL> {
		const data = await this.client.getUrl(file.path);
		return new URL(data.uri);
	}

	public async download(file: Node): Promise<void> {
		const data = await this.client.getUrl(file.path);
		const link = document.createElement('a');
		link.href = data.uri;
		link.target = '_blank';
		link.download = file.name;
		link.click();
	}

	public async getFileContents(file: Node): Promise<string> {
		const url = await this.client.getUrl(file.path);
		const response = await fetch(url.uri, {
			mode: 'cors',
			credentials: 'omit',
			cache: 'no-cache'
		});
		return response.text();
	}

	public eventRegistry(): EventEmitter<Events> {
		return new Proxy(this.dispatcher, {
			get(target, prop, receiver) {
				if (prop === 'emit') {
					throw 'Cannot access private method emit';
				}
				return Reflect.get(target, prop, receiver);
			}
		});
	}

	public async pickFile(file: Node): Promise<void> {
		const publicUri = await this.client.getUrl(file.path);
		this.dispatcher.emit('pick', publicUri);
	}
}
