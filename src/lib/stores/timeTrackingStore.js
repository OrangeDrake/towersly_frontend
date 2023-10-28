import { get, derived, writable } from "svelte/store";

export const elapsed = writable(0);
export const tracking = writable(null);

let time;
let last_time;
let frame; 



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
      elapsed.set(Math.floor(( Date.now() - time) / 1000));
    })();
  };