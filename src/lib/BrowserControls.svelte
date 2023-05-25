<script lang="ts">
  import { createEventDispatcher, getContext } from "svelte";
  import NameInputModal from "./NameInputModal.svelte";
  import type FileBrowserError from "$lib/interfaces/FileBrowserError";
  import { uploadFile } from "$lib/helpers/uploadFile";

  export let currentPath: string;
  export let baseurl: string;
  export let fileNamePromise: Promise<string> | null = null;
  export let folderNamePromise: Promise<string> | null = null;
  let fileUpload: HTMLInputElement;

  const dispatch = createEventDispatcher();
  const { open, close } = getContext('simple-modal');
  const errorHandler: (error) => void = getContext('errorHandler');

  const onFileSelected = () => {
    if (fileUpload.files instanceof FileList) {
      const file = fileUpload.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        if (reader.result) {
          const dataUrl = reader.result.toString();
          const newFile = await uploadFile(baseurl, currentPath, file.name, file.type, dataUrl, errorHandler);
          if (newFile) {
            dispatch('fileAdded', {...newFile});
          }
        }
      };
    }
  };

  /**
   * TODO: This method has not been verified / typed / checked as it is currently unsupported functionality
   */
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
        errorHandler(data as FileBrowserError);
      }
    });
  };

  /**
   * TODO: This method has not been verified / typed / checked as it is currently unsupported functionality
   */
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
        errorHandler(data as FileBrowserError);
      }
    });
  }

</script>

<div class="filebrowser-controls">
  <input style="display: none;" type="file" bind:this={fileUpload} on:change={()=>onFileSelected()} />
  <button class="filebrowser-button" on:click={() => fileUpload.click()}>Add file</button>
<!--  Currently disabled -->
<!--  <button class="filebrowser-button" on:click={() => newFolder()}>New folder</button>-->
<!--  <button class="filebrowser-button" on:click={() => newFile()}>New file</button>-->
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