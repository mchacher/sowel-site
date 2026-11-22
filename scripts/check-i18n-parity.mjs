// Fails when en.ts and fr.ts do not carry the same keys, or when a value is empty.
// Node 24 runs the .ts files directly (type stripping).
import { en } from "../src/content/en.ts";
import { fr } from "../src/content/fr.ts";
import { en as articleEn } from "../src/content/articles/sun-arbiter.en.ts";
import { fr as articleFr } from "../src/content/articles/sun-arbiter.fr.ts";
import { compareArticles, compareCopy } from "./lib/parity.mjs";

const problems = [
  ...compareCopy(en, fr),
  ...compareArticles(articleEn, articleFr).map((p) => `article: ${p}`),
];
if (problems.length) {
  console.error("i18n parity failed:");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log("i18n parity: en and fr carry the same keys and the articles the same blocks.");
