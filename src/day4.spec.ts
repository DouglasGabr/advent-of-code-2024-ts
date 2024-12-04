import assert from "assert";
import test, { describe } from "node:test";
import { part1, part2 } from "./day4.ts";

const testInput = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

describe("day 4", () => {
  test("part 1", () => {
    assert.strictEqual(part1(testInput), 18);
  });
  test("part 2", () => {
    assert.strictEqual(part2(testInput), 9);
  });
});
