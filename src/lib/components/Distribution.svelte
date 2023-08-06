<script>
  import { onMount } from "svelte";
  import { ordered_distributions, distributions_locations } from "$lib/stores/planningStore.js";
  import { ordered_shelves } from "$lib/stores/libraryStore.js";

  export let distribution;

  let shelves_names;

  let color = "red";

  let element;
  let offsetTop;
  let offsetLeft;
  let offsetWidth;

  onMount(() => {
    console.log("******************onMount ditribution");
  });

  const selection = (c) => {
    color = c;
  };

  const getElementLocation = () => {
    if (element != undefined) {
      offsetTop = element.offsetTop;
      offsetLeft = element.offsetLeft;
      offsetWidth = element.offsetWidth;
      const location = { offsetTop: offsetTop, offsetLeft: offsetLeft, offsetWidth: offsetWidth };
      console.log("distribution: offsetTop2: " + offsetTop);
      $distributions_locations[distribution.name] = location;
    }
  };

  const getShelvesNames = () => {
    shelves_names = distribution.connect.shelves_names;
  };

  $: {
    $ordered_distributions;
    $ordered_shelves;

    getElementLocation();
    getShelvesNames();
  }
</script>

<div class="card p-2 m-2 h-50 w-72" bind:this={element}>
  <div class="card-header w-64 p-2 m-2">
    <svg class="inline-block w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6.143 1H1.857A.857.857 0 0 0 1 1.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 7 6.143V1.857A.857.857 0 0 0 6.143 1Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 17 6.143V1.857A.857.857 0 0 0 16.143 1Zm-10 10H1.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 7 16.143v-4.286A.857.857 0 0 0 6.143 11Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z"
      />
    </svg>
    <span class="font-bold">{distribution.name}</span>
  </div>
  <div class="p-2 bg-slate-300">
    <div class="text-stone-600">Connected Shelves</div>
    {#each shelves_names as c}
      <span class="m-1 chip {color === c ? 'variant-filled' : 'variant-soft'}" on:click={() => selection(c)} >
        <!-- {#if color === c}<span>-</span>{/if} -->
        <span>{c}</span>
      </span>
    {/each}
  </div>
</div>
