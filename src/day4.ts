import { readFileSync } from "fs";
import { isMain, todo } from "../utils.ts";

export function part1(input: string): number {
  const lines = input.split("\n").map((l) => l.split(""));
  let count = 0;
  function isInside(x: number, y: number): boolean {
    return x >= 0 && x < lines[0].length && y >= 0 && y < lines.length;
  }
  function getVectors(x: number, y: number): [number, number][][] {
    return [
      [
        [x, y - 1],
        [x, y - 2],
        [x, y - 3],
      ],
      [
        [x, y + 1],
        [x, y + 2],
        [x, y + 3],
      ],
      [
        [x - 1, y],
        [x - 2, y],
        [x - 3, y],
      ],
      [
        [x + 1, y],
        [x + 2, y],
        [x + 3, y],
      ],
      [
        [x - 1, y - 1],
        [x - 2, y - 2],
        [x - 3, y - 3],
      ],
      [
        [x + 1, y + 1],
        [x + 2, y + 2],
        [x + 3, y + 3],
      ],
      [
        [x - 1, y + 1],
        [x - 2, y + 2],
        [x - 3, y + 3],
      ],
      [
        [x + 1, y - 1],
        [x + 2, y - 2],
        [x + 3, y - 3],
      ],
    ];
  }
  const nextLetters = ["M", "A", "S"];
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      const char = lines[y][x];
      if (char === "X") {
        const directions = getVectors(x, y);
        for (const direction of directions) {
          const letters = direction.map(([x, y]) => {
            if (!isInside(x, y)) return null;
            return lines[y][x];
          });
          if (letters.every((l, i) => l === nextLetters[i])) {
            count++;
          }
        }
      }
    }
  }
  return count;
}

export function part2(input: string): number {
  const lines = input.split("\n").map((l) => l.split(""));
  let count = 0;
  function isInside(x: number, y: number): boolean {
    return x >= 0 && x < lines[0].length && y >= 0 && y < lines.length;
  }
  function getVectors(x: number, y: number): [string, number, number][][] {
    return [
      [
        ["M", x - 1, y - 1],
        ["S", x + 1, y + 1],
        ["M", x + 1, y - 1],
        ["S", x - 1, y + 1],
      ],
      [
        ["S", x - 1, y - 1],
        ["M", x + 1, y + 1],
        ["S", x + 1, y - 1],
        ["M", x - 1, y + 1],
      ],
      [
        ["M", x - 1, y - 1],
        ["S", x + 1, y + 1],
        ["M", x - 1, y + 1],
        ["S", x + 1, y - 1],
      ],
      [
        ["S", x - 1, y - 1],
        ["M", x + 1, y + 1],
        ["S", x - 1, y + 1],
        ["M", x + 1, y - 1],
      ],
    ];
  }
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      const char = lines[y][x];
      if (char === "A") {
        const directions = getVectors(x, y);
        for (const direction of directions) {
          if (
            direction.every(([l, x, y]) => isInside(x, y) && lines[y][x] === l)
          ) {
            count++;
          }
        }
      }
    }
  }
  return count;
}

if (isMain(import.meta)) {
  const input = readFileSync("inputs/day4.txt", "utf8");
  console.log("part 1:", part1(input));
  console.log("part 2:", part2(input));
}
