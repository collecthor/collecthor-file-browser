<script lang="ts">
	import PathBar from './PathBar.svelte';
	import FileRow from './FileRow.svelte';
	import type ContextMenuAction from '$lib/interfaces/ContextMenuAction';
	import BrowserControls from './BrowserControls.svelte';

	import type FileManager from '$lib/FileManager';

	import DownloadAction from './actions/DownloadAction';
	import DeleteAction from './actions/DeleteAction';
	import EditAction from './actions/EditAction';
	import type { Context } from 'svelte-simple-modal';
	import CopyUrlAction from './actions/CopyUrlAction';

	export let type: 'browser' | 'picker' = 'browser';
	export let actions: ContextMenuAction[] = [];
	export let modalContext: Context;

	let displayBrowser = true;

	export let fileManager: FileManager;

	const currentPathContents = fileManager.getContents();
	const status = fileManager.getStatus();

	const dragStart = (event: DragEvent) => {
		event.preventDefault();
		(event.target as Element).classList.add('file-dragging');
	};

	const dragEnd = (event: DragEvent) => {
		event.preventDefault();
		(event.target as Element).classList.remove('file-dragging');
	};

	const fileDropped = (event: DragEvent) => {
		(event.target as Element).classList.remove('file-dragging');
		for (const file of event.dataTransfer?.files ?? []) {
			const reader = new FileReader();
			reader.onload = async () => {
				if (reader.result) {
					fileManager.createFile({
						path: fileManager.generatePathForFileName(file.name),
						name: file.name,
						mimeType: file.type,
						uri: reader.result.toString()
					});
				}
			};
			reader.readAsDataURL(file);
		}
		event.preventDefault();
	};

	const closeOptionDialogs = (event: MouseEvent) => {
		if (event.target instanceof Element && !event.target.matches('.show-options')) {
			Array.from(document.getElementsByClassName('dropdown')).forEach((dropdown) => {
				dropdown.classList.remove('show');
			});
		}
	};

	const defaultActions: ContextMenuAction[] = [
		new DeleteAction(),
		new DownloadAction(),
		new EditAction(),
		new CopyUrlAction()
	];
</script>

<svelte:window on:click={(event) => closeOptionDialogs(event)} />

{#if displayBrowser}
	<div
		class="file-browser"
		on:dragover={dragStart}
		on:dragenter={dragStart}
		on:dragleave={dragEnd}
		on:drop={fileDropped}
		role="complementary"
	>
		<div class="control-wrapper">
			<PathBar {fileManager} />
			<span class="divider" />
			<BrowserControls {modalContext} {fileManager} />
		</div>
		<div class="status">
			{$status}
		</div>
		<div class="table-wrapper">
			<table class="file-table">
				<tr>
					<th class="icon-column" />
					<th class="name-column left-aligned-column">Name</th>
					<th class="size-column left-aligned-column">Size</th>
					<th class="size-column left-aligned-column">Mime</th>
					<th class="dropdown-column" />
				</tr>
				{#each $currentPathContents as item}
					<FileRow
						{item}
						pickOnSingleClick={type === 'picker'}
						{fileManager}
						actions={[...defaultActions, ...actions]}
					/>
				{/each}
				<tr class="file-table-footer">
					<td />
					<td>Count: {$currentPathContents.length}</td>
				</tr>
			</table>
		</div>
	</div>
{:else}
	<div class="file-browser">
		<p>Could not reach file server. Check your internet connection and try again.</p>
	</div>
{/if}

<style lang="scss">
	:root {
		--ch-blue: #71cbf4;
		--ch-purple: #2d3367;
		--ch-orange: #f39200;
		--ch-red: #ff6b6b;

		--ch-dark-blue: #00aeea;
		--ch-dark-purple: #21244a;
		--ch-dark-orange: #ed6b06;
		--ch-dark-red: #ff3939;

		--small-column: 36px;
		--name-column: 100%;
		--size-column: 150px;
	}

	.file-browser {
		min-height: 400px;
		font-family: 'Helvetica Neue', Roboto, Arial, 'Droid Sans', sans-serif;
		container-type: inline-size;
		display: flex;
		flex-direction: column;

		&:global(.file-dragging) {
			border: 1px solid black;
		}

		.control-wrapper {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			margin: 8px 0;

			.divider {
				width: 16px;
				margin-right: 16px;
				border-right: 1px solid var(--ch-orange);
			}
		}

		.table-wrapper {
			flex-grow: 1;
			overflow-y: auto;
		}

		table.file-table {
			border-collapse: separate;
			border-spacing: 0;
			width: 100%;
			height: 100%;
			position: relative;

			th {
				background: white;
				position: sticky;
				top: 0;
				z-index: 2;
				border-bottom: 1px solid var(--ch-orange);
			}

			:global(.icon-column) {
				min-width: var(--small-column);
				color: var(--ch-purple);
			}

			:global(.name-column) {
				min-width: var(--name-column);
			}

			:global(.size-column) {
				min-width: var(--size-column);
			}

			:global(.dropdown-column) {
				min-width: var(--small-column);
			}

			:global(.left-aligned-column) {
				text-align: left;
				padding-left: 8px;
			}

			th {
				padding: 8px 8px 4px 8px;
			}

			th {
				border-bottom: 1px solid var(--ch-orange);
				border-spacing: 0;
				&:not(:first-child) {
					border-left: 1px solid var(--ch-orange);
				}
			}

			.file-table-footer {
				padding-top: 1rem;
			}
		}
	}

	@container (max-width: 1000px) {
		.file-browser {
			.control-wrapper {
				margin: 0;

				.divider {
					border-right: none !important;
					border-bottom: 1px solid var(--ch-orange);
					width: 100% !important;
					margin: 5px 0 8px 0 !important;
				}

				.filebrowser-controls {
					margin: 4px 0 8px auto;
				}
			}
		}
	}
</style>
