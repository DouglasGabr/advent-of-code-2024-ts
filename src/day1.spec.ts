import assert from "node:assert";
import test from "node:test";
import { part1, part2 } from "./day1.ts";

const testInput = `3   4
4   3
2   5
1   3
3   9
3   3`;

test("part 1", () => {
  assert.strictEqual(part1(testInput), 11);
});
test("part 2", () => {
  assert.strictEqual(part2(testInput), 31);
});
