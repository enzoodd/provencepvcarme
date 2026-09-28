# GEO / AI Search Readiness Audit — Provence PVC Armé

**Site audited:** https://provencepvcarme.fr (live, resolves, HTTP 200 — confirmed via `curl` and via `render_page.py` on 2026-08-18)
**Pages:** `index.html`, `methode.html`, `realisations.html`, `contact.html` (+ `mentions-legales.html`, `confidentialite.html`, added since the previous audit)
**Previous GEO score:** 63/100 (report: `provencepvcarme.fr-audit-PREVIOUS-20260813/findings/geo.md`, site pre-launch at that time)
**Current GEO score: 66/100** (see breakdown below)

The site went live between the two audits. This report re-verifies every finding from the previous audit against the current, live source and HTML, and adds no new speculative issues — everything below was directly checked in the code or via a live fetch.

## What changed since the previous audit (verified)

- **NAP inconsistency fixed.** `LocalBusiness` JSON-LD on all four main pages now reads `"addressLocality": "Dieulefit"` (index.html:42, methode.html:51, realisations.html:42, contact.html:42) — matching the visible footer address "417 Chemin de la Françoise, 26220 Dieulefit". The previous Montélimar/26220 mismatch (High severity in the prior report) is resolved.
- **Mentions légales page added** (`mentions-legales.html`, live, in `sitemap.xml`), naming a real individual — "Enzo Oddon, entrepreneur individuel (auto-entrepreneur)" — with address, phone, and email, plus a hosting disclosure (GitHub Pages) and an IP/liability section. This is a genuine, checkable authorship/trust signal that answers part of the previous report's Finding 6 (no author/experience signals). It also confirms the "mentions légales maintenant présentes = bon signal de fiabilité" premise in the task brief.
- **Site is now crawlable in practice, not just in theory.** `robots.txt` is live and unchanged (`User-agent: * / Allow: /`), confirmed served with HTTP 200. `render_page.py` confirms `is_spa: false`, `mode_used: raw` — the homepage is fully server-rendered static HTML with no JS dependency to reveal body content, and its two JSON-LD blocks (`LocalBusiness`, `FAQPage`) both validate.
- **`realisations.html` gained a "Coulisses du chantier" section** (7 additional process photos) — improves photo depth but does not change the Multi-Modal score materially (see Finding 6): still no full-sentence captions or `ImageObject` schema.

## AI Crawler Access Status

| Crawler | Status | Evidence |
|---|---|---|
| GPTBot | Allowed | `robots.txt`: `User-agent: * / Allow: /`, no crawler-specific block |
| OAI-SearchBot | Allowed | same wildcard rule |
| ClaudeBot | Allowed | same wildcard rule |
| PerplexityBot | Allowed | same wildcard rule |
| CCBot | Allowed (not blocked — optional per brief) | same wildcard rule |
| anthropic-ai | Allowed (not blocked — optional per brief) | same wildcard rule |
| Google-Extended | Allowed (not addressed) | no specific rule either way |

`robots.txt` is served live at `https://provencepvcarme.fr/robots.txt` (HTTP 200) and contains only a wildcard allow-all plus a correct `Sitemap:` directive. Nothing is blocked, which is the right functional outcome, but no crawler is named explicitly — this was flagged Low severity in the previous audit and remains unchanged (see Finding 5 below).

## llms.txt Status

**Missing.** Confirmed via `curl -I https://provencepvcarme.fr/llms.txt` → HTTP 404, and no `llms.txt` file in the repository root. Unchanged since the previous audit (Finding 3 there, Medium severity).

## RSL 1.0 Licensing

No RSL file present. Unchanged — still not a priority for a 4-page local-business brochure site (Info-level, as in the previous audit).

## Brand mention / entity anchor analysis

A sitewide search for `youtube|reddit|linkedin|wikipedia|facebook|instagram|tiktok` across every HTML file in the live site returns **zero matches**. The footer has no social links of any kind on any page.

| Signal | Status |
|---|---|
| Wikipedia entity | Absent |
| Reddit presence | Absent |
| YouTube mentions | Absent (hero background video is self-hosted `media/hero-bg.mp4`, not YouTube-embedded) |
| LinkedIn company page | Absent |
| Google Business Profile link | Absent (not referenced anywhere on-site) |

