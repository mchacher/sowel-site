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
  /** A sentence set in a card with a diagram under it; `accent` is words of `text`, set in the accent ink. */
  | { kind: "highlight"; text: string; accent: string; illustration: Illustration }
  | { kind: "links"; items: Link[] };

/** Lucide icons the diagrams of an article may use. */
export type DiagramIcon = "scale" | "chef-hat" | "droplets" | "car-front" | "fan";

/**
 * The diagram of a highlight (spec 002): one hub joined to a few appliances, each driven by a recipe. Every label
 * lives here, in the language of the article; the component draws the shapes and holds no text.
 */
export interface Illustration {
  /** The accessible name of the diagram, and its longer description. */
  title: string;
  desc: string;
  hub: { name: string; tag: string; icon: DiagramIcon };
  /** The label of the recipe chip on every appliance, and the tag under it. */
  recipe: string;
  loadTag: string;
  loads: { name: string; icon: DiagramIcon }[];
}

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
