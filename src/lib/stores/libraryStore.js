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

const shelves_locations_map = {}

export const shelves_locations = writable({});

export const addTohShelvesLocations = (shelfName, newLocation) => {
  shelves_locations_map[shelfName] = newLocation;
  shelves_locations.set(shelves_locations_map);
} 

// export const shelves_location_number = derived(shelves_locations, (shelves_locations) => shelves_locations.lenghth)


export const ordered_shelves_names = derived(ordered_shelves, (ordered_shelves) =>{
  if (ordered_shelves == null){
    return null;
  }
  return ordered_shelves.map((s) => {return s.name});
});






// export const connection_coordinates_library = derived(ordered_shelves, shelves_location, (ordered_shelves, shelves_wides) => {
//   let coordinates = [];
//   const coordinate = 0;
//     for (let i = 0; i < ordered_shelves.length; i++) {
          

//   }
// });
