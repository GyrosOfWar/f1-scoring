<script lang="ts">
  import type { Driver, DriverStanding, RaceResult } from "$lib/scoring";

  let {
    data,
  }: {
    data: {
      raceResults: RaceResult[];
      drivers: Set<Driver>;
      driverStandings: DriverStanding[];
    };
  } = $props();

  function getWidth(driver: DriverStanding): string {
    const maxPoints = data.driverStandings[0].points;
    const width = (driver.points / maxPoints) * 100;
    return `${width}%`;
  }
</script>

<div class="prose max-w-none">
  <h1>F1 scoring</h1>
  <section class="relative flex flex-col gap-1">
    {#each data.driverStandings as driver}
      <div
        class="bg-primary p-2 text-primary-content"
        style="width: {getWidth(driver)}"
      >
        <span class="truncate">{driver.driver.name} ({driver.points} pts)</span>
      </div>
    {/each}
  </section>
</div>
