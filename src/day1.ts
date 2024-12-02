import { readFileSync } from "node:fs";
import { isMain, todo } from "../utils.ts";
import assert from "node:assert";

class Node {
  value: number;
  left: Node | null;
  right: Node | null;
  constructor(value: number) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function insert(root: Node, node: Node) {
  if (node.value < root.value) {
    if (root.left == null) {
      root.left = node;
    } else {
      insert(root.left, node);
    }
  } else {
    if (root.right == null) {
      root.right = node;
    } else {
      insert(root.right, node);
    }
  }
}

function* inorder(node: Node): Generator<number> {
  if (node.left != null) {
    yield* inorder(node.left);
  }
  yield node.value;
  if (node.right != null) {
    yield* inorder(node.right);
  }
}

export function part1(input: string): number {
  const lines = input.split("\n");
  let leftRoot = null;
  let rightRoot = null;
  for (const line of lines) {
    const [left, right] = line.split("   ");
    const leftNumber = parseInt(left, 10);
    const rightNumber = parseInt(right, 10);
    assert(!isNaN(leftNumber));
    assert(!isNaN(rightNumber));
    const leftNode = new Node(leftNumber);
    const rightNode = new Node(rightNumber);
    if (leftRoot == null || rightRoot == null) {
      leftRoot = leftNode;
      rightRoot = rightNode;
    } else {
      insert(leftRoot, leftNode);
      insert(rightRoot, rightNode);
    }
  }
  assert(leftRoot != null);
  assert(rightRoot != null);
  const leftNodes = inorder(leftRoot);
  const rightNodes = inorder(rightRoot);
  let sum = 0;
  for (const left of leftNodes) {
    const rightItem = rightNodes.next();
    assert(!rightItem.done);
    const right = rightItem.value;
    sum += Math.abs(left - right);
  }
  return sum;
}
export function part2(input: string): number {
  const leftList: number[] = [];
  const rightCounts = new Map<number, number>();
  for (const line of input.split("\n")) {
    const [left, right] = line.split("   ");
    const leftNumber = parseInt(left, 10);
    const rightNumber = parseInt(right, 10);
    assert(!isNaN(leftNumber));
    assert(!isNaN(rightNumber));
    leftList.push(leftNumber);
    rightCounts.set(rightNumber, (rightCounts.get(rightNumber) ?? 0) + 1);
  }
  const sum = leftList.reduce(
    (sum, num) => sum + num * (rightCounts.get(num) ?? 0),
    0,
  );
  return sum;
}

if (isMain(import.meta)) {
  const input = readFileSync("inputs/day1.txt", "utf8");
  console.log("part 1:", part1(input));
  console.log("part 2:", part2(input));
}
