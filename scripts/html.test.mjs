import test from "node:test";
import assert from "node:assert/strict";
import { checkPage } from "./lib/html.mjs";

const good = `<html lang="en"><head><title>T</title>
<meta name="description" content="A description that is long enough to count.">
<link rel="canonical" href="https://x/en/">
<link rel="alternate" hreflang="en" href="a"><link rel="alternate" hreflang="fr" href="b"><link rel="alternate" hreflang="x-default" href="a">
<meta property="og:image" content="https://x/og.png"><meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{"@type":"SoftwareApplication"}</script></head>
<body><h1>Hi</h1><button aria-label="Copy"><svg></svg></button><img src="/a.png" alt=""><a href="/fr/" aria-label="FR, français">FR</a></body></html>`;

test("a complete page has no problem", () => {
  assert.deepEqual(checkPage(good, { lang: "en" }), []);
});

test("a button without a name is reported", () => {
  const p = checkPage(good.replace('aria-label="Copy"', ""), { lang: "en" });
  assert.ok(p.some((m) => m.includes("no accessible name")));
});

test("a button whose label drops its visible text is reported", () => {
  const p = checkPage(
    good.replace(
      '<button aria-label="Copy"><svg></svg></button>',
      '<button aria-label="Play">The film 1 min 43</button>',
    ),
    { lang: "en" },
  );
  assert.ok(p.some((m) => m.includes("button's accessible name does not contain")));
});

test("an image without alt is reported, an empty alt is fine", () => {
  assert.ok(
    checkPage(good.replace(' alt=""', ""), { lang: "en" }).some((m) => m.includes("no alt")),
  );
});

test("a link whose label drops the visible text is reported", () => {
  const p = checkPage(good.replace("FR, français", "the other language"), { lang: "en" });
  assert.ok(p.some((m) => m.includes("does not contain its visible text")));
});

test("missing metadata is reported", () => {
  const p = checkPage('<html lang="en"><body></body></html>', { lang: "en" });
  for (const need of ["one h1", "no title", "no canonical", "hreflang fr", "og:image", "JSON-LD"]) {
    assert.ok(
      p.some((m) => m.includes(need)),
      need,
    );
  }
});

test("a wrong language and a broken JSON-LD are reported", () => {
  const p = checkPage(
    good.replace('lang="en"', 'lang="de"').replace('{"@type":"SoftwareApplication"}', "{oops"),
    { lang: "en" },
  );
  assert.ok(p.some((m) => m.includes("html lang")));
  assert.ok(p.some((m) => m.includes("does not parse")));
});

import { checkSitemap } from "./lib/html.mjs";

const article = `<html lang="en"><head><title>T</title>
<meta name="description" content="A description that is long enough to count.">
<link rel="canonical" href="https://x/en/articles/a/">
<link rel="alternate" hreflang="en" href="https://x/en/articles/a/"><link rel="alternate" hreflang="fr" href="https://x/fr/articles/b/"><link rel="alternate" hreflang="x-default" href="https://x/en/articles/a/">
<meta property="og:image" content="https://x/og.png"><meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{"@type":"Article","headline":"H","datePublished":"2026-11-22","image":"https://x/o.png","author":{},"publisher":{},"inLanguage":"en"}</script></head>
<body><h1>Hi</h1>
<nav aria-label="Breadcrumb"></nav><nav aria-labelledby="t" data-toc><p id="t">In</p><a href="#one">One</a><a href="#two">Two</a></nav>
<span data-reading-time="6">6 min read</span><time datetime="2026-11-22">22 November 2026</time>
<h2 id="one">One</h2><a href="#one" aria-label="Link to the section: One"></a><h2 id="two">Two</h2>
<blockquote class="pull"><p>Q</p></blockquote>
<div class="hl"><p>H</p><svg viewBox="0 0 10 10" role="img" aria-labelledby="d-t" aria-describedby="d-d"><title id="d-t">The arbiter</title><desc id="d-d">A hub and three appliances.</desc><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M0 0"/></svg></svg></div>
<figure><img src="/a.webp" alt="One"><figcaption>c</figcaption></figure>
<figure><img src="/b.webp" alt="Two"><figcaption>c</figcaption></figure></body></html>`;

