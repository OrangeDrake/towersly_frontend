import {get, derived, writable} from "svelte/store";
import {ordered_distributions, distributions} from "$lib/stores/planningStore.js";
import {shelves} from "$lib/stores/libraryStore.js";
import currentWeekNumber from "current-week-number";

const DAYS = ["mo", "tu", "we", "th", "fr", "sa", "su"];

export let plansMap = new Map();
export const plans = writable( {});
export const weekNumber = writable(currentWeekNumber());

export const year = writable(new Date().getFullYear());



// export const plan = writable({});
export const generateButton_location = writable(null);


export const createSlot = (day, start, duration) => {
    const startInMinutes = hoursWithMinutesToMinutes(start);
    const durationInMinutes = hoursWithMinutesToMinutes(duration);

    //   let createdSlotsValue = get(createdSlots);
    const plan = getSelectedPlan();

    // console.log('createdSlotsValue:'  + JSON.stringify(createdSlotsValue, null,2))
    const slotToPlace = {start: startInMinutes, duration: durationInMinutes, isGenerated: false};
    console.log("slotToPlace:" + JSON.stringify(slotToPlace, null, 2));
    let isPlaced = placeExact(day, slotToPlace, plan);
    // console.log('createdSlotsValue:'  + JSON.stringify(createdSlotsValue, null,2))
    return isPlaced;
};

export const clearGeneratedSelected = () => {;
    const plan = getSelectedPlan();
    clearGenerated(plan);
}

const clearPlan = () => {
    plan.set([]);
};

const clearGenerated = (plan) => {
    console.log("clear planValue: " + JSON.stringify(plan));
    console.log("loop generetated");
    for (const day in plan) {
        console.log("in loop");
        console.log(`${day}: ${plan[day]}`);
        const slotsInDay = plan[day];
        let isDeleted = true;
        while (isDeleted) {
            isDeleted = false;
            for (let i = 0; i < slotsInDay.length; i++) {
                const slot = slotsInDay[i];
                if (slot.isGenerated) {
                    console.log("***deleting:" + JSON.stringify(plan, null, 2));
                    slotsInDay.splice(i, 1);
                    console.log("***after deleting:" + JSON.stringify(plan, null, 2));
                    isDeleted = true;
                    break;
                }
            }
        }
    }
};

const getSelectedPlan = () => {
    const plansValue = get(plans);
    const key = "" + get(year)+get(weekNumber);
    const plan = plansValue[key];
    return plan;
}

const hoursWithMinutesToMinutes = (time) => {
    const hoursAndMinutes = time.split(":");
    const hours = parseInt(hoursAndMinutes[0]);
    const minutes = parseInt(hoursAndMinutes[1]);
    return hours * 60 + minutes;
};

const placeExact = (day, slotToPlace, plan) => {
    if (slotToPlace.start + slotToPlace.duration > 1440) {
        // bude NAHRAZENO MAXIMALNIM CASEM
        return false;
    }
    const slots = plan[day];
    if (slots == null) {
        plan[day] = [slotToPlace];
        return true;
    }
    console.log(Object.values(slots));
    for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];

        if (slotToPlace.start + slotToPlace.duration <= slot.start) {
            console.log("****1 plan:" + JSON.stringify(plan, null, 2));
            //plan[day] = [...slots.slice(0, i), slotToPlace, ...slots.slice(i)];
            slots.splice(i, 0, slotToPlace);
            console.log("****2 plan:" + JSON.stringify(plan, null, 2));
            return true;
        }
        if (slotToPlace.start < slot.start + slot.duration) {
            return false;
        }
    }
    console.log("****3 plan:" + JSON.stringify(plan, null, 2));
    slots.push(slotToPlace);
    console.log("****4 plan:" + JSON.stringify(plan, null, 2));
    return true;
};

const placeNextDaysExact = (day, slotToPlace, plan) => {
    const currentDayIndex = DAYS.indexOf(day);

    for (let i = currentDayIndex; i < DAYS.length; i++) {
        const nextDay = DAYS[i];
        if (placeExact(nextDay, slotToPlace, plan)) {
            return true;
        }
    }
    return false;
};

const placeSooner = (day, slotToPlace, plan) => {
    // prochazime od zadu
    let slots = plan[day];

    if (slots == null) {
        slots = [];
    }

    let nEnd = slotToPlace.start + slotToPlace.duration;
    let nStart = slotToPlace.start;
    let minStart;

    if (slots.length != 0) {
        // zkusit dat presne na konec
        minStart = slots[slots.length - 1].start + slotToPlace.duration;
    }

    if (nEnd > 1440) {
        return false;
    }

    if (minStart <= nStart) {
        slots.push(slotToPlace);
        return true;
    }

    for (let i = slots.length - 2; i >= 0; i--) {
        minStart = slots[i].start + slots[i].duration;
        console.log("in cycle condition continue");

        if (slotToPlace.start < minStart) {
            continue;
        }

        nEnd = slots[i + 1].start;

        console.log("in cycle: minStart: " + minStart, ",nEnd: " + nEnd);

        if (nEnd - slotToPlace.duration >= minStart) {
            slotToPlace.start = nEnd - slotToPlace.duration;
            slots.splice(i + 1, 0, slotToPlace);
            return true;
        }
    }

    if (slots.length != 0) {
        // zkusit dat na zacatek
        nEnd = slots[0].start;
    }
    minStart = 0;

    if (nEnd - slotToPlace.duration >= minStart) {
        slotToPlace.start = nEnd - slotToPlace.duration;
        slots.unshift(slotToPlace);
        return true;
    }

    return false;
};

