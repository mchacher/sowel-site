import { readFileSync } from "node:fs";
import { join } from "node:path";
import { checkPage, checkSitemap } from "./lib/html.mjs";

const dist = process.argv[2] ?? "dist";
let bad = 0;
for (const lang of ["en", "fr"]) {
  const file = join(dist, lang, "index.html");
  for (const problem of checkPage(readFileSync(file, "utf8"), { lang })) {
    console.error(`${file}: ${problem}`);
    bad++;
  }
}
const articles = {
  en: "en/articles/who-decides-how-your-sun-gets-used",
  fr: "fr/articles/qui-decide-d-utiliser-votre-soleil",
};
for (const [lang, dir] of Object.entries(articles)) {
  const file = join(dist, dir, "index.html");
  for (const problem of checkPage(readFileSync(file, "utf8"), { lang, type: "Article" })) {
    console.error(`${file}: ${problem}`);
    bad++;
  }
}
for (const problem of checkSitemap(readFileSync(join(dist, "sitemap.xml"), "utf8"), [
  { en: "/en/", fr: "/fr/" },
  { en: `/${articles.en}/`, fr: `/${articles.fr}/` },
])) {
  console.error(`sitemap.xml: ${problem}`);
  bad++;
}
if (bad) process.exit(1);
console.log(
  "built html: the home pages, the articles and the sitemap carry their metadata, names and alt texts.",
);
