import { get, derived, writable } from "svelte/store";
import { ordered_distributions, distributions_locations } from "$lib/stores/planningStore.js";
import { ordered_shelves, shelves_locations } from "$lib/stores/libraryStore.js";

export const curvesToDraw = writable(null);
export const reDrawCurves = writable(null);

export const calculateCurves = () => {

  let ordered_shelves_value = get(ordered_shelves);
  let ordered_distributions_value = get(ordered_distributions);
  let shelves_locations_value = get(shelves_locations);
  let distributions_locations_value = get(distributions_locations);

  console.log("/// creating new curvesss /// ");
  // if (ordered_distributions_value != null) {
  //   console.log("coordered_distributions_value:" + ordered_distributions_value);
  // }
  // if (ordered_shelves_value != null) {
  //   console.log("ordered_shelves_value:" + ordered_shelves_value);
  // }
  // if (ordered_distributions_value != null && ordered_shelves_value != null) {
  //   console.log("-------------ordered_distributions_value lenght: " + ordered_distributions_value.length);
  //   console.log("-------------distributions_locations_value lenght: " + Object.keys(distributions_locations_value).length);
  //   console.log("-------------ordered_shelves_value lenght: " + ordered_shelves_value.length);
  //   console.log("-------------shelves_locations_value lenght: " + Object.keys(shelves_locations_value).length);
  // }
  // if (
  //   ordered_distributions_value == null ||
  //   Object.keys(distributions_locations_value).length != ordered_distributions_value.length ||
  //   ordered_shelves_value == null ||
  //   Object.keys(shelves_locations_value).length != ordered_shelves_value.length
  // ) {
  //   return null;
  // }

  const curves = [];
  for (let i = 0; i < ordered_distributions_value.length; i++) {
    const distribution = ordered_distributions_value[i];

    if (distribution.connection == null || distribution.connection.shelves_names.lenght == 0) {
      continue;
    }

    const distribution_type = distribution.connection.type;
    const distribution_name = distribution.name;
    const distribution_shelves_name = distribution.connection.shelves_names;

    const distribution_location = distributions_locations_value[distribution_name];
    const distribution_x = distribution_location.offsetLeft + Math.floor(distribution_location.offsetWidth / 2);
    const distribution_y = distribution_location.offsetTop;
    const distribution_point = { x: distribution_x, y: distribution_y };

    for (let j = 0; j < distribution_shelves_name.length; j++) {
      const shelf_name = distribution_shelves_name[j];

      const shelf_location = shelves_locations_value[shelf_name];
      if (shelf_location == undefined) {
        continue;
      }
      const shelf_x = shelf_location.offsetLeft + Math.floor(shelf_location.offsetWidth / 2);
      const shelf_y = shelf_location.offsetTop + shelf_location.offsetHeight;
      const shelf_point = { x: shelf_x, y: shelf_y };

      const curve = { shelf_point: shelf_point, distribution_point: distribution_point, distribution_type: distribution_type };
      curves.push(curve);
    }
  }

  //resetLocations();
  curvesToDraw.set(curves);
};

export const resetLocations = () => {
  console.log("------locations reseted /**/*/*/*/*/-------------------@@@@@")
  shelves_locations.set({});
  distributions_locations.set({});
};

// export const totalNumberOfShelves = writable(0);
// export const calculatedNumberOfShelves = writable(0);
// export const totalNumberOfDistributions = writable(0);
// export const calculatedNumberOfDistributions = writable(0);
