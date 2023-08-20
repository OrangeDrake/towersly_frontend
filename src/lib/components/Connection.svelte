<script>
  import { curves } from "$lib/stores/connectionStore.js";

  $: {
    console.log("curves2");
    console.log($curves);
  }
</script>

<div class="ml-2 h-8 bg-gradient-to-b from-sky-100 to-sky-200" />

<div class="absolute">
  {#if $curves != null}
    <svg height="1000" width="2000">
      {#each Object.values($curves) as curve, i}
        <line x1={curve.shelf_point.x} y1={curve.shelf_point.y} x2={curve.distribution_point.x} y2={curve.distribution_point.y} style="stroke:rgb(255,0,0);stroke-width:2" />
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
    pointer-1events: none 
  }
</style>
