<script lang="ts">
  export let label: string;
  export let secret: undefined | string;
  export let required = true;

  let isHidden = true;

  function toggleVisibility() {
    isHidden = !isHidden;
  }
</script>

<!-- -------------------------------------------------------------------------->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="form-floating d-flex my-1">
  {#if isHidden}
    <input
      type="password"
      class="form-control"
      id="secret"
      bind:value={secret}
      {required}
    />
  {:else}
    <input
      type="text"
      class="form-control"
      id="secret"
      bind:value={secret}
      {required}
    />
  {/if}
  <label for="secret">{label}</label>

  <span
    class="input-group-text"
    role="button"
    tabindex="0"
    on:click={toggleVisibility}
  >
    {#if isHidden}
      <span class="bi bi-eye-fill" />
    {:else}
      <span class="bi bi-eye-slash-fill" />
    {/if}
  </span>
</div>
