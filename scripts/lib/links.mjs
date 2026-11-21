// Internal links and anchors of a built site must resolve.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export function internalRefs(html) {
  const refs = [];
  for (const m of html.matchAll(/<(?:a|link)\b[^>]*\bhref\s*=\s*"([^"]*)"/gi)) {
    const h = m[1];
    if (h.startsWith("/") && !h.startsWith("//")) refs.push(h);
    else if (h.startsWith("#") && h.length > 1) refs.push(h);
  }
  return refs;
}

export function ids(html) {
  return new Set([...html.matchAll(/\bid\s*=\s*"([^"]+)"/gi)].map((m) => m[1]));
}

export function resolveFile(dist, urlPath) {
  const clean = urlPath.split("#")[0].split("?")[0];
  const direct = join(dist, clean);
  if (clean.endsWith("/") && existsSync(join(direct, "index.html")))
    return join(direct, "index.html");
  if (existsSync(direct) && !direct.endsWith("/")) return direct;
  return null;
}

/** Returns a list of problems for one page. */
export function checkPage(dist, pageUrl, html) {
  const problems = [];
  for (const ref of internalRefs(html)) {
    if (ref.startsWith("#")) {
      if (!ids(html).has(ref.slice(1))) problems.push(`${pageUrl}: anchor ${ref} not found`);
      continue;
    }
    const file = resolveFile(dist, ref);
    if (!file) {
      problems.push(`${pageUrl}: ${ref} does not exist`);
      continue;
    }
    const hash = ref.split("#")[1];
    if (hash && file.endsWith(".html") && !ids(readFileSync(file, "utf8")).has(hash)) {
      problems.push(`${pageUrl}: ${ref} anchor not found`);
    }
  }
  return problems;
}
