import { readFileSync } from "fs";
import { isMain } from "../utils.ts";
import assert from "assert";

type Operator = "+" | "*" | "||";

type OperationFactors = (number | Operator)[];

function runOperation(factors: OperationFactors): number {
  assert(factors.length % 2 === 1, "factors must be odd length");
  let result = factors[0];
  assert(typeof result === "number", "first factor must be a number");
  for (let i = 1; i < factors.length; i += 2) {
    const operator = factors[i];
    assert(typeof operator === "string", `invalid operator "${operator}"`);
    const factor = factors[i + 1];
    assert(typeof factor === "number", `invalid factor "${factor}"`);
    switch (operator) {
      case "+":
        result += factor;
        break;
      case "*":
        result *= factor;
        break;
      case "||": {
        result = parseInt(result.toString() + factor.toString(), 10);
        break;
      }
      default: {
        const _exhaustiveCheck: never = operator;
        throw new Error(`invalid operator "${operator}"`);
      }
    }
  }
  return result;
}

class Equation {
  result: number;
  factors: number[];
  constructor(result: number, factors: number[]) {
    this.result = result;
    this.factors = factors;
  }

  *combinations(operators: Operator[]): Generator<(number | Operator)[]> {
    const [first, ...rest] = this.factors;
    if (rest.length === 0) {
      yield [first];
    } else {
      for (const combination of new Equation(this.result, rest).combinations(
        operators,
      )) {
        for (const operator of operators) {
          yield [first, operator, ...combination];
        }
      }
    }
  }

  isValid(operators: Operator[]): boolean {
    return this.combinations(operators).some(
      (factors) => runOperation(factors) === this.result,
    );
  }
}

export function part1(input: string): number {
  return input
    .split("\n")
    .values()
    .map((line) => {
      const [resultString, factorsString] = line.split(": ");
      const result = parseInt(resultString, 10);
      const factors = factorsString.split(" ").map((n) => parseInt(n, 10));
      return new Equation(result, factors);
    })
    .filter((equation) => equation.isValid(["+", "*"]))
    .reduce((sum, equation) => sum + equation.result, 0);
}
export function part2(input: string): number {
  return input
    .split("\n")
    .values()
    .map((line) => {
      const [resultString, factorsString] = line.split(": ");
      const result = parseInt(resultString, 10);
      const factors = factorsString.split(" ").map((n) => parseInt(n, 10));
      return new Equation(result, factors);
    })
    .filter((equation) => equation.isValid(["+", "*", "||"]))
    .reduce((sum, equation) => sum + equation.result, 0);
}

if (isMain(import.meta)) {
  const input = readFileSync("inputs/day7.txt", "utf8");
  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}
