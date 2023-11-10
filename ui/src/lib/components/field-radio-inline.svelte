<script lang="ts">
  import type { Option } from "$lib/custom-types";

  export let title: string;
  export let name: string;
  export let value: undefined | number | string;
  export let options: Option[];
</script>

<!-- -------------------------------------------------------------------------->
<h6 class="text-muted mt-4">{title}</h6>

{#each options as { optName, optValue }}
  <div class="form-check form-check-inline mx-4">
    <input
      class="form-check-input"
      type="radio"
      {name}
      bind:group={value}
      id="{name} {optName}"
      value={optValue}
    />
    <label class="form-check-label" for="{name} {optName}">
      {optName}
    </label>
  </div>
{/each}
