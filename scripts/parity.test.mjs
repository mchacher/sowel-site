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
