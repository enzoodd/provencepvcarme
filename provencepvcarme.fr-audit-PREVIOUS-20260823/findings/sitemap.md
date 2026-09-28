# Sitemap & robots.txt Audit — Provence PVC Armé (provencepvcarme.fr)

Audit date: 2026-08-13
Site state: **live**. Domain now resolves and serves over HTTPS via GitHub Pages (previous audit on 2026-08-11 was pre-launch/NXDOMAIN and could not verify live HTTP status — that gap is now closed). Validation performed via `sitemap_discovery.py` against the live domain, direct `curl` checks of every sitemap URL, and structural review of `sitemap.xml` / `robots.txt` / the 6 HTML source files.

Files reviewed:
- `sitemap.xml` (6 `<url>` entries — grew from 4 since the previous audit with the addition of `mentions-legales.html` and `confidentialite.html`)
- `robots.txt`
- `index.html`, `methode.html`, `realisations.html`, `contact.html`, `mentions-legales.html`, `confidentialite.html`

Previous report: `provencepvcarme.fr-audit-PREVIOUS-20260813\findings\sitemap.md` (score 96/100, pre-launch).

## What works

- **Domain is live and resolves correctly.** `sitemap_discovery.py --json` against `https://provencepvcarme.fr` found `robots.txt` → declared `Sitemap:` line → `sitemap.xml` fetched with `status_code: 200`, `kind: "urlset"`, `valid: true`. The launch-readiness gap flagged as the sole High-severity finding in the previous audit is now resolved.
- **All 6 sitemap URLs return live HTTP 200** with no redirects, verified individually via `curl -L -w "%{http_code}"`: `/`, `/methode.html`, `/realisations.html`, `/contact.html`, `/mentions-legales.html`, `/confidentialite.html`. `robots.txt` and `sitemap.xml` themselves also return 200.
- **HTTP → HTTPS and www → apex both correctly redirect (301).** `http://provencepvcarme.fr/` → 301, and `https://www.provencepvcarme.fr/` → 301 → `https://provencepvcarme.fr/` (verified via response headers, `Location: https://provencepvcarme.fr/`). No duplicate host serving live content.
- **XML is well-formed.** Parsed successfully with `xml.dom.minidom`: correct `<?xml version="1.0" encoding="UTF-8"?>` declaration, single `<urlset>` root with correct `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"` namespace, 6 `<url>` children, no unclosed/mismatched tags.
- **1:1 coverage between sitemap and the live site.** All 6 HTML pages (`index.html`, `methode.html`, `realisations.html`, `contact.html`, `mentions-legales.html`, `confidentialite.html`) map exactly to the 6 sitemap entries. No orphan pages, no dead sitemap entries. `mentions-legales.html` and `confidentialite.html` (added since the previous audit for RGPD compliance) are correctly present.
- **Every sitemap `<loc>` matches its page's self-referencing `rel="canonical"` tag exactly** (verified on all 6 pages).
- **`/index.html` is correctly deduplicated via canonical, not a sitemap issue.** GitHub Pages serves `/index.html` directly at 200 (identical byte-for-byte content to `/`) rather than redirecting it — this is normal GitHub Pages hosting behavior, not misconfiguration. `index.html`'s own `<link rel="canonical">` points to `https://provencepvcarme.fr/`, so this is correctly handled at the page level and is not listed as a separate sitemap entry.
- **No `noindex` anywhere.** Grepped all 6 pages for `noindex`/`X-Robots-Tag` meta and checked live response headers — none found. No sitemap URL is accidentally deindexed.
- **`robots.txt` is correct and unrestrictive.** `User-agent: *`, `Allow: /`, and an absolute `Sitemap: https://provencepvcarme.fr/sitemap.xml` directive — matches the Sitemaps protocol discovery convention, live and fetchable at 200. No page is blocked by errors in `robots.txt`.
- **Well under all size/count limits.** 6 URLs, 1,150 bytes — far below the 50,000-URL / 50MB per-file cap (news-sitemap 1,000-URL cap is not applicable; this is not a `news:` sitemap).
- **`lastmod` format is valid W3C Datetime** (`YYYY-MM-DD`) throughout.
- **No location-page doorway risk.** 6 hand-authored, single-purpose pages — nowhere near the 30-page warning or 50-page hard-stop thresholds. No action needed on this gate.

## Findings

