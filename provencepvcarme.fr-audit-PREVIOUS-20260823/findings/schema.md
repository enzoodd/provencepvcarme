# Schema.org Audit — Provence PVC Armé

**Scope:** index.html, methode.html, realisations.html, contact.html (4 pages, static site).
**Method:** Direct read of source HTML on disk (`C:\Users\oddon\Desktop\provencepvcarme`) + manual JSON-LD parse/structural validation. All 8 JSON-LD blocks across the 4 pages (2 per page: `LocalBusiness` + either `FAQPage` or `BreadcrumbList`) are syntactically valid JSON — braces/brackets balanced, no trailing commas, no unescaped control characters.
**Baseline:** compared against the previous audit (`provencepvcarme.fr-audit-PREVIOUS-20260813/findings/schema.md`, score 60/100) to confirm what has changed since `openingHoursSpecification` was added and the 2h intervention radius was corrected.

---

## What changed since the last audit (verified)

- **NAP Critical issue is RESOLVED.** `addressLocality` is now `"Dieulefit"` in all 4 `LocalBusiness` blocks (index.html L42, methode.html L51, realisations.html L42, contact.html L42), matching `postalCode: "26220"` and the visible footer text (`417 Chemin de la Françoise, 26220 Dieulefit`, identical on all 4 pages). No more schema-vs-footer contradiction.
- **`openingHoursSpecification` is now present** on all 4 pages, identical block: `Monday`–`Saturday`, `08:00`–`18:00`. Structurally correct (`OpeningHoursSpecification` type, `dayOfWeek` array, `opens`/`closes` in `HH:MM`).
- **`BreadcrumbList` has been added** to methode.html, realisations.html and contact.html (2-level trail: Accueil → current page), matching the visible `<p class="breadcrumb">` UI on each page 1:1. Correctly omitted on index.html (no breadcrumb rendered there — it's the site root).
- **The "rayon de 2h" correction is reflected in the JSON-LD `description` field** on all 4 pages (`"...à Montélimar et dans ses environs (rayon de 2h)."`), consistent with the visible hero eyebrow, meta description, and the contact page's "Rayon d'intervention ~2h" stat.

These fixes remove the previous Critical finding and two of the four previous Medium findings. What's below covers what's still open, plus a fresh full pass on completeness, NAP, and type precision as requested.

---

## Detection results

| Page | Block 1 | Block 2 |
|---|---|---|
| index.html | `LocalBusiness` (L30-58) | `FAQPage` (L60-91) |
| methode.html | `LocalBusiness` (L39-67) | `BreadcrumbList` (L69-78) |
| realisations.html | `LocalBusiness` (L30-58) | `BreadcrumbList` (L60-69) |
| contact.html | `LocalBusiness` (L30-58) | `BreadcrumbList` (L60-69) |

No Microdata or RDFa detected anywhere. `@context` is `"https://schema.org"` (HTTPS) on all 8 blocks. All URLs used (`url`, `image`, breadcrumb `item`) are absolute HTTPS URLs.

---

## Validation results (pass/fail per block)

| Block | Syntax | Required props | Notes |
|---|---|---|---|
| `LocalBusiness` × 4 | ✅ Pass | ✅ Pass (`name`, `address` present) | Valid but generic `@type`; `geo` still absent (see Finding 1) |
| `FAQPage` (index.html) | ✅ Pass | ✅ Pass (`mainEntity`/`Question`/`acceptedAnswer`/`Answer` correctly nested) | Content matches visible `<details>` 1:1. No Google SERP benefit (see Finding 5) |
| `BreadcrumbList` × 3 | ✅ Pass | ✅ Pass (`position`, `name`, `item` on every `ListItem`) | Matches visible breadcrumb UI |

No parse errors, no placeholder text (e.g. `[Business Name]`), no relative URLs, no non-ISO dates (none of the current blocks use date fields).

---

## Findings

### 1. Missing `geo` (GeoCoordinates) on all 4 `LocalBusiness` blocks
**Severity: High**

No `geo` property exists in any of the 4 `LocalBusiness` blocks (confirmed by full-text read of index.html, methode.html, realisations.html, contact.html — the property is absent from every block). `GeoCoordinates` is not required for JSON-LD validity, but for a local trade business whose entire value proposition is a defined service radius ("rayon de 2h"), it is one of the highest-leverage properties for Google Maps / Local Pack precision and for disambiguating the business location independent of address-string parsing.

You flagged this as a point you need to correct — confirming: **it is still absent** and should be added.

**Do not invent coordinates.** The address (417 Chemin de la Françoise, 26220 Dieulefit) must be geocoded from a real source (a GPS pin dropped at the actual property, or the coordinates shown for that exact address in the Google Business Profile once set up — not a generic "Dieulefit town center" lookup, which would place the pin the wrong side of town).

Ready-to-use snippet — **replace the two placeholder values with real, verified coordinates before deploying**, then merge into the existing `address` sibling in the block on all 4 pages:
```json
"geo": {
  "@type": "GeoCoordinates",
  "latitude": "REPLACE_WITH_VERIFIED_LATITUDE",
  "longitude": "REPLACE_WITH_VERIFIED_LONGITUDE"
}
```

---

### 2. `@type: "LocalBusiness"` is too generic for this business
**Severity: Medium**

All 4 pages still use the bare `"@type": "LocalBusiness"` (index.html L33, methode.html L42, realisations.html L33, contact.html L33). Schema.org has no dedicated "pool contractor" type, but **`HomeAndConstructionBusiness`** — a direct, valid subtype of `LocalBusiness` in the same family as `GeneralContractor`, `RoofingContractor`, `HVACBusiness` — is a materially more precise semantic fit for a business that installs thermowelded pool waterproofing membranes (construction/rénovation/étanchéité de piscines). It's fully compatible with every property currently used (`address`, `areaServed`, `priceRange`, `telephone`, `openingHoursSpecification`, etc.) — this is a drop-in `@type` swap, no restructuring needed.

**Recommendation** (apply on all 4 pages, changing only the `@type` value):
```json
{
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "name": "Provence PVC Armé",
  "url": "https://provencepvcarme.fr/",
  "image": "https://provencepvcarme.fr/media/feature-1.jpg",
  "description": "Spécialiste de la pose de membrane PVC armée par thermosoudage pour piscines. Construction, rénovation et étanchéité à Montélimar et dans ses environs (rayon de 2h).",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "417 Chemin de la Françoise",
    "postalCode": "26220",
    "addressLocality": "Dieulefit",
    "addressRegion": "Auvergne-Rhône-Alpes",
    "addressCountry": "FR"
  },
  "areaServed": ["Montélimar", "Nyons", "Grignan", "Valréas", "Vaison-la-Romaine", "Orange", "Bollène", "Pierrelatte", "Donzère", "Suze-la-Rousse", "La Garde-Adhémar", "Buis-les-Baronnies", "Carpentras"],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "08:00",
      "closes": "18:00"
    }
  ],
  "priceRange": "€€",
  "telephone": "+33660871651"
}
```

---

### 3. No `sameAs`, single `image`, no `@id` — entity consolidation still open
**Severity: Low**

- Every page's `LocalBusiness` block still uses exactly one image (`https://provencepvcarme.fr/media/feature-1.jpg`). The site already has many genuine, non-placeholder project photos (`media/after-1.jpg` … `after-4.jpg`, `media/coulisses-1.jpg` … `coulisses-3.jpg`) that could populate an `image` array instead of a single string.
- No `sameAs` links to a Google Business Profile, Facebook, Instagram, etc. This requires real profile URLs from the owner — none should be invented.
- No `@id` is set, so the 4 duplicated `LocalBusiness` blocks aren't explicitly declared as the same entity. Minor — Google generally still resolves same-name/same-address businesses correctly — but a low-cost improvement.

**Recommendation** (image array is ready to use with existing real assets; `sameAs` is a placeholder pending the owner's real URLs — drop any entry the business doesn't actually have, do not fill with placeholders in production):
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
(merge these fields into the existing block on all 4 pages)

---

### 4. Missing `Service` schema on methode.html
**Severity: Low**

`methode.html` is a dedicated page describing the installation service in detail (diagnostic, calepinage, thermosoudage, mise en eau — L122-246) but still carries only the generic `LocalBusiness`/`BreadcrumbList` pair, with no `Service` markup describing the offering itself.

**Recommendation** (add alongside the existing blocks on methode.html; references the business via `provider`):
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
  "areaServed": ["Montélimar", "Nyons", "Grignan", "Valréas", "Vaison-la-Romaine", "Orange", "Bollène", "Pierrelatte", "Donzère", "Suze-la-Rousse", "La Garde-Adhémar", "Buis-les-Baronnies", "Carpentras"],
  "description": "Diagnostic, calepinage sur mesure, pose et soudure à air chaud d'une membrane PVC armée, contrôle et mise en eau. Construction neuve et rénovation de piscines.",
  "url": "https://provencepvcarme.fr/methode.html"
}
```

---

### 5. `FAQPage` on index.html — no current Google SERP benefit
**Severity: Info**

Still present, unchanged, still structurally valid (index.html L60-91) and its 3 Q&As still match the visible `<details class="faq-item">` content verbatim. Per current guidance, Google retired FAQ rich results for all sites — this markup produces no Google SERP rich result. Safe to leave in place; no action required, and it should not be prioritized or expanded on the assumption of rich-result gains.

---

### 6. No `Review`/`AggregateRating` — correctly absent
**Severity: Info**

No testimonials, star ratings, or review content exist in the visible HTML of any page, and correspondingly no `Review`/`AggregateRating` schema is present. This is the correct state — **do not add fabricated ratings**, that's a manual-action risk. If/when the business collects real Google reviews (once the Google Business Profile referenced in Finding 3 exists), `AggregateRating` can be added using the real `ratingValue`/`reviewCount` pulled from that profile.

---

## NAP consistency check

| Field | index.html | methode.html | realisations.html | contact.html | Footer (all pages) | Consistent? |
|---|---|---|---|---|---|---|
| `name` | Provence PVC Armé | Provence PVC Armé | Provence PVC Armé | Provence PVC Armé | Provence PVC Armé | ✅ |
| `streetAddress` | 417 Chemin de la Françoise | same | same | same | same | ✅ |
| `postalCode` | 26220 | same | same | same | same | ✅ |
| `addressLocality` | Dieulefit | Dieulefit | Dieulefit | Dieulefit | Dieulefit | ✅ (previously Critical mismatch — now resolved) |
| `telephone` | +33660871651 | same | same | same | 06 60 87 16 51 / tel:+33660871651 | ✅ (E.164 in schema, human format in footer/CTA, `tel:` link matches schema exactly) |

No remaining NAP inconsistency detected across schema blocks, footer, meta descriptions, or hero copy.

---

## Missing schema opportunities (summary)

| Opportunity | Priority | Status |
|---|---|---|
| `geo` (GeoCoordinates) on `LocalBusiness` | High | Missing — needs owner-verified coordinates |
| More specific `@type` (`HomeAndConstructionBusiness`) | Medium | Missing — drop-in change, ready to deploy |
| `Service` schema on methode.html | Low | Missing — ready to deploy |
| `sameAs` (GBP/social) | Low | Missing — needs owner's real URLs |
| Multi-image `image` array | Low | Missing — ready to deploy with existing assets |
| `@id` for entity consolidation | Low | Missing — ready to deploy |
| `BreadcrumbList` on all non-home pages | — | ✅ Done (methode, realisations, contact) |
| `openingHoursSpecification` | — | ✅ Done |
| NAP consistency (schema ↔ footer) | — | ✅ Done |
| `AggregateRating`/`Review` | Info | Correctly absent — do not add without real data |
| `FAQPage` | Info | Present, valid, no SERP benefit — leave as-is |

---

## Category Score: 80 / 100

**Justification:** Up from 60/100. The previous **Critical** NAP inconsistency (schema `addressLocality` conflicting with `postalCode` and the visible footer) is fully resolved and confirmed consistent across all 4 pages. `openingHoursSpecification` and `BreadcrumbList` — both previously Medium findings — are now correctly implemented and structurally valid. All 8 JSON-LD blocks across the site remain syntactically valid, in the preferred JSON-LD format, with HTTPS `@context`, absolute URLs, correct E.164 phone formatting, and no placeholder text. The remaining gap holding the score below 90 is the missing `geo`/`GeoCoordinates` property (High — needs owner-verified coordinates, do not invent), a generic `@type` for a specialized construction trade (Medium, ready to deploy), and a handful of low-cost, ready-to-implement opportunities (`Service` on methode.html, `sameAs`, multi-image, `@id`) that are pending either a straightforward code change or real-world data (GPS point, social/GBP URLs) from the owner.
