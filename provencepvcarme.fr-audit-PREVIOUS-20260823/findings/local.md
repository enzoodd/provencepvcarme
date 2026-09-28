# Local SEO Audit — Provence PVC Armé (provencepvcarme.fr)

**Audit date:** 2026-08-13 (follow-up audit — previous score: **37/100**, see `provencepvcarme.fr-audit-PREVIOUS-20260813\findings\local.md`)

**Scope:** All 6 static pages read directly from source (`index.html`, `methode.html`, `realisations.html`, `contact.html`, `mentions-legales.html`, `confidentialite.html`). A live fetch of `https://provencepvcarme.fr/` was also performed to confirm the custom domain is active and that the rendered homepage matches the source read from disk (name, address, phone, and "rayon de 2h" text all confirmed live, with no Maps embed, review widget, or social links present — consistent with source). No client-side-injected content was found (`js/script.js` contains no map/embed/review logic), so static source reliably reflects what a crawler and a user see on every page.

**Business type:** Hybrid brick-and-mortar/SAB, functionally closer to SAB. A physical, verified address (`417 Chemin de la Françoise, 26220 Dieulefit`) is published for legal/trust purposes (auto-entrepreneur, per mentions légales), but the actual service — pool membrane installation — is delivered at the client's property, not at this address. `areaServed` and all visible copy correctly frame this as a named-town service radius rather than a walk-in storefront.

**Industry vertical:** Home Services / construction — pool renovation & waterproofing (membrane PVC armée / thermosoudage). Confirmed via `skills/seo/references/local-schema-types.md`: the closest Google-supported LocalBusiness subtype is **`GeneralContractor`** (no dedicated "pool contractor" type exists); `HomeAndConstructionBusiness` is an acceptable but less specific fallback. The site still uses generic `LocalBusiness` (see Finding L-05).

---

## Changes verified since the previous audit (37/100)

These four items from the prior report are confirmed **fixed** and are not re-flagged as findings below:

1. **Schema/footer address conflict resolved (was L-01, Critical).** `addressLocality` in the JSON-LD `address` object is now `"Dieulefit"` on all 4 pages that carry LocalBusiness schema (`index.html:42`, `methode.html:51`, `realisations.html:42`, `contact.html:42`), matching the visible footer address and the address published on the new `mentions-legales.html` (line 80). Postal code 26220 now correctly pairs with its real commune.
2. **Service-radius claim reconciled (was L-02, High).** The "rayon de 2h" wording is now used consistently in the hero eyebrow, meta description, OG/Twitter tags, and footer of `index.html`, `methode.html`, `realisations.html`, and `contact.html`, **and** `areaServed` in the schema of those same 4 pages now lists the same 13 named towns shown in the visible "Zones desservies" module on `contact.html` (Montélimar, Nyons, Grignan, Valréas, Vaison-la-Romaine, Orange, Bollène, Pierrelatte, Donzère, Suze-la-Rousse, La Garde-Adhémar, Buis-les-Baronnies, Carpentras) — no more mismatch between a tight radius claim and a broad multi-département `areaServed`.
3. **`openingHoursSpecification` added and well-formed (was part of L-06, Medium).** Present identically in all 4 schema blocks: `"@type": "OpeningHoursSpecification"`, `dayOfWeek` array (Monday–Saturday), `opens: "08:00"`, `closes: "18:00"`. Structurally valid per schema.org — correct type, correct property names, correct time format (HH:MM, 24h). Sunday is correctly omitted rather than fabricated as closed, which is valid schema.org practice.
4. **Mentions légales page now exists and is real content (was L-07, Medium).** `mentions-legales.html` is a genuine page (not a dead `href="#"` link) with the éditeur's name, activity, address, phone, email, hosting info (GitHub Pages), and IP/liability clauses — and it corroborates Dieulefit as the address. However, see Finding L-06 below: it is not yet complete (SIRET missing).

---

## Findings

### L-01 — HIGH: "Rayon d'1h" stale text still live on 2 of 6 pages, reintroducing the radius inconsistency the last audit flagged as fixed

**Severity:** High

**Evidence:** The 2h-radius update was applied to `index.html`, `methode.html`, `realisations.html`, and `contact.html`, but not to the two newer pages:
- `mentions-legales.html:117` (footer): `"Construction, rénovation, étanchéité de piscines à Montélimar et dans ses environs (rayon d'1h)."`
- `confidentialite.html:116` (footer): `"Construction, rénovation, étanchéité de piscines à Montélimar et dans ses environs (rayon d'1h)."`

