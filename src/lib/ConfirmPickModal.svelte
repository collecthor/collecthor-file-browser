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
    .confirm-modal-buttons {
      padding-top: 8px;
      button {
        border: none;
        padding: 8px;

        &.cancel-button {
          background-color: red;
        }
      }
    }
  }
</style>