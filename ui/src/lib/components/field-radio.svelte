<script lang="ts">
  import type { Option } from "$lib/custom-types";

  export let title: string;
  export let name: string;
  export let value: undefined | number | string;
  export let options: Option[];
</script>

<!-- -------------------------------------------------------------------------->
<h6 class="text-muted mt-4">{title}</h6>

<div class="row row-cols-auto justify-content-center">
  <div class="col">
    {#each options as { optName, optValue }}
      <div class="form-check text-start">
        <input
          class="form-check-input"
          type="radio"
          {name}
          id={optName}
          bind:group={value}
          value={optValue}
        />
        <label class="form-check-label" for={optName}>
          {optName}
        </label>
      </div>
    {/each}
  </div>
</div>
