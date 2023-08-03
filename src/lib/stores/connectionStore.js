import { derived } from 'svelte/store';
import { distributions } from "$lib/stores/planningStore.js";

export const curves = derived(distributions, ($distributions) => {return $distributions});


