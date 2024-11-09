<script lang="ts">
  import {
    Default2024ScoringSystem,
    getConstructorStandings,
    getDrivers,
    getDriverStandings,
    LinearScoringSystem,
    shortTeamNames,
    teamColors,
    type ConstructorStanding,
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
  let constructors = $derived(
    new Set(data.raceResults.map((r) => r.data.team)),
  );

  let constructorsStandings = $derived(
    getConstructorStandings(constructors, driverStandings),
  );

  function getDriverWidth(driver: DriverStanding): string {
    const maxPoints = driverStandings[0].points;
    const width = (driver.points / maxPoints) * 100;
    return `${width}%`;
  }

  function getConstructorWidth(constructor: ConstructorStanding): string {
    const maxPoints = constructorsStandings[0].points;
    const width = (constructor.points / maxPoints) * 100;
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

<section class="flex flex-col gap-2 lg:flex-row">
  <section class="relative flex grow flex-col gap-1">
    <h2 class="mb-2 text-center text-2xl font-bold">Drivers</h2>
    {#each driverStandings as driver}
      <div
        class="p-2"
        title={driver.driver.name}
        style="width: {getDriverWidth(driver)}; background-color: {teamColors[
          driver.driver.team
        ].background}; color: {teamColors[driver.driver.team].text};"
      >
        <span class="truncate">{driver.driver.name}, {driver.points} pts</span>
      </div>
    {/each}
  </section>

  <section class="relative flex grow flex-col gap-1">
    <h2 class="mb-2 text-center text-2xl font-bold">Constructors</h2>

    {#each constructorsStandings as constructor}
      <div
        class="p-2"
        title={shortTeamNames[constructor.name]}
        style="width: {getConstructorWidth(
          constructor,
        )}; background-color: {teamColors[constructor.name]
          .background}; color: {teamColors[constructor.name].text};"
      >
        <span class="truncate"
          >{shortTeamNames[constructor.name]}, {constructor.points} pts</span
        >
      </div>
    {/each}
  </section>
</section>

<footer class="w-full py-4 text-center">
  Credit for the data to <a
    href="https://github.com/toUpperCase78/formula1-datasets"
    class="link link-primary">toUpperCase78</a
  > on GitHub.
</footer>
