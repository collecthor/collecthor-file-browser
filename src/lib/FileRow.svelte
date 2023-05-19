<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import SizeDisplay from "./SizeDisplay.svelte";
  import Folder from 'svelte-material-icons/Folder.svelte';
  import type ContextMenuAction from "$lib/interfaces/ContextMenuAction";
  import FileIcon from "./RowIcon.svelte";
  import type { Node } from "$lib/generated/Node";

  export let item: Node;
  export let items: Node[];
  export let actions: ContextMenuAction[];

  const dispatch = createEventDispatcher<{itemClicked: Node}>();

  const optionsClicked = (event: MouseEvent) => {
    if (event.target instanceof Element) {
      event.target.parentElement.classList.toggle("show");
    }
  };

  const actionClicked = (event: MouseEvent, action: ContextMenuAction) => {
    dispatch('updateItems', action.action(item, items));
    if (event.target instanceof Element) {
      event.target.closest('.dropdown').classList.remove('show');
    }
  }

</script>

<tr on:click={() => dispatch("itemClicked", item)} class="file-row">
  <td>
    <FileIcon mimeType={item.mimeType} />
  </td>
  <td>{item.name}</td>
  <td><SizeDisplay size={item.size} /></td>
  <td>
    <div class="dropdown">
      <button
        class="show-options"
        on:click|stopPropagation={(event) => optionsClicked(event)}
        >...</button
      >
      <div class="file-options">
        {#each actions as action}
          {#if action.validFor(item)}
          <button on:click|stopPropagation={event => actionClicked(event, action)}>
            <div>
              <svelte:component this={action.icon}/>
              <span>{action.name}</span>
            </div>
          </button>
          {/if}
        {/each}
      </div>
    </div>
  </td>
</tr>

<style lang="scss">
  :global {
    .show .file-options {
      display: block !important;
    }
  }
  .file-row {
    font-size: 1.1em;

    td {
      padding: 4px;
    }
    &:hover {
      background-color: rgb(240, 240, 240);
    }
    .dropdown {
      position: relative;
      display: inline-block;

      button.show-options {
        border: none;
      }

      .file-options {
        display: none;
        position: absolute;
        right: 0;
        background-color: white;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
        button {
          color: black;
          text-decoration: none;
          display: inline-block;
          width: 100%;
          border: none;
          padding: 4px;
          text-align: left;
          font-size: 1em;
          div {
            display: flex;
            flex-direction: row;
          }
          &:hover {
            background-color: rgb(220, 220, 220);
          }
        }
      }
    }
  }
</style>
