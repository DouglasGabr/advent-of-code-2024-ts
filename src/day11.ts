import { readFileSync } from "fs";
import { isMain } from "../utils.ts";

export function part1(input: string): number {
  const stones = input.split(" ").map(Number);
  return calculateFinalStones(stones, 25);
}

function calculateStoneOutput(stone: number): number[] {
  if (stone === 0) {
    return [1];
  }
  const stringStone = stone.toString();
  if (stringStone.length % 2 === 0) {
    const firstHalf = stringStone.slice(0, stringStone.length / 2);
    const secondHalf = stringStone.slice(stringStone.length / 2);
    return [Number(firstHalf), Number(secondHalf)];
  }
  return [stone * 2024];
}

function calculateFinalStones(stones: number[], blinks: number): number {
  let stonesCopy = stones.slice();
  const cache = new Map<number, number[]>();
  while (!stonesCopy.every((s) => cache.has(s))) {
    stonesCopy = stonesCopy
      .filter((stone) => !cache.has(stone))
      .flatMap((stone) => {
        const calculated = calculateStoneOutput(stone);
        cache.set(stone, calculated);
        return calculated;
      });
  }
  let counts = new Map(stones.map((stone) => [stone, 1] as [number, number]));
  for (let i = 0; i < blinks; i++) {
    const nextCounts = new Map<number, number>();
    for (const [stone, count] of counts) {
      for (const nextStone of cache.get(stone)!) {
        nextCounts.set(nextStone, (nextCounts.get(nextStone) ?? 0) + count);
      }
    }
    counts = nextCounts;
  }
  return counts.values().reduce((acc, count) => acc + count, 0);
}

export function part2(input: string): number {
  const stones = input.split(" ").map(Number);
  return calculateFinalStones(stones, 75);
}

if (isMain(import.meta)) {
  const input = readFileSync("inputs/day11.txt", "utf8");
  console.log("Part 1", part1(input));
  console.log("Part 2", part2(input));
}
