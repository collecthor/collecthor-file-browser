<script lang="ts">
	import FileBrowser from "$lib/FileBrowser.svelte";
import FileBrowserContent from "$lib/FileBrowserContent.svelte";

	const openFile = () => {

	}
</script>

<main>
	<FileBrowser
	openFile={openFile}
	itemSelected={openFile}
	baseurl="https://collecthor.test"
	></FileBrowser>
</main>

<style lang="scss">

</style>
