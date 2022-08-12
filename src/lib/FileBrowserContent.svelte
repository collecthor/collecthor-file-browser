<script lang="ts">
  import PathBar from "./PathBar.svelte";
  import FileRow from "./FileRow.svelte";
  import Delete from "svelte-material-icons/Delete.svelte";
  import Download from "svelte-material-icons/Download.svelte";
  import type ContextMenuAction from "src/interfaces/ContextMenuAction";
  import type BackendFile from "src/interfaces/BackendFile";
  import { createEventDispatcher, getContext } from "svelte";
  import BrowserControls from "./BrowserControls.svelte";
  import ErrorModal from "./ErrorModal.svelte";

  export let baseurl: string;
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
    const data: BackendFile = await response.json();
    pathContents = [...pathContents, data];
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
        console.error("Could not load folder contents");
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
        dispatch("itemSelected", { ...item });
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
        console.log(items);
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
