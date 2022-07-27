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
    <div class="path-item" on:click="{() => pathItemClicked(pathItems.slice(1, i + 1).join('/'))}">
      <span>{pathItem}</span>/ 
    </div>
  {/each}
</div>

<style lang="scss">
  .path-bar{
    display: flex;
    flex-direction: row;
    .path-item {
      margin-right: 0.5em;
      span {
        margin-right: 0.5em;
        font-weight: 400;
      }
    }
  }
</style>