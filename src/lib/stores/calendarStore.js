import { get, derived, writable } from "svelte/store";
import { ordered_distributions, distributions } from "$lib/stores/planningStore.js";

// export const plan = writable({
//   mo: [
//     { distribution: "dis1", start: 0, duration: 60 },
//     { distribution: "dis1", start: 500, duration: 90 },
//   ],
//   su: [{ distribution: "dis1", start: 1100, duration: 30 }],
// });

export const plan = writable({});
export const createdSlots = writable({});

export const createSlot = (day, start, duration) => {
  const startInMinutes = hoursWithMinutesToMinutes(start);
  const durationInMinutes = hoursWithMinutesToMinutes(duration);

  let createdSlotsValue = get(createdSlots);
  let planValue = get(plan);

  // console.log('createdSlotsValue:'  + JSON.stringify(createdSlotsValue, null,2))
  const slotToPlace = { start: startInMinutes, duration: durationInMinutes, isGenerated: false };
  console.log("slotToPlace:" + JSON.stringify(slotToPlace, null, 2));
  placeExact(day, slotToPlace, planValue);
  // console.log('createdSlotsValue:'  + JSON.stringify(createdSlotsValue, null,2))
  plan.set(planValue);
};

const clearPlan = () => {
  plan.set([]);
};

const hoursWithMinutesToMinutes = (time) => {
  const hoursAndMinutes = time.split(":");
  const hours = parseInt(hoursAndMinutes[0]);
  const minutes = parseInt(hoursAndMinutes[1]);
  return hours * 60 + minutes;
};

const placeExact = (day, slotToPlace, generatedPlan) => {
  if (slotToPlace.start + slotToPlace.duration > 1440) {
    // bude NAHRAZENO MAXIMALNIM CASEM
    return false;
  }
  const slots = generatedPlan[day];
  if (slots == null) {
    generatedPlan[day] = [slotToPlace];
    return true;
  }
  console.log(Object.values(slots));
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];

    if (slotToPlace.start + slotToPlace.duration <= slot.start) {
      generatedPlan[day] = [...slots.slice(0, i), slotToPlace, ...slots.slice(i)];
      return true;
    }
    if (slotToPlace.start < slot.start + slot.duration) {
      return false;
    }
  }
  slots.push(slotToPlace);
  return true;
};

const placeLater = (day, slotToPlace, generatedPlan) => {
  let slots = generatedPlan[day];

  if (slots == null) {
    slots = [];
  }

  let nStart = slotToPlace.start;
  let maxEnd = 1440;

  for (let i = 0; i < slots.length - 1; i++) {
    nStart = slots[i].start + slots[i].duration;
    maxEnd = slots[i + 1].start;

    if (nStart + slotToPlace.duration <= maxEnd) {
      slotToPlace.start = nStart;
      generatedPlan[day] = [...slots.slice(0, i), slotToPlace, ...slots.slice(i)];
      return true;
    }
  }

  if (slots.length != 0) {
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
        const placed = placeLater(day, slotToPlace, generatedPlan);
        // console.log("in apply option");
        if (placed) {
          return true;
        }
        break;
    }
  }
};

export const generatePlan = () => {
  //   clearPlan();
  //   let generatedPlan = {};
  let generatedPlan = get(plan);
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
        const slotToPlace = { distribution: ordered_distributions_value[i].name, rule: rules[j].name, start: startInMinutes, duration: durationInMinutes, isGenerated: true };
        const day = days[k];

        let placed = placeExact(day, slotToPlace, generatedPlan);
        if (!placed) {
          placed = applyOption(day, slotToPlace, generatedPlan, rules[j].options);
        }
        // tady se rozhone jestli ruse umistilo den př 0/5 -> 1/5
      }
    }
  }
  plan.set(generatedPlan);
};
