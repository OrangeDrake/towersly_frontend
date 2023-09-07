import { get, derived, writable } from "svelte/store";
import { ordered_distributions, distributions } from "$lib/stores/planningStore.js";

export const plan = writable({
  mo: [
    { distribution: "dis1", start: 0, duration: 60 },
    { distribution: "dis1", start: 500, duration: 90 },
  ],
  su: [{ distribution: "dis1", start: 1100, duration: 30 }],
});

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
  console.log("-------------slotToPlace: " + Object.values(slotToPlace));
  if (slotToPlace.start + slotToPlace.duration > 1440) {
    // bude NAHRAZENO MAXIMALNIM CASEM
    console.log("-------out og day------slotToPlace: " + Object.values(slotToPlace));
    return false;
  }
  console.log("-******1------------slotToPlace: " + Object.values(slotToPlace));
  const slots = generatedPlan[day];
  console.log("-******2------------slotToPlace: " + Object.values(slotToPlace));
  if (slots == null) {
    console.log("-------first slot------slotToPlace: " + Object.values(slotToPlace));
    generatedPlan[day] = [slotToPlace];
    return true;
  }
  console.log("-******3------------slotToPlace: " + Object.values(slotToPlace));
  console.log(Object.values(slots));
  for (let i = 0; i < slots.length; i++) {
    console.log("-------in cycle------slotToPlace: " + Object.values(slotToPlace));
    const slot = slots[i];

    if (slotToPlace.start + slotToPlace.duration <= slot.start) {
      // let slotsTest = JSON.parse([{distribution: "dis1", start: 0, duration: 60 }, {distribution: "dis1", start: 500, duration: 90 }]);
      // slotsTest.
      console.log("-------in insert------slotToPlace: " + Object.values(slotToPlace));
      generatedPlan[day] = [...slots.slice(0, i), slotToPlace, ...slots.slice(i)];
      return true;
    }
    if (slotToPlace.start < slot.start + slot.duration) {
      return false;
    }
  }
  console.log("-------pushed------slotToPlace: " + Object.values(slotToPlace));
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

const applyOption =(day, slotToPlace, generatedPlan, options) => {
    for (let i = 0; i < options.length ; i++){
        const option = options[i];
        switch (option) {
            case "sl":
                const placed = placeLater (day, slotToPlace, generatedPlan);
                // console.log("in apply option");
                if(placed){
                    return true;
                }
                break;
        }        
    }
}

export const generatePlan = () => {
  clearPlan();
  const generatedPlan = {};
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
        const slotToPlace = { distribution: ordered_distributions_value[i].name, rule: rules[j].name, start: startInMinutes, duration: durationInMinutes };
        const day = days[k];

        let placed = placeExact(day, slotToPlace, generatedPlan);
        if (!placed){
            placed = applyOption(day, slotToPlace, generatedPlan, rules[j].options);
        }
        // tady se rozhone jestli ruse umistilo den př 0/5 -> 1/5
      }
    }
  }
  plan.set(generatedPlan);
};
