import assert from "node:assert";
import test, { describe } from "node:test";
import { part1, part2 } from "./day8.ts";

const testInput = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;

describe("day 8", () => {
  test("part 1", () => {
    assert.strictEqual(part1(testInput), 14);
  });
  test("part 2", () => {
    assert.strictEqual(part2(testInput), 34);
  });
});