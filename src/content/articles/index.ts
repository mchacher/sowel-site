// The registry of articles (spec 002): one entry per article, both languages. The article pages, the index pages,
// the sitemap, the Docs menu of the header and the checks all read it, so an article is added here once.
import { en as energyBrainEn } from "./energy-brain.en.ts";
import { fr as energyBrainFr } from "./energy-brain.fr.ts";
import { articleList, byYear, menuArticles, type ArticleEntry } from "../../lib/articles.ts";

export { slugOf, indexPath, MENU_ARTICLES, type ArticleEntry, type ArticleLink } from "../../lib/articles.ts";

export const articles: ArticleEntry[] = [{ en: energyBrainEn, fr: energyBrainFr }];

/** Every article of one language, the most recent first: the index page. */
export const articleLinks = (lang: "en" | "fr") => articleList(articles, lang);

/** The same, cut by year. */
export const articlesByYear = (lang: "en" | "fr") => byYear(articleList(articles, lang));

/** The few most recent: the Docs menu. */
export const menuLinks = (lang: "en" | "fr") => menuArticles(articles, lang);
