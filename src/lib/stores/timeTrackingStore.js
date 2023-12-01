import { get, derived, writable } from "svelte/store";
import { ordered_shelves } from "$lib/stores/libraryStore.js";

export const elapsed = writable(0);
export const tracking = writable(null);

let time;
let last_time;
let frame;

export const updateTrackedWorkActualTime = (actualTime) => {
  const workId = get(tracking).workId;
  const shelfId = get(tracking).shelfId;
  const shelves_value = get(ordered_shelves);
  //log shelves with values in object
  console.log("shelves: " + JSON.stringify(shelves_value));

  const shelf = shelves.find((s) => s.id === shelfId);
  const work = shelf.works.find((w) => w.id === workId);
  work.actualTime = actualTime;
};

export const trackTime = () => {
  // time = window.performance.now();
  //time = Date.now();
  time = get(tracking).start;
  console.log("start time: " + time);

  (function update() {
    frame = requestAnimationFrame(update);
    // console.log("start time: " + time);
    // console.log("current time: " +  Date.now());
    // console.log("elapsed time: " + ((Date.now() - time) / 1000));
    elapsed.set(Math.floor((Date.now() - time) / 1000));
  })();
};
