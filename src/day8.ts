import { readFileSync } from "fs";
import { isMain, todo } from "../utils.ts";

type PointString = string & { __point: never };
class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString(): PointString {
    return `${this.x},${this.y}` as PointString;
  }

  difference(other: Point): Point {
    return new Point(this.x - other.x, this.y - other.y);
  }

  add(other: Point): Point {
    return new Point(this.x + other.x, this.y + other.y);
  }

  normalize(): Point {
    return new Point(Math.sign(this.x), Math.sign(this.y));
  }

  step(direction: Point): Point {
    return this.add(direction);
  }
}

export function part1(input: string): number {
  const antinodes = new Set<string>();
  const antennas = new Map<string, Point[]>();
  const rows = input.split("\n");
  const width = rows[0].length;
  const height = rows.length;
  function isInside(point: Point) {
    return point.x >= 0 && point.x < width && point.y >= 0 && point.y < height;
  }
  for (const [y, line] of rows.entries()) {
    for (const [x, char] of line.split("").entries()) {
      if (char === ".") continue;
      const point = new Point(x, y);
      antennas.get(char)?.push(point) ?? antennas.set(char, [point]);
    }
  }
  for (const points of antennas.values()) {
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < points.length; j++) {
        if (i === j) {
          continue;
        }
        const diff = points[i].difference(points[j]);
        const antinode1 = points[i].add(diff);
        const antinode2 = points[j].difference(diff);
        if (isInside(antinode1)) {
          antinodes.add(antinode1.toString());
        }
        if (isInside(antinode2)) {
          antinodes.add(antinode2.toString());
        }
      }
    }
  }
  return antinodes.size;
}

export function part2(input: string): number {
  const antinodes = new Set<string>();
  const antennas = new Map<string, Point[]>();
  const rows = input.split("\n");
  const width = rows[0].length;
  const height = rows.length;
  function isInside(point: Point) {
    return point.x >= 0 && point.x < width && point.y >= 0 && point.y < height;
  }
  for (const [y, line] of rows.entries()) {
    for (const [x, char] of line.split("").entries()) {
      if (char === ".") continue;
      const point = new Point(x, y);
      antennas.get(char)?.push(point) ?? antennas.set(char, [point]);
    }
  }
  for (const points of antennas.values()) {
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < points.length; j++) {
        if (i === j) {
          continue;
        }
        const diff = points[i].difference(points[j]);
        let antinode1 = points[i].difference(diff);
        while (isInside(antinode1)) {
          antinodes.add(antinode1.toString());
          antinode1 = antinode1.step(diff);
        }
        let antinode2 = points[j].add(diff);
        while (isInside(antinode2)) {
          antinodes.add(antinode2.toString());
          antinode2 = antinode2.step(diff);
        }
      }
    }
  }
  return antinodes.size;
}

if (isMain(import.meta)) {
  const input = readFileSync("inputs/day8.txt", "utf8");
  console.log("Part 1", part1(input));
  console.log("Part 2", part2(input));
}
