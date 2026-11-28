// The registry of tutorials (spec 005): one entry per tutorial, both languages, in reading order. The tutorial pages,
// the Docs menu and the sitemap read it, so a tutorial is added here once.
import type { Article } from "../articles/types.ts";
import { en as piInstallEn } from "./pi-install.en.ts";
import { fr as piInstallFr } from "./pi-install.fr.ts";
import { en as lightOnMotionEn } from "./light-on-motion.en.ts";
import { fr as lightOnMotionFr } from "./light-on-motion.fr.ts";
import { linkOf, slugOf, type ArticleEntry } from "../../lib/articles.ts";

export { slugOf };

/** In reading order: install first, then the first automation. */
export const tutorials: ArticleEntry[] = [
  { en: piInstallEn, fr: piInstallFr },
  { en: lightOnMotionEn, fr: lightOnMotionFr },
];

/** The tutorials of one language, in reading order: the Docs menu. */
export const tutorialLinks = (lang: "en" | "fr") => tutorials.map((t) => linkOf(t[lang] as Article));

