import { readFileSync } from "node:fs";
import { join } from "node:path";
import { articles } from "../src/content/articles/index.ts";
import { checkArticlesSection, checkFooterArticles, checkPage, checkSitemap } from "./lib/html.mjs";

const dist = process.argv[2] ?? "dist";
let bad = 0;
const report = (file, problems) => {
  for (const problem of problems) {
    console.error(`${file}: ${problem}`);
    bad++;
  }
};
for (const lang of ["en", "fr"]) {
  const file = join(dist, lang, "index.html");
  const html = readFileSync(file, "utf8");
  report(file, checkPage(html, { lang }));
  report(
    file,
    checkArticlesSection(
      html,
      articles.map((a) => a[lang].path),
    ),
  );
  report(file, checkFooterArticles(html, lang));
}
for (const entry of articles) {
  for (const lang of ["en", "fr"]) {
    const file = join(dist, entry[lang].path, "index.html");
    const html = readFileSync(file, "utf8");
    report(file, checkPage(html, { lang, type: "Article" }));
    report(file, checkFooterArticles(html, lang));
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
  "built html: the home pages, their Articles section, the articles, the footers and the sitemap carry their metadata, names and links.",
);
