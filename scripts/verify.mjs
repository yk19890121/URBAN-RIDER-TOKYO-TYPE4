import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(root, "src", name), "utf8"));

const { collections } = await import("../src/collections.mjs");
const products = readJson("products.json");
const assets = readJson("assets.json");
const app = fs.readFileSync(path.join(root, "public", "app.js"), "utf8");
const selection = JSON.parse(fs.readFileSync(path.join(root, "blenci-selection.json"), "utf8"));

assert.equal(new Set(collections.map((item) => item.slug)).size, 6, "six unique collections required");
assert.equal(products.length, 99, "all 99 workbook product rows required");

for (const item of products) {
  assert.ok(collections.some((collection) => collection.slug === item.brand), `unknown brand: ${item.brand}`);
  assert.ok(Number.isInteger(item.price) && item.price > 0, `invalid price: ${item.id}`);
  assert.match(item.url, /^https:\/\/suzuri\.jp\//, `invalid purchase URL: ${item.id}`);
  assert.ok(fs.existsSync(path.join(root, "public", item.image)), `missing product image: ${item.image}`);
}

for (const collection of collections) {
  assert.ok(products.some((item) => item.brand === collection.slug), `no products for ${collection.slug}`);
  const set = assets[collection.slug];
  assert.ok(set && set.top.length && set.hero.length && Array.isArray(set.gallery), `missing top/hero/gallery set: ${collection.slug}`);
  assert.equal(set.gallery.length > 0, collection.slug !== "brand", `gallery rule mismatch: ${collection.slug}`);
  for (const image of [...set.top, ...set.hero, ...set.gallery]) {
    assert.ok(fs.existsSync(path.join(root, "public", image)), `missing art image: ${image}`);
  }
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
for (const slug of ["", ...collections.map((item) => item.slug)]) {
  const page = path.join(root, "dist", slug, "index.html");
  assert.ok(fs.existsSync(page), `missing generated page: ${slug || "TOP"}`);
  const html = fs.readFileSync(page, "utf8");
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `one h1 required: ${slug || "TOP"}`);
  assert.match(html, /class="skip-link"/, `skip link required: ${slug || "TOP"}`);
  assert.match(html, /styles\.css/, `shared CSS required: ${slug || "TOP"}`);
  assert.match(html, /app\.js/, `shared JavaScript required: ${slug || "TOP"}`);
  assert.doesNotMatch(html, /—/, `em dash is prohibited: ${slug || "TOP"}`);
  if (slug) {
    for (const product of products.filter((item) => item.brand === slug)) {
      assert.equal((html.match(new RegExp(escapeRegExp(product.url), "g")) || []).length, 1, `purchase URL count: ${product.id}`);
    }
  }
}

assert.match(app, /prefers-reduced-motion/);
assert.match(app, /pointer:\s*fine/);
assert.match(app, /Escape/);
assert.deepEqual(selection.gimmicks.map((item) => item.id), ["C02", "B04", "I02", "I09", "G05", "G10", "C09", "U08", "U09", "U13", "N07"]);

console.log(`Verification passed: ${collections.length + 1} pages, ${products.length} products.`);
