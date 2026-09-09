import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(root, "src", name), "utf8"));

const { collections } = await import("../src/collections.mjs");
const products = readJson("products.json");
const assets = readJson("assets.json");

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
  assert.ok(set && set.top.length && set.art.length, `missing art set: ${collection.slug}`);
  for (const image of [...set.top, ...set.art]) {
    assert.ok(fs.existsSync(path.join(root, "public", image)), `missing art image: ${image}`);
  }
}

console.log(`Data verification passed: ${collections.length} collections, ${products.length} products.`);
