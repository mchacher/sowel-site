import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  articleLinks,
  pathLinks,
  pathStep,
  articles,
  indexPath,
  menuLinks,
  MENU_ARTICLES,
} from "../src/content/articles/index.ts";
import { tutorials, tutorialLinks } from "../src/content/tutorials/index.ts";
import { en } from "../src/content/en.ts";
import { fr } from "../src/content/fr.ts";
import {
  checkArticlesIndex,
  checkBreadcrumb,
  checkDocsMenu,
  checkFooterArticles,
  checkNoArticlesZone,
  checkPage,
  checkPathStep,
  checkSitemap,
} from "./lib/html.mjs";

const dist = process.argv[2] ?? "dist";
// The blocks an article renders as a <figure>: captures and the schemes drawn in HTML (specs 003 and 004).
const FIGURE_KINDS = [
  "figure",
  "topology",
  "pipeline",
  "form",
  "layers",
  "knowledge",
  "chain",
  "stack",
];
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
      tutorials: tutorialLinks(lang).map((t) => t.path),
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
  report(file, checkArticlesIndex(html, { articles: articleLinks(lang), path: pathLinks(lang) }));
  common(file, html, lang, indexPath(lang));
}
for (const entry of articles) {
  for (const lang of ["en", "fr"]) {
    const file = join(dist, entry[lang].path, "index.html");
    const html = readFileSync(file, "utf8");
    const figures = entry[lang].blocks.filter((b) => FIGURE_KINDS.includes(b.kind)).length;
    report(file, checkPage(html, { lang, type: "Article", figures }));
    report(file, checkBreadcrumb(html, { index: indexPath(lang), title: entry[lang].title }));
    report(
      file,
      checkPathStep(html, { step: pathStep(lang, entry[lang].path), index: indexPath(lang) }),
    );
    common(file, html, lang, entry[lang].path);
  }
}
// The tutorials (spec 005): metadata, one figure per screenshot, and the Docs menu marking the page.
for (const entry of tutorials) {
  for (const lang of ["en", "fr"]) {
    const file = join(dist, entry[lang].path, "index.html");
    const html = readFileSync(file, "utf8");
    const figures = entry[lang].blocks.filter((b) => b.kind === "shot").length;
    report(file, checkPage(html, { lang, type: "Article", figures, tutorial: true }));
    common(file, html, lang, entry[lang].path);
  }
}
report(
  "sitemap.xml",
  checkSitemap(readFileSync(join(dist, "sitemap.xml"), "utf8"), [
    { en: "/en/", fr: "/fr/" },
    { en: indexPath("en"), fr: indexPath("fr") },
    ...articles.map((a) => ({ en: a.en.path, fr: a.fr.path })),
    ...tutorials.map((t) => ({ en: t.en.path, fr: t.fr.path })),
  ]),
);
if (bad) process.exit(1);
console.log(
  "built html: the home pages, the article indexes, the articles, the tutorials, their Docs menu, the footers and the sitemap carry their metadata, names and links.",
);
