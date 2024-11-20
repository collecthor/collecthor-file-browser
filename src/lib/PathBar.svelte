<script lang="ts">
	import type FileManager from './FileManager';

	interface Props {
		fileManager: FileManager;
	}

	let { fileManager }: Props = $props();

	const pathStack = fileManager.getPathStack();
</script>

<div class="path-bar">
	<span
		class="path-item"
		onclick={() => fileManager.goHome()}
		onkeydown={() => fileManager.goHome()}
		role="button"
		tabindex="0">Home</span
	>
	<span class="separator">/</span>
	{#each $pathStack as pathItem}
		<span
			class="path-item"
			role="button"
			tabindex="0"
			onclick={() => fileManager.goToNode(pathItem)}
			onkeydown={() => fileManager.goToNode(pathItem)}
		>
			{pathItem.name}
		</span>
		<span class="separator">/</span>
	{/each}
</div>

<style lang="scss">
	.path-bar {
		display: flex;
		flex-direction: row;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		flex-grow: 100;
		line-height: 32px;

		span {
			margin-right: 0.5em;
		}

		.path-item {
			color: var(--ch-dark-purple);

			&:hover {
				cursor: pointer;
				opacity: 0.4;
			}
		}
	}
</style>
