# Content Quality / E-E-A-T Audit — Provence PVC Armé

**Scope:** `index.html`, `methode.html`, `realisations.html`, `contact.html`, `mentions-legales.html`, `confidentialite.html` (all six live HTML files). This is a re-audit; the prior content report (43/100) is preserved at `provencepvcarme.fr-audit-PREVIOUS-20260813\findings\content.md` and is used below as the baseline for what changed.

Business context confirmed from source: PVC-armé pool-membrane installer based in Dieulefit (26220), serving Montélimar and a ~2h radius covering 13 named towns (Montélimar, Nyons, Grignan, Valréas, Vaison-la-Romaine, Orange, Bollène, Pierrelatte, Donzère, Suze-la-Rousse, La Garde-Adhémar, Buis-les-Baronnies, Carpentras) per the `LocalBusiness.areaServed` schema and `contact.html`'s "Réactivité & couverture" section.

## What changed since the last audit (verified)

- **NAP inconsistency resolved.** All four main pages' `LocalBusiness` JSON-LD now sets `"addressLocality": "Dieulefit"` with `"postalCode": "26220"`, matching the visible footer address ("417 Chemin de la Françoise, 26220 Dieulefit") exactly. Previously flagged Critical/High finding — confirmed fixed.
- **Mentions légales and Politique de confidentialité are now real, live pages**, correctly linked from the footer of all six pages (`<a href="mentions-legales.html">` / `<a href="confidentialite.html">`, no more dead `href="#"`). `confidentialite.html` explicitly addresses the photo-upload field in the quote form (name, phone, email, city, optional project photos), states purpose, legal basis (consent), a 12-month retention ceiling, RGPD rights, and a no-cookie statement. `mentions-legales.html` names the publisher (Enzo Oddon, auto-entrepreneur), address, phone, email, hosting (GitHub Pages/GitHub Inc.), IP ownership, and liability limitation. Both pages are also in `sitemap.xml`. Previously flagged Critical finding — substantially fixed, with one remaining gap (see Finding 1 below).
- **1h → 2h radius correction was applied everywhere except two files.** `index.html`, `methode.html`, `realisations.html`, `contact.html` (body copy, meta description, and schema) all consistently say "rayon de 2h" / `~2h`. `mentions-legales.html` and `confidentialite.html` footers still say "rayon d'1h" — see Finding 2 (new).
- **`BreadcrumbList` schema added** on `methode.html`, `realisations.html`, and `contact.html`, matching the visible `Accueil / [Page]` breadcrumb on each. Addresses part of the prior "missing schema types" finding.
- **Service-area content on `contact.html` upgraded from a bare tag list to a descriptive sentence** ("Montélimar et un rayon d'environ 2h au sud : Nyons, Grignan, Valréas..." in the `zones` tab-panel), in addition to the `.zones-list` tags. This is a genuine, if modest, improvement to local-relevance content — see Finding 6 for what's still missing.

## What still works (carried over, re-verified)

- Genuine, specific project photography tied to named villages (La Motte-Chalancon, Pont-de-Barret, Avignon, Poët-Laval), plus the "Coulisses du chantier" gallery naming real materials ("Colle Renolit Alkorglue", géotextile) — still a strong, non-generic Experience signal.
- Technically specific copy (150/100e vs 75/100e, 15–25 years vs 8–10, step-by-step soudure process) — still reads as practitioner-written, not generic AI filler.
- `FAQPage` JSON-LD on `index.html` still mirrors the visible FAQ `<details>` blocks word-for-word — correct practice, re-verified.

## Findings

### 1. SIRET is a visible, unfilled placeholder on a live legal page
**Severity: Critical**
`mentions-legales.html` line 84 reads `<li>Numéro SIRET : [SIRET À COMPLÉTER]</li>`, immediately preceded by an HTML comment `<!-- TODO: ajouter SIRET -->`. This is worse than a silent omission: the page is live, indexed (present in `sitemap.xml`), and displays an obviously incomplete placeholder string to any visitor or crawler. Under French law (LCEN), a commercial site operated by an auto-entrepreneur must publish a real SIRET number in its mentions légales; a bracketed placeholder does not satisfy this and signals an unfinished, untrustworthy page to a reader who does check it.
**Recommendation**: Add the real SIRET number before the site is considered launch-ready, and remove the TODO comment. This is a one-line fix but currently the single most visible trust gap on the site.

### 2. Service-radius inconsistency between legal-page footers and the rest of the site
**Severity: Medium**
`mentions-legales.html` (line 117) and `confidentialite.html` (line 116) footers both still read "...à Montélimar et dans ses environs (rayon d'1h)", while `index.html`, `methode.html`, `realisations.html`, and `contact.html` — in body copy, meta descriptions, and `LocalBusiness` schema — all consistently say "rayon de 2h". The 1h→2h correction referenced in the audit brief was applied everywhere except these two footers, which were presumably added or last touched before the correction. This is a factual self-contradiction visible to anyone who reads both a service page and a legal page, and undermines the same trust signal the NAP fix (now resolved) was protecting.
**Recommendation**: Update both footers to "rayon de 2h" to match the rest of the site. Two-file, two-line fix.

