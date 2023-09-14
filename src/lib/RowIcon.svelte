<script lang="ts">
	/**
	 * We use these imports because vitest deals very poorly with the proper way of importing it;
	 * it takes 2 minutes in its transformation step if we use
	 * import { Application } from '@collecthor/svelte-material-icons'
	 */
	import Application from '@collecthor/svelte-material-icons/dist/generated/Application.svelte';
	import FileDocumentOutline from '@collecthor/svelte-material-icons/dist/generated/FileDocumentOutline.svelte';
	import FileImage from '@collecthor/svelte-material-icons/dist/generated/FileImage.svelte';
	import FilePdfBox from '@collecthor/svelte-material-icons/dist/generated/FilePdfBox.svelte';
	import Folder from '@collecthor/svelte-material-icons/dist/generated/Folder.svelte';
	import MusicBox from '@collecthor/svelte-material-icons/dist/generated/MusicBox.svelte';
	import ProgressUpload from '@collecthor/svelte-material-icons/dist/generated/ProgressUpload.svelte';
	import Video from '@collecthor/svelte-material-icons/dist/generated/Video.svelte';
	import File from '@collecthor/svelte-material-icons/dist/generated/File.svelte';
	import TextBoxOutline from '@collecthor/svelte-material-icons/dist/generated/TextBoxOutline.svelte';
	import LanguageHtml5 from '@collecthor/svelte-material-icons/dist/generated/LanguageHtml5.svelte';
	import LanguageCss3 from '@collecthor/svelte-material-icons/dist/generated/LanguageCss3.svelte';
	import LanguageJavascript from '@collecthor/svelte-material-icons/dist/generated/LanguageJavascript.svelte';
	import CodeJson from '@collecthor/svelte-material-icons/dist/generated/CodeJson.svelte';
	import type { ComponentType } from 'svelte';

	export let mimeType: string;

	export let iconUrl: string | null;

	const map: Record<string, ComponentType> = {
		'application/javascript': LanguageJavascript,
		'text/javascript': LanguageJavascript,
		'application/text': TextBoxOutline,
		'text/html': LanguageHtml5,
		'text/css': LanguageCss3,
		'application/json': CodeJson
	};
</script>

{#if iconUrl}
	<img src={iconUrl} alt="File icon" />
{:else if map[mimeType]}
	<svelte:component this={map[mimeType]} />
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
