<script>
  import { ordered_distributions, distributions_locations } from "$lib/stores/planningStore.js";
  import Distribution from "$lib/components/Distribution.svelte";
  import AddDistribution from "$lib/components/AddDistribution.svelte";
 
  $:{
    console.log("distributions_location");
    console.log($distributions_locations);
  }

</script>

<div class="ml-2 m-0 mt-0 p-2 bg-sky-200">
  <svg
    class="inline-block w-7 h-7 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M7.75 4H19M7.75 4a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 4h2.25m13.5 6H19m-2.25 0a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 10h11.25m-4.5 6H19M7.75 16a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 16h2.25"
    />
  </svg>
  <span class="text-stone-600 text-lg font-bold">Planning</span>
  {#if $ordered_distributions == null}
    <div>Loading Distributions...</div>
  {:else}
    <div class="flex flex-nowrap">
      {#each Object.values($ordered_distributions) as distribution, i}
        <Distribution {distribution} />
      {/each}
      <AddDistribution />
    </div>
  {/if}
</div>
<!-- <div class="max-w-full"></div> -->
