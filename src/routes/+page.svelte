<script lang="ts">
	import {getContext, onMount} from "svelte";
	import FileBrowser from "$lib/FileBrowser.svelte";
	import type { Node } from "$lib/generated/Node";

	const { open } = getContext('simple-modal');

	function openFileBrowser() {
		open(FileBrowser, {
			openFile: (file) => console.log(file.path),
			itemSelected: (file: Node) => console.log(file.path),
			baseurl: "http://localhost:3100",
			type: "picker",
		})
	}
</script>

<button on:click={() => openFileBrowser()}>Open file browser modal!</button>

<FileBrowser
	openFile={(file) => console.log(file.path)}
	itemSelected={(file) => console.log(file.path)}
	baseurl="http://localhost:3100"
></FileBrowser>


<style lang="scss">

</style>
