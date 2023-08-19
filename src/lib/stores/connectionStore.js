import { derived } from 'svelte/store';
import { ordered_distributions, distributions_locations } from "$lib/stores/planningStore.js";
import { ordered_shelves, shelves_locations} from "$lib/stores/libraryStore.js";

export const curves = derived([ordered_distributions, distributions_locations, shelves_locations, ordered_shelves],
    ([ordered_distributions, distributions_locations, shelves_locations, ordered_shelves]) => {
        console.log("/// creating new curvesss /// ");
        if(ordered_distributions != null){
            console.log("coordered_distributions:" + ordered_distributions);            
        }
        if(ordered_shelves != null){
            console.log("ordered_shelves:" + ordered_shelves);            
        }
        if (ordered_distributions != null && ordered_shelves != null ){
        console.log("-------------ordered_distributions lenght: " + ordered_distributions.length);
        console.log("-------------distributions_locations lenght: " + Object.keys(distributions_locations).length);
        console.log("-------------ordered_shelves lenght: " + ordered_shelves.length);
        console.log("-------------shelves_locations lenght: " +  Object.keys(shelves_locations).length);
        }
        if (ordered_distributions == null || Object.keys(distributions_locations).length != ordered_distributions.length || ordered_shelves == null || Object.keys(shelves_locations).length  != ordered_shelves.length){
            return null;
        }
       
        const curves = [];      
        for (let i = 0; i < ordered_distributions.length; i++){
           
            const distribution = ordered_distributions[i];

            if(distribution.connection == null || distribution.connection.shelves_names.lenght == 0){
                continue;
            }

            const distribution_type = distribution.connection.type;
            const distribution_name = distribution.name;
            const distribution_shelves_name = distribution.connection.shelves_names;

            const distribution_location = distributions_locations[distribution_name];
            const distribution_x = distribution_location.offsetLeft + Math.floor(distribution_location.offsetWidth/2);
            const distribution_y= distribution_location.offsetTop
            const distribution_point = {x : distribution_x, y : distribution_y }
            
            for (let j = 0; j < distribution_shelves_name.length; j++){

                const shelf_name = distribution_shelves_name[j];

                const shelf_location = shelves_locations[shelf_name];
                if(shelf_location == undefined){
                    continue;
                }
                const shelf_x = shelf_location.offsetLeft + Math.floor(shelf_location.offsetWidth/2);
                const shelf_y = shelf_location.offsetTop +shelf_location.offsetHeight;
                const shelf_point = {x : shelf_x, y : shelf_y };

                const curve = {shelf_point: shelf_point, distribution_point: distribution_point, distribution_type: distribution_type };                
                curves.push(curve);
        }
    }
    return curves;
    });


