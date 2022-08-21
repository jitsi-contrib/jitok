<script lang="ts">
  export let secret: string;

  let isHidden = true;

  function toggleVisibility() {
    isHidden = !isHidden;
  }
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-floating d-flex my-1">
  {#if isHidden}
    <input
      type="password"
      class="form-control"
      id="secret"
      bind:value={secret}
      required
    />
  {:else}
    <input
      type="text"
      class="form-control"
      id="secret"
      bind:value={secret}
      required
    />
  {/if}
  <label for="secret">secret</label>

  <span class="input-group-text" on:click={toggleVisibility}>
    {#if isHidden}
      <span class="bi bi-eye-fill" />
    {:else}
      <span class="bi bi-eye-slash-fill" />
    {/if}
  </span>
</div>
