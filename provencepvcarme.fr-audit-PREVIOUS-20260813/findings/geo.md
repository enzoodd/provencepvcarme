# GEO / AI Search Readiness Audit — Provence PVC Armé

Site audited: static French local-business site for a swimming-pool waterproofing membrane installer ("PVC armé" = reinforced/welded PVC pool liner), pages: `index.html`, `methode.html`, `realisations.html`, `contact.html`. Domain `provencepvcarme.fr` does not yet resolve (pre-launch), so no live AI-visibility data (ChatGPT/Perplexity citation checks, DataForSEO) is available. This audit is purely structural: how citable, extractable, and entity-clear the content will be once the site is crawlable.

**Confirmed business:** the analysis below is based on the actual site content — Provence PVC Armé is a swimming-pool waterproofing membrane installer ("pose de membrane PVC armée par thermosoudage pour piscines" — construction, rénovation, étanchéité de piscines, Montélimar et environs, rayon d'1h). It is not a window/door (menuiserie) company. That said, "PVC armé" as a bare term is far more commonly used in French to describe reinforced-PVC window/door frames than pool membranes — this naming overlap is a real disambiguation risk for LLMs with no other grounding for the brand, analyzed in Finding "Entity name collides with a much more common French term" below.

## What works

- All four pages are plain server-rendered HTML with the full text present in the raw document — no CSR/SPA shell, no JS required to reveal body content. This is close to ideal for AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot) that may not execute JavaScript.
- `robots.txt` uses a simple `User-agent: * / Allow: /` — nothing blocks any AI crawler today, and a `Sitemap:` directive is present and correct.
- The homepage FAQ is implemented as native `<details>/<summary>` (crawlable without JS) **and** mirrored exactly in a `FAQPage` JSON-LD block (index.html lines 52–83 vs. 298–309) — text is verbatim-identical between the visible HTML and the schema, which is the correct pattern for AI-citation reliability.
- `LocalBusiness` JSON-LD is present and identical on all four pages (name, phone, address fields, `areaServed` listing 8 départements, `priceRange`), giving a consistent machine-readable entity block sitewide.
- Several passages are short, self-contained, and factual — well suited to being lifted verbatim: material thickness ("150/100e (1,5 mm) — deux fois plus épais qu'un liner classique (75/100e)"), lifespan comparison ("15 à 25 ans... contre 8 à 10 ans"), response time ("Moins de 24h pour recevoir une première réponse"), and coverage area ("8 départements couverts autour de Montélimar : Vaucluse, Bouches-du-Rhône...").
- `methode.html`'s liner-vs-PVC-armé comparison (`compare-grid`, two `<ul>` lists) is effectively a ready-made comparison table — a format LLMs favor for extraction.
- The Three.js membrane cross-section on `methode.html` pairs its visual with real DOM text labels ("PVC souple côté eau", "Armature polyester tissée", "PVC souple côté support"), so the diagram's key facts remain readable even without rendering the canvas.
- Canonical tags, OG/Twitter meta, and a valid `sitemap.xml` with `lastmod` dates are present on every page.

## Findings

### 1. NAP inconsistency: schema says "Montélimar", real address is Dieulefit
**Severity:** High
**Evidence:** The `LocalBusiness` JSON-LD on every page (index.html:38–45, methode.html:47–54, realisations.html:38–45, contact.html:38–45) sets `"addressLocality": "Montélimar"` with `"postalCode": "26220"` — but 26220 is Dieulefit's postal code, not Montélimar's (Montélimar is 26200/26216). The visible footer text on every page correctly states "417 Chemin de la Françoise, 26220 Dieulefit". Titles and meta descriptions also uniformly say "à Montélimar et dans ses environs" rather than Dieulefit.
**Recommendation:** Fix `addressLocality` to "Dieulefit" (or otherwise correct the postal code) so the schema, the visible NAP, and the Google Business Profile the site will eventually link to all agree. Local-entity resolution (both classic local SEO and AI engines cross-checking Google Business Profile / Wikipedia / Bing Places against on-page schema) depends on exact NAP consistency; a locality/postal-code mismatch is a concrete, easily-checked contradiction that undermines trust in every other fact on the page. If "Montélimar" is intentionally used as a bigger recognizable hub for targeting purposes, keep that language in prose/meta but make the structured-data `address` match the real registered address, and consider adding Dieulefit explicitly in the body copy so both are legible to a model.

