<script lang="ts">
  import type BackendFile from "src/interfaces/BackendFile";
  import File from 'svelte-material-icons/File.svelte';
  import FilePdfBox from 'svelte-material-icons/FilePdfBox.svelte';
  import FileImage from 'svelte-material-icons/FileImage.svelte';
  import FileDocumentOutline from 'svelte-material-icons/FileDocumentOutline.svelte';
  import Video from 'svelte-material-icons/Video.svelte';
  import MusicBox from 'svelte-material-icons/MusicBox.svelte';
  import Application from 'svelte-material-icons/Application.svelte';
  export let file: BackendFile;

</script>
{#if file.mimetype.startsWith('video/')}
  <Video />
{:else if file.mimetype.startsWith('text/')}
  <FileDocumentOutline />
{:else if file.mimetype === 'application/pdf'}
  <FilePdfBox />
{:else if file.mimetype.startsWith('application/')}
  <Application />
{:else if file.mimetype.startsWith('audio/')}
  <MusicBox />
{:else if file.mimetype.startsWith('image/')}
  <FileImage />
{:else }
  <File />
{/if}