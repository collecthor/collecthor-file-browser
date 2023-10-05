<script lang="ts">
	import type ContextMenuAction from './interfaces/ContextMenuAction';

	import FileBrowserContent from '$lib/FileBrowserContent.svelte';
	import type FileManager from '$lib/FileManager';
	import IconStack from '@collecthor/svelte-material-icons/dist/IconStack.svelte';

	export let actions: ContextMenuAction[] = [];

	export let type: 'browser' | 'picker' = 'browser';
	export let fileManager: FileManager;

	fileManager.eventRegistry().on('error', (errorData) => {
		console.error(errorData);
	});
</script>

<IconStack />
<FileBrowserContent {type} {actions} {fileManager} />
