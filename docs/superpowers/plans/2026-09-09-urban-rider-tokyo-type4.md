# URBAN RIDER TOKYO TYPE4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Subagents are prohibited for this project by the user.

**Goal:** Build and publish a responsive seven-page graphic T-shirt storefront for URBAN RIDER TOKYO TYPE4.

**Architecture:** A dependency-free Node.js build reads collection, asset and product data and writes seven static HTML pages plus shared CSS and JavaScript to `dist/`. Authorized imagery and local fonts are copied from the existing URT source workspace. Progressive enhancement supplies crossfades, menu, lightbox and pointer effects while normal links remain functional without JavaScript.

**Tech Stack:** Node.js 20+, ES modules, semantic HTML, CSS Grid and clip-path, browser JavaScript, GitHub Actions Pages.

## Global Constraints

- Use only imagery already present in the URT workspace.
- Use workbook-derived product names, integer yen prices and SUZURI URLs without fabrication.
- Use `#fffdf7`, `#151515`, `#00bde3` and `#ffe51c`; do not use gradients, shadows or rounded cards.
- Preserve main subjects through per-image focal positions; use contain sizing for product garments.
- Build TOP plus BIKE, ANIMAL, GAKUSEI, ARMY, DOKURO and BRAND pages.
- Provide usable keyboard, touch, reduced-motion and narrow-screen behavior.
- Do not modify the adjacent TYPE2 or TYPE3 repositories.
- Do not use subagents.

---

### Task 1: Establish the static-site source and verified merchandise dataset

**Files:**
- Create: `package.json`
- Create: `src/collections.mjs`
- Create: `src/assets.json`
- Create: `src/products.json`
- Create: `scripts/import-assets.ps1`
- Create: `scripts/verify.mjs`

**Interfaces:**
- Consumes: authorized files from `../public/images`, `../public/fonts`, `../src/assets.json` and `../src/products.json`
- Produces: `collections: Collection[]`, `assets: Record<CollectionId, AssetSet>` and `products: Product[]`

- [ ] **Step 1: Add a failing data verification script**

