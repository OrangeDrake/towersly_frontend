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
  let end2;

</script>

{#key $reDrawCurves}
  <div class="w-max">

    <!-- musí být první aby nepřekrýval popupy -->
    <Connection /> 
    <Connection2 />
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
