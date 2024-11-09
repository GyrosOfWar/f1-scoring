<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<main class="container mx-auto mt-4 px-1">{@render children()}</main>
