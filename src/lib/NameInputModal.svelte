<script lang="ts">
  export let title: string;
  export let namePicked: (name: string) => void;


  let nameInput: HTMLInputElement;
</script>

<div class="name-input-modal">
  <p>{title}</p>
  <input type="text" bind:this={nameInput}/>
  <div class="input-modal-buttons">
    <button on:click={() => namePicked(nameInput.value)} >Create</button>
  </div>
</div>

<style lang="scss">
  .name-input-modal {
    font-family: "Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif;

    .input-modal-buttons {
      padding-top: 8px;
      display: flex;
      justify-content: end;

      button {
        border: 1px solid var(--ch-orange);
        padding: 8px 16px;
        background-color: transparent;
        border-radius: 4px;
        margin: 0 8px;

        &:hover {
          cursor: pointer;
          color: white;
          background-color: var(--ch-orange);

        }
      }

      button:last-of-type {
        margin-right: 0;
      }
    }
  }
</style>