test("a complete article page has no problem", () => {
  assert.deepEqual(checkPage(article, { lang: "en", type: "Article" }), []);
});

test("an article figure without alt text, a missing pull quote and a wrong type are reported", () => {
  const p = checkPage(
    article
      .replace('alt="One"', 'alt=""')
      .replace("blockquote", "div")
      .replace("div class", "div class"),
    { lang: "en", type: "Article" },
  );
  assert.ok(p.some((m) => m.includes("no alt text")));
  assert.ok(p.some((m) => m.includes("no pull quote")));
  assert.ok(
    checkPage(article, { lang: "en" }).some((m) => m.includes("not a SoftwareApplication")),
  );
});

test("an article JSON-LD without a date is reported", () => {
  const p = checkPage(article.replace('"datePublished":"2026-11-22",', ""), {
    lang: "en",
    type: "Article",
  });
  assert.ok(p.some((m) => m.includes("no datePublished")));
});

test("a diagram without its title or its description is reported", () => {
  const p = checkPage(
    article
      .replace(' aria-describedby="d-d"', "")
      .replace('<title id="d-t">The arbiter</title>', ""),
    { lang: "en", type: "Article" },
  );
  assert.ok(p.some((m) => m.includes("a diagram has no title naming it")));
  assert.ok(p.some((m) => m.includes("a diagram has no description")));
});

test("an article with a scheme drawn in HTML: named and captioned, counted as a figure (spec 003)", () => {
  const withScheme = article.replace(
    "</body>",
    '<figure><div role="img" aria-label="A scheme"><span>x</span></div><figcaption>c</figcaption></figure></body>',
  );
  assert.deepEqual(checkPage(withScheme, { lang: "en", type: "Article", figures: 3 }), []);
  assert.ok(
    checkPage(withScheme, { lang: "en", type: "Article" }).some((m) =>
      m.includes("expected 2 figures, found 3"),
    ),
  );
  const unnamed = withScheme.replace(' aria-label="A scheme"', "");
  assert.ok(
    checkPage(unnamed, { lang: "en", type: "Article", figures: 3 }).some((m) =>
      m.includes("scheme has no name"),
    ),
  );
});

const sm = (paths) =>
  `<urlset>${paths.map((x) => `<url><loc>https://x${x}</loc><xhtml:link hreflang="en" href="https://x/en/a/" /><xhtml:link hreflang="fr" href="https://x/fr/b/" /><xhtml:link hreflang="x-default" href="https://x/en/a/" /></url>`).join("")}</urlset>`;

test("the sitemap must list both pages of a pair with their alternates", () => {
  const pair = [{ en: "/en/a/", fr: "/fr/b/" }];
  assert.deepEqual(checkSitemap(sm(["/en/a/", "/fr/b/"]), pair), []);
  assert.ok(checkSitemap(sm(["/en/a/"]), pair).some((m) => m.includes("/fr/b/")));
});

test("a heading without id, a broken anchor, no reading time and no date are reported", () => {
  const p = checkPage(
    article
      .replace('<h2 id="two">', "<h2>")
      .replace('data-reading-time="6"', "")
      .replace('<time datetime="2026-11-22">', "<time>"),
    { lang: "en", type: "Article" },
  );
  for (const need of [
    "heading has no id",
    "does not resolve: #two",
    "no reading time",
    "no publication date",
  ])
    assert.ok(
      p.some((m) => m.includes(need)),
      need,
    );
});

test("a contents that misses a section and an unnamed nav are reported", () => {
  const p = checkPage(
    article.replace('<a href="#two">Two</a>', "").replace(' aria-label="Breadcrumb"', ""),
    { lang: "en", type: "Article" },
  );
  assert.ok(p.some((m) => m.includes("the contents list 1 sections for 2 headings")));
  assert.ok(p.some((m) => m.includes("nav landmark has no accessible name")));
});

