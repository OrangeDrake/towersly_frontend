<script>
    import {ordered_shelves, numberOfVisibleWork, workDisplayChange} from "$lib/stores/libraryStore.js";
    import {toastStore} from "@skeletonlabs/skeleton";
    import {popup} from "@skeletonlabs/skeleton";
    import {keycloak} from "$lib/stores/keycloakStore.js";
    import {storePopup} from "@skeletonlabs/skeleton";
    import {computePosition, autoUpdate, offset, shift, flip, arrow} from "@floating-ui/dom";
    import {dndzone} from "svelte-dnd-action";
    import {API_URL} from "$lib/components/Constants.svelte";
    import Shelf from "$lib/components/Shelf.svelte";
    import AddShelf from "$lib/components/AddShelf.svelte";
    import TimeTracing from "$lib/components/TimeTracing.svelte";
    import {reDrawCurves} from "$lib/stores/connectionStore.js";

    storePopup.set({computePosition, autoUpdate, offset, shift, flip, arrow});

    const flipDurationMs = 300;

    let shelves;

    $:{
        shelves = $ordered_shelves;
    }
    const changeNumberOfVisibleWork = async () => {

        const token_value = "Bearer " + $keycloak.token;
        console.log("URL" + API_URL);
        var response = await fetch(API_URL + "/settings/setworksnumber?" + new URLSearchParams({'numberOfVisibleWorks': $numberOfVisibleWork}), {
            method: "GET",
            headers: {
                Authorization: token_value,
            },
        });
    };


    const onChangeNumberOfVisibleWork = () => {
        console.log("První funkce byla zavolána.");
        // Zastaví předchozí odpočet (pokud existuje)
        clearTimeout($workDisplayChange);
        $workDisplayChange = setTimeout(changeNumberOfVisibleWork, 1500);
        $reDrawCurves = "work moved: " + new Date().getTime();
    };

    function handleDndConsider(e) {
        shelves = e.detail.items;
    }

    function handleDndFinalize(e) {
        shelves = e.detail.items;
    }

</script>

<div class="ml-2 p-2 pb-10 flex-nowrap">
    <div class="flex p-2 pb-1">
        <div class="flex-initial text-stone-600 text-lg font-bold">
            <svg class="inline-block flex-initial w-7 h-7 text-gray-800 dark:text-white" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 16.5c0-1-8-2.7-9-2V1.8c1-1 9 .707 9 1.706M10 16.5V3.506M10 16.5c0-1 8-2.7 9-2V1.8c-1-1-9 .707-9 1.706"
                />
            </svg>
            Library
            <hr/>
        </div>

    </div>
    <div class="flex p-3 bg-slate-300">
        <TimeTracing/>
        <span class="flex-initial align-bottom text-lg pl-1 pr-1 pt-3">Display Works:</span>
        <span class="flex-initial w-12 pt-3"><input bind:value={$numberOfVisibleWork} class="input rounded pl-1"
                                                    type="number" min="1" step="1"
                                                    on:change={onChangeNumberOfVisibleWork}/></span>
    </div>

    {#if shelves == null}
        <div>Loading Shelves...</div>
    {:else}
        <div class="flex flex-nowrap">
            <section class="flex flex-nowrap" use:dndzone={{ items: shelves, flipDurationMs, type:'columns' }}
                     on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
                {#each shelves as shelf, i (shelf.id)}
                    <div animate:flip={{ duration: flipDurationMs }}>
                        <Shelf {shelf}/>
                    </div>
                {/each}
            </section>
            <AddShelf/>
        </div>
    {/if}
</div>
