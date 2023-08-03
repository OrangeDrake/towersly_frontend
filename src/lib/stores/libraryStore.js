import { writable, derived } from "svelte/store";

export const shelves = writable(null);

export const ordered_shelves = derived(shelves, (shelves) => {
  if (shelves == null) {
    return null;
  }
  return shelves.sort((a, b) => {
    return a.rank - b.rank;
  });
});

export const shelves_location = writable({});

export const connection_coordinates_library = derived(ordered_shelves, shelves_location, (ordered_shelves, shelves_wides) => {
  let coordinates = [];
  const coordinate = 0;
    for (let i = 0; i < ordered_shelves.length; i++) {
          

  }
});
