// Flatten a copy object to { "path.0.key": value } and compare two languages.
// Pure functions, so the check script and its tests share them.

export function flatten(value, prefix = "", out = {}) {
  if (Array.isArray(value)) {
    value.forEach((v, i) => flatten(v, `${prefix}[${i}]`, out));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  } else {
    out[prefix] = value;
  }
  return out;
}

/** Keys that hold the same value in every language (media, ids, hrefs, counts). */
const SHARED = /(\.|^)(id|src|href|width|height|icon|command|count|poster|lang|running)$|^lang$/;

export function compareCopy(a, b) {
  const fa = flatten(a);
  const fb = flatten(b);
  const problems = [];
  for (const k of Object.keys(fa))
    if (!(k in fb)) problems.push(`missing in the second language: ${k}`);
  for (const k of Object.keys(fb))
    if (!(k in fa)) problems.push(`missing in the first language: ${k}`);
  for (const [side, f] of [
    ["first", fa],
    ["second", fb],
  ]) {
    for (const [k, v] of Object.entries(f)) {
      if (
        typeof v === "string" &&
        v.trim() === "" &&
        !SHARED.test(k) &&
        !k.endsWith("columns[0]")
      ) {
        problems.push(`empty value in the ${side} language: ${k}`);
      }
    }
  }
  for (const [side, f] of [
    ["first", fa],
    ["second", fb],
  ]) {
    for (const [k, v] of Object.entries(f)) {
      if (!k.endsWith("titleAccent")) continue;
      const title = f[k.slice(0, -"titleAccent".length) + "title"];
      if (typeof title !== "string" || !title.includes(v))
        problems.push(`titleAccent not found in its title, ${side} language: ${k}`);
    }
  }
  for (const [side, f] of [
    ["first", fa],
    ["second", fb],
  ]) {
    for (const [k, v] of Object.entries(f))
      if (k.endsWith("readingTime") && !String(v).includes("{n}"))
        problems.push(`readingTime has no {n} placeholder, ${side} language: ${k}`);
  }
  return problems;
}

/** Kinds that carry a language-neutral value (an id, a link target): compared for presence, not for text. */
const text = (v) => typeof v === "string" && v.trim() !== "";

/**
 * Compare two articles block by block (spec 002): same kinds in the same order, and inside a block the same
 * counts (runs and their kinds, list items, links, figure ids). Texts must be filled; they differ by language.
 */
