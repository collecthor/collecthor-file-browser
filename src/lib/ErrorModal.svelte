<script lang="ts">
	import AlertOutline from 'virtual:icons/mdi/alert-outline';
	import AlertCircleOutline from 'virtual:icons/mdi/alert-circle-outline';

	interface Props {
		title: string;
		message: string;
		type: 'error' | 'warning';
	}

	let { title, message, type }: Props = $props();
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

<style lang="css">
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
	}

	h1 {
		margin: 0 0 0.5rem 0;
	}
	.error-modal {
		font-family: 'Helvetica Neue', Roboto, Arial, 'Droid Sans', sans-serif;
		display: flex;
	}
</style>
