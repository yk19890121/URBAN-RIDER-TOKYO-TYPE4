import fs from "node:fs";
import path from "node:path";

const readJson = (root, name) => JSON.parse(fs.readFileSync(path.join(root, "src", name), "utf8"));

export const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

export const formatYen = (value) => `¥${new Intl.NumberFormat("ja-JP").format(value)}`;

const cssClass = (value) => escapeHtml(value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-"));

function picture(image, alt, prefix, className = "", position = "50% 50%", eager = false) {
  const small = image.replace(/\.webp$/, "-640.webp");
  return `<picture><source media="(max-width: 720px)" srcset="${prefix}${small}"><img class="${className}" src="${prefix}${image}" alt="${escapeHtml(alt)}" style="object-position:${position}" width="1200" height="900" ${eager ? "fetchpriority=\"high\"" : "loading=\"lazy\""}></picture>`;
}

const lookbookNote = "※掲載している着用イメージは、商品画像をもとに制作したイメージビジュアルです。実際の商品を着用して撮影したものではないため、色味・質感・サイズ感などが実物と異なる場合があります。";

function renderLookbook(files, prefix, collection) {
  return `<section class="lookbook-section" aria-labelledby="lookbook-title"><header class="lookbook-heading"><div><span>LOOK BOOK</span><h2 id="lookbook-title">着用イメージ</h2></div><strong>05</strong><small>SWIPE / SCROLL →</small></header><div class="lookbook-track" tabindex="0" role="group" aria-label="${escapeHtml(collection.name)}の着用イメージ（横スクロール）">${files.map((image, index) => `<button class="lookbook-item" type="button" data-lightbox="${prefix}${image}" data-lightbox-alt="${escapeHtml(collection.name)} 着用イメージ ${index + 1}" data-cursor="VIEW" aria-label="着用イメージ${index + 1}を拡大表示"><picture><source media="(max-width:720px)" srcset="${prefix}${image.replace('.webp', '-640.webp')}"><img src="${prefix}${image}" alt="${escapeHtml(collection.name)} 着用イメージ ${index + 1}" width="941" height="1672" loading="lazy" decoding="async"></picture><span>${String(index + 1).padStart(2, "0")}</span></button>`).join("")}</div><p class="lookbook-note">${lookbookNote}</p></section>`;
}

function menu(collections, prefix) {
  return `<div class="nav-overlay" id="collection-menu" aria-hidden="true">
    <div class="nav-overlay__inner">
      <p class="nav-kicker">CHOOSE YOUR COLLECTION</p>
      <nav aria-label="コレクションメニュー">
        ${collections.map((item) => `<a href="${prefix}${item.slug}/"><span>${item.number}</span>${escapeHtml(item.name)}</a>`).join("")}
      </nav>
      <p class="nav-manifesto">都市を駆ける、自由な魂へ。</p>
    </div>
  </div>`;
}

function header(collections, prefix, home = false) {
  return `<header class="site-header">
    <a class="mini-logo" href="${home ? "./" : "../"}" aria-label="URBAN RIDER TOKYO トップへ">URBAN RIDER TOKYO</a>
    <nav class="desktop-nav" aria-label="主要メニュー">
      <a href="#products">アイテム</a>
      <button class="text-button menu-open" type="button" aria-expanded="false" aria-controls="collection-menu">コレクション</button>
      <a href="#story">ストーリー</a>
    </nav>
    <div class="header-tools">
      <button class="icon-button search-button" type="button" aria-label="商品を検索" data-cursor="SEARCH"><span aria-hidden="true"></span></button>
      <button class="icon-button menu-button menu-open" type="button" aria-label="メニューを開く" aria-expanded="false" aria-controls="collection-menu" data-cursor="MENU"><i></i><i></i><i></i></button>
    </div>
  </header>${menu(collections, prefix)}`;
}

function footer(collections, prefix) {
  return `<footer class="site-footer">
    <div><a class="footer-logo" href="${prefix}">URBAN RIDER TOKYO</a><p>日常を、もっと自由に。</p></div>
    <nav aria-label="フッターメニュー">${collections.slice(0, 4).map((item) => `<a href="${prefix}${item.slug}/">${item.short}</a>`).join("")}</nav>
    <div class="social-labels" aria-label="ソーシャルメディア">INSTAGRAM&nbsp;&nbsp; X&nbsp;&nbsp; YOUTUBE</div>
    <small>© URBAN RIDER TOKYO. All rights reserved.</small>
    <p class="footer-script">好きなアートを、日常に着よう。</p>
  </footer>`;
}

const topOrder = ["animal", "bike", "gakusei", "army", "dokuro", "brand"];

export function renderTop({ collections, assets }) {
  const ordered = topOrder.map((slug) => collections.find((item) => item.slug === slug));
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="都市を駆ける、自由な魂へ。URBAN RIDER TOKYOのグラフィックTシャツショップ。"><title>URBAN RIDER TOKYO | GRAPHIC T-SHIRT SHOP</title><link rel="icon" href="favicon.svg"><script>(function(){try{var w=JSON.parse(sessionStorage.getItem('urt:wipe')||'null');sessionStorage.removeItem('urt:wipe');if(!w||Date.now()-w.t>2500)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var r=document.documentElement;r.style.setProperty('--wx',w.x+'px');r.style.setProperty('--wy',w.y+'px');r.classList.add('wipe-enter');}catch(e){}})();</script><link rel="stylesheet" href="styles.css"><script src="app.js" defer></script></head>
  <body class="top-page"><a class="skip-link" href="#main">本文へ移動</a>
  ${header(collections, "", true)}
  <button class="motion-toggle" type="button" aria-pressed="false">画像切替を停止</button>
  <main id="main">
    <section class="masthead" aria-labelledby="top-title"><div><h1 id="top-title">URBAN RIDER TOKYO</h1><p>GRAPHIC T-SHIRT SHOP</p></div><p class="masthead-mark">ART<br>CULTURE<br>RIDE<br>TOKYO</p></section>
    <div class="top-layout">
      <section class="comic-index" aria-label="6つのコレクション">
        ${ordered.map((item, index) => {
          const images = assets[item.slug].top;
          return `<a class="collection-panel panel-${index + 1} theme-${item.slug}" href="${item.slug}/" data-nav-reveal data-crossfade='${escapeHtml(JSON.stringify(images))}' data-cursor="VIEW" aria-label="${escapeHtml(item.name)}を見る">
            <div class="crossfade-media" aria-hidden="true">${images.map((image, imageIndex) => picture(image, "", "", "crossfade-layer", "50% 45%", index < 2 && imageIndex === 0)).join("")}</div>
            <div class="panel-copy"><span class="number-tag">${item.number}</span><h2>${escapeHtml(item.name)}</h2><span class="draw-line" aria-hidden="true"><svg viewBox="0 0 160 12"><path d="M2 8 C42 2, 86 11, 158 4"/></svg></span><p>${escapeHtml(item.tagline)}</p></div>
          </a>`;
        }).join("")}
      </section>
      <aside class="editorial-rail"><span></span><p>都市を駆ける、<br>自由な魂へ。</p><small>ART<br>WEAR<br>PEOPLE<br>TOKYO<br>ALWAYS<br>FREE</small></aside>
    </div>
    <section class="shop-band" id="products"><strong>グラフィックTシャツのオンラインショップ</strong><span>URBAN RIDER TOKYO<br>GRAPHIC T-SHIRT SHOP</span></section>
    <section class="top-note" id="story"><small>TOKYO<br>FOR<br>CREATIVE<br>PEOPLE</small><span></span><p>好きなアートを、<br>日常に着よう。</p></section>
  </main>${footer(collections, "")}
  <div class="cursor" aria-hidden="true"><span>VIEW</span></div><div class="ink-layer" aria-hidden="true"></div><div class="shock-layer" aria-hidden="true"></div>
  </body></html>`;
}

function productCard(product, prefix, index) {
  const label = product.number ? `URT ${product.number}` : product.name;
  return `<article class="product-card${index >= 6 ? " product-more" : ""}" data-depth-card>
    <button class="product-media torn-reveal" type="button" data-lightbox="${prefix}${product.image}" data-lightbox-alt="${escapeHtml(product.name)}を拡大表示" aria-label="${escapeHtml(product.name)}の画像を拡大">
      ${picture(product.image, product.name, prefix, "product-image", "50% 50%")}
    </button>
    <div class="product-info"><h3>${escapeHtml(label)}</h3><p>${formatYen(product.price)} <small>税込</small></p>
      <a class="buy-button" href="${escapeHtml(product.url)}" target="_blank" rel="noopener noreferrer" data-wobble data-cursor="BUY">購入する <span aria-hidden="true">↗</span><span class="sr-only">（SUZURIが新しいタブで開きます）</span></a>
    </div>
  </article>`;
}

export function renderCollection({ collection, collections, assets, products, focals }) {
  const set = assets[collection.slug];
  const prefix = "../";
  const items = products.filter((item) => item.brand === collection.slug);
  const focus = focals[collection.slug] || [];
  const heroImages = set.hero;
  const sideImage = set.hero[1] || set.hero[0];
  const gallery = set.gallery || [];
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escapeHtml(collection.concept)}"><title>${escapeHtml(collection.name)} | URBAN RIDER TOKYO</title><link rel="icon" href="${prefix}favicon.svg"><script>(function(){try{var w=JSON.parse(sessionStorage.getItem('urt:wipe')||'null');sessionStorage.removeItem('urt:wipe');if(!w||Date.now()-w.t>2500)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var r=document.documentElement;r.style.setProperty('--wx',w.x+'px');r.style.setProperty('--wy',w.y+'px');r.classList.add('wipe-enter');}catch(e){}})();</script><link rel="stylesheet" href="${prefix}styles.css"><script src="${prefix}app.js" defer></script></head>
  <body class="collection-page theme-${collection.slug}"><a class="skip-link" href="#main">本文へ移動</a>${header(collections, prefix)}
  <main id="main">
    <section class="brand-hero">
      <div class="hero-main" data-crossfade='${escapeHtml(JSON.stringify(heroImages))}'>
        <div class="crossfade-media" aria-hidden="true">${heroImages.map((image, index) => picture(image, "", prefix, "crossfade-layer", focus[index] || "50% 45%", index === 0)).join("")}</div>
        <div class="hero-copy"><h1>${escapeHtml(collection.heading)}</h1><span></span><p>${escapeHtml(collection.captions[0])}</p></div>
      </div>
      <button class="hero-side" type="button" data-lightbox="${prefix}${sideImage}" data-lightbox-alt="${escapeHtml(collection.name)}のビジュアル" aria-label="サブビジュアルを拡大">${picture(sideImage, `${collection.name}のアート`, prefix, "", focus[1] || "50% 45%", true)}<span>${escapeHtml(collection.tagline)}</span></button>
    </section>
    <section class="concept" id="story"><div class="concept-side">TOKYO<br>FOR<br>DAYDREAMERS</div><div><p class="script-note">${escapeHtml(collection.english)}</p><h2>${escapeHtml(collection.name)}</h2><i></i><p>${escapeHtml(collection.concept)}</p></div><p class="vertical-copy">日常の、<br>その先へ。</p></section>
    ${gallery.length ? `<section class="gallery" aria-label="${escapeHtml(collection.name)}ギャラリー">
      ${gallery.map((image, index) => `<button class="gallery-panel gallery-${index + 1}" type="button" data-lightbox="${prefix}${image}" data-lightbox-alt="${escapeHtml(collection.galleryText[index % collection.galleryText.length])}" aria-label="ギャラリー画像${index + 1}を拡大">${picture(image, collection.galleryText[index % collection.galleryText.length], prefix, "", focus[index] || "50% 45%")}<span>${escapeHtml(index === 2 ? collection.captions[1] : collection.galleryText[index % collection.galleryText.length])}</span></button>`).join("")}
    </section>` : ""}
    <section class="products" id="products"><div class="product-heading"><h2>T-SHIRT</h2><div><p>あの時の気持ちを、いつでも。</p><label class="product-search">商品を検索<input type="search" placeholder="商品番号を入力" autocomplete="off"></label></div></div><p class="search-result" aria-live="polite"></p><div class="product-grid">${items.map((item, index) => productCard(item, prefix, index)).join("")}</div>${items.length > 6 ? `<button class="load-more" type="button">もっと見る <span aria-hidden="true">＋</span></button>` : ""}</section>
    ${renderLookbook(assets.lookbook[collection.slug], prefix, collection)}
  </main>${footer(collections, prefix)}
  <dialog class="lightbox" aria-label="画像拡大表示"><button type="button" class="lightbox-close" aria-label="閉じる">×</button><img src="" alt=""></dialog>
  <button class="motion-toggle" type="button" aria-pressed="false">画像切替を停止</button><div class="cursor" aria-hidden="true"><span>VIEW</span></div><div class="ink-layer" aria-hidden="true"></div><div class="shock-layer" aria-hidden="true"></div>
  </body></html>`;
}
