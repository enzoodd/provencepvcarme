# Schema.org Audit — Provence PVC Armé

**Scope:** index.html, methode.html, realisations.html, contact.html (4 pages, static site, pre-launch).
**Method:** Direct read of source HTML + JSON-LD parse validation (all 5 blocks across the 4 pages are syntactically valid JSON). No live Rich Results Test possible (domain doesn't resolve yet) — validated structurally against schema.org and Google's structured-data guidelines.

> **Correction to brief:** the task description characterizes this business as "menuisier spécialisé en PVC armé — fenêtres/portes". The actual site content (title tags, meta descriptions, hero copy, FAQ, "Méthode" page) describes a **swimming-pool waterproofing membrane installer** ("pose de membrane PVC armée par thermosoudage pour piscines" — construction, rénovation, étanchéité de piscines), not a window/door joiner. All findings and type recommendations below are based on the actual site content, not the brief's description.

---

## What works

- JSON-LD format used exclusively (no Microdata/RDFa) — matches best practice.
- `@context` is `"https://schema.org"` (HTTPS) on every block.
- All 5 JSON-LD blocks (1 `LocalBusiness` × 4 pages + 1 `FAQPage` on index.html) are syntactically valid JSON — no parse errors.
- `telephone` is in correct E.164 international format (`+33660871651`) and is identical across all 4 pages.
- `PostalAddress` sub-properties (`streetAddress`, `postalCode`, `addressRegion`, `addressCountry`) are present — structurally complete, no missing required sub-fields.
- No placeholder text (e.g. `[Business Name]`) anywhere in the JSON-LD.
- All URLs used (`url`, `image`) are absolute HTTPS URLs, not relative paths.
- `FAQPage` on index.html is structurally correct (`mainEntity` → `Question` → `acceptedAnswer.Answer`) and its 3 Q&As are verbatim identical to the visible `<details class="faq-item">` content on the page — no content mismatch.
- `LocalBusiness` JSON-LD is consistently duplicated (same name/address/phone/areaServed/priceRange) on all 4 pages, which is correct practice for a static multi-page site (each page should carry its own copy, not rely on cross-page linking).

---

## Findings

### 1. NAP inconsistency: `addressLocality` conflicts with `postalCode` — and with the site's own visible footer
**Severity: Critical**

The identical `LocalBusiness` block appears on all 4 pages:

```json
"address": {
  "@type": "PostalAddress",
  "streetAddress": "417 Chemin de la Françoise",
  "postalCode": "26220",
  "addressLocality": "Montélimar",
  "addressRegion": "Auvergne-Rhône-Alpes",
  "addressCountry": "FR"
}
```
(confirmed identical, byte-for-byte, in `index.html` L38-45, `methode.html` L47-54, `realisations.html` L38-45, `contact.html` L38-45)

- **Postal-code mismatch confirmed:** `26220` is the postal code for **Dieulefit**, not Montélimar (Montélimar's codes are `26200` / `26216`). So within the JSON-LD itself, `addressLocality` and `postalCode` point to two different towns.
- **This also contradicts the visible footer on every single page.** The footer (outside the JSON-LD, in the rendered HTML body) reads:
  > `<span>417 Chemin de la Françoise, 26220 Dieulefit</span>`
  (identical on `index.html` L350, `methode.html` L304, `realisations.html` L219, `contact.html` L229)

  So the schema says "Montélimar" while the human-visible footer, right next to the same street address and postal code, says "Dieulefit". This is not just a schema bug — it's a site-wide NAP inconsistency that a user or Google could flag as untrustworthy.
- **It goes further than the address block.** The site's entire visible copy ("hero" eyebrow, meta descriptions, Open Graph descriptions, footer brand blurb) consistently brands the business around **Montélimar** — e.g. `<meta name="description" content="...à Montélimar et dans ses environs...">` (index.html L7) — while only the footer's literal street-address line uses Dieulefit. This suggests "Montélimar" may have been chosen as a recognizable regional hub name for marketing copy, while the *legal/postal* address is actually in Dieulefit.

**Why this matters:** NAP (Name-Address-Phone) consistency across schema, on-page content, and (eventually) the Google Business Profile is a core local-SEO trust signal. A mismatched `addressLocality`/`postalCode` pair can cause Google to reject or distrust the entity for the Local Pack, and a schema-vs-footer mismatch looks like an error to both users and crawlers.

**Recommendation (open question — do not auto-fix):** This needs the owner to confirm which is the correct town for the legal/postal address before touching the schema:
- If **Dieulefit** is correct (supported by the postal code and the footer), change `addressLocality` in all 4 JSON-LD blocks to `"Dieulefit"` and adjust site copy (hero eyebrow, meta/OG descriptions, footer blurb) to match, or explicitly reframe "Montélimar" as a *service-area* reference rather than the registered address.
- If **Montélimar** is legally correct, `postalCode` must become `26200` (or `26216`) and the footer's plain-text address must be corrected to match.

Ready-to-use snippet once confirmed (shown with Dieulefit, since that's what the postal code and footer both support — swap `addressLocality` if the owner confirms Montélimar instead):
```json
"address": {
  "@type": "PostalAddress",
  "streetAddress": "417 Chemin de la Françoise",
  "postalCode": "26220",
  "addressLocality": "Dieulefit",
  "addressRegion": "Auvergne-Rhône-Alpes",
  "addressCountry": "FR"
}
```

---

### 2. Missing `geo` coordinates
**Severity: Medium** (High local-SEO value, but non-blocking — LocalBusiness is valid without it)

No `geo` property exists in any of the 4 `LocalBusiness` blocks. `GeoCoordinates` is a strongly recommended property for local entities (feeds Google Maps / Local Pack precision) but is not required for the JSON-LD to be valid.

**This is an open question — do not invent coordinates**, consistent with the prior audit's decision. Options for the owner: provide a GPS point from a site visit, or confirm the correct town (see Finding #1) so the address can be geocoded accurately — geocoding the wrong town (Montélimar) would produce coordinates ~8km from the real Dieulefit location, compounding the NAP problem.

Ready-to-use snippet (placeholder values — **do not deploy until real coordinates are supplied**):
```json
"geo": {
  "@type": "GeoCoordinates",
  "latitude": "REPLACE_WITH_REAL_LATITUDE",
  "longitude": "REPLACE_WITH_REAL_LONGITUDE"
}
```

---

### 3. Missing `openingHours`
**Severity: Medium**

No `openingHours` or `openingHoursSpecification` property in any of the 4 `LocalBusiness` blocks. This is a recommended property for LocalBusiness that strengthens Local Pack / Knowledge Panel display but is not required for validity.

**Open question — do not invent hours.** Once the owner supplies real hours, prefer the structured `openingHoursSpecification` array format (Google's documented preference) over the shorthand string format, since it's parsed more reliably:

```json
"openingHoursSpecification": [
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "REPLACE_HH:MM",
    "closes": "REPLACE_HH:MM"
  }
]
```
(Adjust `dayOfWeek` array and add a second object if Saturday hours differ, e.g. morning-only.)

---

### 4. `@type: "LocalBusiness"` is too generic for this business
**Severity: Medium**

All 4 pages use the bare `"@type": "LocalBusiness"`. Given the actual business (installation of thermowelded PVC pool-lining membranes — construction/rénovation/étanchéité de piscines), schema.org has no dedicated "pool contractor" type, but **`HomeAndConstructionBusiness`** (a direct, valid subtype of `LocalBusiness`, in the same family as `GeneralContractor`, `RoofingContractor`, `HVACBusiness`) is a materially better semantic fit than the generic top-level type, and is still fully compatible with all the properties currently used (`address`, `areaServed`, `priceRange`, `telephone`, etc.).

**Recommendation:**
```json
{
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "name": "Provence PVC Armé",
  ...
}
```
Apply on all 4 pages, replacing only the `@type` value — everything else in the existing block stays structurally identical.

---

### 5. Single `image`, no `sameAs`, no `@id` — entity consolidation opportunities
**Severity: Low**

- Every page's `LocalBusiness` block uses exactly one image (`https://provencepvcarme.fr/media/feature-1.jpg`). Google's local-business structured-data guidance recommends supplying multiple real photos where available; the site already has many genuine, non-placeholder project photos (`media/after-1.jpg`, `media/coulisses-1.jpg`, etc.) that could populate an `image` array instead of a single string.
- No `sameAs` property links to the business's Google Business Profile, Facebook, Instagram, etc. This is a well-established property for consolidating the entity across platforms and improving Knowledge Panel accuracy, but **requires real profile URLs from the owner — none should be invented.**
- No `@id` is set, so the four duplicated `LocalBusiness` blocks aren't explicitly declared as the same entity (this is a minor point — Google generally still resolves same-URL businesses correctly, but an explicit `@id` is a low-cost improvement).

**Recommendation (image array — ready to use with existing real assets; sameAs — placeholder, needs owner's real URLs):**
```json
{
  "@id": "https://provencepvcarme.fr/#business",
  "image": [
    "https://provencepvcarme.fr/media/feature-1.jpg",
    "https://provencepvcarme.fr/media/after-1.jpg",
    "https://provencepvcarme.fr/media/coulisses-1.jpg"
  ],
  "sameAs": [
    "REPLACE_WITH_GOOGLE_BUSINESS_PROFILE_URL",
    "REPLACE_WITH_FACEBOOK_URL_IF_ANY",
    "REPLACE_WITH_INSTAGRAM_URL_IF_ANY"
  ]
}
```
(merge these fields into the existing block on all 4 pages; drop any `sameAs` entry the business doesn't actually have — do not fill with placeholders in production).

---

### 6. `FAQPage` on index.html — downgrade priority, no current SERP benefit
**Severity: Info**

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [ ... 3 Q&As, verbatim match to visible content ... ]
}
```
(index.html L52-83)

This block is **structurally valid** (correct `Question`/`Answer` nesting, content matches the visible `<details>` FAQ section 1:1 — no violation of Google's "must match visible content" rule). However, per current guidance, **Google retired FAQ rich results for all sites as of May 7, 2026** (extending the Aug 2023 gov/health-only restriction to everyone). As of today (2026-08-11), this markup will not produce a Google SERP rich result.

**Recommendation:** No action required — do not treat as broken, and do not prioritize fixing it. It's safe to leave in place (harmless, structurally correct) as a hedge for any AI/answer-engine consumption, but the site owner should understand it currently yields **no confirmed Google SERP benefit**. Do not invest further effort expanding it under the assumption of rich-result gains.

---

### 7. Missing `BreadcrumbList` — the UI already has breadcrumbs, schema is absent
**Severity: Medium**

`methode.html`, `realisations.html`, and `contact.html` each render a visible breadcrumb trail in the HTML, e.g.:
```html
<p class="breadcrumb"><a href="index.html">Accueil</a> / <span>Méthode</span></p>
```
(methode.html L104; equivalent on realisations.html L95 and contact.html L95)

None of the 4 pages has a corresponding `BreadcrumbList` JSON-LD block. This is a supported Google rich result (breadcrumb trail replacing the raw URL in the search snippet) and the visible UI already provides the exact data needed — this is close to a zero-cost addition.

**Recommendation** (example for methode.html; adapt `item`/`name`/URL per page):
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Accueil",
      "item": "https://provencepvcarme.fr/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Méthode",
      "item": "https://provencepvcarme.fr/methode.html"
    }
  ]
}
```
For `realisations.html`, use `"name": "Réalisations"` / `"item": "https://provencepvcarme.fr/realisations.html"`; for `contact.html`, use `"name": "Contact"` / `"item": "https://provencepvcarme.fr/contact.html"`. Not needed on `index.html` (no breadcrumb rendered there, it's the root).

---

### 8. Missing `Service` schema on methode.html
**Severity: Low**

`methode.html` is a dedicated page describing the installation service ("Notre méthode de pose") in detail (diagnostic, calepinage, thermosoudage, mise en eau) but carries only the generic `LocalBusiness` block, with no `Service` markup describing the offering itself.

**Recommendation** (ready to add alongside the existing `LocalBusiness` block on methode.html; references the business via `provider`):
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Pose de membrane PVC armée par thermosoudage",
  "provider": {
    "@type": "HomeAndConstructionBusiness",
    "name": "Provence PVC Armé",
    "telephone": "+33660871651"
  },
  "areaServed": ["Vaucluse", "Bouches-du-Rhône", "Var", "Drôme", "Gard", "Alpes-de-Haute-Provence", "Hautes-Alpes", "Ardèche"],
  "description": "Diagnostic, calepinage sur mesure, pose et soudure à air chaud d'une membrane PVC armée, contrôle et mise en eau. Construction neuve et rénovation de piscines.",
  "url": "https://provencepvcarme.fr/methode.html"
}
```

---

### 9. No `Review`/`AggregateRating` — correctly absent, flagged only as a future opportunity
**Severity: Info**

No testimonials, star ratings, or review content exist anywhere in the visible HTML of any of the 4 pages, and correspondingly no `Review`/`AggregateRating` schema is present. This is the correct state — **do not add `AggregateRating`/`Review` schema without genuine review data**; fabricated ratings violate Google's structured-data policies and are a manual-action risk.

**Recommendation:** if/when the business collects real Google reviews (once the Google Business Profile referenced in Finding #5 exists), `AggregateRating` can be added to the `LocalBusiness` block using the real `ratingValue`/`reviewCount` pulled from that profile — not before.

---

## Category Score: 60 / 100

**Justification:** The foundation is solid — valid, well-formed JSON-LD in the preferred format is deployed consistently across all 4 pages, with correct phone formatting, complete (if inconsistent) address sub-properties, and a structurally correct FAQ block whose content matches the page. The score is held down by one **Critical** site-wide NAP inconsistency (schema `addressLocality` conflicts with both its own `postalCode` and the visible footer on every page), the intentionally-deferred but still-open `geo`/`openingHours` gaps, a generic `@type` for a specialized construction trade, and several low-cost missed opportunities (`BreadcrumbList`, `Service`, `sameAs`, multi-image) that are ready to implement once the owner supplies the outstanding real-world data (correct town, GPS point, business hours, social/GBP URLs).
