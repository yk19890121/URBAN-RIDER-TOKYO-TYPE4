import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collections } from "../src/collections.mjs";
import { renderTop, renderCollection } from "../src/render.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(root, "src", name), "utf8"));
const assets = readJson("assets.json");
const products = readJson("products.json");
const focals = readJson("focals.json");

fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(path.join(root, "public"), dist, { recursive: true });
fs.writeFileSync(path.join(dist, "index.html"), renderTop({ collections, assets }));

for (const collection of collections) {
  const output = path.join(dist, collection.slug);
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, "index.html"), renderCollection({ collection, collections, assets, products, focals }));
}

console.log(`Built ${collections.length + 1} pages in dist/.`);
