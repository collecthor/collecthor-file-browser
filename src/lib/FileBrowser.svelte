<script lang="ts">
	import type ContextMenuAction from './interfaces/ContextMenuAction';

	import FileBrowserContent from '$lib/FileBrowserContent.svelte';
	import type FileManager from '$lib/FileManager';

	interface Props {
		actions?: ContextMenuAction[];
		type?: 'browser' | 'picker';
		fileManager: FileManager;
	}

	let { actions = [], type = 'browser', fileManager }: Props = $props();

	fileManager.eventRegistry().on('error', (errorData) => {
		console.error(errorData);
	});
</script>

<FileBrowserContent {type} {actions} {fileManager} />
