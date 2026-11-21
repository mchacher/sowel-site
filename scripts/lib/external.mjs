// What the page LOADS from another host. Plain navigation links (<a href>) are fine.

const ABS = /^(?:https?:)?\/\//i;

export function findExternalLoads(source, kind) {
  const found = [];
  if (kind === "css") {
    for (const m of source.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi))
      if (ABS.test(m[1])) found.push(m[1]);
    for (const m of source.matchAll(/@import\s+(?:url\()?["']?([^"');]+)/gi))
      if (ABS.test(m[1])) found.push(m[1]);
    return found;
  }
  for (const m of source.matchAll(
    /<(script|img|iframe|source|video|audio|track|embed|object|link|input)\b([^>]*)>/gi,
  )) {
    const tag = m[1].toLowerCase();
    const attrs = m[2];
    for (const a of attrs.matchAll(/\b(src|data|poster|srcset)\s*=\s*"([^"]*)"/gi)) {
      for (const part of a[2].split(",")) {
        const url = part.trim().split(/\s+/)[0];
        if (ABS.test(url)) found.push(url);
      }
    }
    if (tag === "link") {
      const rel = /\brel\s*=\s*"([^"]*)"/i.exec(attrs)?.[1] ?? "";
      const href = /\bhref\s*=\s*"([^"]*)"/i.exec(attrs)?.[1] ?? "";
      // alternate and canonical are metadata about this site, not loads.
      if (ABS.test(href) && !/\b(alternate|canonical)\b/i.test(rel)) found.push(href);
    }
  }
  for (const m of source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi))
    found.push(...findExternalLoads(m[1], "css"));
  return found;
}
