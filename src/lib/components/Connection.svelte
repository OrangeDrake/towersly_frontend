<script>
  import { curves } from "$lib/stores/connectionStore.js";


  $: {
    console.log("curves2");
    console.log($curves);
  }

</script>

<div class="m-0 h-8 bg-gradient-to-b from-sky-100 to-sky-200">
</div>

<div class="absolute">
  {#if $curves != null}
    {#each Object.values($curves) as curve, i}    
        <svg height="1000" width="1000">
          <line x1={curve.shelf_point.x} y1={curve.shelf_point.y} x2={curve.distribution_point.x} y2={curve.distribution_point.y} style="stroke:rgb(255,0,0);stroke-width:2" />
        </svg>    
    {/each}
  {/if}
</div>

<style>
  div.absolute {
    position: absolute;
    top: 0;
    left: 0;
    width: 1000px;
    height: 1000px;    
  }
</style>