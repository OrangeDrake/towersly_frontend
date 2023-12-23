 <script>

import { afterUpdate, onMount, beforeUpdate } from "svelte";
import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";
import { keycloak } from "$lib/stores/keycloakStore.js";
import { API_URL } from "$lib/components/Constants.svelte";
import { ordered_shelves_names, ordered_shelves, shelves_locations } from "$lib/stores/libraryStore.js";
import { ordered_distributions, distributions_locations, distributions, addToDistributionsLocations } from "$lib/stores/planningStore.js";
import { calculateCurves, reDrawCurves } from "$lib/stores/connectionStore.js";

  let connectedShelvesNames;
  let shelvesNamesToAdd;
  let shelfNameToRemove = "";
  let shelfNameToConnect = "";
  let typeMixingShelves;

  export let distribution;


  if (distribution.connection != null) {
    typeMixingShelves = distribution.connection.type;
  }

  const selection = (c) => {
    shelfNameToRemove = c;
  };

  const getConnectedShelvesNames = () => {
    if (distribution.connection == null) {
      connectedShelvesNames = [];
    } else {
      connectedShelvesNames = distribution.connection.shelves_names;
    }
  };

  const addConnectedShelf = async () => {
    if (shelfNameToConnect == "") {
      return;
    }

    const token_value = "Bearer " + $keycloak.token;

    var url = new URL(API_URL + "/planning/addconnectedshelf");
    url.searchParams.append("distributionId", distribution.id);
    url.searchParams.append("shelfName", shelfNameToConnect);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: token_value,
        "Content-Type": "application/json",
      },
    });
    const connecton = await response.json();
    console.log(">>>>>>>>>>>>>>>>>>> " + connecton);
    if (connecton != null) {
      distribution.connection = connecton;
      $distributions = $distributions;
      typeMixingShelves = connecton.type;
      console.log(">>>>>>>>>>>>>>>>>>>*.*.*.*.*.*." + connecton.type);
      getConnectedShelvesNames();
    }
    $reDrawCurves = "add" + shelfNameToConnect + distribution.id;
    shelfNameToConnect = "";
  };

  const removeConnectedShelf = async () => {
    if (shelfNameToRemove == "") {
      return;
    }

    const token_value = "Bearer " + $keycloak.token;
    const url = new URL(API_URL + "/planning/removeconnectedshelf");
    url.searchParams.append("distributionId", distribution.id);
    url.searchParams.append("shelfName", shelfNameToRemove);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: token_value,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log(">>>>>>>>>>>>>>>>>>>*.*.*.*.*.*. rreturned" + shelfNameToRemove);
      console.log(">>>>>>>>>>>>>>>>>>>*.*.*.*.*.*. response" + response);
      return;
    }

    const index = connectedShelvesNames.indexOf(shelfNameToRemove);
    if (index === -1) {
      return;
    }
    connectedShelvesNames.splice(index, 1);
    connectedShelvesNames = connectedShelvesNames;
    $distributions = $distributions;

    console.log(">>>>>>>>>>>>>>>>>>>*.*.*.*.*.*." + shelfNameToRemove);
    $reDrawCurves = "remove" + shelfNameToRemove + distribution.id; //kdybychom odstanily 2 stejne shelfName z ruznych distribuci k redraw by nedoslo
  };

  const changeConnectingType = () => {
    const token_value = "Bearer " + $keycloak.token;
    const url = new URL(API_URL + "/planning/changeconnectingtype");
    url.searchParams.append("distributionId", distribution.id);
    url.searchParams.append("type", typeMixingShelves);
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: token_value,
        "Content-Type": "application/json",
      },
    });
  };

  afterUpdate(() => {
    getConnectedShelvesNames();
    // getElementLocation();
  });



  $: {
    console.log("!!!!!!!!!!!!!!!++++@@@@@@@@@@* in reactive block shalves names: " + $ordered_shelves_names + "connectedShelvesNames: " + connectedShelvesNames);
    if ($ordered_shelves_names != null && connectedShelvesNames != null) {
      console.log("@@@@@@@@@@*ordered_shelves for add: " + $ordered_shelves_names);
      shelvesNamesToAdd = $ordered_shelves_names.filter((s) => !connectedShelvesNames.includes(s));
      console.log("@@@@@@@@@@filtered ordered_shelves for add: " + shelvesNamesToAdd);
    }
  }
 </script>
 
 
 {#if shelvesNamesToAdd != null && shelvesNamesToAdd.length != 0}
    <div class="p-1 m-1 bg-slate-300">
      <select class="select p-1 m-1" size="1" bind:value={shelfNameToConnect}>
        {#each shelvesNamesToAdd as shelfName, i}
          <option value={shelfName}>{shelfName}</option>
          <!-- <option value="0">Shelf0</option>
          <option value="1">Shelf1 </option> -->
        {/each}
      </select>

      <button
        type="button"
        class="btn btn-sm m-2 variant-filled bg-green-500"
        on:click={() => {
          addConnectedShelf();
        }}
      >
        <svg class="inline-block p-1 w-5 h-5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        Connect Shelf</button
      >
    </div>
  {/if}

  {#if connectedShelvesNames != null && connectedShelvesNames.length > 1}
    <div class="p-1 m-1 bg-slate-300">
      <div class="text-stone-600">Shelves Combination</div>
      <RadioGroup class="px-1 py-1">
        <RadioItem bind:group={typeMixingShelves} value="concat" on:change={() => changeConnectingType()}>concat</RadioItem>
        <RadioItem bind:group={typeMixingShelves} value="zip" on:change={() => changeConnectingType()}>zip</RadioItem>
        <!-- <RadioItem bind:group={typeMixingShelves} value=0>concat</RadioItem>
        <RadioItem bind:group={typeMixingShelves} value=1>zip</RadioItem> -->
      </RadioGroup>
    </div>
  {/if}

  {#if connectedShelvesNames != null && connectedShelvesNames.length != 0}
    <div class="p-1 m-1 bg-slate-300">
      <div class="text-stone-600">Connected Shelves</div>
      {#each connectedShelvesNames as c}
        <span class="m-1 chip {shelfNameToRemove === c ? 'variant-filled' : 'variant-soft'}" on:click={() => selection(c)}>
          <!-- {#if color === c}<span>-</span>{/if} -->
          <span>{c}</span>
        </span>
      {/each}

      <button
        type="button"
        class="btn btn-sm m-2 variant-filled bg-red-500"
        on:click={() => {
          removeConnectedShelf();
        }}
      >
        <svg class="inline-block p-1 w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"
          />
        </svg>
        Disconnect</button
      >
    </div>
  {/if}