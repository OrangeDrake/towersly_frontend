<script>
    import {onMount} from "svelte";
    import Keycloak from "keycloak-js";
    import {Toast} from "@skeletonlabs/skeleton";
    import "@skeletonlabs/skeleton/themes/theme-skeleton.css";
    import "@skeletonlabs/skeleton/styles/skeleton.css";
    // import "../app.css";
    import {shelves, numberOfVisibleWork} from "$lib/stores/libraryStore.js";
    import {distributions} from "$lib/stores/planningStore.js";
    import {keycloak} from "$lib/stores/keycloakStore.js";
    import {tracking, trackTime} from "$lib/stores/timeTrackingStore.js";
    import {PUBLIC_API_URL, PUBLIC_KEYCLOAK_URL} from "$env/static/public";
    import {reDrawCurves} from "$lib/stores/connectionStore.js";

    let loginState = "waiting for login...";
    let preferedName = "";

    const logout = () => {
        $keycloak.logout();
    }

    const creteUserIfneeded = async () => {
        const token_value = "Bearer " + $keycloak.token;
        var response = await fetch(PUBLIC_API_URL + "/user/create", {
            method: "GET",
            headers: {
                Authorization: token_value,
            },
        });
    };

    const getShelves = async () => {
        console.log("--------------------getShelves");
        const token_value = "Bearer " + $keycloak.token;
        console.log("URL" + PUBLIC_API_URL);
        var response = await fetch(PUBLIC_API_URL + "/library", {
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

        var response = await fetch(PUBLIC_API_URL + "/planning", {
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

        var response = await fetch(PUBLIC_API_URL + "/profile/tracking", {
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
        if ($tracking != null) {
            $reDrawCurves = "time tracking stop: " + Date.now();
        }
        trackTime();
    };

    const getNumberOfVisibleWork = async () => {
        const token_value = "Bearer " + $keycloak.token;

        var response = await fetch(PUBLIC_API_URL + "/settings/worksnumber", {
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
            url: PUBLIC_KEYCLOAK_URL,
            realm: "master2",
            clientId: "t_client",
        });
        $keycloak
            .init({
                onLoad: "login-required",
            })
            .then((auth) => {
                if (auth) {
                    loginState = "logged in";
                    creteUserIfneeded().then(() => {
                        getShelves();
                        getDistributions();
                        getTimeTracking();
                        getNumberOfVisibleWork();
                        const userInfo =  $keycloak.loadUserInfo();
                        userInfo.then(userData =>
                        {console.log("userInfo:" + JSON.stringify(userData));
                            preferedName = userData["preferred_username"];
                            console.log(preferedName);

                        });
                        console.log("created if needed")
                    });
                }
            })
            .catch(function () {
                // alert("failed to initialize");
                console.log("failed to initialize");
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

        async function updateToken() {
            console.log("---update token");
            $keycloak.updateToken(10 * 60);
        }

        const interval = setInterval(updateToken, 9 * 60 * 1000);
        return () => clearInterval(interval);
    });


</script>

<div class="font-semibold bg-white">
    <div class="flex flex-nowrap bg-gray-800">
        <div class="text-white p-4">
            <h2 class="text-xl mb-4">Menu</h2>
        </div>

        <div class="flex-1 p-4 pr-10">
            <div class="text-right">
                <span class="text-xl text-white">{preferedName}</span>
                <button
                        type="button"
                        class="btn btn-l m-2 variant-filled bg-amber-800"
                        on:click={() => {logout();}}>
                    Logout
                </button>
            </div>
        </div>
    </div>

    <slot/>

    <h1>Layout BOTTOM</h1>
</div>
<Toast position="t"/>
