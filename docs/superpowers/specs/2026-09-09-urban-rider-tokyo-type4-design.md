# URBAN RIDER TOKYO TYPE4 design specification

## Goal

Create a responsive graphic T-shirt storefront consisting of one collection index and six collection pages. The site must feel like a Japanese independent comic and street magazine while keeping product information and purchasing actions clear.

The brand statement is 「都市を駆ける、自由な魂へ。」. The tone is urban and casual, never excessively wild or motorcycle-club-like.

## Deliverables

- `/index.html`: collection index
- `/bike/`: BIKE COLLECTION
- `/animal/`: ANIMAL DESIGN COLLECTION
- `/gakusei/`: GAKUSEI COLLECTION
- `/army/`: ARMY COLLECTION
- `/dokuro/`: DOKURO COLLECTION
- `/brand/`: URBAN RIDER TOKYO BRAND COLLECTION
- Static assets, source data, build and verification scripts
- GitHub Actions deployment to GitHub Pages

The external SUZURI purchase destination is the end of the implemented shopping flow. Cart, checkout and account pages are out of scope.

## Technical architecture

Use a dependency-free static-site generator in Node.js. Collection metadata, image choices, focal positions and product records are stored in source modules or JSON and rendered into seven independent HTML documents. Shared CSS and JavaScript provide the visual system and interactions.

The source imagery and workbook-derived product mapping come from the existing URT workspace. Only authorized TOP, collection and T-shirt assets are copied into TYPE4. The source workspace remains unchanged.

Static pages are preferred over a client-routed SPA because they give each collection a durable URL, work without JavaScript for navigation and product links, and deploy directly to GitHub Pages.

## Visual system

- Background: `#fffdf7`
- Ink and outlines: `#151515`
- Primary accent: `#00bde3`
- Small emphasis labels and rules: `#ffe51c`
- No gradients, shadows, rounded cards or faux-3D stickers
- Comic panels use 3 to 5 pixel black borders, angled polygon edges and 10 to 18 pixel paper gutters
- Typography separates expressive display copy from readable product information
- Display: Bebas Neue or Anton for condensed English headings
- Japanese body: system Gothic fallback stack
- Handwritten accents use a restrained local/system brush-style fallback and are limited to short copy

TOP uses an asymmetrical two-column by three-row composition, with intentionally different split points and angles. The right editorial rail occupies approximately ten percent on wide screens. Collection numbers are fixed as BIKE 01, ANIMAL 02, GAKUSEI 03, ARMY 04, DOKURO 05 and BRAND 06.

Collection pages share information architecture but not a cloned visual arrangement. Each receives its own accent balance, copy, image focal points and panel geometry:

- BIKE: velocity, reflections and late-city movement
- ANIMAL: playful companionship and everyday curiosity
- GAKUSEI: after-school freedom and a skyward, open feeling
- ARMY: teamwork, utility and playful resilience without militaristic aggression
- DOKURO: mortality transformed into color, creation and humor
- BRAND: Tokyo streets, graphic culture and the core URT identity

## Page structure

### TOP

1. Oversized masthead and compact shop descriptor
2. Compact navigation, search control and menu trigger
3. Six irregular collection panels using authorized TOP imagery
4. Vertical Japanese manifesto and editorial details in the right rail
5. Cyan storefront statement band
6. Compact footer

Each collection panel is a real link. Its current background crossfades through the collection's TOP images. Text remains legible through deliberate placement and solid paper/cyan strips, not gradients.

### Collection pages

1. Compact header
2. Approximately 75:25 angled hero with rotating collection imagery and collection concept
3. Airy concept section with expressive English title and short Japanese copy
4. Three-panel irregular gallery using non-product collection images
5. Product showcase with three columns on desktop and compact responsive columns below
6. Product name, workbook price and external purchase link
7. Compact footer with collection navigation and non-linked social service labels until official account URLs are supplied

Products are rendered from workbook-derived records. No fabricated prices or purchase URLs are permitted.

## Image treatment

Images are not assigned a universal center crop. Each selected image receives a focal-position value based on its main subject. Hero and gallery crops use `object-fit: cover` with per-image `object-position`; product images use `object-fit: contain` so the garment is not cut off.

Responsive image variants are generated where useful. Width and aspect-ratio constraints prevent oversized images on phones.

## BLENCI LAB selections

- `L03`: editorial hierarchy and asymmetrical gallery rhythm
- `L15`: diagonal panel splits
- `C02`: collection panel expansion into destination page
- `B04`: background image crossfade in TOP panels and collection heroes
- `I02`: animated line drawing beneath selected collection titles
- `I09`: restrained torn-paper product reveal
- `G05`: accessible gallery/product lightbox
- `G10`: pointer-proximity lift and image enlargement on fine-pointer devices
- `C09`: short wobble feedback on purchase buttons
- `U08`: cursor shape changes over interactive targets
- `U09`: sparse ink trail on fine-pointer devices
- `U13`: click shockwave with a touch-compatible visual response
- `N07`: circular-reveal fullscreen collection menu
- `F21`: condensed display headings
- `F22`: supporting heavy display type

All motion stops or simplifies under `prefers-reduced-motion`. Cursor-only effects are disabled on coarse pointers and never carry required meaning.

## Responsive behavior

At tablet and phone sizes, TOP panels stack in the intended collection order while preserving angled silhouettes. The editorial rail becomes a horizontal manifesto block. Hero side panels move below or beside the main image depending on available width.

Product grids use three columns on desktop, two columns on typical phones and one column only on very narrow screens. Product images have capped heights; tap targets remain at least 44 pixels. Navigation becomes the accessible fullscreen menu.

## Accessibility and behavior

- Semantic landmarks and heading hierarchy
- Keyboard-operable navigation, lightbox and controls
- Visible focus indicators
- Descriptive Japanese alt text based on content role
- Pause control for recurring crossfades
- Escape closes menu and lightbox; focus returns to the invoking control
- External purchase links identify that they open SUZURI
- JavaScript enhancements do not block core navigation or purchasing

## Verification and publication

- Validate all source image and product references
- Validate every purchase URL and price is sourced from the workbook-derived records
- Run syntax checks and production build
- Inspect desktop and mobile screenshots for all seven pages
- Check keyboard navigation, reduced motion and broken links
- Commit and push to the TYPE4 repository main branch
- Confirm the GitHub Pages workflow succeeds and share the deployed URL

## Acceptance criteria

The project is complete when all seven pages build without errors, every collection is reachable from TOP, every product shows the correct mapped price and purchase URL, subject crops remain intentional across desktop and phone layouts, specified BLENCI interactions have accessible fallbacks, and the public GitHub Pages URL loads successfully.
