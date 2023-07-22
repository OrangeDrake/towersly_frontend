<script>

  import { keycloak } from "$lib/stores/keycloakStore.js";
  export let shelf;

  let work_name = "name";

  const addWork = async () => {
    const token_value = "Bearer " + $keycloak.token;

    var parametr = { id: shelf.id };
    var url = new URL("http://localhost:8090/library/addwork");
    url.searchParams.append("id",shelf.id);

    // for (let k in data) {
    //   url.searchParams.append(k, data[k]);
    // }
   
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token_value,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: work_name }),
    });

    const new_work = await response.json();
    console.log(Object.values(new_work));
    
  };

</script>

<div class="card p-2 m-2 w-56">
  <div class="card-header p-2 m-2 w-52">
    <strong>{shelf.name}</strong>
  </div>
  <h3>Works:</h3>
  {#each Object.values(shelf.works).slice(0, 4) as work, j}
    <p>
      {"- " + j + " " + work.name}
    </p>
  {/each}
  {#if shelf.works.length > 5}
    <p>...</p>
  {/if}

  <label class="label">
    <span>+ Add Work</span>
    <input
      bind:value={work_name}
      class="input"
      type="text"
      placeholder="Input"
    />
  </label>
  <button
    type="button"
    class="btn btn-sm m-2 variant-filled"
    on:click={() => {
      addWork();
    }}>Add Work</button
  >
</div>
