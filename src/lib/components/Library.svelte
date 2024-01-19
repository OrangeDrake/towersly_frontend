<script>
    import {ordered_shelves, numberOfVisibleWork, workDisplayChange} from "$lib/stores/libraryStore.js";
    import {toastStore} from "@skeletonlabs/skeleton";
    import {popup} from "@skeletonlabs/skeleton";
    import {keycloak} from "$lib/stores/keycloakStore.js";
    import {storePopup} from "@skeletonlabs/skeleton";
    import {computePosition, autoUpdate, offset, shift, flip, arrow} from "@floating-ui/dom";
    import {dndzone} from "svelte-dnd-action";
    import Shelf from "$lib/components/Shelf.svelte";
    import AddShelf from "$lib/components/AddShelf.svelte";
    import TimeTracing from "$lib/components/TimeTracing.svelte";
    import {reDrawCurves} from "$lib/stores/connectionStore.js";
    import {PUBLIC_API_URL} from "$env/static/public";

    storePopup.set({computePosition, autoUpdate, offset, shift, flip, arrow});

    const flipDurationMs = 300;

    let toastShelf = {
        message: "",
        hideDismiss: true,
        timeout: 10000,
        background: "bg-green-500",
        position: "r",
        padding: "p-4",
    };

    let shelves;
    let shelvesToDisplay;

    $:{
        shelves = $ordered_shelves;
        shelvesToDisplay = shelves;
    }
    const changeNumberOfVisibleWork = async () => {

        const token_value = "Bearer " + $keycloak.token;
        console.log("URL" + PUBLIC_API_URL);
        var response = await fetch(PUBLIC_API_URL + "/settings/setworksnumber?" + new URLSearchParams({'numberOfVisibleWorks': $numberOfVisibleWork}), {
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
        shelvesToDisplay = e.detail.items;
    }

    async function handleDndFinalize(e) {
        //shelves = e.detail.items;
        console.log("shelves pred presunem: " + JSON.stringify(shelves))
        const shelvesUpdate = {
            shelves: [],
            maxRank: 0
        };
        const shelfRollback = [];

        let currentIndex = 0;
        let lastRank = 0;
        let wasMovedDeleted = false;
        let wasMovedInserted = false;
        let movedShelf = null;
        let newMovedRank = -1;

        console.log("e.detail.info.id: " + e.detail.info.id);
        while (currentIndex < e.detail.items.length) {
            console.log("currentIndex: " + currentIndex + ":shelves[currentIndex].id: " + shelves[currentIndex].id);
            console.log("shelves move 0");
            if (shelves[currentIndex].id == e.detail.info.id && e.detail.items[currentIndex].id == e.detail.info.id) { //presunuti na miste
                console.log("shelves move 1");
                break;
            }
            if (shelves[currentIndex].id == e.detail.info.id) {
                console.log("shelves move 2")
                movedShelf = shelves[currentIndex]
                wasMovedDeleted = true;
                currentIndex++;
                continue;
            } else if (e.detail.items[currentIndex].id == e.detail.info.id) { //vkladame
                console.log("shelves move 3")
                if (wasMovedDeleted) { //uz bylo mazano vkladame za
                    console.log("shelves move 4")
                    let currentRank = shelves[currentIndex].rank;
                    let nextRank = shelves[currentIndex].rank + 1; //predpokladame ze jsme na konci
                    if (currentIndex + 1 < shelves.length) {
                        nextRank = shelves[currentIndex + 1].rank;
                    }
                    newMovedRank = Math.ceil((currentRank + nextRank) / 2);
                    console.log("newMovedRank:" + newMovedRank);
                    movedShelf = e.detail.items[currentIndex];
                    lastRank = newMovedRank;
                    currentIndex++//rovnou jsme za vkladany
                } else { ////nebylo mazano vkladame pred
                    let currentRank = shelves[currentIndex].rank;
                    newMovedRank = Math.ceil((lastRank + currentRank) / 2);
                    lastRank = newMovedRank;
                }

            if (currentIndex >= shelves.length) {
                break;
            }

            if (shelves[currentIndex].rank <= lastRank) {
                shelfRollback.push({id: shelves[currentIndex].id, rank: shelves[currentIndex].rank});
                shelves[currentIndex].rank = shelves[currentIndex].rank + 1;
                shelvesUpdate.shelves.push({id: shelves[currentIndex].id, rank: shelves[currentIndex].rank});
            }
            currentIndex++;
            lastRank = shelves[currentIndex].rank;
        }

        shelfRollback.push({id: movedShelf.id, rank: movedShelf.rank});
        movedShelf.rank = newMovedRank;
        shelvesUpdate.shelves.push({id: movedShelf.id, rank: movedShelf.rank});

        console.log("shelves pred razenim: " + JSON.stringify(shelves))

        shelves.sort((a, b) => {
            return a.rank - b.rank;
        });

        const update_shelves = shelvesUpdate.shelves; // hledani max ranku
        for (let i = 0; i < update_shelves.length; i++) {
            if (update_shelves[i].rank > shelvesUpdate.maxRank) {
                shelvesUpdate.maxRank = update_shelves[i].rank;
            }
        }

        const response = await fetch(PUBLIC_API_URL + "/library/updateshelves", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + $keycloak.token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(shelvesUpdate),
        });

        if (!response.ok) {
            console.log("response: " + response);
            console.log("update works failed");
            toastShelf.background = "bg-yellow-200";
            toastShelf.message = "Works move failed";
            toastStore.trigger(toastShelf);
            //shelf.works = works_backup;
            //invalidateAll();
            console.log("shelfRollback: " + JSON.stringify(shelfRollback));
            for (let i = 0; i < shelfRollback.length; i++) {
                for (let j = 0; j < shelves.length; j++) {
                    if (shelves[j].id == shelfRollback[i].id) {
                        shelves[j].rank = shelfRollback[i].rank;
                        break;
                    }
                }
            }
            $reDrawCurves = "work moved: " + new Date().getTime();
            return;
        }

        toastShelf.background = "bg-green-500";
        toastShelf.message = "Work " + movedShelf.name + " moved";
        toastStore.trigger(toastShelf);
        $reDrawCurves = "shelves moved: " + new Date().getTime();

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
                                                    type="number" min="0" step="1"
                                                    on:change={onChangeNumberOfVisibleWork}/></span>
    </div>

    {#if shelvesToDisplay == null}
        <div>Loading Shelves...</div>
    {:else}
        <div class="flex flex-nowrap">
            <section class="flex flex-nowrap"
                     use:dndzone={{ items: shelvesToDisplay, flipDurationMs, type:'columns' }}
                     on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
                {#each shelvesToDisplay as shelf, i (shelf.id)}
                    <div animate:flip={{ duration: flipDurationMs }}>
                        <Shelf {shelf}/>
                    </div>
                {/each}
            </section>
            <AddShelf/>
        </div>
    {/if}
</div>