### 3. Content remains thin on every main page, essentially unchanged from the prior audit
**Severity: High**
Re-measured main-content word counts (tags/nav/footer/script stripped, `<main>` only):
- `index.html` (homepage): **385 words** vs. 500-word floor (was 378).
- `methode.html` (service/process page): **470 words** vs. 800-word floor (was 463).
- `realisations.html` (portfolio): **107 words** vs. no fixed floor, but still essentially section headers and one-line photo captions, no case-study narrative (was 103; the new "Coulisses du chantier" gallery added images, not text).
- `contact.html`: **207 words** (was 166; the new service-area sentence and infos-pratiques section added some real content here).
None of the pages meet the topical-coverage floor for their page type, and three of four pages are within single-digit-percent of their prior word count — i.e., no substantive expansion happened between audits despite other site changes (FAQ schema, breadcrumbs, Coulisses section). The coverage gaps flagged previously are still open: no warranty-duration detail, no maintenance-requirements section, no cost-driver explanation, no pool-shape/material compatibility discussion.
**Recommendation**: Unchanged from prior audit — expand `methode.html` with a maintenance/FAQ-on-process section and `realisations.html` into real case studies (size, timeline, challenge, material) targeting 800+ words and 400-500 narrative words respectively.

### 4. Still no credentials, certifications, or insurance disclosure anywhere on the site
**Severity: Critical**
A search across all six HTML files for "RGE", "Qualibat", "assurance", "décennale", "certifi", "RC Pro" returns zero content matches (the only SIRET-adjacent text is the placeholder in Finding 1). Even with mentions légales now live, the page states the publisher is an "entrepreneur individuel (auto-entrepreneur)" but does not state whether the business carries garantie décennale or professional liability insurance, both standard trust expectations for French BTP/pool-waterproofing trades. The homepage's "Garantie étanchéité sur la pose" claim (unchanged) still has no stated duration, insurer, or legal basis.
**Recommendation**: State explicitly whether garantie décennale or an equivalent workmanship warranty applies, with a duration (e.g., "garantie étanchéité 10 ans"), and note any manufacturer installer status (e.g., Renolit/Alkorplan, referenced only implicitly via a photo alt text "Colle Renolit Alkorglue").

### 5. Zero social proof anywhere on the site
**Severity: High**
No testimonials, star ratings, client quotes, Google Reviews embed, or `Review`/`AggregateRating` schema on any of the six pages — confirmed unchanged via search for "avis", "témoignage", "étoile", "Google Reviews", "AggregateRating", "Review" (no matches). For a high-ticket home-improvement purchase this remains the site's weakest Authoritativeness/Trust signal.
**Recommendation**: Unchanged from prior audit — add 3-5 short client quotes (first name + town, matching existing case-study locations) once available, and/or embed real Google reviews.

### 6. Listed service-area towns and the towns actually shown in project photos don't overlap
**Severity: Medium**
The `LocalBusiness.areaServed` schema and `contact.html`'s service-area list name 13 towns: Montélimar, Nyons, Grignan, Valréas, Vaison-la-Romaine, Orange, Bollène, Pierrelatte, Donzère, Suze-la-Rousse, La Garde-Adhémar, Buis-les-Baronnies, Carpentras. The real project locations shown in `realisations.html` and `methode.html` photo captions are: La Motte-Chalancon, Pont-de-Barret, Avignon, Poët-Laval, Saint-Restitut, Dieulefit, and Grignan. Only Grignan appears in both lists. This means the site's structured local-relevance signal (the 13-town `areaServed` list, which is what Google/LLMs parse for local intent matching) is not backed by any visible proof of work in 12 of those 13 towns, while 6 of the 7 towns with genuine documented project photos aren't part of the declared service-area list at all. This is a content-alignment gap, not a fabrication — the mismatch is a missed opportunity to use real, existing project evidence to substantiate the declared coverage area.
**Recommendation**: Either add the real project towns (La Motte-Chalancon, Pont-de-Barret, Poët-Laval, Saint-Restitut, Dieulefit) to the `areaServed` list if they genuinely fall within the 2h radius, or add a short sentence/caption connecting a couple of the 13 declared towns to specific completed projects, if such projects exist. Do not add towns to either list without a real, verifiable project or service basis.

### 7. Portfolio page still has no narrative depth
**Severity: High**
`realisations.html` still contains only `<figcaption>` labels (3-6 words, e.g. "Pont-de-Barret · PVC gris clair") for its 4 before/after pairs, plus 7 "Coulisses du chantier" images (added since the prior audit) that carry only `alt` text, no paragraph copy. No pool size, project duration, technical challenge, or client need is described for any project — unchanged from the prior audit despite the Coulisses section being new.
**Recommendation**: Unchanged from prior audit — add 2-3 sentence case-study blurbs to the featured before/after pairs.