import {
  checkArticlesIndex,
  checkBreadcrumb,
  checkPathStep,
  checkDocsMenu,
  checkFooterArticles,
  checkNoArticlesZone,
} from "./lib/html.mjs";

const MANUAL = {
  en: ["https://docs.sowel.org/user/", "https://docs.sowel.org/release-notes/"],
  fr: ["https://docs.sowel.org/fr/user/", "https://docs.sowel.org/fr/release-notes/"],
};
const menu = ({
  lang = "en",
  art = "/en/articles/a/",
  current = false,
  manual = MANUAL[lang],
  label = "Docs",
  arts = [art],
  all = `/${lang}/articles/`,
  allCurrent = false,
} = {}) =>
  `<header><details class="docs" data-docs><summary class="docs__btn" aria-controls="docs-panel"><svg></svg><span>${label}</span></summary>` +
  `<nav class="docs__panel" id="docs-panel" aria-label="Articles and manual"><p class="docs__group">Articles</p><ul>` +
  arts
    .map(
      (a) =>
        `<li><a class="docs__item" href="${a}" data-docs-article${current && a === art ? ' aria-current="page"' : ""}><span>The article</span></a></li>`,
    )
    .join("") +
  (all
    ? `<li><a class="docs__all" href="${all}" data-docs-all${allCurrent ? ' aria-current="page"' : ""}><span>All articles</span></a></li>`
    : "") +
  `</ul>` +
  `<p class="docs__group">Manual</p><ul>` +
  manual
    .map(
      (h) => `<li><a class="docs__item" href="${h}" data-docs-manual><span>Entry</span></a></li>`,
    )
    .join("") +
  `</ul></nav></details></header>`;
const opts = (o = {}) => ({
  lang: "en",
  articles: ["/en/articles/a/"],
  index: "/en/articles/",
  manual: MANUAL.en,
  ...o,
});

test("a Docs menu with its article and the manual in the language: no problem", () => {
  assert.deepEqual(checkDocsMenu(menu(), opts()), []);
  assert.deepEqual(
    checkDocsMenu(
      menu({ lang: "fr", art: "/fr/articles/b/" }),
      opts({
        lang: "fr",
        articles: ["/fr/articles/b/"],
        index: "/fr/articles/",
        manual: MANUAL.fr,
      }),
    ),
    [],
  );
  assert.deepEqual(
    checkDocsMenu(menu({ current: true }), opts({ current: "/en/articles/a/" })),
    [],
  );
});

test("a missing menu, a wrong name, an unnamed or uncontrolled panel are reported", () => {
  assert.deepEqual(checkDocsMenu("<header></header>", opts()), ["no Docs menu in the header"]);
  assert.ok(
    checkDocsMenu(menu({ label: "Manual" }), opts()).some((m) => m.includes('named "Manual"')),
  );
  assert.ok(
    checkDocsMenu(menu().replace(' aria-label="Articles and manual"', ""), opts()).some((m) =>
      m.includes("panel has no accessible name"),
    ),
  );
  assert.ok(
    checkDocsMenu(menu().replace(' aria-controls="docs-panel"', ""), opts()).some((m) =>
      m.includes("does not control the panel"),
    ),
  );
});

test("a missing article, a wrong current mark and wrong manual links are reported", () => {
  assert.ok(
    checkDocsMenu(menu({ art: "/en/articles/z/" }), opts()).some((m) => m.includes("0 times")),
  );
  assert.ok(
    checkDocsMenu(menu(), opts({ current: "/en/articles/a/" })).some((m) =>
      m.includes("not marked"),
    ),
  );
  assert.ok(
    checkDocsMenu(menu({ current: true }), opts()).some((m) =>
      m.includes("marked current wrongly"),
    ),
  );
  // The French manual on an English page: not the expected links, and the wrong prefix.
  const p = checkDocsMenu(menu({ manual: MANUAL.fr }), opts());
  assert.ok(p.some((m) => m.includes("not the expected ones")));
  assert.ok(p.some((m) => m.includes("wrong language prefix for en")));
  const q = checkDocsMenu(
    menu({ manual: ["http://docs.example.org/user/"] }),
    opts({ manual: ["http://docs.example.org/user/"] }),
  );
  assert.ok(q.some((m) => m.includes("not on https://docs.sowel.org")));
});

