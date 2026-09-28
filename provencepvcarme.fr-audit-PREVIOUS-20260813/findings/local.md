# Local SEO Audit — Provence PVC Armé (provencepvcarme.fr)

Scope: 4 static pages audited directly from source (`index.html`, `methode.html`, `realisations.html`, `contact.html`). No live render/Playwright pass was needed — no SPA shell, no client-side-injected Maps embed or review widget was found in source (confirmed via search), so static HTML reflects what a crawler and a user see.

**Business type:** Hybrid brick-and-mortar/SAB. A physical street address is published (`417 Chemin de la Françoise`) and reused as the fixed base for a radius-style service claim ("Montélimar et ses environs, rayon d'1h"), while `areaServed` in schema and the "Zones desservies" block on the contact page list 8 whole départements — i.e., SAB-style broad-region language layered on top of a fixed-address business. See Finding L-02 for why these two framings conflict.

**Industry vertical:** Home Services / construction — specifically pool renovation & waterproofing (membrane PVC armée / thermosoudage). Content signals are strong and correctly scoped: service methodology page, before/after project gallery, material specs, FAQ — no restaurant/healthcare/legal/real-estate/automotive signals present. Note: the assigning brief described this business as a "menuisier (window/door installer)" — that does not match the actual site content, which is 100% pool-membrane installation. This audit is based on what the site actually says.

---

## What works

- **Phone number is 100% consistent** across all four pages and in both formats used: schema `telephone: "+33660871651"` and every visible `tel:` link / display text `06 60 87 16 51` (header nav CTA, hero CTA, contact page phone CTA, mobile sticky CTA bar, footer) all resolve to the same number, correctly formatted for `tel:` (E.164) and for human display (spaced FR format).
- **Business name is identical everywhere**: "Provence PVC Armé" in `<title>`, schema `name`, nav logo, footer, OG/Twitter tags — no variants, abbreviations, or punctuation drift.
- **Click-to-call is pervasive**: `tel:` links appear in the header nav, hero, mid-page CTA bands, the contact page's dedicated phone CTA, and a mobile sticky bar — strong support for a "call" GBP action and for users on mobile search.
- **Visible street address (footer) is byte-for-byte identical on all 4 pages**: `417 Chemin de la Françoise, 26220 Dieulefit`. Internally consistent, at least within the visible layer.
- **Local project evidence in copy**: real, plausible Drôme/Vaucluse place names are attached to actual project photos — La Motte-Chalancon, Pont-de-Barret, Avignon, Poët-Laval (gallery captions), Saint-Restitut, Dieulefit, Grignan (méthode.html process-step captions). This is exactly the kind of granular local-intent content ("dedicated content tied to real jobs/towns") that supports local relevance signals, and it corroborates Dieulefit as a genuine service town.
- **LocalBusiness JSON-LD is present and identical on all 4 pages** with `name`, `address`, `telephone`, `url`, `image`, `description`, `areaServed`, `priceRange` — covers the two Google-required properties and several recommended ones.
- **FAQPage schema on the homepage** mirrors visible FAQ content verbatim — no schema/content mismatch there (out of scope for this dimension but worth noting as a positive supporting signal for AI/SERP visibility).
- **No broken or placeholder Maps/review widgets that mislead** — the site doesn't fake GBP signals; it simply doesn't have them yet, which is easier to fix than a misconfigured embed.

---

## Findings

### L-01 — CRITICAL: Schema address contradicts visible footer address on every page (Montélimar vs. Dieulefit)

**Severity:** Critical

