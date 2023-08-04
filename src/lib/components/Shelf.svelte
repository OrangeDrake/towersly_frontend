<script>
  import { afterUpdate } from "svelte";
  import { popup } from "@skeletonlabs/skeleton";
  import { keycloak } from "$lib/stores/keycloakStore.js";
  import { shelves_locations } from "$lib/stores/libraryStore.js";
  import Work from "$lib/components/Work.svelte";

  export let shelf;
  let works = shelf.works;

  let work_name = "";
  let work_description = "";
  const targer_popup = "popup_" + shelf.id;

  const popupFeatured = {
    event: "click",
    target: targer_popup,
    placement: "bottom",
  };

  const addWork = async () => {
    const token_value = "Bearer " + $keycloak.token;

    var parametr = { id: shelf.id };
    var url = new URL("http://localhost:8090/library/addwork");
    url.searchParams.append("id", shelf.id);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token_value,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: work_name, description: work_description }),
    });

    const n_work = await response.json();
    works.push(n_work);
    works = works;
  };

  let element;
  let offsetTop;
  let offsetLeft;
  let offsetWidth;
  let offsetHeight

  afterUpdate(() => {
    offsetTop = element.offsetTop;
    offsetLeft = element.offsetLeft;
    offsetWidth = element.offsetWidth;
    offsetHeight = element.offsetHeight;

    const location = { offsetTop: offsetTop, offsetLeft: offsetLeft, offsetWidth: offsetWidth, offsetHeight: offsetHeight };
    $shelves_locations[shelf.name] = location;
  });
</script>

<div class="card p-2 mx-2 mt-2 mb-0 h-50 w-72" bind:this={element}>
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
  </div>
  <div>
    {#each Object.values(works).slice(0, 4) as work, j}
      <Work {work} index={j} />
    {/each}
  </div>
  {#if works.length > 5}
    <p>...</p>
  {/if}

  <button class="btn btn-sm m-2 variant-filled rounded" use:popup={popupFeatured}>Create work</button>

  <div class="p-4 w-72 shadow-xl bg-orange-200 border-solid border-2" data-popup={targer_popup}>
    <label class="label">
      <span>Name</span>
      <input bind:value={work_name} class="input rounded p-1" type="text" />
    </label>
    <label class="label">
      <span>Description</span>
      <input bind:value={work_description} class="input p-1 rounded" type="text" />
    </label>
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

<div class="absolute">aboslute</div>

<style>
  div.absolute {
    position: absolute;
    top: 128px;
    right: 0;
    width: 200px;
    height: 100px;
    border: 3px solid #73ad21;
  }
</style>
