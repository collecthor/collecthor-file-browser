<script lang="ts">
  import { getContext } from "svelte";

  const { close } = getContext('simple-modal');
  export let title: string;
  export let namePicked: (name: string) => void;


  let nameInput: HTMLInputElement;
</script>
<div class="name-input-modal">
  <div>
    <p>{title}</p>
    <input type="text" bind:this={nameInput}/>
  </div>
  <div class="input-modal-buttons">
    <button on:click={() => namePicked(nameInput.value)} >Create</button>
    <button class="cancel-button" on:click={() => close()} >Cancel</button>
  </div>
</div>
<style lang="scss">
  .name-input-modal {
    font-family: "Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif;
    .input-modal-buttons {
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