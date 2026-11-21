import test from "node:test";
import assert from "node:assert/strict";
import { compareCopy } from "./lib/parity.mjs";

const base = { a: "x", list: [{ t: "one" }], href: "/y" };

test("same keys in both languages: no problem", () => {
  assert.deepEqual(compareCopy(base, { a: "y", list: [{ t: "un" }], href: "/y" }), []);
});

test("a key missing in the second language is named", () => {
  const p = compareCopy(base, { a: "y", href: "/y" });
  assert.ok(p.some((m) => m.includes("list[0].t")));
});

test("an empty string is rejected", () => {
  const p = compareCopy(base, { a: "", list: [{ t: "un" }], href: "/y" });
  assert.ok(p.some((m) => m.startsWith("empty value") && m.endsWith(": a")));
});

test("an array of different length is a missing key", () => {
  const p = compareCopy({ l: ["a", "b"] }, { l: ["a"] });
  assert.ok(p.some((m) => m.includes("l[1]")));
});
