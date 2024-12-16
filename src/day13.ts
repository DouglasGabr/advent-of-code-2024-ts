import { readFileSync } from "node:fs";
import { isMain } from "../utils.ts";

class Vector2 {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static fromButtonString(input: string): Vector2 {
    const match = input.match(/X\+(?<x>\d+), Y\+(?<y>\d+)/);
    if (!match) {
      throw new Error("Invalid input");
    }
    return new Vector2(
      parseInt(match.groups!.x, 10),
      parseInt(match.groups!.y, 10),
    );
  }

  static fromPrizeString(input: string): Vector2 {
    const match = input.match(/X=(?<x>\d+), Y=(?<y>\d+)/);
    if (!match) {
      throw new Error("Invalid input");
    }
    return new Vector2(
      parseInt(match.groups!.x, 10),
      parseInt(match.groups!.y, 10),
    );
  }
}

class Machine {
  prize: Vector2;
  buttonA: Vector2;
  buttonB: Vector2;

  constructor(prize: Vector2, buttonA: Vector2, buttonB: Vector2) {
    this.prize = prize;
    this.buttonA = buttonA;
    this.buttonB = buttonB;
  }

  static fromString(input: string): Machine {
    const [buttonAString, buttonBString, prizeString] = input.split("\n");
    const buttonA = Vector2.fromButtonString(buttonAString);
    const buttonB = Vector2.fromButtonString(buttonBString);
    const prize = Vector2.fromPrizeString(prizeString);
    return new Machine(prize, buttonA, buttonB);
  }
}

export function part1(input: string): number {
  const machines = input.split("\n\n").map(Machine.fromString);
  console.log(machines);
}

export function part2(input: string): number {}

if (isMain(import.meta)) {
  const input = readFileSync("inputs/day13.txt", "utf8");
  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}
