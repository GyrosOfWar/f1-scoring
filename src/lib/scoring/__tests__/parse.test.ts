import { describe, expect, it } from "vitest";
import { parseRaceResults } from "../parse";

describe("fetchRaceResults", () => {
  it("should return all feature race results as a list of objects", async () => {
    const data = await parseRaceResults();
    expect(data).toHaveLength(519);
  });
});
