<script>
  export let work;
  export let index;
  import { popup } from "@skeletonlabs/skeleton";
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom";
  import { storePopup } from "@skeletonlabs/skeleton";
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  const targer_popup = "popup_work" + work.id;
  //const targer_popup = "popup";
  const popupHover = {
    event: "hover",
    target: targer_popup,
    placement: "top",
  };

  const MinutesToHoursAndMinutesText = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const minutesPart = minutes % 60;

    return hours + ":" + minutesPart;
  };
</script>

<div class="card px-2 bordel-solid border-2 bg-slate-200 p-1 m-1 [&>*]:pointer-events-none border-solid border-slate-600" use:popup={popupHover}>
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

<div class="card border-solid border-2 bg-slate-400 p-4 m-1 border-solid border-2 bg-purple-200 break-words w-72" data-popup={targer_popup}>
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
    <!-- {work.actualDuration} -->
    {work.actualTime}
  </div>

  <div class="text-stone-600">Planed Duration:</div>
  <div>
    <!-- {work.expectedDuration} -->
    {MinutesToHoursAndMinutesText(work.expectedTime)}
  </div>
</div>
