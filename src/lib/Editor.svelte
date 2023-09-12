<script lang="ts" context="module">
	import type Monaco from 'monaco-editor';
	import { onDestroy, onMount } from 'svelte';

	import type FileManager from './FileManager';
	import type { Node } from '$lib';

	import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
	import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
	import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
	import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
	import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
</script>

<script lang="ts">
	let editorElement: HTMLDivElement;
	let progress = 10;

	export let fileManager: FileManager;
	export let node: Node;

	let size = node.size;
	$: size = node.size;

	let editor: Monaco.editor.IStandaloneCodeEditor;

	async function saveFile() {
		progress = 0;
		// Handle saving
		const newFile = await fileManager.createFile({
			path: node.path + '-tmp',
			name: node.name + '-tmp',
			mimeType: node.mimeType,
			uri:
				`data:${node.mimeType};base64,` +
				btoa(editor.getValue({ preserveBOM: true, lineEnding: '\n' }))
		});

		console.log('Created tempFile', newFile);
		progress = 50;
		await fileManager.rename(newFile, node.path);
		progress = 100;
		node = node;
		console.log('new size: ', node.size);
	}
	onMount(async () => {
		setInterval(() => (node.size = node.size ?? 0 + 10), 1000);
		self.MonacoEnvironment = {
			globalAPI: true,
			getWorker(workerId: string, label: string): Worker {
				let result;
				switch (label) {
					case 'json':
						result = JsonWorker;
						break;
					case 'css':
					case 'scss':
					case 'less':
						result = CssWorker;
						break;
					case 'html':
					case 'handlebars':
					case 'razor':
						result = HtmlWorker;
						break;
					case 'typescript':
					case 'javascript':
						result = TsWorker;
						break;
					default:
						result = EditorWorker;
				}
				console.log('Getting worker', workerId, label);
				return new result();
			},
			createTrustedTypesPolicy() {
				return undefined;
			}
		};

		const contentPromise = fileManager.getFileContents(node);

		const Monaco = await import('monaco-editor');
		// Monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
		// 	validate: true,
		// 	// schemas: [
		// 	// 	{
		// 	// 		schema: surveySchemas,
		// 	// 		uri: 'never',
		// 	// 		fileMatch: ['*']
		// 	// 	}
		// 	// ]
		// });

		console.log(Monaco);

		editor = Monaco.editor.create(editorElement, {
			language: node.mimeType,
			value: await contentPromise,
			glyphMargin: true,
			automaticLayout: true
		});

		editor.addCommand(Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.KeyS, () => {
			saveFile();
		});
		const model = editor.getModel();
		if (model == null) {
			throw new Error('Failed to initialize model');
		}
	});

	onDestroy(() => {
		console.log('Destroying component');
		editor?.dispose();
	});
</script>

<section>
	<div class="toolbar">
		<button class="btn" type="button">Save</button><button type="button">Refresh</button><button
			class="btn"
			type="button">Cancel</button
		>
		<progress value={progress} max="100" />
		<span>Size: {size}</span>
	</div>
	<div class="editor" bind:this={editorElement} />
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
