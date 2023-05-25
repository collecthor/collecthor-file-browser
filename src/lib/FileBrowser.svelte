<script lang="ts">
    // This component is needed to be able to use the modal from the filebrowsercontent component
  import type ContextMenuAction from "./interfaces/ContextMenuAction";
  import type { Node } from '$lib/generated/Node';

  import type { Modal as ModalType } from "svelte-simple-modal";
  import FileBrowserContent from "$lib/FileBrowserContent.svelte";
  import { onMount } from 'svelte';
  export let baseurl: string;
  export let openFile: (file: Node) => void;
  export let itemSelected: (file: Node) => void;
  export let type = "browser";
  export let basePath = "/";
  export let actions: ContextMenuAction[] = [];

  let Modal: typeof ModalType;
  onMount(async () => {
    Modal = (await import("svelte-simple-modal")).default;
  });
</script>
<svelte:component this={Modal} styleCloseButton={{ cursor: 'pointer' }}>
  <FileBrowserContent {...$$props} on:message/>
</svelte:component>