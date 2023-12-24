<script>
  import { curvesToDraw2 } from "$lib/stores/connectionStore2.js";

  export let page;

  $: {
    console.log("curves2");
    console.log("-+-+-+-+++-+curces2: " + JSON.stringify($curvesToDraw2));
  }

  const strokes = ["0,16,39", "60,76,99", "100,116,139", "150,166,189"];
</script>

<div class="absolute">
  {#if $curvesToDraw2 != null && page != null}
    <svg height="2000" width={page.offsetWidth}>
      {#each Object.values($curvesToDraw2) as curve, i});
        <!-- <path
      d="M{curve.generateButton_point_point.x} {curve.generateButton_point_point.y}      
        Q{curve.generateButton_point_point.x} {curve.distribution_point.y} {(curve.generateButton_point_point.x + curve.distribution_point.x) / 2 } {(curve.generateButton_point_point.y +curve.distribution_point.y) /2  }       
        T{curve.distribution_point.x} {curve.distribution_point.x}"
      stroke="rgb({strokes[i%strokes.length]})"
      stroke-width="3"
      fill="none"
    /> -->
        <!-- <line x1={curve.generateButton_point_point.x} y1={curve.generateButton_point_point.y}  x2={curve.distribution_point.x} y2={curve.distribution_point.y} style="stroke: black; stroke-width:3;"/> -->
        <path
            d="M{curve.distribution_point.x} {curve.distribution_point.y}      
            Q{curve.distribution_point.x} {curve.generateButton_point_point.y} {(curve.distribution_point.x + curve.generateButton_point_point.x) / 2} {(curve.distribution_point.y + curve.generateButton_point_point.y) / 2}       
            T{curve.generateButton_point_point.x} {curve.generateButton_point_point.y}"
          stroke="rgb({strokes[i % strokes.length]})"
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
