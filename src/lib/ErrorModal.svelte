<script lang="ts">
  import AlertCircleOutline from 'svelte-material-icons/AlertCircleOutline.svelte';
  import AlertOutline from 'svelte-material-icons/AlertOutline.svelte';

  export let title: string;
  export let message: string;
  export let type: string;
</script>

<div class="error-modal">
  <div class="icon-container">
    {#if type === 'error'}
      <AlertOutline size="100%"/>
    {:else if type === 'warning'}
      <AlertCircleOutline size="100%"/>
    {/if}
  </div>
  <div class="message-container">
    <h1>{ title }</h1>
    <p>{ message }</p>
  </div>
</div>

<style lang="scss">
  .error-modal {
    font-family: "Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif;
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
        margin: 0 0 .5rem 0;
      }
    }
  }
</style>