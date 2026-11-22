// The shape of an article (spec 002). The two languages export one Article each, built of the
// same blocks in the same order; scripts/lib/parity.mjs compares them block by block.
import type { Img, Link } from "../types";

/** A run of a paragraph: plain text, or text in bold. */
export type Run = { text: string } | { bold: string };

export type Block =
  | { kind: "p"; runs: Run[] }
  | { kind: "h2"; text: string }
  | { kind: "list"; items: string[] }
  /** The two figures of the article: a captured view with its caption. */
  | { kind: "figure"; id: "flow" | "arbiter"; image: Img; caption: string }
  /** The key sentence, set in exergue. */
  | { kind: "pull"; text: string }
  | { kind: "links"; items: Link[] };

export interface Article {
  lang: "en" | "fr";
  /** Root-absolute path of this page, with its trailing slash. */
  path: string;
  /** The same article in the other language. */
  otherPath: string;
  meta: { title: string; description: string };
  /** ISO date, shown in the structured data only. */
  datePublished: string;
  title: string;
  byline: string;
  blocks: Block[];
}
