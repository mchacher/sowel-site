// Root-absolute paths ("/img/a.webp", "/fr/") must follow the site's base: the site
// is served at the root of sowel.org, and under /sowel-site/ on GitHub Pages until
// the DNS points at it. Node scripts import the content files too, where Vite's
// import.meta.env does not exist, hence the fallback.
const base: string = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/";

export function withBase(path: string): string {
  if (!path.startsWith("/")) return path;
  return base.replace(/\/$/, "") + path;
}
