import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  articleLinks,
  articles,
  indexPath,
  menuLinks,
  MENU_ARTICLES,
} from "../src/content/articles/index.ts";
import { en } from "../src/content/en.ts";
import { fr } from "../src/content/fr.ts";
import {
  checkArticlesIndex,
  checkBreadcrumb,
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
// Every page: the header's Docs menu (the few most recent articles, then « All articles »), the footer's link to the
// index, and no trace of the removed Articles zone.
const common = (file, html, lang, current) => {
  const menu = menuLinks(lang).map((a) => a.path);
  if (menu.length > MENU_ARTICLES) report(file, [`the menu list is longer than ${MENU_ARTICLES}`]);
  report(
    file,
    checkDocsMenu(html, {
      lang,
      articles: menu,
      index: indexPath(lang),
      manual: copy[lang].nav.docs.links.map((l) => l.href),
      current,
    }),
  );
  report(file, checkFooterArticles(html, indexPath(lang)));
  report(file, checkNoArticlesZone(html));
};
for (const lang of ["en", "fr"]) {
  const file = join(dist, lang, "index.html");
  const html = readFileSync(file, "utf8");
  report(file, checkPage(html, { lang }));
  common(file, html, lang);
}
for (const lang of ["en", "fr"]) {
  const file = join(dist, indexPath(lang), "index.html");
  const html = readFileSync(file, "utf8");
  report(file, checkPage(html, { lang, type: "CollectionPage" }));
  report(file, checkArticlesIndex(html, { articles: articleLinks(lang) }));
  common(file, html, lang, indexPath(lang));
}
for (const entry of articles) {
  for (const lang of ["en", "fr"]) {
    const file = join(dist, entry[lang].path, "index.html");
    const html = readFileSync(file, "utf8");
    report(file, checkPage(html, { lang, type: "Article" }));
    report(file, checkBreadcrumb(html, { index: indexPath(lang), title: entry[lang].title }));
    common(file, html, lang, entry[lang].path);
  }
}
report(
  "sitemap.xml",
  checkSitemap(readFileSync(join(dist, "sitemap.xml"), "utf8"), [
    { en: "/en/", fr: "/fr/" },
    { en: indexPath("en"), fr: indexPath("fr") },
    ...articles.map((a) => ({ en: a.en.path, fr: a.fr.path })),
  ]),
);
if (bad) process.exit(1);
console.log(
  "built html: the home pages, the article indexes, the articles, their Docs menu, the footers and the sitemap carry their metadata, names and links.",
);
