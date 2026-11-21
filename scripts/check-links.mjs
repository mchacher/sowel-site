import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { checkPage } from "./lib/links.mjs";

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}

const dist = process.argv[2] ?? "dist";
const problems = [];
for (const file of walk(dist)) {
  if (!file.endsWith(".html")) continue;
  const url = "/" + relative(dist, file).replace(/index\.html$/, "");
  problems.push(...checkPage(dist, url, readFileSync(file, "utf8")));
}
if (problems.length) {
  for (const p of problems) console.error(p);
  process.exit(1);
}
console.log("links: every internal link and anchor resolves.");
