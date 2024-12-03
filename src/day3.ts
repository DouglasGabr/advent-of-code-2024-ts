import { readFileSync } from "fs";
import { isMain, todo } from "../utils.ts";

export function part1(input: string): number {
  const muls = input.matchAll(/mul\((?<a>\d{1,3}),(?<b>\d{1,3})\)/g);
  return muls.reduce((acc, match) => {
    const a = parseInt(match.groups!.a, 10);
    const b = parseInt(match.groups!.b, 10);
    return acc + a * b;
  }, 0);
}

export function part2(input: string): number {
  const program = input.matchAll(
    /(mul\((?<a>\d{1,3}),(?<b>\d{1,3})\))|(do\(\))|(don't\(\))/g,
  );
  let enabled = true;
  let sum = 0;
  for (const instruction of program) {
    if (instruction[0] === "do()") {
      enabled = true;
    } else if (instruction[0] === "don't()") {
      enabled = false;
    } else if (enabled) {
      const a = parseInt(instruction.groups!.a, 10);
      const b = parseInt(instruction.groups!.b, 10);
      sum += a * b;
    }
  }
  return sum;
}

if (isMain(import.meta)) {
  const input = readFileSync("inputs/day3.txt", "utf8");
  console.log("part 1:", part1(input));
  console.log("part 2:", part2(input));
}
