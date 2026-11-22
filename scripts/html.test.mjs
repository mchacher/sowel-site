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
