<script lang="ts" module>
	import type Monaco from 'monaco-editor';
	import { onMount } from 'svelte';

	import type FileManager from './FileManager';
	import type { Node } from '$lib';

	import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
	import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
	import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
	import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
	import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
</script>

<script lang="ts">
	let editorElement = $state<HTMLDivElement>();
	let progress = $state(10);

	const workers: Record<string, new () => Worker> = {
		html: HtmlWorker,
		editorWorkerService: EditorWorker,
		css: CssWorker,
		scss: CssWorker,
		less: CssWorker,
		json: JsonWorker,
		typescript: TsWorker,
		javascript: TsWorker
	};

	const languages: Record<string, string> = {
		'application/text': 'plaintext',
		'application/javascript': 'javascript',
		'text/html': 'html'
	};

	interface Props {
		fileManager: FileManager;
		node: Node;
	}

	let { fileManager, node = $bindable() }: Props = $props();

	let size = $derived(node.size);
	let editor = $state<Monaco.editor.IStandaloneCodeEditor>();

	async function saveFile() {
		if (typeof editor === 'undefined') {
			return;
		}
		progress = 0;
		// Handle saving

		const dataURL = new Promise((resolve: (s: string) => void, reject) => {
			if (typeof editor === 'undefined') {
				reject('Editor not set');
				return;
			}
			const reader = new FileReader();
			const blob = new Blob([editor.getValue({ preserveBOM: true, lineEnding: '\n' })], {
				type: node.mimeType
			});
			reader.addEventListener('load', () => {
				if (typeof reader.result == 'string') {
					resolve(reader.result);
				} else {
					reject('Expected reader result to be string');
				}
			});
			reader.readAsDataURL(blob);
		});

		const newFile = await fileManager.createFile({
			path: node.path + '-tmp',
			name: node.name + '-tmp',
			mimeType: node.mimeType,
			uri: await dataURL
		});

		console.log('Created tempFile', newFile);
		progress = 50;
		await fileManager.move(newFile, node.path);
		progress = 100;
		node = node;
		console.log('new size: ', node.size);
	}

	$effect(() => {
		if (!editorElement) return;

		(async () => {
			const contentPromise = fileManager.getFileContents(node);
			const monacoPromise = import('monaco-editor');

			const [Monaco, value] = await Promise.all([monacoPromise, contentPromise]);

			editor = Monaco.editor.create(editorElement, {
				language: languages[node.mimeType] ?? node.mimeType,
				value: value,
				glyphMargin: true,
				automaticLayout: true
			});

			editor.addAction({
				id: 'save',
				label: 'save',
				run: saveFile,
				keybindings: [Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.KeyS]
			});

			const model = editor.getModel();
			if (model == null) {
				throw new Error('Failed to initialize model');
			}
		})();

		return () => {
			console.log('Destroying component');
			editor?.dispose();
		};
	});
	onMount(async () => {
		self.MonacoEnvironment = {
			globalAPI: true,

			getWorker(workerId: string, label: string): Worker {
				console.log(`Getting worker with id ${workerId} and label ${label}`);
				if (!workers[label]) {
					console.error(`Worker type not configured`);
					throw new Error(`Worker with label ${label}`);
				}
				return new workers[label]();
			},
			createTrustedTypesPolicy() {
				return undefined;
			}
		};
	});
</script>

<section>
	<div class="toolbar">
		<button class="btn" type="button" onclick={saveFile}>Save</button>
		<progress value={progress} max="100"></progress>
		<span>Size: {size}</span>
	</div>
	<div class="editor" bind:this={editorElement}></div>
</section>

<style>
	section {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.toolbar {
		padding: 5px;
		border-bottom: 1px sold black;
		margin-bottom: 10px;
	}

	.editor {
		min-height: 300px;
		flex-grow: 1;
		width: 100%;
	}
	div :global(.errorGlyph) {
		background: rgba(255, 0, 0, 0.3);
	}
	div :global(.errorGlyph)::before {
		content: 'X';
	}
</style>
