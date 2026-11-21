import test from "node:test";
import assert from "node:assert/strict";
import { findExternalLoads } from "./lib/external.mjs";

test("a Google Fonts stylesheet is an external load", () => {
  const html = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter">';
  assert.deepEqual(findExternalLoads(html, "html"), [
    "https://fonts.googleapis.com/css2?family=Inter",
  ]);
});

test("a foreign script and image are external loads", () => {
  const html =
    '<script src="https://cdn.example.com/a.js"></script><img src="//img.example.com/a.png" alt="">';
  assert.equal(findExternalLoads(html, "html").length, 2);
});

test("plain navigation links are not loads", () => {
  const html =
    '<a href="https://github.com/mchacher/sowel">GitHub</a><link rel="alternate" hreflang="fr" href="https://sowel.org/fr/">';
  assert.deepEqual(findExternalLoads(html, "html"), []);
});

test("a url() in css or an inline style is caught", () => {
  assert.equal(findExternalLoads("a{background:url(https://x.example/a.png)}", "css").length, 1);
  assert.equal(
    findExternalLoads("<style>@import 'https://x.example/a.css';</style>", "html").length,
    1,
  );
});

test("same-origin loads are fine", () => {
  assert.deepEqual(
    findExternalLoads('<img src="/img/a.webp"><script src="/a.js"></script>', "html"),
    [],
  );
});
