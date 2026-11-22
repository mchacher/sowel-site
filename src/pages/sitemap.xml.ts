import type { APIRoute } from "astro";
import { withBase } from "../lib/url";
import { articles, indexPath } from "../content/articles/index.ts";

// Each entry is one page and its twin in the other language: both get a <url> with the full pair.
const pages = [
  { en: "/en/", fr: "/fr/" },
  { en: indexPath("en"), fr: indexPath("fr") },
  ...articles.map((a) => ({ en: a.en.path, fr: a.fr.path })),
];

export const GET: APIRoute = ({ site }) => {
  const abs = (p: string) => new URL(withBase(p), site).href;
  const langs = ["en", "fr"] as const;
  const urls = pages
    .flatMap((pair) =>
      langs.map(
        (l) => `  <url>
    <loc>${abs(pair[l])}</loc>
${langs.map((x) => `    <xhtml:link rel="alternate" hreflang="${x}" href="${abs(pair[x])}" />`).join("\n")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(pair.en)}" />
  </url>`,
      ),
    )
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
