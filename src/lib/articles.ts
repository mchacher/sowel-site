// The lists built from the registry of articles (spec 002): the index page, the Docs menu, the sitemap.
// Pure functions over a list of entries, so scripts/articles.test.mjs can run them on a registry of its own.
import type { Article } from "../content/articles/types.ts";
import type { Img } from "../content/types.ts";
import { readingMinutes } from "./article.ts";
import { withBase } from "./url.ts";

/** How many articles the Docs menu of the header shows; the « All articles » row leads to the rest. */
export const MENU_ARTICLES = 3;

export interface ArticleEntry {
  en: Article;
  fr: Article;
}

/** What the index page and the Docs menu show for one article. */
export interface ArticleLink {
  slug: string;
  /** Root-absolute path, as in the article (without the base). */
  path: string;
  href: string;
  title: string;
  /** The article's first paragraph, as plain text. */
  standfirst: string;
  datePublished: string;
  minutes: number;
  /** The image of the article's first figure, if it has one. */
  thumbnail?: Img;
}

export interface YearGroup {
  year: string;
  items: ArticleLink[];
}

/** The last segment of an article's path: its address under /{lang}/articles/. */
export function slugOf(article: Article): string {
  return article.path.split("/").filter(Boolean).pop() ?? "";
}

/** The first paragraph, as plain text. */
export function standfirstOf(article: Article): string {
  const first = article.blocks[0];
  return first?.kind === "p" ? first.runs.map((r) => ("bold" in r ? r.bold : r.text)).join("") : "";
}

/** The image of the first figure. */
export function thumbnailOf(article: Article): Img | undefined {
  for (const b of article.blocks) if (b.kind === "figure") return b.image;
  return undefined;
}

/** The articles of one language, the most recent first (same date: by title, so the order is stable). */
export function articleList(entries: ArticleEntry[], lang: "en" | "fr"): ArticleLink[] {
  return entries
    .map((entry) => {
      const a = entry[lang];
      return {
        slug: slugOf(a),
        path: a.path,
        href: withBase(a.path),
        title: a.title,
        standfirst: standfirstOf(a),
        datePublished: a.datePublished,
        minutes: readingMinutes(a),
        thumbnail: thumbnailOf(a),
      };
    })
    .sort((x, y) => y.datePublished.localeCompare(x.datePublished) || x.title.localeCompare(y.title));
}

/** The Docs menu's share: the most recent few. */
export function menuArticles(entries: ArticleEntry[], lang: "en" | "fr", max = MENU_ARTICLES): ArticleLink[] {
  return articleList(entries, lang).slice(0, max);
}

/** A sorted list cut by year of publication, the years in the list's order. */
export function byYear(list: ArticleLink[]): YearGroup[] {
  const groups: YearGroup[] = [];
  for (const item of list) {
    const year = item.datePublished.slice(0, 4);
    const last = groups[groups.length - 1];
    if (last?.year === year) last.items.push(item);
    else groups.push({ year, items: [item] });
  }
  return groups;
}

/** The index page of a language. */
export function indexPath(lang: "en" | "fr"): string {
  return `/${lang}/articles/`;
}
