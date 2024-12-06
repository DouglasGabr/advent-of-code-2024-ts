import assert from "node:assert";
import test, { describe } from "node:test";
import { part1, part2 } from "./day6.ts";

const testInput = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

describe("day 6", () => {
  test("part 1", () => {
    assert.strictEqual(part1(testInput), 41);
  });
  test("part 2", () => {
    assert.strictEqual(part2(testInput), 6);
  });
});
