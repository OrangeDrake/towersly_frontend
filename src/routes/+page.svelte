<script>
  import Library from "$lib/components/Library.svelte";
  import Planning from "$lib/components/Planning.svelte";
  import { shelves } from "$lib/stores/libraryStore.js";
  import { distributions } from "$lib/stores/planningStore.js";
  import { keycloak } from "$lib/stores/keycloakStore.js";
  import Keycloak from "keycloak-js";
  import { onMount } from "svelte";

  let loginState = "waiting for login...";

  const getShelves = async () => {
    const token_value = "Bearer " + $keycloak.token;

    var response = await fetch("http://localhost:8090/library", {
      method: "GET",      
      headers: {
        Authorization: token_value,
      },
    });

    const data = await response.json();

    $shelves = data;
  };

  const getDistributions = async () => {
    const token_value = "Bearer " + $keycloak.token;

    var response = await fetch("http://localhost:8090/planning", {
      method: "GET",      
      headers: {
        Authorization: token_value,
      },
    });

    const data = await response.json();

    $distributions = data;
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
          getShelves();
          getDistributions();
        }
      })
      .catch(function () {
        alert("failed to initialize");
      });
  }

  onMount(() => {   
    initKeycloak();
  });
</script>

<h1>Welcome to SvelteKit</h1>
<div>{loginState}</div>
<Library />
<Planning />

Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
