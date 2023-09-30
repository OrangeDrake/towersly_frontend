<script>
  import { calculateCurves, curvesToDraw } from "$lib/stores/connectionStore.js";
  import { ordered_distributions, distributions_locations } from "$lib/stores/planningStore.js";

  // $: {
  //   console.log("try calulate cureves")
  //   // $shelves_locations;
  //   // $shelves_location_number;
  //   if ($ordered_distributions != null) {
  //     console.log("$distributions_locations.keys().length: " + Object.keys($distributions_locations).length + "$ordered_distributions.length: " + $ordered_distributions.length);
  //     if (Object.keys($distributions_locations).length == $ordered_distributions.length) {
  //       calculateCurves();
  //     }
  //   }
  // }

  $: {
    console.log("curves2");
    console.log($curvesToDraw);
  }

  const strokes = ["0,16,39", "60,76,99", "100,116,139", "150,166,189"];


</script>

<!-- <div class="ml-2 h-8 bg-gradient-to-b from-sky-100 to-sky-200" /> -->

<div class="absolute">
  {#if $curvesToDraw != null}
    <svg height="1000" width="2000">
      {#each Object.values($curvesToDraw) as curve, i}
        <!-- <line x1={curve.shelf_point.x} y1={curve.shelf_point.y} x2={curve.distribution_point.x} y2={curve.distribution_point.y} style="stroke:rgb(100,116,139);stroke-width:2" /> -->
        <path
          d="M{curve.shelf_point.x} {curve.shelf_point.y}      
            Q{curve.shelf_point.x} {curve.distribution_point.y} {(curve.shelf_point.x + curve.distribution_point.x) / 2 } {(curve.shelf_point.y +curve.distribution_point.y) /2  }       
            T{curve.distribution_point.x} {curve.distribution_point.y}"
          stroke="rgb({strokes[i%strokes.length]})"
          stroke-width="3"
          fill="none"
        />
      {/each}
    </svg>
  {/if}
</div>

<style>
  div.absolute {
    /* position: absolute; */
    top: 0;
    left: 0;
    width: 2000px;
    height: 1000px;
    pointer-events: none;
  }
</style>
