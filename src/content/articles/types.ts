// The shape of an article (spec 002, widened by specs 003 and 004). The two languages export one Article each, built of the
// same blocks in the same order; scripts/lib/parity.mjs compares them block by block.
import type { Img, Link } from "../types";

/** A run of a paragraph: plain text, text in bold, a link (spec 003), or a raw name set in the mono face (spec 004). */
export type Run = { text: string } | { bold: string } | { link: string; href: string } | { code: string };

/** A list item: plain text, or a bold lead followed by its text (spec 003). */
export type ListItem = string | { lead: string; text: string };

/** The captured views an article may show; the id sets the figure's frame. */
export type FigureId = "flow" | "arbiter" | "strip" | "activity" | "devices" | "room";

export type Block =
  | { kind: "p"; runs: Run[] }
  | { kind: "h2"; text: string }
  | { kind: "list"; items: ListItem[] }
  /** A captured view with its caption. */
  | { kind: "figure"; id: FigureId; image: Img; caption: string }
  /** The key sentence, set in exergue. */
  | { kind: "pull"; text: string }
  /** A sentence set in a card; `accent` is words of `text`, set in the accent ink. */
  | { kind: "highlight"; text: string; accent: string }
  /** The diagram of the arbiter at work, in its own card. */
  | { kind: "diagram"; illustration: Illustration }
  /** Schemes drawn in HTML (spec 003): each is an image named by `label`, in a figure with its caption. */
  | { kind: "topology"; label: string; caption: string; zones: TopologyZone[] }
  | { kind: "pipeline"; label: string; caption: string; stages: PipelineStage[] }
  | { kind: "form"; label: string; caption: string; title: string; subtitle: string; rows: FormRow[] }
  | { kind: "layers"; label: string; caption: string; items: LayerItem[] }
  /** Schemes of spec 004: the layers of knowledge on examples, a propagation chain, and the closing stack. */
  | { kind: "knowledge"; label: string; caption: string; heads: KnowledgeHead[]; rows: KnowledgeRow[]; zones: KnowledgeZone[] }
  | { kind: "chain"; label: string; caption: string; steps: ChainStep[] }
  | { kind: "stack"; label: string; caption: string; base: string; items: StackItem[] }
  | { kind: "links"; items: Link[] };

/** A zone of the topology scheme: its depth in the tree and the values computed for it. `on` marks a presence. */
export interface TopologyZone {
  name: string;
  level: 0 | 1 | 2;
  icon: DiagramIcon;
  values: { text: string; on?: boolean }[];
}

/**
 * A stage of the pipeline scheme (devices, then the room, then the recipe). `raw` sets its rows in the mono face;
 * `accent` outlines the stage; a row's `pill` sets its value as a presence (`room`) or as on now (`on`, amber).
 */
export interface PipelineStage {
  name: string;
  tag: string;
  icon: DiagramIcon;
  raw?: boolean;
  accent?: boolean;
  rows: { key: string; value: string; pill?: "room" | "on" }[];
}

/** A row of the recipe form scheme: a question and its answer, or a group heading. */
export type FormRow = { label: string; value: string } | { group: string };

/** A layer of the closing scheme: what it is, what it holds and where it is told. `accent` outlines it. */
export interface LayerItem {
  name: string;
  body: string;
  note: string;
  icon: DiagramIcon;
  accent?: boolean;
}

/** A column heading of the knowledge scheme: the devices, then the three layers. `icon` replaces the layer number. */
export interface KnowledgeHead {
  name: string;
  tag: string;
  icon?: DiagramIcon;
}

/** One example of the knowledge scheme: its devices and their raw data, the standardised data, the equipment. */
export interface KnowledgeRow {
  devices: { name: string; raw: string }[];
  data: { name: string; value: string }[];
  equipment: { name: string; tag: string };
}

/** A zone of the knowledge scheme: a room (outlined) or a level above it, with the values computed for it. */
export interface KnowledgeZone {
  name: string;
  icon: DiagramIcon;
  tier: "room" | "above";
  values: { text: string; on?: boolean }[];
}

/** A step of the propagation chain. `accent` outlines it. */
export interface ChainStep {
  key: string;
  value: string;
  icon: DiagramIcon;
  accent?: boolean;
}

/** An item of the closing stack: a use on top, or a layer of the knowledge at the base. */
export interface StackItem {
  name: string;
  icon: DiagramIcon;
  tier: "use" | "layer";
  body?: string;
}

/** Lucide icons the diagrams of an article may use. */
export type DiagramIcon =
  | "scale"
  | "radio"
  | "house"
  | "layers"
  | "door-closed"
  | "chef-hat"
  | "droplets"
  | "car-front"
  | "fan"
  | "gauge"
  | "list-ordered"
  | "arrow-up"
  | "arrow-down"
  | "circle-check"
  | "hourglass"
  | "moon"
  | "arrow-left-right"
  | "list"
  | "package"
  | "layout-grid"
  | "map";

/** What the arbiter answers a recipe: granted, waiting, or nothing to give (at rest). */
export type LoadState = "granted" | "waiting" | "rest";

/**
 * The diagram of an article (spec 002): the arbiter reads the meter and the priorities, each appliance's recipe asks
 * it for surplus and it answers. Every label lives here, in the language of the article; the component draws the
 * shapes and holds no text.
 */
export interface Illustration {
  /** The accessible name of the diagram, and its longer description. */
  title: string;
  desc: string;
  hub: { name: string; tag: string; icon: DiagramIcon };
  /** What the arbiter reads: the main meter, and the priority order the user set. */
  meter: { name: string; tag: string };
  order: { name: string; tag: string };
  /** The label of the recipe chip on every appliance, and the tag under it. */
  recipe: string;
  loadTag: string;
  /** Per appliance: what its recipe asks, what the arbiter answers, and an optional detail of the answer. */
  loads: {
    name: string;
    icon: DiagramIcon;
    ask: string;
    answer: string;
    state: LoadState;
    detail?: string;
  }[];
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
  /** The picture of the article's card on the index page; without it, the first figure (spec 003). */
  thumbnail?: Img;
  blocks: Block[];
}