### 1. `lastmod` for 4 of 6 pages is stale — real content changes since 2026-08-09 are not reflected
- **Severity:** Medium
- **Evidence:** `sitemap.xml` shows `lastmod: 2026-08-09` for `/`, `/methode.html`, `/realisations.html`, and `/contact.html`. Git history shows all four files have had genuine, user-visible content changes since that date, most recently commit `7e54731` ("Rayon d'intervention 1h → 2h", 2026-08-13 16:17) which changed the visible service-radius text, meta description, and JSON-LD description on `index.html` and `methode.html` (and touched `realisations.html`/`contact.html` per the same commit's stated scope). Earlier meaningful changes in the same window include `be17e73` (SEO local: address fix + service-area restructure, 2026-08-11) and `cd6ec09` (BreadcrumbList schema, menu fix, 2026-08-11). None of these bumped `lastmod` in `sitemap.xml`, which was last touched itself on 2026-08-12 (commit `26c5468`) only to add the two new legal-page entries — the 4 pre-existing dates were left untouched at `2026-08-09`.
- **Recommendation:** Update `lastmod` for `/`, `/methode.html`, `/realisations.html`, and `/contact.html` to `2026-08-13` (or per-page, to the actual date of each page's last meaningful edit) now that the service-radius/meta-description change has shipped. Going forward, bump a page's `lastmod` only when *that specific page's* meaningful content changes — not on every deploy — so the signal stays trustworthy for Google's freshness heuristics.

### 2. `priority` and `changefreq` are deprecated/ignored by Google
- **Severity:** Info
- **Evidence:** All 6 entries include `<priority>` (1.0 home, 0.8 core pages, 0.3 legal pages) and `<changefreq>` (`monthly` for core pages, `yearly` for legal pages). Google has officially stated both tags are ignored for crawling/ranking decisions; Bing also largely disregards them. The current values are logically consistent (home > core service pages > legal boilerplate) so they cause no harm, but they carry no functional weight.
- **Recommendation:** No action required. Optional: drop both tags to trim the file and avoid implying false precision, since they influence nothing in practice.

### 3. `lastmod` for the two legal pages is uniform but currently accurate
- **Severity:** Low
- **Evidence:** `mentions-legales.html` and `confidentialite.html` both carry `lastmod: 2026-08-12`, matching their creation commit (`26c5468`, 2026-08-12 09:44) and a same-day sitewide font-family change (`9e61a33`, 2026-08-12 12:04) that touched CSS/typography across all pages, not page-specific legal content. This is not fabricated — both pages genuinely were last substantively touched that day — but a uniform date across two pages is a minor smell worth flagging so it isn't allowed to drift into a habit of batch-updating all `lastmod` values together regardless of actual per-page changes (see Finding 1, which is exactly that failure mode already occurring for the other 4 pages).
- **Recommendation:** No immediate action. Keep letting these two dates diverge naturally — only bump one if its own legal text changes (e.g., a future RGPD wording update), not because of unrelated sitewide CSS/design commits.

### 4. No sitemap index needed at this scale
- **Severity:** Info
- **Evidence:** 6 URLs, 1,150 bytes — far below the 50,000-URL / 50MB per-sitemap-file limit.
- **Recommendation:** No action. A single flat `sitemap.xml` remains correct.

### 5. Media library still has no image sitemap coverage (carried forward, unchanged)
- **Severity:** Low
- **Evidence:** The site's photo/video assets (avant/après gallery on `realisations.html`, finition swatches on `methode.html`, hero video on `index.html`) are still not exposed via `<image:image>` sitemap extensions. Same observation as the previous audit; nothing has changed here.
- **Recommendation:** Optional, low-urgency at 6 pages. Consider `xmlns:image` extensions for the `realisations.html` avant/après set if/when image-search or Google Business Profile discovery becomes a priority acquisition channel.

## Missing / extra pages
- **Missing from sitemap:** none. All 6 live, indexable HTML pages are present.
- **Extra/dead entries (404 or redirected):** none. All 6 `<loc>` values return live 200 with no redirect chain.

## robots.txt
```
User-agent: *
Allow: /

Sitemap: https://provencepvcarme.fr/sitemap.xml
```
- Live, fetchable at 200, `Sitemap:` line present with the correct absolute URL. No `Disallow` rules — nothing is unintentionally blocked. Not modified since 2026-08-08; no changes needed given the site's current scope.

## Category Score: 98 / 100

**Justification:** The previous score of 96/100 was capped by one High-severity, launch-blocking issue (domain unresolvable, live HTTP status unverifiable) and minor hygiene notes. That High finding is now fully resolved — the domain is live, all 6 sitemap URLs verified 200, HTTPS/www redirects are correctly configured, `robots.txt` is fetchable with a valid `Sitemap:` directive, and sitemap/site coverage remains exact 1:1 (now including the two new RGPD pages). The score is not a full 100 because of one genuine, newly-observed Medium-severity issue: `lastmod` for 4 of 6 pages has gone stale relative to real shipped content changes (most recently today's service-radius copy update), which is a trust/freshness-signal defect worth fixing (−2). The deprecated `priority`/`changefreq` tags and lack of image-sitemap coverage remain Info/Low items with no material SEO impact (no further deduction).
