import { writable, derived, get } from "svelte/store";

export const numberOfVisibleWork = writable(3);
export const shelves = writable(null);
export const allConnectedShelvesNames = writable(new Set());
export const workDisplayChange = writable(0);

export const ordered_shelves = derived(shelves, (shelves) => {
  if (shelves == null) {
    return null;
  }
  return shelves.sort((a, b) => {
    return a.rank - b.rank;
  });
});

const shelves_locations_map = {};

export const shelves_locations = writable({});

export const addTohShelvesLocations = (shelfName, newLocation) => {
  shelves_locations_map[shelfName] = newLocation;
  shelves_locations.set(shelves_locations_map);
};

// export const shelves_location_number = derived(shelves_locations, (shelves_locations) => shelves_locations.lenghth)

export const ordered_shelves_names = derived(ordered_shelves, (ordered_shelves) => {
  if (ordered_shelves == null) {
    return null;
  }
  return ordered_shelves.map((s) => {
    return s.name;
  });
});

export const addToAllConnectedShelvesNames = (connectedShelvesNames) => {
  console.log("-*-*-connectedShelvesNames" + Array(...connectedShelvesNames).join(" "));
  var allConnectedShelvesNames_value = get(allConnectedShelvesNames);
  connectedShelvesNames.forEach(allConnectedShelvesNames_value.add, allConnectedShelvesNames_value);
  // for (let i = 0; i < connectedShelvesNames.length; i++) {
  //   console.log("connectedShelvesNames[i]" + JSON.stringify(connectedShelvesNames[i]));
  //   allConnectedShelvesNames_value.add(connectedShelvesNames[i]);
  // }
  console.log("-*-*-allConnectedShelvesNames_value:" + Array(...allConnectedShelvesNames_value).join(" "));

  allConnectedShelvesNames.set(allConnectedShelvesNames_value);

  console.log("-*-*-allConnectedShelvesNames:" + Array(...get(allConnectedShelvesNames)).join(" "));
};

export const resetAllConnectedShelvesNames = () => {
  allConnectedShelvesNames.set(new Set());
}

export const removeFromAllConnectedShelvesNames = (connectedShelvesName) => {
  var allConnectedShelvesNames_value = get(allConnectedShelvesNames);
  //allConnectedShelvesNames_value.remove(connectedShelvesName);
  allConnectedShelvesNames_value.forEach((name) => {
    if (name == connectedShelvesName) {
      allConnectedShelvesNames_value.delete(name);
    }
  });

  allConnectedShelvesNames.set(allConnectedShelvesNames_value);
};

// export const connection_coordinates_library = derived(ordered_shelves, shelves_location, (ordered_shelves, shelves_wides) => {
//   let coordinates = [];
//   const coordinate = 0;
//     for (let i = 0; i < ordered_shelves.length; i++) {

//   }
// });
