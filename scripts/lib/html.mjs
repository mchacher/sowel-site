// Structural checks on one built page: what a crawler, a screen reader and a share card need.
// Regex level on purpose: the output is generated and regular, and no dependency is added.

const strip = (s) =>
  s
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const attr = (tag, name) => new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, "i").exec(tag)?.[1];

export function checkPage(html, { lang, type = "SoftwareApplication" }) {
  const p = [];
  if (!new RegExp(`<html[^>]*\\blang="${lang}"`, "i").test(html))
    p.push(`html lang is not ${lang}`);
  const h1 = html.match(/<h1\b/gi)?.length ?? 0;
  if (h1 !== 1) p.push(`expected one h1, found ${h1}`);
  if (!/<title>[^<]+<\/title>/i.test(html)) p.push("no title");
  if (!/<meta[^>]*name="description"[^>]*content="[^"]{20,}"/i.test(html))
    p.push("no meta description");
  if (!/<link[^>]*rel="canonical"/i.test(html)) p.push("no canonical link");
  for (const l of ["en", "fr", "x-default"]) {
    if (!new RegExp(`<link[^>]*rel="alternate"[^>]*hreflang="${l}"`, "i").test(html))
      p.push(`no hreflang ${l}`);
  }
  if (!/<meta[^>]*property="og:image"[^>]*content="https?:\/\//i.test(html))
    p.push("no absolute og:image");
  if (!/<meta[^>]*name="twitter:card"/i.test(html)) p.push("no twitter:card");
  const ld = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i.exec(html);
  if (!ld) p.push("no JSON-LD");
  else {
    try {
      const j = JSON.parse(ld[1]);
      if (j["@type"] !== type) p.push(`JSON-LD is not a ${type}`);
      if (type === "Article") {
        for (const k of ["headline", "datePublished", "image", "author", "publisher"])
          if (!j[k]) p.push(`Article JSON-LD has no ${k}`);
        if (j.inLanguage !== lang) p.push(`Article JSON-LD inLanguage is not ${lang}`);
      }
    } catch {
      p.push("JSON-LD does not parse");
    }
  }
  if (type === "Article") {
    const figs = html.match(/<figure\b/gi)?.length ?? 0;
    if (figs !== 2) p.push(`expected two figures, found ${figs}`);
    for (const m of html.matchAll(/<figure\b[\s\S]*?<\/figure>/gi)) {
      const img = /<img\b([^>]*)>/i.exec(m[0]);
      if (!img || !(attr(img[1], "alt") ?? "").trim()) p.push("a figure image has no alt text");
      if (!/<figcaption\b/i.test(m[0])) p.push("a figure has no caption");
    }
    if (!/<blockquote\b[^>]*class="[^"]*\bpull\b/i.test(html)) p.push("no pull quote");
    const alt = [
      ...html.matchAll(/<link[^>]*rel="alternate"[^>]*hreflang="(en|fr)"[^>]*href="([^"]*)"/gi),
    ];
    for (const [, l, href] of alt)
      if (!/^https?:\/\/.+\/articles\//.test(href))
        p.push(`hreflang ${l} does not point at an article`);
    // The reading interface (spec 002, layout pass): ids on headings, a contents, a reading time.
    const h2 = [...html.matchAll(/<h2\b([^>]*)>/gi)];
    if (!h2.length) p.push("no h2 in the article");
    for (const m of h2) if (!attr(m[1], "id")) p.push("an article heading has no id");
    const toc = /<nav\b[^>]*\bdata-toc\b[^>]*>([\s\S]*?)<\/nav>/i.exec(html);
    if (!toc) p.push("no table of contents");
    else {
      const targets = [...toc[1].matchAll(/href="#([^"]+)"/gi)].map((m) => m[1]);
      if (targets.length !== h2.length)
        p.push(`the contents list ${targets.length} sections for ${h2.length} headings`);
    }
    if (!/\bdata-reading-time="[1-9]\d*"[^>]*>[\s\S]*?\d/i.test(html)) p.push("no reading time");
    if (!/<time\b[^>]*datetime="\d{4}-\d{2}-\d{2}"/i.test(html)) p.push("no publication date");
  }
  // Every in-page anchor resolves to an element of the page.
  {
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/gi)].map((m) => m[1]));
    for (const m of html.matchAll(/<a\b[^>]*href="#([^"]+)"/gi))
      if (!ids.has(m[1])) p.push(`an anchor does not resolve: #${m[1]}`);
  }
  // Landmarks: several nav elements must each carry a name.
  const navs = [...html.matchAll(/<nav\b([^>]*)>/gi)];
  if (navs.length > 1)
    for (const m of navs)
      if (!attr(m[1], "aria-label") && !attr(m[1], "aria-labelledby"))
        p.push("a nav landmark has no accessible name");
  for (const m of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const label = attr(m[1], "aria-label");
    const text = strip(m[2]);
    if (!(label || text)) p.push(`a button has no accessible name: <button${m[1].slice(0, 60)}`);
    if (label && text && !label.toLowerCase().includes(text.toLowerCase())) {
      p.push(
        `a button's accessible name does not contain its visible text: "${text}" vs "${label}"`,
      );
    }
  }
  for (const m of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (attr(m[1], "alt") === undefined)
      p.push(`an image has no alt attribute: ${(attr(m[1], "src") ?? "").slice(-40)}`);
  }
  // Label in name: an aria-label on a link must contain its visible text.
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const label = attr(m[1], "aria-label");
    const text = strip(m[2]);
    if (label && text && !label.toLowerCase().includes(text.toLowerCase())) {
      p.push(`a link's accessible name does not contain its visible text: "${text}" vs "${label}"`);
    }
  }
  return p;
}

