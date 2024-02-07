<script lang="ts">
	import type ContextMenuAction from './interfaces/ContextMenuAction';

	import FileBrowserContent from '$lib/FileBrowserContent.svelte';
	import type FileManager from '$lib/FileManager';

	export let actions: ContextMenuAction[] = [];

	export let type: 'browser' | 'picker' = 'browser';
	export let fileManager: FileManager;

	fileManager.eventRegistry().on('error', (errorData) => {
		console.error(errorData);
	});
</script>

<FileBrowserContent {type} {actions} {fileManager} />
