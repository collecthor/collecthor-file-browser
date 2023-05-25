<script lang="ts">
  import File from 'svelte-material-icons/File.svelte';
  import FilePdfBox from 'svelte-material-icons/FilePdfBox.svelte';
  import FileImage from 'svelte-material-icons/FileImage.svelte';
  import FileDocumentOutline from 'svelte-material-icons/FileDocumentOutline.svelte';
  import Video from 'svelte-material-icons/Video.svelte';
  import MusicBox from 'svelte-material-icons/MusicBox.svelte';
  import Application from 'svelte-material-icons/Application.svelte';
  import Folder from 'svelte-material-icons/Folder.svelte';

  export let mimeType: string;

  export let iconUrl: string | null;

</script>

{#if iconUrl }
  <img src={iconUrl} alt="File icon">
{:else}
  {#if mimeType.startsWith('video/')}
    <Video />
  {:else if mimeType.startsWith('text/')}
    <FileDocumentOutline />
  {:else if mimeType === 'application/pdf'}
    <FilePdfBox />
  {:else if mimeType.startsWith('application/')}
    <Application />
  {:else if mimeType.startsWith('audio/')}
    <MusicBox />
  {:else if mimeType.startsWith('image/')}
    <FileImage />
  {:else if mimeType === 'inode/directory'}
    <Folder />
  {:else }
    <File />
  {/if}
{/if}