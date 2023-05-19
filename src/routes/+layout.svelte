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

<style lang="scss">
  :root {
    --ch-blue: #71cbf4;
    --ch-purple: #2d3367;
    --ch-orange: #f39200;
    --ch-red: rgb(255, 107, 107);

    --ch-dark-blue: #00aeea;
    --ch-dark-purple: #21244a;
    --ch-dark-orange: #ed6b06;
    --ch-dark-red: rgb(255, 57, 57);

    --small-column: 36px;
    --name-column: 100%;
    --size-column: 150px;
  }
</style>
