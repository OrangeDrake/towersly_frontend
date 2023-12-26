<script>
  import { popup } from "@skeletonlabs/skeleton";
  import { toastStore } from "@skeletonlabs/skeleton";
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom";
  import { storePopup } from "@skeletonlabs/skeleton";
  import { keycloak } from "$lib/stores/keycloakStore.js";
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  import { API_URL } from "$lib/components/Constants.svelte";

  export let shelf;
  export let work;
  export let index;

  let toastWorkEdited = {
    message: "",
    hideDismiss: true,
    timeout: 10000,
    background: "bg-green-500",
    position: "r",
    padding: "p-4",
  };

  const info_targer_popup = "info_popup_work" + work.id;
  //const targer_popup = "popup";
  const popupHover = {
    event: "hover",
    target: info_targer_popup,
    placement: "top",
  };

  const edit_targer_popup = "edit_popup_work" + work.id;
  //const targer_popup = "popup";
  const popupFeatured = {
    event: "click",
    target: edit_targer_popup,
    placement: "top",
  };

  // const MinutesToHoursAndMinutesText = (minutes) => {
  //   const hours = Math.floor(minutes / 60);
  //   const minutesPart = minutes % 60;

  //   return hours + ":" + minutesPart;
  // };

  const secondsToHoursAndMinutesAndSecondsText = (seconds) => {
    const secondsPart = seconds % 60;
    const minutes = Math.floor(seconds / 60);
    const minutesPart = Math.floor(minutes % 60);
    const hours = Math.floor(minutes / 60);

    return hours.toString().padStart(2, "0") + ":" + minutesPart.toString().padStart(2, "0") + ":" + secondsPart.toString().padStart(2, "0");
  };

  const saveWork = async () => {
    const token_value = "Bearer " + $keycloak.token;

    const actualDurationInSeconds = work_actual_duration_hours_edit * 60 * 60 + work_actual_duration_minutes_edit * 60 + work_actual_duration_seconds_edit;
    const expectedDurationInMinutes = work_expected_duration_hours_edit * 60 + work_expected_duration_minutes_edit;

    var url = new URL(API_URL + "/library/savework?" + new URLSearchParams({ workId: work.id }));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token_value,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: work_name_edit, description: work_description_edit, shelfId: shelf.id, actualTime: actualDurationInSeconds, expectedTime: expectedDurationInMinutes }),
    });

    if (!response.ok) {
      toastWorkEdited.background = "bg-yellow-200";
      toastWorkEdited.message = "Work " + work.name + " edit failed";
      toastStore.trigger(toastWorkEdited);
      return;
    }

    work.actualTime = actualDurationInSeconds;
    work.expectedTime = expectedDurationInMinutes;
    work.name = work_name_edit;
    work.description = work_description_edit;

    toastWorkEdited.message = "Work " + work.name + " edited";
    toastWorkEdited.background = "bg-green-500";
    toastStore.trigger(toastWorkEdited);

    popup.hide(edit_targer_popup);
  };

  const resetEdit = () => {
    work_actual_duration_seconds_edit = work.actualTime % 60;
    work_actual_duration_minutes_edit = Math.floor((work.actualTime / 60) % 60);
    work_actual_duration_hours_edit = Math.floor(work.actualTime / 60 / 60);
    work_expected_duration_minutes_edit = Math.floor((work.expectedTime / 60) % 60);
    work_expected_duration_hours_edit = Math.floor(work.expectedTime / 60 / 60);
    work_name_edit = work.name;
    work_description_edit = work.description;
  };

  let work_actual_duration_seconds_edit = work.actualTime % 60;
  let work_actual_duration_minutes_edit = Math.floor((work.actualTime / 60) % 60);
  let work_actual_duration_hours_edit = Math.floor(work.actualTime / 60 / 60);
  let work_expected_duration_minutes_edit = Math.floor((work.expectedTime / 60) % 60);
  let work_expected_duration_hours_edit = Math.floor(work.expectedTime / 60 / 60);
  let work_name_edit = work.name;
  let work_description_edit = work.description;
