import { readFileSync } from "node:fs";
import { isMain } from "../utils.ts";

class Vector2 {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  equals(other: Vector2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  overshoots(other: Vector2): boolean {
    return this.x > other.x || this.y > other.y;
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

const Result = {
  CORRECT: 0,
  LOW: -1,
  HIGH: 1,
} as const;
type Result = (typeof Result)[keyof typeof Result];

function binarySearch(
  start: number,
  end: number,
  condition: (n: number) => Result,
): number | null {
  let low = start;
  let high = end;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    const result = condition(mid);
    if (result === Result.HIGH) {
      high = mid;
    } else if (result === Result.LOW) {
      low = mid + 1;
    } else {
      return mid;
    }
  }
  return null;
}

class Machine {
  prize: Vector2;
  aCost: number;
  bCost: number;
  buttonA: Vector2;
  buttonB: Vector2;

  constructor(
    prize: Vector2,
    buttonA: Vector2,
    aCost: number,
    buttonB: Vector2,
    bCost: number,
  ) {
    this.prize = prize;
    this.buttonA = buttonA;
    this.buttonB = buttonB;
    this.aCost = aCost;
    this.bCost = bCost;
  }

  static fromString(input: string, offset = 0): Machine {
    const [buttonAString, buttonBString, prizeString] = input.split("\n");
    const buttonA = Vector2.fromButtonString(buttonAString);
    const buttonB = Vector2.fromButtonString(buttonBString);
    const prize = Vector2.fromPrizeString(prizeString).add(
      new Vector2(offset, offset),
    );
    if (buttonA.y / buttonA.x > buttonB.y / buttonB.x) {
      return new Machine(prize, buttonA, 3, buttonB, 1);
    }
    return new Machine(prize, buttonB, 1, buttonA, 3);
  }

  calculateTokens(): null | number {
    console.log("processing machine", this.prize);
    const maxAPresses = Math.min(
      Math.ceil(this.prize.x / this.buttonA.x),
      Math.ceil(this.prize.y / this.buttonA.y),
    );
    const maxBPresses = Math.min(
      Math.ceil(this.prize.x / this.buttonB.x),
      Math.ceil(this.prize.y / this.buttonB.y),
    );
    let pushA = 0;
    let pushB = 0;
    let low = 0;
    let high = Math.max(maxAPresses, maxBPresses);
    while (high > low) {
      const mid = Math.floor((low + high) / 2);
      pushB = (this.prize.x - this.buttonA.x * mid) / this.buttonB.x;
      const destY = this.buttonA.y * mid + this.buttonB.y * pushB;
      if (destY < this.prize.y) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    pushA = low;
    pushB = Math.floor(
      (this.prize.x - this.buttonA.x * pushA) / this.buttonB.x,
    );
    if (
      this.buttonA
        .multiply(pushA)
        .add(this.buttonB.multiply(pushB))
        .equals(this.prize)
    ) {
      return pushA * this.aCost + pushB * this.bCost;
    }
    return null;
  }
}

export function part1(input: string): number {
  const machines = input.split("\n\n").map((line) => Machine.fromString(line));
  return machines
    .map((m) => m.calculateTokens())
    .filter((t) => t != null)
    .reduce((a, b) => a + b, 0);
}

export function part2(input: string): number {
  const offset = 10_000_000_000_000;
  const machines = input
    .split("\n\n")
    .map((line) => Machine.fromString(line, offset));
  return machines
    .map((m) => m.calculateTokens())
    .filter((t) => t != null)
    .reduce((a, b) => a + b, 0);
}

if (isMain(import.meta)) {
  const input = readFileSync("inputs/day13.txt", "utf8");
  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}
