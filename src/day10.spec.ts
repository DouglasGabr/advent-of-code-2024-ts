import assert from "node:assert";
import test, { describe } from "node:test";
import { part1, part2 } from "./day10.ts";

const testInput = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

describe("day 10", () => {
  test("part 1", () => {
    assert.strictEqual(part1(testInput), 36);
  });
  test("part 2", () => {
    assert.strictEqual(part2(testInput), 81);
  });
});
