# Technical SEO Audit — Provence PVC Armé (provencepvcarme.fr)

Audit date: 2026-08-11
Method: static analysis of the local source tree (`index.html`, `methode.html`, `realisations.html`, `contact.html`, `css/style.css`, `js/script.js`, `js/membrane-scene.js`, `js/water-scene.js`, `robots.txt`, `sitemap.xml`, `media/`, `images/`), served locally at `http://localhost:8791/` for structural reference. **No live HTTP requests were made to `provencepvcarme.fr`** — the domain returns DNS NXDOMAIN as of 2026-08-11 and is not yet deployed. `sitemap_discovery.py` was attempted and correctly refused to run against `localhost` (SSRF guard: "Target must be a public HTTP or HTTPS URL"); sitemap/robots structural validation is covered in depth in the sibling `findings/sitemap.md` report and is not fully repeated here.

Note on scope mismatch: the task brief described this business as "menuisier spécialisé en PVC armé — fenêtres/portes" (joinery/windows-doors). The actual site content, copy, `<title>`/meta tags, and all four `LocalBusiness` JSON-LD blocks are 100% about **PVC-armé pool membrane waterproofing** ("pose de membrane PVC armée pour piscines"), with zero mention of windows, doors, or joinery anywhere in the source. This audit evaluates the site as it actually exists. Flagging this discrepancy (Info) in case the brief was mixed up with a different client/domain.

## What works

