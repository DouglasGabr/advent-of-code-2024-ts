import assert from "assert";
import test, { describe } from "node:test";
import { part1 } from "./day11.ts";

const testInput = `125 17`;

describe("day 11", () => {
  test("part 1", () => {
    assert.strictEqual(part1(testInput), 55312);
  });
});
