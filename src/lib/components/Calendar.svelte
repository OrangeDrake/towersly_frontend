<script>
    import {afterUpdate} from "svelte";
    import {
        createSlot,
        plan,
        generatePlan,
        clearGeneratedAndRefresh,
        generateButton_location
    } from "$lib/stores/calendarStore.js";
    import {popup} from "@skeletonlabs/skeleton";
    import {storePopup} from "@skeletonlabs/skeleton";
    import {toastStore} from "@skeletonlabs/skeleton";
    import {computePosition, autoUpdate, offset, shift, flip, arrow} from "@floating-ui/dom";
    import {resetLocations, calculateCurves} from "$lib/stores/connectionStore.js";
    import {resetLocations2, calculateCurves2} from "$lib/stores/connectionStore2.js";
    import {
        ordered_distributions,
        distributions_locations,
        distributions,
        addToDistributionsLocations
    } from "$lib/stores/planningStore.js";
    import {ordered_shelves_names, ordered_shelves, shelves_locations} from "$lib/stores/libraryStore.js";
    import {tick} from 'svelte';
    import {tracking} from "$lib/stores/timeTrackingStore.js";


    storePopup.set({computePosition, autoUpdate, offset, shift, flip, arrow});

    let element;

    let toastRuleAddad = {
        message: "",
        hideDismiss: true,
        timeout: 10000,
        background: "bg-green-500",
        position: "r",
        padding: "p-4",
    };

    const targer_popup = "calendar";

    const popupFeatured = {
        event: "click",
        target: targer_popup,
        placement: "top",
    };

    let slot_start = "";
    let slot_duration = "";
    let slot_day = "mo";

    const gapLinesLeft = 25;
    const hoursLinesCount = 24;
    const hoursLinesWidth = 1900;
    const hoursHeight = 40;
    const daysLinesCount = 8;
    const daysLinesHeight = 1000;
    const daysWidth = 260;

    const hoursNumberwidth = 80;

    const gapBottom = 40;
    const gapTop = 20;
    const gapRight = 40;
    const gapHoursNumberLeft = 20;

    const minutesInDay = 1440;

    let generateButtonElement;
    let offsetTop;
    let offsetLeft;
    let offsetWidth;
    let offsetHeight;

    const getElementLocation = () => {
        if (generateButtonElement != null) {
            offsetTop = generateButtonElement.offsetTop;
            offsetLeft = generateButtonElement.offsetLeft;
            offsetWidth = generateButtonElement.offsetWidth;
            offsetHeight = generateButtonElement.offsetHeight;
            const location = {
                offsetTop: offsetTop,
                offsetLeft: offsetLeft,
                offsetWidth: offsetWidth,
                offsetHeight: offsetHeight
            };
            console.log("*+*+*+*+*++*+**+*+location got: " + JSON.stringify(location));
            $generateButton_location = location;
        }
    };

    const addSlot = () => {
        let isPLaced = createSlot(slot_day, slot_start, slot_duration);

        if (!isPLaced) {
            toastRuleAddad.background = "bg-yellow-200";
            toastRuleAddad.message = "Position is occupied.";
            toastStore.trigger(toastRuleAddad);
            return;
        }

        toastRuleAddad.background = "bg-green-500";
        toastRuleAddad.message = "Custom slot Added";
        toastStore.trigger(toastRuleAddad);
    };

    const dayToXCoordinate = (day) => {
        switch (day) {
            case "mo":
                return hoursNumberwidth;
            case "tu":
                return hoursNumberwidth + daysWidth;
            case "we":
                return hoursNumberwidth + daysWidth * 2;
            case "th":
                return hoursNumberwidth + daysWidth * 3;
            case "fr":
                return hoursNumberwidth + daysWidth * 4;
            case "sa":
                return hoursNumberwidth + daysWidth * 5;
            case "su":
                return hoursNumberwidth + daysWidth * 6;
        }
    };

    const timeToYCoordinate = (time) => {
        return gapTop + (time / minutesInDay) * (hoursHeight * 24) + hoursHeight;
    };

    const durationToLength = (time) => {
        return (time / 60) * hoursHeight;
    };

    // $ :  {
    //   if (Object.keys($distributions_locations).length == $ordered_distributions.length) {
    //   getElementLocation();
    //   }
    // }

    $: {
        if (element != null && $ordered_distributions != null && $ordered_shelves != null && Object.keys($distributions_locations).length === $ordered_distributions.length && Object.keys($shelves_locations).length === $ordered_shelves.length) {

            getElementLocation();
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>curves2 calculated******************************");
            calculateCurves();
            calculateCurves2();
            resetLocations();
            resetLocations2();
        }
    }

    // const culculateCurves = async () => {

    //       await tick();
    //       if (element == null){
    //           return;
    //       }
    //       getElementLocation();
    //       calculateCurves2();
    //       resetLocations();
    //       resetLocations2();
    // }

    //culculateCurves();

    afterUpdate(() => {
        getElementLocation();
    });
</script>

<div class="ml-2 m-0 mt-0 p-5 bg-white"></div>