- Clean, static, server-rendered multi-page site (4 pages) — full content is present in raw HTML with no client-side-only rendering dependency for text/images; a JS-disabled crawler still sees complete page content.
- `robots.txt` is minimal and correct: `User-agent: *`, `Allow: /`, absolute `Sitemap:` directive, no accidental `Disallow`.
- No `noindex`/`nofollow` meta or `X-Robots-Tag` anywhere in the source — every page defaults to indexable.
- `sitemap.xml` is well-formed, 1:1 with the 4 real pages, all `<loc>` absolute and matching each page's own canonical.
- Unique, absolute self-referencing `<link rel="canonical">` on all 4 pages, consistently pointing to the non-www `https://provencepvcarme.fr/...` form (no www/non-www or http/https ambiguity in the source itself).
- `<html lang="fr">` set correctly; no hreflang tags present, which is correct for a single-language, single-country French local-business site (no hreflang errors possible because none are needed).
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` present on all 4 pages, and it does **not** block zoom (no `user-scalable=no` / `maximum-scale=1`) — good for mobile accessibility.
- Unique, well-formed `<title>` and meta description per page; Open Graph + Twitter Card tags present and complete on all 4 pages.
- `LocalBusiness` JSON-LD present on all 4 pages; `FAQPage` JSON-LD present on the homepage and matches the visible FAQ content verbatim (no cloaking).
- CSS reveal animations (`.reveal`) use only `opacity`/`transform`, which do not trigger layout reflow, and are wrapped in a `@media (prefers-reduced-motion: reduce)` fallback that disables the animation entirely — good CLS hygiene and accessibility.
- Image containers for the before/after toggles and gallery grids use fixed `aspect-ratio` (4/3) in CSS, reserving layout space ahead of image load — reduces CLS risk even without HTML `width`/`height` attributes.
- Google Fonts loaded with `rel="preconnect"` and `display=swap` — avoids invisible-text-during-load (FOIT) CWV penalty.
- Internal navigation is link-based (`<a href>` to real `.html` files and in-page anchors), not JS-routed — fully crawlable without executing JavaScript.

## Findings

### 1. Site is not deployed — DNS does not resolve
- **Severity:** Critical
- **Evidence:** `provencepvcarme.fr` is the domain hard-coded in every canonical tag, OG/Twitter URL, JSON-LD `url` field, `robots.txt`, and `sitemap.xml`, but per the task context it currently returns NXDOMAIN. No page can be crawled, no `robots.txt`/`sitemap.xml` can be fetched by Googlebot/Bingbot, and no URL can be submitted to Search Console/Bing Webmaster Tools until DNS and hosting are live.
- **Recommendation:** This blocks 100% of indexing and is the single highest-priority item, but it is an infrastructure/launch task, not a code defect — nothing in the source needs to change for this specific finding. At launch: point DNS at the hosting provider, confirm a valid HTTPS certificate covers both `provencepvcarme.fr` and (if applicable) `www.provencepvcarme.fr` with one canonical redirecting to the other, then re-run a full live crawl to confirm all 4 URLs return HTTP 200 with no redirect chains, and submit the sitemap in GSC/Bing Webmaster Tools only after that's confirmed.

### 2. NAP inconsistency: LocalBusiness schema says "Montélimar", visible footer/postal code say "Dieulefit"
- **Severity:** High
- **Evidence:** On all 4 pages, the `LocalBusiness` JSON-LD block contains:
  ```
  "streetAddress": "417 Chemin de la Françoise",
  "postalCode": "26220",
  "addressLocality": "Montélimar",
  ```
  but the visible footer on all 4 pages (and the task brief) states the address as `417 Chemin de la Françoise, 26220 Dieulefit`. Postal code 26220 belongs to Dieulefit, not Montélimar — the `postalCode`/`addressLocality` pair is internally inconsistent within the schema itself, and the schema also disagrees with the visible page content. This is a carry-over from the prior manual audit (`seo-audit.md`) and remains unresolved in the current source.
- **Recommendation:** Pick one true legal city (almost certainly Dieulefit, matching the postal code and visible footer) and make the JSON-LD `addressLocality` match it exactly on all 4 pages, matching whatever is registered with the business's Google Business Profile. NAP (Name-Address-Phone) consistency between on-page schema, visible content, and the Google Business Profile listing is a direct local-pack ranking and trust signal; a mismatched postal code / locality pair can cause Google to distrust or reject the structured address entirely.

### 3. Hero poster image is oversized and is the likely LCP candidate
- **Severity:** High
- **Evidence:** `media/hero-poster.jpg` (used as the `<video poster>` for the full-bleed hero on the homepage) is **1.16 MB**, 1920×2560px — a portrait-oriented, unusually tall resolution for a hero background (CSS applies `object-fit: cover` so it displays correctly cropped, but the *file itself* still has to be downloaded at full weight before any cropping happens). It is the single largest static image in `media/` and the most likely Largest Contentful Paint element on first visit (video takes longer to start decoding/painting than the poster, and `hero-bg.mp4` itself is 3.5 MB).
- **Recommendation:** Re-export `hero-poster.jpg` at a landscape-appropriate source resolution (e.g., ~1920×1080–1280, matching typical hero-video framing) and compress to WebP/AVIF at quality 75–80; target under 150–250 KB. This is the single highest-leverage LCP fix available in the current asset set — combined with `<link rel="preload" as="image" href="media/hero-poster.jpg">` (or the WebP equivalent) it would materially move the homepage LCP toward the "Good" (≤2.5s) threshold on mobile/4G.

### 4. Hero `<h1>` and hero subtext are gated behind a CSS opacity-in animation, delaying their painted-visible state
- **Severity:** Medium
- **Evidence:** In `index.html`, the hero `<h1>` carries `class="hero-title reveal reveal-2"`; in `css/style.css`: `.reveal { opacity: 0; ...animation: reveal-in 0.8s ... forwards; }` with `.reveal-2 { animation-delay: 0.32s; }`. That means the H1 text does not reach `opacity: 1` until ~1.12s after paint eligibility (0.32s delay + 0.8s animation duration), and the hero paragraph (`reveal-3`) not until ~1.3s. Chrome's LCP algorithm only counts an element once it is fully opaque, so if the H1 text (rather than the video/poster) ends up being the LCP candidate on a given run, this animation alone could push LCP past the "Good" 2.5s threshold on a slow connection, stacked on top of network/render time.
- **Recommendation:** Either remove the opacity delay from the LCP-candidate element specifically (keep the `translateY` motion but start at `opacity: 1`), or shorten `reveal-2`'s delay/duration substantially (e.g., ≤300ms total) so the largest above-the-fold text is not artificially held at zero opacity for over a second. The `prefers-reduced-motion` fallback already proves the content renders correctly without the animation — consider making the non-animated state the default and layering the entrance animation only via JS-added classes.

### 5. Stat counters render "0" in raw HTML and depend on JavaScript to show real values
- **Severity:** Medium
- **Evidence:** In `contact.html` and `methode.html`, the "chiffres clés" tab chips use `<span class="stat-num" data-count-to="24">0</span>h`, `data-count-to="8"` → `0`, `data-count-to="150"` → `0`. Per `js/script.js` (lines ~260-286), the `0` is only replaced by the real number via `animateCount()` triggered on scroll (GSAP/IntersectionObserver), or immediately via `setCountFinal()` — but the immediate fallback only fires `if (prefersReducedMotion || !("IntersectionObserver" in window))`. A crawler or user agent that parses raw HTML without executing JavaScript (or with IntersectionObserver present but JS blocked/failed) would see "0h response time" and "0 départements couverts" instead of the real claims ("<24h", "8 départements", "150/100e"), which is both a misleading-content and an indexable-content risk.
- **Recommendation:** Put the real static value in the HTML by default (e.g., `<span class="stat-num" data-count-to="24">24</span>`) and have the JS animate *from* 0 *to* the target only after confirming it can run, rather than starting the source-of-truth content at a placeholder "0". This guarantees correct content is always present in the DOM regardless of JS execution.

### 6. Security headers cannot be verified pre-launch — confirm at deploy
- **Severity:** Medium (informational until launch, but must be checked before go-live)
- **Evidence:** No `.htaccess`, `_headers`, `netlify.toml`, `vercel.json`, or equivalent host-config file exists anywhere in the repo, and the site cannot be fetched live to inspect response headers. This means HSTS, `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, and `Referrer-Policy` are all currently undetermined — they will be whatever the eventual static host applies by default (which for most static hosts is minimal-to-none).
- **Recommendation:** Not a fetch failure — this is simply undecided config that needs to be set once a hosting provider is chosen. At deploy, add: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (only after confirming full HTTPS on all subdomains), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a `Content-Security-Policy` that explicitly allowlists the third-party origins already in use (`fonts.googleapis.com`, `fonts.gstatic.com`, `cdn.jsdelivr.net`) since the site depends on external CDN scripts/fonts. `X-Frame-Options: SAMEORIGIN` (or CSP `frame-ancestors`) is straightforward to add given there's no legitimate embedding use case for this site.

