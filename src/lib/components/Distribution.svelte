<script>
  import { afterUpdate, onMount, beforeUpdate } from "svelte";
  import { popup } from "@skeletonlabs/skeleton";
  import { storePopup } from "@skeletonlabs/skeleton";
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom";
  import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";

  // import { getToastStore } from '@skeletonlabs/skeleton';
  import { toastStore } from "@skeletonlabs/skeleton";

  import { keycloak } from "$lib/stores/keycloakStore.js";
  import { ordered_distributions, distributions_locations, distributions, addToDistributionsLocations } from "$lib/stores/planningStore.js";
  import { ordered_shelves_names, ordered_shelves, shelves_locations } from "$lib/stores/libraryStore.js";
  import { calculateCurves, reDrawCurves } from "$lib/stores/connectionStore.js";
  import { API_URL } from "$lib/components/Constants.svelte";
  import Rule from "$lib/components/Rule.svelte";

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
  // const toastStore = getToastStore();

  export let distribution;
  export let rules;

  let projection = distribution.projection;
  if (projection != null) {
    rules = projection.rules;
  }

  let connectedShelvesNames;
  let shelvesNamesToAdd;

  let shelfNameToRemove = "";
  let shelfNameToConnect = "";
  let typeMixingShelves;
  if (distribution.connection != null) {
    typeMixingShelves = distribution.connection.type;
  }

  let element;
  let offsetTop;
  let offsetLeft;
  let offsetWidth;

  let rule_name = "";
  let rule_duration = "";
  let rule_start = "";

  let number_of_options = 0;
  let rule_options = [""];
  let rule_days = new Array(7).fill(false);
  console.log("rule_days: " + rule_days);
  let bool_test = true;

  const targer_popup = "popup_distribution_" + distribution.id;

  const popupFeatured = {
    event: "click",
    target: targer_popup,
    placement: "top",
  };

  let toastRuleAddad = {
    message: "",
    hideDismiss: true,
    timeout: 10000,
    background: "bg-green-500",
    position: "r",
    padding: "p-4",

    // callback: (response) => {
    // console.log(response.id);
    // // if (response.status === 'queued') console.log('Toast was queued!');
    // // if (response.status === 'closed') console.log('Toast was closed!');
    // }
  };

  const resetRule = () => {
    rule_name = "";
    rule_duration = "";
    rule_start = "";
    rule_options = [""];
    rule_days = new Array(7).fill(false);
  };

  const isNameTaken = (name) => {
    for (let i = 0; i < rules.length; i++){
      if (rules[i].name == name){
        // console.log(rule.name)
        return true;
      }      
    };
    return false;
  }

  const daysBooleansToNames = () => {
    const rule_days_names = new Array(0);
    if (rule_days[0]){
      rule_days_names.push("mo");
    }
    if (rule_days[1]){
      rule_days_names.push("tu");
    }
    if (rule_days[2]){
      rule_days_names.push("we");
    }
    if (rule_days[3]){
      rule_days_names.push("th");
    }
    if (rule_days[4]){
      rule_days_names.push("fr");
    }
    if (rule_days[5]){
      rule_days_names.push("sa");
    }
    if (rule_days[6]){
      rule_days_names.push("su");
    }
    return rule_days_names;
  }

  const addRule = async () => {
    toastRuleAddad.background = "bg-yellow-200";
    if (rule_name == "") {
      toastRuleAddad.message = "Rule name missing.";
      toastStore.trigger(toastRuleAddad);
      return;
    }
    if (isNameTaken(rule_name)) {
      toastRuleAddad.message = "Rule name is taken.";
      toastStore.trigger(toastRuleAddad);
      return;
    }
    if (rule_duration == "") {
      toastRuleAddad.message = "Rule duration missing.";
      toastStore.trigger(toastRuleAddad);
      return;
    }
    if (rule_start == "") {
      toastRuleAddad.message = "Rule start time missing.";
      toastStore.trigger(toastRuleAddad);
      return;
    }

    const rule_days_names = daysBooleansToNames();

    if (rule_days_names.length == 0) {
      toastRuleAddad.message = "No day has been selected.";
      toastStore.trigger(toastRuleAddad);
      return;
    }

    const token_value = "Bearer " + $keycloak.token;

    var url = new URL(API_URL + "/planning/addrule");
    url.searchParams.append("distributionId", distribution.id);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token_value,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: rule_name, time: rule_start, duration: rule_duration }),
    });

    const new_projection = await response.json();

    projection = new_projection;
    rules = projection.rules;

    toastRuleAddad.message = "Rule " + rule_name + " added";
    toastRuleAddad.background = "bg-green-500", 
    toastStore.trigger(toastRuleAddad);
    resetRule();
  };

  const selection = (c) => {
    shelfNameToRemove = c;
  };

  const getElementLocation = () => {
    if (element != null) {
      offsetTop = element.offsetTop;
      offsetLeft = element.offsetLeft;
      offsetWidth = element.offsetWidth;
      const location = { offsetTop: offsetTop, offsetLeft: offsetLeft, offsetWidth: offsetWidth };
      console.log("distribution: offsetTop2: " + offsetTop);
      addToDistributionsLocations(distribution.name, location);
    }
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

  const removeConnectedShelf = () => {
    if (shelfNameToRemove == "") {
      return;
    }
    const index = connectedShelvesNames.indexOf(shelfNameToRemove);
    if (index === -1) {
      return;
    }
    connectedShelvesNames.splice(index, 1);
    connectedShelvesNames = connectedShelvesNames;
    $distributions = $distributions;

    const token_value = "Bearer " + $keycloak.token;
    const url = new URL(API_URL + "/planning/removeconnectedshelf");
    url.searchParams.append("distributionId", distribution.id);
    url.searchParams.append("shelfName", shelfNameToRemove);
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: token_value,
        "Content-Type": "application/json",
      },
    });
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

  const changeOfLastRuleOption = (index) => {
    console.log("!!!!!!!!!!!!!!!! before option changed: " + rule_options + "|");
    console.log("!!!!!!!!!!!!!!!! option changed");
    if (rule_options[number_of_options] != "" && index == number_of_options) {
      rule_options.push("");
      number_of_options++;
      console.log("!!!!!!!!!!!!!!!! after option changed in if: " + rule_options + "|");
    }
  };

  afterUpdate(() => {
    getConnectedShelvesNames();
    // getElementLocation();
  });

  $: {
    if (element != null) {
      if ($ordered_shelves != null) {
        console.log("$shelves_locations.keys().length: " + Object.keys($shelves_locations).length + "$ordered_shelves.length: " + $ordered_shelves.length);
        if (Object.keys($shelves_locations).length == $ordered_shelves.length) {
          getElementLocation();
          console.log("distribution " + distribution.id + " location got");
          console.log("try to calulate cureves");
          console.log("$distributions_locations.keys().length: " + Object.keys($distributions_locations).length + "$ordered_distributions.length: " + $ordered_distributions.length);
          if (Object.keys($distributions_locations).length == $ordered_distributions.length) {
            calculateCurves();
          }
        }
      }
    }
  }

  $: {
    console.log("!!!!!!!!!!!!!!!++++@@@@@@@@@@* in reactive block shalves names: " + $ordered_shelves_names + "connectedShelvesNames: " + connectedShelvesNames);
    if ($ordered_shelves_names != null && connectedShelvesNames != null) {
      console.log("@@@@@@@@@@*ordered_shelves for add: " + $ordered_shelves_names);
      shelvesNamesToAdd = $ordered_shelves_names.filter((s) => !connectedShelvesNames.includes(s));
      console.log("@@@@@@@@@@filtered ordered_shelves for add: " + shelvesNamesToAdd);
    }
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

  <div class="p-1 mt-2 m-1 bg-slate-500">
    <button class="btn btn-sm m-2 variant-filled rounded" use:popup={popupFeatured}>Create Rule</button>

    {#if rules != null}
      {#each Object.values(rules) as rule, j}
        <Rule {rule} index={j} distributionId={distribution.id} />
      {/each}
    {/if}
  </div>

  <div class="p-4 w-72 shadow-xl bg-orange-200 border-solid border-2" data-popup={targer_popup}>
    <label class="label">
      <span>Name</span>
      <input bind:value={rule_name} class="input rounded p-1" type="text" />
    </label>
    <label class="label">
      <span>Duration</span>
      <input bind:value={rule_duration} class="input p-1 rounded" type="time" />
    </label>
    <label class="label">
      <span>Start</span>
      <input bind:value={rule_start} class="input p-1 rounded" type="time" />
    </label>

    <label class="label">
      <input bind:checked={rule_days[0]} type="checkbox" />
      <span>Monday</span>
    </label>
    <label class="label">
      <input bind:checked={rule_days[1]} type="checkbox" />
      <span>Tuesday</span>
    </label>
    <label class="label">
      <input bind:checked={rule_days[2]} type="checkbox" />
      <span>Wednesday</span>
    </label>
    <label class="label">
      <input bind:checked={rule_days[3]} type="checkbox" />
      <span>Thursday</span>
    </label>
    <label class="label">
      <input bind:checked={rule_days[4]} type="checkbox" />
      <span>Friday</span>
    </label>
    <label class="label">
      <input bind:checked={rule_days[5]} type="checkbox" />
      <span>Saturday</span>
    </label>
    <label class="label">
      <input bind:checked={rule_days[6]} type="checkbox" />
      <span>Sunday</span>
    </label>

    {#each Array(number_of_options + 1) as _, index (index)}
      <label class="label">
        <span>If not possible then</span>
        <select class="select p-1 m-1" size="1" bind:value={rule_options[index]} on:change={() => changeOfLastRuleOption(index)}>
          {#if rule_options.indexOf("sl") == -1 || rule_options.indexOf("sl") == index}
            <option value="sl">Same day later</option>
          {/if}
          {#if rule_options.indexOf("ss") == -1 || rule_options.indexOf("ss") == index}
            <option value="ss">Same day sooner</option>
          {/if}
          {#if rule_options.indexOf("nl") == -1 || rule_options.indexOf("nl") == index}
            <option value="nl">Next days exact or later</option>
          {/if}
          {#if rule_options.indexOf("ns") == -1 || rule_options.indexOf("ns") == index}
            <option value="ns">Next days exact or sooner</option>
          {/if}
          {#if rule_options.indexOf("pl") == -1 || rule_options.indexOf("pl") == index}
            <option value="pl">Previous days exact or later</option>
          {/if}
          {#if rule_options.indexOf("ps") == -1 || rule_options.indexOf("ps") == index}
            <option value="ps">Previous days exact or sooner</option>
          {/if}
          <option value="">No more options</option>
        </select>
      </label>
    {/each}

    <button
      type="button"
      class="btn btn-sm m-2 variant-filled bg-amber-800"
      on:click={() => {
        resetRule();
      }}
    >
      <svg class="p-1 w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
      </svg>
      Close Rule</button
    >

    <button
      type="button"
      class="btn btn-sm m-2 variant-filled bg-green-500"
      on:click={() => {
        addRule();
      }}
    >
      <svg class="p-1 w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      Add Rule</button
    >
  </div>
</div>
