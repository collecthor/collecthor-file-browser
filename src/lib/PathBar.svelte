<script lang="ts">
  export let path: string;
  $: pathItems = ['Home', ...path.split('/').slice(1).filter((item) => item !== "")];
</script>

<div class="path-bar">
  {#each pathItems as pathItem}
    <div class="path-item">
      <span>{pathItem}</span> / 
    </div>
  {/each}
</div>

<style lang="scss">
  .path-bar{
    display: flex;
    flex-direction: row;
  }
</style>