import assert from "assert";
import test, { describe } from "node:test";
import { part1, part2 } from "./day3.ts";

const testInput = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;
const testInput2 = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

describe("day 3", () => {
  test("part 1", () => {
    assert.strictEqual(part1(testInput), 161);
  });
  test("part 2", () => {
    assert.strictEqual(part2(testInput2), 48);
  });
});