</script>

<!-- <div class="card px-2 bordel-solid border-2 bg-slate-200 p-1 m-1 [&>*]:pointer-events-none border-solid border-slate-600" use:popup={popupHover}> -->
<div class="card px-2 bordel-solid border-2 bg-slate-200 p-1 m-1 [&>*]:pointer-events-none border-solid border-slate-600" use:popup={popupHover} use:popup={popupFeatured}>
  <div class="truncate">
    <span class="text-stone-600">
      {index + 1}
    </span>
    <svg class="inline-block w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4.828 10h6.239m-6.239 4h6.239M6 1v4a1 1 0 0 1-1 1H1m14-4v16a.97.97 0 0 1-.933 1H1.933A.97.97 0 0 1 1 18V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2Z"
      />
    </svg>

    {work.name}
  </div>
  <div class="truncate overflow-hidden">
    <i>{work.description}</i>
  </div>
</div>

<div class="card border-solid border-2 bg-slate-400 p-4 m-1 border-solid border-2 bg-purple-200 break-words w-72" data-popup={info_targer_popup}>
  <div class="text-stone-600">Name:</div>
  <div>
    {work.name}
  </div>

  <div class="text-stone-600">Description:</div>
  <div>
    {work.description}
  </div>

  <div class="text-stone-600">Actual Duration:</div>
  <div>
    {secondsToHoursAndMinutesAndSecondsText(work.actualTime)}
  </div>

  <div class="text-stone-600">Planed Duration:</div>
  <div>
    <!-- {work.expectedDuration} -->
    {secondsToHoursAndMinutesAndSecondsText(work.expectedTime)}
  </div>
</div>

<div class="p-4 w-72 shadow-xl bg-orange-200 border-solid border-2" data-popup={edit_targer_popup}>
  <label class="label">
    <span>Name</span>
    <input bind:value={work_name_edit} class="input rounded p-1" type="text" />
  </label>

  <label class="label">
    <span>Description</span>
    <input bind:value={work_description_edit} class="input rounded p-1" type="text" />
  </label>

  <label class="label">
    <span>Actual Duration</span>
    <div class="flex">
      <span class="flex-initial w-16"><input bind:value={work_actual_duration_hours_edit} class="input rounded p-1" type="number" min="0" step="1" /></span>
      <span class="flex-initial w-8 text-lesft pl-1 text-lg">h :</span>
      <span class="flex-initial w-16"><input bind:value={work_actual_duration_minutes_edit} class="input rounded p-1" type="number" min="0" max="59" step="1" /></span>
      <span class="flex-initial w-8 text-left pl-1 text-lg">m</span>
      <span class="flex-initial w-16"><input bind:value={work_actual_duration_seconds_edit} class="input rounded p-1" type="number" min="0" max="59" step="1" /></span>
      <span class="flex-initial w-8 text-left pl-1 text-lg">s</span>
    </div>
  </label>

  <label class="label">
    <span>Expected Duration</span>
    <div class="flex">
      <span class="flex-initial w-16"><input bind:value={work_expected_duration_hours_edit} class="input rounded p-1" type="number" min="0" step="1" /></span>
      <span class="flex-initial w-8 text-lesft pl-1 text-lg">h :</span>
      <span class="flex-initial w-16"><input bind:value={work_expected_duration_minutes_edit} class="input rounded p-1" type="number" min="0" max="59" step="1" /></span>
      <span class="flex-initial w-8 text-left pl-1 text-lg">m</span>
    </div>
  </label>

  <button
    type="button"
    class="btn btn-sm m-2 variant-filled bg-amber-800"
    on:click={() => {
      resetEdit();
    }}
  >
    <svg class="p-1 w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
    </svg>
    Close Edit</button
  >

  <button
    type="button"
    class="btn btn-sm m-2 variant-filled bg-green-500"
    on:click={() => {
      saveWork();
    }}
  >
    <svg class="w-5 h-5 p-1 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5" />
    </svg>
    Edit Work</button
  >
</div>
