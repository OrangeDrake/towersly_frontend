<script>
  import { tick } from "svelte";
  import { popup } from "@skeletonlabs/skeleton";
  import { storePopup } from "@skeletonlabs/skeleton";
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom";
  import { ordered_shelves } from "$lib/stores/libraryStore.js";
  import { toastStore } from "@skeletonlabs/skeleton";
  import { keycloak } from "$lib/stores/keycloakStore.js";
  import { API_URL } from "$lib/components/Constants.svelte";
  import { reDrawCurves } from "$lib/stores/connectionStore.js";
  import { tracking, elapsed, trackTime } from "$lib/stores/timeTrackingStore.js";

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  let selected_wok = null;
  let selected_shelf = null;

  const targer_popup = "popup_time_tracing" + new Date();

  const popupFeatured = {
    event: "click",
    target: targer_popup,
    placement: "top",
  };

  const selection = (work, shelf) => {
    selected_wok = work;
    selected_shelf = shelf;
  };

  let t = {
    hideDismiss: true,
    timeout: 10000,
    background: "bg-green-500",
    position: "r",
    padding: "p-4",
  };

  const startTimer = async () => {
    //trackTime();
    const selected_wok_workId = selected_wok.id;
    const selected_wok_name = selected_wok.name;
    $tracking = { start: Date.now(), workName: selected_wok_name, workId: selected_wok_workId, shelfId: selected_shelf.id };
    // console.log("selected_wok: " + JSON.stringify(selected_wok) )
    // console.log("selected_wok_workId: " + selected_wok_workId )

    const token_value = "Bearer " + $keycloak.token;
    const response = await fetch(API_URL + "/profile/startTracking", {
      method: "POST",
      headers: {
        Authorization: token_value,
        "Content-Type": "application/json",
      },
      body: JSON.stringify($tracking),
    });

    t.message = "time meassure started: " + selected_wok.name;
    toastStore.trigger(t);
    //await tick();
    trackTime();
  
    $reDrawCurves = "time tracking start: " + selected_wok;
  };

  const stopTimer = async () => {

    const token_value = "Bearer " + $keycloak.token;
    const response = await fetch(API_URL + "/profile/stopTracking", {
      method: "POST",
      headers: {
        Authorization: token_value,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({stop: Date.now()}),
    });

    t.message = "time meassure stop : " + $tracking.workName;
    toastStore.trigger(t);
    $reDrawCurves = "time tracking stop: " + $tracking.workName;
    $tracking = null;
  };

</script>

<div>

  <!-- {#if $tracking == null} -->
  <button type="button" class="btn btn-sm m-2 variant-filled rounded" use:popup={popupFeatured}>
    <svg class="w-7 h-7 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
      <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M10 6v4l3.276 3.276M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>

    <span class="text-lg">Select work to Track</span></button
  >
  <!-- {/if} -->

  {#if $tracking != null}
    <div class="inline-block">{$elapsed}</div>
    <div>{$tracking.workId}</div>

    <button
    type="button"
    class="btn btn-sm m-2 variant-filled  bg-green-500"
    on:click={() => {
      stopTimer();
    }}
  >
  <svg class="w-4 h-4 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
  </svg>
    Stop</button
  >
    
  {/if}

  <div class="p-4 w-72 shadow-xl bg-orange-200 border-solid border-2" data-popup={targer_popup}>
    {#if $ordered_shelves != null && $ordered_shelves.length != 0}
      {#each $ordered_shelves as shelf}
        {#if shelf.works.length != 0}
          <span class="m-1 chip {selected_wok === shelf.works[0] ? 'variant-filled' : 'variant-soft'}" on:click={() => selection(shelf.works[0], shelf)}>
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
