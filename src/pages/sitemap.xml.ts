import type { APIRoute } from "astro";
import { withBase } from "../lib/url";

export const GET: APIRoute = ({ site }) => {
  const abs = (p: string) => new URL(withBase(p), site).href;
  const langs = ["en", "fr"];
  const urls = langs
    .map(
      (l) => `  <url>
    <loc>${abs(`/${l}/`)}</loc>
${langs.map((x) => `    <xhtml:link rel="alternate" hreflang="${x}" href="${abs(`/${x}/`)}" />`).join("\n")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs("/en/")}" />
  </url>`,
    )
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
