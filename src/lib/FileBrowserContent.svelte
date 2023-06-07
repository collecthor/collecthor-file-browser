<script lang="ts">
  import PathBar from "./PathBar.svelte";
  import FileRow from "./FileRow.svelte";
  import Delete from "svelte-material-icons/Delete.svelte";
  import Download from "svelte-material-icons/Download.svelte";
  import Eye from "svelte-material-icons/Eye.svelte";
  import type ContextMenuAction from "$lib/interfaces/ContextMenuAction";
  import { createEventDispatcher, getContext, setContext } from "svelte";
  import BrowserControls from "./BrowserControls.svelte";
  import ErrorModal from "./ErrorModal.svelte";
  import ConfirmPickModal from "./ConfirmPickModal.svelte";
  import type { external } from "$lib/interfaces/api.generated.d.ts";

  import type ApiClient from "$lib/interfaces/ApiClient";
  import FileManager from "./FileManager";
  import DownloadAction from "./actions/DownloadAction";
  import DeleteAction from "./actions/DeleteAction";

  export let client: ApiClient;
  export let openFile: (file: Node) => void;
  export let itemSelected: (file: Node) => void;
  export let type: "browser"|"picker" = "browser";
  export let actions: ContextMenuAction[] = [];

  type Path = external["models/Path.json"];
  type Node = external["models/Node.json"];
  const allowedTypes = ["browser", "picker"];
  const dispatch = createEventDispatcher();
  const { open, close } = getContext("simple-modal");



  if (!allowedTypes.includes(type)) {
    throw new Error(
      `${type} is not a valid FileBrowser type(${allowedTypes.join(", ")})`
    );
  }

  let displayBrowser = true;

  const fileManager = new FileManager(client);

  const currentPathContents = fileManager.getContents();


  const errorHandler = (errorData: Error) => {
    open(ErrorModal, {
      title: errorData.status,
      message: errorData.detail,
      type: "error",
    });
  };

  const dragStart = (event: DragEvent) => {
    event.preventDefault();
    (event.target as Element).classList.add("file-dragging");
  };

  const dragEnd = (event: DragEvent) => {
    event.preventDefault();
    (event.target as Element).classList.remove("file-dragging");
  };

  const fileDropped = (event: DragEvent) => {
    (event.target as Element).classList.remove("file-dragging");
    for (const file of event.dataTransfer?.files ?? []) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (reader.result) {
          const dataUrl = reader.result.toString();
          await uploadFile(file.name, dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
    event.preventDefault();
  };

  const uploadFile = async (name: string, dataUrl: string) => {
    try {
      const data = await client.createFile({
        path: currentPath,
        name: name,
        mimeType: "file",
        uri: dataUrl,
      });
      pathContents = [...pathContents, data];
    } catch (error) {
      dispatch("error", error);
    }
  };



  const itemClicked = (event: CustomEvent<Node>) => {

    const item = event.detail;
    console.log('itemClicked', item);
    if (item.mimeType === "inode/directory") {
      fileManager.goToNode(item);
    } else {
      if (type === "picker") {
        open(ConfirmPickModal, {
          pickedFile: item,
          confirmed: itemSelected
        });
      }
    }
  };

  const closeOptionDialogs = (event: MouseEvent) => {
    if (
      event.target instanceof Element &&
      !event.target.matches(".show-options")
    ) {
      Array.from(document.getElementsByClassName("dropdown")).forEach(
        (dropdown) => {
          dropdown.classList.remove("show");
        }
      );
    }
  };

  const defaultActions: ContextMenuAction[] = [
    new DeleteAction(),
    new DownloadAction(),

  ];

</script>

<svelte:window on:click={(event) => closeOptionDialogs(event)} />

{#if displayBrowser}
  <div
    class="file-browser"
    on:dragover={dragStart}
    on:dragenter={dragStart}
    on:dragleave={dragEnd}
    on:drop={fileDropped}
  >
    <div class="control-wrapper">
    <PathBar fileManager={fileManager} />
      <span class="divider"></span>
    <BrowserControls
      {fileManager}
      {client}
    />
    </div>
    <div class="table-wrapper">
    <table class="file-table">
      <tr>
        <th class="icon-column"></th>
        <th class="name-column left-aligned-column">Name</th>
        <th class="size-column left-aligned-column">Size</th>
        <th class="dropdown-column"></th>
      </tr>
      {#each $currentPathContents as item}
        <FileRow
          {item}
          on:itemClicked={itemClicked}
          on:itemSelected={(event) => itemSelected(event.detail)}
          actions={[...defaultActions, ...actions]}
        />
      {/each}
      <tr class="file-table-footer">
        <td></td>
        <td>Count: {$currentPathContents.length}</td>
      </tr>
    </table>
    </div>
  </div>
{:else}
  <div class="file-browser">
    <p>
      Could not reach file server. Check your internet connection and try again.
    </p>
  </div>
{/if}

<style lang="scss">
  :root {
    --ch-blue: #71cbf4;
    --ch-purple: #2d3367;
    --ch-orange: #f39200;
    --ch-red: #FF6B6B;

    --ch-dark-blue: #00aeea;
    --ch-dark-purple: #21244a;
    --ch-dark-orange: #ed6b06;
    --ch-dark-red: #FF3939;

    --small-column: 36px;
    --name-column: 100%;
    --size-column: 150px;
  }

  .file-browser {
    font-family: "Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif;
    container-type: inline-size;
    container-name: filebrowser;

    &:global(.file-dragging) {
      border: 1px solid black;
    }

    .control-wrapper {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 8px 0;

      .divider {
        width: 16px;
        margin-right: 16px;
        border-right: 1px solid var(--ch-orange);
      }
    }

    .table-wrapper {
      max-height: 500px;
      overflow-y: scroll;
    }

    table.file-table {
      border-collapse: separate;
      border-spacing: 0;
      width: 100%;
      position: relative;

      th {
        background: white;
        position: sticky;
        top: 0;
        z-index: 2;
        border-bottom: 1px solid var(--ch-orange);
      }

      :global {
        .icon-column {
          min-width: var(--small-column);
          color: var(--ch-purple);
        }

        .name-column {
          min-width: var(--name-column);
        }

        .size-column {
          min-width: var(--size-column);
        }

        .dropdown-column {
          min-width: var(--small-column);
        }
      }

      .left-aligned-column {
        text-align: left;
        padding-left: 8px;
      }

      th {
        padding: 8px 8px 4px 8px;
      }

      th {
        border-bottom: 1px solid var(--ch-orange);
        border-spacing: 0;
        &:not(:first-child) {
          border-left: 1px solid var(--ch-orange);
        }
      }

      .file-table-footer {
        padding-top: 1rem;
      }
    }
  }

  :global {
    @container filebrowser (max-width: 1000px) {
      .file-browser {
        .control-wrapper {
          margin: 0;

          .divider {
            border-right: none !important;
            border-bottom: 1px solid var(--ch-orange);
            width: 100% !important;
            margin: 5px 0 8px 0 !important;
          }

          .filebrowser-controls {
            margin: 4px 0 8px auto;
          }
        }
      }
    }
  }
</style>