### 8. FAQ is still shallow (3 questions)
**Severity: Medium**
`index.html`'s FAQ section and matching `FAQPage` schema are unchanged: what is PVC armé, lifespan, and renovation handling. Still missing: cost drivers, seasonal/timing constraints, maintenance requirements, compatibility with pool shapes/materials already offered in `contact.html`'s "Type de piscine" dropdown (béton, coque polyester, bois/acier), what happens if a leak appears post-installation, and PVC armé vs. tiling/mosaic.
**Recommendation**: Unchanged from prior audit — expand to 8-10 questions, keep mirroring the JSON-LD exactly.

### 9. Still no pricing signal beyond a placeholder schema value
**Severity: Medium**
`contact.html` still deliberately withholds pricing, and `LocalBusiness.priceRange` is still the generic `"€€"` placeholder across all four main pages. No quotable price anchor exists for users or AI assistants.
**Recommendation**: Unchanged from prior audit — add at least an indicative range or cost-driver explanation.

### 10. Duplicate "Finitions" content block between homepage and méthode page
**Severity: Low**
The three finish-folder cards (Effet Pierre de Bali, Effet Pierre naturelle, Unis), with identical images and identical `alt` text, still appear verbatim in both `index.html` (lines ~205-235) and `methode.html` (lines ~254-284) — unchanged from the prior audit.
**Recommendation**: Unchanged from prior audit — trim the homepage instance to 1-2 thumbnails linking to `methode.html#finitions`.

### 11. Weak/generic H1 on the portfolio page
**Severity: Low**
`realisations.html`'s `<h1>` is still "Avant / Après" — no mention of "PVC armé", "piscine", or a location, despite the title tag being "Nos réalisations avant/après | Provence PVC Armé". Unchanged from the prior audit.
**Recommendation**: Unchanged — change to something like "Réalisations PVC armé : avant / après".

### 12. HowTo schema still missing for the documented 4-step process
**Severity: Medium**
`BreadcrumbList` schema was added (see "What changed" above), but `methode.html`'s 4-step numbered process (`<ol class="process">`: diagnostic → calepinage → soudure → mise en eau) still has no matching `HowTo` schema — confirmed via search, no `HowTo` type found anywhere on the site. This remains a low-effort, high-value gap for AI citation readiness since the content already exists in structured, extractable form.
**Recommendation**: Add `HowTo` schema for the process section in `methode.html`.

### 13. Undefined jargon term used before its explanation
**Severity: Low**
`methode.html`'s heading "La soudure thermique, **lé après lé**" still precedes the first contextual clarification of "lé" by two sentences ("Chaque lé de membrane est chauffé..."). Unchanged from the prior audit.
**Recommendation**: Unchanged — add a short inline gloss on first use.

### 14. Sitemap `lastmod` for main pages does not reflect the most recent content commits
**Severity: Low**
`sitemap.xml` shows `lastmod` of `2026-08-09` for `index.html`, `methode.html`, `realisations.html`, and `contact.html`, but the git history shows content-affecting commits after that date (e.g., "Ajoute la section 'Coulisses du chantier' sur la page réalisations", "Reveal des titres au scroll + correction et amélioration des photos avant/après", and the most recent commit which both adds `FAQPage` schema to the homepage and claims to update sitemap `lastmod`). Only `mentions-legales.html` and `confidentialite.html` show a later date (`2026-08-12`). This is a freshness-signal accuracy gap worth fixing alongside the technical/sitemap audit; flagged here for completeness since it affects the "content freshness" dimension of this audit, not for re-litigation of the full sitemap mechanics (see `sitemap.md`).
**Recommendation**: Ensure `lastmod` values are updated to match the actual date of the most recent content-affecting change on each URL.

## Category score: 51/100

Two previously Critical findings are resolved (dead mentions légales/confidentialité links now real and substantive; the NAP contradiction between schema and footer is fixed), which measurably improves the Trustworthiness dimension (30% weight) that was dragging the prior score down. However, the improvement is capped by: a newly-visible, unfilled SIRET placeholder live on the mentions légales page; a new small but real 1h/2h inconsistency introduced by an incomplete rollout of the radius correction; and every other finding from the prior audit (thin content on all four main pages, zero credentials/insurance disclosure, zero social proof, caption-only portfolio, shallow FAQ, no pricing signal, duplicate finitions block) remaining open and essentially unchanged in scale. Experience signals remain genuinely above-average (real project photos, specific technical copy), but Expertise and Authoritativeness are unchanged from the prior audit, and Trustworthiness — while improved — is still held back by the live SIRET placeholder and the absence of any insurance/certification statement.
