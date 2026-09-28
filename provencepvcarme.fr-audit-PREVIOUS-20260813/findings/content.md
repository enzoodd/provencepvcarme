# Content Quality / E-E-A-T Audit — Provence PVC Armé

Scope: `index.html`, `methode.html`, `realisations.html`, `contact.html` (French, pre-launch, no live search data). Site is a PVC-armé pool-membrane installer near Montélimar/Dieulefit (Drôme) — note this differs from the "menuisier fenêtres/portes" framing in the brief; the actual business is pool waterproofing/re-lining, and this audit evaluates the site as built.

## What works

- **Genuine, specific project photography**: real before/after pairs tied to named villages (La Motte-Chalancon, Pont-de-Barret, Avignon, Poët-Laval) plus a "Coulisses du chantier" behind-the-scenes gallery naming actual materials ("Colle Renolit Alkorglue", géotextile) — concrete first-hand experience signals, not stock imagery.
- **Technically specific, non-generic copy**: thickness (150/100e vs 75/100e for standard liner), lifespan (15–25 years vs 8–10), welding process described step by step — reads like someone who actually does the work, not AI boilerplate.
- **FAQPage JSON-LD mirrors the visible FAQ exactly** (verified: the 3 questions/answers in `index.html`'s `<details>` blocks are word-for-word identical to the JSON-LD `mainEntity` — this is correct practice and avoids a schema/content mismatch penalty).
- **Good scannability**: short paragraphs, icon-led "why us" cards, a clear comparison table (liner classique vs. membrane PVC armée), a numbered 4-step process list — solid structure for both human skimming and AI extraction.
- **Honest pricing stance**: contact.html explicitly states no generic price is shown because "chaque bassin est différent" — a defensible trust choice rather than an oversight, provided it's paired with more supporting content (see findings below).

## Findings

### 1. Content is thin on every page relative to page-type minimums
**Severity: High**
Extracted-text word counts (main content only, tags/nav/footer stripped):
- `index.html` (homepage): **378 words** vs. 500-word floor.
- `methode.html` (functions as the service/process page): **463 words** vs. 800-word floor for service pages.
- `realisations.html` (portfolio): **103 words** — essentially section headers plus one-line photo captions ("La Motte-Chalancon · PVC Pierre de Bali"), no case-study narrative.
- `contact.html`: **166 words** (more tolerable for a utility/contact page, but still short of what's needed to carry trust content).
None of the four pages meet the topical-coverage floor for their page type. This isn't just a word-count problem — it reflects genuinely shallow coverage of things a prospective customer (or an LLM) would want to know: warranty terms, timeline variability by pool type, maintenance requirements, compatibility with different pool shapes/materials, cost drivers.
**Recommendation**: Expand `methode.html` with a maintenance/care section and an FAQ on the process itself; expand `realisations.html` into real case studies (pool size, timeline, specific challenge, material chosen) instead of caption-only entries. Target 800+ words on methode.html and at least 400-500 words of narrative on realisations.html.

### 2. No credentials, certifications, or insurance disclosure anywhere on the site
**Severity: Critical**
A `grep` across all four HTML files for "SIRET", "RGE", "Qualibat", "assurance", "décennale", "certifi" returns zero content matches (only unrelated CSS-class hits like `.margelle`). For a French BTP/construction trade — where garantie décennale (10-year structural insurance) is a legal and customer-expectation baseline — this is a significant Expertise/Trust gap. The homepage claims "Garantie étanchéité sur la pose" (methode.html / index.html "Pourquoi nous choisir" card) but never states a duration, insurer, or legal basis for that guarantee.
**Recommendation**: Add a visible SIRET/RCS number (French legal requirement for commercial sites, see Finding 4), state whether the business carries garantie décennale or a specific product/workmanship warranty with an explicit duration (e.g., "garantie étanchéité 10 ans"), and mention any manufacturer certification (e.g., Renolit/Alkorplan installer status, referenced only implicitly today via the "Colle Renolit Alkorglue" photo alt text).

### 3. "Mentions légales" and "Politique de confidentialité" are dead placeholder links
**Severity: Critical**
Footer on all four pages: `<a href="#">Mentions légales</a>` and `<a href="#">Politique de confidentialité</a>` — both point to `#`, not real pages. Under French law (LCEN), a commercial website must publish mentions légales (company name, SIRET, publication director, host). More urgently, `contact.html` runs a lead form that collects name, phone, email, city, and optional **uploaded photos of the customer's property** (`<input type="file" name="photos" accept="image/*" multiple>`) with no linked privacy policy explaining data handling — a GDPR compliance gap as well as a trust signal gap.
**Recommendation**: Publish real mentions légales and a privacy policy before launch (not optional for a French commercial site with a data-collecting form), and link them from the footer.

### 4. NAP inconsistency between structured data and visible content
**Severity: High**
All four pages' visible footer text says "417 Chemin de la Françoise, **26220 Dieulefit**" (consistent across pages), but the `LocalBusiness` JSON-LD on every page sets `"addressLocality": "Montélimar"` with the same `"postalCode": "26220"` — 26220 is Dieulefit's postal code, not Montélimar's. This was already flagged in the prior technical audit (`seo-audit.md`, line 24) as unresolved. From a content-trust standpoint this matters because structured data is what LLMs, Google's Knowledge Graph, and aggregators (Google Business Profile matching, data brokers) parse first — an internally contradictory NAP undermines trustworthiness signals even though the human-readable footer is correct.
**Recommendation**: Fix `addressLocality` to "Dieulefit" (or confirm the legal registered address is genuinely Montélimar and change the footer instead) across all four schema blocks. This is a one-line, four-file fix with outsized trust impact.

### 5. Zero social proof anywhere on the site
**Severity: High**
No testimonials, star ratings, client quotes, Google Reviews embed, or `Review`/`AggregateRating` schema on any page. For a considered, high-ticket home-improvement purchase (pool renovation), the near-total absence of third-party validation is a meaningful Authoritativeness/Trust gap — Google's Sept 2025 QRG explicitly treats external validation as a marker of real-world reputation, and this is the site's weakest E-E-A-T dimension.
**Recommendation**: Once the business has completed jobs, add at least 3-5 short client quotes (with first name + town, matching the existing case-study locations) and/or embed real Google reviews. This can be phased in post-launch but should be planned for now.

### 6. Portfolio page has no narrative depth — captions only, no case studies
**Severity: High**
`realisations.html` contains 8 before/after photo pairs and 7 "coulisses" photos, but the only text per project is a 3-6 word `<figcaption>` (e.g., "Pont-de-Barret · PVC gris clair") and image `alt` text. There is no description of pool size, project duration, specific technical challenge, or client need for any of the 11+ projects shown — a missed opportunity to simultaneously fix the thin-content problem (Finding 1) and strengthen the Experience signal with concrete, verifiable detail an LLM or reader could cite.
**Recommendation**: Add 2-3 sentence case-study blurbs to at least the 4 featured before/after pairs: pool dimensions, why the client chose PVC armé vs. alternatives, finish selected, and timeline.

### 7. FAQ is very shallow (3 questions) for a technical, high-consideration purchase
**Severity: Medium**
`index.html`'s FAQ section (and matching FAQPage schema) covers only: what is PVC armé, lifespan, and whether renovation is handled. Missing entirely: cost factors/what drives the price, seasonal/timing constraints (can it be installed in winter?), maintenance requirements once installed, compatibility with existing pool shapes/materials (concrete, coque polyester, bois/acier — all offered as form options in `contact.html`'s "Type de piscine" dropdown, yet none are addressed in the FAQ), what happens if a leak appears after installation, and how PVC armé compares to tiling/mosaic (not just to classic liner).
**Recommendation**: Expand to 8-10 questions covering the gaps above; keep mirroring the FAQPage JSON-LD exactly as is currently done correctly.

### 8. No pricing transparency beyond a generic `priceRange: "€€"` schema value
**Severity: Medium**
`contact.html` deliberately withholds pricing ("nous préférons un chiffrage juste plutôt qu'un prix générique affiché") — a legitimate business choice, but it leaves zero quotable price signal anywhere, including for AI assistants that get asked "combien coûte une rénovation de piscine en PVC armé". The LocalBusiness schema's `"priceRange": "€€"` is a placeholder, not real data.
**Recommendation**: Add at least an indicative range (e.g., "à partir de X €/m² pour une rénovation standard, devis personnalisé après diagnostic") to give both users and AI systems a factual anchor without committing to a fixed quote.

### 9. Duplicate "Finitions" content block between homepage and méthode page
**Severity: Low**
The three finish-folder cards (Effet Pierre de Bali, Effet Pierre naturelle, Unis) with identical images and identical `alt` text appear verbatim in both `index.html` (lines ~195-225) and `methode.html` (lines ~233-263). This is on-site duplication, not a canonicalization risk (different URLs, different surrounding copy), but it inflates the site's apparent content volume without adding unique topical coverage — the finish detail belongs primarily on `methode.html`, with the homepage instead linking out to it (as it already does via "Voir toutes les finitions").
**Recommendation**: Trim the homepage instance to 1-2 representative finish thumbnails with a link to `methode.html#finitions`, rather than repeating the full block.

### 10. Weak/generic H1 on the portfolio page
**Severity: Low**
`realisations.html`'s `<h1>` is simply "Avant / Après" — no mention of "PVC armé", "piscine", or a location, despite the page title tag being "Nos réalisations avant/après | Provence PVC Armé". This is a missed semantic-relevance and AI-extraction opportunity (an LLM summarizing the page's `<h1>` alone would get no topical signal).
**Recommendation**: Change to something like "Réalisations PVC armé : avant / après" to align H1 with title tag and topic.

