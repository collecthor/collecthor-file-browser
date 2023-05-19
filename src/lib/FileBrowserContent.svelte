<script lang="ts">
  import PathBar from "./PathBar.svelte";
  import FileRow from "./FileRow.svelte";
  import Delete from "svelte-material-icons/Delete.svelte";
  import Download from "svelte-material-icons/Download.svelte";
  import Eye from "svelte-material-icons/Eye.svelte";
  import type ContextMenuAction from "src/interfaces/ContextMenuAction";
  import type BackendFile from "src/interfaces/BackendFile";
  import type Error from "src/interfaces/Error";
  import { createEventDispatcher, getContext, setContext } from "svelte";
  import BrowserControls from "./BrowserControls.svelte";
  import ErrorModal from "./ErrorModal.svelte";
  import ConfirmPickModal from "./ConfirmPickModal.svelte";

  export let baseurl: string;
  export let openFile: (file: BackendFile) => void;
  export let itemSelected: (file: BackendFile) => void;
  export let type = "browser";
  export let basePath = "/";
  export let actions: ContextMenuAction[] = [];

  const allowedTypes = ["browser", "picker"];
  const dispatch = createEventDispatcher();
  const { open, close } = getContext("simple-modal");

  if (!allowedTypes.includes(type)) {
    throw new Error(
      `${type} is not a valid FileBrowser type(${allowedTypes.join(", ")})`
    );
  }

  let displayBrowser = true;

  let currentPath = basePath;
  $: pathContents = [];
  $: if (currentPath) {
    fetchFilesForPath(currentPath);
  }

  const errorHandler = (errorData: Error) => {
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
    for (const file of event.dataTransfer.files) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target.result.toString();
        await uploadFile(file.name, dataUrl);
      };
      reader.readAsDataURL(file);
    }
    event.preventDefault();
  };

  const uploadFile = async (name: string, dataUrl: string) => {
    const body = {
      path: currentPath,
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
    const data: BackendFile | Error = await response.json();
    if (response.status === 200) {
      pathContents = [...pathContents, data];
    } else {
      errorHandler(data as Error);
    }
  };

  const fetchFilesForPath = async (path: string) => {
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
        pathContents = data;
      } else {
        errorHandler(data as Error);
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

  const setPath = (event) => {
    currentPath = event.detail.path;
  };

  const itemClicked = (event) => {
    const item = event.detail as BackendFile;
    if (item.type === "folder") {
      currentPath = `${item.path}/${item.filename}`;
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
    pathContents = event.detail as BackendFile[];
  };

  const defaultActions: ContextMenuAction[] = [
    {
      name: "Delete",
      icon: Delete,
      action: (item: BackendFile, items: BackendFile[]) => {
        return items.filter(
          (i) => i.filename !== item.filename && i.path !== item.path
        );
      },
      filter: ["file", "folder"],
    },
    {
      name: "Download",
      icon: Download,
      action: (item: BackendFile, items: BackendFile[]) => {
        const linkElement = document.createElement("a");
        const url = "happytechnology.png";
        // const url = `/${currentPath}/${item.filename}`;
        linkElement.href = url;
        linkElement.setAttribute("download", "");
        linkElement.style.display = "none";
        document.body.appendChild(linkElement);
        linkElement.click();
        linkElement.remove();
        return items;
      },
      filter: ["file"],
    },
    {
      name: "Open",
      icon: Eye,
      action: (item: BackendFile, items: BackendFile[]) => {
        openFile(item);
        return items;
      },
      filter: ["file"],
    },
  ];

  fetchFilesForPath(currentPath);
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
      {currentPath}
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
      .file-browser .control-wrapper {
        margin: 0;

        .divider {
          border-right: none;
          border-bottom: 1px solid var(--ch-orange);
          width: 100%;
          margin: 5px 0 8px 0;
        }

        .filebrowser-controls {
          margin: 4px 0 8px auto;
        }

        .path-bar {
          width: 100%;
        }
      }
    }
  }
</style>