Create `scripts/verify.mjs` with assertions that require exactly six unique collection IDs, exactly 99 product rows, an HTTPS SUZURI URL and integer price for every product, at least one product per collection, and an existing source image for every referenced asset.

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collections } from "../src/collections.mjs";
import products from "../src/products.json" with { type: "json" };
import assets from "../src/assets.json" with { type: "json" };

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
assert.equal(new Set(collections.map((item) => item.id)).size, 6);
assert.equal(products.length, 99);
for (const item of products) {
  assert.ok(collections.some((collection) => collection.id === item.brand));
  assert.ok(Number.isInteger(item.price) && item.price > 0);
  assert.match(item.url, /^https:\/\/suzuri\.jp\//);
}
for (const set of Object.values(assets)) {
  for (const image of [...set.top, ...set.art]) {
    assert.ok(fs.existsSync(path.join(root, "public", image)));
  }
}
console.log("Data verification passed");
```

- [ ] **Step 2: Run the verifier and confirm the expected failure**

Run: `npm run verify`

Expected: failure because the source data and public assets do not exist yet.

- [ ] **Step 3: Add package scripts and import the approved source files**

Use `scripts/import-assets.ps1` with explicit resolved source and destination paths. Copy the three source-data files, all `.webp` images and the Bebas Neue and Anton font files. Do not delete or alter source files.

```powershell
$sourceRoot = (Resolve-Path "..").Path
$targetRoot = (Resolve-Path ".").Path
Copy-Item -LiteralPath "$sourceRoot\src\products.json" -Destination "$targetRoot\src\products.json"
Copy-Item -LiteralPath "$sourceRoot\src\assets.json" -Destination "$targetRoot\src\assets.json"
Copy-Item -LiteralPath "$sourceRoot\src\collections.mjs" -Destination "$targetRoot\src\collections.mjs"
Copy-Item -Path "$sourceRoot\public\images\*.webp" -Destination "$targetRoot\public\images"
Copy-Item -Path "$sourceRoot\public\fonts\Anton-*" -Destination "$targetRoot\public\fonts"
Copy-Item -Path "$sourceRoot\public\fonts\BebasNeue-*" -Destination "$targetRoot\public\fonts"
```

- [ ] **Step 4: Run data verification**

Run: `npm run verify`

Expected: `Data verification passed`.

- [ ] **Step 5: Commit the verified data foundation**

```bash
git add package.json src public scripts/import-assets.ps1 scripts/verify.mjs
git commit -m "chore: import verified TYPE4 storefront data"
```

### Task 2: Generate the TOP and six collection pages

**Files:**
- Create: `scripts/build.mjs`
- Create: `src/render.mjs`
- Create: `public/styles.css`
- Create: `public/favicon.svg`
- Modify: `scripts/verify.mjs`

**Interfaces:**
- Consumes: `collections`, `assets`, `products`
- Produces: `renderTop(): string`, `renderCollection(collection): string`, and `dist/index.html` plus six `dist/<id>/index.html` documents

- [ ] **Step 1: Extend verification with failing output assertions**

Add checks that every generated page exists, has one `h1`, includes a skip link, references shared CSS and includes no em dash character. Collection pages must include each matching product URL exactly once.

```js
for (const id of ["", ...collections.map((item) => item.id)]) {
  const page = path.join(root, "dist", id, "index.html");
  assert.ok(fs.existsSync(page), `missing ${page}`);
  const html = fs.readFileSync(page, "utf8");
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /class="skip-link"/);
  assert.doesNotMatch(html, /—/);
}
```

- [ ] **Step 2: Run build verification and confirm the expected failure**

Run: `npm run build && npm run verify`

Expected: failure because page rendering has not been implemented.

- [ ] **Step 3: Implement shared rendering and static output**

Implement HTML escaping, yen formatting, canonical relative asset paths, semantic landmarks, TOP panel links, the editorial rail, collection hero, concept, gallery, product list and footer. Use each collection's supplied Japanese concept and per-image focal settings from `collections.mjs`.

```js
export const formatYen = (value) => `¥${new Intl.NumberFormat("ja-JP").format(value)}`;
export const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");
```

Write `dist/index.html` and each `dist/<collection>/index.html`, then copy `public/` into `dist/`.

- [ ] **Step 4: Implement the print-comic visual system and responsive layouts**

Create CSS tokens, local font faces, irregular panel polygons, asymmetric row templates, collection-specific variables, 75:25 heroes, 40:23:37 galleries and a spacious product grid. At `760px` collapse TOP and gallery panels into the natural order, move the rail inline and cap product imagery at `42vw`. At `430px` use one product column with a maximum image height of `320px`.

```css
:root { --paper:#fffdf7; --ink:#151515; --cyan:#00bde3; --yellow:#ffe51c; }
.product-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:4rem 2rem; }
@media (max-width:760px) { .product-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:2rem 1rem; } }
@media (max-width:430px) { .product-grid { grid-template-columns:1fr; } .product-media { max-height:320px; } }
```

- [ ] **Step 5: Build and verify all seven documents**

Run: `npm run check`

Expected: all syntax, data and generated-page checks pass.

- [ ] **Step 6: Commit the complete static rendering**

```bash
git add scripts src public package.json
git commit -m "feat: build seven-page comic storefront"
```

### Task 3: Add the specified BLENCI LAB interactions accessibly

**Files:**
- Create: `public/app.js`
- Create: `blenci-selection.json`
- Modify: `public/styles.css`
- Modify: `src/render.mjs`
- Modify: `scripts/verify.mjs`

**Interfaces:**
- Consumes: markup data attributes `data-crossfade`, `data-lightbox`, `data-cursor`, `data-wobble` and `data-nav`
- Produces: `initCrossfades()`, `initLightbox()`, `initPointerEffects()`, `initMenu()` and static fallbacks

- [ ] **Step 1: Add failing interaction-contract assertions**

Verify that `public/app.js` contains reduced-motion and fine-pointer media queries, the generated pages reference it with `defer`, and menu/lightbox buttons include `aria-expanded`, `aria-controls` or dialog semantics as appropriate.

```js
const app = fs.readFileSync(path.join(root, "public", "app.js"), "utf8");
assert.match(app, /prefers-reduced-motion/);
assert.match(app, /pointer:\s*fine/);
assert.match(app, /Escape/);
```

- [ ] **Step 2: Run verification and confirm the expected failure**

Run: `npm run check`

Expected: failure because the interaction module and attributes are absent.

- [ ] **Step 3: Implement progressive interactions**

Implement B04 with an interval that respects pause and reduced-motion; G05 as one focus-managed dialog; G10 with CSS custom properties updated only on fine pointers; U08 as a semantic cursor label; U09 with no more than twelve short-lived ink marks; U13 as a click burst; N07 as a circular-reveal menu; C09 as a brief button wobble. C02 uses the normal collection anchor enhanced with an exit class. I02 uses SVG stroke dash animation. I09 uses an angled pseudo-element wipe that reveals product media.

```js
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(hover:hover) and (pointer:fine)");
if (!reduced.matches) initCrossfades();
if (finePointer.matches && !reduced.matches) initPointerEffects();
initLightbox();
initMenu();
```

- [ ] **Step 4: Add static, touch and keyboard fallbacks**

On coarse pointers show standard focus/active states and open lightbox on tap. Keep native anchors for navigation and purchasing. Pause rotating images when the document is hidden. Restore focus when overlays close.

- [ ] **Step 5: Record only implemented catalog entries**

Create `blenci-selection.json` containing catalog commit `5934e9e40bcea73cc4a77195346c07a112f6f127`, layouts `L03` and `L15`, fonts `F21` and `F22`, and the eleven specified gimmick IDs with exact target descriptions.

- [ ] **Step 6: Run checks and commit interaction behavior**

Run: `npm run check`

Expected: all checks pass.

```bash
git add public src scripts blenci-selection.json
git commit -m "feat: add accessible BLENCI interactions"
```

### Task 4: Add deployment, documentation and browser QA

**Files:**
- Create: `.github/workflows/pages.yml`
- Create: `README.md`
- Create: `scripts/serve.mjs`
- Modify: `package.json`
- Modify: `public/styles.css`
- Modify: `public/app.js`

**Interfaces:**
- Consumes: production `dist/`
- Produces: local preview command and GitHub Pages artifact

- [ ] **Step 1: Add the GitHub Pages workflow and local server**

Use Node 20, `npm run check`, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3` with `dist`, and `actions/deploy-pages@v4`. The local server must resolve clean paths and return a 404 for unknown files.

