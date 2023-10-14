<script>
  import { onMount } from "svelte";
//   import { initializeStores } from "@skeletonlabs/skeleton";
  import { Toast, toastStore  } from '@skeletonlabs/skeleton';
  // Your selected Skeleton theme:
  import "@skeletonlabs/skeleton/themes/theme-skeleton.css";

  // This contains the bulk of Skeletons required styles:
  import "@skeletonlabs/skeleton/styles/skeleton.css";

  // Finally, your application's global stylesheet (sometimes labeled 'app.css')
  import "../app.css";

//   initializeStores();

  const action = (node) => {
    console.log("******************action layout");
  };

	onMount(() => {
    console.log("******************onMount layout");
    
		window.onunhandledrejection = (e) => {
    console.log("+++++++++++++++error");
    }
  });

</script>

<h1 use:action>Layout TOP &#E2;</h1>
<slot />
<h1>Layout BOTTOM</h1>
<Toast position = "t" />