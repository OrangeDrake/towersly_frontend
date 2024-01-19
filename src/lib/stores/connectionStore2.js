import {get, derived, writable} from "svelte/store";
import {ordered_distributions, distributions_locations} from "$lib/stores/planningStore.js";
import {generateButton_location} from "$lib/stores/calendarStore.js";

export const curvesToDraw2 = writable(null);
export const reDrawCurves = writable(null);

export const calculateCurves2 = () => {

    // let ordered_shelves_value = get(ordered_shelves);
    let ordered_distributions_value = get(ordered_distributions);
    // let shelves_locations_value = get(shelves_locations);
    let distributions_locations_value = get(distributions_locations);
    let generateButton_location_value = get(generateButton_location);

    console.log("/// creating new curvesss 2/// ");

    const curves = [];

    const generateButton_x = generateButton_location_value.offsetLeft + Math.floor(generateButton_location_value.offsetWidth / 2);
    const generateButton_y = generateButton_location_value.offsetTop;
    const generateButton_point_point = {x: generateButton_x, y: generateButton_y};
    console.log("///!!!!!!!!!!!!!!!!!!generateButton_location connection Store2:" + JSON.stringify(generateButton_location))

    for (let i = 0; i < ordered_distributions_value.length; i++) {
        const distribution = ordered_distributions_value[i];

        if (distribution.projection == null || distribution.projection.rules.lenght == 0) {
            continue;
        }

        //const distribution_type = distribution.connection.type;
        const distribution_name = distribution.name;
        console.log("///!!!!!!!!!!!distribution_name connection Store2:" + distribution_name)
        //const distribution_shelves_name = distribution.connection.shelves_names;

        const distribution_location = distributions_locations_value[distribution_name];
        console.log("///!!!!!!!!!!!!!!!!!!distribution_location connection Store2:" + JSON.stringify(distribution_location))
        const distribution_x = distribution_location.offsetLeft + Math.floor(distribution_location.offsetWidth / 2);
        const distribution_y = distribution_location.offsetTop + distribution_location.offsetHeight;
        const distribution_point = {x: distribution_x, y: distribution_y};

        //for (let j = 0; j < distribution_shelves_name.length; j++) {
        //const shelf_name = distribution_shelves_name[j];

        //const shelf_location = shelves_locations_value[shelf_name];
        //if (shelf_location == undefined) {
        //  continue;
        //}

        // const shelf_x = shelf_location.offsetLeft + Math.floor(shelf_location.offsetWidth / 2);
        // const shelf_y = shelf_location.offsetTop + shelf_location.offsetHeight;
        // const shelf_point = { x: shelf_x, y: shelf_y };

        const curve = {distribution_point: distribution_point, generateButton_point_point: generateButton_point_point};
        curves.push(curve);
        //}
    }

    //resetLocations();
    curvesToDraw2.set(curves);
};

export const resetLocations2 = () => {
    console.log("------locations reseted /**/*/*/*/*/-------------------@@@@@")
    generateButton_location.set(null);
};
