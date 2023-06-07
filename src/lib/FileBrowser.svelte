<script lang="ts">
    // This component is needed to be able to use the modal from the filebrowsercontent component
  import type ContextMenuAction from "./interfaces/ContextMenuAction";


  import type { Modal as ModalType } from "svelte-simple-modal";
  import FileBrowserContent from "$lib/FileBrowserContent.svelte";
  import { onMount } from 'svelte';

  import type {external } from '$lib/interfaces/api.generated.d.ts';

  import { FetchApiClient } from "./FetchApiClient";
  type Node = external["models/Node.json"];
  export let openFile: (file: Node) => void;
  export let itemSelected: (file: Node) => void;
  export let type: "browser"|"picker" = "browser";
  export let basePath = "";
  export let actions: ContextMenuAction[] = [];


  export let baseUrl = "http://127.0.0.1:3100";
  const client = new FetchApiClient(baseUrl)


  let Modal: typeof ModalType;
  onMount(async () => {
    Modal = (await import("svelte-simple-modal")).default;
  });
</script>
<svelte:component this={Modal} styleCloseButton={{ cursor: 'pointer' }}>
  <FileBrowserContent
    {openFile}
    {itemSelected}
    {type}
    {basePath}
    {actions}
    {client}
    on:message/>
</svelte:component>