export function compareArticles(a, b) {
  const problems = [];
  const ba = a.blocks ?? [];
  const bb = b.blocks ?? [];
  if (ba.length !== bb.length)
    problems.push(`article blocks: ${ba.length} in the first language, ${bb.length} in the second`);
  for (let i = 0; i < Math.min(ba.length, bb.length); i++) {
    const x = ba[i];
    const y = bb[i];
    const at = `block ${i}`;
    if (x.kind !== y.kind) {
      problems.push(`${at}: kind ${x.kind} vs ${y.kind}`);
      continue;
    }
    const filled = (s, what) => {
      if (!text(s)) problems.push(`${at} (${x.kind}): empty ${what}`);
    };
    switch (x.kind) {
      case "p": {
        if (x.runs.length !== y.runs.length)
          problems.push(`${at}: ${x.runs.length} runs vs ${y.runs.length}`);
        x.runs.forEach((r, j) => {
          const s = y.runs[j];
          if (s && Object.keys(r)[0] !== Object.keys(s)[0])
            problems.push(`${at}: run ${j} is not the same kind`);
        });
        for (const r of [...x.runs, ...y.runs]) {
          filled(Object.values(r)[0], "run");
          if ("link" in r) filled(r.href, "link href");
        }
        x.runs.forEach((r, j) => {
          const s = y.runs[j];
          if (s && "href" in r && r.href.startsWith("/") !== String(s.href ?? "").startsWith("/"))
            problems.push(`${at}: link ${j} is internal in one language only`);
        });
        break;
      }
      case "h2":
      case "pull":
        filled(x.text, "text");
        filled(y.text, "text");
        break;
      case "list":
        if (x.items.length !== y.items.length)
          problems.push(`${at}: ${x.items.length} items vs ${y.items.length}`);
        x.items.forEach((t, j) => {
          const u = y.items[j];
          if (u !== undefined && typeof t !== typeof u)
            problems.push(`${at}: item ${j + 1} has a bold lead in one language only`);
        });
        for (const t of [...x.items, ...y.items]) {
          if (typeof t === "string") filled(t, "item");
          else {
            filled(t?.lead, "item lead");
            filled(t?.text, "item text");
          }
        }
        break;
      // The schemes drawn in HTML (spec 003): named and captioned, the same shape in both languages.
      case "topology":
      case "pipeline":
      case "form":
      case "layers": {
        for (const h of [x, y]) {
          filled(h.label, "scheme label");
          filled(h.caption, "scheme caption");
        }
        const parts = { topology: "zones", pipeline: "stages", form: "rows", layers: "items" }[
          x.kind
        ];
        const pa = x[parts] ?? [];
        const pb = y[parts] ?? [];
        if (!pa.length) problems.push(`${at} (${x.kind}): an empty scheme`);
        if (pa.length !== pb.length) problems.push(`${at}: ${pa.length} ${parts} vs ${pb.length}`);
        const shape = (v) =>
          JSON.stringify(v, (k, val) =>
            typeof val === "string" && !["icon", "pill"].includes(k) ? "" : val,
          );
        pa.forEach((part, j) => {
          if (pb[j] && shape(part) !== shape(pb[j]))
            problems.push(
              `${at}: ${parts} ${j + 1} differ in shape, icon, level or state between the languages`,
            );
        });
        for (const part of [...pa, ...pb])
          JSON.stringify(part, (k, val) => {
            if (typeof val === "string" && k !== "value") filled(val, `${x.kind} text`);
            return val;
          });
        if (x.kind === "form")
          for (const h of [x, y]) {
            filled(h.title, "form title");
            filled(h.subtitle, "form subtitle");
          }
        break;
      }
      case "links":
        if (x.items.length !== y.items.length)
          problems.push(`${at}: ${x.items.length} links vs ${y.items.length}`);
        for (const l of [...x.items, ...y.items]) {
          filled(l.label, "label");
          filled(l.href, "href");
        }
        break;
      case "highlight":
        for (const h of [x, y]) {
          filled(h.text, "text");
          filled(h.accent, "accent");
          if (text(h.accent) && !h.text?.includes(h.accent))
            problems.push(`${at} (highlight): the accent is not words of its text`);
        }
        break;
      case "diagram": {
        for (const h of [x, y]) {
          const il = h.illustration ?? {};
          filled(il.title, "diagram title");
          filled(il.desc, "diagram description");
          filled(il.hub?.name, "hub name");
          filled(il.hub?.tag, "hub tag");
          filled(il.meter?.name, "meter name");
          filled(il.meter?.tag, "meter tag");
          filled(il.order?.name, "priority name");
          filled(il.order?.tag, "priority tag");
          filled(il.recipe, "recipe label");
          filled(il.loadTag, "appliance tag");
          for (const l of il.loads ?? []) {
            filled(l.name, "appliance name");
            filled(l.ask, "appliance request");
            filled(l.answer, "arbiter answer");
          }
        }
        const la = x.illustration?.loads ?? [];
        const lb = y.illustration?.loads ?? [];
        if (!la.length) problems.push(`${at} (diagram): a diagram without appliances`);
        if (la.length !== lb.length)
          problems.push(`${at}: ${la.length} appliances vs ${lb.length}`);
        if (x.illustration?.hub?.icon !== y.illustration?.hub?.icon)
          problems.push(`${at}: the hub has another icon in each language`);
        for (const loads of [la, lb])
          loads.forEach((l, j) => {
            if (!["granted", "waiting", "rest"].includes(l.state))
              problems.push(`${at}: appliance ${j + 1} has an unknown answer state`);
          });
        la.forEach((l, j) => {
          if (lb[j] && l.icon !== lb[j].icon)
            problems.push(`${at}: appliance ${j + 1} has another icon in each language`);
          if (lb[j] && l.state !== lb[j].state)
            problems.push(`${at}: appliance ${j + 1} has another answer state in each language`);
        });
        break;
      }
      case "figure":
        if (x.id !== y.id) problems.push(`${at}: figure ${x.id} vs ${y.id}`);
        for (const f of [x, y]) {
          filled(f.caption, "caption");
          filled(f.image?.alt, "alt text");
          if (!(f.image?.width > 0 && f.image?.height > 0))
            problems.push(`${at}: figure without size`);
        }
        break;
    }
  }
  for (const [side, art] of [
    ["first", a],
    ["second", b],
  ]) {
    for (const k of ["title", "byline", "datePublished"])
      if (!text(art[k])) problems.push(`empty ${k}, ${side} language`);
    if (!text(art.meta?.title) || !text(art.meta?.description))
      problems.push(`empty meta, ${side} language`);
  }
  if (a.datePublished !== b.datePublished)
    problems.push("datePublished differs between the languages");
  if (a.path === b.path) problems.push("both languages share one path");
  if (a.otherPath !== b.path || b.otherPath !== a.path)
    problems.push("otherPath does not point at the other language's path");
  return problems;
}

