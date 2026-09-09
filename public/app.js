(() => {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const timers = new Set();
  let rotationPaused = false;

  function initVisibility() {
    const items = document.querySelectorAll(".collection-panel, .torn-reveal");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible"));
    }, { threshold: 0.16 });
    items.forEach((item) => observer.observe(item));
  }

  function initCrossfades() {
    document.querySelectorAll("[data-crossfade]").forEach((container, groupIndex) => {
      const layers = [...container.querySelectorAll(".crossfade-layer")];
      if (layers.length < 2) return;
      let index = 0;
      const timer = setInterval(() => {
        if (rotationPaused || document.hidden) return;
        layers[index].classList.remove("is-active");
        index = (index + 1) % layers.length;
        layers[index].classList.add("is-active");
      }, 3800 + groupIndex * 230);
      timers.add(timer);
    });
    document.querySelector(".motion-toggle")?.addEventListener("click", (event) => {
      rotationPaused = !rotationPaused;
      event.currentTarget.setAttribute("aria-pressed", String(rotationPaused));
      event.currentTarget.textContent = rotationPaused ? "画像切替を再開" : "画像切替を停止";
    });
  }

  function initMenu() {
    const overlay = document.querySelector(".nav-overlay");
    const buttons = [...document.querySelectorAll(".menu-open")];
    if (!overlay || !buttons.length) return;
    let previousFocus = null;
    const setOpen = (open, button) => {
      overlay.classList.toggle("is-open", open);
      overlay.setAttribute("aria-hidden", String(!open));
      buttons.forEach((item) => item.setAttribute("aria-expanded", String(open)));
      document.body.classList.toggle("menu-is-open", open);
      if (open) {
        previousFocus = button;
        overlay.querySelector("a")?.focus();
      } else previousFocus?.focus();
    };
    buttons.forEach((button) => button.addEventListener("click", () => setOpen(!overlay.classList.contains("is-open"), button)));
    overlay.addEventListener("click", (event) => event.target === overlay && setOpen(false));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.classList.contains("is-open")) setOpen(false);
    });
  }

  function initLightbox() {
    const dialog = document.querySelector(".lightbox");
    if (!dialog) return;
    const image = dialog.querySelector("img");
    const close = dialog.querySelector(".lightbox-close");
    let trigger = null;
    const closeDialog = () => {
      dialog.close();
      image.removeAttribute("src");
      trigger?.focus();
    };
    document.querySelectorAll("[data-lightbox]").forEach((button) => button.addEventListener("click", () => {
      trigger = button;
      image.src = button.dataset.lightbox;
      image.alt = button.dataset.lightboxAlt || "拡大画像";
      dialog.showModal();
      close.focus();
    }));
    close.addEventListener("click", closeDialog);
    dialog.addEventListener("click", (event) => event.target === dialog && closeDialog());
    dialog.addEventListener("cancel", (event) => { event.preventDefault(); closeDialog(); });
  }

  function initSearch() {
    const searchButton = document.querySelector(".search-button");
    const input = document.querySelector(".product-search input");
    const products = [...document.querySelectorAll(".product-card")];
    const status = document.querySelector(".search-result");
    searchButton?.addEventListener("click", () => {
      if (input) {
        input.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "center" });
        input.focus();
      } else document.querySelector(".menu-button")?.click();
    });
    input?.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      let visible = 0;
      products.forEach((card) => {
        const match = !query || card.textContent.toLowerCase().includes(query);
        card.hidden = !match;
        if (match) visible += 1;
      });
      if (status) status.textContent = query ? `${visible}件の商品が見つかりました` : "";
    });
  }

  function initCollectionExit() {
    document.querySelectorAll(".collection-panel").forEach((link) => link.addEventListener("click", (event) => {
      if (reducedMotion.matches || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      link.classList.add("is-leaving");
      setTimeout(() => { location.href = link.href; }, 240);
    }));
  }

  function initPointerEffects() {
    if (!finePointer.matches || reducedMotion.matches) return;
    document.body.classList.add("has-custom-cursor");
    const cursor = document.querySelector(".cursor");
    const label = cursor?.querySelector("span");
    let lastInk = 0;
    document.addEventListener("pointermove", (event) => {
      if (cursor) { cursor.style.left = `${event.clientX}px`; cursor.style.top = `${event.clientY}px`; }
      const target = event.target.closest("[data-cursor]");
      if (label) label.textContent = target?.dataset.cursor || "VIEW";
      cursor?.classList.toggle("is-action", Boolean(target));
      const now = performance.now();
      if (now - lastInk > 70) {
        lastInk = now;
        const dot = document.createElement("i");
        dot.className = "ink-dot";
        dot.style.left = `${event.clientX}px`;
        dot.style.top = `${event.clientY}px`;
        document.querySelector(".ink-layer")?.append(dot);
        setTimeout(() => dot.remove(), 600);
      }
    });
    document.querySelectorAll("[data-depth-card]").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const box = card.getBoundingClientRect();
        card.style.setProperty("--depth-x", `${(event.clientX - box.left - box.width / 2) * 0.035}px`);
        card.style.setProperty("--depth-y", `${(event.clientY - box.top - box.height / 2) * 0.035}px`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--depth-x", "0px");
        card.style.setProperty("--depth-y", "0px");
      });
    });
  }

  function initClickFeedback() {
    document.addEventListener("pointerdown", (event) => {
      if (reducedMotion.matches) return;
      const burst = document.createElement("i");
      burst.className = "shock";
      burst.style.left = `${event.clientX}px`;
      burst.style.top = `${event.clientY}px`;
      document.querySelector(".shock-layer")?.append(burst);
      setTimeout(() => burst.remove(), 600);
    });
    document.querySelectorAll("[data-wobble]").forEach((button) => button.addEventListener("pointerenter", () => {
      button.classList.remove("is-wobbling");
      requestAnimationFrame(() => button.classList.add("is-wobbling"));
    }));
  }

  initVisibility();
  if (!reducedMotion.matches) initCrossfades();
  else document.querySelector(".motion-toggle")?.setAttribute("hidden", "");
  initMenu();
  initLightbox();
  initSearch();
  initCollectionExit();
  initPointerEffects();
  initClickFeedback();
  addEventListener("pagehide", () => timers.forEach(clearInterval), { once: true });
})();