This is unchanged from the previous audit. Given YouTube presence has the strongest documented correlation with AI citation (~0.737) and the business name ("PVC armé") collides with a much more common French term for reinforced-PVC window/door frames (menuiserie), the lack of any third-party anchor remains the single biggest unresolved gap for entity disambiguation — see Finding 1.

## Findings (current, by severity)

### 1. Entity name still collides with a much more common French term, with no disambiguating anchor
**Severity:** High
**Evidence:** "PVC armé" is the business's core keyword throughout titles, meta descriptions, and headings, but in French building/trade usage it overwhelmingly refers to reinforced-PVC window and door frames (menuiserie), not swimming-pool membranes. A sitewide search for explicit disambiguating language ("pas des menuiseries", "non des fenêtres", etc.) returns zero matches on any page. There is still no Wikipedia entry, Reddit thread, YouTube channel, LinkedIn page, or Google Business Profile link anywhere on the site to anchor the entity. This is the same gap identified in the previous audit (Finding 2, High) and it has not been addressed.
**Recommendation:** Add one explicit, self-contained disambiguating sentence early on the homepage and in the meta description — e.g. "Provence PVC Armé pose des membranes PVC armées pour piscines (et non des menuiseries PVC) à Dieulefit et dans ses environs." Now that the site is live, prioritize at least one third-party anchor: claim/verify a Google Business Profile (highest-leverage, free, and directly used by Google AI Overviews and increasingly cross-checked by other engines), and consider a short YouTube video of a thermosoudage chantier.

### 2. Passage lengths remain well under the optimal AI-citation window
**Severity:** Medium
**Evidence:** The homepage FAQ answers (index.html:70, 78, 86, mirrored verbatim in the `FAQPage` JSON-LD) run roughly 30–45 words each, and the "chiffres clés" stat-panel text on `methode.html` (lines 157, 160) and `contact.html` (lines 217, 220) runs 35–55 words — all well short of the ~134–167-word window that performs best for AI Overview/ChatGPT citation. This is unchanged from the previous audit (Finding 4, Medium) — no passage was lengthened.
**Recommendation:** Without padding with filler, extend the 3–5 highest-value answer blocks (what is PVC armé, lifespan, renovation process, guarantee, service area) to ~120–160 words each by folding in facts that already exist elsewhere on the site but are fragmented (e.g. combine the FAQ's lifespan answer with the `methode.html` durée-de-vie stat panel's UV/algae-resistance detail into one longer, self-contained passage). This also directly supports Finding 3 below.

### 3. Guarantee claim still has no duration or legal basis
**Severity:** Medium
**Evidence:** index.html:183–184 still reads "Garantie étanchéité sur la pose" / "Chaque lé est soudé à l'air chaud et contrôlé individuellement : la pose de votre membrane est garantie étanche" — unchanged text from the previous audit. No page states a guarantee duration, whether it's a manufacturer warranty, a workmanship warranty, or the standard French 10-year `garantie décennale`, and no schema encodes it. This was Finding 5 (Medium) in the previous audit and remains open.
**Recommendation:** State the guarantee's duration and legal basis explicitly (e.g. "Garantie décennale sur la pose" or "Garantie étanchéité de X ans"). A vague, unquantified claim cannot be cited with a specific figure by an LLM and is weaker for trust than a verifiable one.

### 4. SIRET still a visible placeholder; no experience, certification, or insurance signals
**Severity:** Medium
**Evidence:** `mentions-legales.html:83–84` contains an HTML comment `<!-- TODO: ajouter SIRET -->` followed by `<li>Numéro SIRET : [SIRET À COMPLÉTER]</li>` — a visible, uncompleted placeholder now live on the production site. Beyond the newly-added named editor (Enzo Oddon, auto-entrepreneur), a sitewide search for `décennale|Qualibat|RGE|assurance|ans d'expérience|années d'expérience` across all HTML returns no matches — no insurance (assurance décennale), no trade certification, no stated years in business anywhere.
**Recommendation:** Two distinct actions: (a) complete the SIRET number before or shortly after any real traffic arrives — a bracketed placeholder is worse than no field at all if crawled, since it signals an incomplete/unverified business entity; (b) add a short "Qui sommes-nous" block (2–3 sentences) stating relevant experience and, if applicable, `assurance décennale` — these are the E-E-A-T-style signals both Google AI Overviews and LLM answer engines weight when deciding whether to surface a small local business as a source. This directly extends the mentions-légales improvement already made and was flagged as Finding 6 in the previous audit.

