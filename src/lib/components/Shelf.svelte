<script>
    import {afterUpdate} from "svelte";
    import {popup} from "@skeletonlabs/skeleton";
    import {storePopup} from "@skeletonlabs/skeleton";
    import {toastStore} from "@skeletonlabs/skeleton";
    import {computePosition, autoUpdate, offset, shift, flip, arrow} from "@floating-ui/dom";
    import {dndzone} from "svelte-dnd-action";
    import {keycloak} from "$lib/stores/keycloakStore.js";
    //import {flip} from "svelte/animate";


    import {API_URL} from "$lib/components/Constants.svelte";
    import Work from "$lib/components/Work.svelte";
    import {addTohShelvesLocations, shelves, numberOfVisibleWork} from "$lib/stores/libraryStore.js";
    import {reDrawCurves} from "$lib/stores/connectionStore.js";
    import {
        allConnectedShelvesNames,
        ordered_shelves_names,
        ordered_shelves,
        shelves_locations
    } from "$lib/stores/libraryStore.js";

    storePopup.set({computePosition, autoUpdate, offset, shift, flip, arrow});

    const flipDurationMs = 300;

    let toastWorkCreated = {
        message: "",
        hideDismiss: true,
        timeout: 10000,
        background: "bg-green-500",
        position: "r",
        padding: "p-4",
    };

    export let shelf;

    let element;
    let offsetTop;
    let offsetLeft;
    let offsetWidth;
    let offsetHeight;

    let work_name = "";
    let work_description = "";
    let work_expected_duration_hours = 0;
    let work_expected_duration_minutes = 0;
    //let work_expected_duration = "";

    const targer_popup = "popup_shelf_" + shelf.id;

    const popupFeatured = {
        event: "click",
        target: targer_popup,
        placement: "top",
    };

    let works = shelf.works.sort((a, b) => {
        return a.rank - b.rank;
    });

    // let works = shelf.works;

    let slicedWorks = works.slice(0, $numberOfVisibleWork);

    let worksToDisplay = slicedWorks;

    const hoursAndMinutesToMinutes = (hours, minutes) => {
        return hours * 60 + minutes;
    };

    const addWork = async () => {
        const token_value = "Bearer " + $keycloak.token;
        const expectedDurationInMinutes = hoursAndMinutesToMinutes(work_expected_duration_hours, work_expected_duration_minutes);

        var url = new URL(API_URL + "/library/addwork");

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: token_value,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: work_name,
                description: work_description,
                shelfId: shelf.id,
                expectedTime: expectedDurationInMinutes
            }),
        });

        if (!response.ok) {
            toastWorkCreated.background = "bg-yellow-200";
            toastWorkCreated.message = "Work " + work_name + " create failed";
            toastStore.trigger(toastWorkCreated);
            return;
        }

        toastWorkCreated.background = "bg-green-500";
        toastWorkCreated.message = "Work " + work_name + " created";
        toastStore.trigger(toastWorkCreated);

        const n_work = await response.json();
        works.push(n_work);
        works = works;
        $shelves = $shelves;

        $reDrawCurves = "work added: " + new Date().getTime();

        resetWork();
    };

    const resetWork = () => {
        work_name = "";
        work_description = "";
        work_expected_duration_hours = 0;
        work_expected_duration_minutes = 0;
    };

    const getElementLocation = () => {
        if (element != null) {
            offsetTop = element.offsetTop;
            offsetLeft = element.offsetLeft;
            offsetWidth = element.offsetWidth;
            offsetHeight = element.offsetHeight;
            const location = {
                offsetTop: offsetTop,
                offsetLeft: offsetLeft,
                offsetWidth: offsetWidth,
                offsetHeight: offsetHeight
            };
            addTohShelvesLocations(shelf.name, location);
        }
    };

    // $: {
    // if (element != null && $ordered_distributions != null && $ordered_shelves != null && Object.keys($distributions_locations).length == $ordered_distributions.length && Object.keys($shelves_locations).length == $ordered_shelves.length) {
    //       getElementLocation();

    //   }
    // }

    afterUpdate(() => {
        console.log("shelf element updated, id: " + shelf.id);
        getElementLocation();

        // calculateCurves();
    });
    //   console.log("shelh")
    // console.log(shelf);
    console.log("Works");
    console.log(works);
    // console.log("items")slicedWslicedWorks
    // console.log(items);

    function handleDndConsider(e) {
        worksToDisplay = e.detail.items;
        //$reDrawCurves = "work moved: " + new Date().getTime();
    }

    async function handleDndFinalize(e) {
        const worksUpdate = {
            shelfId: shelf.id,
            works: [],
            maxRank: 0
        };
        const workRollback = [];

        console.log("pred razenim: " + JSON.stringify(works));

        let currentIndex = 0;
        let lastRank = 0;
        let wasMovedDeleted = false;
        let wasMovedInserted = false;
        let movedWork = null;
        let newMovedRank = -1;
        let deletedWorkIndex = -1;


        while (currentIndex < e.detail.items.length) {
            console.log("shelf name " + shelf.name + ", slicedWorks.length: " + slicedWorks.length + " e.detail.items.length: " + e.detail.items.length);
            //prochazime vsechny presouvane prvky
            //for (let currentIndex = 0; currentIndex < e.detail.items.length; currentIndex++) {
            // novy rank pro presunutou praci a zaroven posouvani ranku vsech nasledujicich prvku ale jenom ve SlicedWorks

            //if(currentIndex >= slicedWorks.length && slicedWorks.length < e.detail.length){ //presun mezi shelfy na konec
            if (currentIndex >= slicedWorks.length && movedWork == null) { // vkladana prace je na konci
                console.log("currentIndex: " + currentIndex + " slicedWorks.length: " + slicedWorks.length + " e.detail.items.length: " + e.detail.items.length);
                newMovedRank = 0; //predpokladame vkladani do prazhneho shelfu
                if (slicedWorks.length != 0) {
                    newMovedRank = works[slicedWorks.length - 1].rank + 1;
                }
                lastRank = newMovedRank;
                console.log("vlozen z jineho shelfu nakonec: " + newMovedRank);
                movedWork = e.detail.items[currentIndex]; //moved musi byt posledni
                wasMovedInserted = true;
                break;
            } else if (currentIndex >= slicedWorks.length) {
                break;
            }

            if (works[currentIndex].id == e.detail.info.id && e.detail.items[currentIndex].id == e.detail.info.id) { //presunuti na miste
                break;
            }

            if (works[currentIndex].id == e.detail.info.id) {
                // pokud je presouvany v puvodnim poradi
                movedWork = works[currentIndex];
                //works.splice(currentIndex, 1); // smazat prvek z pole
                deletedWorkIndex = currentIndex;
                wasMovedDeleted = true;
                console.log("vymazat currentIndex: " + currentIndex);
            } else if (e.detail.items[currentIndex].id == e.detail.info.id) {
                movedWork = e.detail.items[currentIndex];
                console.log("movedWork: " + JSON.stringify(movedWork));

                console.log("vkaladame na currentIndex: " + currentIndex);
                //pokud je presouvany v novem poradi
                if (wasMovedDeleted) {
                    // vkladame za current
                    let nextRank = works[currentIndex].rank + 1; //predpokladame ze vkladame na konec
                    if (currentIndex + 1 < works.length) {
                        // pokud nevkladame na konec
                        let nextRank = works[currentIndex + 1].rank;
                    }
                    console.log("next rank : " + nextRank);
                    console.log("lastRank : " + lastRank);
                    newMovedRank = Math.ceil((works[currentIndex].rank + nextRank) / 2);
                    console.log("if newMovedRank: " + newMovedRank);
                    currentIndex++; //vkladame za current, proto se pro kontrolu jestli se neprekryli ranky postoupime o jedno dopredu
                    //continue; // pokracujeme na dalsi prvek, vkladame za nejsou potreba kontroly
                } else {
                    console.log(" works[currentIndex].rank: " + works[currentIndex].rank);
                    newMovedRank = Math.ceil((lastRank + works[currentIndex].rank) / 2);
                    console.log("else newMovedRank: " + newMovedRank);
                }
                lastRank = newMovedRank;
                wasMovedInserted = true;
            }
            if (currentIndex >= works.length) {
                break;
            }
            if (wasMovedInserted && works[currentIndex].rank <= lastRank && works[currentIndex].id != e.detail.info.id) {
                // kdyz narazime na presouvany prvek neukladame ho
                workRollback.push({id: works[currentIndex].id, rank: works[currentIndex].rank});
                works[currentIndex].rank = lastRank + 1;
                worksUpdate.works.push({id: works[currentIndex].id, rank: works[currentIndex].rank});
            }
            lastRank = works[currentIndex].rank;
            currentIndex++;
        }

        if (wasMovedInserted) {
            //projiti zbytku prvku v works
            while (currentIndex < works.length) {
                if (works[currentIndex].rank <= lastRank) {
                    workRollback.push({id: works[currentIndex].id, rank: works[currentIndex].rank});
                    works[currentIndex].rank = lastRank + 1;
                    worksUpdate.works.push({id: works[currentIndex].id, rank: works[currentIndex].rank});
                }
                lastRank = works[currentIndex].rank;
                currentIndex++;
            }
        }

        if (wasMovedDeleted && wasMovedInserted) {
            // presinuti prace v ramci jednoho shelfu
            workRollback.push({id: movedWork.id, rank: movedWork.rank});
            movedWork.rank = newMovedRank;
            worksUpdate.works.push({id: movedWork.id, rank: movedWork.rank});
        }

        if (deletedWorkIndex == -1 && slicedWorks.length > e.detail.items.length) {
            //if (wasMovedDeleted && !wasMovedInserted) { aleternativa
            // smazani prace byla na konci slicedWorks
            works.splice(slicedWorks.length - 1, 1);
        }

        if (wasMovedDeleted && !wasMovedInserted) {
            // presinuti prace v ramci jednoho shelfu
            workRollback.push({id: movedWork.id, rank: movedWork.rank});// nebude stacit jenom presunout rank, ale musime prvek vlozit na spravne misto
            works.splice(deletedWorkIndex, 1);
        }

        if (!wasMovedDeleted && wasMovedInserted) {
            movedWork.rank = newMovedRank;
            console.log("!wasMovedDeleted && wasMovedInserted movedWork: " + JSON.stringify(movedWork));
            works.push(movedWork);
            worksUpdate["workNewInShelf"] = {id: movedWork.id, rank: movedWork.rank}
            worksUpdate.maxRank = movedWork.rank; // novy work v shelu muze mitmaximalni rank
        }

        const update_works = worksUpdate.works; // hledani max ranku
        for (let i = 0; i < update_works.length; i++) {
            if (update_works[i].rank > worksUpdate.maxRank) {
                worksUpdate.maxRank = update_works[i].rank;
            }
        }

        console.log("Po razeni: " + JSON.stringify(works));
        console.log("worksUpdate: " + JSON.stringify(worksUpdate));

        const response = await fetch(API_URL + "/library/updateworks", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + $keycloak.token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(worksUpdate),
        });

        console.log("before update works");
        if (!response.ok) {
            console.log("response: " + response);
            console.log("update works failed");
            toastWorkCreated.background = "bg-yellow-200";
            toastWorkCreated.message = "Works move failed";
            toastStore.trigger(toastWorkCreated);
            //shelf.works = works_backup;
            //invalidateAll();
            for (let i = 0; i < workRollback.length; i++) {
                for (let j = 0; j < works.length; j++) {
                    if (works[j].id == workRollback[i].id) {
                        works[j].rank = workRollback[i].rank;
                        break;
                    }
                }
            }
            $reDrawCurves = "work moved: " + new Date().getTime();
            return;
        }

        // const shelves2 =  $shelves;
        // $shelves = shelves2;

        //works.push({"id":5000,"name":"fake","description":"","rank":2,"expectedTime":0,"actualTime":0,"shelfId":10056,"completed":false});
        works.sort((a, b) => {
            // z nejakeho duvodu je sorted shalves o redraw pozadu, tak seradime primo prace
            return a.rank - b.rank;
        });
        $shelves = $shelves;


        if (wasMovedInserted) {
            toastStore.background = "bg-green-500";
            toastStore.message = "Work " + movedWork.name + " moved";
            toastStore.trigger(toastStore);
        }
        ;

        $reDrawCurves = "work moved: " + new Date().getTime();
        console.log("works updated");
    }
