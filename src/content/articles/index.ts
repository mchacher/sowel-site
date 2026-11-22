// The registry of articles (spec 002): one entry per article, both languages. The article pages, the sitemap,
// the Articles section of the home page and the checks all read it, so an article is added here once.
import type { Img } from "../types";
import type { Article } from "./types";
import { en as energyBrainEn } from "./energy-brain.en.ts";
import { fr as energyBrainFr } from "./energy-brain.fr.ts";
import { readingMinutes } from "../../lib/article.ts";
import { withBase } from "../../lib/url.ts";

export interface ArticleEntry {
  en: Article;
  fr: Article;
  /** The picture of the card on the home page, per language. */
  thumbnail: { en: Img; fr: Img };
}

/** What the Articles section of the home page shows for one article. */
export interface ArticleCard {
  slug: string;
  path: string;
  href: string;
  title: string;
  /** The article's first paragraph. */
  standfirst: string;
  datePublished: string;
  minutes: number;
  thumbnail: Img;
}

/** The image of one of an article's figures. */
function figureImage(article: Article, id: "flow" | "arbiter"): Img {
  const b = article.blocks.find((x) => x.kind === "figure" && x.id === id);
  if (!b || b.kind !== "figure") throw new Error(`${article.path}: no figure ${id}`);
  return b.image;
}

export const articles: ArticleEntry[] = [
  {
    en: energyBrainEn,
    fr: energyBrainFr,
    thumbnail: { en: figureImage(energyBrainEn, "flow"), fr: figureImage(energyBrainFr, "flow") },
  },
];

/** The last segment of an article's path: its address under /{lang}/articles/. */
export function slugOf(article: Article): string {
  return article.path.split("/").filter(Boolean).pop() ?? "";
}

/** The first paragraph, as plain text. */
export function standfirstOf(article: Article): string {
  const first = article.blocks[0];
  return first?.kind === "p" ? first.runs.map((r) => ("bold" in r ? r.bold : r.text)).join("") : "";
}

/** The cards of one language, the most recent first. */
export function articleCards(lang: "en" | "fr"): ArticleCard[] {
  return articles
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
        thumbnail: entry.thumbnail[lang],
      };
    })
    .sort((x, y) => y.datePublished.localeCompare(x.datePublished));
}