Every other footer on the site (index, méthode, réalisations, contact) reads `"(rayon de 2h)"`. Neither `mentions-legales.html` nor `confidentialite.html` carries a LocalBusiness JSON-LD block of its own, so there's no schema-level conflict on these two pages specifically — but the visible text itself now contradicts the visible text on the other 4 pages, which is exactly the kind of sitewide drift the previous audit's L-02 was about.

**Why it matters:** A site with 6 public pages and 2 of them still claiming a 1-hour radius while 4 claim 2 hours is an internal inconsistency any careful user (or a crawler doing entity/NAP consistency checks) can find in seconds — worse, it appears specifically on the legal/trust pages, which are the pages most likely to be treated as an authoritative source for business facts.

**Recommendation:** Update the footer paragraph on `mentions-legales.html` and `confidentialite.html` to `"(rayon de 2h)"` to match the other 4 pages. Since this string is duplicated 6 times across the site with zero shared template/include, add a note to whatever process updates business facts going forward (radius, hours, phone, address) to grep for all occurrences across all 6 files, not just the 4 "main" pages — this is the second time a global text update has landed only on a subset of pages.

---

### L-02 — HIGH: No `geo` (latitude/longitude) in LocalBusiness schema — still absent

**Severity:** High

**Evidence:** None of the 4 LocalBusiness JSON-LD blocks (`index.html`, `methode.html`, `realisations.html`, `contact.html`) contain a `geo` property. Confirmed via search: zero matches for `geo`, `latitude`, or `longitude` anywhere in the site source. This was flagged in the previous audit (L-06) and remains unresolved. **No coordinates are fabricated or suggested here** — only the confirmed address (`417 Chemin de la Françoise, 26220 Dieulefit`) should be geocoded by the owner or via a mapping tool, never estimated from the postal code alone.

**Why it matters:** `geo` with 5-decimal precision is a Google-recommended LocalBusiness property (per `local-schema-types.md`) and supports map-pack rich results. Given that proximity accounts for ~55% of ranking variance (Search Atlas ML study) and is otherwise outside on-page control, a correctly geocoded `geo` block is one of the few proximity-adjacent signals the website itself can reinforce.

