import test from "node:test";
import assert from "node:assert/strict";
import { compareCopy } from "./lib/parity.mjs";

const base = { a: "x", list: [{ t: "one" }], href: "/y" };

test("same keys in both languages: no problem", () => {
  assert.deepEqual(compareCopy(base, { a: "y", list: [{ t: "un" }], href: "/y" }), []);
});

test("a key missing in the second language is named", () => {
  const p = compareCopy(base, { a: "y", href: "/y" });
  assert.ok(p.some((m) => m.includes("list[0].t")));
});

test("an empty string is rejected", () => {
  const p = compareCopy(base, { a: "", list: [{ t: "un" }], href: "/y" });
  assert.ok(p.some((m) => m.startsWith("empty value") && m.endsWith(": a")));
});

test("an array of different length is a missing key", () => {
  const p = compareCopy({ l: ["a", "b"] }, { l: ["a"] });
  assert.ok(p.some((m) => m.includes("l[1]")));
});

test("a titleAccent must be words of its title", () => {
  assert.deepEqual(
    compareCopy(
      { title: "Every room", titleAccent: "room" },
      { title: "Chaque pièce", titleAccent: "pièce" },
    ),
    [],
  );
  const p = compareCopy(
    { title: "Every room", titleAccent: "home" },
    { title: "Chaque pièce", titleAccent: "pièce" },
  );
  assert.ok(p.some((m) => m.startsWith("titleAccent not found") && m.includes("first")));
});

import { compareArticles } from "./lib/parity.mjs";

const highlight = () => ({
  kind: "highlight",
  text: "It centralises energy and decentralises control.",
  accent: "centralises energy",
  illustration: {
    title: "T",
    desc: "D",
    hub: { name: "The arbiter", tag: "Energy", icon: "scale" },
    meter: { name: "Meter", tag: "Surplus" },
    order: { name: "Priorities", tag: "Yours" },
    recipe: "recipe",
    loadTag: "Control",
    loads: [
      {
        name: "Water heater",
        icon: "shower-head",
        ask: "Asks",
        answer: "Granted",
        state: "granted",
      },
      { name: "Car", icon: "car-front", ask: "Asks", answer: "Waiting", state: "waiting" },
    ],
  },
});
const art = (over = {}) => ({
  lang: "en",
  path: "/en/a/",
  otherPath: "/fr/b/",
  meta: { title: "T", description: "D" },
  datePublished: "2026-11-22",
  title: "Title",
  byline: "By",
  blocks: [
    { kind: "h2", text: "H" },
    { kind: "p", runs: [{ bold: "B." }, { text: " rest" }] },
    { kind: "list", items: ["a", "b"] },
    {
      kind: "figure",
      id: "flow",
      image: { src: "/x", alt: "alt", width: 10, height: 5 },
      caption: "c",
    },
    { kind: "pull", text: "Q" },
    { kind: "links", items: [{ label: "l", href: "/h" }] },
    highlight(),
  ],
  ...over,
});
const other = (over = {}) => art({ lang: "fr", path: "/fr/b/", otherPath: "/en/a/", ...over });

test("articles with the same blocks: no problem", () => {
  assert.deepEqual(compareArticles(art(), other()), []);
});

test("a missing block is reported", () => {
  const b = other();
  b.blocks = b.blocks.slice(0, -1);
  assert.ok(compareArticles(art(), b).some((m) => m.startsWith("article blocks")));
});

test("blocks in another order are reported by kind", () => {
  const b = other();
  [b.blocks[0], b.blocks[1]] = [b.blocks[1], b.blocks[0]];
  assert.ok(compareArticles(art(), b).some((m) => m.includes("kind")));
});

test("a list with fewer items is reported", () => {
  const b = other();
  b.blocks[2] = { kind: "list", items: ["a"] };
  assert.ok(compareArticles(art(), b).some((m) => m.includes("items")));
});

test("a paragraph that loses its bold lead-in is reported", () => {
  const b = other();
  b.blocks[1] = { kind: "p", runs: [{ text: "B. rest" }] };
  assert.ok(compareArticles(art(), b).some((m) => m.includes("runs")));
});

test("a figure without alt text or with another id is reported", () => {
  const b = other();
  b.blocks[3] = {
    kind: "figure",
    id: "arbiter",
    image: { src: "/x", alt: "", width: 10, height: 5 },
    caption: "c",
  };
  const p = compareArticles(art(), b);
  assert.ok(p.some((m) => m.includes("figure flow vs arbiter")));
  assert.ok(p.some((m) => m.includes("empty alt text")));
});

test("an empty pull quote and a wrong twin path are reported", () => {
  const b = other({ otherPath: "/en/zzz/" });
  b.blocks[4] = { kind: "pull", text: " " };
  const p = compareArticles(art(), b);
  assert.ok(p.some((m) => m.includes("empty text")));
  assert.ok(p.some((m) => m.includes("otherPath")));
});

test("an article's interface strings are compared like the rest of the copy", () => {
  const ui = (toc) => ({ articlePage: { toc, readingTime: "{n} min read" } });
  assert.deepEqual(compareCopy(ui("In this article"), ui("Dans cet article")), []);
  const p = compareCopy(ui("In this article"), { articlePage: { readingTime: "{n} min" } });
  assert.ok(p.some((m) => m.includes("articlePage.toc")));
});

test("a reading time without its {n} placeholder is reported", () => {
  const p = compareCopy(
    { articlePage: { readingTime: "{n} min read" } },
    { articlePage: { readingTime: "6 min de lecture" } },
  );
  assert.ok(p.some((m) => m.startsWith("readingTime has no {n}") && m.includes("second")));
});

