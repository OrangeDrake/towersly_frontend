<script>
  import Keycloak from "keycloak-js";
  import { onMount } from "svelte";
  import Library from "$lib/components/Library.svelte";
  import { shelves } from "$lib/stores/libraryStore.js";
  import { keycloak } from "$lib/stores/keycloakStore.js";

  let loginState = "waiting for login...";

  const getData = async () => {
    const token_value = "Bearer " + $keycloak.token;
    //console.log(token_value);

    console.log("api zavolano");

    var response = await fetch("http://localhost:8090/library", {
      method: "GET",      
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
    $keycloak = new Keycloak({
      url: "http://localhost:8080",
      realm: "master",
      clientId: "t_client",
    });
    $keycloak
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
<Library />

Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
