<script>
  import { ordered_shelves } from "$lib/stores/libraryStore.js";
  import { toastStore } from "@skeletonlabs/skeleton";
  import { popup } from "@skeletonlabs/skeleton";
  import { storePopup } from "@skeletonlabs/skeleton";
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom";
  import { API_URL } from "$lib/components/Constants.svelte";
  import Shelf from "$lib/components/Shelf.svelte";
  import AddShelf from "$lib/components/AddShelf.svelte";
  import TimeTracing from "$lib/components/TimeTracing.svelte";

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
  
	let duration = 5000;

</script>

<div class="ml-2 p-2 pb-10 bg-white">
  <!-- <div class="ml-2 p-2 pb-10"> -->
  <svg class="inline-block w-7 h-7 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M10 16.5c0-1-8-2.7-9-2V1.8c1-1 9 .707 9 1.706M10 16.5V3.506M10 16.5c0-1 8-2.7 9-2V1.8c-1-1-9 .707-9 1.706"
    />
  </svg>
  <span class="text-stone-600 text-lg font-bold">Library</span>

  <TimeTracing/>

  {#if $ordered_shelves == null}
    <div>Loading Shelves...</div>
  {:else}
    <div class="flex flex-nowrap">
      {#each Object.values($ordered_shelves) as shelf, i}
        <Shelf {shelf} />
      {/each}
      <AddShelf />
    </div>
  {/if}

</div>
