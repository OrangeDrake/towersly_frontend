<script> 
  import Keycloak from "keycloak-js";
  import { shelves } from '$lib/stores/libraryStore.js';
  import { onMount } from "svelte";

  let keycloak;   
  
  let loginState = "waiting for login...";

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

  function initKeycloak() {
    keycloak = new Keycloak({
      url: "http://localhost:8080",
      realm: "master",
      clientId: "t_client",
    });
    keycloak
      .init({
        onLoad: "login-required",
      })
      .then((auth) => {
        if (auth) {
          loginState = "logged in";
          getData();
          
        }
      })
      .catch(function () {
        alert("failed to initialize");
      });
  }

  onMount(() => {
    console.log("onMount");
    initKeycloak();

  });
</script>

<h1>Welcome to SvelteKit</h1>
<div>{loginState}</div>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the
  documentation  

  {#if $shelves == null}
    <div>Loading Shelves...</div>
  {:else}
    {#each Object.values($shelves) as shelf, i}
      <h1>
        {shelf.name}
      </h1>
      <h3>Works:</h3>
      {#each Object.values(shelf.works) as work, j}
        <p>
          {"- " + j + " " + work.name}
        </p>
      {/each}
    {/each}
  {/if}
</p>
