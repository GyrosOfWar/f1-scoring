export interface FeatureRaceResult {
  driver: string;
  track: string;
  position: string;
  no: number;
  team: string;
  startingGrid: string;
  laps: number;
  points: number;
  setFastestLap: boolean;
  fastestLapTime: string;
  time: string;
}

export interface SprintRaceResult {
  track: string;
  position: string;
  no: number;
  driver: string;
  team: string;
  startingGrid: number;
  laps: number;
  time: string;
  points: number;
}

export type RaceResult =
  | {
      type: "race";
      data: FeatureRaceResult;
    }
  | {
      type: "sprint";
      data: SprintRaceResult;
    };

export interface SocringSystem {
  getScore(raceResult: RaceResult): number;

  name(): string;
}

export class Default2024ScoringSystem implements SocringSystem {
  getScore(result: RaceResult): number {
    switch (result.type) {
      case "race":
        const racePositionPoints = (() => {
          const position = parseInt(result.data.position, 10) ?? 0;
          switch (position) {
            case 1:
              return 25;
            case 2:
              return 18;
            case 3:
              return 15;
            case 4:
              return 12;
            case 5:
              return 10;
            case 6:
              return 8;
            case 7:
              return 6;
            case 8:
              return 4;
            case 9:
              return 2;
            case 10:
              return 1;
            default:
              return 0;
          }
        })();
        const fastestLapPoints =
          result.data.setFastestLap && racePositionPoints > 0 ? 1 : 0;
        return racePositionPoints + fastestLapPoints;

      case "sprint":
        const position = parseInt(result.data.position, 10) ?? 0;
        switch (position) {
          case 1:
            return 8;
          case 2:
            return 7;
          case 3:
            return 6;
          case 4:
            return 5;
          case 5:
            return 4;
          case 6:
            return 3;
          case 7:
            return 2;
          case 8:
            return 1;
          default:
            return 0;
        }

      default:
        return 0;
    }
  }

  name(): string {
    return "2024 default scoring method";
  }
}

export class LinearScoringSystem implements SocringSystem {
  getScore(result: RaceResult): number {
    switch (result.type) {
      case "race":
        const racePosition = parseInt(result.data.position, 10) ?? 0;
        return racePosition > 0 ? 21 - racePosition : 0;

      case "sprint":
        const sprintPosition = parseInt(result.data.position, 10) ?? 0;
        switch (sprintPosition) {
          case 1:
            return 8;
          case 2:
            return 7;
          case 3:
            return 6;
          case 4:
            return 5;
          case 5:
            return 4;
          case 6:
            return 3;
          case 7:
            return 2;
          case 8:
            return 1;
          default:
            return 0;
        }

      default:
        return 0;
    }
  }

  name(): string {
    return "linear scoring system";
  }
}

export interface Driver {
  name: string;
  team: string;
}

export interface DriverStanding {
  driver: Driver;
  points: number;
}

export function getDriverStandings(
  drivers: Driver[],
  scoringSystem: SocringSystem,
  results: RaceResult[],
): DriverStanding[] {
  const standings: DriverStanding[] = [];

  drivers.forEach((driver) => {
    const totalPoints = results
      .filter((result) => result.data.driver === driver.name)
      .map((result) => scoringSystem.getScore(result))
      .reduce((acc, points) => acc + points, 0);

    standings.push({
      driver: driver,
      points: totalPoints,
    });
  });

  standings.sort((a, b) => b.points - a.points);
  return standings;
}

export function getDrivers(raceResults: RaceResult[]): Driver[] {
  const drivers: Driver[] = [];

  raceResults.forEach((result) => {
    if (
      !drivers.some(
        (driver) =>
          driver.name === result.data.driver &&
          driver.team === result.data.team,
      )
    ) {
      drivers.push({
        name: result.data.driver,
        team: result.data.team,
      });
    }
  });

  return drivers;
}

export const teamColors: Record<string, { background: string; text: string }> =
  {
    "Red Bull Racing Honda RBPT": {
      background: "#0600EF",
      text: "#FFF",
    },
    Ferrari: {
      background: "#DC0000",
      text: "#FFF",
    },
    Mercedes: {
      background: "#00D2BE",
      text: "#000",
    },
    "McLaren Mercedes": {
      background: "#FF8700",
      text: "#000",
    },
    "Aston Martin Aramco Mercedes": {
      background: "#006F62",
      text: "#FFF",
    },
    "Kick Sauber Ferrari": {
      background: "#9B0000",
      text: "#FFF",
    },
    "Haas Ferrari": {
      background: "#EFEFEF",
      text: "#000",
    },
    "RB Honda RBPT": {
      background: "#0600EF",
      text: "#FFF",
    },
    "Williams Mercedes": {
      background: "#005AFF",
      text: "#FFF",
    },
    "Alpine Renault": {
      background: "#0090FF",
      text: "#FFF",
    },
  };
