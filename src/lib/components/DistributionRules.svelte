<script>
  import { keycloak } from "$lib/stores/keycloakStore.js";
  import { storePopup } from "@skeletonlabs/skeleton";
  import { toastStore } from "@skeletonlabs/skeleton";
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom";
  import { popup } from "@skeletonlabs/skeleton";
  import { API_URL } from "$lib/components/Constants.svelte";
  import Rule from "$lib/components/Rule.svelte";

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  let toastRuleAddad = {
    message: "",
    hideDismiss: true,
    timeout: 10000,
    background: "bg-green-500",
    position: "r",
    padding: "p-4",
  };

  export let distribution;

  let rules;

  let projection = distribution.projection;
  if (projection != null) {
    rules = projection.rules;
  }

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

  const resetRule = () => {
    console.log("rule reseted");
    rule_name = "";
    rule_duration = "";
    rule_start = "";
    rule_options = [""];
    number_of_options = 0;
    rule_days = new Array(7).fill(false);
  };

  const isNameTaken = (name) => {
    if (rules == null) {
        return false;
    }
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].name == name) {
        // console.log(rule.name)
        return true;
      }
    }
    return false;
  };

  const daysBooleansToNames = () => {
    const rule_days_names = new Array(0);
    if (rule_days[0]) {
      rule_days_names.push("mo");
    }
    if (rule_days[1]) {
      rule_days_names.push("tu");
    }
    if (rule_days[2]) {
      rule_days_names.push("we");
    }
    if (rule_days[3]) {
      rule_days_names.push("th");
    }
    if (rule_days[4]) {
      rule_days_names.push("fr");
    }
    if (rule_days[5]) {
      rule_days_names.push("sa");
    }
    if (rule_days[6]) {
      rule_days_names.push("su");
    }
    return rule_days_names;
  };

  const addRule = async () => {
    toastRuleAddad.background = "bg-yellow-200";
    if (rule_name == "") {
      toastRuleAddad.message = "Rule name is missing.";
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

    rule_options.pop();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token_value,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: rule_name, start: rule_start, duration: rule_duration, days: rule_days_names, options: rule_options }),
    });

    const new_projection = await response.json();

    distribution.projection = new_projection;
    projection = new_projection;
    rules = projection.rules;

    toastRuleAddad.message = "Rule " + rule_name + " added";
    (toastRuleAddad.background = "bg-green-500"), toastStore.trigger(toastRuleAddad);
    resetRule();
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
  
</script>

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
    <span>Start</span>
    <input bind:value={rule_start} class="input p-1 rounded" type="time" />
  </label>

  <label class="label">
    <span>Duration</span>
    <input bind:value={rule_duration} class="input p-1 rounded" type="time" />
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
