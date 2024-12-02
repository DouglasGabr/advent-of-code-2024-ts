import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function isMain(importMeta: ImportMeta): boolean {
  const pathToThisFile = resolve(fileURLToPath(importMeta.url));
  const pathPassedToNode = resolve(process.argv[1]);
  return pathToThisFile.includes(pathPassedToNode);
}

export function todo(message?: string): never {
  throw new Error(message ?? "Not yet implemented");
}
