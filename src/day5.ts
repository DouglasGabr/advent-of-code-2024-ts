import { readFileSync } from "fs";
import { isMain } from "../utils.ts";

class Rule {
  pageNumber: number;
  nextPages: Set<number>;
  previousPages: Set<number>;
  constructor(
    pageNumber: number,
    nextPages?: Set<number>,
    previousPages?: Set<number>,
  ) {
    this.pageNumber = pageNumber;
    this.nextPages = nextPages ?? new Set();
    this.previousPages = previousPages ?? new Set();
  }
}
function areArraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

export function part1(input: string): number {
  const [_rules, _updates] = input.split("\n\n");
  const rules = createRulesMap(_rules);
  let sum = 0;
  for (const update of _updates
    .split("\n")
    .map((line) => line.split(",").map(Number))) {
    const sorted = sortByRules(update, rules);
    if (!areArraysEqual(sorted, update)) {
      continue;
    }
    const middlePage = sorted[Math.floor(sorted.length / 2)];
    sum += middlePage;
  }
  return sum;
}

export function part2(input: string): number {
  const [_rules, _updates] = input.split("\n\n");
  const rules = createRulesMap(_rules);
  let sum = 0;
  for (const update of _updates
    .split("\n")
    .map((line) => line.split(",").map(Number))) {
    const sorted = sortByRules(update, rules);
    if (areArraysEqual(sorted, update)) {
      continue;
    }
    const middlePage = sorted[Math.floor(sorted.length / 2)];
    sum += middlePage;
  }
  return sum;
}

if (isMain(import.meta)) {
  const input = readFileSync("inputs/day5.txt", "utf8");
  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}

function sortByRules(update: number[], rules: Map<number, Rule>) {
  return update.toSorted((a, b) => {
    const ruleA = rules.get(a);
    const ruleB = rules.get(b);
    if (ruleA?.previousPages.has(b) || ruleB?.nextPages.has(a)) {
      return 1;
    } else if (ruleB?.previousPages.has(a) || ruleA?.nextPages.has(b)) {
      return -1;
    }
    return 0;
  });
}

function createRulesMap(_rules: string) {
  const rules = new Map<number, Rule>();
  for (const [a, b] of _rules
    .split("\n")
    .map((rule) => rule.split("|").map(Number))) {
    rules.get(a)?.nextPages.add(b) ?? rules.set(a, new Rule(a, new Set([b])));
    rules.get(b)?.previousPages.add(a) ??
      rules.set(b, new Rule(b, undefined, new Set([a])));
  }
  return rules;
}
