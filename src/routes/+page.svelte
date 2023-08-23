<script>

  import { afterUpdate } from "svelte";
  import { shelves } from "$lib/stores/libraryStore.js";
  import { distributions } from "$lib/stores/planningStore.js";
  import { keycloak } from "$lib/stores/keycloakStore.js";
  import Keycloak from "keycloak-js";
  import { onMount } from "svelte";

  import Library from "$lib/components/Library.svelte";
  import Planning from "$lib/components/Planning.svelte";
  import Connection from "$lib/components/Connection.svelte";
  import Connection2 from "$lib/components/Connection2.svelte";
  import Calendar from "../lib/components/Calendar.svelte";

  import {API_URL} from "$lib/components/Constants.svelte";

  afterUpdate(() => {
    console.log("************page updated*******")    
   
  });
  
  let start1;
  let end1;
  let end2;

  // const drawLines = async () => {
  //   console.log("line drawing");
  //   console.log("start: " + Object.values(start1));
  //   console.log("end: " + Object.values(end1));
  //   var line;
  //   console.log("line before: " + line)
  //   line = new LeaderLine(start1, end2);
  //   console.log("line after: " + Object.values(line))

  //   line.color = "red"; // Change the color to red.
  //   line.size++; // Up size.
  //   console.log(line.size);
  //   console.log("end line drawing");
  // };

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
    console.log("*********************onMount page");
  });
</script>

<!-- <svelte:head>
  <script src="leader-line.min.js" on:load={initializeRemarkable}></script> -->
<!-- <script src="leader-line.min.js" on:load={initializeRemarkable}></script>
  <script src="leader-line.min.js"></script>
</svelte:head> -->
<div>{loginState}</div>

<div class="w-max">
<Library />
<Connection />
<Planning />
<Connection2 />
<Calendar />
</div>


<div id="start" bind:this={start1}>start</div>
<br />
<div id="end" bind:this={end1}>end</div>

Visit<a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
