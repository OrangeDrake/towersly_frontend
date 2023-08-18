<script>
  import { afterUpdate, onMount } from "svelte";
  import { keycloak } from "$lib/stores/keycloakStore.js";
  import { ordered_distributions, distributions_locations, distributions } from "$lib/stores/planningStore.js";
  import { ordered_shelves_names } from "$lib/stores/libraryStore.js";
  import { ordered_shelves } from "$lib/stores/libraryStore.js";
  import { API_URL } from "$lib/components/Constants.svelte";

  import { curves } from "$lib/stores/connectionStore.js";

  export let distribution;

  let connectedShelvesNames;
  let shelvesNamesToAdd;

  let color = "red";

  let element;
  let offsetTop;
  let offsetLeft;
  let offsetWidth;

  let shelfNameToConnect;

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

  const getConnectedShelvesNames = () => {
    if (distribution.connection == null) {
      connectedShelvesNames = [];
    } else {
      connectedShelvesNames = distribution.connection.shelves_names;
    }
  };

  const addConnecedShelf = async () => {
    const token_value = "Bearer " + $keycloak.token;

    var url = new URL(API_URL + "/planning/addconnectedshelf");
    url.searchParams.append("distributionId", distribution.id);
    url.searchParams.append("shelfName", shelfNameToConnect);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: token_value,
        "Content-Type": "application/json",
      }    
    }); 

    const connecton = await response.json();

    if (connecton != null){
      distribution.connection = connecton;
      $distributions = $distributions;
      getConnectedShelvesNames();
    }
    
    
  }

  onMount (() => {
    getConnectedShelvesNames();
  });


  afterUpdate(() => {
    getElementLocation();
  });


  $: {
    connectedShelvesNames;
    console.log("!!!!!!!!!!!!!!!++++@@@@@@@@@@* in reactive block shalves names: " + $ordered_shelves_names + "connectedShelvesNames: " + connectedShelvesNames);
    if ($ordered_shelves_names != null && connectedShelvesNames != null) {
      console.log("@@@@@@@@@@*ordered_shelves for add: " + $ordered_shelves_names);
      shelvesNamesToAdd = $ordered_shelves_names.filter((s) => !connectedShelvesNames.includes(s));
      console.log("@@@@@@@@@@filtered ordered_shelves for add: " + shelvesNamesToAdd);
    }
  }

  $: {
    $ordered_distributions;
    $ordered_shelves;
    console.log("****@@@@@@@@@@* in first reactive block ordered_distributions: " + $ordered_distributions + "ordered_shelves: " + $ordered_shelves);
    getElementLocation();  
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
          addConnecedShelf();
        }}
      >
        <svg class="inline-block p-1 w-5 h-5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        Connect Shelf</button
      >
    </div>
  {/if}

  {#if connectedShelvesNames != null && connectedShelvesNames.length != 0}
    <div class="p-1 m-1 bg-slate-300">
      <div class="text-stone-600">Connected Shelves</div>
      {#each connectedShelvesNames as c}
        <span class="m-1 chip {color === c ? 'variant-filled' : 'variant-soft'}" on:click={() => selection(c)}>
          <!-- {#if color === c}<span>-</span>{/if} -->
          <span>{c}</span>
        </span>
      {/each}
    </div>
  {/if}
</div>
