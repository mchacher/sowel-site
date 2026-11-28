// Fails when en.ts and fr.ts do not carry the same keys, or when a value is empty.
// Node 24 runs the .ts files directly (type stripping).
import { en } from "../src/content/en.ts";
import { fr } from "../src/content/fr.ts";
import { articles } from "../src/content/articles/index.ts";
import { tutorials } from "../src/content/tutorials/index.ts";
import { compareCopy, compareDocsMenu, compareRegistry } from "./lib/parity.mjs";

const problems = [
  ...compareCopy(en, fr),
  ...compareDocsMenu(en, fr),
  ...compareRegistry(articles).map((p) => `articles: ${p}`),
  ...compareRegistry(tutorials, { en: "tutorials", fr: "tutoriels" }).map((p) => `tutorials: ${p}`),
];
if (problems.length) {
  console.error("i18n parity failed:");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(
  "i18n parity: en and fr carry the same keys and the articles and tutorials the same blocks, the Docs menu the same pages.",
);