<div class="ml-2 p-2 pb-10 bg-white" bind:this={element}>
    <!-- <div class="ml-2 p-2 pb-10"> -->
    <svg class="inline-block w-7 h-7 text-gray-800 dark:text-white" aria-hidden="true"
         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
        <path
                fill="currentColor"
                d="M6 1a1 1 0 0 0-2 0h2ZM4 4a1 1 0 0 0 2 0H4Zm7-3a1 1 0 1 0-2 0h2ZM9 4a1 1 0 1 0 2 0H9Zm7-3a1 1 0 1 0-2 0h2Zm-2 3a1 1 0 1 0 2 0h-2ZM1 6a1 1 0 0 0 0 2V6Zm18 2a1 1 0 1 0 0-2v2ZM5 11v-1H4v1h1Zm0 .01H4v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM10 11v-1H9v1h1Zm0 .01H9v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM10 15v-1H9v1h1Zm0 .01H9v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM15 15v-1h-1v1h1Zm0 .01h-1v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM15 11v-1h-1v1h1Zm0 .01h-1v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM5 15v-1H4v1h1Zm0 .01H4v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM2 4h16V2H2v2Zm16 0h2a2 2 0 0 0-2-2v2Zm0 0v14h2V4h-2Zm0 14v2a2 2 0 0 0 2-2h-2Zm0 0H2v2h16v-2ZM2 18H0a2 2 0 0 0 2 2v-2Zm0 0V4H0v14h2ZM2 4V2a2 2 0 0 0-2 2h2Zm2-3v3h2V1H4Zm5 0v3h2V1H9Zm5 0v3h2V1h-2ZM1 8h18V6H1v2Zm3 3v.01h2V11H4Zm1 1.01h.01v-2H5v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H5v2h.01v-2ZM9 11v.01h2V11H9Zm1 1.01h.01v-2H10v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H10v2h.01v-2ZM9 15v.01h2V15H9Zm1 1.01h.01v-2H10v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H10v2h.01v-2ZM14 15v.01h2V15h-2Zm1 1.01h.01v-2H15v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H15v2h.01v-2ZM14 11v.01h2V11h-2Zm1 1.01h.01v-2H15v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H15v2h.01v-2ZM4 15v.01h2V15H4Zm1 1.01h.01v-2H5v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H5v2h.01v-2Z"
        />
    </svg>
    <span class="text-stone-600 text-lg font-bold">Calendar</span>

    <div class="flex flex-nowrap">
        <button class="btn btn-sm m-2 variant-filled rounded" use:popup={popupFeatured}>Create Custom Slot</button>

        <button
                type="button"
                class="btn btn-sm m-2 variant-filled bg-amber-800"
                on:click={() => {
        clearGeneratedAndRefresh();
      }}
        >
            <svg class="p-1 w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            Drop Generated Slots
        </button
        >

        <button
                bind:this={generateButtonElement}
                type="button"
                class="btn btn-sm m-2 variant-filled rounded"
                on:click={() => {
        generatePlan();
      }}
        >
            <svg class="inline-block w-7 h-7 text-white dark:text-white" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97"/>
            </svg>

            <span class="text-lg">Implements rules</span></button
        >
    </div>

    <div class="card m-2 p-2 m-2S pb-10 w-min">
        <svg height={daysLinesHeight + gapBottom} width={hoursLinesWidth + gapRight}>
            <!-- <text x="0" y={gapTop} textLength="100px" lengthAdjust="spacingAndGlyphs"> neco</text> -->

            {#each Array(hoursLinesCount) as _, index (index)}
                <text x={gapHoursNumberLeft} y={hoursHeight * (index + 1) + 5 + gapTop} class="small">{index}</text>
                <line x1={gapLinesLeft} y1={hoursHeight * (index + 1) + gapTop} x2={hoursLinesWidth}
                      y2={hoursHeight * (index + 1) + gapTop} style="stroke:rgb(0,0,0);stroke-width:0.25"/>
            {/each}

            {#each Array(daysLinesCount) as _, index (index)}
                <line x1={daysWidth * index + hoursNumberwidth} y1="0" x2={daysWidth * index + hoursNumberwidth}
                      y2={daysLinesHeight} style="stroke:rgb(0,0,0);stroke-width:0.5"/>
            {/each}

            {#each Object.entries($plan) as [day, slots], index (day)}
                {#each slots as slot, i}
                    <rect
                            x={dayToXCoordinate(day) + 1}
                            y={timeToYCoordinate(slot.start) + 1}
                            rx="3"
                            ry="3"
                            width={daysWidth - 10}
                            height={durationToLength(slot.duration) - 2}
                            style={slot.isGenerated ? "fill:rgb(100,116,139);stroke:rgb(255,255,255)" : "fill:rgb(50,50,50);stroke:rgb(255,255,255)"}
                    />
                {/each}
            {/each}
        </svg>
    </div>

    <div class="p-4 w-72 shadow-xl bg-orange-200 border-solid border-2" data-popup={targer_popup}>
        <select class="select p-1 m-1" size="1" bind:value={slot_day}>
            <option value="mo">Monday</option>
            <option value="tu">Tuesday</option>
            <option value="we">Wednesday</option>
            <option value="th">Thursday</option>
            <option value="fr">Friday</option>
            <option value="sa">Saturday</option>
            <option value="su">Sunday</option>
        </select>

        <label class="label">
            <span>Start</span>
            <input bind:value={slot_start} class="input p-1 rounded" type="time"/>
        </label>

        <label class="label">
            <span>Duration</span>
            <input bind:value={slot_duration} class="input p-1 rounded" type="time"/>
        </label>
        <button
                type="button"
                class="btn btn-sm m-2 variant-filled bg-green-500"
                on:click={() => {
        addSlot();
      }}
        >
            <svg class="p-1 w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            Add Slot
        </button
        >
    </div>
</div>

<style>
    .small {
        font: italic 16px sans-serif;
    }
</style>
