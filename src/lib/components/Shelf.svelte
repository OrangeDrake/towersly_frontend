<script>
  export let shelf;
</script>

<div class="card p-2 m-2  h-50 w-56">
  <div class="card-header p-2 m-2 w-52">
    <strong>{shelf.name}</strong>
  </div>
  <h3>Works:</h3>
  {#each Object.values(shelf.works) as work, j}
    <p>
      {"- " + j + " " + work.name}
    </p>
  {/each}
</div>