**Evidence:**
Identical on `index.html` (lines 38-45), `methode.html` (47-54), `realisations.html` (38-45), and `contact.html` (38-45):
```json
"address": {
  "@type": "PostalAddress",
  "streetAddress": "417 Chemin de la Françoise",
  "postalCode": "26220",
  "addressLocality": "Montélimar",
  "addressRegion": "Auvergne-Rhône-Alpes",
  "addressCountry": "FR"
},
```
Yet the visible footer on those same four pages reads (identical on all 4):
```html
<span>417 Chemin de la Françoise, 26220 Dieulefit</span>
```
Postal code `26220` is the INSEE/La Poste code for **Dieulefit**, not Montélimar (Montélimar's codes are in the 26200/26216 range). So the schema pairs a real street number with a real postal code but the *wrong* commune name — a combination that does not exist. This is not a one-off typo; the same broken triple (street + wrong-locality + right-postcode-for-a-different-town) is duplicated across all four `<script type="application/ld+json">` blocks, meaning any crawler, LLM, or GBP-matching algorithm reading the structured data gets a different, non-existent postal address than what the page itself, the footer, and (presumably) the legal/GBP record say.

**Why it matters:** NAP consistency between on-page visible content and structured data is a basic trust/verification signal. A schema address that doesn't geocode to a real place undermines entity resolution for Google's Knowledge Graph and for any GBP-matching process, and if this business ever files for or already has a Google Business Profile at the Dieulefit address, this schema actively works against a match rather than reinforcing it. Note: it's plausible that leading with "Montélimar" in visible marketing copy (title tag, meta description, hero eyebrow) is a *deliberate* choice — Montélimar is the larger, more-searched town near Dieulefit, and businesses in small communes commonly market under a nearby recognizable city name. That is a legitimate positioning decision and, if so, is not itself the defect. The defect is narrower and non-negotiable: the structured-data `address.addressLocality` field is a machine-readable identity claim, not a marketing headline, and it must match the business's real, registered locality regardless of which city is used for SEO/branding purposes in prose. Verify with the owner which town is the actual registered/legal address before applying the fix below — the on-page evidence (footer, postal code, and the "Calepinage · Dieulefit" project caption) all points to Dieulefit, but this should be confirmed rather than assumed.

**Recommendation:** Confirm the legally registered address with the owner (cross-check against SIRET/mentions légales once L-07 is fixed), then set `addressLocality` to the confirmed value — the weight of current evidence points to `"Dieulefit"` — in all four JSON-LD blocks. Do this in one pass across all 4 files since the LocalBusiness block is duplicated verbatim in each. If Montélimar is intentionally used as an SEO "hub city" because it's a larger/more-searched town nearby, that positioning belongs in `areaServed`/on-page marketing copy only, never in the structured `address` object, which must match the real, verifiable business address exactly.

---

### L-02 — HIGH: "Rayon d'1h autour de Montélimar" claim contradicts the 8-département service area

**Severity:** High

**Evidence:**
Repeated verbatim on every page (title tag, meta description, hero eyebrow, OG/Twitter descriptions, footer paragraph), e.g. index.html:
- `<title>...` description: "à Montélimar et dans ses environs (rayon d'1h)"
- Hero eyebrow: `Membrane PVC armée · Thermosoudage · Montélimar et ses environs (rayon d'1h)`
- Footer (all 4 pages): "Construction, rénovation, étanchéité de piscines à Montélimar et dans ses environs (rayon d'1h)."

But the JSON-LD `areaServed` (identical on all 4 pages) and the contact page's "Zones desservies" module both claim:
```json
"areaServed": ["Vaucluse", "Bouches-du-Rhône", "Var", "Drôme", "Gard", "Alpes-de-Haute-Provence", "Hautes-Alpes", "Ardèche"]
```
and contact.html: "**8 départements** couverts autour de Montélimar : Vaucluse, Bouches-du-Rhône, Var, Drôme, Gard, Alpes-de-Haute-Provence, Hautes-Alpes et Ardèche."

Bouches-du-Rhône (Marseille/Aix area) and the Var (Toulon/Fréjus area) are roughly 2–2.5 hours' drive from Montélimar; Hautes-Alpes is 2h+; this is not reconcilable with a stated "1-hour radius."

**Why it matters:** An implausibly large stated service area relative to the business address is a known negative signal for Google Business Profile service-area setup and can trigger suppression or reduced trust in the local pack; it also confuses users and dilutes the "rayon d'1h" positioning that's otherwise a strong, specific trust claim. Google explicitly discourages service areas that "extend beyond a reasonable driving distance" from the business address.

**Recommendation:** Pick one honest framing and use it everywhere: either (a) keep the tight "rayon d'1h autour de Montélimar/Dieulefit" claim and shrink `areaServed` to the départements genuinely reachable in ~1h (realistically Drôme + parts of Ardèche/Vaucluse, matching the actual project towns cited: La Motte-Chalancon, Pont-de-Barret, Avignon, Poët-Laval, Saint-Restitut, Dieulefit, Grignan), or (b) if 8 départements really are served, drop the "rayon d'1h" wording and replace it with named départements/major towns consistently in copy, meta tags, and schema. Keeping both contradictory claims live simultaneously is the core issue.

---

### L-03 — HIGH: No structured evidence of a Google Business Profile — zero GBP signals detected on-page

**Severity:** High

**Evidence:** No `<iframe>` Google Maps embed, no `maps.google.com`/`goo.gl/maps` link, no "Voir sur Google" / "Itinéraire" link, no Place ID reference, no review widget, and no social profile links (`facebook.com`, `instagram.com`, `linkedin.com`, `youtube.com` all return zero matches sitewide) were found in any of the 4 pages or in `css/style.css` / `js/`.

**Why it matters:** Primary GBP category is the #1 local ranking factor (Whitespark 2026), but that lives off-site in the GBP dashboard and can't be verified from the HTML alone (noted as a limitation below). What the *website* should be doing — driving users to the GBP listing, embedding the map, linking "get directions," surfacing the live review count — is entirely absent. This also means the site provides no reinforcing signal (e.g., a Maps embed geocoded to the correct Dieulefit address) that could help offset the schema error in L-01.

**Recommendation:** Once the GBP listing exists and address is corrected/confirmed (see L-01), embed the Google Maps iframe on the contact page pointed at the verified GBP location, add a "Voir sur Google / Itinéraire" link using the Place ID, and link the GBP profile URL (and any social profiles that exist) in the footer. This also gives Google a same-domain corroboration of the correct address.

---

### L-04 — HIGH: No reviews, testimonials, or ratings anywhere on the site

**Severity:** High

**Evidence:** Sitewide search for review/rating/testimonial markers (`avis`, `témoignage`, `review`, `étoile`, `star-rating`, `aggregateRating`) returns no genuine matches — the single hit in `css/style.css` is the substring "review" inside the CSS comment `/* teaser grids (homepage réalisations preview) */` (false positive from "réalisations"). No `aggregateRating` or `Review` object exists in any of the 4 LocalBusiness JSON-LD blocks. No testimonial section, no star ratings, no client quotes anywhere in the HTML.

**Why it matters:** Review velocity and volume are core local ranking and conversion-trust factors; Sterling Sky's "18-day rule" means rankings can start sliding without a steady drip of new reviews, and zero on-site reinforcement of reviews (even a simple "4.9★ sur Google, 32 avis" badge) leaves a trust gap versus competitors who display this prominently near their CTAs.

**Recommendation:** Once GBP exists and has reviews, add: (1) a static or periodically-updated "X.X★ sur Google (N avis)" badge near the primary CTAs (hero, contact page), linked to the GBP review page; (2) `aggregateRating` in the LocalBusiness schema once real review data exists (do not fabricate a rating/count); (3) 2-4 short client testimonials with first name + town (reinforces both trust and the local-town content strategy already used in the gallery captions); (4) a simple post-chantier email/SMS review-request habit to sustain the 18-day cadence.

---

### L-05 — MEDIUM: Generic `LocalBusiness` schema type instead of an industry-specific subtype

**Severity:** Medium

**Evidence:** All 4 pages use `"@type": "LocalBusiness"`. Schema.org / Google's supported local subtypes don't have a dedicated "pool contractor" type, but `HomeAndConstructionBusiness` (or `GeneralContractor`, since the business also does new-build construction, not just renovation) is a closer, more specific fit than the generic base type and is within Google's supported LocalBusiness subtype list.

**Why it matters:** Schema isn't a direct ranking factor, but a more specific type improves entity understanding for rich results and AI-search visibility versus the generic `LocalBusiness` type, which offers the least category signal of any option.

**Recommendation:** Change `"@type": "LocalBusiness"` to `"@type": "HomeAndConstructionBusiness"` (or `GeneralContractor`) in all 4 JSON-LD blocks. Low-risk, one-line-per-file change.

---

### L-06 — MEDIUM: Missing `geo` and `openingHoursSpecification` in schema (carried over from prior technical audit, restated with local-SEO framing)

**Severity:** Medium

**Evidence:** None of the 4 LocalBusiness blocks contain a `geo` (latitude/longitude) property or `openingHoursSpecification`. Already flagged in the prior manual audit (`seo-audit.md` lines 22-23) as blocked on owner input (real GPS point / real hours) — correctly not fabricated.

**Why it matters:** `geo` with 5-decimal precision and `openingHoursSpecification` are both in Google's "recommended" LocalBusiness properties and support map-pack rich results and "open now" signals. Given proximity already accounts for ~55% of ranking variance per the Search Atlas ML study (outside on-page control), a correct `geo` block is one of the few proximity-adjacent signals a site *can* reinforce.

**Recommendation:** Unchanged from prior audit — add real geocoordinates (geocode the corrected Dieulefit address once L-01 is fixed; do not reuse Montélimar coordinates) and real opening hours as soon as the owner supplies them.

---

### L-07 — MEDIUM: No legal/trust page confirming business identity (Mentions légales is a dead placeholder link)

**Severity:** Medium

**Evidence:** Footer on all 4 pages: `<a href="#">Mentions légales</a>` and `<a href="#">Politique de confidentialité</a>` — both `href="#"`, i.e. non-functional placeholders, no actual page exists.

**Why it matters:** French commercial websites are legally required to publish mentions légales (SIREN/SIRET, legal form, publication director, host). Beyond compliance, a real mentions légales page is a corroborating NAP source (often the *most* authoritative one, since it's tied to the SIRET-registered address) that would help resolve which address — Dieulefit or Montélimar — is the legally correct one, and gives Google another same-domain data point for entity verification.

**Recommendation:** Publish a real mentions légales page with the verified legal address (should match whichever address is confirmed correct in L-01), SIRET, and legal form. This single page could become the tie-breaking source of truth for the L-01 conflict.

---

### L-08 — LOW: No email address in schema (visible-only)

**Severity:** Low

**Evidence:** `provencepvcarme@gmail.com` appears in the footer of all 4 pages but is not included as an `email` property in any of the LocalBusiness JSON-LD blocks.

**Why it matters:** Minor — `email` isn't in Google's required or heavily-weighted recommended list, but it's a free, zero-risk addition that reinforces entity data and costs nothing to add alongside the other fixes in L-01/L-05/L-06.

**Recommendation:** Add `"email": "provencepvcarme@gmail.com"` to the schema when doing the other JSON-LD edits.

---

### L-09 — INFO: Tier-1 US directory check (Yelp/BBB) not applicable — French citation sources not assessable offline

**Severity:** Info / Limitation

**Evidence:** No outbound fetch to Yelp, BBB, or French equivalents (PagesJaunes, Solocal/118000, Kompass, Houzz France, Société.com) was performed as part of this file-based audit.

**Why it matters:** Yelp/BBB are US-centric and have limited relevance for a French artisan business; the correct citation set for this vertical/geography would be PagesJaunes, Google-linked Solocal, Kompass, and possibly Houzz — none of which could be checked without live web access, and checking them wasn't requested as part of the file-based scope.

**Recommendation:** Run a live citation-presence check (PagesJaunes, Solocal, Kompass, and Société.com for SIRET cross-reference) once L-01/L-07 establish a single canonical address, so citations are built against the *correct* address instead of propagating the Montélimar error further.

---

### L-10 — INFO: Single-page service-area content, no dedicated per-town/per-département landing pages

**Severity:** Info

**Evidence:** The 8-département service area (contact.html "Zones desservies" list) and the various project towns are all mentioned only within the existing 4 generic pages (hero eyebrow, footer, contact "zones" list, gallery captions) — there are no dedicated pages like `/piscine-drome/` or `/piscine-vaucluse/`.

**Why it matters:** Dedicated service pages are cited as the #1 local organic ranking factor and #2 AI-visibility factor. For a business claiming multi-département coverage, a handful of genuinely unique, locally-specific landing pages (not doorway/duplicate pages) for the 2-3 most important zones would likely outperform the current single-page approach — but this is a growth opportunity, not a defect, and should only be pursued once L-02's area-served claim is reconciled to a realistic, defensible zone.

**Recommendation:** Once L-02 is resolved, consider 2-3 genuinely differentiated local pages (e.g., Drôme, Vaucluse) with real project examples, not templated city-swap doorway pages.

---

## NAP consistency audit — source comparison table

| Field | Visible footer (all 4 pages) | JSON-LD schema (all 4 pages) | Meta/OG/Title (index & contact) | Consistent? |
|---|---|---|---|---|
| Name | Provence PVC Armé | Provence PVC Armé | Provence PVC Armé | ✅ Yes |
| Street | 417 Chemin de la Françoise | 417 Chemin de la Françoise | — (not present) | ✅ Yes (where present) |
| Postal code | 26220 | 26220 | — | ✅ Yes |
| Locality | **Dieulefit** | **Montélimar** | "à Montélimar" (used as marketing hub city, not a formal NAP field) | ❌ **No — Critical conflict, L-01** |
| Phone | 06 60 87 16 51 / tel:+33660871651 | +33660871651 | — | ✅ Yes |
| Email | provencepvcarme@gmail.com | (absent from schema) | — | ⚠️ Present only in one source (L-08) |
| Service area | "rayon d'1h" (hero/footer/meta) | 8 départements (`areaServed`) | "rayon d'1h" (title/meta desc/OG) | ❌ **No — High conflict, L-02** |

---

## GBP optimization checklist (site-supportable signals)

| Signal | Status |
|---|---|
| Clear, correct physical address on-site | ⚠️ Present but conflicts with schema (L-01) |
| Click-to-call phone | ✅ Present, consistent, sitewide |
| Service-area list on-site | ⚠️ Present but internally contradictory (L-02) |
| Maps embed / directions link | ❌ Missing (L-03) |
| Link to GBP profile / Place ID reference | ❌ Missing (L-03) |
| Review badge / aggregateRating | ❌ Missing (L-04) |
| Category-appropriate content (methodology, materials, FAQ, gallery) | ✅ Strong — clearly signals a pool waterproofing/renovation category (GBP primary category should be something like "Swimming pool contractor" or "Swimming pool repair service," not carpentry/joinery — content leaves no ambiguity on this point) |
| Social profile links | ❌ None found sitewide |
| Legal/trust page (mentions légales) | ❌ Dead placeholder link (L-07) |

## Review health snapshot

Rating: none displayed. Count: none displayed. `aggregateRating`: absent from schema. Response pattern: not assessable (no reviews present to respond to). Velocity: not assessable — no GBP review data is exposed anywhere in the site's HTML. This is a complete gap rather than a partial one (see L-04).

## Local schema validation summary

- Type used: `LocalBusiness` (generic) — recommend `HomeAndConstructionBusiness`/`GeneralContractor` (L-05)
- Required properties: `name` ✅, `address` ⚠️ (present but wrong locality, L-01)
- Recommended properties present: `telephone` ✅, `url` ✅, `image` ✅, `priceRange` ✅, `areaServed` ⚠️ (present but contradicts on-page copy, L-02), `description` ✅
- Recommended properties missing: `geo` ❌ (L-06), `openingHoursSpecification` ❌ (L-06), `aggregateRating`/`review` ❌ (L-04)
- Duplication: identical LocalBusiness block hardcoded on all 4 pages (not a defect per se, but means any future fix — address, geo, hours — must be applied in 4 places, or better, extracted to a single JS-injected or server-side-included block to avoid drift)

## Location page quality

Not applicable — this is a single-location business, no multi-location page-quality assessment (unique content %, doorway-page swap test) applies.

---

## Top 10 prioritized actions

1. **[Critical]** Fix `addressLocality` in all 4 JSON-LD blocks from "Montélimar" to "Dieulefit" (L-01).
2. **[High]** Reconcile the "rayon d'1h autour de Montélimar" claim with the 8-département `areaServed`/zones list — pick one honest, consistent service-area framing sitewide (L-02).
3. **[High]** Add a Google Maps embed + "Itinéraire"/directions link on the contact page once GBP address is confirmed (L-03).
4. **[High]** Once GBP exists, surface reviews on-site: rating badge near CTAs + `aggregateRating` in schema + 2-4 testimonials (L-04).
5. **[Medium]** Publish a real mentions légales page with SIRET and the legally correct address — use it as the tie-breaker for L-01 (L-07).
6. **[Medium]** Change schema `@type` from `LocalBusiness` to `HomeAndConstructionBusiness` or `GeneralContractor` (L-05).
7. **[Medium]** Add real `geo` coordinates (geocoded to the corrected Dieulefit address) and `openingHoursSpecification` once owner supplies hours (L-06).
8. **[Medium]** Consolidate the duplicated LocalBusiness JSON-LD block into a single source (templated include or shared JS injection) to prevent the 4-page drift risk seen in L-01/L-02 from recurring (structural recommendation, not a standalone severity item).
9. **[Low]** Add `email` property to the LocalBusiness schema (L-08).
10. **[Info]** Run a live citation audit against French directories (PagesJaunes, Solocal, Kompass) and check/claim social profiles once the address is finalized (L-09).

---

## Limitations disclaimer

This audit was performed by reading the site's static source files only (no live browser render, no external fetch to Google Business Profile, Google Maps, PagesJaunes, Yelp, BBB, or social platforms). As a result, the following could **not** be assessed and are excluded from the score below:

- Whether a Google Business Profile actually exists, its primary/secondary category selection, verification status, Q&A, posts, or photo count (GBP dashboard data is not visible in page source).
- Actual review count, rating, review velocity/recency (the "18-day rule"), or owner response rate — no review data exists on-site to sample.
- Live citation presence/accuracy on PagesJaunes, Solocal, Yelp, BBB, or other directories (would require live web fetches, not performed here).
- Whether "Montélimar" or "Dieulefit" is the legally registered business address (no mentions légales/SIRET page exists to confirm; recommendation in L-01 assumes Dieulefit based on the weight of on-page evidence — footer, postal code match, and the "Calepinage · Dieulefit" project caption — but this should be confirmed against the owner's official registration).
- Proximity-based ranking effects (≈55% of ranking variance per Search Atlas), which are outside on-page control by definition.

---

## Local SEO Score: 37 / 100

| Dimension | Weight | Score (0-100) | Weighted |
|---|---|---|---|
| GBP Signals | 25% | 40 | 10.0 |
| Reviews & Reputation | 20% | 10 | 2.0 |
| Local On-Page SEO | 20% | 65 | 13.0 |
| NAP Consistency & Citations | 15% | 35 | 5.25 |
| Local Schema Markup | 10% | 45 | 4.5 |
| Local Link & Authority Signals | 10% | 25 | 2.5 |
| **Total** | **100%** | | **37.25 ≈ 37** |

**Justification:** The site has real strengths that should not be understated — flawless phone consistency, genuine hyper-local project content (real Drôme/Vaucluse towns tied to real photos), a clean single-source-of-truth footer, and category-appropriate content that would make primary-category selection in GBP straightforward. But the score is pulled down hard by two systemic, sitewide defects rather than isolated typos: (1) the schema address names a different commune than the visible address on every single page, which is exactly the kind of NAP conflict that undermines entity trust at scale since it's baked into all 4 templates; and (2) a complete absence of any GBP-supporting or review-supporting signal on the site — no Maps embed, no review badge, no aggregateRating, no social links — meaning two of the three highest-weighted dimensions (GBP Signals 25%, Reviews 20% = 45% of the total score) are both scoring well below half. Local on-page content quality is the clear bright spot and keeps the score from being lower. Fixing L-01 and L-02 (both low-effort, high-impact, no-owner-input-required edits) would likely move this from the high-30s into the 45-50 range on their own; the larger jump to a strong score depends on owner input (real hours/GPS, GBP creation, review generation) that's outside pure on-page control.
