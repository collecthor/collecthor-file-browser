<script lang="ts">
	import { AlertOutline, AlertCircleOutline } from '@collecthor/svelte-material-icons';

	export let title: string;
	export let message: string;
	export let type: 'error' | 'warning';
</script>

<div class="error-modal">
	<div class="icon-container">
		{#if type == 'error'}
			<AlertOutline />
		{:else}
			<AlertCircleOutline />
		{/if}
	</div>
	<div class="message-container">
		<h1>{title}</h1>
		<p>{message}</p>
	</div>
</div>

<style lang="scss">
	.error-modal {
		font-family: 'Helvetica Neue', Roboto, Arial, 'Droid Sans', sans-serif;
		display: flex;
		.icon-container {
			flex: 1 1 0;
			margin-right: 1rem;
			color: var(--ch-red);

			:global(svg) {
				max-width: 200px;
				min-width: 100px;
				aspect-ratio: 1/1;
			}
		}
		.message-container {
			flex: auto 1 1;

			h1 {
				margin: 0 0 0.5rem 0;
			}
		}
	}
</style>
