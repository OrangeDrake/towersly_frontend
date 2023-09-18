<script>
  export let rule;
  export let index;
  export let distributionId;

  import { popup } from "@skeletonlabs/skeleton";
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom";
  import { storePopup } from "@skeletonlabs/skeleton";
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  console.log("-------  in Rule")
  const targer_popup = "popup_rule" + distributionId + rule.name; // rules nemaji id pomoci id distribuce je zarusene ze se popupy ruznych distribuci nezamychaji
  //const targer_popup = "popup";
  const popupHover = {
    event: "hover",
    target: targer_popup,
    placement: "bottom",
  };

</script>

<div class="bordel-solid border-2 bg-slate-300 p-1 m-1 [&>*]:pointer-events-none border-solid border-slate-100" use:popup={popupHover}>
  <div class="truncate">
    <span class="text-stone-600">
      {index + 1}
    </span>
    <svg class="inline-block w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13v3m3-3v3M7 7H4m3-3H4m3 6H4m6 3v3m8-3H7V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v17h17a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1Z"/>
    </svg>

    {rule.name}
  </div>
</div>

<div class="bg-slate-400 p-4 m-1 border-solid border-2 bg-purple-200 break-words w-72" data-popup={targer_popup}>
  <div class="text-stone-600">Name:</div>
  <div>
    {rule.name}
  </div>

  <div class="text-stone-600">Start:</div>
  <div>
    {rule.start}
  </div>

  <div class="text-stone-600">Duration:</div>
  <div>
    {rule.duration}
  </div>

  <div class="text-stone-600">Days:</div>
  <div>
    {rule.days}
  </div>

  <div class="text-stone-600">Options:</div>
  <div>
    {rule.options}
  </div>
  

</div>
