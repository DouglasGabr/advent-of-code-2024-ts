import { readFileSync } from "fs";
import { isMain } from "../utils.ts";
import assert from "assert";

type PositionString = string & { __position: never };

class Position {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  toString(): PositionString {
    return `(${this.x},${this.y})` as PositionString;
  }

  add(direction: Direction): Position {
    switch (direction) {
      case Direction.Up: {
        return new Position(this.x, this.y - 1);
      }
      case Direction.Down: {
        return new Position(this.x, this.y + 1);
      }
      case Direction.Left: {
        return new Position(this.x - 1, this.y);
      }
      case Direction.Right: {
        return new Position(this.x + 1, this.y);
      }
    }
  }

  equals(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }
}

const Direction = {
  Up: "^",
  Down: "v",
  Left: "<",
  Right: ">",
} as const;
type Direction = (typeof Direction)[keyof typeof Direction];

class Guard {
  position: Position;
  direction: Direction;
  constructor(position: Position, direction: Direction) {
    this.position = position;
    this.direction = direction;
  }

  moveForward(): Position {
    return this.position.add(this.direction);
  }

  rotateRight(): Direction {
    switch (this.direction) {
      case Direction.Up: {
        return Direction.Right;
      }
      case Direction.Right: {
        return Direction.Down;
      }
      case Direction.Down: {
        return Direction.Left;
      }
      case Direction.Left: {
        return Direction.Up;
      }
    }
  }
}

class LabMap {
  guard: Guard;
  obstacles: Set<PositionString>;
  width: number;
  height: number;
  visited: Map<PositionString, Set<Direction>>;
  placed: Position | null = null;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.obstacles = new Set();
    this.guard = new Guard(new Position(0, 0), Direction.Right);
    this.visited = new Map();
  }

  step(): "inside" | "outside" | "loop" {
    if (
      this.visited
        .get(this.guard.position.toString())
        ?.has(this.guard.direction)
    ) {
      return "loop";
    }
    this.visited
      .get(this.guard.position.toString())
      ?.add(this.guard.direction) ??
      this.visited.set(
        this.guard.position.toString(),
        new Set([this.guard.direction]),
      );
    const nextPosition = this.guard.moveForward();
    if (this.obstacles.has(nextPosition.toString())) {
      this.guard.direction = this.guard.rotateRight();
      return "inside";
    }
    this.guard.position = nextPosition;
    return this.isPositionInMap(nextPosition) ? "inside" : "outside";
  }

  isPositionInMap(position: Position): boolean {
    return (
      position.x >= 0 &&
      position.x < this.width &&
      position.y >= 0 &&
      position.y < this.height
    );
  }

  toString(): string {
    let result = "";
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const position = new Position(x, y);
        if (this.guard.position.equals(position)) {
          result += this.guard.direction;
        } else if (this.visited.has(position.toString())) {
          const directions = this.visited.get(position.toString())!;
          if (directions.size === 1) {
            result += Array.from(directions)[0];
          } else {
            result += "+";
          }
        } else if (this.obstacles.has(position.toString())) {
          result += this.placed?.equals(position) ? "O" : "#";
        } else {
          result += ".";
        }
      }
      result += "\n";
    }
    return result;
  }

  static fromInput(input: string): LabMap {
    const rows = input.split("\n");
    const height = rows.length;
    const width = rows[0].length;
    const map = new LabMap(width, height);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const char = rows[y][x];
        switch (char) {
          case ".": {
            break;
          }
          case "#": {
            map.obstacles.add(new Position(x, y).toString());
            break;
          }
          case Direction.Down:
          case Direction.Up:
          case Direction.Left:
          case Direction.Right: {
            const guardPosition = new Position(x, y);
            map.guard = new Guard(guardPosition, char);
            break;
          }
          default: {
            assert.fail(`Invalid character ${char}`);
          }
        }
      }
    }
    return map;
  }

  copy(): LabMap {
    const map = new LabMap(this.width, this.height);
    map.guard = new Guard(this.guard.position, this.guard.direction);
    map.obstacles = new Set(this.obstacles);
    map.visited = new Map(
      this.visited.entries().map(([k, v]) => [k, new Set(v)] as const),
    );
    return map;
  }
}

export function part1(input: string): number {
  const map = LabMap.fromInput(input);
  while (map.step() === "inside") {}
  return map.visited.size;
}

export function part2(input: string): number {
  const map = LabMap.fromInput(input);
  let loopPossibilities = 0;
  while (map.step() === "inside") {
    const copy = map.copy();
    const placed = copy.guard.position.add(copy.guard.direction);
    copy.obstacles.add(placed.toString());
    copy.placed = placed;
    let copyResult = copy.step();
    while (copyResult === "inside") {
      copyResult = copy.step();
    }
    if (copyResult === "loop") {
      console.log(copy.toString());
      loopPossibilities++;
    }
  }
  return loopPossibilities;
}

if (isMain(import.meta)) {
  const input = readFileSync("inputs/day6.txt", "utf8");
  console.log("part 1:", part1(input));
  console.log("part 2:", part2(input));
}
