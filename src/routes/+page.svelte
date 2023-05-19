<script lang="ts">
	import {getContext, onMount} from "svelte";
	import FileBrowser from "$lib/FileBrowser.svelte";
	import type BackendFile from "../interfaces/BackendFile";

	const { open } = getContext('simple-modal');

	function openFileBrowser() {
		open(FileBrowser, {
			itemSelected: (file: BackendFile) => console.log(file.path),
			baseurl: "http://localhost:3100",
			type: "picker",
		})
	}
</script>

<button on:click={() => openFileBrowser()}>Open file browser modal!</button>

<FileBrowser
	itemSelected={(file) => console.log(file.path)}
	baseurl="http://localhost:3100"
	type="picker"
>
</FileBrowser>

<style lang="scss">

</style>
