<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type FilePath from '$lib/interfaces/FilePath';

	export let path: FilePath;
	const dispatch = createEventDispatcher();

	const pathItemClicked = (newPath: string, index: number) => {
		dispatch('pathItemClicked', {
			path: `${newPath}`,
			items: path.items.slice(0, index + 1)
		} as FilePath);
	};
</script>

<div class="path-bar">
	<span class="path-item" on:click={() => pathItemClicked('/', -1)}>Home</span><span>/</span>
	{#each path.items as pathItem, i}
		<span class="path-item" on:click={() => pathItemClicked(pathItem.path, i)}>{pathItem.name}</span
		><span>/</span>
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
