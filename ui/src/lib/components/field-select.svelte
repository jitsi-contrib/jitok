<script lang="ts">
  import type { Option } from "$lib/custom-types";

  export let name: string;
  export let value: string;
  export let options: Option[];
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-floating my-1">
  <select class="form-select" id={name} bind:value>
    {#each options as { optName, optValue }}
      <option value={optValue}>{optName}</option>
    {/each}
  </select>
  <label for={name}>{name}</label>
</div>
