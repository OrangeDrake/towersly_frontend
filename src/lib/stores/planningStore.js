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

  export const distributions_locations = writable({});