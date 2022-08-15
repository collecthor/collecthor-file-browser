<script lang="ts">
    // This component is needed to be able to use the modal from the filebrowsercontent component
  import type BackendFile from "src/interfaces/BackendFile";
  import type ContextMenuAction from "src/interfaces/ContextMenuAction";

  import Modal from "svelte-simple-modal";
  import FileBrowserContent from "./FileBrowserContent.svelte";
  export let baseurl: string;
  export let openFile: (file: BackendFile) => void;
  export let type = "browser";
  export let basePath = "/";
  export let actions: ContextMenuAction[] = [];
</script>

<Modal>
  <FileBrowserContent {...$$props} />
</Modal>