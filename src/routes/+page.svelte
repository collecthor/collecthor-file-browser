<script lang="ts">
	import FileBrowser from '$lib/FileBrowser.svelte';
	import FileManager from '$lib/FileManager';
	import FetchApiClient from '$lib/FetchApiClient';
	import type { PublicUri } from '$lib';
	import Folder from 'virtual:icons/mdi/folder';
	const client = new FetchApiClient('http://localhost:3100');
	const fileManager = new FileManager(client);

	fileManager.eventRegistry().on('pick', (file: PublicUri) => {
		console.log('Picked:', file, file.uri);
	});
</script>

<Folder></Folder>
<FileBrowser {fileManager} />
