<script>
  import { shelves } from "$lib/stores/libraryStore.js";
  import { onMount } from "svelte";
  import Shelf from "$lib/components/Shelf.svelte";
  import AddShelf from "$lib/components/AddShelf.svelte";

</script>

{#if $shelves == null}
  <div>Loading Shelves...</div>
{:else}
  <div class="flex flex-nowrap">
    {#each Object.values($shelves) as shelf, i}
      <Shelf {shelf} />
    {/each}
    <AddShelf />
  </div>
{/if}

<!-- <style>
  .library {
    display: flex;
  }
  .shelf {  
    flex-wrap: wrap;
    width: 400px;
    padding: 5px;
    margin: 5px;
    background-color:#fff79e;
  }
</style> -->
