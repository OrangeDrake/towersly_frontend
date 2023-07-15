<script>  
  import { shelves } from "$lib/stores/libraryStore.js";
  let name = "ahoj";
</script>

<div class="card p-2 m-2 h-50 w-56 border-dotted border-2 border-indigo-600">
  <div class="card-header p-2 m-2 w-52">
    <label class="label">
      <span>Input</span>
      <input   bind:value={name} class="input" type="text" placeholder="Input" />
    </label>
    <button type="button" class="btn variant-filled" on:click={() => { console.log("tlacitko zmacknuto: " + name) }}>Add Shelf</button>
  </div>
  
</div>