test("the footer must link to the index of its language", () => {
  assert.deepEqual(
    checkFooterArticles('<footer><a href="/fr/articles/">Articles</a></footer>', "/fr/articles/"),
    [],
  );
  assert.equal(
    checkFooterArticles('<footer><a href="/fr/#articles">Articles</a></footer>', "/fr/articles/")
      .length,
    1,
  );
});

test("a capped menu ends its articles on « All articles », marked on the index only", () => {
  const three = ["/en/articles/c/", "/en/articles/b/", "/en/articles/a/"];
  assert.deepEqual(checkDocsMenu(menu({ arts: three }), opts({ articles: three })), []);
  // One article too many in the menu.
  assert.ok(
    checkDocsMenu(menu({ arts: [...three, "/en/articles/z/"] }), opts({ articles: three })).some(
      (m) => m.includes("4 articles for 3"),
    ),
  );
  // No « All articles » row, or one leading elsewhere.
  assert.ok(
    checkDocsMenu(menu({ all: "" }), opts()).some((m) => m.includes("no link to all the articles")),
  );
  assert.ok(
    checkDocsMenu(menu({ all: "/en/" }), opts()).some((m) => m.includes("does not lead to")),
  );
  // On the index: the row is marked; elsewhere it must not be.
  assert.deepEqual(
    checkDocsMenu(menu({ allCurrent: true }), opts({ current: "/en/articles/" })),
    [],
  );
  assert.ok(
    checkDocsMenu(menu(), opts({ current: "/en/articles/" })).some((m) =>
      m.includes("not marked on the index"),
    ),
  );
  assert.ok(
    checkDocsMenu(menu({ allCurrent: true }), opts()).some((m) => m.includes("off the index")),
  );
  // An article read that is not among the three: nothing in the menu is marked, and that is right.
  assert.deepEqual(checkDocsMenu(menu(), opts({ current: "/en/articles/old/" })), []);
});

const ART = [
  { path: "/en/articles/b/", datePublished: "2027-02-01" },
  { path: "/en/articles/a/", datePublished: "2026-11-22" },
];
const index = (items = ART, years = ["2027", "2026"]) =>
  "<main>" +
  years
    .map(
      (y) =>
        `<section data-year="${y}"><h2 id="year-${y}">${y}</h2><ul>` +
        items
          .filter((a) => a.datePublished.startsWith(y))
          .map(
            (a, i) =>
              `<li><a class="entry" href="${a.path}" aria-labelledby="t-${y}-${i}" data-index-article="${a.path}">` +
              `<img src="/x.webp" alt="" width="10" height="8"><time datetime="${a.datePublished}">d</time>` +
              `<h3 id="t-${y}-${i}">Title</h3></a></li>`,
          )
          .join("") +
        `</ul></section>`,
    )
    .join("") +
  "</main>";

test("an index with every article under its year: no problem", () => {
  assert.deepEqual(checkArticlesIndex(index(), { articles: ART }), []);
});

test("an index that misses an article, a year heading or a name is reported", () => {
  const extra = [...ART, { path: "/en/articles/c/", datePublished: "2026-10-01" }];
  assert.ok(
    checkArticlesIndex(index(), { articles: extra }).some((m) =>
      m.includes("/en/articles/c/ 0 times"),
    ),
  );
  assert.ok(
    checkArticlesIndex(index(ART, ["2027"]), { articles: ART }).some((m) =>
      m.includes("year headings"),
    ),
  );
  assert.ok(
    checkArticlesIndex(index().replace(/ aria-labelledby="[^"]*"/, ""), { articles: ART }).some(
      (m) => m.includes("not named by its title"),
    ),
  );
  assert.ok(
    checkArticlesIndex(index().replace(' width="10"', ""), { articles: ART }).some((m) =>
      m.includes("no size"),
    ),
  );
});

