<script>
  import {  curvesToDraw } from "$lib/stores/connectionStore2.js";

  $: {
    console.log("curves2");
    console.log("-+-+-+-+++-+curces2: " + JSON.stringify($curvesToDraw));
  }

  const strokes = ["0,16,39", "60,76,99", "100,116,139", "150,166,189"];


</script>

<div class="absolute">
  {#if $curvesToDraw != null}
    <svg height="2000" width="2000">
      {#each Object.values($curvesToDraw) as curve, i});
      <!-- <path
      d="M{curve.generateButton_point_point.x} {curve.generateButton_point_point.y}      
        Q{curve.generateButton_point_point.x} {curve.distribution_point.y} {(curve.generateButton_point_point.x + curve.distribution_point.x) / 2 } {(curve.generateButton_point_point.y +curve.distribution_point.y) /2  }       
        T{curve.distribution_point.x} {curve.distribution_point.x}"
      stroke="rgb({strokes[i%strokes.length]})"
      stroke-width="3"
      fill="none"
    /> -->
    <line x1={curve.generateButton_point_point.x} y1={curve.generateButton_point_point.y}  x2={curve.distribution_point.x} y2={curve.distribution_point.y} style="stroke: black; stroke-width:3;"/>
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
