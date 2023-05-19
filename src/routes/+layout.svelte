<script>
    import Modal from "svelte-simple-modal";
    import { browser } from '$app/environment';
</script>

<div class="app">
    <main>
        {#if browser}
            <Modal>
                <slot />
            </Modal>
        {/if}
    </main>
</div>
