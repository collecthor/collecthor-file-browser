<script lang="ts">
	/**
	 * We use these imports because vitest deals very poorly with the proper way of importing it;
	 * it takes 2 minutes in its transformation step if we use
	 * import { Application } from '@collecthor/svelte-material-icons'
	 */
	import Application from '../../node_modules/@collecthor/svelte-material-icons/dist/generated/Application.svelte';
	import FileDocumentOutline from '../../node_modules/@collecthor/svelte-material-icons/dist/generated/FileDocumentOutline.svelte';
	import FileImage from '../../node_modules/@collecthor/svelte-material-icons/dist/generated/FileImage.svelte';
	import FilePdfBox from '../../node_modules/@collecthor/svelte-material-icons/dist/generated/FilePdfBox.svelte';
	import Folder from '../../node_modules/@collecthor/svelte-material-icons/dist/generated/Folder.svelte';
	import MusicBox from '../../node_modules/@collecthor/svelte-material-icons/dist/generated/MusicBox.svelte';
	import ProgressUpload from '../../node_modules/@collecthor/svelte-material-icons/dist/generated/ProgressUpload.svelte';
	import Video from '../../node_modules/@collecthor/svelte-material-icons/dist/generated/Video.svelte';
	import File from '../../node_modules/@collecthor/svelte-material-icons/dist/generated/File.svelte';

	export let mimeType: string;

	export let iconUrl: string | null;
</script>

{#if iconUrl}
	<img src={iconUrl} alt="File icon" />
{:else if mimeType.endsWith(';optimistic')}
	<ProgressUpload />
{:else if mimeType.startsWith('video/')}
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
{:else}
	<File />
{/if}
