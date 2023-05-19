<script lang="ts">
  import PathBar from "./PathBar.svelte";
  import FileRow from "./FileRow.svelte";
  import Delete from "svelte-material-icons/Delete.svelte";
  import Download from "svelte-material-icons/Download.svelte";
  import Eye from "svelte-material-icons/Eye.svelte";
  import type ContextMenuAction from "$lib/interfaces/ContextMenuAction";
  import type FileError from "$lib/interfaces/FileError";
  import type { Node } from "$lib/generated/Node";
  import { createEventDispatcher, getContext, setContext } from "svelte";
  import BrowserControls from "./BrowserControls.svelte";
  import ErrorModal from "./ErrorModal.svelte";
  import ConfirmPickModal from "./ConfirmPickModal.svelte";
  import type FilePath from "$lib/interfaces/FilePath";

  export let baseurl: string;
  export let openFile: (file: Node) => void;
  export let itemSelected: (file: Node) => void;
  export let type: "browser"|"picker" = "browser";
  export let basePath = "/";
  export let actions: ContextMenuAction[] = [];

  const allowedTypes = ["browser", "picker"];
  const dispatch = createEventDispatcher();
  const { open, close } = getContext("simple-modal");

  if (!allowedTypes.includes(type)) {
    throw new Error(`${type} is not a valid FileBrowser type(${allowedTypes.join(", ")})`);
  }

  let displayBrowser = true;

  let currentPath: FilePath = {
    path: basePath,
    items: []
  };

  let pathContents: Node[] = [];
  $: fetchFilesForPath(currentPath.path);

  const errorHandler = (errorData: FileError) => {
    open(ErrorModal, {
      title: errorData.status,
      message: errorData.detail,
      type: "error",
    });
  };

  setContext("errorHandler", errorHandler);

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
    const body = {
      path: currentPath.path,
      name: name,
      type: "file",
      content: dataUrl,
    };
    const response = await fetch(`${baseurl}/create`, {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: Node | Error = await response.json();
    if (response.status === 200) {
      /**
       * TODO: Make sure data is actually of type Node
       */
      pathContents = [...pathContents, data as Node];
    } else {
      /**
       * TODO: Make sure data is actually of type FileError
       */
      errorHandler(data as FileError);
    }
  };

  const fetchFilesForPath = async (path: string) => {
    console.log("Fetching for path", path);
    try {
      const response = await fetch(`${baseurl}/view`, {
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify({
          path,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        /**
         * TODO: Make sure data is actually of type Node[]
         */
        pathContents = data;
      } else {
        /**
         * TODO: Make sure data is actually of type FileError
         */
        errorHandler(data as FileError);
      }
    } catch (e) {
      open(ErrorModal, {
        title: "File server unreachable",
        message:
          "Unable to reach file server. Please check your internet connection and try again.",
        type: "error",
      });
      displayBrowser = false;
    }
  };

  const setPath = (event: CustomEvent<FilePath>) => {
    /**
     * TODO: Make sure detail is actually of type FilePath
     */
    currentPath = event.detail;
  };

  const itemClicked = (event: CustomEvent<Node>) => {
    /**
     * TODO: Make sure detail is actually of type Node
     */
    const item = event.detail;

    if (item.mimeType === "inode/directory") {
      currentPath.path = `${item.path}`;
      currentPath.items.push(item);

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

  const itemsUpdated = (event) => {
    pathContents = event.detail as Node[];
  };

  const defaultActions: ContextMenuAction[] = [
    {
      name: "Delete",
      icon: Delete,
      action: async (targetItem: Node, pathContents: Node[]): Promise<Node[]> => {
        await fetch(`${baseurl}/delete`, {
            method: "POST",
            credentials: "same-origin",
            body: JSON.stringify({
              path: targetItem.path,
            }),
            headers: {
              "Content-Type": "application/json",
            }
        })

        return pathContents.filter(item => item.path !== targetItem.path);
      },
      validFor: () => true
    },
    {
      name: "Download",
      icon: Download,
      action: async (item: Node, pathContents: Node[]): Promise<Node[]> => {
        /**
         * @todo implement download call
         */
        const response = await fetch('', /** todo*/)
        const blob = await response.blob();

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = item.name;
        link.click();
        return pathContents;
      },
      validFor: (item: Node) => item.mimeType !== 'inode/directory'
    },
    {
      name: "Open",
      icon: Eye,
      action: async (item: Node, pathContents: Node[]): Promise<Node[]> => {
        openFile(item);
        return pathContents;
      },
      validFor: (item: Node) => item.mimeType !== 'inode/directory'
    },
  ];

  fetchFilesForPath(currentPath.path);
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
    <PathBar path={currentPath} on:pathItemClicked={setPath} />
      <span class="divider"></span>
    <BrowserControls
      currentPath={currentPath.path}
      {baseurl}
      on:fileAdded={(e) => (pathContents = [...pathContents, e.detail])}
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
      {#each pathContents as item}
        <FileRow
          {item}
          items={pathContents}
          on:itemClicked={itemClicked}
          on:updateItems={itemsUpdated}
          on:itemSelected={(event) => itemSelected(event.detail)}
          actions={[...defaultActions, ...actions]}
        />
      {/each}
      <tr class="file-table-footer">
        <td></td>
        <td>Count: {pathContents.length}</td>
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