### 2. Entity name collides with a much more common French term
**Severity:** High
**Evidence:** In French building/trade usage, "PVC armé" overwhelmingly refers to reinforced-PVC window and door frames (menuiserie), not swimming-pool membranes (which the trade normally calls "membrane armée" or "liner armé"). The business is named "Provence PVC Armé" and uses "PVC armé" as its primary keyword throughout titles, meta, and headings, but with zero disambiguating anchors (no Wikipedia entry, no Reddit threads, no YouTube channel, no LinkedIn company page — footer has no social links at all). The task brief itself conflated the two, which is a real signal: a model with no other grounding for this brand could very plausibly answer a query about "Provence PVC Armé" as if it were a window/door company.
**Recommendation:** Add an explicit, early, self-contained disambiguating sentence on the homepage and in the meta description, e.g. "Provence PVC Armé pose des membranes PVC armées pour piscines (et non des menuiseries PVC) à Dieulefit et dans ses environs." Reinforce "piscine"/"bassin" in the H1 and first paragraph of every page (already partially done) so no passage can be extracted without pool context. Pursue at least one third-party anchor pre-launch or shortly after launch — Google Business Profile, a YouTube video of a thermosoudage chantier, or a Reddit/forum mention — since YouTube presence has the strongest documented correlation with AI citation and would help disambiguate the entity.

### 3. No llms.txt
**Severity:** Medium
**Evidence:** No `llms.txt` at the site root (confirmed by directory listing).
**Recommendation:** llms.txt is ignored by Google but is read by some LLM agents/crawlers (Claude, various RAG pipelines) as a curated entry point. Given the site has only 4 pages and no other authority signals yet, a short llms.txt is cheap to produce and gives explicit, structured facts: business name, one-line description ("pose de membrane PVC armée pour piscines par thermosoudage"), service area (8 départements listed), phone, and links to `/`, `/methode.html`, `/realisations.html`, `/contact.html` with one-sentence summaries each. Low effort, plausible upside, no downside — do this alongside the launch.

### 4. Passage lengths are well under the optimal AI-citation window
**Severity:** Medium
**Evidence:** FAQ answers and stat-panel text run roughly 25–50 words (e.g. the "Qu'est-ce que le PVC armé" answer is ~35 words; the durée-de-vie panel is ~30 words), versus the ~134–167 word window that performs best for AI Overview / ChatGPT citation because it gives a model enough surrounding context to be confident in extracting and attributing the passage.
**Recommendation:** Without padding with filler, extend the 3–5 highest-value answer blocks (what is PVC armé, lifespan, renovation process, guarantee, service area) to ~120–160 words by adding the specific facts currently missing elsewhere on the site (see Finding 6 and 7): guarantee duration/scope, certifications, install crew size/experience, brand of membrane used. This both lengthens the passage toward the optimal window and closes real authority gaps at the same time.

### 5. Warranty claim has no duration or scope
**Severity:** Medium
**Evidence:** index.html:173–174 — "Garantie étanchéité sur la pose" / "Chaque lé est soudé à l'air chaud et contrôlé individuellement : la pose de votre membrane est garantie étanche." No page states how many years the guarantee covers, whether it's a manufacturer warranty, a workmanship warranty, or a `garantie décennale` (the standard French 10-year construction warranty), and no schema encodes it.
**Recommendation:** State the guarantee's duration and legal basis explicitly in visible text (e.g. "Garantie décennale sur la pose" or "Garantie étanchéité de X ans"). A vague, unquantified guarantee claim is both weak for citation (an LLM can't cite a specific figure that isn't there) and weak for trust — AI Overviews and answer engines favor verifiable, specific claims over marketing language.

### 6. No author/experience/certification signals anywhere on the site
**Severity:** Medium
**Evidence:** A sitewide search for years-in-business, founder/team name, certifications (Qualibat, RGE), insurance (assurance décennale), or a SIRET number returned no matches on any of the four pages.
**Recommendation:** Add a short "Qui sommes-nous" block (even 2–3 sentences on the homepage or a dedicated section) naming who runs the company, how long they've been doing this trade, and any relevant certifications/insurance. These are exactly the E-E-A-T-style signals (experience, expertise, authoritativeness, trust) that both Google AI Overviews and LLM-based answer engines weight when deciding whether to surface and attribute a small local business as a source.

### 7. Named material/supplier brand only exists in an image `alt` attribute
**Severity:** Low
**Evidence:** realisations.html:168 — `alt="Colle Renolit Alkorglue et outillage de pose"` is the only place "Renolit" (a recognized pool-membrane manufacturer) appears anywhere on the site; it is not in any visible body text.
**Recommendation:** Boilerplate-stripping extractors (e.g. trafilatura, used for citability analysis) generally do not treat image `alt` text as body content, so this fact is effectively invisible to passage-level citation. Add one visible sentence — e.g. in the "Le matériau" section of `methode.html` — naming the membrane brand(s)/product line used. This adds a concrete, checkable, brand-linked fact that increases both specificity and real-world entity association.

