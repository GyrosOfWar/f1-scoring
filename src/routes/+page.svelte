<script lang="ts">
  import {
    Default2024ScoringSystem,
    getDrivers,
    getDriverStandings,
    LinearScoringSystem,
    teamColors,
    type DriverStanding,
    type RaceResult,
  } from "$lib/scoring";
  let { data }: { data: { raceResults: RaceResult[] } } = $props();

  let scoringSystem = $state("default");
  let drivers = $derived(getDrivers(data.raceResults));
  let driverStandings = $derived(
    getDriverStandings(
      drivers,
      scoringSystem === "default"
        ? new Default2024ScoringSystem()
        : new LinearScoringSystem(),
      data.raceResults,
    ),
  );

  function getWidth(driver: DriverStanding): string {
    const maxPoints = driverStandings[0].points;
    const width = (driver.points / maxPoints) * 100;
    return `${width}%`;
  }
</script>

<section class="prose mb-4 max-w-none">
  <h1>F1 scoring</h1>
  {#if scoringSystem === "default"}
    <p>Using default 2024 scoring rules.</p>
  {:else if scoringSystem === "linear"}
    <p>
      Using 'linear' scoring. (i.e. winner gets 20 points, everyone below that
      gets one point less, so that 20th place gets one point).
    </p>
  {/if}

  <select
    class="select select-bordered"
    onchange={(e) => {
      scoringSystem = e.currentTarget.value;
    }}
  >
    <option value="default" selected={scoringSystem === "default"}>
      Default 2024 scoring
    </option>
    <option value="linear" selected={scoringSystem === "linear"}>
      Linear scoring
    </option>
  </select>
</section>

<section class="relative flex flex-col gap-1">
  {#each driverStandings as driver}
    <div
      class="truncate p-2"
      title={driver.driver.name}
      style="width: {getWidth(driver)}; background-color: {teamColors[
        driver.driver.team
      ].background}; color: {teamColors[driver.driver.team].text};"
    >
      {driver.driver.name} ({driver.driver.team}), {driver.points} pts
    </div>
  {/each}
</section>
