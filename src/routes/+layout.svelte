<script>
      import { onMount } from "svelte";
// Your selected Skeleton theme:
import '@skeletonlabs/skeleton/themes/theme-skeleton.css';

// This contains the bulk of Skeletons required styles:
import '@skeletonlabs/skeleton/styles/skeleton.css';

// Finally, your application's global stylesheet (sometimes labeled 'app.css')
import '../app.css';

const action = (node) => {
    console.log("******************action layout");
}

onMount(()=>{
 console.log("******************onMount layout");
});

</script>

<h1 use:action>Layout TOP</h1>
<slot />
<h1>Layout BOTTOM</h1>