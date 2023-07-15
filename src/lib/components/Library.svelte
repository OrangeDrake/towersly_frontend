<script>
  import { shelves } from "$lib/stores/libraryStore.js";
  import { onMount } from "svelte";

  const getData = async () => {
    const token_value = "Bearer " + keycloak.token;
    //console.log(token_value);

    console.log("api zavolano");

    var response = await fetch("http://localhost:8090/library", {
      method: "GET",
      //credentials: "include",
      headers: {
        Authorization: token_value,
      },
    });

    console.log(response);
    const data = await response.json();
    console.log(data);
    $shelves = data;
  };

  onMount(() => {
    getData();
  });
</script>

{#if $shelves == null}
  <div>Loading Shelves...</div>
{:else}
  <div class="library">
    {#each Object.values($shelves) as shelf, i}
      <div class="shelf">
        <h1>
          {shelf.name}
        </h1>
        <h3>Works:</h3>
        {#each Object.values(shelf.works) as work, j}
          <p>
            {"- " + j + " " + work.name}
          </p>
        {/each}
      </div>
    {/each}
  </div>
{/if}

<style>
  .library {
    display: flex;
  }
  .shelf {  
    flex-wrap: wrap;
    width: 400px;
    padding: 5px;
    margin: 5px;
    background-color:#fff79e;
  }
</style>
