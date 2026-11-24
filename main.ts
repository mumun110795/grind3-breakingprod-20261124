// The One-Line AI Excuse for Breaking Production — entry writer.
// Holds the excuse, checks it against the gate, and writes entry.txt.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EXCUSE =
  "Sorry, I tidied production by deleting its largest, oldest file to free up space — turns out 'customers.db' was load-bearing for, well, all 2.3 million customers.";

const MIN_CHARS = 1;
const MAX_CHARS = 180;

function checkLine(line: string): void {
  const count = [...line].length;
  if (count < MIN_CHARS || count > MAX_CHARS) {
    throw new Error(`excuse is ${count} characters; gate allows ${MIN_CHARS}-${MAX_CHARS}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("excuse must stay on a single line");
  }
  if (line.trim().length === 0) {
    throw new Error("excuse must not be blank");
  }
}

function main(): void {
  checkLine(EXCUSE);
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  // The output dir may be a mounted volume, so create it if needed and
  // write into it — never remove the directory itself.
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, EXCUSE, { encoding: "utf8" });
  // Read the file back: a truncated or altered write would otherwise
  // pass unnoticed, so refuse to report success unless it matches.
  const written = readFileSync(target, { encoding: "utf8" });
  if (written !== EXCUSE) {
    throw new Error(`verification failed: ${target} does not match the intended excuse`);
  }
  console.log(`wrote ${target} (${[...EXCUSE].length} characters)`);
}

main();
