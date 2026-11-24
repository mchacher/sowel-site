import test from "node:test";
import assert from "node:assert/strict";
import { slugify, headingIds, wordCount, readingMinutes, formatDate } from "../src/lib/article.ts";
import { en } from "../src/content/articles/energy-brain.en.ts";
import { fr } from "../src/content/articles/energy-brain.fr.ts";

test("a heading slugs to a stable id, accents folded", () => {
  assert.equal(slugify("Ce qu'il ne fait pas encore"), "ce-qu-il-ne-fait-pas-encore");
  assert.equal(slugify("L'essayer"), "l-essayer");
  assert.equal(slugify("Why it is hard?"), "why-it-is-hard");
});

test("two headings that slug alike get distinct ids", () => {
  const a = {
    ...en,
    blocks: [
      { kind: "h2", text: "Try it" },
      { kind: "h2", text: "Try it!" },
    ],
  };
  assert.deepEqual(headingIds(a), ["try-it", "try-it-2"]);
});

test("the article has one id per heading, all distinct", () => {
  for (const a of [en, fr]) {
    const ids = headingIds(a);
    assert.equal(ids.length, a.blocks.filter((b) => b.kind === "h2").length);
    assert.equal(new Set(ids).size, ids.length);
  }
});

test("reading time is words over 200, rounded up, at least one minute", () => {
  const short = {
    ...en,
    title: "One two",
    blocks: [{ kind: "p", runs: [{ text: "three four" }] }],
  };
  assert.equal(wordCount(short), 4);
  assert.equal(readingMinutes(short), 1);
  assert.equal(readingMinutes(en), Math.ceil(wordCount(en) / 200));
  assert.ok(readingMinutes(en) >= 4 && readingMinutes(en) <= 8);
});

test("the date reads in the page's language", () => {
  assert.equal(formatDate("2026-11-22", "fr"), "22 novembre 2026");
  assert.equal(formatDate("2026-11-22", "en"), "22 November 2026");
});

test("the word count reads list leads, link runs and scheme captions (spec 003)", () => {
  const a = {
    title: "T",
    blocks: [
      { kind: "p", runs: [{ text: "one" }, { link: "two three", href: "/x" }] },
      { kind: "list", items: [{ lead: "four", text: "five" }, "six"] },
      { kind: "topology", label: "not counted", caption: "seven eight", zones: [] },
    ],
  };
  assert.equal(wordCount(a), 9);
});

test("the word count reads raw names and the captions of spec 004 schemes", () => {
  const a = {
    title: "T",
    blocks: [
      { kind: "p", runs: [{ text: "one" }, { code: "two" }] },
      {
        kind: "knowledge",
        label: "not counted",
        caption: "three four",
        heads: [],
        rows: [],
        zones: [],
      },
      { kind: "chain", label: "not counted", caption: "five", steps: [] },
      { kind: "stack", label: "not counted", caption: "six", base: "not counted", items: [] },
    ],
  };
  assert.equal(wordCount(a), 7);
});
