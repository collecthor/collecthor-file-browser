import { get, writable, readonly } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import type ApiClient from './interfaces/ApiClient';
import type { external } from '$lib/interfaces/api.generated.d.ts';
import EventEmitter from 'eventemitter3';
import type FileBrowserError from './interfaces/FileBrowserError';
import type { PublicUri } from '$lib';
import { isFileBrowserError } from './interfaces/FileBrowserError';
import { tick } from 'svelte';

type Node = external['models/Node.json'];
type Path = external['models/Path.json'];
type CreateRequest = external['models/CreateRequest.json'];

type Events = {
	error: (error: FileBrowserError) => void;
	pick: (file: PublicUri) => void;
};
/**
 * This class manages client side state of a file manager.
 * It exposes stores that UI components like PathBar can use.
 * It exposes mutators that can be triggered by UI components.
 */
export default class FileManager {
	private pathContentsStore: Writable<Node[]>;
	private pathStackStore: Writable<Node[]>;

	private client: ApiClient;
	private dispatcher: EventEmitter<Events>;

	public constructor(client: ApiClient, initialPath = '') {
		this.client = client;
		this.dispatcher = new EventEmitter();

		this.pathStackStore = writable<Node[]>([]);
		this.pathContentsStore = writable<Node[]>([], () => {
			console.log('started content store');
			let unsubscribe: () => void;
			let canceled = false;

			(async () => {
				await tick();

				// To avoid race conditions
				if (!canceled) {
					console.log('Subscribing to pathstackstore');
					unsubscribe = this.pathStackStore.subscribe(async (newValue) => {
						let contents;
						if (newValue.length > 0) {
							contents = await this.client.viewPath(newValue[newValue.length - 1].path);
						} else {
							contents = await this.client.viewPath('');
						}
						console.log('pathStackStore updated:', contents);
						this.pathContentsStore.set(contents);
					});
				}
			})();

			return () => {
				canceled = true;

				if (unsubscribe) {
					unsubscribe();
				}
			};
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
			// Look for the relevant file
			promises.push(
				filesInPath.then((nodes: Node[]) => {
					const node = nodes.find((node: Node) => node.path === partialPath);
					if (typeof node == 'undefined') {
						throw `Did not find node with path ${partialPath}`;
					}
					return node;
				})
			);
		}
		console.log('Waiting for', promises.length, 'api calls');
		this.pathStackStore.set(await Promise.all(promises));
	}

	public getContents(): Readable<Node[]> {
		console.log('getcontents');
		return readonly(this.pathContentsStore);
	}

	public getPathStack(): Readable<Node[]> {
		return readonly(this.pathStackStore);
	}

	public getCurrentPathString(): string {
		const pathStack = get(this.pathStackStore);
		if (pathStack.length > 0) {
			return pathStack[pathStack.length - 1].path;
		} else {
			return '';
		}
	}

	public generatePathForFileName(name: string): string {
		const pathStack = get(this.pathStackStore);
		if (pathStack.length > 0) {
			return pathStack[pathStack.length - 1].path + '/' + name;
		} else {
			return name;
		}
	}

	public goHome(): void {
		this.pathStackStore.set([]);
	}

	public async goToNode(node: Node): Promise<void> {
		const pathStack = get(this.pathStackStore);
		if (pathStack.length === 0) {
			this.pathStackStore.set([node]);
		} else if (pathStack.includes(node)) {
			this.pathStackStore.set(pathStack.slice(0, pathStack.indexOf(node)));
		} else if (node.path.startsWith(pathStack[pathStack.length - 1].path + '/')) {
			this.pathStackStore.set([...pathStack, node]);
		} else {
			// This node is not yet on the stack and not a direct child of the stack
			console.warn(
				'Navigating to node not in stack, this requires recursive lookups to build the stack'
			);
			this.navigateToPath(node.path);
		}
	}

	/**
	 * Add a new node to the current content, could be an optimistic UI update
	 */
	public addNode(node: Node): void {
		this.pathContentsStore.set([node, ...get(this.pathContentsStore)]);
	}

	public removeNode(node: Node): void {
		this.pathContentsStore.set(
			get(this.pathContentsStore).filter((existing: Node) => existing !== node)
		);
	}

	public async createFile(request: CreateRequest) {
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
		} catch (error) {
			if (isFileBrowserError(error)) {
				this.dispatcher.emit('error', error);
			}
		} finally {
			setTimeout(() => this.removeNode(newNode), 1000);
		}
	}

	public async delete(file: Node): Promise<void> {
		this.removeNode(file);
		try {
			await this.client.deleteFile(file.path);
		} finally {
			setTimeout(() => this.addNode(file), 1000);
		}
	}

	public async download(file: Node): Promise<void> {
		const data = await this.client.getUrl(file.path);
		const link = document.createElement('a');
		link.href = data.uri;
		link.target = '_blank';
		link.download = file.name;
		link.click();
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
