import test from "node:test";
import assert from "node:assert/strict";
import {
  articleList,
  byYear,
  menuArticles,
  MENU_ARTICLES,
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
