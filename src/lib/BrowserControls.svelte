<script lang="ts">
  import { createEventDispatcher, getContext } from "svelte";
  import NameInputModal from "./NameInputModal.svelte";
  import type Error from "src/interfaces/Error";
  export let currentPath: string;
  export let baseurl: string;
  export let fileNamePromise: Promise<string> | null = null;
  export let folderNamePromise: Promise<string> | null = null;
  let fileUpload: HTMLInputElement;

  const dispatch = createEventDispatcher();
  const { open, close } = getContext('simple-modal');
  const { errorHandler } = getContext('errorHandler');

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
      if (response.status === 200) {
        dispatch('fileAdded', {...data});
      } else {
        errorHandler(data as Error);
      }
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
      if (response.status === 200) {
        dispatch('fileAdded', {...data});
        close();
      } else {
        errorHandler(data as Error);
      }
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
      if (response.status === 200) {
        dispatch('fileAdded', {...data});
        close();
      } else {
        errorHandler(data as Error);
      }
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
      padding: 8px 20px;
      border: 1px solid var(--ch-orange);
      background-color: transparent;
      border-radius: 4px;
      color: var(--ch-dark-purple);

      &:hover {
        cursor: pointer;
        background-color: var(--ch-orange);
        color: white;
      }
    }
  }
</style>