**Recommendation:** Geocode the confirmed Dieulefit address (e.g., via Google Maps "what's my precise location" or a geocoding API) and add to all 4 schema blocks:
```json
"geo": {
  "@type": "GeoCoordinates",
  "latitude": "XX.XXXXX",
  "longitude": "X.XXXXX"
}
```
Use at least 5 decimal places. Do this once and apply identically to all 4 files (they're currently hand-duplicated, so the update must be repeated 4 times or the duplication risk in L-01 will recur).

---

### L-03 — HIGH: Zero on-site Google Business Profile signals — no Maps embed, no directions link, no Place ID, no social links

**Severity:** High

**Evidence:** No `<iframe>` Maps embed, no `maps.google.com` / `goo.gl/maps` link, no "Itinéraire"/"Voir sur Google" link, no Place ID reference, and no `facebook.com` / `instagram.com` / `linkedin.com` link anywhere in the 6 HTML pages or in `js/script.js` (confirmed via search — zero matches sitewide). Live fetch of the production homepage confirms the same: no Maps embed, no review widget, no social links visible.

**Why it matters:** Primary GBP category is the single highest-weighted local ranking factor (Whitespark 2026, score 193), but that setting lives entirely inside the Google Business Profile dashboard and **cannot be assessed from the website** — this audit has no browser/API access to any live GBP listing, so whether a profile exists, its category, verification status, photo count, or posting cadence is unknown and cannot be confirmed or denied here (see Limitations). What the *website* can and should do — reinforce the listing with a Maps embed geocoded to the correct Dieulefit address, a directions link, and a link to the GBP profile itself — is entirely absent, which is a missed opportunity to corroborate NAP on-domain regardless of GBP status.

**Recommendation:** Once the owner confirms a GBP listing exists (or creates one), embed the Google Maps iframe on `contact.html` pointed at the verified location, add an "Itinéraire" link using the Place ID, and link the GBP profile URL in the footer. If social profiles (Facebook/Instagram) exist for the business, link them in the footer and add them as `sameAs` in the schema.

---

### L-04 — HIGH: No reviews, testimonials, ratings, or `aggregateRating` anywhere on the site

**Severity:** High

**Evidence:** Sitewide search for review-related markers (`avis`, `témoignage`, `review`, `rating`, `étoile`) returns no genuine matches in any of the 6 pages or in `js/script.js`. No `aggregateRating` or `Review` object exists in any LocalBusiness JSON-LD block. Unchanged from the previous audit (L-04).

**Why it matters:** Review velocity/volume is a core local ranking and conversion-trust factor; Sterling Sky's "18-day rule" means rankings can slide without a steady drip of new reviews. A complete absence of on-site review reinforcement (even a simple "4.9★ sur Google" badge) leaves a trust gap next to competitors who display this prominently. **No rating, count, or review content has been invented for this report** — this finding documents an absence, not a defect to be filled with placeholder data.

**Recommendation:** Once a GBP listing with real reviews exists: (1) add a "X.X★ sur Google (N avis)" badge near the primary CTAs, linked to the GBP review page; (2) add `aggregateRating` to the schema only once real rating/count data exists — never fabricate these values; (3) add 2-4 short client testimonials with first name + town, reusing the same real-town naming pattern already used successfully in the gallery captions; (4) establish a post-chantier review-request habit (email/SMS) to sustain review velocity and respect the 18-day cadence.

---

### L-05 — MEDIUM: Generic `LocalBusiness` schema type instead of `GeneralContractor` — unresolved

**Severity:** Medium

**Evidence:** All 4 schema blocks still use `"@type": "LocalBusiness"`. Per `skills/seo/references/local-schema-types.md`, the Home Services category table lists no dedicated "pool contractor" subtype, but `GeneralContractor` is the correct fit for a business doing both new-build construction and renovation (as this one explicitly does — "Construction, rénovation, étanchéité de piscines"), with `HomeAndConstructionBusiness` as the generic fallback the reference doc explicitly says to avoid "if specific subtype exists." Carried over unresolved from the previous audit's L-05.

**Why it matters:** Schema type isn't a direct ranking factor, but a specific subtype improves entity understanding for rich results and AI-search visibility versus the generic base type, which offers the least category signal of any option.

**Recommendation:** Change `"@type": "LocalBusiness"` to `"@type": "GeneralContractor"` in all 4 JSON-LD blocks (`index.html`, `methode.html`, `realisations.html`, `contact.html`). Low-risk, one-line-per-file change; `GeneralContractor` is a subtype of `LocalBusiness` so no other properties need to change.

---

### L-06 — MEDIUM: SIRET still a placeholder on the new mentions légales page

**Severity:** Medium

**Evidence:** `mentions-legales.html:83-84`:
```html
<!-- TODO: ajouter SIRET -->
<li>Numéro SIRET : [SIRET À COMPLÉTER]</li>
```
The page is otherwise complete (éditeur name, address, phone, email, hosting, IP/liability clauses).

**Why it matters:** French commercial websites are legally required to publish a SIRET number for a registered auto-entrepreneur activity — this is a compliance gap, not just an SEO one. From a local-SEO angle specifically, the SIRET is also the tie-breaking, most-authoritative NAP data point for cross-referencing the business against Société.com/INSEE and for building citations correctly; leaving it as a visible `[SIRET À COMPLÉTER]` placeholder is also a poor trust signal for any visitor who reads this page.

**Recommendation:** Have the owner supply the real SIRET number and replace the placeholder. Do not fabricate or guess a SIRET.

---

### L-07 — LOW: `email` property still missing from LocalBusiness schema

**Severity:** Low

**Evidence:** `provencepvcarme@gmail.com` appears in the footer of every page and in the mentions légales éditeur block, but is not included as an `email` property in any of the 4 LocalBusiness JSON-LD blocks. Unchanged from the previous audit (L-08).

**Why it matters:** Minor — `email` is not in Google's required or heavily-weighted recommended property list, but it's a free, zero-risk addition that reinforces entity data.

**Recommendation:** Add `"email": "provencepvcarme@gmail.com"` to the schema when doing the other JSON-LD edits (L-02, L-05).

---

### L-08 — LOW: `areaServed` uses plain city-name strings, no `sameAs` disambiguation

**Severity:** Low

**Evidence:** `areaServed` in all 4 schema blocks is a flat array of strings: `["Montélimar", "Nyons", "Grignan", ...]`. Per `skills/seo/references/local-schema-types.md` (SAB-specific properties table): "Industry-recommended for SABs. Use named cities with `sameAs` links to Wikipedia/Wikidata."

**Why it matters:** Plain strings are valid schema.org but ambiguous — several of these town names are not unique in France without geographic disambiguation, and structured `Place` objects with `sameAs` give search engines and AI answer engines a firmer entity match. Low priority since `areaServed` string arrays are common practice and Google does not require this pattern.

**Recommendation:** If revisiting the schema for L-02/L-05, consider upgrading `areaServed` entries to `Place` objects with `sameAs` Wikidata links for the core towns (at minimum Dieulefit and Montélimar). Not urgent — treat as a future enhancement alongside the other schema edits, not a standalone fix.

---

### L-09 — INFO / LIMITATION: Google Business Profile status cannot be verified from the website

**Severity:** Info

**Evidence:** No live GBP dashboard access, Maps Platform API, or DataForSEO MCP tool was available for this audit. A live fetch of `https://provencepvcarme.fr/` was performed and confirms the domain is active and serving the expected content, but this only confirms the *website*, not any linked GBP listing.

**Why it matters:** Whether a GBP profile exists, its primary/secondary category (the #1 local ranking factor per Whitespark 2026), verification status, review count/velocity (the "18-day rule"), Q&A, posts, and photo count are all determined inside the GBP dashboard and are invisible from page source. This audit's GBP Signals score (see below) reflects only what the *website* does or doesn't do to support a GBP listing, not the listing's actual health.

**Recommendation:** Manually check/confirm in the Google Business Profile dashboard: primary category is a pool-specific or general-contractor category (not carpentry/joinery — the site's own content is unambiguous about this), service-area setup matches the 2h/13-town radius, verification is active, and reviews are flowing at a sustainable cadence. Once confirmed, the website should link to and embed that listing (L-03).

---

### L-10 — INFO / LIMITATION: French citation-directory presence not verifiable via automated fetch

**Severity:** Info

**Evidence:** A live fetch attempt against PagesJaunes (the primary French Tier-1 directory for this vertical, per the industry citation guidance referenced for this audit type) returned HTTP 403 Forbidden — the site blocks automated fetches. No other directory (Solocal/118000, Kompass, Yelp, BBB) was attempted given the same access barrier is expected. Yelp/BBB are also low-relevance Tier-1 sources for a French artisan business in this geography.

**Why it matters:** 3 of the top 5 AI-visibility ranking factors are citation-related (per this skill's guidance), so citation presence and accuracy matter, but this cannot be confirmed with the tools available in this audit.

**Recommendation:** Manually search PagesJaunes, Solocal, and Société.com (for SIRET cross-reference once L-06 is resolved) for an existing listing under "Provence PVC Armé" / "417 Chemin de la Françoise, 26220 Dieulefit," and create/claim listings where missing, using the now-corrected Dieulefit address as the canonical source.

---

## NAP consistency audit — source comparison table

| Field | Visible footer (all 6 pages) | JSON-LD schema (4 pages with LocalBusiness) | Mentions légales éditeur block | Live production fetch | Consistent? |
|---|---|---|---|---|---|
| Name | Provence PVC Armé | Provence PVC Armé | — (éditeur: Enzo Oddon, entrepreneur individuel) | Provence PVC Armé | ✅ Yes |
| Street | 417 Chemin de la Françoise | 417 Chemin de la Françoise | 417 Chemin de la Françoise | 417 Chemin de la Françoise | ✅ Yes |
| Postal code | 26220 | 26220 | 26220 | 26220 | ✅ Yes |
| Locality | Dieulefit | **Dieulefit** ✅ (fixed since last audit) | Dieulefit | Dieulefit | ✅ Yes — previously Critical conflict (L-01), now resolved |
| Phone | 06 60 87 16 51 / tel:+33660871651 | +33660871651 | 06 60 87 16 51 | 06 60 87 16 51 | ✅ Yes |
| Email | provencepvcarme@gmail.com | (absent from schema, L-07) | provencepvcarme@gmail.com | provencepvcarme@gmail.com | ⚠️ Present in 3/4 sources |
| SIRET | — (not published anywhere else) | — | `[SIRET À COMPLÉTER]` placeholder (L-06) | — | ❌ Missing entirely |
| Service radius | "rayon de 2h" on 4 pages, **"rayon d'1h" on mentions-legales.html and confidentialite.html** (L-01) | "rayon de 2h" (description field, 4 pages) | "rayon d'1h" (stale) | "rayon de 2h" | ❌ No — new High conflict, L-01 |
| areaServed / zones | 13 named towns (contact.html "Zones desservies") | Same 13 named towns, identical array | — | Same 13 named towns | ✅ Yes — previously High conflict (L-02), now resolved |

---

## GBP optimization checklist (site-supportable signals)

| Signal | Status |
|---|---|
| Clear, correct physical address on-site, consistent with schema | ✅ Fixed since last audit (was L-01) |
| Click-to-call phone | ✅ Present, consistent, sitewide |
| Service-area list on-site, consistent with schema | ✅ Fixed on 4 main pages; ⚠️ still stale on 2 legal pages (L-01) |
| `openingHoursSpecification` in schema | ✅ Added since last audit, well-formed |
| `geo` coordinates in schema | ❌ Still missing (L-02) |
| Maps embed / directions link | ❌ Missing (L-03) |
| Link to GBP profile / Place ID reference | ❌ Missing (L-03) |
| Review badge / `aggregateRating` | ❌ Missing (L-04) |
| Category-appropriate content (methodology, materials, FAQ, gallery) | ✅ Strong — leaves no ambiguity that the correct GBP primary category is pool-related (e.g., "Swimming pool contractor"), not carpentry |
| Social profile links | ❌ None found sitewide |
| Legal/trust page (mentions légales) with complete business identity | ⚠️ Real page exists now (was L-07, fixed), but SIRET still a placeholder (L-06) |
| Real GBP listing existence/category/verification | ❓ Cannot be assessed without GBP dashboard/API access (L-09) |

## Review health snapshot

Rating: none displayed anywhere on-site. Count: none displayed. `aggregateRating`: absent from all 4 schema blocks. Response pattern: not assessable — no reviews present to respond to. Velocity (the "18-day rule"): not assessable from the website, since no review data is exposed anywhere in the HTML. This remains a complete gap, unchanged from the previous audit (L-04). No rating or count has been estimated or invented for this report.

## Local schema validation summary

- Type used: `LocalBusiness` (generic) — should be `GeneralContractor` (L-05, unresolved)
- Required properties: `name` ✅, `address` ✅ (now correct — Dieulefit, fixed since last audit)
- Recommended properties present: `telephone` ✅, `url` ✅, `image` ✅, `priceRange` ✅, `areaServed` ✅ (now consistent with visible copy), `description` ✅, `openingHoursSpecification` ✅ (new, well-formed)
- Recommended properties still missing: `geo` ❌ (L-02), `aggregateRating`/`review` ❌ (L-04), `email` ❌ (L-07, low priority)
- Duplication: identical LocalBusiness block still hand-duplicated across all 4 pages (structural risk — this is exactly why the radius text update landed on 4 pages but not the 2 legal pages, L-01). Consolidating into a single templated/included block would prevent this class of drift recurring a third time.

## Location page quality

Not applicable — single-location business. No multi-location page-quality assessment (unique content %, doorway-page swap test, internal linking depth) applies.

---

## Top 10 prioritized actions

1. **[High]** Fix the stale "rayon d'1h" footer text on `mentions-legales.html` and `confidentialite.html` to "rayon de 2h," matching the other 4 pages (L-01).
2. **[High]** Add real `geo` coordinates (geocoded to the confirmed Dieulefit address, 5-decimal precision) to all 4 LocalBusiness schema blocks — do not estimate from the postal code (L-02).
3. **[High]** Add a Google Maps embed and "Itinéraire" link on `contact.html`, and link the GBP profile URL in the footer, once the listing is confirmed (L-03).
4. **[High]** Once GBP exists with real reviews, surface them on-site: rating badge near CTAs + `aggregateRating` in schema (real data only) + 2-4 testimonials with town names (L-04).
5. **[Medium]** Change schema `@type` from `LocalBusiness` to `GeneralContractor` in all 4 files (L-05).
6. **[Medium]** Replace the `[SIRET À COMPLÉTER]` placeholder on `mentions-legales.html` with the real SIRET number — required for French legal compliance and as the authoritative NAP tie-breaker (L-06).
7. **[Low]** Add `email` property to the LocalBusiness schema (L-07).
8. **[Low]** Upgrade `areaServed` from plain strings to `Place` objects with `sameAs` Wikidata links, at least for Dieulefit and Montélimar (L-08).
9. **[Structural]** Consolidate the duplicated LocalBusiness JSON-LD block across the 4 pages (and extend business-fact updates to all 6 pages, including the 2 legal pages) into a single source of truth — this is the second audit cycle where a global text/data update missed a subset of pages.
10. **[Info]** Manually verify the live Google Business Profile (category, verification, review velocity) and check/claim citations on PagesJaunes, Solocal, and Société.com under the now-corrected Dieulefit address — neither could be confirmed via automated fetch in this audit (L-09, L-10).

---

## Limitations disclaimer

This audit combined static source review of all 6 pages with one live fetch of the production homepage (to confirm the custom domain is active and matches source) and one live fetch attempt against PagesJaunes (blocked, HTTP 403). No DataForSEO MCP tools or Google Business Profile API/dashboard access were available. As a result, the following could **not** be assessed and are excluded from the score below:

- Whether a Google Business Profile actually exists, its primary/secondary category selection, verification status, Q&A, posts, or photo count (GBP dashboard data is not visible in page source or via unauthenticated fetch).
- Actual review count, rating, review velocity/recency (the "18-day rule"), or owner response rate — no review data exists on-site to sample, and GBP itself could not be queried.
- Live citation presence/accuracy on PagesJaunes, Solocal, Société.com, Yelp, or BBB (PagesJaunes fetch was blocked; others not attempted given the same expected barrier).
- Whether the SIRET (once supplied) will validate against INSEE/Société.com records — only the on-site placeholder was assessed.
- Proximity-based ranking effects (≈55% of ranking variance per Search Atlas), which are outside on-page control by definition.

---

## Local SEO Score: 44 / 100

| Dimension | Weight | Score (0-100) | Weighted | Change vs. previous audit |
|---|---|---|---|---|
| GBP Signals | 25% | 40 | 10.0 | No change — still zero on-site GBP reinforcement (Maps embed, social links); GBP profile itself unverifiable |
| Reviews & Reputation | 20% | 10 | 2.0 | No change — still a complete gap |
| Local On-Page SEO | 20% | 72 | 14.4 | ▲ up from 65 — radius claim now internally consistent on the 4 main pages and matches named towns |
| NAP Consistency & Citations | 15% | 60 | 9.0 | ▲▲ up from 35 — critical address/locality conflict fully resolved; still docked for the L-01 stale-text regression, missing SIRET, and unverified citations |
| Local Schema Markup | 10% | 60 | 6.0 | ▲ up from 45 — address fixed, `openingHoursSpecification` added; still docked for generic type, missing `geo` and `aggregateRating` |
| Local Link & Authority Signals | 10% | 25 | 2.5 | No change — no social links, no verifiable citations |
| **Total** | **100%** | | **43.9 ≈ 44** | **+7 vs. previous 37/100** |

**Justification:** The two systemic, sitewide defects that anchored the previous score — the schema address naming a different commune than the visible address, and a contradictory 1h-vs-8-département service claim — are both genuinely fixed, and `openingHoursSpecification` was added correctly. That's real, verifiable progress and it moves NAP Consistency and Local On-Page SEO up meaningfully. However, the two highest-weighted dimensions (GBP Signals 25% + Reviews 20% = 45% of the total score) remain almost entirely unaddressed: there is still no Maps embed, no directions link, no GBP profile link, no social links, and no review content or `aggregateRating` anywhere on the site — and neither could be assessed on the live GBP platform itself given the tools available. A new, avoidable regression was also introduced: the 2h-radius update was applied to 4 pages but missed the 2 legal pages, which is the same class of "global fact updated inconsistently across a duplicated template" error that caused the original L-01/L-02 problems. Fixing L-01 (a two-line text edit) and L-02/L-05 (schema edits requiring no owner input beyond geocoding) would likely move this into the low-50s; the larger jump toward 65+ depends on owner-provided input this audit cannot supply — a confirmed/optimized GBP listing, real reviews, and the SIRET number.
