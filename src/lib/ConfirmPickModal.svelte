<script lang="ts">

  import { getContext } from 'svelte';
  import type { Node } from '$lib/generated/Node';
  export let pickedFile: Node;
  export let confirmed: (file: Node) => void;

  const { close } = getContext('simple-modal');

  const itemPicked = () => {
    confirmed(pickedFile);
    close();
  }

</script>
<div class="confirm-pick-modal">
  <h1>Confirm choice</h1>
  <p>Are you sure you want to pick {pickedFile.filename}?</p>
  <div class="confirm-modal-buttons">
    <button on:click={itemPicked}>Yes</button>
    <button class="cancel-button" on:click={() => close()}>Cancel</button>
  </div>
</div>

<style lang="scss">
  .confirm-pick-modal {
    font-family: "Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif;

    h1 {
      margin: 0;
    }

    .confirm-modal-buttons {
      padding-top: 8px;
      display: flex;
      justify-content: end;

      button {
        border: 1px solid var(--ch-orange);
        padding: 8px 16px;
        background-color: transparent;
        border-radius: 4px;
        margin: 0 8px;

        &.cancel-button {
          color: white;
          background-color: var(--ch-red);
          border-color: var(--ch-red);
        }

        &:hover {
          cursor: pointer;
          color: white;
          background-color: var(--ch-orange);

          &.cancel-button {
            background-color: var(--ch-dark-red);
            border-color: var(--ch-dark-red);
          }
        }
      }

      button:last-of-type {
        margin-right: 0;
      }
    }
  }
</style>