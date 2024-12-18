import { readFileSync } from "node:fs";
import { isMain } from "../utils.ts";

class Vector2 {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  toString(): string {
    return `(${this.x},${this.y})`;
  }
}

class Robot {
  position: Vector2;
  velocity: Vector2;
  constructor(position: Vector2, velocity: Vector2) {
    this.position = position;
    this.velocity = velocity;
  }

  static fromString(s: string): Robot {
    // example: p=0,4 v=3,-3
    const parts = s.split(" ");
    const position = parts[0].split("=")[1].split(",").map(Number);
    const velocity = parts[1].split("=")[1].split(",").map(Number);
    return new Robot(
      new Vector2(position[0], position[1]),
      new Vector2(velocity[0], velocity[1]),
    );
  }

  move(width: number, height: number): void {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.x < 0) {
      this.position.x += width;
    }
    if (this.position.x >= width) {
      this.position.x -= width;
    }
    if (this.position.y < 0) {
      this.position.y += height;
    }
    if (this.position.y >= height) {
      this.position.y -= height;
    }
  }
}

function printGrid(robots: Robot[], width: number, height: number): void {
  const grid = new Array(height).fill(0).map(() => new Array(width).fill("."));
  for (const robot of robots) {
    grid[robot.position.y][robot.position.x] = "X";
  }
  console.log(grid.map((row) => row.join("")).join("\n"));
}

function calculateScore(
  robots: Robot[],
  width: number,
  height: number,
): number {
  const quadrants = [
    [
      new Vector2(0, 0),
      new Vector2(Math.floor(width / 2), Math.floor(height / 2)),
    ],
    [
      new Vector2(Math.ceil(width / 2), 0),
      new Vector2(width, Math.floor(height / 2)),
    ],
    [
      new Vector2(0, Math.ceil(height / 2)),
      new Vector2(Math.floor(width / 2), height),
    ],
    [
      new Vector2(Math.ceil(width / 2), Math.ceil(height / 2)),
      new Vector2(width, height),
    ],
  ];
  return quadrants.reduce((acc, [start, end]) => {
    const count = robots.filter((robot) => {
      const isInside =
        robot.position.x >= start.x &&
        robot.position.x < end.x &&
        robot.position.y >= start.y &&
        robot.position.y < end.y;
      // console.log(
      //   robot.position.toString(),
      //   start.toString(),
      //   end.toString(),
      //   isInside,
      // );
      return isInside;
    }).length;
    return acc * count;
  }, 1);
}

export function part1(input: string, width = 101, height = 103): number {
  const robots = input.split("\n").map(Robot.fromString);
  for (let i = 0; i < 100; i++) {
    for (const robot of robots) {
      robot.move(width, height);
    }
  }
  return calculateScore(robots, width, height);
}

function calculateMaxStraightLine(
  occupied: Set<string>,
  robot: Robot,
  width: number,
  height: number,
): number {
  const directions = [
    new Vector2(1, 0),
    new Vector2(0, 1),
    new Vector2(-1, 0),
    new Vector2(0, -1),
    new Vector2(1, 1),
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(-1, 1),
  ];
  return directions.reduce((max, direction) => {
    let count = 0;
    const position = robot.position.clone();
    position.x += direction.x;
    position.y += direction.y;
    while (
      position.x >= 0 &&
      position.x < width &&
      position.y >= 0 &&
      position.y < height &&
      occupied.has(position.toString())
    ) {
      count++;
      position.x += direction.x;
      position.y += direction.y;
    }
    return Math.max(max, count);
  }, 0);
}

export function part2(input: string, width = 101, height = 103): number {
  const robots = input.split("\n").map(Robot.fromString);
  for (let i = 1; i <= 100_000; i++) {
    for (const robot of robots) {
      robot.move(width, height);
    }
    const occupied = new Set(robots.map((r) => r.position.toString()));
    if (
      robots.some(
        (robot) =>
          calculateMaxStraightLine(occupied, robot, width, height) > 10,
      )
    ) {
      printGrid(robots, width, height);
      return i;
    }
  }
  throw new Error("Not found");
}

if (isMain(import.meta)) {
  const input = readFileSync("inputs/day14.txt", "utf8");
  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}
