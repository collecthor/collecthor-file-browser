<script lang="ts">
  import PathBar from "./PathBar.svelte";
  import FileRow from "./FileRow.svelte";
  import Modal from "svelte-simple-modal";
  import Delete from "svelte-material-icons/Delete.svelte";
  import Download from "svelte-material-icons/Download.svelte";
  import type ContextMenuAction from "src/interfaces/ContextMenuAction";
  import type BackendFile from "src/interfaces/BackendFile";
  import { createEventDispatcher } from "svelte";
  import BrowserControls from "./BrowserControls.svelte";

  export let baseurl: string;
  export let type = "browser";
  export let basePath = "/";
  export let actions: ContextMenuAction[] = [];

  const allowedTypes = ["browser", "picker"];
  const dispatch = createEventDispatcher();

  if (!allowedTypes.includes(type)) {
    throw new Error(
      `${type} is not a valid FileBrowser type(${allowedTypes.join(", ")})`
    );
  }

  let currentPath = basePath;
  $: pathContents = [];
  $: if (currentPath) {
    fetchFilesForPath(currentPath);
  }

  const fetchFilesForPath = async (path: string) => {
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
        return items.filter((i) => i.filename !== item.filename && i.path !== item.path);
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
<Modal>
  <div class="file-browser">
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
</Modal>

<style lang="scss">
  .file-browser {
    font-family: "Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif;
    table {
      border-collapse: collapse;
      th {
        border-bottom: 1px solid black;
        padding: 0;
        border-spacing: 0;
        &:not(:first-child):not(:last-child) {
          border-left: 1px solid black;
          border-right: 1px solid black;
        }
      }
    }
  }
</style>
