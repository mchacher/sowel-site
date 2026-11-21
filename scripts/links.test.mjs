import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkPage } from "./lib/links.mjs";

function site() {
  const dist = mkdtempSync(join(tmpdir(), "site-"));
  mkdirSync(join(dist, "en"));
  writeFileSync(join(dist, "en", "index.html"), '<h1 id="top">x</h1><section id="home"></section>');
  return dist;
}

test("every internal link and anchor resolves", () => {
  const dist = site();
  const html =
    '<a href="#home">h</a><a href="/en/">en</a><a href="/en/#home">e</a><section id="home"></section>';
  assert.deepEqual(checkPage(dist, "/fr/", html), []);
});

test("a missing anchor is reported", () => {
  assert.ok(checkPage(site(), "/fr/", '<a href="#nope">x</a>').length === 1);
});

test("a missing page is reported", () => {
  assert.ok(checkPage(site(), "/fr/", '<a href="/de/">x</a>')[0].includes("does not exist"));
});

test("an anchor missing on the target page is reported", () => {
  assert.ok(checkPage(site(), "/fr/", '<a href="/en/#nope">x</a>')[0].includes("anchor"));
});
