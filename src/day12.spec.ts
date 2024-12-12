import assert from "node:assert";
import test, { describe } from "node:test";
import { part1, part2 } from "./day12.ts";

const testInput = `AAAA
BBCD
BBCC
EEEC`;

const testInput2 = `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`;

const testInput3 = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;

const testInput4 = `EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`;

const testInput5 = `AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`;

describe("day 12", () => {
  test("part 1", () => {
    assert.strictEqual(part1(testInput), 140);
    assert.strictEqual(part1(testInput2), 772);
    assert.strictEqual(part1(testInput3), 1930);
  });
  test("part 2", () => {
    assert.strictEqual(part2(testInput), 80);
    assert.strictEqual(part2(testInput2), 436);
    assert.strictEqual(part2(testInput4), 236);
    assert.strictEqual(part2(testInput5), 368);
    assert.strictEqual(part2(testInput3), 1206);
  });
});
