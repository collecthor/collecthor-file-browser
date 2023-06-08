<script lang="ts">
	import type { Modal as ModalType } from 'svelte-simple-modal';
	import { onMount } from 'svelte';
	let Modal: typeof ModalType;
	onMount(async () => {
		Modal = (await import('svelte-simple-modal')).default;
	});
</script>

<div class="app">
	<main>
		<svelte:component this={Modal}>
			<slot />
		</svelte:component>
	</main>
</div>
