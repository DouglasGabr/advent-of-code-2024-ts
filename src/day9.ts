import { readFileSync } from "fs";
import { isMain, todo } from "../utils.ts";
import assert from "assert";

export function part1(input: string): number {
  assert(
    input.length % 2 === 1,
    "input length must be odd, so last element is file",
  );
  let leftFileId = 0;
  let rightFileId = (input.length - 1) / 2;
  let sum = 0;
  let pointer = 0;
  let leftFileLength = parseInt(input[leftFileId * 2], 10);
  let rightFileLength = parseInt(input[rightFileId * 2], 10);
  diskMap: while (leftFileId <= rightFileId) {
    while (leftFileLength > 0) {
      sum += leftFileId * pointer;

      leftFileLength--;
      pointer++;
    }
    if (leftFileId === rightFileId) {
      break diskMap;
    }
    const spaceIndex = leftFileId * 2 + 1;
    let spaceLength = parseInt(input[spaceIndex], 10);
    while (spaceLength > 0) {
      sum += rightFileId * pointer;
      rightFileLength--;
      spaceLength--;
      pointer++;
      if (rightFileLength === 0) {
        rightFileId--;
        if (rightFileId === leftFileId) {
          break diskMap;
        } else {
          rightFileLength = parseInt(input[rightFileId * 2], 10);
        }
      }
    }
    leftFileId++;
    if (leftFileId === rightFileId) {
      leftFileLength = rightFileLength;
    } else {
      leftFileLength = parseInt(input[leftFileId * 2], 10);
    }
  }
  return sum;
}

function* inverseRange(start: number, end: number): Generator<number> {
  for (let i = end; i > start; i--) {
    yield i;
  }
}

export function part2(input: string): number {
  assert(
    input.length % 2 === 1,
    "input length must be odd, so last element is file",
  );
  const rightFileMaxId = (input.length - 1) / 2;
  let sum = 0;
  const moved = new Set<number>();
  const spaceLeftOnSpace = new Map<number, number>();
  for (const rightFileId of inverseRange(0, rightFileMaxId)) {
    const rightFileIndex = rightFileId * 2;
    const rightFileLength = parseInt(input[rightFileIndex], 10);
    let pointer = 0;
    let spaceIndex = 1;
    while (spaceIndex < rightFileIndex) {
      const leftFileLength = parseInt(input[spaceIndex - 1], 10);
      pointer += leftFileLength;
      const spaceLength = parseInt(input[spaceIndex], 10);
      const spaceLeft = spaceLeftOnSpace.get(spaceIndex) ?? spaceLength;
      spaceLeftOnSpace.set(spaceIndex, spaceLeft);
      if (spaceLeft >= rightFileLength) {
        pointer += spaceLength - spaceLeft;
        moved.add(rightFileId);
        for (let i = 0; i < rightFileLength; i++) {
          sum += pointer * rightFileId;
          pointer++;
        }
        spaceLeftOnSpace.set(spaceIndex, spaceLeft - rightFileLength);
        break;
      } else {
        pointer += spaceLength;
        spaceIndex += 2;
      }
    }
  }
  let leftFileId = 0;
  let pointer = 0;
  while (leftFileId <= rightFileMaxId) {
    let leftFileLength = parseInt(input[leftFileId * 2], 10);
    const spaceIndex = leftFileId * 2 + 1;
    const spaceLength = parseInt(input[spaceIndex], 10);
    if (moved.has(leftFileId)) {
      leftFileId++;
      pointer += leftFileLength + spaceLength;
      leftFileLength = parseInt(input[leftFileId * 2], 10);
      continue;
    }
    for (let i = 0; i < leftFileLength; i++) {
      sum += leftFileId * pointer;
      pointer++;
    }
    pointer += spaceLength;
    leftFileId++;
  }
  return sum;
}

if (isMain(import.meta)) {
  const input = readFileSync("inputs/day9.txt", "utf8");
  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}