### 7. Footer legal links are placeholder `href="#"` on all 4 pages
- **Severity:** Medium
- **Evidence:** Every page's footer contains `<a href="#">Mentions légales</a>` and `<a href="#">Politique de confidentialité</a>` (identical on `index.html`, `methode.html`, `realisations.html`, `contact.html`) — these are dead links pointing nowhere, not real pages.
- **Recommendation:** Beyond the pure SEO angle (dead internal links, no actual legal-notice page to crawl/index), French commercial websites are legally required to publish "Mentions légales" (LCEN Article 6-III). Create real `mentions-legales.html` and `politique-de-confidentialite.html` pages with the required business identification info (SIRET, publication director, host name/address) before launch, link them from the footer, and add them to `sitemap.xml` with a low priority once they exist.

### 8. Third-party CDN scripts loaded unpinned, without Subresource Integrity
- **Severity:** Low
- **Evidence:** All 4 pages load `https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js`, `.../ScrollTrigger.min.js`, and `.../lenis@1/dist/lenis.min.js` using a floating major-version range (`@3`, `@1`) with no `integrity`/`crossorigin` SRI attributes. `methode.html` additionally loads Three.js via an unpinned `importmap` (`three@0.160.0` is pinned to an exact version there, which is correctly done — the inconsistency is specifically GSAP/Lenis using floating majors while Three.js pins exact versions).
- **Recommendation:** Pin GSAP/ScrollTrigger/Lenis to exact versions (matching the Three.js approach already used) and add `integrity`/`crossorigin="anonymous"` attributes to all CDN `<script>` tags. This protects against an unannounced breaking release silently degrading the scroll animations/counters (which several findings above already show have imperfect no-JS fallbacks), and against CDN-side tampering.

### 9. No custom 404 page defined
- **Severity:** Low
- **Evidence:** No `404.html` (or equivalent) exists anywhere in the project; only the 4 real pages exist. Static hosts vary in default 404 behavior (some serve a generic host-branded error page, some 404 with no content at all).
- **Recommendation:** Add a branded `404.html` with a link back to the homepage/contact page and configure the eventual host to serve it for unmatched routes. Low priority given the site's small size and clean URL set (low risk of broken/mistyped internal links), but worth having before launch for any external backlinks or user typos.

### 10. Eleven gallery/process JPEGs are 300–490 KB each, uncompressed for web
- **Severity:** Low
- **Evidence:** `media/` totals ~12 MB across 26 files. Beyond the hero poster (Finding 3), `after-4.jpg` (491 KB), `after-3.jpg` (485 KB), `before-3.jpg` (480 KB), `process-4.jpg` (452 KB), `after-1.jpg` (448 KB), `coulisses-2.jpg` (445 KB), `process-5.jpg` (439 KB), `before-1.jpg` (432 KB), `process-2.jpg` (417 KB), `coulisses-3.jpg` (374 KB), `before-4.jpg` (359 KB) are all in the 300–500 KB range at typical smartphone-photo resolutions — these load on `realisations.html` and `methode.html`, both of which are otherwise well set up with `loading="lazy"` and reserved `aspect-ratio`. This repeats/confirms the prior manual audit's finding; it is still unresolved in the current source.
- **Recommendation:** Batch re-export the full gallery to WebP (quality 75–80) with JPEG fallback (`<picture>`) or rely on host-level image optimization if the chosen static host offers it. Typically 40–60% size reduction with no visible quality loss — meaningful given lazy-loading already defers the *request* timing but not the *payload weight* once each image scrolls into view.

