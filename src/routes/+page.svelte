<script lang="ts">
	import {getContext, onMount} from "svelte";
	import FileBrowser from "$lib/FileBrowser.svelte";
	import type BackendFile from "../interfaces/BackendFile";

	const { open } = getContext('simple-modal');

	function openFileBrowser() {
		open(FileBrowser, {
			itemSelected: (file: BackendFile) => console.log(file.path),
			baseurl: "https://collecthor.test/v2/file-manager/organisation2",
			type: "picker",
		})
	}
</script>

<button on:click={() => openFileBrowser()}>Open file browser modal!</button>

<FileBrowser
	openFile={(file) => console.log(file.path)}
	itemSelected={(file) => console.log(file.path)}
	baseurl="https://collecthor.test/v2/file-manager/organisation2"
></FileBrowser>


<style lang="scss">

</style>