### 8. AI crawlers are not explicitly named in robots.txt
**Severity:** Low
**Evidence:** robots.txt only contains a wildcard `User-agent: * / Allow: /`; GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, and Google-Extended are not mentioned by name.
**Recommendation:** Functionally nothing is blocked today, so this is not urgent, but add explicit `User-agent:` allow blocks for GPTBot, OAI-SearchBot, ClaudeBot, and PerplexityBot as documentation of intent. This also protects against silent scope-narrowing later if the hosting platform or CDN (many static hosts, including Cloudflare, ship one-click "block AI bots" toggles at the network/WAF layer, separate from robots.txt) is ever enabled without revisiting this file. Explicitly decide and note a stance on `Google-Extended` (controls Gemini/AI Overview training use, distinct from Googlebot's indexing crawl) and on `CCBot`/`anthropic-ai` per the task's "optional block" guidance — currently all are implicitly allowed by the wildcard, which is likely the right default for a business seeking AI visibility, but it's worth being deliberate rather than silent.

### 9. No RSL 1.0 licensing signal
**Severity:** Info
**Evidence:** No RSL/licensing file found at the root.
**Recommendation:** RSL adoption is still nascent and mainly relevant for publishers wanting to license or monetize content reuse. Not a priority for a 4-page local-business brochure site; safe to skip for now and revisit if RSL gains broader adoption among the AI platforms this business cares about.

### 10. `methode.html`'s step-by-step process isn't marked up as HowTo
**Severity:** Low
**Evidence:** methode.html:158–183 renders the 4-step installation process as an `<ol class="process">` with clear step headings ("Visite & relevé de cotes", "Conception sur mesure", "Pose & thermosoudage", "Contrôle & livraison") and descriptions, but only `LocalBusiness` schema is present on this page — no `HowTo` (or `Article`) structured data.
**Recommendation:** Add `HowTo` JSON-LD mirroring the four visible steps. This is a well-matched, low-effort addition that gives answer engines a second structured entry point (beyond the homepage FAQ) for citing "how does PVC armé pool installation work" style queries.

### 11. Generic H1 on `realisations.html` lacks standalone context
**Severity:** Low
**Evidence:** realisations.html:97 — `<h1 class="section-title">Avant / Après</h1>`. If this heading and its immediate content are extracted without the surrounding page (title tag, breadcrumb), it doesn't self-identify the topic (pool membrane installs) or the entity.
**Recommendation:** Expand to something like "Avant / Après : chantiers de pose de membrane PVC armée" so the H1 remains meaningful in isolation.

## GEO Health Score: 63/100

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Citability | 25% | 65 | 16.3 |
| Structural Readability | 20% | 78 | 15.6 |
| Multi-Modal Content | 15% | 45 | 6.8 |
| Authority & Brand Signals | 20% | 40 | 8.0 |
| Technical Accessibility | 20% | 80 | 16.0 |
| **Total** | | | **62.6 ≈ 63** |

**Justification:**
- **Citability (65/100):** Several genuinely self-contained, factual, extractable statements exist (thickness, lifespan, response time, coverage area), and the FAQ/schema pairing is a strong pattern — but most passages are 3–5x shorter than the optimal 134–167-word citation window, and the one "guarantee" claim that most needs specificity is left vague.
- **Structural Readability (78/100):** Clean single-H1-per-page hierarchy, native `<details>` FAQ, real comparison lists, breadcrumbs, semantic sections. Docked for mostly statement-style (not question-style) H2/H3s outside the FAQ, and one under-specified H1.
- **Multi-Modal Content (45/100):** Good photo coverage (before/after, process shots) and a genuinely helpful labeled 3D cross-section diagram, but no image captions written as full sentences, no video transcript, no downloadable spec sheet/table, and no `ImageObject`/`VideoObject` schema — visuals aren't yet paired with the kind of extractable text that lets a model "see" them.
- **Authority & Brand Signals (40/100):** This is the weakest dimension: no NAP consistency (locality mismatch in schema), no third-party entity anchors (Wikipedia/Reddit/YouTube/LinkedIn), no certifications/insurance/experience claims, no named practitioner, and a business name that collides with a far more common unrelated French term with nothing on-page to disambiguate it.
- **Technical Accessibility (80/100):** Fully static, server-rendered HTML with no JS dependency for content, permissive robots.txt, valid sitemap, canonical tags. Docked only for the absence of an explicit AI-crawler allow list and no llms.txt.

Since the site is pre-launch, none of this is measurable against live platform citation rates yet (Google AIO / ChatGPT / Perplexity / Bing Copilot scores are not applicable — no live traffic or indexation exists for provencepvcarme.fr as of 2026-08-11). The highest-leverage, lowest-effort fixes before launch are: (1) fix the Dieulefit/Montélimar schema mismatch, (2) add explicit "for swimming pools, not window frames" disambiguating language, (3) specify the guarantee's duration/basis, and (4) add a short experience/certification blurb — these four alone would meaningfully raise both Citability and Authority scores.