### 11. LocalBusiness schema still missing `geo` coordinates and `openingHours`
- **Severity:** Low
- **Evidence:** Confirmed unchanged from the prior manual audit: none of the 4 JSON-LD `LocalBusiness` blocks include a `geo` (`GeoCoordinates`) property or an `openingHours`/`openingHoursSpecification` property.
- **Recommendation:** Add both once available — `geo` via a genuine geocode of the confirmed address (see Finding 2, resolve the locality first), and `openingHours` using real business hours (e.g., `"Mo-Fr 08:00-18:00"`). These increase eligibility for enhanced local rich results and Google Business Profile / Maps consistency, but are not indexing-blocking.

### 12. No `BreadcrumbList` structured data despite a visible breadcrumb UI
- **Severity:** Low
- **Evidence:** `methode.html`, `realisations.html`, and `contact.html` all render a visible breadcrumb (`<p class="breadcrumb"><a href="index.html">Accueil</a> / <span>Méthode</span></p>` etc.) but none of the 4 pages include a matching `BreadcrumbList` JSON-LD block.
- **Recommendation:** Add a small `BreadcrumbList` JSON-LD snippet mirroring the visible breadcrumb on each subpage — low effort, and a common trigger for breadcrumb-style SERP rich results on local-business sites.

### 13. No favicon fallback beyond SVG / no web app manifest
- **Severity:** Low
- **Evidence:** All 4 pages declare only `<link rel="icon" type="image/svg+xml" href="images/icon.svg">`. There is no `favicon.ico`, no `apple-touch-icon`, and no `manifest.json`/`site.webmanifest`.
- **Recommendation:** Add a `favicon.ico` fallback (for older browsers/crawlers/RSS readers/bookmarks that don't support SVG favicons) and an `apple-touch-icon` for iOS home-screen bookmarking, given this is a local-service business where "add to home screen" / repeat visits are plausible. A web manifest is optional (not a PWA) but cheap to add alongside.

### 14. IndexNow key file not present
- **Severity:** Info
- **Evidence:** No `/*.txt` IndexNow key file exists in the project root, and no IndexNow ping logic exists in any script.
- **Recommendation:** Not urgent pre-launch (there's nothing to index yet). Once live, generate an IndexNow key, host it at `https://provencepvcarme.fr/<key>.txt`, and optionally add a lightweight ping-on-publish step (e.g., a small script triggered on deploy) to `https://api.indexnow.org/indexnow` so Bing/Yandex/Naver pick up the initial 4 URLs faster than organic crawl discovery alone.

### 15. Business-type mismatch between task brief and actual site content
- **Severity:** Info
- **Evidence:** Brief described "menuisier spécialisé en PVC armé — fenêtres/portes." Actual site (`<title>`, meta descriptions, all copy, JSON-LD `description`) is unambiguously a pool-membrane waterproofing business ("Provence PVC Armé : pose de membrane PVC armée par thermosoudage... piscines"). No windows/doors/joinery content exists anywhere in the source.
- **Recommendation:** No site change needed — flagging so the discrepancy can be resolved on the requester's side (wrong brief attached to this project, or the business pivoted and the brief wasn't updated).

## Category Score: 71 / 100

**Justification:** The page-level technical SEO fundamentals (canonicals, meta tags, sitemap/robots correctness, single-H1 structure, no-JS-required crawlability, CLS-conscious CSS, viewport/mobile meta) are solid and mostly unchanged/improved since the prior manual audit. The score is held down primarily by the Critical pre-launch/DNS blocker (which currently makes the entire site's indexability moot regardless of on-page quality), a High-severity NAP/schema address inconsistency that actively contradicts itself, a High-severity oversized LCP-candidate image, and a cluster of Medium-severity issues (JS-dependent placeholder content in stat counters, animation-delayed hero text, unresolved security-header planning, dead legal-page links) that are all straightforward to fix but currently unresolved.
