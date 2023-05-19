<script lang="ts">
  // This component is needed to be able to use the modal from the filebrowsercontent component
  import { browser } from '$app/environment';
  import type ContextMenuAction from "./interfaces/ContextMenuAction";
  import type { Node } from '$lib/generated/Node';

  import Modal from "svelte-simple-modal";
  import FileBrowserContent from "$lib/FileBrowserContent.svelte";
  export let baseurl: string;
  export let openFile: (file: Node) => void;
  export let itemSelected: (file: Node) => void;
  export let type = "browser";
  export let basePath = "/";
  export let actions: ContextMenuAction[] = [];
</script>
{#if browser}
<Modal styleCloseButton={{ cursor: 'pointer' }}>
  <FileBrowserContent {...$$props} on:message/>
</Modal>
{/if}