<script lang="ts">
import { createEventDispatcher } from "svelte";


  export let currentPath: string;
  export let baseurl: string;
  let fileUpload: HTMLInputElement;

  const dispatch = createEventDispatcher();

  const onFileSelected = () => {
    const file = fileUpload.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (event) => {
      const body= {
        path: currentPath,
        name: file.name,
        type: "file",
        content: event.target.result,
      };
      const response = await fetch(`${baseurl}/create`, {
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      dispatch('fileAdded', {...data});
    };
  }

</script>

<div class="filebrowser-controls">
  <input style="display: none;" type="file" bind:this={fileUpload} on:change={()=>onFileSelected()} />
  <button class="filebrowser-button" on:click={() => fileUpload.click()}>Add file</button>
  <button class="filebrowser-button">New folder</button>
  <button class="filebrowser-button">New file</button>
</div>

<style lang="scss">
  .filebrowser-controls {
    .filebrowser-button {
      margin: 8px;
      padding: 8px;
      border: none;
    }
  }
</style>