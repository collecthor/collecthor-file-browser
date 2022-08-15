<script lang="ts">
  export let fileType: string;
  import File from 'svelte-material-icons/File.svelte';
  import FilePdfBox from 'svelte-material-icons/FilePdfBox.svelte';
  import FileImage from 'svelte-material-icons/FileImage.svelte';
  import FileDocumentOutline from 'svelte-material-icons/FileDocumentOutline.svelte';
  import Video from 'svelte-material-icons/Video.svelte';
  import MusicBox from 'svelte-material-icons/MusicBox.svelte';
  import Application from 'svelte-material-icons/Application.svelte';

</script>
{#if fileType.startsWith('video/')}
  <Video />
{:else if fileType.startsWith('text/')}
  <FileDocumentOutline />
{:else if fileType === 'application/pdf'}
  <FilePdfBox />
{:else if fileType.startsWith('application/')}
  <Application />
{:else if fileType.startsWith('audio/')}
  <MusicBox />
{:else if fileType.startsWith('image/')}
  <FileImage />
{:else }
  <File />
{/if}