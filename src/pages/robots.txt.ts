import type { APIRoute } from "astro";
import { withBase } from "../lib/url";

// Only honoured at the root of a domain, so it takes effect once sowel.org serves the site.
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL(withBase("/sitemap.xml"), site).href}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
