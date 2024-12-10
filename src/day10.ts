import { readFileSync } from "fs";
import { isMain } from "../utils.ts";

function isInside(map: number[][], x: number, y: number) {
  return y >= 0 && y < map.length && x >= 0 && x < map[y].length;
}

function followTrail(
  map: number[][],
  x: number,
  y: number,
): [number, number][] {
  // prettier-ignore
  const neighbors = [
              [0, -1], 
      [-1, 0],        [1, 0],
              [0,  1],
    ];
  const trailEnds: [number, number][] = [];
  for (const [dx, dy] of neighbors) {
    let xx = x + dx;
    let yy = y + dy;
    if (!isInside(map, xx, yy)) continue;
    if (map[yy][xx] - map[y][x] !== 1) continue;
    if (map[yy][xx] === 9) {
      trailEnds.push([xx, yy]);
      continue;
    } else {
      trailEnds.push(...followTrail(map, xx, yy));
    }
  }
  return trailEnds;
}

export function part1(input: string): number {
  const map = input
    .trim()
    .split("\n")
    .map((line) => line.split("").map((c) => parseInt(c, 10)));
  let sum = 0;
  for (const [y, row] of map.entries()) {
    for (const [x, cell] of row.entries()) {
      if (cell !== 0) continue;
      const trailEnds = followTrail(map, x, y);
      const unique = new Set(trailEnds.map(([x, y]) => `${x},${y}`));
      sum += unique.size;
    }
  }
  return sum;
}
export function part2(input: string): number {
  const map = input
    .trim()
    .split("\n")
    .map((line) => line.split("").map((c) => parseInt(c, 10)));
  let sum = 0;
  for (const [y, row] of map.entries()) {
    for (const [x, cell] of row.entries()) {
      if (cell !== 0) continue;
      const trailEnds = followTrail(map, x, y);
      sum += trailEnds.length;
    }
  }
  return sum;
}

if (isMain(import.meta)) {
  const input = readFileSync("inputs/day10.txt", "utf8");
  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}
