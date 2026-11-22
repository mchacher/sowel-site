import { readFileSync } from "node:fs";
import { join } from "node:path";
import { articles } from "../src/content/articles/index.ts";
import { en } from "../src/content/en.ts";
import { fr } from "../src/content/fr.ts";
import {
  checkDocsMenu,
  checkFooterArticles,
  checkNoArticlesZone,
  checkPage,
  checkSitemap,
} from "./lib/html.mjs";

const dist = process.argv[2] ?? "dist";
const copy = { en, fr };
let bad = 0;
const report = (file, problems) => {
  for (const problem of problems) {
    console.error(`${file}: ${problem}`);
    bad++;
  }
};
// Every page: the header's Docs menu, the footer's article link, and no trace of the removed Articles zone.
const common = (file, html, lang, current) => {
  report(
    file,
    checkDocsMenu(html, {
      lang,
      articles: articles.map((a) => a[lang].path),
      manual: copy[lang].nav.docs.links.map((l) => l.href),
      current,
    }),
  );
  report(file, checkFooterArticles(html, articles[0][lang].path));
  report(file, checkNoArticlesZone(html));
};
for (const lang of ["en", "fr"]) {
  const file = join(dist, lang, "index.html");
  const html = readFileSync(file, "utf8");
  report(file, checkPage(html, { lang }));
  common(file, html, lang);
}
for (const entry of articles) {
  for (const lang of ["en", "fr"]) {
    const file = join(dist, entry[lang].path, "index.html");
    const html = readFileSync(file, "utf8");
    report(file, checkPage(html, { lang, type: "Article" }));
    common(file, html, lang, entry[lang].path);
  }
}
report(
  "sitemap.xml",
  checkSitemap(readFileSync(join(dist, "sitemap.xml"), "utf8"), [
    { en: "/en/", fr: "/fr/" },
    ...articles.map((a) => ({ en: a.en.path, fr: a.fr.path })),
  ]),
);
if (bad) process.exit(1);
console.log(
  "built html: the home pages, the articles, their Docs menu, the footers and the sitemap carry their metadata, names and links.",
);
