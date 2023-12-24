<script>
  import { onMount, afterUpdate, beforeUpdate } from "svelte";
  import DistributionConnections from "$lib/components/DistributionConnections.svelte";
  import DistributionRules from "$lib/components/DistributionRules.svelte";
  import { ordered_shelves_names, ordered_shelves, shelves_locations } from "$lib/stores/libraryStore.js";
  import { ordered_distributions, distributions_locations, distributions, addToDistributionsLocations } from "$lib/stores/planningStore.js";
  import { generateButton_location} from "$lib/stores/calendarStore.js";

  import { resetLocations, calculateCurves } from "$lib/stores/connectionStore.js";
  import { resetLocations2, calculateCurves2 } from "$lib/stores/connectionStore2.js";

  let element;

  let offsetTop;
  let offsetLeft;
  let offsetWidth;
  let offsetHeight;

  export let distribution;

  const getElementLocation = () => {
    if (element != null) {
      offsetTop = element.offsetTop;
      offsetLeft = element.offsetLeft;
      offsetWidth = element.offsetWidth;
      offsetHeight = element.offsetHeight;
      const location = { offsetTop: offsetTop, offsetLeft: offsetLeft, offsetWidth: offsetWidth, offsetHeight: offsetHeight};
      console.log("distribution: offsetTop2: " + offsetTop);
      addToDistributionsLocations(distribution.name, location);
    }
  };


  $: {
    console.log("try to calulate cureves");
    // console.log("shelves_locations.keys().length: " + Object.keys($shelves_locations).length + "ordered_shelves.length: " + $ordered_shelves.length);
    console.log("element: " + element)
    if (element != null && $ordered_shelves != null && Object.keys($shelves_locations).length == $ordered_shelves.length) {
      getElementLocation();
      console.log("##@@distribution " + distribution.id + " location got");
      console.log("distributions_locations.keys().length: " + Object.keys($distributions_locations).length + "ordered_distributions.length: " + $ordered_distributions.length);
      // if (Object.keys($distributions_locations).length == $ordered_distributions.length) {
      //   console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>curves calculated******************************");
      //   //calculateCurves();
      // }
    }
  }

  // afterUpdate(() => {
  //   console.log("distribution element updated, id: " + distribution.id);
  //   getElementLocation();
  // });
</script>

<div class="card p-2 m-2 h-50 w-72" bind:this={element} >
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
  <DistributionConnections {distribution} />
  <DistributionRules {distribution} />
</div>
