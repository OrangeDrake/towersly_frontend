<script>
  import { onMount } from "svelte";
  import Keycloak from "keycloak-js";
  import { Toast, toastStore } from "@skeletonlabs/skeleton";
  import "@skeletonlabs/skeleton/themes/theme-skeleton.css";
  import "@skeletonlabs/skeleton/styles/skeleton.css";
  import "../app.css";

  import { shelves, numberOfVisibleWork } from "$lib/stores/libraryStore.js";
  import { distributions } from "$lib/stores/planningStore.js";
  import { keycloak } from "$lib/stores/keycloakStore.js";
  import { API_URL } from "$lib/shared/Constants.svelte";
  import { tracking, trackTime } from "$lib/stores/timeTrackingStore.js";

  let loginState = "waiting for login...";

  const getShelves = async () => {
    console.log("--------------------getShelves");
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

    const data = await response.json();
    console.log("##########tracking: " + JSON.stringify($tracking));

    if (!Object.keys(data).length) {
      console.log("##########tracking empty ");
      return;
    }

    $tracking = data;
    trackTime();
  };

  const getNumberOfVisibleWork = async () => {
    const token_value = "Bearer " + $keycloak.token;

    var response = await fetch(API_URL + "/settings/worksnumber", {
      method: "GET",
      headers: {
        Authorization: token_value,
      },
    });

    const data = await response.json();
    $numberOfVisibleWork = data;
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
          getNumberOfVisibleWork();
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

<div class="font-semibold bg-white">
  <div class="flex flex-nowrap bg-gray-800">
    <div class="w-1/4 text-white p-4">
      <h2 class="text-xl mb-4">Menu</h2>
    </div>

    <div class="flex-1 p-4 pr-10">
      <div class="text-right">
        <p class="text-xl text-white">{loginState}</p>
      </div>
    </div>
  </div>

  <slot />

  <h1>Layout BOTTOM</h1>
</div>
<Toast position="t" />
