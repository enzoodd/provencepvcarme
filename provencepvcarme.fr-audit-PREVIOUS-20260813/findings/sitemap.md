# Sitemap Audit — Provence PVC Armé (provencepvcarme.fr)

Audit date: 2026-08-11
Site state: pre-launch (DNS for provencepvcarme.fr does not currently resolve — NXDOMAIN). Validation was performed structurally against `sitemap.xml`, `robots.txt`, and the local HTML source tree, not via live crawl/fetch.

Files reviewed:
- `sitemap.xml` (4 `<url>` entries)
- `robots.txt`
- `index.html`, `methode.html`, `realisations.html`, `contact.html`
- `media/` (26 files: photos, `finitions/` subfolder, 1 video) and `images/` (2 SVGs)

## What works

- **XML is well-formed.** Parsed successfully with `xml.dom.minidom`; correct `<?xml version="1.0" encoding="UTF-8"?>` declaration, single root `<urlset>`, no unclosed/mismatched tags.
- **Correct namespace.** `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"` matches the sitemaps.org protocol exactly (no typos, no missing `image`/`news` extension namespaces that would go unused).
- **All `<loc>` values are absolute URLs** using the canonical `https://` scheme and registrable domain (`https://provencepvcarme.fr/...`), as required — no relative paths, no protocol-relative URLs.
- **1:1 coverage between sitemap and actual site.** The 4 local HTML files (`index.html`, `methode.html`, `realisations.html`, `contact.html`) map exactly to the 4 sitemap entries. No orphan pages exist locally that are missing from the sitemap, and no sitemap entry points to a non-existent local file.
- **Homepage uses the canonical root form** (`https://provencepvcarme.fr/`), not `/index.html` — correct practice, and it matches the `<link rel="canonical">` tag on `index.html`.
- **Every sitemap URL matches its page's own `rel="canonical"` tag exactly** (verified: `/`, `/methode.html`, `/realisations.html`, `/contact.html` all self-canonicalize to the same URL listed in the sitemap). No canonical/sitemap mismatch.
- **In-page and cross-page anchors are correctly excluded.** `index.html#faq`, `index.html#pourquoi`, `methode.html#finitions` are used as navigation links within the HTML but are correctly *not* listed as separate `<url>` entries — anchors are not distinct crawlable URLs and including them would be a sitemap error. This was verified by grepping all `href` attributes across the 4 pages.
- **`robots.txt` is minimal and correct**: `User-agent: *`, `Allow: /`, and an absolute `Sitemap: https://provencepvcarme.fr/sitemap.xml` directive on its own line — matches the Sitemaps protocol's robots.txt discovery convention.
- **Well under all size/count limits.** 4 URLs vs. the 50,000 URL / 50MB per-file cap — a sitemap index is not remotely warranted at this scale (see Findings, Info-level note below for the record).
- **`lastmod` format is valid W3C Datetime** (`YYYY-MM-DD`, e.g. `2026-08-09`), which is an accepted subset of ISO 8601/W3C Datetime per the sitemaps.org spec.

## Findings

