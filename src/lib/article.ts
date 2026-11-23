// Build-time helpers of the article page (spec 002): heading ids, reading time, publication date.
// Pure functions, so scripts/article.test.mjs can run them under Node's type stripping.
import type { Article } from "../content/articles/types.ts";

/** A stable, readable id from a heading: lower case, accents folded, words joined by hyphens. */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Ids for the headings of an article, in order, made unique by a suffix when two headings slug alike. */
export function headingIds(article: Article): string[] {
  const seen = new Map<string, number>();
  return article.blocks
    .filter((b) => b.kind === "h2")
    .map((b) => {
      const base = slugify(b.text) || "section";
      const n = seen.get(base) ?? 0;
      seen.set(base, n + 1);
      return n ? `${base}-${n + 1}` : base;
    });
}

/** Every word a reader reads: title, paragraphs, headings, lists, the exergue, the highlight, captions and links. */
export function wordCount(article: Article): number {
  const parts: string[] = [article.title];
  for (const b of article.blocks) {
    if (b.kind === "p") parts.push(...b.runs.map((r) => ("bold" in r ? r.bold : r.text)));
    else if (b.kind === "h2" || b.kind === "pull") parts.push(b.text);
    else if (b.kind === "list") parts.push(...b.items);
    else if (b.kind === "links") parts.push(...b.items.map((l) => l.label));
    else if (b.kind === "highlight") parts.push(b.text);
    else if (b.kind === "figure") parts.push(b.caption);
  }
  return parts.join(" ").split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

/** Minutes of reading at about 200 words a minute, rounded up, never below one. */
export function readingMinutes(article: Article, wpm = 200): number {
  return Math.max(1, Math.ceil(wordCount(article) / wpm));
}

/** The publication date in the reader's language: « 22 novembre 2026 », « 22 November 2026 ». */
export function formatDate(iso: string, lang: "en" | "fr"): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}
