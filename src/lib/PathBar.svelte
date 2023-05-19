<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let path: string;
  $: pathItems = ['Home', ...path.split('/').slice(1).filter((item) => item !== "")];

  const dispatch = createEventDispatcher();
  
  const pathItemClicked = (path: string) => {
    dispatch('pathItemClicked', {
      path: `/${path}`,
    });
  }
</script>

<div class="path-bar">
  {#each pathItems as pathItem, i}
    <span class="path-item" on:click="{() => pathItemClicked(pathItems.slice(1, i + 1).join('/'))}">{pathItem}</span><span>/</span>
  {/each}
</div>

<style lang="scss">
  .path-bar {
    display: flex;
    flex-direction: row;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: calc(100% - 316px);
    line-height: 32px;

    span {
      margin-right: 0.5em;
    }

    .path-item {
      color: var(--ch-dark-purple);

      &:hover {
        cursor: pointer;
        opacity: 0.4;
      }
    }
  }
</style>