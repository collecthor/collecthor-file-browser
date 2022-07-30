<script lang="ts">
  import { createEventDispatcher, getContext } from "svelte";
  import NameInputModal from "./NameInputModal.svelte";
  export let currentPath: string;
  export let baseurl: string;
  export let fileNamePromise: Promise<string> | null = null;
  export let folderNamePromise: Promise<string> | null = null;
  let fileUpload: HTMLInputElement;

  const dispatch = createEventDispatcher();
  const { open, close } = getContext('simple-modal');

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
  };

  const newFolder = () => {
    let namePromise;
    if (folderNamePromise !== null) {
      namePromise = folderNamePromise;
    } else {
      namePromise = new Promise((resolve: (name: string) => void) => {
        open(NameInputModal, {
          title: 'Folder name',
          namePicked: resolve,
        });
      });
    }

    namePromise.then(async (name) => {
      const body= {
        path: currentPath,
        name: name,
        type: "folder",
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
      close();
    });
  };

  const newFile = () => {
    let namePromise;
    if (fileNamePromise !== null) {
      namePromise = fileNamePromise;
    } else {
      namePromise = new Promise((resolve: (name: string) => void) => {
        open(NameInputModal, {
          title: 'Folder name',
          namePicked: resolve,
        });
      });
    }

    namePromise.then(async (name) => {
      const body= {
        path: currentPath,
        name: name,
        type: "file",
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
      close();
    });
  }

</script>

<div class="filebrowser-controls">
  <input style="display: none;" type="file" bind:this={fileUpload} on:change={()=>onFileSelected()} />
  <button class="filebrowser-button" on:click={() => fileUpload.click()}>Add file</button>
  <button class="filebrowser-button" on:click={() => newFolder()}>New folder</button>
  <button class="filebrowser-button" on:click={() => newFile()}>New file</button>
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