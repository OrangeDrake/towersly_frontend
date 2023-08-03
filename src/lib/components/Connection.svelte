<script>
  import { shelves } from "$lib/stores/libraryStore.js";
  import { distributions } from "$lib/stores/planningStore.js";
 
  $: {
    console.log("*********** distributions ***********");
    if ($distributions != null) {
      console.log(Object.values($distributions));
    }
    console.log("*********** distributions end  ***********");
  }
</script>

<div class="m-0 bg-gradient-to-b from-sky-100 to-sky-200">
  <!-- <div> -->
  <svg height="60" width="500">
    <line x1="144" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />
  </svg>
</div>
