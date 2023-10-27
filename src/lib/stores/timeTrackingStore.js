import { get, derived, writable } from "svelte/store";

export const isTrackingActive = writable(false);
export const elapsed = writable(0);


export const tracking = writable(false);

let time;
let last_time;
let frame; 

export const trackTime = () => {
    time = window.performance.now();

    (function update() {
      frame = requestAnimationFrame(update);

      elapsed.set(Math.floor((window.performance.now() - time) / 1000));
    })();
  };