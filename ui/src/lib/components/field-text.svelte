<script lang="ts">
  export let name: string;
  export let value: string;
  export let required = false;
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-floating my-1">
  <input type="text" class="form-control" id={name} bind:value {required} />
  <label for={name}>{name}</label>
</div>
