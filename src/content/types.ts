// The shape of every string on the page. en.ts and fr.ts export a SiteCopy each;
// components receive one and hold no text of their own (spec 001, architecture).

export type IconName =
  | "thermometer"
  | "person-standing"
  | "app-window"
  | "lightbulb"
  | "zap"
  | "layers"
  | "droplets"
  | "wind"
  | "shield-check"
  | "server"
  | "user-x"
  | "cloud-off"
  | "eye-off"
  | "package-check"
  | "sprout"
  | "timer"
  | "sparkles"
  | "git-fork"
  | "book-open"
  | "messages-square"
  | "scroll-text"
  | "house"
  | "layout-grid"
  | "sliders-horizontal"
  | "chef-hat"
  | "sun-moon"
  | "terminal"
  | "radio"
  | "box"
  | "warehouse"
  | "rocket"
  | "code-xml";

export interface Link {
  label: string;
  href: string;
}

export interface Img {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface TreeNode {
  label: string;
  children?: TreeNode[];
}

export interface SiteCopy {
  lang: "en" | "fr";
  meta: { title: string; description: string };
  a11y: { skip: string; home: string; nav: string; sections: string; footer: string; copyDone: string };
  nav: {
    links: Link[];
    github: Link;
    /** The Docs menu of the header (spec 002): the articles of the registry, then the reading entries of the manual. */
    docs: {
      /** The visible label of the button, also its accessible name. */
      label: string;
      /** The accessible name of the panel's nav landmark. */
      menu: string;
      /** The heading of the articles group; the entries come from src/content/articles/index.ts. */
      articles: string;
      /** The heading of the manual group. */
      manual: string;
      /** The manual's entries, on docs.sowel.org in the language of the page. */
      links: { icon: IconName; title: string; body: string; href: string }[];
    };
    switch: { label: string; aria: string; href: string; lang: "en" | "fr" };
  };
  hero: {
    eyebrow: string;
    title: string;
    /** The words of the title that wear the accent colour; must appear in title. */
    titleAccent: string;
    lead: string;
    install: { label: string; command: string; copy: string; copied: string; note: string };
    ctas: { primary: Link; secondary: Link };
    film: { src: string; poster: string; label: string; play: string; duration: string; fallback: string; fallbackLink: string };
  };
  home: {
    id: string;
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    topology: { title: string; body: string; tree: TreeNode };
    equipment: {
      title: string;
      quote: string;
      body: string;
      devicesLabel: string;
      devices: string[];
      equipmentLabel: string;
      equipment: string;
      icon: IconName;
      room: string;
    };
    types: { title: string; body: string; count: string; list: string[]; more: string };
    window: { title: string; image: Img; imageSmall: Img; caption: string };
  };
  rooms: {
    id: string;
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    items: { icon: IconName; title: string; body: string }[];
    stripSmall: Img;
    stripCaption: string;
    activity: { caption: string; image: Img };
  };
  dashboard: {
    id: string;
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    items: { icon: IconName; title: string; body: string }[];
    phone: Img;
  };
  recipes: {
    id: string;
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    placedOn: string;
    asks: string;
    running: string;
    cards: { icon: IconName; title: string; body: string; room: string; settings: string[]; running?: boolean }[];
    ai: { tag: string; title: string; body: string; steps: string[] };
  };
  privacy: {
    id: string;
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    items: { icon: IconName; title: string; body: string }[];
  };
  install: {
    id: string;
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    steps: { title: string; body: string }[];
    manual: Link;
  };
  energy: {
    id: string;
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    /** One line under the lead: the article on the arbiter (spec 002). */
    article: Link;
    flow: { title: string; body: string; image: Img };
    bilan: { title: string; body: string; image: Img; savings: Img };
    arbiter: { title: string; body: string; image: Img };
  };
  modes: {
    id: string;
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    items: { icon: IconName; title: string; body: string }[];
    image: Img;
  };
  community: {
    id: string;
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    links: { icon: IconName; title: string; body: string; href: string }[];
  };
  footer: { tagline: string; licence: string; privacy: string; links: Link[] };
  /** The interface around an article (spec 002): its words stay in src/content/articles/. */
  articlePage: {
    /** The small tag above the title. */
    eyebrow: string;
    /** The breadcrumb: its landmark name, the home link, the current page. */
    breadcrumb: { label: string; home: string; current: string };
    /** The table of contents: its title and landmark name. */
    toc: string;
    /** The reading time; {n} is replaced by the minutes, computed at build time. */
    readingTime: string;
    /** The accessible name of a heading's anchor link; {h} is replaced by the heading. */
    anchor: string;
  };
}
