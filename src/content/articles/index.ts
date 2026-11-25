// The registry of articles (spec 002): one entry per article, both languages. The article pages, the index pages,
// the sitemap, the Docs menu of the header and the checks all read it, so an article is added here once.
import { en as energyBrainEn } from "./energy-brain.en.ts";
import { fr as energyBrainFr } from "./energy-brain.fr.ts";
import { en as comfortEn } from "./comfort.en.ts";
import { fr as comfortFr } from "./comfort.fr.ts";
import { en as knowledgeEn } from "./knowledge.en.ts";
import { fr as knowledgeFr } from "./knowledge.fr.ts";
import { articleList, byYear, menuArticles, pathList, stepOf, type ArticleEntry } from "../../lib/articles.ts";

export { slugOf, indexPath, MENU_ARTICLES, type ArticleEntry, type ArticleLink, type PathStep } from "../../lib/articles.ts";

export const articles: ArticleEntry[] = [
  { en: energyBrainEn, fr: energyBrainFr },
  { en: comfortEn, fr: comfortFr },
  { en: knowledgeEn, fr: knowledgeFr },
];

/**
 * The reading path: the articles that read best in this order, each building on the one before. The index page opens
 * with it, and each of its articles names its step and ends on the next one. An article may stay off the path.
 */
export const readingPath: ArticleEntry[] = [
  { en: knowledgeEn, fr: knowledgeFr },
  { en: comfortEn, fr: comfortFr },
  { en: energyBrainEn, fr: energyBrainFr },
];

/** The reading path of one language, in its order. */
export const pathLinks = (lang: "en" | "fr") => pathList(readingPath, lang);

/** Where one article stands on the path, if it is on it. */
export const pathStep = (lang: "en" | "fr", path: string) => stepOf(readingPath, lang, path);

/** Every article of one language, the most recent first: the index page. */
export const articleLinks = (lang: "en" | "fr") => articleList(articles, lang);

/** The same, cut by year. */
export const articlesByYear = (lang: "en" | "fr") => byYear(articleList(articles, lang));

/** The few most recent: the Docs menu. */
export const menuLinks = (lang: "en" | "fr") => menuArticles(articles, lang);
