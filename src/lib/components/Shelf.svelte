<script>
  import { keycloak } from "$lib/stores/keycloakStore.js";


  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  import { storePopup } from '@skeletonlabs/skeleton';
storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

import { popup } from '@skeletonlabs/skeleton';




  export let shelf;

  let work_name = "name";
  const targer_popup = "popup_" + shelf.id;
  console.log("targer_popup: " + targer_popup);

  const popupFeatured = {
    // Represents the type of event that opens/closed the popup
    event: "click",
    // Matches the data-popup value on your popup element
    target:  targer_popup,
    // Defines which side of your trigger the popup will appear
    placement: "bottom",
  };

  //const popupFeatured = "popupFeatured" + shelf.id;

  const addWork = async () => {
    const token_value = "Bearer " + $keycloak.token;

    var parametr = { id: shelf.id };
    var url = new URL("http://localhost:8090/library/addwork");
    url.searchParams.append("id", shelf.id);

    // for (let k in data) {
    //   url.searchParams.append(k, data[k]);
    // }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token_value,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: work_name }),
    });

    const new_work = await response.json();
    console.log(Object.values(new_work));
  };
</script>

<div class="card p-2 m-2 w-56">
  <div class="card-header p-2 m-2 w-52">
    <strong>{shelf.name}</strong>
  </div>
  <h3>Works:</h3>
  {#each Object.values(shelf.works).slice(0, 4) as work, j}
    <p>
      {"- " + j + " " + work.name}
    </p>
  {/each}
  {#if shelf.works.length > 5}
    <p>...</p>
  {/if}

  <button class="btn btn-sm m-2 variant-filled rounded" use:popup={popupFeatured}>Create work</button>


  <div class="card p-4 w-72 shadow-xl" data-popup={targer_popup}>
    <label class="label">
      <span>{shelf.name}</span>
      <input
        bind:value={work_name}
        class="input"
        type="text"
        placeholder="Input"
      />
    </label>
    <button
      type="button"
      class="btn btn-sm m-2 variant-filled  bg-green-500"
      on:click={() => {
        addWork();
      }}>Add Work</button
    >
  </div>

</div>