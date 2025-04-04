<script lang="ts">
	import SizeDisplay from './SizeDisplay.svelte';
	import type ContextMenuAction from '$lib/interfaces/ContextMenuAction';
	import RowIcon from './RowIcon.svelte';
	import type { external } from '$lib/interfaces/api.generated.d.ts';
	import type FileManager from '$lib/FileManager';
	type Node = external['models/Node.json'];

	interface Props {
		item: Node;
		actions: ContextMenuAction[];
		fileManager: FileManager;
		pickOnSingleClick?: boolean;
	}

	let { item, actions, fileManager, pickOnSingleClick = true }: Props = $props();

	const optionsClicked = (event: MouseEvent) => {
		event.stopPropagation();
		if (event.target instanceof Element) {
			event.target.parentElement?.classList.toggle('show');
		}
	};

	const itemClicked = (event: MouseEvent) => {
		event.stopPropagation();
		if (event.detail === 1) {
			if (item.mimeType === 'inode/directory') {
				fileManager.goToNode(item);
			} else if (pickOnSingleClick) {
				fileManager.pickFile(item);
			}
		}
	};

	const actionClicked = (event: MouseEvent, action: ContextMenuAction) => {
		if (event.target instanceof Element) {
			event.target.closest('.dropdown')?.classList.remove('show');
		}
		action.action(item, fileManager);
	};
</script>

<tr onclick={itemClicked} class="file-row">
	<td class="text-center-column icon-column">
		<RowIcon iconUrl={item.icon} mimeType={item.mimeType} />
	</td>
	<td class="name-column">{item.name}</td>
	<td class="size-column"><SizeDisplay size={item.size} /></td>
	<td class="size-column">{item.mimeType}</td>
	<td class="dropdown-column text-center-column small-column">
		<div class="dropdown">
			<button type="button" class="show-options" onclick={(event) => optionsClicked(event)}
				>...</button
			>
			<div class="file-options">
				{#each actions as action (action.name)}
					{#if action.validFor(item)}
						<button type="button" onclick={(event) => actionClicked(event, action)}>
							<div>
								<action.icon />
								<span>{action.name}</span>
							</div>
						</button>
					{/if}
				{/each}
			</div>
		</div>
	</td>
</tr>

<style lang="scss">
	:global(.show .file-options) {
		display: block !important;
	}

	td {
		padding: 8px;
	}

	.text-center-column {
		text-align: center;
	}

	.file-row {
		&:hover {
			background-color: rgb(240, 240, 240);
			cursor: pointer;
		}

		.dropdown {
			position: relative;
			display: inline-block;

			button.show-options {
				border: 1px solid var(--ch-orange);
				background-color: transparent;
				border-radius: 4px;
				color: var(--ch-dark-purple);
				line-height: 20px;

				&:hover {
					cursor: pointer;
				}
			}

			.file-options {
				display: none;
				position: absolute;
				right: 0;
				background-color: white;
				border: 1px solid var(--ch-orange);
				//box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
				z-index: 1;
				border-radius: 4px;
				margin-top: 4px;

				button {
					font-size: 14px;
					background-color: transparent;
					color: var(--ch-orange);
					text-decoration: none;
					display: inline-block;
					width: 100%;
					border: none;
					padding: 4px;
					text-align: left;
					border-bottom: 1px solid var(--ch-orange);

					div {
						display: flex;
						flex-direction: row;

						span {
							margin-left: 12px;
							margin-right: 8px;
							line-height: 16px;
						}
					}

					&:hover {
						background-color: var(--ch-orange);
						color: white;
						cursor: pointer;
					}
				}

				button:last-of-type {
					border-bottom: none;
				}
			}
		}
	}
</style>
