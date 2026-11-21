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
