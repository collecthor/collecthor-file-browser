<script lang="ts">
  import PathBar from "./PathBar.svelte";
  import FileRow from "./FileRow.svelte";
  import Delete from "svelte-material-icons/Delete.svelte";
  import Download from "svelte-material-icons/Download.svelte";
  import Eye from "svelte-material-icons/Eye.svelte";
  import type ContextMenuAction from "$lib/interfaces/ContextMenuAction";
  import type Error from "$lib/interfaces/Error";
  import type { Node } from "$lib/generated/Node";
  import { createEventDispatcher, getContext, setContext } from "svelte";
  import BrowserControls from "./BrowserControls.svelte";
  import ErrorModal from "./ErrorModal.svelte";
  import ConfirmPickModal from "./ConfirmPickModal.svelte";

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
    throw new Error(
      `${type} is not a valid FileBrowser type(${allowedTypes.join(", ")})`
    );
  }

  let displayBrowser = true;

  let currentPath: string = basePath;

  let pathContents: Node[] = [];
  $: fetchFilesForPath(currentPath);

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

    const data: Node | Error = await response.json();
    if (response.status === 200) {
      pathContents = [...pathContents, data];
    } else {
      errorHandler(data as Error);
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

  const itemClicked = (event: CustomEvent<Node>) => {

    const item = event.detail;
    console.log('itemClicked', item);
    if (item.mimeType === "inode/directory") {
      currentPath = `/${item.path}`;
      console.log("Setting path: ", currentPath);
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
      action: (targetItem: Node, items: Node[]) => {
        /**
         * @todo implement delete call
         */
        return items.filter(item => item.path !== targetItem.path);
      },
      validFor: () => true
    },
    {
      name: "Download",
      icon: Download,
      action: async (item: Node, items: Node[]): Promise<Node[]> => {
        /**
         * @todo implement download call
         */
        const response = await fetch('', /** todo*/)
        const blob = await response.blob();

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = item.name;
        link.click();
        return items;
      },
      validFor: (item: Node) => item.mimeType !== 'inode/directory'
    },
    {
      name: "Open",
      icon: Eye,
      action: async (item: Node, items: Node[]): Promise<Node[]> => {
        openFile(item);
        return items;
      },
      validFor: (item: Node) => item.mimeType !== 'inode/directory'
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
    <PathBar path={currentPath} on:pathItemClicked={setPath} />
    <BrowserControls
      {currentPath}
      {baseurl}
      on:fileAdded={(e) => (pathContents = [...pathContents, e.detail])}
    />
    <table>
      <tr>
        <th /><th>Name</th><th>Size</th><th />
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
      <tr>
        <td />
        <td>Count: {pathContents.length}</td>
      </tr>
    </table>
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
    &:global(.file-dragging) {
      border: 1px solid black;
    }
    table {
      border-collapse: collapse;
      th {
        border-bottom: 2px solid black;
        padding: 0;
        border-spacing: 0;
        &:not(:first-child):not(:last-child) {
          border-left: 2px solid black;
          border-right: 2px solid black;
        }
      }
    }
  }
</style>
