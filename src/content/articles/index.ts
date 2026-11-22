// The registry of articles (spec 002): one entry per article, both languages. The article pages, the sitemap,
// the Docs menu of the header and the checks all read it, so an article is added here once.
import type { Article } from "./types";
import { en as energyBrainEn } from "./energy-brain.en.ts";
import { fr as energyBrainFr } from "./energy-brain.fr.ts";
import { readingMinutes } from "../../lib/article.ts";
import { withBase } from "../../lib/url.ts";

export interface ArticleEntry {
  en: Article;
  fr: Article;
}

/** What the Docs menu shows for one article. */
export interface ArticleLink {
  /** Root-absolute path, as in the article (without the base). */
  path: string;
  href: string;
  title: string;
  datePublished: string;
  minutes: number;
}

export const articles: ArticleEntry[] = [{ en: energyBrainEn, fr: energyBrainFr }];

/** The last segment of an article's path: its address under /{lang}/articles/. */
export function slugOf(article: Article): string {
  return article.path.split("/").filter(Boolean).pop() ?? "";
}

/** The articles of one language, the most recent first. */
export function articleLinks(lang: "en" | "fr"): ArticleLink[] {
  return articles
    .map((entry) => {
      const a = entry[lang];
      return {
        path: a.path,
        href: withBase(a.path),
        title: a.title,
        datePublished: a.datePublished,
        minutes: readingMinutes(a),
      };
    })
    .sort((x, y) => y.datePublished.localeCompare(x.datePublished));
}