const placeLater = (day, slotToPlace, plan) => {
    let slots = plan[day];

    if (slots == null) {
        slots = [];
    }

    let nStart = slotToPlace.start;
    let maxEnd;

    if (slots.length != 0) {
        // zkusit dat presne na zacatek
        maxEnd = slots[0].start;
    }

    if (nStart + slotToPlace.duration <= maxEnd) {
        slotToPlace.start = nStart;
        slots.unshift(slotToPlace);
        return true;
    }

    for (let i = 0; i < slots.length - 1; i++) {
        nStart = slots[i].start + slots[i].duration;

        if (slotToPlace.start > nStart) {
            continue;
        }

        maxEnd = slots[i + 1].start;

        if (nStart + slotToPlace.duration <= maxEnd) {
            // zkusit dat mezi 2 sloty
            slotToPlace.start = nStart;
            //plan[day] = [...slots.slice(0, i), slotToPlace, ...slots.slice(i)];
            slots.splice(i, 0, slotToPlace);
            return true;
        }
    }

    if (slots.length != 0) {
        // zkusit dat na konec
        nStart = slots[slots.length - 1].start + slots[slots.length - 1].duration;
    }
    maxEnd = 1440;

    if (nStart + slotToPlace.duration <= maxEnd) {
        slotToPlace.start = nStart;
        slots.push(slotToPlace);
        return true;
    }
    return false;
};

const applyOption = (day, slotToPlace, generatedPlan, options) => {
    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        switch (option) {
            case "sl":
                if (placeLater(day, slotToPlace, generatedPlan)) {
                    return true;
                }
                break;
            case "ss":
                if (placeSooner(day, slotToPlace, generatedPlan)) {
                    return true;
                }
                break;
            case "ne":
                if (placeNextDaysExact(day, slotToPlace, generatedPlan)) {
                    return true;
                }
                break;
        }
    }
    return false;
};

export const generatePlan = () => {
    const plans_value = get(plans)
    const key = "" + get(year)+get(weekNumber);
    let planValue = {};
    if(plans_value.hasOwnProperty(key)) {
        planValue = plans_value[key];
    }
    console.log("planValue " + JSON.stringify(planValue));
    clearGenerated(planValue);

    const ordered_distributions_value = get(ordered_distributions);

    console.log("in generate slot: " + ordered_distributions_value);
    for (let i = 0; i < ordered_distributions_value.length; i++) {
        console.log("<<<<");
        const projection = ordered_distributions_value[i].projection;
        if (projection == null) {
            console.log("<<<< projection null");
            continue;
        }
        const rules = projection.rules;
        if (rules == null) {
            continue;
        }
        for (let j = 0; j < rules.length; j++) {
            console.log(">>> " + ordered_distributions_value[i].name + " : " + rules[j].name);
            const days = rules[j].days;
            for (let k = 0; k < days.length; k++) {
                const startInMinutes = hoursWithMinutesToMinutes(rules[j].start);
                const durationInMinutes = hoursWithMinutesToMinutes(rules[j].duration);
                const slotToPlace = {
                    distribution: ordered_distributions_value[i],
                    shelfAndWork: getAcualShefAndWokrFromDistribution(ordered_distributions_value[i]),
                    rule: rules[j].name,
                    start: startInMinutes,
                    duration: durationInMinutes,
                    isGenerated: true
                };
                const day = days[k];

                let placed = placeExact(day, slotToPlace, planValue);
                if (!placed) {
                    placed = applyOption(day, slotToPlace, planValue, rules[j].options);
                }
                // tady se rozhone jestli ruse umistilo den př 0/5 -> 1/5
            }
        }
    }

    plans_value[key] = planValue;

    // plan.set(planValue);
};


const getAcualShefAndWokrFromDistribution = (distribution) => {
    const shelves_values =get(shelves)
    console.log("//distribution: " + JSON.stringify(distribution));
    if (distribution.connection === null || distribution.connection.shelves_names === null || distribution.connection.shelves_names.length === 0 ) {
        return "no goal";
    }
    const shelvesNames = distribution.connection.shelves_names;
    console.log( "shelvesNames :" + JSON.stringify(shelvesNames))
    if (distribution.connection.type === "concat" || !distribution.hasOwnProperty("type")) {
        for (let i = 0; i < shelvesNames.length; i++) {
            const shelfName = shelvesNames[i];
            let shelf;
            console.log( "shelves :" + JSON.stringify(shelves_values))
            for (let j = 0; j < shelves_values.length; j++) {
                if(shelfName === shelves_values[j].name) {
                    console.log(": " + shelfName + " : " +shelves_values[j].name)
                    shelf = shelves_values[j];
                    break;
                }
            }
            console.log("++shelf: " + JSON.stringify(shelf))
            if (shelf.works.length !== 0){
                return shelf.name + ": " + shelf.works[0].name;
            }
            return  shelf.name + ": no task";
        }
    }
    return "no goal2";
};