test("the breadcrumb leads to the index and ends on the article's title", () => {
  const crumbs = (mid) =>
    `<nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/en/">Sowel</a></li>${mid}` +
    `<li aria-current="page">The title</li></ol></nav>`;
  const opt = { index: "/en/articles/", title: "The title" };
  assert.deepEqual(
    checkBreadcrumb(crumbs('<li><a href="/en/articles/">Articles</a></li>'), opt),
    [],
  );
  assert.ok(
    checkBreadcrumb(crumbs("<li>Articles</li>"), opt).some((m) => m.includes("does not link")),
  );
  assert.ok(
    checkBreadcrumb(crumbs('<li><a href="/en/articles/">Articles</a></li>'), {
      ...opt,
      title: "Another",
    }).some((m) => m.includes("does not end")),
  );
});

test("nothing may point at the removed Articles zone", () => {
  assert.deepEqual(checkNoArticlesZone('<a href="/en/articles/a/">A</a>'), []);
  assert.equal(
    checkNoArticlesZone('<a href="/en/#articles">A</a><section id="articles"></section>').length,
    2,
  );
});

// The reading path: a block above the years on the index, a step in the byline, a card to the next article.
const startBlock = (paths) =>
  `<section class="start" id="start"><h2 id="start-title">Where to start</h2><ol>` +
  paths
    .map((x) => `<li><a class="step" href="${x}" data-path-article="${x}">${x}</a></li>`)
    .join("") +
  `</ol></section>`;

test("an index with the reading path in its order above the years: no problem", () => {
  const path = [ART[1], ART[0]];
  const html = index().replace("<main>", "<main>" + startBlock(path.map((a) => a.path)));
  assert.deepEqual(checkArticlesIndex(html, { articles: ART, path }), []);
});

test("a reading path in the wrong order, or missing, is reported", () => {
  const path = [ART[1], ART[0]];
  const wrong = index().replace("<main>", "<main>" + startBlock([ART[0].path, ART[1].path]));
  assert.ok(
    checkArticlesIndex(wrong, { articles: ART, path }).some((m) => m.includes("reading path")),
  );
  assert.ok(
    checkArticlesIndex(index(), { articles: ART, path }).some((m) => m.includes("reading path")),
  );
});

const stepHtml = (n, next) =>
  `<p class="byline__meta"><a class="byline__step" href="/en/articles/#start" data-path-step="${n}">Step ${n} of 3</a></p>` +
  (next ? `<a class="next" href="${next}" data-path-next="${next}">Next step</a>` : "");

test("an article on the path with its step and the next card: no problem", () => {
  const step = { n: 1, total: 3, next: { path: "/en/articles/b/" } };
  assert.deepEqual(
    checkPathStep(stepHtml(1, "/en/articles/b/"), { step, index: "/en/articles/" }),
    [],
  );
  const last = { n: 3, total: 3 };
  assert.deepEqual(checkPathStep(stepHtml(3), { step: last, index: "/en/articles/" }), []);
  assert.deepEqual(
    checkPathStep("<p>no path</p>", { step: undefined, index: "/en/articles/" }),
    [],
  );
});

test("a wrong step, a missing or extra next card, a step off the path are reported", () => {
  const step = { n: 2, total: 3, next: { path: "/en/articles/c/" } };
  const idx = "/en/articles/";
  assert.ok(
    checkPathStep(stepHtml(1, "/en/articles/c/"), { step, index: idx }).some((m) =>
      m.includes("step 2"),
    ),
  );
  assert.ok(checkPathStep(stepHtml(2), { step, index: idx }).some((m) => m.includes("next step")));
  assert.ok(
    checkPathStep(stepHtml(3, "/en/articles/c/"), { step: { n: 3, total: 3 }, index: idx }).some(
      (m) => m.includes("next step"),
    ),
  );
  assert.ok(
    checkPathStep(stepHtml(1), { step: undefined, index: idx }).some((m) =>
      m.includes("off the reading path"),
    ),
  );
});
