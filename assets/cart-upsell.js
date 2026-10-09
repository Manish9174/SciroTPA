(function () {
  'use strict';

  const DEFAULTS = {
    maxProducts: 8,
    fallbackCollection: 'all',
    showVendor: false,
    showRating: false,
    showComparePrice: true,
    enabled: true,
    heading: window.cartUpsellConfig?.heading || '',
  };

  /* ─── Skeleton card template ─── */
  const SKELETON_COUNT = 2;
  const SKELETON_HTML  = `
  <div class="swiper cart-upsell__skeleton-swiper-container" style="display: flex;">
    <div class="swiper cart-upsell__skeleton-swiper">
      <div class="swiper-wrapper">
        ${Array.from({ length: SKELETON_COUNT }).map(() => `
          <div class="swiper-slide">
            <div class="cart-upsell-card cart-upsell-card--skeleton">
              <div class="cart-upsell-image">
                <div class="cart-upsell-card__skeleton-img skeleton-pulse"></div>
              </div>
              <div class="cart-upsell-card__body">
                <div class="cart-upsell-card__skeleton-line skeleton-pulse" style="width:60%;height:10px;margin-bottom:8px;"></div>
                <div class="cart-upsell-card__skeleton-line skeleton-pulse" style="width:40%;height:10px;margin-bottom:12px;"></div>
                <div class="cart-upsell-card__skeleton-line skeleton-pulse" style="width:50%;height:28px;border-radius:4px;"></div>
              </div>
            </div>
          </div>`).join('')}
      </div>
    </div>
   `;

  let swiperInstance    = null;
  let currentProductIds = null;
  let isFetching        = false;
  let cfg               = null;
  let domObserver       = null;
  let cartObserver      = null;
  let isCartUpdating    = false;

  /* ═══════════════════════════════════════════════════════════════
   * SKELETON helpers  — replace hide/show with skeleton state
   * ═══════════════════════════════════════════════════════════════ */

  /** Show shimmer skeleton while fetching / refreshing */
  function showSkeleton() {
    const section = document.getElementById('cart-upsell-section');
    if (!section) return;

    destroySwiper();

    const wrapper = section.querySelector('.cart-upsell__slider-wrap');
    if (wrapper) wrapper.innerHTML = SKELETON_HTML;

    // Section stays visible — no display:none / opacity:0
    section.classList.remove('cart-upsell--hidden');
    section.classList.add('cart-upsell--loading');
  }

  /** Remove skeleton and hide the whole section (empty cart) */
 function hideSectionCompletely() {
  const section = document.getElementById('cart-upsell-section');
  if (!section) return;

  destroySwiper();

  const wrapper = section.querySelector('.cart-upsell__slider-wrap');
  if (wrapper) wrapper.innerHTML = '';

  const nav = section.querySelector('.cart-upsell__nav');
  const nav1 = section.querySelector('.my-carousel__actions');
  nav1.classList.add('d-none');
  if (nav) nav.style.display = 'none';

  section.classList.remove('cart-upsell--loading', 'cart-upsell--visible');
  section.classList.add('cart-upsell--hidden');

  section.style.visibility = 'hidden';
  section.style.maxHeight = '0';
  section.style.overflow = 'hidden';
}

  /** Show the real slider after render */
 function revealContent() {
  const section = document.getElementById('cart-upsell-section');
  if (!section) return;

  const nav = section.querySelector('.cart-upsell__nav');
  const nav1 = section.querySelector('.my-carousel__actions');
  nav1.classList.remove('d-none');
  if (nav) nav.style.display = '';

  section.classList.remove('cart-upsell--loading', 'cart-upsell--hidden');
  section.classList.add('cart-upsell--visible');

  section.style.visibility = '';
  section.style.maxHeight = '';
  section.style.overflow = '';
}

  /* ═══════════════════════════════════════════════════════════════
   * INIT
   * ═══════════════════════════════════════════════════════════════ */
  function init() {
    injectSkeletonStyle();

    const section = document.getElementById('cart-upsell-section');
    if (!section) return;

    cfg = readConfig(section);
    if (!cfg.enabled) return;

    // Show skeleton immediately so there's never a blank flash
    showSkeleton();

    hookCartDrawer();
    watchCartMutations();
    watchForShellReplacement();
    hookFetchInterceptor();
    hookCurrencyChange();

    document.addEventListener('cart:refresh', () => {
      currentProductIds = null;
      setTimeout(() => refresh(true), 300);
    });

    document.addEventListener('wdt:cart:changed', (e) => {
      if (e.detail?.removed) {
        currentProductIds = null;
        refresh(true);
      }
    });

    if (document.querySelector('#cartOffCanvas.show')) {
      refresh(true);
    }
  }

  function injectSkeletonStyle() {
    if (document.getElementById('cart-upsell-skeleton-style')) return;
  }

  function readConfig(el) {
    const d = el.dataset;
    return {
        enabled: d.enabled !== 'false',
        maxProducts: parseInt(d.maxProducts, 10) || DEFAULTS.maxProducts,
        fallbackCollection: d.fallbackCollection || DEFAULTS.fallbackCollection,
        showVendor: d.showVendor === 'true',
        showRating: d.showRating === 'true',
        showComparePrice: d.showComparePrice !== 'false',
        heading: d.heading || DEFAULTS.heading,
        upsellSource: d.upsellSource || 'related'
      };
  }

  /* ═══════════════════════════════════════════════════════════════
   * PUBLIC API
   * ═══════════════════════════════════════════════════════════════ */
  window.cartUpsellRestore = function (cartDrawer) {
    injectUpsellShell(cartDrawer);
    injectSkeletonStyle();
    const section = document.getElementById('cart-upsell-section');
    if (!section) return;
    cfg = readConfig(section);
    hookCartDrawer();
    watchCartMutations();
    hookFetchInterceptor();
    hookCurrencyChange();
    currentProductIds = null;
    refresh(true);
  };

  window.cartUpsellRefresh = function () {
    if (!document.getElementById('cart-upsell-section')) {
      currentProductIds = null;
    }
    refresh(false);
  };

  /* ═══════════════════════════════════════════════════════════════
   * HOOKS
   * ═══════════════════════════════════════════════════════════════ */
  function hookCartDrawer() {
    const drawer =
      document.getElementById('cartOffCanvas') ||
      document.getElementById('wdtCartOffcanvas');

    if (!drawer || drawer.__upsellDrawerHooked) return;

    drawer.addEventListener('shown.bs.offcanvas', () => {
      if (currentProductIds === null) {
        refresh(true);
      } else {
        refreshIfCartChanged();
      }
    });

    // No need to hide on close — skeleton takes over next open
    drawer.__upsellDrawerHooked = true;
  }

  async function refreshIfCartChanged() {
    if (isFetching) return;
    try {
      const cart = await fetchCart();
      const { productIds } = extractCartData(cart);
      const idsString = productIds.sort().join(',');

      if (!cart.items.length) {
        hideSectionCompletely();
        currentProductIds = idsString;
        return;
      }

      if (idsString === currentProductIds) return; // same content — no blink

      currentProductIds = null;
      refresh(true);
    } catch {}
  }

  function hookFetchInterceptor() {
    if (window.__upsellFetchHooked) return;
    window.__upsellFetchHooked = true;

    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      const url = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');
      if (url.includes('/cart/change')) {
        isCartUpdating = true;
        setTimeout(() => { isCartUpdating = false; }, 300);
      }
      return originalFetch.apply(this, args);
    };
  }

  function hookCurrencyChange() {
    document.addEventListener('shopify:currency_selected', () => {
      showSkeleton();
      setTimeout(() => { destroySwiper(); refresh(false); }, 100);
    });

    const currencySelector = document.querySelector(
      '[data-currency-selector], .localization-form__select, [id*="currency"]'
    );
    if (currencySelector) {
      const obs = new MutationObserver(() => {
        showSkeleton();
        destroySwiper();
        setTimeout(() => refresh(false), 100);
      });
      obs.observe(currencySelector, { attributes: true, subtree: true });
    }
  }

  function watchCartMutations() {
    if (cartObserver) cartObserver.disconnect();

    const attach = () => {
      const el = document.getElementById('wdtItemsList');
      if (!el) return;
      cartObserver = new MutationObserver(() => {
        if (isCartUpdating) return;
        clearTimeout(cartObserver._t);
        cartObserver._t = setTimeout(async () => {
          try {
            const res  = await fetch('/cart.js', { cache: 'no-store' });
            const cart = await res.json();
            const { productIds } = extractCartData(cart);
            const idsString = productIds.sort().join(',');
            if (idsString !== currentProductIds) {
              currentProductIds = null;
              refresh(true);
            }
          } catch {}
        }, 400);
      });
      cartObserver.observe(el, { childList: true, subtree: true });
    };

    attach();
    setTimeout(attach, 500);
  }

  function watchForShellReplacement() {
    if (domObserver) domObserver.disconnect();
    const cartDrawer = document.getElementById('wdtCartOffcanvas');
    if (!cartDrawer) return;

    domObserver = new MutationObserver(() => {
      if (!document.getElementById('cart-upsell-section')) {
        injectUpsellShell(cartDrawer);
        reinit();
      }
    });
    domObserver.observe(cartDrawer, { childList: true, subtree: false });
  }

  function injectUpsellShell(cartDrawer) {
    const c   = window.cartUpsellConfig || {};
    const div = document.createElement('div');
    div.id        = 'cart-upsell-section';
    div.className = 'cart-upsell cart-upsell--loading';
    // No inline display:none — skeleton style keeps it visible
        Object.assign(div.dataset, {
        enabled: String(c.enabled ?? true),
        maxProducts: String(c.maxProducts ?? 8),
        fallbackCollection: String(c.fallbackCollection ?? 'all'),
        showVendor: String(c.showVendor ?? false),
        showRating: String(c.showRating ?? false),
        showComparePrice: String(c.showComparePrice ?? true),
        heading: String(
            c.heading || window.cartUpsellStrings.heading || ''
          ),
        shopCurrency: String(c.shopCurrency || Shopify.currency?.active || 'USD')
      });
    const h = div.dataset.heading;
    div.innerHTML = `
      <h2 class="cart-upsell__heading">${escHtml(h)}</h2>
      <div class="cart-upsell__nav" aria-hidden="true">
        <button id="cart-upsell-prev" class="cart-upsell__btn" aria-label="${window.cartUpsellStrings.previousProducts}">
          <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button id="cart-upsell-next" class="cart-upsell__btn" aria-label="${window.cartUpsellStrings.nextProducts}">
          <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      <div class="cart-upsell__slider-wrap">${SKELETON_HTML}</div>
`;

    const widget =
      cartDrawer.querySelector('#wdtItemsWrap') ||
      cartDrawer.querySelector('#wdtCartBody')  ||
      cartDrawer;
    widget.appendChild(div);
  }

  function reinit() {
    swiperInstance    = null;
    currentProductIds = null;
    cfg               = null;
    injectSkeletonStyle();
    const section = document.getElementById('cart-upsell-section');
    if (!section) return;
    cfg = readConfig(section);
    showSkeleton();
    hookCartDrawer();
    watchCartMutations();
    watchForShellReplacement();
    hookFetchInterceptor();
    hookCurrencyChange();
    refresh(true);
  }

  /* ═══════════════════════════════════════════════════════════════
   * REFRESH PIPELINE
   * ═══════════════════════════════════════════════════════════════ */
  async function refresh(force) {
    if (isFetching) return;
    isFetching = true;

    // Always show skeleton at the start of every fetch/refresh
    showSkeleton();

    try {
      const cart = await fetchCart();
      const { productIds } = extractCartData(cart);
      const idsString = productIds.sort().join(',');

      if (!force && idsString === currentProductIds) {
        // Nothing changed — restore real content without skeleton delay
        await renderSlider(await getRecommendations(cart));
        return;
      }

      currentProductIds = idsString;

      if (!cart.items.length) {
        hideSectionCompletely();
        return;
      }

      const products = await getRecommendations(cart);
      await renderSlider(products);
    } catch (err) {
      console.warn('[CartUpsell]', err);
      // On error hide the skeleton gracefully
      hideSectionCompletely();
    } finally {
      isFetching = false;
    }
  }

  /* ═══════════════════════════════════════════════════════════════
   * CART DATA
   * ═══════════════════════════════════════════════════════════════ */
  async function fetchCart() {
    const res = await fetch('/cart.js', { cache: 'no-store' });
    if (!res.ok) throw new Error('Cart fetch failed');
    return res.json();
  }

  function extractCartData(cart) {
    return { productIds: [...new Set(cart.items.map(i => i.product_id))] };
  }

    async function getRecommendations(cart) {
      const { productIds } = extractCartData(cart);
      const max = cfg.maxProducts;
      const exclude = new Set(productIds.map(String));

      if (!productIds.length) return [];

      let products = [];

      switch (cfg.upsellSource) {
        case 'related':
          
          products = await fetchRelated(productIds[0], max);
          break;

        case 'complementary':
          
          products = await fetchComplementary(productIds[0], max);
          break;

        case 'fallback':
          
          products = await fetchFallbackCollection(
            cfg.fallbackCollection,
            max
          );
          break;

        default:
          products = [];
      }

      return products
        .filter(product => !exclude.has(String(product.id)))
        .slice(0, max);
    }

  async function fetchRelated(productId, limit) {
    if (!productId) return [];
    try {
      const res = await fetch(
        `${window.Shopify.routes.root}recommendations/products.json?product_id=${productId}&limit=${limit}&intent=related`
      );
      if (!res.ok) return [];
      const { products = [] } = await res.json();
      return products.filter(p => p.available);
    } catch { return []; }
  }

  async function fetchComplementary(productId, limit) {
    if (!productId) return [];
    try {
      const res = await fetch(
          `${window.Shopify.routes.root}recommendations/products.json?product_id=${productId}&limit=${limit}&intent=complementary`
        );
      if (!res.ok) return [];
      const { products = [] } = await res.json();
      return products.filter(p => p.available);
    } catch { return []; }
  }

  async function fetchFallbackCollection(handle, limit) {
    if (!handle) return [];
    try {
      const res = await fetch(
        `${window.Shopify.routes.root}collections/${handle}/products.json?limit=${limit}&sort_by=best-selling`
      );
      if (!res.ok) return [];
      const { products = [] } = await res.json();
      return products.filter(p => p.variants?.some(v => v.available));
    } catch { return []; }
  }

  /* ═══════════════════════════════════════════════════════════════
   * RENDERING
   * ═══════════════════════════════════════════════════════════════ */
  async function renderSlider(products) {
    
    
    const section = document.getElementById('cart-upsell-section');
    
    if (!section) return;

    const wrapper = section.querySelector('.cart-upsell__slider-wrap');
    
    if (!wrapper) return;

    if (!products.length) {
      hideSectionCompletely();
      return;
    }

    // Skeleton is already showing — swap it out for real content
    destroySwiper();

    wrapper.innerHTML = `<div class="swiper"><div class="swiper-wrapper">${
      products.map(buildProductCard).join('')
    }</div></div>`;

    await waitForSwiper();

    if (window.Swiper) {
      swiperInstance = new window.Swiper(wrapper.querySelector('.swiper'), {
        spaceBetween: 12,
        grabCursor:   true,
        navigation:   { nextEl: '.swiper-next', prevEl: '.swiper-prev' },
        breakpoints:  { 320: { slidesPerView: 1 }, 992: { slidesPerView: 2 } },
        a11y: { prevSlideMessage: 'Previous product', nextSlideMessage: 'Next product' },
      });
    }

    section.querySelectorAll('.cart-upsell-card__add').forEach(btn =>
      btn.addEventListener('click', handleQuickAdd)
    );

    // Reveal with fade-in (defined in SKELETON_STYLE)
    revealContent();
  }

  function waitForSwiper(maxWait = 4000) {
    if (window.Swiper) return Promise.resolve();
    return new Promise(resolve => {
      const t0 = Date.now();
      (function check() {
        if (window.Swiper || Date.now() - t0 > maxWait) return resolve();
        setTimeout(check, 80);
      })();
    });
  }

  function buildProductCard(product) {
    const variant = product.variants?.[0] || {};

    const hasMultipleVariants =
        Array.isArray(product.variants) &&
        product.variants.length > 1;
    const price       = formatMoney(variant.price);
    const compare     = cfg.showComparePrice && variant.compare_at_price > variant.price
                          ? formatMoney(variant.compare_at_price) : null;
    let rawImg =
          product.featured_image ||
          product.images?.[0] ||
          product.media?.[0]?.preview_image?.src ||
          product.media?.[0]?.preview_image ||
          '';
    if (rawImg && typeof rawImg === 'object') rawImg = rawImg.src || '';
    const sep         = rawImg.includes('?') ? '&' : '?';
    const image = rawImg
      ? rawImg.replace(/[?&]width=\d+/, '') + sep + 'width=400'
      : null;
    const available   = variant.available !== false;
    const saleCls     = compare ? ' cart-upsell-card__price--sale' : '';
    const vendorHtml  = cfg.showVendor && product.vendor
                          ? `<p class="cart-upsell-card__vendor">${escHtml(product.vendor)}</p>` : '';
    const compareHtml = compare
                          ? `<s class="cart-upsell-card__price--compare compare_price text-decoration-line-through">${compare}</s>` : '';
    const showVariantTitle =
                      hasMultipleVariants &&
                      variant.title &&
                      variant.title !== 'Default Title';

    return `
      <div class="swiper-slide">
        <div class="cart-upsell-card">
          <div class="cart-upsell-image card_product_detail">
            <a href="${Shopify.routes.root}products/${product.handle}" class="cart-upsell-card__image-wrap" aria-hidden="true">
          ${image
            ? `<img class="cart-upsell-card__image" src="${escAttr(image)}" alt="${escAttr(product.title)}" width="400" height="400" loading="lazy">`
            : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 525.5 525.5" style="height: 100%;width: 100%;">
                <path d="M375.5 345.2c0-.1 0-.1 0 0 0-.1 0-.1 0 0-1.1-2.9-2.3-5.5-3.4-7.8-1.4-4.7-2.4-13.8-.5-19.8 3.4-10.6 3.6-40.6 1.2-54.5-2.3-14-12.3-29.8-18.5-36.9-5.3-6.2-12.8-14.9-15.4-17.9 8.6-5.6 13.3-13.3 14-23 0-.3 0-.6.1-.8.4-4.1-.6-9.9-3.9-13.5-2.1-2.3-4.8-3.5-8-3.5h-54.9c-.8-7.1-3-13-5.2-17.5-6.8-13.9-12.5-16.5-21.2-16.5h-.7c-8.7 0-14.4 2.5-21.2 16.5-2.2 4.5-4.4 10.4-5.2 17.5h-48.5c-3.2 0-5.9 1.2-8 3.5-3.2 3.6-4.3 9.3-3.9 13.5 0 .2 0 .5.1.8.7 9.8 5.4 17.4 14 23-2.6 3.1-10.1 11.7-15.4 17.9-6.1 7.2-16.1 22.9-18.5 36.9-2.2 13.3-1.2 47.4 1 54.9 1.1 3.8 1.4 14.5-.2 19.4-1.2 2.4-2.3 5-3.4 7.9-4.4 11.6-6.2 26.3-5 32.6 1.8 9.9 16.5 14.4 29.4 14.4h176.8c12.9 0 27.6-4.5 29.4-14.4 1.2-6.5-.5-21.1-5-32.7zm-97.7-178c.3-3.2.8-10.6-.2-18 2.4 4.3 5 10.5 5.9 18h-5.7zm-36.3-17.9c-1 7.4-.5 14.8-.2 18h-5.7c.9-7.5 3.5-13.7 5.9-18zm4.5-6.9c0-.1.1-.2.1-.4 4.4-5.3 8.4-5.8 13.1-5.8h.7c4.7 0 8.7.6 13.1 5.8 0 .1 0 .2.1.4 3.2 8.9 2.2 21.2 1.8 25h-30.7c-.4-3.8-1.3-16.1 1.8-25zm-70.7 42.5c0-.3 0-.6-.1-.9-.3-3.4.5-8.4 3.1-11.3 1-1.1 2.1-1.7 3.4-2.1l-.6.6c-2.8 3.1-3.7 8.1-3.3 11.6 0 .2 0 .5.1.8.3 3.5.9 11.7 10.6 18.8.3.2.8.2 1-.2.2-.3.2-.8-.2-1-9.2-6.7-9.8-14.4-10-17.7 0-.3 0-.6-.1-.8-.3-3.2.5-7.7 3-10.5.8-.8 1.7-1.5 2.6-1.9h155.7c1 .4 1.9 1.1 2.6 1.9 2.5 2.8 3.3 7.3 3 10.5 0 .2 0 .5-.1.8-.3 3.6-1 13.1-13.8 20.1-.3.2-.5.6-.3 1 .1.2.4.4.6.4.1 0 .2 0 .3-.1 13.5-7.5 14.3-17.5 14.6-21.3 0-.3 0-.5.1-.8.4-3.5-.5-8.5-3.3-11.6l-.6-.6c1.3.4 2.5 1.1 3.4 2.1 2.6 2.9 3.5 7.9 3.1 11.3 0 .3 0 .6-.1.9-1.5 20.9-23.6 31.4-65.5 31.4h-43.8c-41.8 0-63.9-10.5-65.4-31.4zm91 89.1h-7c0-1.5 0-3-.1-4.2-.2-12.5-2.2-31.1-2.7-35.1h3.6c.8 0 1.4-.6 1.4-1.4v-14.1h2.4v14.1c0 .8.6 1.4 1.4 1.4h3.7c-.4 3.9-2.4 22.6-2.7 35.1v4.2zm65.3 11.9h-16.8c-.4 0-.7.3-.7.7 0 .4.3.7.7.7h16.8v2.8h-62.2c0-.9-.1-1.9-.1-2.8h33.9c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-33.9c-.1-3.2-.1-6.3-.1-9h62.5v9zm-12.5 24.4h-6.3l.2-1.6h5.9l.2 1.6zm-5.8-4.5l1.6-12.3h2l1.6 12.3h-5.2zm-57-19.9h-62.4v-9h62.5c0 2.7 0 5.8-.1 9zm-62.4 1.4h62.4c0 .9-.1 1.8-.1 2.8H194v-2.8zm65.2 0h7.3c0 .9.1 1.8.1 2.8H259c.1-.9.1-1.8.1-2.8zm7.2-1.4h-7.2c.1-3.2.1-6.3.1-9h7c0 2.7 0 5.8.1 9zm-7.7-66.7v6.8h-9v-6.8h9zm-8.9 8.3h9v.7h-9v-.7zm0 2.1h9v2.3h-9v-2.3zm26-1.4h-9v-.7h9v.7zm-9 3.7v-2.3h9v2.3h-9zm9-5.9h-9v-6.8h9v6.8zm-119.3 91.1c-2.1-7.1-3-40.9-.9-53.6 2.2-13.5 11.9-28.6 17.8-35.6 5.6-6.5 13.5-15.7 15.7-18.3 11.4 6.4 28.7 9.6 51.8 9.6h6v14.1c0 .8.6 1.4 1.4 1.4h5.4c.3 3.1 2.4 22.4 2.7 35.1 0 1.2.1 2.6.1 4.2h-63.9c-.8 0-1.4.6-1.4 1.4v16.1c0 .8.6 1.4 1.4 1.4H256c-.8 11.8-2.8 24.7-8 33.3-2.6 4.4-4.9 8.5-6.9 12.2-.4.7-.1 1.6.6 1.9.2.1.4.2.6.2.5 0 1-.3 1.3-.8 1.9-3.7 4.2-7.7 6.8-12.1 5.4-9.1 7.6-22.5 8.4-34.7h7.8c.7 11.2 2.6 23.5 7.1 32.4.2.5.8.8 1.3.8.2 0 .4 0 .6-.2.7-.4 1-1.2.6-1.9-4.3-8.5-6.1-20.3-6.8-31.1H312l-2.4 18.6c-.1.4.1.8.3 1.1.3.3.7.5 1.1.5h9.6c.4 0 .8-.2 1.1-.5.3-.3.4-.7.3-1.1l-2.4-18.6H333c.8 0 1.4-.6 1.4-1.4v-16.1c0-.8-.6-1.4-1.4-1.4h-63.9c0-1.5 0-2.9.1-4.2.2-12.7 2.3-32 2.7-35.1h5.2c.8 0 1.4-.6 1.4-1.4v-14.1h6.2c23.1 0 40.4-3.2 51.8-9.6 2.3 2.6 10.1 11.8 15.7 18.3 5.9 6.9 15.6 22.1 17.8 35.6 2.2 13.4 2 43.2-1.1 53.1-1.2 3.9-1.4 8.7-1 13-1.7-2.8-2.9-4.4-3-4.6-.2-.3-.6-.5-.9-.6h-.5c-.2 0-.4.1-.5.2-.6.5-.8 1.4-.3 2 0 0 .2.3.5.8 1.4 2.1 5.6 8.4 8.9 16.7h-42.9v-43.8c0-.8-.6-1.4-1.4-1.4s-1.4.6-1.4 1.4v44.9c0 .1-.1.2-.1.3 0 .1 0 .2.1.3v9c-1.1 2-3.9 3.7-10.5 3.7h-7.5c-.4 0-.7.3-.7.7 0 .4.3.7.7.7h7.5c5 0 8.5-.9 10.5-2.8-.1 3.1-1.5 6.5-10.5 6.5H210.4c-9 0-10.5-3.4-10.5-6.5 2 1.9 5.5 2.8 10.5 2.8h67.4c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-67.4c-6.7 0-9.4-1.7-10.5-3.7v-54.5c0-.8-.6-1.4-1.4-1.4s-1.4.6-1.4 1.4v43.8h-43.6c4.2-10.2 9.4-17.4 9.5-17.5.5-.6.3-1.5-.3-2s-1.5-.3-2 .3c-.1.2-1.4 2-3.2 5 .1-4.9-.4-10.2-1.1-12.8zm221.4 60.2c-1.5 8.3-14.9 12-26.6 12H174.4c-11.8 0-25.1-3.8-26.6-12-1-5.7.6-19.3 4.6-30.2H197v9.8c0 6.4 4.5 9.7 13.4 9.7h105.4c8.9 0 13.4-3.3 13.4-9.7v-9.8h44c4 10.9 5.6 24.5 4.6 30.2z"></path><path d="M286.1 359.3c0 .4.3.7.7.7h14.7c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-14.7c-.3 0-.7.3-.7.7zm5.3-145.6c13.5-.5 24.7-2.3 33.5-5.3.4-.1.6-.5.4-.9-.1-.4-.5-.6-.9-.4-8.6 3-19.7 4.7-33 5.2-.4 0-.7.3-.7.7 0 .4.3.7.7.7zm-11.3.1c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7H242c-19.9 0-35.3-2.5-45.9-7.4-.4-.2-.8 0-.9.3-.2.4 0 .8.3.9 10.8 5 26.4 7.5 46.5 7.5h38.1zm-7.2 116.9c.4.1.9.1 1.4.1 1.7 0 3.4-.7 4.7-1.9 1.4-1.4 1.9-3.2 1.5-5-.2-.8-.9-1.2-1.7-1.1-.8.2-1.2.9-1.1 1.7.3 1.2-.4 2-.7 2.4-.9.9-2.2 1.3-3.4 1-.8-.2-1.5.3-1.7 1.1s.2 1.5 1 1.7z"></path><path d="M275.5 331.6c-.8 0-1.4.6-1.5 1.4 0 .8.6 1.4 1.4 1.5h.3c3.6 0 7-2.8 7.7-6.3.2-.8-.4-1.5-1.1-1.7-.8-.2-1.5.4-1.7 1.1-.4 2.3-2.8 4.2-5.1 4zm5.4 1.6c-.6.5-.6 1.4-.1 2 1.1 1.3 2.5 2.2 4.2 2.8.2.1.3.1.5.1.6 0 1.1-.3 1.3-.9.3-.7-.1-1.6-.8-1.8-1.2-.5-2.2-1.2-3-2.1-.6-.6-1.5-.6-2.1-.1zm-38.2 12.7c.5 0 .9 0 1.4-.1.8-.2 1.3-.9 1.1-1.7-.2-.8-.9-1.3-1.7-1.1-1.2.3-2.5-.1-3.4-1-.4-.4-1-1.2-.8-2.4.2-.8-.3-1.5-1.1-1.7-.8-.2-1.5.3-1.7 1.1-.4 1.8.1 3.7 1.5 5 1.2 1.2 2.9 1.9 4.7 1.9z"></path><path d="M241.2 349.6h.3c.8 0 1.4-.7 1.4-1.5s-.7-1.4-1.5-1.4c-2.3.1-4.6-1.7-5.1-4-.2-.8-.9-1.3-1.7-1.1-.8.2-1.3.9-1.1 1.7.7 3.5 4.1 6.3 7.7 6.3zm-9.7 3.6c.2 0 .3 0 .5-.1 1.6-.6 3-1.6 4.2-2.8.5-.6.5-1.5-.1-2s-1.5-.5-2 .1c-.8.9-1.8 1.6-3 2.1-.7.3-1.1 1.1-.8 1.8 0 .6.6.9 1.2.9z">
                </path>
                </svg>`
          }
        </a>
          </div>
          <div class="cart-upsell-card__body">
            ${vendorHtml}
            <h6 class="cart-upsell-card__title m-0">
              <a href="${Shopify.routes.root}products/${product.handle}" class="cart-upsell-card__title text-decoration-none">${escHtml(product.title)}</a>
            </h6>
            <div class="cart-upsell-card__price-wrap product_price_info">
              <span class="cart-upsell-card__price${saleCls}">${price}</span>
              ${compareHtml}
            </div>
            
           ${
              hasMultipleVariants
                ? `
                  <a
                    href="${Shopify.routes.root}products/${product.handle}"
                    class="cart-upsell-card__select-options border-0 bg-transparent p-1 text-decoration-underline btn h-auto rounded-0 text-start"
                    aria-label="Select options for ${escAttr(product.title)}">
                    ${window.cartUpsellStrings.selectOptions}
                  </a>
                `
                : `
                  <button
                    class="cart-upsell-card__add border-0 bg-transparent p-1 text-decoration-underline btn h-auto rounded-0"
                    data-variant-id="${variant.id}"
                    data-product-id="${product.id}"
                    ${!available ? 'disabled' : ''}
                    aria-label="Add ${escAttr(product.title)} to cart">
                    ${available
                    ? window.cartUpsellStrings.addToCart
                    : window.cartUpsellStrings.soldOut}
                  </button>
                `
            }
          </div>
        </div>
      </div>`;
  }

  /* ═══════════════════════════════════════════════════════════════
   * QUICK-ADD
   * ═══════════════════════════════════════════════════════════════ */
  async function handleQuickAdd(e) {
    const btn       = e.currentTarget;
    const variantId = btn.dataset.variantId;
    if (!variantId) return;

    const originalText = btn.textContent.trim();
    btn.disabled = true;
    btn.classList.add('cart-upsell-card__add--loading');

    try {
      const addRes = await fetch(`${window.Shopify.routes.root}cart/add.js`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id: variantId, quantity: 1 }),
      });
      if (!addRes.ok) throw new Error('Add failed');

      const cartRes  = await fetch('/cart.js', { cache: 'no-store' });
      const cartData = await cartRes.json();

      const countEls = document.querySelectorAll(
        '.cart-count, .cart-item-count, [data-cart-count], .open-cart-drawer a > span:last-child'
      );
      countEls.forEach(el => { el.textContent = cartData.item_count; });

      const drawer = window.wdtCartDrawer;
      if (drawer && typeof drawer.loadCart === 'function') {
        await drawer.loadCart();
        if (typeof drawer.rebuildItems    === 'function') await drawer.rebuildItems();
        if (typeof drawer.renderTotals    === 'function') drawer.renderTotals();
        if (typeof drawer.updateDisplay   === 'function') drawer.updateDisplay();
        if (typeof drawer.updateCartCount === 'function') drawer.updateCartCount();
      }

      document.dispatchEvent(new CustomEvent('cart:refresh'));

      setTimeout(() => {
        btn.disabled         = false;
        btn.classList.remove('cart-upsell-card__add--loading');
        btn.textContent      = originalText;
        btn.style.background = '';
        btn.style.color      = '';
      }, 2200);

      // Show skeleton immediately then re-render with updated products
      setTimeout(() => {
        currentProductIds = null;
        refresh(true);
      }, 400);

    } catch (err) {
      console.warn('[CartUpsell] Quick-add error:', err);
      btn.disabled = false;
      btn.classList.remove('cart-upsell-card__add--loading');
      btn.textContent = window.cartUpsellStrings.tryAgain;
    }
  }

  /* ═══════════════════════════════════════════════════════════════
   * SWIPER
   * ═══════════════════════════════════════════════════════════════ */
  function destroySwiper() {
    if (swiperInstance) {
      try { swiperInstance.destroy(true, true); } catch {}
      swiperInstance = null;
    }
  }

  /* ═══════════════════════════════════════════════════════════════
   * UTILITIES
   * ═══════════════════════════════════════════════════════════════ */
  function formatMoney(cents) {
  if (cents == null || cents === '') return '';

  const section = document.getElementById('cart-upsell-section');
  const currency =
    section?.dataset.shopCurrency ||
    Shopify.currency?.active ||
    window.Shopify?.currency?.active ||
    'USD';

  try {
    return new Intl.NumberFormat(document.documentElement.lang || 'en', {
      style: 'currency',
      currency: currency
    }).format(cents / 100);
  } catch (e) {
    return (cents / 100).toFixed(2);
  }
}

  function escHtml(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function escAttr(s) { return String(s ?? '').replace(/"/g, '&quot;'); }

  /* ─── Boot ─── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();