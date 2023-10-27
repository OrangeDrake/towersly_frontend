<script>
  import { tick } from "svelte"
  import { popup } from "@skeletonlabs/skeleton";
  import { storePopup } from "@skeletonlabs/skeleton";
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom";
  import { ordered_shelves } from "$lib/stores/libraryStore.js";
  import { toastStore } from "@skeletonlabs/skeleton";
  import {reDrawCurves} from "$lib/stores/connectionStore.js";
  import {tracking, elapsed, trackTime} from "$lib/stores/timeTrackingStore.js";


  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  let selected_wok = null;

  const targer_popup = "popup_time_tracing";

  const popupFeatured = {
    event: "click",
    target: targer_popup,
    placement: "top",
  };

  const selection = (work) => {
    selected_wok = work;
  };

  let t = {
    hideDismiss: true,
    timeout: 10000,
    background: "bg-green-500",
    position: "r",
    padding: "p-4",
  };

  const startTimer = async () => {
    $isTrackingActive = true;
    t.message =  "time meassure started: " + selected_wok.name;

    trackTime();

    toastStore.trigger(t);
    await tick();
    $reDrawCurves = "selected work: " + selected_wok;
  };
</script>

<div>
  <button type="button" class="btn btn-sm m-2 variant-filled rounded" use:popup={popupFeatured}>
    <svg class="w-7 h-7 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
      <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M10 6v4l3.276 3.276M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>

    <span class="text-lg">Select work to Track</span></button
  >
  {#if $tracking}
  <div class="inline-block">{$elapsed}</div>
  <div>{selected_wok.name}</div>
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
