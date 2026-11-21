// The site loads nothing from another host (spec 001, privacy). Reads the built output.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { findExternalLoads } from "./lib/external.mjs";

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}

const dist = process.argv[2] ?? "dist";
let bad = 0;
for (const file of walk(dist)) {
  const kind = file.endsWith(".html") ? "html" : file.endsWith(".css") ? "css" : null;
  if (!kind) continue;
  for (const url of findExternalLoads(readFileSync(file, "utf8"), kind)) {
    console.error(`external load in ${file}: ${url}`);
    bad++;
  }
}
if (bad) process.exit(1);
console.log("external requests: none, the site loads only from itself.");