### 5. AI crawlers still not explicitly named in robots.txt
**Severity:** Low
**Evidence:** `robots.txt` (confirmed live, HTTP 200) is unchanged since the previous audit: only `User-agent: * / Allow: /` plus a `Sitemap:` line. GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, and Google-Extended are not mentioned by name — functionally nothing is blocked, but intent is undocumented.
**Recommendation:** Add explicit `User-agent:` allow blocks for GPTBot, OAI-SearchBot, ClaudeBot, and PerplexityBot as documentation of intent, and take an explicit stance on `Google-Extended` and the optional-block list (CCBot, anthropic-ai). This protects against a host/CDN-level "block AI bots" toggle being flipped later without anyone revisiting this file. Same recommendation as the previous audit's Finding 8, unchanged.

### 6. `methode.html`'s 4-step process still isn't marked up as HowTo
**Severity:** Low
**Evidence:** `methode.html:179–204` still renders the installation process as a plain `<ol class="process">` with four clear steps (Visite & relevé de cotes, Conception sur mesure, Pose & thermosoudage, Contrôle & livraison). The page carries `LocalBusiness` and `BreadcrumbList` JSON-LD (lines 39–78) but still no `HowTo` schema. Unchanged from the previous audit's Finding 10.
**Recommendation:** Add `HowTo` JSON-LD mirroring the four visible steps — a low-effort second structured-data entry point (beyond the homepage FAQ) for "how does PVC armé pool installation work" style queries.

### 7. `realisations.html` H1 still lacks standalone context
**Severity:** Low
**Evidence:** `realisations.html:118` — `<h1 class="section-title">Avant / Après</h1>`, unchanged from the previous audit's Finding 11. Extracted in isolation (no title tag, no breadcrumb) it doesn't self-identify the topic or entity.
**Recommendation:** Expand to something like "Avant / Après : chantiers de pose de membrane PVC armée" so the H1 remains meaningful if lifted out of context.

### 8. Sitemap `lastmod` dates are stale relative to actual page edits
**Severity:** Low
**Evidence:** `sitemap.xml`'s four main URLs all carry `<lastmod>2026-08-09</lastmod>`, but `git log` shows real content/markup edits to `index.html`, `methode.html`, and `realisations.html` as late as 2026-08-13 (e.g. "Rayon d'intervention 1h → 2h", "Ajout des horaires d'ouverture au schema.org"), and the live HTTP response for `/` currently returns `Last-Modified: Thu, 13 Aug 2026`. `mentions-legales.html` and `confidentialite.html` correctly carry `2026-08-12`.
**Recommendation:** Update `lastmod` for the four main URLs to match their actual last edit dates. Freshness signals in the sitemap are one of the (weaker) inputs crawlers use to prioritize re-fetching, and an accurate date costs nothing to maintain.

### 9. Named material/supplier brand still only exists in an image `alt` attribute
**Severity:** Low
**Evidence:** `realisations.html:189` — `alt="Colle Renolit Alkorglue et outillage de pose"` remains the only place "Renolit" appears on the site; it is not in visible body text on any page. Unchanged from the previous audit's Finding 7.
**Recommendation:** Boilerplate-stripping extractors (e.g. trafilatura) generally don't treat `alt` text as body content, so this fact is invisible to passage-level citation. Add one visible sentence naming the membrane brand/product line in the "Le matériau" section of `methode.html`.

### 10. No RSL 1.0 licensing signal
**Severity:** Info
**Evidence:** No RSL/licensing file at the root. Unchanged from the previous audit's Finding 9.
**Recommendation:** Not a priority for a 4-page local-business site; revisit only if RSL adoption grows among platforms this business cares about.

## GEO Health Score: 66/100 (was 63/100)

| Dimension | Weight | Score | Weighted | Prev. Score |
|---|---|---|---|---|
| Citability | 25% | 65 | 16.25 | 65 |
| Structural Readability | 20% | 78 | 15.6 | 78 |
| Multi-Modal Content | 15% | 45 | 6.75 | 45 |
| Authority & Brand Signals | 20% | 55 | 11.0 | 40 |
| Technical Accessibility | 20% | 80 | 16.0 | 80 |
| **Total** | | | **65.6 ≈ 66** | **63** |

