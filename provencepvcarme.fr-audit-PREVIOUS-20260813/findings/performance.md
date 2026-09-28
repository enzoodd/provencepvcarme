# Performance / Core Web Vitals Audit — Provence PVC Armé

Tested against a local static mirror at `http://localhost:8791/` (live domain `provencepvcarme.fr` is pre-launch, NXDOMAIN as of 2026-08-11). Homepage was measured with a real **Lighthouse 13.4.1 lab run** (mobile, default simulated-throttling preset, Edge-as-Chrome headless). `methode.html`, `realisations.html`, and `contact.html` could not be run through the same lab tool in this session (tooling was stopped after the homepage run per orchestrator direction) and are assessed via static analysis of shared `<head>`/script structure and measured file weights — labelled as estimates below.

## What works

- **CLS is excellent and confirmed, not just estimated.** Lighthouse measured **CLS = 0.002** on the homepage (score 1/1, well inside the ≤0.1 "Good" band). This corroborates the prior manual audit's read of the CSS (`aspect-ratio` reserved on `.ba-toggle`, `.teaser-grid img`, `.finish-chip`, `.coulisses-item`). The `.reveal`/`reveal-1..4` entrance animations on the hero (and the GSAP `.from()` reveals elsewhere) animate `opacity`/`transform` only — no width/height/position properties — so they do not trigger layout shift; they only delay the *visual* appearance of already-laid-out content, which is a paint-timing/perceived-performance concern, not a CLS one (see Finding 5).
- **DOM size is lean.** 293 total elements on the homepage (Lighthouse `dom-size-insight`), far under the ~1,500-element danger zone — no INP risk from DOM bloat.
- **`font-display: swap` is correctly applied** on the single Google Fonts request (`display=swap` in the URL) — Lighthouse's `font-display-insight` scored 1/1 with zero wasted ms, confirming no FOIT (invisible text) window.
- **Images are broadly lazy-loaded with real `loading="lazy"` attributes** on gallery/finish images (confirmed in `index.html`; the LCP element itself was correctly *not* marked lazy — `lcp-discovery-insight` confirms `eagerlyLoaded: true` for the hero video/poster).
- **`rel="preconnect"` is set for both `fonts.googleapis.com` and `fonts.gstatic.com`**, shaving one DNS/TLS round trip off the font critical chain.
- **Server response time is a non-issue for the static architecture.** Lighthouse's LCP breakdown shows **TTFB = 8.7ms** — once actual media/asset weight is fixed, there is no backend latency to fight.
- **CSS is a single 41KB stylesheet**, no CSS-in-JS or multiple stylesheet round trips, and it's requested with the right relative priority alongside JS.

## Findings

### 1. LCP is failing ("Poor"), driven by the hero poster image *and* an eagerly-downloading 3.5MB autoplay video competing for bandwidth
**Severity: Critical**

**Evidence:** Lighthouse mobile lab run on `/`: **LCP = 4.19s** (score 0.44 — this crosses the 4.0s "Poor" line, not merely "Needs Improvement"). Lighthouse's `largest-contentful-paint-element` / `lcp-breakdown-insight` identifies the LCP element as `<video class="hero-video" poster="media/hero-poster.jpg">` itself. `hero-poster.jpg` is measured at **1,163,761 bytes (1.11 MB)** at an unusual **1920×2560 portrait** resolution for what displays as a landscape/viewport-filling hero background — most of that pixel data is never shown, it's wasted bytes.

Critically, the network trace from the same Lighthouse run shows `media/hero-bg.mp4` (measured **3,649,401 bytes / 3.48MB** on disk) being fetched **immediately and aggressively in parallel with the poster image** — the top-2 transfers in the whole page load are `hero-bg.mp4` (≈3.1MB transferred within the trace window, i.e. essentially the full file) and `hero-poster.jpg` (1.1MB). This **directly contradicts the prior manual audit's assumption** that the video is "déjà gérée en lazy côté JS." It is not: `<video autoplay muted loop playsinline poster="media/hero-poster.jpg"><source src="media/hero-bg.mp4"></video>` has no `preload` attribute (browser default is effectively eager for an `autoplay` video) and no `loading`/lazy mechanism. A full read of `js/script.js` confirms there is no code that sets/defers `video.src` or toggles `preload` — the only JS touching `.hero-video` is a GSAP scroll-parallax `transform`, which has zero effect on load timing. So on first paint, the browser is contending for bandwidth between a 1.1MB poster (the actual LCP resource) and a 3.5MB video it doesn't need to start playing until well after LCP.

