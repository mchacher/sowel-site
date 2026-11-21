// Structural checks on one built page: what a crawler, a screen reader and a share card need.
// Regex level on purpose: the output is generated and regular, and no dependency is added.

const strip = (s) =>
  s
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const attr = (tag, name) => new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, "i").exec(tag)?.[1];

export function checkPage(html, { lang }) {
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
      if (j["@type"] !== "SoftwareApplication") p.push("JSON-LD is not a SoftwareApplication");
    } catch {
      p.push("JSON-LD does not parse");
    }
  }
  for (const m of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const named = attr(m[1], "aria-label") || strip(m[2]);
    if (!named) p.push(`a button has no accessible name: <button${m[1].slice(0, 60)}`);
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
