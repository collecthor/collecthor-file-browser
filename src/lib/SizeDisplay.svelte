<script lang="ts">
  export let size: number;
  const suffixes = ['B', 'KB', 'MB', 'GB', 'TB'];
  
  const getFormattedSize = (): string => {
    let formattedSize = size;
    for (const suffix of suffixes){
      if (formattedSize < 1000) {
        return `${formattedSize.toFixed(2)} ${suffix}`;
      } else {
        formattedSize = formattedSize / 1000;
      }
    }
    return `${size.toFixed(2)} PB`;
  }
</script>

<span>
  {getFormattedSize()}
</span>