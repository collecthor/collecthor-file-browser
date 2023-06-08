<script lang="ts">
	import type FileManager from './FileManager';

	export let fileManager: FileManager;

	const pathStack = fileManager.getPathStack();
</script>

<div class="path-bar">
	<span
		class="path-item"
		on:click={() => fileManager.goHome()}
		on:keydown={() => fileManager.goHome()}>Home</span
	>
	<span class="separator">/</span>
	{#each $pathStack as pathItem, i}
		<span
			class="path-item"
			on:click={() => fileManager.goToNode(pathItem)}
			on:keydown={() => fileManager.goToNode(pathItem)}
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
