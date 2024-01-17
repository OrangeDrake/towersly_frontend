<script>
    import { keycloak } from "$lib/stores/keycloakStore.js";
    import { distributions } from "$lib/stores/planningStore.js";
    import {PUBLIC_API_URL} from "$env/static/public";
    let name = "";
  
    const addDistribution = async () => {
      const token_value = "Bearer " + $keycloak.token;
      const response = await fetch(PUBLIC_API_URL + "/planning/adddistribution", {
        method: "POST",
        headers: {
          Authorization: token_value,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name}),
      });
      const n_distribution = await response.json();
      distributions.update((distributions) => [...distributions, n_distribution]);
      console.log(Object.values($distributions));
    };
  </script>

<div class="card p-2 m-2 h-50 w-72 border-dotted border-4 border-orange-200 h-min">
    <div class="card-header p-2 m-2 w-64">
      <label class="label">
        <svg class="inline-block w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 14h6m-3 3v-6M1.857 1h4.286c.473 0 .857.384.857.857v4.286A.857.857 0 0 1 6.143 7H1.857A.857.857 0 0 1 1 6.143V1.857C1 1.384 1.384 1 1.857 1Zm10 0h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857h-4.286A.857.857 0 0 1 11 6.143V1.857c0-.473.384-.857.857-.857Zm-10 10h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H1.857A.857.857 0 0 1 1 16.143v-4.286c0-.473.384-.857.857-.857Z"/>
          </svg>
        <span class = "text-stone-600">Name:</span>
        <input bind:value={name} class="input p-1 rounded" type="text" />
      </label>
      <button
        type="button"
        class="btn btn-sm m-2 variant-filled bg-green-500"
        on:click={() => {
          addDistribution();
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
        Add Distribution</button
      >
    </div>
  </div>