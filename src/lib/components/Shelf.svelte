<script>
  import { afterUpdate } from "svelte";
  import { popup } from "@skeletonlabs/skeleton";
  import { storePopup } from "@skeletonlabs/skeleton";
  import { toastStore } from "@skeletonlabs/skeleton";
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom";
  import { keycloak } from "$lib/stores/keycloakStore.js";
  import { API_URL } from "$lib/components/Constants.svelte";
  import Work from "$lib/components/Work.svelte";
  import { addTohShelvesLocations, shelves } from "$lib/stores/libraryStore.js";
  import { reDrawCurves } from "$lib/stores/connectionStore.js";
  import { ordered_distributions, distributions_locations, distributions, addToDistributionsLocations } from "$lib/stores/planningStore.js";
  import { allConnectedShelvesNames, ordered_shelves_names, ordered_shelves, shelves_locations } from "$lib/stores/libraryStore.js";

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  let toastWorkCreated = {
    message: "",
    hideDismiss: true,
    timeout: 10000,
    background: "bg-green-500",
    position: "r",
    padding: "p-4",
  };

  export let shelf;

  let element;
  let offsetTop;
  let offsetLeft;
  let offsetWidth;
  let offsetHeight;

  let work_name = "";
  let work_description = "";
  let work_expected_duration_hours = 0;
  let work_expected_duration_minutes = 0;
  //let work_expected_duration = "";

  const targer_popup = "popup_shelf_" + shelf.id;

  const popupFeatured = {
    event: "click",
    target: targer_popup,
    placement: "top",
  };

  let works = shelf.works.sort((a, b) => {
    return a.rank - b.rank;
  });

  const hoursAndMinutesToMinutes = (hours, minutes) => {
    return hours * 60 + minutes;
  };

  const addWork = async () => {
    const token_value = "Bearer " + $keycloak.token;
    const expectedDurationInMinutes = hoursAndMinutesToMinutes(work_expected_duration_hours, work_expected_duration_minutes);

    var url = new URL(API_URL + "/library/addwork");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token_value,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: work_name, description: work_description, shelfId: shelf.id, expectedTime: expectedDurationInMinutes }),
    });

    if (!response.ok) {
      toastWorkCreated.background = "bg-yellow-200";
      toastWorkCreated.message = "Work " + work_name + " create failed";
      toastStore.trigger(toastWorkCreated);
      return;
    }

    toastWorkCreated.background = "bg-green-500";
    toastWorkCreated.message = "Work " + work_name + " created";
    toastStore.trigger(toastWorkCreated);

    const n_work = await response.json();
    works.push(n_work);
    works = works;
    $shelves = $shelves;
    resetWork();

    $reDrawCurves = "work added: " + work_name;
  };

  const resetWork = () => {
    work_name = "";
    work_description = "";
    work_expected_duration_hours = 0;
    work_expected_duration_minutes = 0;
  };

  const getElementLocation = () => {
    if (element != null) {
      offsetTop = element.offsetTop;
      offsetLeft = element.offsetLeft;
      offsetWidth = element.offsetWidth;
      offsetHeight = element.offsetHeight;
      const location = { offsetTop: offsetTop, offsetLeft: offsetLeft, offsetWidth: offsetWidth, offsetHeight: offsetHeight };
      addTohShelvesLocations(shelf.name, location);
    }
  };

  // $: {
  // if (element != null && $ordered_distributions != null && $ordered_shelves != null && Object.keys($distributions_locations).length == $ordered_distributions.length && Object.keys($shelves_locations).length == $ordered_shelves.length) {
  //       getElementLocation();

  //   }
  // }

  afterUpdate(() => {
    console.log("shelf element updated, id: " + shelf.id);
    getElementLocation();

    // calculateCurves();
  });
</script>

<div class="card p-2 mx-2 mt-2 mb-0 h-50 w-72 bg-slate-300 {$allConnectedShelvesNames.has(shelf.name) ? 'bordel-solid border-2 border-black' : ''} " bind:this={element}>
  <div class="card-header w-64 p-2 m-2">
    <svg class="inline-block w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M1 5v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H1Zm0 0V2a1 1 0 0 1 1-1h5.443a1 1 0 0 1 .8.4l2.7 3.6H1Z"
      />
    </svg>
    <span class="font-bold">{shelf.name}</span>
    <hr />
  </div>
  <div>
    {#each Object.values(works).slice(0, 4) as work, j}
      <Work {work} index={j} {shelf} />
    {/each}
  </div>
  {#if works.length > 5}
    <p>...</p>
  {/if}

  <button class="btn btn-sm m-2 variant-filled rounded" use:popup={popupFeatured}>Create Work</button>

  <div class="p-4 w-72 shadow-xl bg-orange-200 border-solid border-2" data-popup={targer_popup}>
    <label class="label">
      <span>Name</span>
      <input bind:value={work_name} class="input rounded p-1" type="text" />
    </label>

    <label class="label">
      <span>Description</span>
      <input bind:value={work_description} class="input rounded p-1" type="text" />
    </label>

    <!-- <label class="label">
      <span>Actual Duration</span>
      <div class="flex">
        <span class="flex-initial w-24"><input bind:value={work_actual_duration_hours} class="input rounded p-1" type="number" min="0" step="1" /></span>
        <span class="flex-initial w-4	text-center">:</span>
        <span class="flex-initial w-24"><input bind:value={work_actual_duration_minutes} class="input rounded p-1" type="number" min="0" max="59" step="1" /></span>
      </div>
    </label> -->

    <label class="label">
      <span>Expected Duration</span>
      <div class="flex">
        <span class="flex-initial w-16"><input bind:value={work_expected_duration_hours} class="input rounded p-1" type="number" min="0" step="1" /></span>
        <span class="flex-initial w-8 text-lesft pl-1 text-lg">h :</span>
        <span class="flex-initial w-16"><input bind:value={work_expected_duration_minutes} class="input rounded p-1" type="number" min="0" max="59" step="1" /></span>
        <span class="flex-initial w-8 text-left pl-1 text-lg">m</span>
      </div>
    </label>

    <button
      type="button"
      class="btn btn-sm m-2 variant-filled bg-amber-800"
      on:click={() => {
        resetWork();
      }}
    >
      <svg class="p-1 w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
      </svg>
      Close</button
    >

    <button
      type="button"
      class="btn btn-sm m-2 variant-filled bg-green-500"
      on:click={() => {
        addWork();
      }}
    >
      <svg class="p-1 w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      Add Work</button
    >
  </div>
</div>
<!-- 
<style>
  .time-span input {
    display: flex;
  }
</style> -->
