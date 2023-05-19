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
	baseurl="https://collecthor.test/v2/file-manager/organisation2"
	></FileBrowser>
</main>

<style lang="scss">

</style>