### 11. Service-area content is a tag list, not substantive geo coverage
**Severity: Medium**
The 8 covered départements (Vaucluse, Bouches-du-Rhône, Var, Drôme, Gard, Alpes-de-Haute-Provence, Hautes-Alpes, Ardèche) appear only as unstyled `<span>` tags in `contact.html`'s `.zones-list`, with no descriptive sentence about any of them. Town-level detail exists only incidentally, as one-line photo captions (Avignon, Grignan, Saint-Restitut, Dieulefit, Poët-Laval). For a business explicitly serving a 1-hour radius across 8 départements, there's no content actually describing that service area beyond the tag list — a thin-coverage gap for local relevance.
**Recommendation**: Add 2-3 sentences describing the service area and travel policy, and consider surfacing the town names that already appear in photo captions as a short, real (not fabricated) list of towns where projects have been completed. This is distinct from — and should not replace — dedicated location pages, which would fall under programmatic-page guidance if built at scale.

### 12. Missing schema types that match already-existing structured content
**Severity: Medium**
`methode.html`'s 4-step numbered process (`<ol class="process">`: diagnostic → calepinage → soudure → mise en eau) is a ready-made `HowTo` schema candidate that isn't marked up. Similarly, three of four pages render a visible breadcrumb (`Accueil / Méthode`, etc.) with no matching `BreadcrumbList` JSON-LD. Both are low-effort, high-value additions for AI citation readiness (structured, extractable process steps) and are consistent with content that already exists — no new copy required.
**Recommendation**: Add `HowTo` schema for the process section and `BreadcrumbList` schema matching the visible breadcrumbs on methode/realisations/contact.

