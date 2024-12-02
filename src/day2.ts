import { readFileSync } from "fs";
import { isMain, todo } from "../utils.ts";
import assert from "node:assert";

export function part1(input: string): number {
  return input
    .split("\n")
    .values()
    .map((report) =>
      report.split(" ").map((level) => {
        const numLevel = parseInt(level, 10);
        assert(!isNaN(numLevel));
        return numLevel;
      }),
    )
    .map((levels) => {
      assert(levels.length > 0);
      let level = levels[0];
      let direction = 0;
      for (let i = 1; i < levels.length; i++) {
        const nextLevel = levels[i];
        const difference = level - nextLevel;
        if (Math.abs(difference) > 3 || Math.abs(difference) < 1) {
          return false;
        }
        const newDirection = Math.sign(difference);
        if (direction != 0 && newDirection != direction) {
          return false;
        }
        direction = newDirection;
        level = nextLevel;
      }
      return true;
    })
    .reduce((acc, valid) => (valid ? acc + 1 : acc), 0);
}

type AdvanceResult =
  | {
      valid: false;
    }
  | {
      valid: true;
      skip: "a" | "b" | "c" | null;
      direction: number;
    };

/**
 * @returns new direction
 */
function step(a: number, b: number, direction: number): number | null {
  const ab = a - b;
  const dir = Math.sign(ab);
  if (
    Math.abs(ab) > 3 ||
    Math.abs(ab) < 1 ||
    (direction != 0 && dir != direction)
  ) {
    return null;
  }
  return dir;
}

function advance(
  a: number,
  b: number,
  c: number | undefined,
  d: number | undefined,
  direction: number,
  skipped: boolean,
  canSkipA: boolean,
): AdvanceResult {
  const dirAb = step(a, b, direction);
  if (dirAb != null) {
    if (c == null) {
      return { valid: true, skip: null, direction: dirAb };
    }
    const dirBc = step(b, c, dirAb);
    if (dirBc != null) {
      return { valid: true, skip: null, direction: dirBc };
    } else {
      if (d == null) {
        if (skipped) {
          return { valid: false };
        } else {
          return { valid: true, skip: "c", direction: dirAb };
        }
      }
      const dirBd = step(b, d, dirAb);
      if (dirBd != null) {
        return { valid: true, skip: "c", direction: dirBd };
      }
    }
  }
  if (c == null) {
    if (!skipped) {
      return { valid: true, skip: "b", direction };
    } else {
      return { valid: false };
    }
  } else {
    const dirAc = step(a, c, direction);
    if (dirAc != null) {
      if (d == null) {
        return { valid: true, skip: "b", direction: dirAc };
      }
      const dirCd = step(c, d, dirAc);
      if (dirCd != null) {
        return { valid: true, skip: "b", direction: dirCd };
      }
    }
  }
  if (canSkipA) {
    const dirBc = step(b, c, direction);
    if (dirBc != null) {
      if (d == null) {
        return { valid: true, skip: "a", direction: dirBc };
      }
      const dirCd = step(c, d, dirBc);
      if (dirCd != null) {
        return { valid: true, skip: "a", direction: dirCd };
      }
    }
  }
  return { valid: false };
}

export function part2(input: string): number {
  return input
    .split("\n")
    .values()
    .map((report) =>
      report.split(" ").map((level) => {
        const numLevel = parseInt(level, 10);
        assert(!isNaN(numLevel));
        return numLevel;
      }),
    )
    .map((levels) => {
      
      assert(levels.length > 0);
      let direction = 0;
      let skipped = false;
      for (let i = 0; i < levels.length - 1; ) {
        const a = levels[i];
        const bIndex = i + 1;
        const b = levels[bIndex];
        const cIndex = i + 2;
        const c = levels[cIndex];
        const d = levels[i + 3];
        const result = advance(a, b, c, d, direction, skipped, i === 0);
        
        if (!result.valid) {
          return false;
        }
        direction = result.direction;
        switch (result.skip) {
          case null: {
            i += 2;
            break;
          }
          case "a":
          case "b":
          case "c": {
            if (skipped) {
              return false;
            }
            skipped = true;
            i += 3;
            break;
          }
        }
      }
      return true;
    })
    .reduce((acc, valid) => (valid ? acc + 1 : acc), 0);
}

if (isMain(import.meta)) {
  const input = readFileSync("inputs/day2.txt", "utf8");
  
  
}
