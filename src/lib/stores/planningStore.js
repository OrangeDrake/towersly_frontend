import { writable, derived } from 'svelte/store';

export const distributions = writable(null);

export const ordered_distributions = derived(distributions, (distributions) => {
    if (distributions == null) {
      return null;
    }
    return distributions.sort((a, b) => {
      return a.rank - b.rank;
    });
  });


  const  distributions_locations_map = {}

  export const distributions_locations = writable({});

  export const addToDistributionsLocations = (distributionName, newLocation) => {
    console.log("in distrubion ading/////////////////////////////////////")
    distributions_locations_map[distributionName] = newLocation;
    distributions_locations.set(distributions_locations_map);
  } 