### 13. Undefined jargon term used before its explanation
**Severity: Low**
`methode.html`'s section heading reads "La soudure thermique, **lé après lé**" (line ~155) before "lé" (a strip/width of membrane material) is ever defined; the term is only made contextually clear two sentences later ("Chaque lé de membrane est chauffé..."). A first-time reader unfamiliar with pool-lining trade vocabulary may momentarily lose the thread.
**Recommendation**: Add a 3-4 word inline gloss on first use (e.g., "lé (bande de membrane)") or fold a definition into the existing FAQ.

### 14. Sitemap `lastmod` bumped without corresponding content change
**Severity: Info**
Flagged for context, not re-litigated here: the prior technical audit (`seo-audit.md`, line 45) notes `lastmod` was mechanically updated to 2026-08-09 across all four sitemap URLs as part of adding FAQ schema — a legitimate change, but a pattern of bumping `lastmod` without proportional content change will erode Google's trust in the freshness signal over time. Worth keeping in mind as more of the findings above get addressed (those *would* legitimately justify a `lastmod` bump).

## Category score: 43/100

The site shows authentic, specific experience (real project photos, real material names, non-generic technical copy) and clean structure, but every page falls short of topical-coverage floors, there is no social proof or credential/insurance disclosure anywhere, the legal/privacy footer links are non-functional, and the schema NAP contradicts the visible address — collectively these pull Trustworthiness and Authoritativeness (55% of the weighted E-E-A-T model) down enough to cap the overall score in the low-to-mid 40s despite genuinely above-average Experience signals.
