<script>
  import { onMount } from "svelte";
  import Keycloak from "keycloak-js";
  import { Toast, toastStore } from "@skeletonlabs/skeleton";
  import "@skeletonlabs/skeleton/themes/theme-skeleton.css";
  import "@skeletonlabs/skeleton/styles/skeleton.css";
  import "../app.css";

  import { shelves } from "$lib/stores/libraryStore.js";
  import { distributions } from "$lib/stores/planningStore.js";
  import { keycloak } from "$lib/stores/keycloakStore.js";
  import { API_URL } from "$lib/components/Constants.svelte";
  import { tracking, trackTime } from "$lib/stores/timeTrackingStore.js";

  let loginState = "waiting for login...";

  const getShelves = async () => {
    const token_value = "Bearer " + $keycloak.token;
    console.log("URL" + API_URL);
    var response = await fetch(API_URL + "/library", {
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

    var response = await fetch(API_URL + "/planning", {
      method: "GET",
      headers: {
        Authorization: token_value,
      },
    });

    const data = await response.json();

    $distributions = data;
  };

  const getTimeTracking = async () => {
    const token_value = "Bearer " + $keycloak.token;

    var response = await fetch(API_URL + "/profile/tracking", {
      method: "GET",
      headers: {
        Authorization: token_value,
      },
    });

    console.log("##########response: " + JSON.stringify(response));

    // if (!Object.keys(response.body).length) {
    //   console.log("##########tracking empty ");
    //   $tracking = null;
    //   return;
    // }

    const data = await response.json();
    console.log("##########tracking: " + JSON.stringify($tracking));

    if (!Object.keys(data).length) {
      console.log("##########tracking empty ");
      return;
    }

    $tracking = data;
    trackTime();

    //   if (tracking != null) {
    //     console.log("#######tracking started");
    //     trackTime();
    //   }
  };

  async function initKeycloak() {
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
          getTimeTracking();
        }
      })
      .catch(function () {
        alert("failed to initialize");
      });

    // try {
    //   const authenticated = await $keycloak.init();
    //   console.log(`User is ${authenticated ? "authenticated" : "not authenticated"}`);
    // } catch (error) {
    //   console.error("Failed to initialize adapter:", error);
    // }
  }

  onMount(() => {
    initKeycloak();
    console.log("*********************onMount page");
  });
</script>

<div>{loginState}</div>
<slot />

<h1>Layout BOTTOM</h1>
<Toast position="t" />
