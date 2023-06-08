<script lang="ts">
  import type { Context } from "svelte-simple-modal";
  import NameInputModal from "./NameInputModal.svelte";

  import type FileManager from "./FileManager";

  export let fileManager: FileManager;
  export let fileNamePromise: Promise<string> | null = null;
  export let folderNamePromise: Promise<string> | null = null;
  let fileUpload: HTMLInputElement;

  export let modalContext: Context;




  const onFileSelected = () => {
    if (fileUpload.files && fileUpload.files.length > 0) {
      const file = fileUpload.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        if (!reader.result) {
          return;
        }
        fileManager.createFile({
          path: fileManager.generatePathForFileName(file.name),
          name: file.name,
          mimeType: file.type,
          uri: reader.result.toString(),
        });
      }
    }
  };

  const newFolder = async () => {
    let namePromise: Promise<string>;
    if (folderNamePromise !== null) {
      namePromise = folderNamePromise;
    } else {
      namePromise = new Promise((resolve: (name: string) => void) => {
        modalContext.open(NameInputModal, {
          title: 'Folder name',
          namePicked: resolve,
        });
      });
    }

    const name = await namePromise;

    fileManager.createFile({
      path: fileManager.generatePathForFileName(name),
      name: name,
      mimeType: "inode/directory",
      uri: 'data:text/plain;base64,dGVzdCBmaWxl'
    });
    modalContext.close();
  };

  const newFile = async() => {
    let namePromise: Promise<string>;
    if (fileNamePromise !== null) {
      namePromise = fileNamePromise;
    } else {
      namePromise = new Promise((resolve: (name: string) => void) => {
        modalContext.open(NameInputModal, {
          title: 'File name',
          namePicked: resolve,
        });
      });
    }

    const name = await namePromise;
    console.log("Currentpath:", fileManager.getCurrentPathString());
    fileManager.createFile({
      path: fileManager.generatePathForFileName(name),
      name: name,
      mimeType: "application/text",
      uri: 'data:text/plain;base64,dGVzdCBmaWxl'
    });
    modalContext.close();
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
