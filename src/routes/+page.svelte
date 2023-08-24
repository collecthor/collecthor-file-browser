<script lang="ts">
	import FileBrowser from '$lib/FileBrowser.svelte';
	import FileManager from '$lib/FileManager';
	import FetchApiClient from '$lib/FetchApiClient';
	import type { PublicUri } from '$lib';
	import { Modal, type Context } from 'svelte-simple-modal';

	const client = new FetchApiClient('http://localhost:3100');
	const fileManager = new FileManager(client);

	let modalContext: Context;

	fileManager.eventRegistry().on('pick', (file: PublicUri) => {
		console.log('Picked:', file, file.uri);
	});
	function openFileBrowser(passContext: boolean) {
		if (modalContext) {
			modalContext.open(FileBrowser, {
				type: 'picker',
				fileManager: fileManager,
				modalContext: passContext ? modalContext : null
			});
		}
	}

	function setModalContext<T>(key: unknown, value: T): T {
		if (key === 'simple-modal') {
			// ugly, no strict type check
			modalContext = <Context>value;
		}
		return value;
	}
</script>

<button type="button" on:click={() => openFileBrowser(true)}
	>Open file browser modal with modal context!</button
>
<button type="button" on:click={() => openFileBrowser(false)}
	>Open file browser modal without modal context!</button
>
<!-- This modal is only used for the popup via the button above-->
<Modal setContext={setModalContext} />

<FileBrowser {fileManager} />

<style lang="scss">
</style>
