<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import SizeDisplay from "./SizeDisplay.svelte";
  import Folder from 'svelte-material-icons/Folder.svelte';
  import type BackendFile from "src/interfaces/BackendFile";
  import type ContextMenuAction from "src/interfaces/ContextMenuAction";
  import FileIcon from "./FileIcon.svelte";

  export let item: BackendFile;
  export let items: BackendFile[];
  export let actions: ContextMenuAction[];

  let clickTimer;

  const dispatch = createEventDispatcher();

  const optionsClicked = (event: MouseEvent) => {
    if (event.target instanceof Element) {
      event.target.parentElement.classList.toggle("show");
    }
  };

  const itemClicked = (event: MouseEvent) => {
    if (event.detail === 1) {
      clickTimer = setTimeout(() => {
        dispatch("itemClicked", {...item})
      }, 200)
    }
  }

  const itemDoubleClicked = () => {
    clearTimeout(clickTimer);
    dispatch("itemSelected", {...item});
  }
  
  const actionClicked = (event: MouseEvent, action: ContextMenuAction) => {
    dispatch('updateItems', action.action(item, items));
    if (event.target instanceof Element) {
      event.target.closest('.dropdown').classList.remove('show');
    }
  }

</script>

<tr on:click={itemClicked} on:dblclick={itemDoubleClicked} class="file-row">
  <td class="text-center-column icon-column small-column">
    {#if item.type === "file"}
      <FileIcon fileType={item.mimetype} />
    {:else}
      <Folder/>
    {/if}
  </td>
  <td class="name-column">{item.filename}</td>
  <td class="size-column"><SizeDisplay size={item.size} /></td>
  <td class="dropdown-column text-center-column small-column">
    <div class="dropdown">
      <button
        class="show-options"
        on:click|stopPropagation={(event) => optionsClicked(event)}
        >...</button
      >
      <div class="file-options">
        {#each actions.filter(action => action.filter.includes(item.type)) as action}
          <button on:click|stopPropagation={event => actionClicked(event, action)}>
            <div>
              <svelte:component this={action.icon}/>
              <span>{action.name}</span>
            </div>
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
  .file-row {
    td {
      padding: 8px;
    }

    .text-center-column {
      text-align: center;
    }

    &:hover {
      background-color: rgb(240, 240, 240);
      cursor: pointer;
    }

    .dropdown {
      position: relative;
      display: inline-block;

      button.show-options {
        border: 1px solid var(--ch-orange);
        background-color: transparent;
        border-radius: 4px;
        color: var(--ch-dark-purple);
        line-height: 20px;

        &:hover {
          cursor: pointer;
        }
      }

      .file-options {
        display: none;
        position: absolute;
        right: 0;
        background-color: white;
        border: 1px solid var(--ch-orange);
        //box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
        z-index: 1;
        border-radius: 4px;
        margin-top: 4px;

        button {
          font-size: 14px;
          background-color: transparent;
          color: var(--ch-orange);
          text-decoration: none;
          display: inline-block;
          width: 100%;
          border: none;
          padding: 4px;
          text-align: left;
          border-bottom: 1px solid var(--ch-orange);

          div {
            display: flex;
            flex-direction: row;

            span {
              margin-left: 12px;
              margin-right: 8px;
              line-height: 16px;
            }
          }

          &:hover {
            background-color: var(--ch-orange);
            color: white;
            cursor: pointer;
          }
        }

        button:last-of-type {
          border-bottom: none;
        }
      }
    }
  }
</style>