**Recommendation:**
- Resize/re-export `hero-poster.jpg` to its actual display dimensions (viewport-width landscape crop, not 1920×2560 portrait) and compress to WebP/AVIF q75-80 — expected **~1.1MB → ~150-220KB** (est. 85%+ reduction, see Finding 4 for methodology).
- Add `fetchpriority="high"` to the `<video poster>` element (Lighthouse's `lcp-discovery-insight` explicitly flags `priorityHinted: false` — this is a one-attribute fix).
- Stop the video from competing with the LCP resource: set `preload="none"` on the `<video>` and swap in the real `src`/call `.load()` + `.play()` from JS only after `window.load` or an `IntersectionObserver` trigger (with a small delay), so the 3.5MB file starts downloading *after* the poster/hero text have painted, not concurrently with them.
- Separately reduce `hero-bg.mp4` itself — 3.5MB for a looping background clip is heavy regardless; re-encode at a lower bitrate/shorter loop (target well under 1.5MB) since it will still consume mobile data even if deferred.

### 2. Google Fonts is a 3-hop render-blocking critical chain with no self-hosting or preload of the font files
**Severity: High**

**Evidence:** Lighthouse's `network-dependency-tree-insight` shows the chain `HTML → fonts.googleapis.com/css2 (1.6KB) → 5× fonts.gstatic.com woff2 files`. The five font files total **~106KB** (Inter 48.5KB, Space Grotesk 22.3KB, Instrument Serif 15.7KB, IBM Plex Mono ×2 at 10.1KB each) and, under Lighthouse's simulated network, the longest leaf (`Inter` woff2) doesn't resolve until several seconds in. `render-blocking-insight` separately flags the Google Fonts CSS request itself with an estimated 1,398ms of blocking-adjacent cost. Four font families × multiple weights/styles is also more than this single-page design likely needs.

**Recommendation:** Self-host the subset of font files actually used (eliminates one full round trip to `fonts.googleapis.com` before the `fonts.gstatic.com` request can even start) and add `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the 1-2 fonts used in above-the-fold text (hero `h1`/eyebrow). Audit whether all 4 families × all requested weights are actually used in the CSS — trimming unused weights (e.g., if `Instrument Serif` italic isn't used, or a `Inter` weight is unused) directly shrinks this chain.

### 3. Three third-party CDN scripts (GSAP, ScrollTrigger, Lenis) load synchronously with no `defer`/`async`, adding to render-blocking cost and main-thread work
**Severity: Medium**

**Evidence:** `index.html` loads `gsap.min.js` (29.4KB), `ScrollTrigger.min.js` (18.5KB), and `lenis.min.js` from `cdn.jsdelivr.net`, plus local `js/script.js` (21KB) — all via plain `<script src="...">` tags with no `defer` or `async`, placed at the end of `<body>`. Lighthouse's `render-blocking-insight` still lists `gsap.min.js` as contributing an estimated 1,564ms of blocking-adjacent delay. Total blocking time (TBT) measured **441ms** (score 0.63 — "Needs Improvement," and a leading indicator of INP risk on real devices). `mainthread-work-breakdown` totaled 13.2s under Lighthouse's 4x CPU throttle (this figure is heavily inflated by the throttle and not representative of real unthrottled devices, but it's directionally consistent with meaningful animation-init cost: GSAP + ScrollTrigger + Lenis all initialize and bind scroll listeners on load, and `script.js`'s `revealSectionTitles()` function synchronously reads `offsetTop` in a loop while mutating the DOM immediately beforehand — a forced-reflow/layout-thrashing pattern for every `.section-title` on the page).

**Recommendation:** Add `defer` to all four script tags (safe since they're already positioned at the end of body, but `defer` also guarantees non-blocking fetch scheduling and preserves execution order). Consider whether Lenis (smooth-scroll) is worth its cost on a marketing site — it adds a permanent `requestAnimationFrame`/scroll-hook loop for the life of the page. If kept, verify the `isDesktopViewport` gate (`window.innerWidth >= 768`) is re-checked on resize, not just at load. For `revealSectionTitles()`, batch the `offsetTop` reads (read all first, then mutate) to avoid layout thrashing on pages with many `.section-title` elements.

### 4. ~5.9MB of réalisations/méthode gallery photos are unoptimized camera originals — confirmed exact file sizes, concrete WebP savings estimate
**Severity: High**

**Evidence (exact, from `ls -la media/`):** Total `media/` = **12,253,983 bytes (11.7MB)**, matching the prior audit's "~12MB" estimate almost exactly. Breakdown of the 16 unoptimized gallery photos flagged by the prior audit, with real numbers:

| File | Bytes | KB |
|---|---|---|
| after-1.jpg | 448,045 | 437 |
| after-2.jpg | 303,233 | 296 |
| after-3.jpg | 484,535 | 473 |
| after-4.jpg | 490,816 | 479 |
| before-1.jpg | 431,860 | 422 |
| before-2.jpg | 314,548 | 307 |
| before-3.jpg | 479,797 | 469 |
| before-4.jpg | 358,877 | 350 |
| process-1.jpg | 189,446 | 185 |
| process-2.jpg | 417,117 | 407 |
| process-3.jpg | 182,689 | 178 |
| process-4.jpg | 451,542 | 441 |
| process-5.jpg | 438,595 | 428 |
| coulisses-1.jpg | 353,548 | 345 |
| coulisses-2.jpg | 444,818 | 434 |
| coulisses-3.jpg | 373,681 | 365 |
| **Subtotal (16 files)** | **6,163,147** | **≈ 5.88 MB** (avg 367KB/file) |

Plus `media/finitions/` (9 files, used on homepage + `methode.html#finitions`): **931,968 bytes (≈910KB)** — 6 texture photos at 130-192KB each and 3 flat-color swatches under 6.1KB each (already fine). Plus `hero-poster.jpg` (1.11MB, covered in Finding 1) and small assets `feature-1.jpg` (172,648B), `finish-detail-1.jpg` (130,299B), `gallery-extra-1.jpg` (42,759B) totaling ~345KB.

Realisations.html and methode.html each pull a large share of these 16 photos plus the finitions/process sets into their initial DOM (lazy-loaded below the fold per the prior audit, but still counted in full-page transfer weight and each still requires a full decode+paint as the user scrolls a photo-heavy gallery page) — these are the two heaviest pages on the site by a wide margin.

**Recommendation — concrete before/after WebP estimate:**
- The 16 gallery photos (avg 367KB, phone-camera originals with no visible web compression pass) at **WebP quality 75-80**: typical reduction for uncompressed/lightly-compressed source JPEGs re-encoded to WebP is 50-65% (this is compression-quality gain, not just format — these files show no sign of ever having been run through a web-optimization pipeline). Estimated result: **5.88MB → ~2.4-2.9MB**, saving **~3.0-3.5MB**.
- `finitions/` (already closer to reasonably sized): WebP conversion here is closer to format-only gain (~25-30%): **931KB → ~650-700KB**, saving **~250-280KB**.
- `hero-poster.jpg`: covered in Finding 1 (resize + WebP), **~1.11MB → ~150-220KB**, saving **~900KB-950KB**.
- Small assets (`feature-1.jpg`, `finish-detail-1.jpg`, `gallery-extra-1.jpg`): modest WebP gains, **~345KB → ~230-260KB**.
- **Net effect: total image payload (excluding video) drops from ≈8.7MB to ≈3.9-4.3MB — a ~52-55% reduction**, with the largest single-file win on `hero-poster.jpg` directly improving LCP, and the aggregate gallery reduction most improving `realisations.html`/`methode.html` total page weight and scroll-triggered decode cost.
- **Caveat:** do not convert the images referenced by `og:image`/`twitter:image` (`feature-1.jpg`, used identically across all 4 pages' meta tags) to WebP-only — several link-preview crawlers/social platforms still render WebP unreliably for OG cards. Keep a JPEG for that specific use, or serve WebP via `<picture>` with JPEG fallback only for in-page `<img>` usage, not the meta tag URL.
- Ship WebP with a JPEG `<picture>`/`srcset` fallback (or AVIF as a further stretch goal) rather than a hard cutover, since there's no build pipeline currently converting these on save.

### 5. Hero text is invisible-on-load behind staggered CSS opacity/transform reveals (`reveal reveal-1..4`)
**Severity: Low**

**Evidence:** `index.html`'s hero markup applies `reveal reveal-1` through `reveal reveal-4` classes to the eyebrow text, `<h1>`, subtitle, and CTA buttons — a staggered fade/lift-in pattern (confirmed cross-cutting with the technical audit's note on this same pattern). Because these only animate `opacity`/`transform`, they do not affect CLS (confirmed: measured CLS 0.002) and the LCP element on this page is the hero video/poster, not the text, so this isn't currently inflating the *measured* LCP number. It is, however, a perceived-performance cost: the actual heading/CTA content that a visitor is scanning for is invisible for the animation's delay+duration window immediately after the (already slow, per Finding 1) hero image paints, compounding the felt loading time. If this pattern is reused for text that ever becomes the LCP candidate on another page/breakpoint (e.g., a text-only hero on `contact.html` or `methode.html`), it would directly delay measured LCP, since Chrome's LCP algorithm does track render/paint of the element and an opacity:0 initial state can push back when it's credited as "rendered."

**Recommendation:** Keep opacity/transform-only animations (correct choice for CLS) but shorten total delay+duration for above-the-fold hero text specifically (CTA buttons in particular — a visitor ready to call/request a quote should not wait through 4 staggered animation steps to see the button), and avoid ever applying this pattern to an element likely to be the LCP candidate.

### 6. `methode.html`, `realisations.html`, `contact.html` were not lab-measured this session — estimated risk based on shared architecture
**Severity: Info**

**Evidence:** All three pages share the identical `<head>` render-blocking structure as the homepage (same Google Fonts chain, same `css/style.css`, same preconnects — confirmed by reading each page's `<head>`). `methode.html` additionally loads a Three.js `importmap` (`three@0.160.0` + `examples/jsm/` addons from `cdn.jsdelivr.net`) for what is presumably the membrane cross-section 3D scene (`js/membrane-scene.js`, 10.3KB) — this is a heavier, WebGL-capable dependency not present on the other pages and is a plausible additional TBT/INP contributor on `methode.html` specifically, not yet measured. `realisations.html` and `methode.html` are the two pages that embed the bulk of the 5.88MB gallery-photo set from Finding 4.

**Recommendation:** Once WebP conversion (Finding 4) and the render-blocking/script fixes (Findings 2-3) are applied, re-run Lighthouse against all four URLs to confirm; specifically verify Three.js on `methode.html` isn't shipped/executed for users who never scroll to the 3D section (should be dynamically imported / IntersectionObserver-gated, not loaded via a page-wide `importmap` script that the browser must resolve on every load).

## Category Score: 50 / 100

**Justification:** Of the three Core Web Vitals, only one (CLS = 0.002, measured) clearly passes "Good." LCP measured **4.19s on the homepage — in the "Poor" band (>4.0s)**, driven by a combination of an oversized/wrong-aspect hero poster image and, more importantly, a previously-unidentified bug: the 3.5MB background video downloads eagerly and concurrently with the LCP image rather than being deferred, directly contradicting the assumption in the prior audit that this was already handled. INP has no direct field or lab-interaction measurement available (no CrUX data pre-launch; Lighthouse's TBT of 441ms is a proxy, "Needs Improvement" range), but multiple uncoordinated scroll listeners (native scroll events, Lenis, ScrollTrigger) plus a forced-reflow pattern in the title-splitting code are enough of a real risk to withhold a "Good" assumption for real-world 75th-percentile mobile users. The site's foundations are solid — lean DOM (293 elements), correct `font-display: swap`, correct lazy-loading, TTFB near-zero, and genuinely excellent, *measured* CLS — and every Critical/High finding here has a concrete, scoped, low-risk fix (resize one image, gate one video's `preload`, self-host/preload fonts, add `defer` to three script tags, batch-convert a known 16-file gallery set to WebP with a quantified savings estimate). This is a "good bones, bad hero-media strategy" site: the score reflects one severely failing metric (LCP) dragging down an otherwise well-built page, not a systemic architecture problem.
