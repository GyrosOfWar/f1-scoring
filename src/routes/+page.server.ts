import {
  Default2024ScoringSystem,
  getDrivers,
  getDriverStandings,
} from "$lib/scoring";
import { parseRaceResults } from "$lib/scoring/parse";

export const load = async (event) => {
  const raceResults = await parseRaceResults();
  const drivers = getDrivers(raceResults);
  const driverStandings = getDriverStandings(
    drivers,
    new Default2024ScoringSystem(),
    raceResults,
  );

  return {
    raceResults,
    drivers,
    driverStandings,
  };
};
