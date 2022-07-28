<script lang="ts">
  import PathBar from "./PathBar.svelte";
  import FileRow from "./FileRow.svelte";
  import Delete from 'svelte-material-icons/Delete.svelte';
  import Download from 'svelte-material-icons/Download.svelte';
  import type ContextMenuAction from "src/interfaces/ContextMenuAction";
  import type BackendFile from "src/interfaces/BackendFile";

  export let baseurl: string;
  export let type: string;
  export let basePath = '/';

  let currentPath = basePath;
  let pathContents = [];
  $: if(currentPath) {
    fetchFilesForPath(currentPath);
  };

  const fetchFilesForPath = async (path: string) => {
    const response = await fetch(`${baseurl}/view`, {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({
        path,
      }),
      headers: {
        'Content-Type': 'application/json',
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
  }

  const closeOptionDialogs = (event: MouseEvent) => {
    if (event.target instanceof Element && !event.target.matches('.show-options')) {
      Array.from(document.getElementsByClassName('dropdown')).forEach(dropdown => {
        dropdown.classList.remove('show');
      });
    }
  }

  const defaultActions: ContextMenuAction[] = [
    {
      name: 'Delete',
      icon: Delete,
      action: (item: BackendFile) => {
      },
      filter: ['file', 'folder'],
    },
    {
      name: 'Download',
      icon: Download,
      action: (item: BackendFile) => {
        const linkElement = document.createElement('a');
        const url = 'happytechnology.png';
        linkElement.href = url;
        linkElement.setAttribute('download', '');
        linkElement.style.display = 'none';
        document.body.appendChild(linkElement);
        linkElement.click();
        linkElement.remove();
      },
      filter: ['file'],
    }
  ]

  fetchFilesForPath(currentPath);
</script>

<svelte:window on:click={event => closeOptionDialogs(event)} />

<div class="file-browser">

  <PathBar path="{currentPath}" on:pathItemClicked={setPath}/>
  <table>
    <tr>
      <th></th><th>Name</th><th>Size</th><th></th>
    </tr>
    {#each pathContents as item}
      <FileRow item={item} on:itemClicked={setPath} actions={defaultActions}/>
    {/each}
    <tr>
      <td></td>
      <td>Count: {pathContents.length}</td>
    </tr>
  </table>
</div>

<style lang="scss">
  .file-browser {
    font-family: "Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif;
  }
</style>