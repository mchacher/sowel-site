// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://sowel.org",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "always" },
  devToolbar: { enabled: false },
});