/**
 * The registry of articles (spec 002, src/content/articles/index.ts): each entry pairs an English and a French
 * article with the same blocks, both under /{lang}/articles/<slug>/, opening on a paragraph (the standfirst), and
 * no two entries share a path.
 */
export function compareRegistry(entries) {
  const problems = [];
  const seen = new Set();
  entries.forEach((entry, n) => {
    const at = `article ${n + 1}`;
    if (!entry?.en || !entry?.fr) {
      problems.push(`${at}: needs both an English and a French article`);
      return;
    }
    problems.push(...compareArticles(entry.en, entry.fr).map((p) => `${at}: ${p}`));
    for (const lang of ["en", "fr"]) {
      const a = entry[lang];
      if (a.lang !== lang) problems.push(`${at}: the ${lang} article says lang ${a.lang}`);
      if (!new RegExp(`^/${lang}/articles/[a-z0-9]+(-[a-z0-9]+)*/$`).test(a.path ?? ""))
        problems.push(`${at}: ${lang} path is not /${lang}/articles/<slug>/: ${a.path}`);
      if (seen.has(a.path)) problems.push(`${at}: the path ${a.path} is used twice`);
      seen.add(a.path);
      const first = a.blocks?.[0];
      if (first?.kind !== "p")
        problems.push(`${at}: the ${lang} article does not open on a paragraph`);
    }
  });
  return problems;
}

/**
 * The manual's entries of the Docs menu (spec 002): the same pages in both languages, in the same order, with the
 * same icons; the English ones on https://docs.sowel.org/ without a language prefix, the French ones under /fr/.
 */
export function compareDocsMenu(en, fr) {
  const problems = [];
  const a = en?.nav?.docs?.links ?? [];
  const b = fr?.nav?.docs?.links ?? [];
  if (!a.length) problems.push("the Docs menu has no manual entry");
  if (a.length !== b.length)
    problems.push(`the Docs menu has ${a.length} manual entries in English, ${b.length} in French`);
  const root = "https://docs.sowel.org/";
  a.forEach((l, i) => {
    const o = b[i];
    if (!o) return;
    if (!l.href?.startsWith(root) || l.href.startsWith(`${root}fr/`))
      problems.push(`the English manual entry ${i + 1} is not on ${root} without /fr/: ${l.href}`);
    if (!o.href?.startsWith(`${root}fr/`))
      problems.push(`the French manual entry ${i + 1} is not under ${root}fr/: ${o.href}`);
    else if (o.href.replace(`${root}fr/`, root) !== l.href)
      problems.push(
        `manual entry ${i + 1} points at another page in each language: ${l.href} ${o.href}`,
      );
    if (l.icon !== o.icon) problems.push(`manual entry ${i + 1} has another icon in each language`);
  });
  return problems;
}
