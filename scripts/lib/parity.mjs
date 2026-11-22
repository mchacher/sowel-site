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
        for (const r of [...x.runs, ...y.runs]) filled(Object.values(r)[0], "run");
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
        for (const t of [...x.items, ...y.items]) filled(t, "item");
        break;
      case "links":
        if (x.items.length !== y.items.length)
          problems.push(`${at}: ${x.items.length} links vs ${y.items.length}`);
        for (const l of [...x.items, ...y.items]) {
          filled(l.label, "label");
          filled(l.href, "href");
        }
        break;
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