### 1. Site is pre-launch; sitemap references an unresolvable domain
- **Severity:** High
- **Evidence:** `provencepvcarme.fr` returns DNS NXDOMAIN as of 2026-08-11. `robots.txt` and `sitemap.xml` both hard-code this domain. Until DNS/hosting is live, Googlebot cannot fetch `robots.txt` or `sitemap.xml`, cannot discover the sitemap via Search Console submission, and none of the 4 URLs can be validated for actual HTTP status (200 vs. redirect vs. error) — that check is currently untestable, not passed.
- **Recommendation:** No action needed on the files themselves (they're correctly pre-configured for the target domain). Before/at launch: (a) confirm DNS resolves and the domain serves HTTPS with a valid cert, (b) re-run a live crawl to confirm all 4 URLs return 200 with no redirect chains, (c) submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools only once the domain is confirmed live, (d) re-verify `lastmod` dates reflect real content changes going forward, not just the deploy date.

### 2. `priority` and `changefreq` are deprecated/ignored by Google
- **Severity:** Info
- **Evidence:** All 4 entries include `<priority>` (1.0 for home, 0.8 for others) and `<changefreq>monthly</changefreq>`. Google has officially stated both tags are ignored for crawling/ranking decisions (Bing also mostly disregards them). They add no functional value.
- **Recommendation:** Not required to remove — harmless — but can be dropped to slightly reduce file size/noise and avoid implying false precision (e.g., a hand-set "1.0 vs 0.8" priority scheme has no effect on Google's actual crawl prioritization, which is behavior/link-graph driven).

### 3. Identical `lastmod` across all 4 URLs
- **Severity:** Low
- **Evidence:** All 4 entries share the exact same `lastmod` of `2026-08-09`, matching the most recent commit ("met à jour lastmod du sitemap"). This is currently accurate (all 4 files were in fact touched/deployed around that date per file mtimes: `contact.html` 08-08, `methode.html` 08-08, `realisations.html` 08-09, `index.html` 08-09), so it isn't currently a fabricated/boilerplate value — but a uniform `lastmod` across every page is a common smell that Google associates with mechanically-generated (non-meaningful) timestamps.
- **Recommendation:** Going forward, update `lastmod` per-URL only when that specific page's meaningful content changes (not on every deploy/whitespace/CSS-only change). Do not batch-update all 4 dates together out of habit — let them diverge naturally as pages are edited independently. This keeps `lastmod` a trustworthy freshness signal.

### 4. No sitemap index needed at this scale
- **Severity:** Info
- **Evidence:** 4 URLs total, file size 791 bytes — far below the 50,000 URL / 50MB per-sitemap-file limit that would require splitting into a sitemap index (`<sitemapindex>`) referencing multiple child sitemaps.
- **Recommendation:** No action. A single flat `sitemap.xml` is correct and should remain so until the site grows into the hundreds/thousands of URLs (e.g., if a location-page or blog strategy is later introduced — see Finding 6 for the quality-gate implications of that).

### 5. Substantial photo/video media library has no image sitemap coverage
- **Severity:** Low
- **Evidence:** The site embeds 26 real photographic assets referenced via `<img>` (verified via HTML scan): `index.html` (17 images), `methode.html` (13, including a `finitions/` product-swatch gallery of 9 images), `realisations.html` (15, including avant/après pairs and a "coulisses du chantier" set), plus a hero background video (`media/hero-bg.mp4`). None of these are currently exposed via `<image:image>` sitemap extensions — the sitemap only carries plain `<url>`/`<loc>` page entries.
- **Recommendation:** This is a genuine opportunity, not a defect. Once the domain is live, consider adding `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"` extensions with `<image:image><image:loc>` entries for the higher-value assets — especially the `realisations.html` avant/après gallery and `methode.html` finition swatches, since this is a local trades business where image search (and Google Business Profile / Maps image discovery) is a meaningful acquisition channel. Prioritize images that already have descriptive `alt` text over decorative/background assets. This is optional and low-urgency at 4 pages but worth planning before the `realisations` gallery grows.

### 6. Forward-looking quality gate: no location or programmatic pages exist today (correct), but flag for future growth
- **Severity:** Info
- **Evidence:** Current site has zero location-swap or programmatic pages — 100% of pages are unique, hand-authored, single-purpose (home, méthode, réalisations, contact). This is well below both the 30-page warning and 50-page hard-stop thresholds for location-page doorway risk.
- **Recommendation:** If the business later expands to target multiple towns/communes in Provence (a common local-SEO tactic for this vertical), do not create thin city-swapped landing pages that only change the place name. Any future location pages must carry ≥60% genuinely unique content per page (local project photos, local service-area specifics, not templated boilerplate) before adding them to the sitemap, and should trigger a fresh sitemap-architecture review once the count approaches 30 pages.

## Category Score: 96 / 100

**Justification:** The sitemap is technically flawless for its scope — valid XML, correct namespace, all-absolute URLs, exact 1:1 parity with the real page set, correct exclusion of anchors, correct `robots.txt` cross-reference, and no size-limit concerns. Points are withheld only for: (1) the current impossibility of confirming live HTTP status codes because the domain is pre-launch/unresolvable (a blocking external dependency, not a file defect, −3), and (2) the unused/deprecated `priority`+`changefreq` tags and fully-uniform `lastmod` values, which are minor hygiene items rather than errors (−1). No Critical or High-severity defects exist in the sitemap file itself; the one High-severity item (Finding 1) is a launch-readiness/infrastructure gap, not a sitemap authoring error.
