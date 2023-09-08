<script>
  import { createSlot, plan, generatePlan } from "$lib/stores/calendarStore.js";
  import { popup } from "@skeletonlabs/skeleton";
  import { storePopup } from "@skeletonlabs/skeleton";
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom";

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  const targer_popup = "calendar";

  const popupFeatured = {
    event: "click",
    target: targer_popup,
    placement: "top",
  };

  let slot_start = "";
  let slot_duration = "";
  let slot_day = "mo";

  const gapLinesLeft = 25;
  const hoursLinesCount = 24;
  const hoursLinesWidth = 1900;
  const hoursHeight = 40;
  const daysLinesCount = 8;
  const daysLinesHeight = 1000;
  const daysWidth = 260;

  const hoursNumberwidth = 80;

  const gapBottom = 40;
  const gapTop = 20;
  const gapRight = 40;
  const gapHoursNumberLeft = 20;

  const minutesInDay = 1440;

  const addSlot = () => {
    createSlot(slot_day, slot_start, slot_duration);
  };

  const dayToXCoordinate = (day) => {
    switch (day) {
      case "mo":
        return hoursNumberwidth;
      case "tu":
        return hoursNumberwidth + daysWidth;
      case "we":
        return hoursNumberwidth + daysWidth * 2;
      case "th":
        return hoursNumberwidth + daysWidth * 3;
      case "fr":
        return hoursNumberwidth + daysWidth * 4;
      case "sa":
        return hoursNumberwidth + daysWidth * 5;
      case "su":
        return hoursNumberwidth + daysWidth * 6;
    }
  };

  const timeToYCoordinate = (time) => {
    return gapTop + (time / minutesInDay) * (hoursHeight * 24) + hoursHeight;
  };

  const durationToLength = (time) => {
    return (time / 60) * hoursHeight;
  };
</script>

<div class="ml-2 p-2 pb-10 bg-sky-100">
  <svg class="inline-block w-7 h-7 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
    <path
      fill="currentColor"
      d="M6 1a1 1 0 0 0-2 0h2ZM4 4a1 1 0 0 0 2 0H4Zm7-3a1 1 0 1 0-2 0h2ZM9 4a1 1 0 1 0 2 0H9Zm7-3a1 1 0 1 0-2 0h2Zm-2 3a1 1 0 1 0 2 0h-2ZM1 6a1 1 0 0 0 0 2V6Zm18 2a1 1 0 1 0 0-2v2ZM5 11v-1H4v1h1Zm0 .01H4v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM10 11v-1H9v1h1Zm0 .01H9v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM10 15v-1H9v1h1Zm0 .01H9v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM15 15v-1h-1v1h1Zm0 .01h-1v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM15 11v-1h-1v1h1Zm0 .01h-1v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM5 15v-1H4v1h1Zm0 .01H4v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM2 4h16V2H2v2Zm16 0h2a2 2 0 0 0-2-2v2Zm0 0v14h2V4h-2Zm0 14v2a2 2 0 0 0 2-2h-2Zm0 0H2v2h16v-2ZM2 18H0a2 2 0 0 0 2 2v-2Zm0 0V4H0v14h2ZM2 4V2a2 2 0 0 0-2 2h2Zm2-3v3h2V1H4Zm5 0v3h2V1H9Zm5 0v3h2V1h-2ZM1 8h18V6H1v2Zm3 3v.01h2V11H4Zm1 1.01h.01v-2H5v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H5v2h.01v-2ZM9 11v.01h2V11H9Zm1 1.01h.01v-2H10v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H10v2h.01v-2ZM9 15v.01h2V15H9Zm1 1.01h.01v-2H10v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H10v2h.01v-2ZM14 15v.01h2V15h-2Zm1 1.01h.01v-2H15v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H15v2h.01v-2ZM14 11v.01h2V11h-2Zm1 1.01h.01v-2H15v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H15v2h.01v-2ZM4 15v.01h2V15H4Zm1 1.01h.01v-2H5v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H5v2h.01v-2Z"
    />
  </svg>
  <span class="text-stone-600 text-lg font-bold">Calendar</span>

  <div class="flex flex-nowrap">

    <button class="btn btn-sm m-2 variant-filled rounded" use:popup={popupFeatured}>Create Custom Slot</button>

    <div>
      <button
        type="button"
        class="btn btn-sm m-2 variant-filled bg-green-500"
        on:click={() => {
          generatePlan();
        }}
      >
        <svg class="inline-block w-7 h-7 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97" />
        </svg>

        <span class="text-black text-lg">Implements rules</span></button
      >
    </div>
  </div>

  <div class="card m-2 p-2 pb-10 bg-white w-min">
    <svg height={daysLinesHeight + gapBottom} width={hoursLinesWidth + gapRight}>
      <!-- <text x="0" y={gapTop} textLength="100px" lengthAdjust="spacingAndGlyphs"> neco</text> -->

      {#each Array(hoursLinesCount) as _, index (index)}
        <text x={gapHoursNumberLeft} y={hoursHeight * (index + 1) + 5 + gapTop} class="small">{index}</text>
        <line x1={gapLinesLeft} y1={hoursHeight * (index + 1) + gapTop} x2={hoursLinesWidth} y2={hoursHeight * (index + 1) + gapTop} style="stroke:rgb(0,0,0);stroke-width:0.25" />
      {/each}

      {#each Array(daysLinesCount) as _, index (index)}
        <line x1={daysWidth * index + hoursNumberwidth} y1="0" x2={daysWidth * index + hoursNumberwidth} y2={daysLinesHeight} style="stroke:rgb(0,0,0);stroke-width:0.5" />
      {/each}

      {#each Object.entries($plan) as [day, slots], index (day)}
        {#each slots as slot, i}
          <rect
            x={dayToXCoordinate(day) + 1}
            y={timeToYCoordinate(slot.start) + 1}
            rx="3"
            ry="3"
            width={daysWidth - 10}
            height={durationToLength(slot.duration) - 2}
            style="fill:rgb(100,116,139);stroke:rgb(255,255,255)"
          />
        {/each}
      {/each}
    </svg>
  </div>

  <div class="p-4 w-72 shadow-xl bg-orange-200 border-solid border-2" data-popup={targer_popup}>
    <select class="select p-1 m-1" size="1" bind:value={slot_day}>
      <option value="mo">Monday</option>
      <option value="tu">Tuesday</option>
      <option value="we">Wednesday</option>
      <option value="th">Thursday</option>
      <option value="fr">Friday</option>
      <option value="sa">Saturday</option>
      <option value="su">Sunday</option>
    </select>

    <label class="label">
      <span>Start</span>
      <input bind:value={slot_start} class="input p-1 rounded" type="time" />
    </label>

    <label class="label">
      <span>Duration</span>
      <input bind:value={slot_duration} class="input p-1 rounded" type="time" />
    </label>
    <button
      type="button"
      class="btn btn-sm m-2 variant-filled bg-green-500"
      on:click={() => {
        addSlot();
      }}
    >
      <svg class="p-1 w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      Add Slot</button
    >
  </div>
</div>

<style>
  .small {
    font: italic 16px sans-serif;
  }
</style>
