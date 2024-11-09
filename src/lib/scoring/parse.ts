import { parse } from "csv-parse/sync";
import type { RaceResult } from ".";
import * as fs from "fs/promises";

async function parseFeatureRaceResults(): Promise<RaceResult[]> {
  const fileContent = await fs.readFile("data/race_results.csv", {
    encoding: "utf-8",
  });
  const csv: string[][] = parse(fileContent);
  return csv.slice(1).map((record) => {
    return {
      type: "race",
      data: {
        track: record[0],
        position: record[1],
        no: parseInt(record[2]),
        driver: record[3],
        team: record[4],
        startingGrid: record[5],
        laps: parseInt(record[6]),
        time: record[7],
        points: parseInt(record[8]),
        setFastestLap: record[9] === "Yes",
        fastestLapTime: record[10],
      },
    };
  });
}

async function parseSprintRaceResults(): Promise<RaceResult[]> {
  const fileContent = await fs.readFile("data/sprint_results.csv", {
    encoding: "utf-8",
  });
  const csv: string[][] = parse(fileContent);
  return csv.slice(1).map((record) => {
    return {
      type: "sprint",
      data: {
        track: record[0],
        position: record[1],
        no: parseInt(record[2]),
        driver: record[3],
        team: record[4],
        startingGrid: parseInt(record[5]),
        laps: parseInt(record[6]),
        time: record[7],
        points: parseInt(record[8]),
      },
    };
  });
}

export async function parseRaceResults(): Promise<RaceResult[]> {
  const [sprints, races] = await Promise.all([
    parseSprintRaceResults(),
    parseFeatureRaceResults(),
  ]);
  return [...sprints, ...races];
}
