// Build-time helpers of the article page (spec 002): heading ids, reading time, publication date.
// Pure functions, so scripts/article.test.mjs can run them under Node's type stripping.
import type { Article, Run } from "../content/articles/types.ts";

/** The words of a run: its text, its bold text, its link text or its raw name. */
export const runText = (r: Run): string => ("bold" in r ? r.bold : "link" in r ? r.link : "code" in r ? r.code : r.text);

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

/** The schemes drawn in HTML (specs 003 and 004): each renders as a figure with a caption. */
export const SCHEME_KINDS: string[] = ["topology", "pipeline", "form", "layers", "knowledge", "chain", "stack"];

/** Every word a reader reads: title, paragraphs, headings, lists, the exergue, the highlight, captions (figures and schemes) and links. */
export function wordCount(article: Article): number {
  const parts: string[] = [article.title];
  for (const b of article.blocks) {
    if (b.kind === "p") parts.push(...b.runs.map(runText));
    else if (b.kind === "h2" || b.kind === "pull") parts.push(b.text);
    else if (b.kind === "list") parts.push(...b.items.map((t) => (typeof t === "string" ? t : `${t.lead} ${t.text}`)));
    else if (b.kind === "links") parts.push(...b.items.map((l) => l.label));
    else if (b.kind === "highlight") parts.push(b.text);
    else if (b.kind === "figure" || b.kind === "shot") parts.push(b.caption);
    else if (b.kind === "items") parts.push(...b.items.flat().map(runText));
    else if (b.kind === "callout") parts.push(b.title, ...b.runs.map(runText));
    else if (SCHEME_KINDS.includes(b.kind)) parts.push((b as { caption: string }).caption);
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