</script>

<div class="card p-2 mx-2 mt-2 mb-0 h-50 w-72 bg-slate-300 {$allConnectedShelvesNames.has(shelf.name) ? 'bordel-solid border-2 border-black' : ''} "
     bind:this={element}>
    <div class="card-header w-64 p-2 m-2">
        <svg class="inline-block w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
            <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H1Zm0 0V2a1 1 0 0 1 1-1h5.443a1 1 0 0 1 .8.4l2.7 3.6H1Z"
            />
        </svg>
        <span class="font-bold">{shelf.name}</span>
        <hr/>
    </div>

    {#if numberOfVisibleWork == 0}
        Loading Settings...
    {:else}
        <section use:dndzone={{ items: worksToDisplay, flipDurationMs }} on:consider={handleDndConsider}
                 on:finalize={handleDndFinalize}>
            <!-- <section > -->
            {#each worksToDisplay as work, j (work.id)}
                <div animate:flip={{ duration: flipDurationMs }}>
                    <Work {work} index={j} {shelf}/>
                </div>
            {/each}
            <!--{#if works.length == 0}-->
            <!--  <div>no works yet</div>-->
            <!--{/if}-->
        </section>
        {#if works.length > $numberOfVisibleWork}
            <div class="font-bold text-2xl">...</div>
        {/if}
    {/if}

    <button class="btn btn-sm m-2 variant-filled rounded" use:popup={popupFeatured}>Create Work</button>

    <div class="p-4 w-72 shadow-xl bg-orange-200 border-solid border-2" data-popup={targer_popup}>
        <label class="label">
            <span>Name</span>
            <input bind:value={work_name} class="input rounded p-1" type="text"/>
        </label>

        <label class="label">
            <span>Description</span>
            <input bind:value={work_description} class="input rounded p-1" type="text"/>
        </label>

        <label class="label">
            <span>Expected Duration</span>
            <div class="flex">
                <span class="flex-initial w-16"><input bind:value={work_expected_duration_hours}
                                                       class="input rounded p-1" type="number" min="0" step="1"/></span>
                <span class="flex-initial w-8 text-lesft pl-1 text-lg">h :</span>
                <span class="flex-initial w-16"><input bind:value={work_expected_duration_minutes}
                                                       class="input rounded p-1" type="number" min="0" max="59"
                                                       step="1"/></span>
                <span class="flex-initial w-8 text-left pl-1 text-lg">m</span>
            </div>
        </label>

        <button
                type="button"
                class="btn btn-sm m-2 variant-filled bg-amber-800"
                on:click={() => {
        resetWork();
      }}
        >
            <svg class="p-1 w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            Close
        </button
        >

        <button
                type="button"
                class="btn btn-sm m-2 variant-filled bg-green-500"
                on:click={() => {
        addWork();
      }}
        >
            <svg class="p-1 w-5 h-5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            Add Work
        </button
        >
    </div>
</div>
<!-- 
<style>
  .time-span input {
    display: flex;
  }
</style> -->
