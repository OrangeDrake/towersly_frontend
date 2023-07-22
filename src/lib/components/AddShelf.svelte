<script>
  import { shelves } from "$lib/stores/libraryStore.js";
  import { keycloak } from "$lib/stores/keycloakStore.js";
  let name = "name";
  let ordered_shelves;

  $: {
    ordered_shelves =  $shelves.short_shelves((a, b) => {
      return a.rank - b.rank;
    });
    console.log("change: ")
    console.log( Object.values(short_shelves))
  }


  const addShelf = async () => {
    const token_value = "Bearer " + $keycloak.token;
    const response = await fetch("http://localhost:8090/library/addshelf", {
      method: "POST",
      headers: {
        Authorization: token_value,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, works: [] }),
    });    
    const n_library = await response.json();
    shelves.update(libraries => [...libraries, n_library]);
    console.log(Object.values($shelves))
  };
</script>

<div class="card p-2 m-2 h-50 w-56 border-dotted border-2 border-indigo-600">
  <div class="card-header p-2 m-2 w-52">
    <label class="label">
      <span>+ Add Shelf</span>
      <input bind:value={name} class="input" type="text" placeholder="Input" />
    </label>
    <button
      type="button"
      class="btn btn-sm m-2 variant-filled"
      on:click={() => {
        addShelf();
      }}>Add Shelf</button>
  </div>
</div>
