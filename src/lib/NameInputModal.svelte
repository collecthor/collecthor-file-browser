<script lang="ts">
	interface Props {
		title: string;
		namePicked: (name: string) => void;
	}

	let { title, namePicked }: Props = $props();

	let value = $state<string>();
</script>

<div class="name-input-modal">
	<p>{title}</p>
	<input type="text" bind:value />
	<div class="input-modal-buttons">
		<button type="button" onclick={() => value && namePicked(value)}>Create</button>
	</div>
</div>

<style lang="css">
	button {
		border: 1px solid var(--ch-orange);
		padding: 8px 16px;
		background-color: transparent;
		border-radius: 4px;
		margin: 0 8px;
	}

	button:hover {
		cursor: pointer;
		color: white;
		background-color: var(--ch-orange);
	}

	button:last-of-type {
		margin-right: 0;
	}
	.input-modal-buttons {
		padding-top: 8px;
		display: flex;
		justify-content: end;
	}
	.name-input-modal {
		font-family: 'Helvetica Neue', Roboto, Arial, 'Droid Sans', sans-serif;
	}
</style>
