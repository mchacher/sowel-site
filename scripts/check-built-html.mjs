import { readFileSync } from "node:fs";
import { join } from "node:path";
import { checkPage } from "./lib/html.mjs";

const dist = process.argv[2] ?? "dist";
let bad = 0;
for (const lang of ["en", "fr"]) {
  const file = join(dist, lang, "index.html");
  for (const problem of checkPage(readFileSync(file, "utf8"), { lang })) {
    console.error(`${file}: ${problem}`);
    bad++;
  }
}
if (bad) process.exit(1);
console.log("built html: both pages carry their metadata, names and alt texts.");
