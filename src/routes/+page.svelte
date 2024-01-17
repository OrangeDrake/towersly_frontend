<script>
  import { afterUpdate, tick } from "svelte";

  //import {PUBLIC_API_URL} from "$env/static/public";
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

</script>

{#key $reDrawCurves}
  <div class="w-max bg-white" bind:this={element}>

    <!-- musí být první aby nepřekrýval popupy -->
    <Connection  page ={element}/> 
    <Connection2 page ={element} />
    <Library />
    <ConnectionBackground />
    <Planning />    
    <Calendar />
  </div>
{/key}

<div id="start" bind:this={start1}>start</div>
<br />
<div id="end" bind:this={end1}>end</div>

Visit<a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
