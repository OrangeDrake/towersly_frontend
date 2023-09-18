<script>
  import { ordered_shelves } from "$lib/stores/libraryStore.js";
  import { toastStore } from "@skeletonlabs/skeleton";
  import { popup } from "@skeletonlabs/skeleton";
  import { storePopup } from "@skeletonlabs/skeleton";
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom";
  import { API_URL } from "$lib/components/Constants.svelte";
  import Shelf from "$lib/components/Shelf.svelte";
  import AddShelf from "$lib/components/AddShelf.svelte";

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  let elapsed = 0;
	let duration = 5000;

	let last_time;
  let time;
	let frame;

  const targer_popup = "popup_time_tracing";

  const popupFeatured = {
    event: "click",
    target: targer_popup,
    placement: "top",
  };

  const t = {
    message: "Message contains a unique action." + elapsed,
    autohide: false,
    action: {
      label: "Greeting",
      response: () => alert("Hello, Skeleton"),
    },
  };

  $: {
    console.log("elapsed: " + elapsed);
  }

  let selected_wok = null;

  const selection = (work) => {
    selected_wok = work;
  };

 const startTimer = () => {

  time = window.performance.now();

	(function update() {
		frame = requestAnimationFrame(update);

		
		elapsed = Math.floor((window.performance.now() - time) / 1000);

		
	})();

  toastStore.trigger(t);

}

</script>

<div class="ml-2 p-2 pb-10 bg-sky-100">
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
  <div>
    <button type="button" class="btn btn-sm m-2 variant-filled rounded" use:popup={popupFeatured}>
      <svg class="w-7 h-7 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M10 6v4l3.276 3.276M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>

      <span class="text-lg">Select work to Track</span></button
    >
    <div>{elapsed}</div>
  </div>
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

  <div class="p-4 w-72 shadow-xl bg-orange-200 border-solid border-2" data-popup={targer_popup}>
    {#if $ordered_shelves != null && $ordered_shelves.length != 0}
      {#each $ordered_shelves as shelf}
        {#if shelf.works.length != 0}
          <span class="m-1 chip {selected_wok === shelf.works[0] ? 'variant-filled' : 'variant-soft'}" on:click={() => selection(shelf.works[0])}>
            <span>{shelf.works[0].name}</span>
          </span>
        {/if}
      {/each}
      <button
        type="button"
        class="btn btn-sm m-2 variant-filled bg-green-500"
        on:click={() => {
          startTimer();
        }}
      >
        <svg class="p-1 w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        Track Progress</button
      >
    {/if}
  </div>
</div>
