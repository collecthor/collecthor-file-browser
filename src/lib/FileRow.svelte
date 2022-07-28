<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import SizeDisplay from "./SizeDisplay.svelte";
  import Folder from 'svelte-material-icons/Folder.svelte';
  import type BackendFile from "src/interfaces/BackendFile";
  import type ContextMenuAction from "src/interfaces/ContextMenuAction";
  import FileIcon from "./FileIcon.svelte";

  export let item: BackendFile;
  export let actions: ContextMenuAction[];

  const dispatch = createEventDispatcher();

  const rowClicked = (clickedItem: BackendFile) => {
    if (clickedItem.type === "folder") {
      dispatch("itemClicked", {
        path: `${clickedItem.path}/${clickedItem.filename}`,
      });
    }
  };

  const optionsClicked = (event: MouseEvent) => {
    if (event.target instanceof Element) {
      event.target.parentElement.classList.toggle("show");
    }
  };
  
  const actionClicked = (event: MouseEvent, action: ContextMenuAction) => {
    action.action(item);
    if (event.target instanceof Element) {
      event.target.closest('.dropdown').classList.remove('show');
    }
  }

</script>

<tr on:click={() => rowClicked(item)}>
  {#if item.type === "file"}
    <FileIcon file={item} />
  {:else}
    <td><Folder/></td>
  {/if}
  <td>{item.filename}</td>
  <td><SizeDisplay size={item.size} /></td>
  <td>
    <div class="dropdown">
      <button
        class="show-options"
        on:click|stopPropagation={(event) => optionsClicked(event)}
        >...</button
      >
      <div class="file-options">
        {#each actions.filter(action => action.filter.includes(item.type)) as action}
          <button on:click|stopPropagation={event => actionClicked(event, action)}>
            <span>
              <svelte:component this={action.icon}/>{action.name}
            </span>
          </button>
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
  .dropdown {
    position: relative;
    display: inline-block;

    button.show-options {
      border: none;
    }

    .file-options {
      display: none;
      position: absolute;
      background-color: white;
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
      z-index: 1;
      button {
        color: black;
        text-decoration: none;
        display: block;
        min-width: 100px;
        border: none;
        padding: 4px;
        text-align: left;
        font-size: 1em;
        &:hover {
          background-color: rgb(220, 220, 220);
        }
      }
    }
  }
</style>
