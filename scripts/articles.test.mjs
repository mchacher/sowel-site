import test from "node:test";
import assert from "node:assert/strict";
import {
  articleList,
  byYear,
  menuArticles,
  MENU_ARTICLES,
  pathList,
  stepOf,
  thumbnailOf,
} from "../src/lib/articles.ts";

// A registry of six fake articles over two years, given out of order: the lists must sort and cut it.
const fake = (n, date) => {
  const one = (lang) => ({
    lang,
    path: `/${lang}/articles/a${n}/`,
    otherPath: `/${lang === "en" ? "fr" : "en"}/articles/a${n}/`,
    meta: { title: `T${n}`, description: `D${n}` },
    datePublished: date,
    title: `Article ${n}`,
    byline: "B.",
    blocks: [
      { kind: "p", runs: [{ text: "Lead " }, { bold: String(n) }] },
      {
        kind: "figure",
        id: "flow",
        image: { src: `/img/${n}.webp`, alt: "A", width: 10, height: 8 },
        caption: "C",
      },
    ],
  });
  return { en: one("en"), fr: one("fr") };
};
const registry = [
  fake(1, "2026-03-01"),
  fake(4, "2027-01-15"),
  fake(2, "2026-07-10"),
  fake(6, "2027-06-30"),
  fake(3, "2026-11-22"),
  fake(5, "2027-04-02"),
];

test("the menu shows the three most recent articles", () => {
  assert.equal(MENU_ARTICLES, 3);
  const menu = menuArticles(registry, "fr");
  assert.equal(menu.length, 3);
  assert.deepEqual(
    menu.map((a) => a.path),
    ["/fr/articles/a6/", "/fr/articles/a5/", "/fr/articles/a4/"],
  );
  // Fewer articles than the cap: all of them.
  assert.equal(menuArticles(registry.slice(0, 2), "en").length, 2);
});

test("the index shows all six, newest first, grouped by year", () => {
  const list = articleList(registry, "en");
  assert.equal(list.length, 6);
  assert.deepEqual(
    list.map((a) => a.slug),
    ["a6", "a5", "a4", "a3", "a2", "a1"],
  );
  const groups = byYear(list);
  assert.deepEqual(
    groups.map((g) => [g.year, g.items.map((a) => a.slug)]),
    [
      ["2027", ["a6", "a5", "a4"]],
      ["2026", ["a3", "a2", "a1"]],
    ],
  );
});

test("an entry carries its standfirst, reading time and the first figure as thumbnail", () => {
  const [a] = articleList([fake(7, "2026-01-01")], "en");
  assert.equal(a.standfirst, "Lead 7");
  assert.equal(a.minutes, 1);
  assert.equal(a.thumbnail?.src, "/img/7.webp");
  assert.equal(a.href, "/en/articles/a7/");
  assert.equal(thumbnailOf({ ...fake(8, "2026-01-01").en, blocks: [] }), undefined);
});

test("an article's own thumbnail wins over its first figure (spec 003)", () => {
  const a = {
    ...fake(9, "2026-01-01").en,
    thumbnail: { src: "/img/own.webp", alt: "Own", width: 20, height: 10 },
  };
  assert.equal(thumbnailOf(a)?.src, "/img/own.webp");
});

test("the reading path keeps its own order, not the date order", () => {
  const path = [registry[4], registry[0], registry[2]];
  assert.deepEqual(
    pathList(path, "fr").map((a) => a.title),
    ["Article 3", "Article 1", "Article 2"],
  );
});

test("each step knows its rank, the length of the path and the next article; the last has none", () => {
  const path = [registry[4], registry[0], registry[2]];
  const first = stepOf(path, "en", "/en/articles/a3/");
  assert.equal(first.n, 1);
  assert.equal(first.total, 3);
  assert.equal(first.next.path, "/en/articles/a1/");
  const last = stepOf(path, "en", "/en/articles/a2/");
  assert.equal(last.n, 3);
  assert.equal(last.next, undefined);
});

test("an article off the path has no step, and a path read in the other language does not match", () => {
  const path = [registry[4], registry[0]];
  assert.equal(stepOf(path, "en", "/en/articles/a6/"), undefined);
  assert.equal(stepOf(path, "fr", "/en/articles/a3/"), undefined);
});
