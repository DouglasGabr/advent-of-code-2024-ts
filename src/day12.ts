import { readFileSync } from "node:fs";
import { isMain } from "../utils.ts";

type PositionString = string & { __positionString: never };
class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString(): PositionString {
    return `${this.x},${this.y}` as PositionString;
  }

  add(other: Position): Position {
    return new Position(this.x + other.x, this.y + other.y);
  }

  rotateLeft(): Position {
    switch (this.toString()) {
      case "0,1":
        return new Position(1, 0);
      case "-1,0":
        return new Position(0, 1);
      case "0,-1":
        return new Position(-1, 0);
      case "1,0":
        return new Position(0, -1);
      default:
        throw new Error("Invalid position");
    }
  }
  rotateRight(): Position {
    switch (this.toString()) {
      case "0,1":
        return new Position(-1, 0);
      case "1,0":
        return new Position(0, 1);
      case "0,-1":
        return new Position(1, 0);
      case "-1,0":
        return new Position(0, -1);
      default:
        throw new Error("Invalid position");
    }
  }

  equals(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }

  max(other: Position): Position {
    if (this.y < other.y) {
      return this;
    }
    if (this.y > other.y) {
      return other;
    }
    if (this.x > other.x) {
      return this;
    }
    return other;
  }

  static fromString(str: PositionString): Position {
    const [x, y] = str.split(",").map(Number);
    return new Position(x, y);
  }
}

export function part1(input: string): number {
  const counted = new Set<PositionString>();
  const regionsByType = new Map<string, Set<PositionString>[]>();
  const grid = input
    .split("\n")
    .map((line, y) =>
      line.split("").map((c, x) => [c, new Position(x, y)] as const),
    );
  const height = grid.length;
  const width = grid[0].length;
  function isInside(pos: Position): boolean {
    return pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height;
  }
  function addGardenPlot(
    expectedType: string,
    [type, position]: readonly [string, Position],
    region: Set<PositionString>,
  ) {
    if (counted.has(position.toString())) {
      return;
    }
    if (expectedType !== type) {
      return;
    }
    counted.add(position.toString());
    region.add(position.toString());
    const neighbors = [
      new Position(position.x + 1, position.y),
      new Position(position.x - 1, position.y),
      new Position(position.x, position.y + 1),
      new Position(position.x, position.y - 1),
    ];
    for (const neighbor of neighbors) {
      if (isInside(neighbor)) {
        addGardenPlot(expectedType, grid[neighbor.y][neighbor.x], region);
      }
    }
  }
  for (let y = 0; y < height; y++) {
    const row = grid[y];
    for (let x = 0; x < width; x++) {
      const [c, pos] = row[x];
      if (counted.has(pos.toString())) continue;
      const region = new Set<PositionString>();
      addGardenPlot(c, [c, pos], region);
      regionsByType.get(c)?.push(region) ?? regionsByType.set(c, [region]);
    }
  }
  let sum = 0;
  for (const regions of regionsByType.values()) {
    for (const region of regions) {
      const area = region.size;
      let perimeter = 0;
      for (const positionString of region) {
        const position = Position.fromString(positionString);
        const neighbors = [
          new Position(position.x + 1, position.y),
          new Position(position.x - 1, position.y),
          new Position(position.x, position.y + 1),
          new Position(position.x, position.y - 1),
        ];
        for (const neighbor of neighbors) {
          if (!region.has(neighbor.toString())) {
            perimeter++;
          }
        }
      }
      sum += area * perimeter;
    }
  }
  return sum;
}

export function part2(input: string): number {
  const counted = new Set<PositionString>();
  const regionsByType = new Map<string, Set<PositionString>[]>();
  const grid = input
    .split("\n")
    .map((line, y) =>
      line.split("").map((c, x) => [c, new Position(x, y)] as const),
    );
  const height = grid.length;
  const width = grid[0].length;
  function isInside(pos: Position): boolean {
    return pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height;
  }
  function addGardenPlot(
    expectedType: string,
    [type, position]: readonly [string, Position],
    region: Set<PositionString>,
  ) {
    if (counted.has(position.toString())) {
      return;
    }
    if (expectedType !== type) {
      return;
    }
    counted.add(position.toString());
    region.add(position.toString());
    const neighbors = [
      new Position(position.x + 1, position.y),
      new Position(position.x - 1, position.y),
      new Position(position.x, position.y + 1),
      new Position(position.x, position.y - 1),
    ];
    for (const neighbor of neighbors) {
      if (isInside(neighbor)) {
        addGardenPlot(expectedType, grid[neighbor.y][neighbor.x], region);
      }
    }
  }
  for (let y = 0; y < height; y++) {
    const row = grid[y];
    for (let x = 0; x < width; x++) {
      const [c, pos] = row[x];
      if (counted.has(pos.toString())) continue;
      const region = new Set<PositionString>();
      addGardenPlot(c, [c, pos], region);
      regionsByType.get(c)?.push(region) ?? regionsByType.set(c, [region]);
    }
  }
  let sum = 0;
  for (const [type, regions] of regionsByType.entries()) {
    for (const region of regions) {
      console.log("region", type, region);
      const area = region.size;
      const topRight = region.values().reduce(
        (acc, val) => {
          const position = Position.fromString(val);
          return position.max(acc);
        },
        new Position(-Infinity, Infinity),
      );
      console.log("topRight", topRight.toString());
      let sides = 0;
      const leftDirection = new Position(-1, 0);
      let direction = new Position(-1, 0);
      let caret = new Position(topRight.x, topRight.y);
      do {
        // console.log("caret", caret.toString());
        // console.log("direction", direction.toString());
        const forward = caret.add(direction);
        const right = caret.add(direction.rotateRight());
        if (region.has(right.toString())) {
          direction = direction.rotateRight();
          sides++;
          caret = right;
        } else if (region.has(forward.toString())) {
          caret = forward;
        } else {
          direction = direction.rotateLeft();
          sides++;
        }
      } while (!(caret.equals(topRight) && leftDirection.equals(direction)));
      console.log("sides", sides);
      sum += area * sides;
    }
  }
  return sum;
}

if (isMain(import.meta)) {
  const input = readFileSync("inputs/day12.txt", "utf-8");
  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}
