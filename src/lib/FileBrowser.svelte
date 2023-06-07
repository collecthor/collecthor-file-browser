<script lang="ts">
  import type ContextMenuAction from "./interfaces/ContextMenuAction";


  import { Modal, type Context, type Modal as ModalType } from "svelte-simple-modal";
  import FileBrowserContent from "$lib/FileBrowserContent.svelte";
  import ErrorModal from "./ErrorModal.svelte";
  import type FileManager from "$lib/FileManager";
  import { onMount } from 'svelte';

  export let actions: ContextMenuAction[] = [];

  export let type: "browser"|"picker" = "browser";
  export let fileManager: FileManager;

  export let modalContext: Context|null = null;

  let manualWrap: boolean = false;

  if (modalContext === null) {
    manualWrap = true;
  }
  onMount(async () => {


  });

  fileManager.eventRegistry().on("error", (errorData) => {
    if (modalContext) {
      modalContext.open(ErrorModal, {
        title: errorData.statusText,
        message: JSON.stringify(errorData.detail),
        type: "error",
      });

    }
    console.error(errorData);
  });

  function setModalContext<T>(key: any, value: T): T {
    if (key === 'simple-modal') {
      // ugly, no strict type check
      modalContext = <Context>value;
    }
    return value;
  }
</script>

{#if manualWrap}
<Modal
  styleCloseButton={{ cursor: 'pointer' }}
  setContext={setModalContext}
  styleContent={{ backgroundColor: 'pink'}}
 >
 {#if modalContext}
 <FileBrowserContent
    {modalContext}
    {type}
    {actions}
    {fileManager}
  />
  {/if}
</Modal>
{:else}
  {#if modalContext}
    <FileBrowserContent
    {modalContext}
    {type}
    {actions}
    {fileManager}
    />
  {/if}
 {/if}

