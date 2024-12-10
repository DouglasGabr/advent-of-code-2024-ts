import assert from "assert";
import test, { describe } from "node:test";
import { part1, part2 } from "./day9.ts";

const testInput = `2333133121414131402`;

describe("day 9", () => {
  test("part 1", () => {
    assert.strictEqual(part1(testInput), 1928);
  });
  test("part 2", () => {
    assert.strictEqual(part2(testInput), 2858);
  });
});