**Justification for changes:**
- **Citability (65/100, unchanged):** Same strong FAQ/schema pairing and the same short-passage problem as before — nothing was lengthened, and the guarantee claim is still unquantified.
- **Structural Readability (78/100, unchanged):** No `HowTo` schema added, `realisations.html` H1 still generic. Otherwise still a clean single-H1 hierarchy with native `<details>` FAQ and breadcrumbs.
- **Multi-Modal Content (45/100, unchanged):** The new "Coulisses du chantier" gallery adds photo volume but not the missing ingredients (full-sentence captions, `ImageObject`/`VideoObject` schema, video transcript) that would let a model "read" the visuals.
- **Authority & Brand Signals (55/100, up from 40):** The two concrete, verified fixes — NAP now consistent site-wide (Dieulefit everywhere), and a real named editor with contact details now on a live `mentions-legales.html` page — are genuine E-E-A-T-adjacent improvements. This dimension is still held back by: a visible unfilled SIRET placeholder, zero third-party entity anchors (Wikipedia/Reddit/YouTube/LinkedIn/GBP), no certifications/insurance/experience claims, and no disambiguating language against the "PVC armé = window frames" collision.
- **Technical Accessibility (80/100, unchanged):** The site is now confirmed live and crawlable in practice (previously this was only inferable pre-launch): `robots.txt` serves HTTP 200 with a permissive wildcard rule, the homepage is fully static/SSR (`is_spa: false`), and both JSON-LD blocks validate. Still docked for the missing `llms.txt`, the absence of an explicit AI-crawler allow-list, and stale sitemap `lastmod` dates.

## Platform-specific scores (Google AIO / ChatGPT / Perplexity / Bing Copilot)

Not measurable from this audit. The site is now live and technically crawlable, but no DataForSEO MCP tools were available in this session (`ai_optimization_chat_gpt_scraper`, `ai_opt_llm_ment_search` were not invoked), and the site is too newly launched/low-traffic for organic AI-citation data to exist yet. Re-run this check with DataForSEO access, or manually query ChatGPT/Perplexity/Google AI Overviews for "pose PVC armé piscine Montélimar" / "membrane PVC armée Dieulefit" once the site has had a few weeks of indexation.

## Top 5 highest-impact changes (prioritized)

1. **Add one disambiguating sentence + claim a Google Business Profile.** (Finding 1) Effort: Low (sentence) + Low (GBP claim, ~15 min). Impact: High — directly addresses the entity-collision risk and gives AI engines their most commonly cross-checked local-business signal.
2. **Complete the SIRET number and add a short experience/insurance blurb.** (Finding 4) Effort: Low (SIRET, if already registered) + Low (2–3 sentences). Impact: High — removes a visible "incomplete business" signal and adds concrete E-E-A-T facts.
3. **Specify the guarantee's duration/legal basis and lengthen 3–5 key passages toward 120–160 words.** (Findings 2, 3) Effort: Medium (copywriting, no new facts needed beyond the guarantee terms). Impact: Medium-High — closes the single most citable-but-vague claim on the site and moves several passages into the optimal citation window at the same time.
4. **Publish a short `llms.txt`.** (llms.txt section) Effort: Low (site has only 6 pages). Impact: Medium — cheap, structured, curated entry point for LLM agents/RAG pipelines that don't rely solely on HTML crawling.
5. **Add `HowTo` JSON-LD on `methode.html` and explicitly name AI crawlers in `robots.txt`.** (Findings 5, 6) Effort: Low for both. Impact: Low-Medium — second structured-data entry point for process-related queries, plus documented (not just incidental) AI-crawler access.

## Files referenced

- `C:\Users\oddon\Desktop\provencepvcarme\index.html`
- `C:\Users\oddon\Desktop\provencepvcarme\methode.html`
- `C:\Users\oddon\Desktop\provencepvcarme\realisations.html`
- `C:\Users\oddon\Desktop\provencepvcarme\contact.html`
- `C:\Users\oddon\Desktop\provencepvcarme\mentions-legales.html`
- `C:\Users\oddon\Desktop\provencepvcarme\robots.txt`
- `C:\Users\oddon\Desktop\provencepvcarme\sitemap.xml`
- `C:\Users\oddon\Desktop\provencepvcarme\provencepvcarme.fr-audit-PREVIOUS-20260813\findings\geo.md` (previous report, for comparison)
