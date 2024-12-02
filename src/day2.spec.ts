import assert from "node:assert";
import test from "node:test";
import { part1, part2 } from "./day2.ts";

const testInput = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

test("part 1", () => {
  assert.strictEqual(part1(testInput), 2);
});
test("part 2", () => {
  assert.strictEqual(part2(testInput), 4);
});