- [ ] **Step 2: Document source provenance, routes and commands**

README must identify the existing URT workspace as the image/data source, list all seven routes, explain `npm run import-assets`, `npm run check`, `npm run dev`, and state that purchase links go to SUZURI.

- [ ] **Step 3: Run a production preview**

Run: `npm run check` followed by `npm run dev`.

Expected: the server reports a localhost URL and serves `dist/index.html`.

- [ ] **Step 4: Capture and inspect desktop and mobile pages**

Use browser automation at 1440 by 1000 and 390 by 844 for TOP plus all six collection routes. Confirm no horizontal overflow, no clipped main subject, readable panel text, compact mobile product media, operable menu/lightbox and valid purchase destinations.

- [ ] **Step 5: Run final checks after visual fixes**

Run: `npm run check` and `git diff --check`.

Expected: both commands exit zero.

- [ ] **Step 6: Commit deployment-ready output**

```bash
git add .github README.md package.json scripts public src blenci-selection.json
git commit -m "chore: prepare GitHub Pages deployment"
```

### Task 5: Publish and verify GitHub Pages

**Files:**
- No source files unless a deployment-only correction is required

**Interfaces:**
- Consumes: clean `main` branch and GitHub Pages workflow
- Produces: public URL `https://yk19890121.github.io/URBAN-RIDER-TOKYO-TYPE4/`

- [ ] **Step 1: Confirm the repository state and remote**

Run: `git status --short && git remote -v && git log --oneline -5`

Expected: clean working tree and `origin` pointing to `URBAN-RIDER-TOKYO-TYPE4.git`.

- [ ] **Step 2: Push the main branch**

Run: `git push -u origin main`

Expected: the remote main branch advances successfully.

- [ ] **Step 3: Confirm deployment completion**

Use GitHub CLI or the Actions API to confirm the Pages workflow has succeeded. If Pages needs repository-level activation, enable the GitHub Actions Pages source and rerun the workflow.

- [ ] **Step 4: Verify the public site**

Open `https://yk19890121.github.io/URBAN-RIDER-TOKYO-TYPE4/` and one collection route. Confirm successful HTTP rendering, shared assets and one SUZURI purchase link.

- [ ] **Step 5: Report the public URL and verification results**

Provide the public URL, page count, build/check outcome and any externally controlled limitation that remains.
