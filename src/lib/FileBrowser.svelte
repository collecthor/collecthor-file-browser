<script lang="ts">
  import PathBar from "./PathBar.svelte";
  import SizeDisplay from "./SizeDisplay.svelte";
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

  const rowClicked = (item) => {
    if (item.type === 'folder') {
      currentPath += `/${item.filename}`;
    }
  }

  fetchFilesForPath(currentPath);
</script>

<div class="file-browser">
  <PathBar path="{currentPath}"/>
  <table>
    <tr>
      <th></th><th>Name</th><th>Size</th><th></th>
    </tr>
    {#each pathContents as item}
      <tr on:click="{rowClicked(item)}">
        {#if item.type === 'file'}
          <td>{item.icon}</td>
        {:else}
          <td>📁</td>
        {/if}
        <td>{item.filename}</td>
        <td><SizeDisplay size="{item.size}" /></td>
      </tr>
    {/each}
    <tr>
      <td></td>
      <td>Count: {pathContents.length}</td>
    </tr>
  </table>
</div>

<style lang="scss">

</style>