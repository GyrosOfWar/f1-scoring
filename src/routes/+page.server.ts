import { parseRaceResults } from "$lib/scoring/parse";

export const load = async () => {
  const raceResults = await parseRaceResults();

  return {
    raceResults,
  };
};
