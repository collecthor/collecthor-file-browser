<script lang="ts">
	import Application from 'virtual:icons/mdi/application';
	import FileDocumentOutline from 'virtual:icons/mdi/file-document-outline';
	import FileImage from 'virtual:icons/mdi/file-image';
	import FilePdfBox from 'virtual:icons/mdi/file-pdf-box';
	import Folder from 'virtual:icons/mdi/folder';
	import MusicBox from 'virtual:icons/mdi/music-box';
	import ProgressUpload from 'virtual:icons/mdi/progress-upload';
	import Video from 'virtual:icons/mdi/video';
	import File from 'virtual:icons/mdi/file';
	import TextBoxOutline from 'virtual:icons/mdi/text-box-outline';
	import LanguageHtml5 from 'virtual:icons/mdi/language-html5';
	import LanguageCss3 from 'virtual:icons/mdi/language-css3';
	import LanguageJavascript from 'virtual:icons/mdi/language-javascript';
	import CodeJson from 'virtual:icons/mdi/code-json';
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
	<object title="File preview" data={iconUrl}>
		<FileImage />
	</object>
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

<style>
	object {
		max-width: 50px;
		max-height: 50px;
	}
</style>
