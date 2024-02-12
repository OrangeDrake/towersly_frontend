<script>
  import { afterUpdate, tick } from "svelte";
  import Library from "$lib/components/Library.svelte";
  import Planning from "$lib/components/Planning.svelte";
  import Connection from "$lib/components/Connection.svelte";
  import ConnectionBackground from "$lib/components/ConnectionBackground.svelte";
  import Connection2 from "$lib/components/Connection2.svelte";
  import Calendar from "$lib/components/Calendar.svelte";

  import { reDrawCurves } from "$lib/stores/connectionStore.js";
 
  afterUpdate(() => {
    console.log("************page updated*******");
  });

  let start1;
  let end1;
  let element;

  let gapiLoaded;
  let gisLoaded;

</script>

<svelte:head>

  <script async defer src="https://apis.google.com/js/api.js" on:load="{gapiLoaded()}"></script>
  <script async defer src="https://accounts.google.com/gsi/client" on:load="{gisLoaded()}"></script>

</svelte:head>


{#key $reDrawCurves}
  <div class="w-max bg-white" bind:this={element}>

    <!-- musí být první aby nepřekrýval popupy -->
    <Connection  page ={element}/> 
    <Connection2 page ={element} />
    <Library />
    <ConnectionBackground />
    <Planning />    
    <Calendar bind:gapiLoaded={gapiLoaded} bind:gisLoaded={gisLoaded} />
  </div>
{/key}

<div id="start" bind:this={start1}>start</div>
<br />
<div id="end" bind:this={end1}>end</div>

Visit<a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
