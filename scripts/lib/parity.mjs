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
  return problems;
}