test("a highlight whose accent is not words of its text is reported", () => {
  const b = other();
  b.blocks[6] = { ...highlight(), accent: "something else" };
  const p = compareArticles(art(), b);
  assert.ok(p.some((m) => m.includes("the accent is not words of its text")));
});

test("a highlight with an appliance missing, an empty label or another icon is reported", () => {
  const b = other();
  const h = highlight();
  h.illustration.loads.pop();
  h.illustration.hub = { ...h.illustration.hub, tag: "", icon: "fan" };
  h.illustration.desc = " ";
  b.blocks[6] = h;
  const p = compareArticles(art(), b);
  assert.ok(p.some((m) => m.includes("2 appliances vs 1")));
  assert.ok(p.some((m) => m.includes("empty hub tag")));
  assert.ok(p.some((m) => m.includes("empty diagram description")));
  assert.ok(p.some((m) => m.includes("the hub has another icon")));
  const c = other();
  const k = highlight();
  k.illustration.loads[1] = {
    ...k.illustration.loads[1],
    name: "Voiture",
    icon: "fan",
    state: "rest",
  };
  c.blocks[6] = k;
  assert.ok(compareArticles(art(), c).some((m) => m.includes("appliance 2 has another icon")));
  assert.ok(
    compareArticles(art(), c).some((m) => m.includes("appliance 2 has another answer state")),
  );
  const d = other();
  const e = highlight();
  e.illustration.loads[0] = { ...e.illustration.loads[0], ask: "", state: "later" };
  d.blocks[6] = e;
  const q = compareArticles(art(), d);
  assert.ok(q.some((m) => m.includes("empty appliance request")));
  assert.ok(q.some((m) => m.includes("unknown answer state")));
});

test("a highlight without appliances is reported", () => {
  const a = art();
  const b = other();
  for (const x of [a, b])
    x.blocks[6] = { ...highlight(), illustration: { ...highlight().illustration, loads: [] } };
  assert.ok(compareArticles(a, b).some((m) => m.includes("a diagram without appliances")));
});

import { compareRegistry } from "./lib/parity.mjs";

const pair = () => {
  const open = { kind: "p", runs: [{ text: "First paragraph." }] };
  const en = art({ path: "/en/articles/a/", otherPath: "/fr/articles/b/" });
  const fr = other({ path: "/fr/articles/b/", otherPath: "/en/articles/a/" });
  en.blocks = [open, ...en.blocks];
  fr.blocks = [open, ...fr.blocks];
  return { en, fr };
};

test("a registry entry with both languages and paths: no problem", () => {
  assert.deepEqual(compareRegistry([pair()]), []);
});

test("a registry entry without its French article is reported", () => {
  const p = compareRegistry([{ ...pair(), fr: undefined }]);
  assert.ok(p.some((m) => m.includes("both an English and a French")));
});

test("a path outside /{lang}/articles/ and a reused path are reported", () => {
  const bad = pair();
  bad.en.path = "/en/a/";
  bad.fr.otherPath = "/en/a/";
  const p = compareRegistry([bad, pair(), pair()]);
  assert.ok(p.some((m) => m.includes("en path is not")));
  assert.ok(p.some((m) => m.includes("used twice")));
});

test("an article that does not open on a paragraph has no standfirst", () => {
  const e = pair();
  e.en.blocks = e.en.blocks.slice(1);
  e.fr.blocks = e.fr.blocks.slice(1);
  assert.ok(compareRegistry([e]).some((m) => m.includes("does not open on a paragraph")));
});

import { compareDocsMenu } from "./lib/parity.mjs";

const docsCopy = (root, titles = ["Getting started", "Release notes"]) => ({
  nav: {
    docs: {
      label: "Docs",
      menu: "m",
      articles: "Articles",
      manual: "M",
      links: [
        { icon: "rocket", title: titles[0], body: "b", href: `${root}user/getting-started/` },
        { icon: "scroll-text", title: titles[1], body: "b", href: `${root}release-notes/` },
      ],
    },
  },
});

test("the Docs menu with the same pages under the right prefixes: no problem", () => {
  const en = docsCopy("https://docs.sowel.org/");
  const fr = docsCopy("https://docs.sowel.org/fr/", ["Premiers pas", "Notes de version"]);
  assert.deepEqual(compareDocsMenu(en, fr), []);
  assert.deepEqual(compareCopy(en, fr), []);
});

test("a Docs menu entry missing, under the wrong prefix or on another page is reported", () => {
  const en = docsCopy("https://docs.sowel.org/");
  const fr = docsCopy("https://docs.sowel.org/fr/");
  fr.nav.docs.links.pop();
  assert.ok(compareDocsMenu(en, fr).some((m) => m.includes("2 manual entries in English, 1")));
  assert.ok(compareCopy(en, fr).some((m) => m.includes("nav.docs.links[1].title")));
  const wrong = docsCopy("https://docs.sowel.org/");
  assert.ok(
    compareDocsMenu(en, wrong).some((m) => m.includes("not under https://docs.sowel.org/fr/")),
  );
  const enFr = docsCopy("https://docs.sowel.org/fr/");
  assert.ok(compareDocsMenu(enFr, fr).some((m) => m.includes("without /fr/")));
  const moved = docsCopy("https://docs.sowel.org/fr/");
  moved.nav.docs.links[0].href = "https://docs.sowel.org/fr/user/";
  assert.ok(compareDocsMenu(en, moved).some((m) => m.includes("another page in each language")));
});
