<script>
  import { curves } from "$lib/stores/connectionStore.js";

  $: {
    console.log("curves2");
    console.log($curves);
  }
</script>

<div class="ml-2 h-8 bg-gradient-to-b from-sky-200 to-sky-300 flex" >

  <div>-</div>
  <div>-</div>
  <div>-</div>
  <div>-</div>
  <div>-</div>

</div>