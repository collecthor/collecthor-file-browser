<script lang="ts">
	import NameInputModal from './NameInputModal.svelte';
	import type FileManager from './FileManager';
	import 'winbox/src/css/winbox.css';
	import WinBox from 'winbox/src/js/winbox';
	import { mount, unmount } from 'svelte';

	interface Props {
		fileManager: FileManager;
	}

	let { fileManager }: Props = $props();
	let fileUpload = $state<HTMLInputElement>();

	const extensionToMime: Record<string, string> = {
		js: 'text/javascript',
		css: 'text/css',
		html: 'text/html',
		json: 'application/json',
		txt: 'text/plain'
	};

	const onFileSelected = () => {
		if (fileUpload && fileUpload.files && fileUpload.files.length > 0) {
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
					uri: reader.result.toString()
				});
			};
		}
	};

	const newFolder = async () => {
		const winBox = new WinBox('Create folder', {});
		const namePromise = new Promise((resolve: (name: string) => void) => {
			const inputModal = mount(NameInputModal, {
				target: winBox.body,
				props: {
					title: 'Folder name',
					namePicked: resolve
				}
			});
			winBox.onclose = () => {
				unmount(inputModal);
				return false;
			};
		});

		const name = await namePromise;

		fileManager.createFile({
			path: fileManager.generatePathForFileName(name),
			name: name,
			mimeType: 'inode/directory',
			uri: 'data:text/plain;base64,dGVzdCBmaWxl'
		});

		winBox.close();
	};

	const newFile = async () => {
		const winBox = new WinBox('Create file', {});
		const namePromise = new Promise((resolve: (name: string) => void) => {
			const inputModal = mount(NameInputModal, {
				target: winBox.body,
				props: {
					title: 'File name',
					namePicked: resolve
				}
			});
			winBox.onclose = () => {
				unmount(inputModal);
				return false;
			};
		});

		const name = await namePromise;
		console.log('Currentpath:', fileManager.getCurrentPathString());
		fileManager.createFile({
			path: fileManager.generatePathForFileName(name),
			name: name,
			mimeType: extensionToMime[name.split('.').pop() ?? 'txt'] ?? 'application/octet-stream',
			uri: 'data:text/plain;base64,dGVzdCBmaWxl'
		});
		winBox.close();
	};
</script>

<div class="filebrowser-controls">
	<input
		style="display: none;"
		type="file"
		bind:this={fileUpload}
		onchange={() => onFileSelected()}
	/>
	<button type="button" class="filebrowser-button" onclick={() => fileUpload?.click()}
		>Add file</button
	>
	<button type="button" class="filebrowser-button" onclick={() => newFolder()}>New folder</button>
	<button type="button" class="filebrowser-button" onclick={() => newFile()}>New file</button>
</div>

<style lang="css">
	.filebrowser-button {
		padding: 8px 20px;
		border: 1px solid var(--ch-orange);
		background-color: transparent;
		border-radius: 4px;
		color: var(--ch-dark-purple);
	}

	.filebrowser-button:hover {
		cursor: pointer;
		background-color: var(--ch-orange);
		color: white;
	}
</style>
