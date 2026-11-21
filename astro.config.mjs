// @ts-check
import { defineConfig } from "astro/config";

// Served at https://sowel.org/ once the DNS points at GitHub Pages. Until then the
// deploy workflow sets SITE_URL and SITE_BASE for https://mchacher.github.io/sowel-site/.
export default defineConfig({
  site: process.env.SITE_URL ?? "https://sowel.org",
  base: process.env.SITE_BASE ?? "/",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "always" },
  devToolbar: { enabled: false },
});