/** The sitemap lists every page of every pair, each with the full pair of alternates. */
export function checkSitemap(xml, pairs) {
  const p = [];
  for (const pair of pairs) {
    for (const path of [pair.en, pair.fr]) {
      const block = new RegExp(
        `<url>\\s*<loc>[^<]*${path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</loc>([\\s\\S]*?)</url>`,
      ).exec(xml);
      if (!block) {
        p.push(`sitemap has no entry for ${path}`);
        continue;
      }
      for (const alt of [pair.en, pair.fr])
        if (!block[1].includes(`${alt}"`))
          p.push(`sitemap entry ${path} lacks the alternate ${alt}`);
      if (!block[1].includes('hreflang="x-default"'))
        p.push(`sitemap entry ${path} lacks x-default`);
    }
  }
  return p;
}

/**
 * The Docs menu of the header (spec 002): a details disclosure whose summary is named « Docs » and controls a named
 * nav panel inside it, with one link per article of the language (the current one marked aria-current="page"), then
 * the manual's links, in order, every one on docs.sowel.org under the prefix of the language.
 */
export function checkDocsMenu(html, { lang, articles, manual, current }) {
  const p = [];
  const det = /<details\b[^>]*\bdata-docs\b[^>]*>([\s\S]*?)<\/details>/i.exec(html);
  if (!det) return ["no Docs menu in the header"];
  const body = det[1];
  const sum = /<summary\b([^>]*)>([\s\S]*?)<\/summary>/i.exec(body);
  if (!sum) p.push("the Docs menu has no summary");
  else {
    if (strip(sum[2]) !== "Docs") p.push(`the Docs button is named "${strip(sum[2])}", not "Docs"`);
    const controls = attr(sum[1], "aria-controls");
    const nav = /<nav\b([^>]*)>/i.exec(body);
    if (!nav) p.push("the Docs panel is not a nav");
    else {
      if (!controls || attr(nav[1], "id") !== controls)
        p.push("the Docs button does not control the panel");
      if (!(attr(nav[1], "aria-label") ?? "").trim())
        p.push("the Docs panel has no accessible name");
    }
  }
  const groups = [
    ...body.matchAll(/<p\b[^>]*class="[^"]*\bdocs__group\b[^"]*"[^>]*>([\s\S]*?)<\/p>/gi),
  ];
  if (groups.length !== 2 || groups.some((g) => !strip(g[1])))
    p.push(`the Docs panel has ${groups.length} named groups, not 2`);
  const links = [...body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
  for (const [, a, inner] of links)
    if (!strip(inner)) p.push(`a Docs entry has no text: ${attr(a, "href")}`);
  const arts = links.filter((m) => /\bdata-docs-article\b/.test(m[1]));
  for (const path of articles) {
    const hits = arts.filter((m) => (attr(m[1], "href") ?? "").endsWith(path));
    if (hits.length !== 1) p.push(`the Docs menu links ${hits.length} times to ${path}`);
  }
  if (arts.length !== articles.length)
    p.push(`the Docs menu has ${arts.length} articles for ${articles.length}`);
  for (const [, a] of arts) {
    const isCurrent = !!current && (attr(a, "href") ?? "").endsWith(current);
    const marked = attr(a, "aria-current") === "page";
    if (isCurrent && !marked)
      p.push(`the current article is not marked in the Docs menu: ${current}`);
    if (!isCurrent && marked) p.push(`a Docs entry is marked current wrongly: ${attr(a, "href")}`);
  }
  const man = links.filter((m) => /\bdata-docs-manual\b/.test(m[1])).map((m) => attr(m[1], "href"));
  if (JSON.stringify(man) !== JSON.stringify(manual))
    p.push(`the manual's links are not the expected ones: ${man.join(" ")}`);
  for (const href of man) {
    let u;
    try {
      u = new URL(href);
    } catch {
      p.push(`a manual link is not a URL: ${href}`);
      continue;
    }
    if (u.protocol !== "https:" || u.host !== "docs.sowel.org")
      p.push(`a manual link is not on https://docs.sowel.org: ${href}`);
    if ((lang === "fr") !== u.pathname.startsWith("/fr/"))
      p.push(`a manual link has the wrong language prefix for ${lang}: ${href}`);
  }
  return p;
}

/** The footer of every page links to the article of its language (one article: « Articles » leads to it). */
export function checkFooterArticles(html, path) {
  const foot = /<footer\b[\s\S]*?<\/footer>/i.exec(html)?.[0] ?? "";
  const esc = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`href="[^"#]*${esc}"`).test(foot) ? [] : [`the footer has no link to ${path}`];
}

/** The Articles zone of the home page is gone (replaced by the Docs menu): nothing may point at it. */
export function checkNoArticlesZone(html) {
  const p = [];
  if (/\bid="articles"/i.test(html)) p.push("an element still has id=articles");
  if (/href="[^"]*#articles"/i.test(html)) p.push("a link still points at #articles");
  return p;
}
