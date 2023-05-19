<script lang="ts">
    // This component is needed to be able to use the modal from the filebrowsercontent component
  import type BackendFile from "../interfaces/BackendFile";
  import { browser } from '$app/environment';
  import type ContextMenuAction from "../interfaces/ContextMenuAction";

  import Modal from "svelte-simple-modal";
  import FileBrowserContent from "$lib/FileBrowserContent.svelte";
  export let baseurl: string;
  export let openFile: (file: BackendFile) => void;
  export let itemSelected: (file: BackendFile) => void;
  export let type = "browser";
  export let basePath = "/";
  export let actions: ContextMenuAction[] = [];
</script>
{#if browser}
<Modal styleCloseButton={{ cursor: 'pointer' }}>
  <FileBrowserContent {...$$props} on:message/>
</Modal>
{/if}