<script>
  import { shelves } from "$lib/stores/libraryStore.js";
  import { keycloak } from "$lib/stores/keycloakStore.js";
  let name = "";

  const addShelf = async () => {
    const token_value = "Bearer " + $keycloak.token;
    const response = await fetch("http://localhost:8090/library/addshelf", {
      method: "POST",
      headers: {
        Authorization: token_value,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, works: [] }),
    });
    const n_shelf = await response.json();
    shelves.update((shelves) => [...shelves, n_shelf]);
    console.log(Object.values($shelves));
  };
</script>

<div class="card p-2 m-2 h-50 w-72 border-dotted border-2 border-orange-200">
  <div class="card-header p-2 m-2 w-64">
    <label class="label">
      <svg class= "inline-block w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11h4m-2 2V9M2 5h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm5.443-4H2a1 1 0 0 0-1 1v3h9.943l-2.7-3.6a1 1 0 0 0-.8-.4Z"/>
      </svg>
      <span class = "text-stone-600">Name:</span>
      <input bind:value={name} class="input p-1 rounded" type="text" />
    </label>
    <button
      type="button"
      class="btn btn-sm m-2 variant-filled bg-green-500"
      on:click={() => {
        addShelf();
      }}
    >
      <svg
        class="p-1 w-6 h-6 text-white dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
      Add Shelf</button
    >
  </div>
</div>
