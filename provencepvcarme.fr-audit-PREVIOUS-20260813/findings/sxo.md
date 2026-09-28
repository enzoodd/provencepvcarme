# SXO Audit — Provence PVC Armé (provencepvcarme.fr)

Audit date: 2026-08-11. Site state: pre-launch (`provencepvcarme.fr` DNS = NXDOMAIN as of this date), so this is a source-code / reverse-engineered SXO audit, not a live-fetch + real-SERP-position audit. See **Limitations** at the end.

## Business identity (verified from source, corrects an earlier mis-brief)

Provence PVC Armé is **not** a window/door installer ("menuisier"). It is a **swimming-pool waterproofing specialist**: installation of thermo-welded PVC-armé (reinforced PVC) membranes for new-build and renovated pools, based at 417 Chemin de la Françoise (postal code 26220) and marketed as serving "Montélimar et ses environs (rayon d'1h)" across 8 départements (Vaucluse, Bouches-du-Rhône, Var, Drôme, Gard, Alpes-de-Haute-Provence, Hautes-Alpes, Ardèche). Confirmed identically across `index.html`, `methode.html`, `realisations.html`, `contact.html` (title tags, meta descriptions, `LocalBusiness` JSON-LD, footer copy). All user stories, personas, and target queries below are built around **pool owners** (new construction vs. aging-liner renovation) — no carpentry/window framing was used.

## Realistic target queries (derived from actual page content)

- `membrane PVC armée piscine` / `PVC armé piscine`
- `prix membrane PVC armée piscine` / `prix pose PVC armé piscine`
- `PVC armé ou liner classique` / `liner armé vs liner classique`
- `rénovation piscine PVC armé Drôme` / `rénovation piscine Montélimar` / `rénovation piscine Dieulefit`
- `thermosoudage piscine` / `pose membrane piscine soudée`
- `durée de vie membrane PVC armée`
- `avant après rénovation piscine PVC armé`
- `devis rénovation piscine sans vidange`

## SERP intent research (WebSearch, general keyword space — see Limitations)

Two distinct clusters dominate this keyword space, and the target site needs to satisfy both:

1. **Informational / price-comparison cluster** (`prix membrane PVC armée`, `PVC armé vs liner`) is dominated by third-party guide and e-commerce content sites — guide-piscine.fr, ooreka.fr, piscine-center.fr, mypiscine.com — that lead with explicit **€/m² price tables** (e.g., "PVC armé Alkorplan 150/100 posé : 80€/m² TTC", "piscine 8x4m : ~6 500€ TTC") and structured liner-vs-PVC-armé comparison tables/lifespan figures (liner 5–10 yrs vs PVC armé 15–25 yrs). This maps to the taxonomy's **Comparison Page / Blog Hybrid** type.
2. **Local transactional cluster** (`rénovation piscine Drôme/Montélimar`) is dominated by local competitor firms — Pascal Terras, Les Piscines de l'Olympe, Exp'eau Piscine, MGP Piscines, Piscine O Jardin — whose sites are classic **Service Page** type: service description + process + portfolio + service-area + contact CTA, several with visible local-pack/review presence.

## Page-type classification vs. SERP dominant type

| Page | Classified type (taxonomy) | Dominant SERP type it competes for | Alignment |
|---|---|---|---|
| `index.html` | Service Page (Local-leaning: NAP in footer, service-area schema, but no map/reviews) | Service Page (local competitors) | Aligned, but missing required Local Page elements (embedded map, visible reviews) |
| `methode.html` | Hybrid (Service process + informational Comparison) | Comparison/guide content for "PVC armé vs liner" | Aligned — genuinely strong format match |
| `realisations.html` | Service Page (portfolio/case-study component) | Local competitor portfolio pages | Aligned but thin (see Findings) |
| `contact.html` | Service Page (contact/conversion component) | Local competitor contact pages | Aligned, low friction |

**Mismatch severity: MEDIUM.** No page is the wrong *type* for its intent — the format choices (hero+process+portfolio+contact split across 4 pages) are exactly what ranks for the local-transactional cluster. The gap is not structural but in **required elements that are simply absent** (pricing, reviews/testimonials, insurance/certification, map), which is enough to make the site lose against both the local competitors (who likely show Google reviews) and the price-guide sites (which lead with numbers) for anyone still comparing options.

## User stories per page

### `index.html` (homepage)

1. *As a homeowner in the Dieulefit/Montélimar area with an aging pool liner, I want to quickly confirm this company works near me and see proof of quality, so that I feel safe calling instead of searching further.* — Source: local competitor Service Pages (Pascal Terras, Les Piscines de l'Olympe) leading with service area + portfolio. Homepage's "Pourquoi nous choisir" + réalisations teaser match this, but there's no map or visible review count above the fold — barrier: trust gap.
2. *As a first-time researcher comparing liner vs PVC armé, I want a quick, credible definition before I call, so I don't sound uninformed on the phone.* — Source: definitional cluster ("qu'est-ce que le PVC armé") that guide sites answer directly. Homepage's short FAQ addresses this correctly, but it sits after 4 other sections, not near the top.
3. *As a price-sensitive homeowner mid-research, I want at least a ballpark price, so I know whether to keep researching this company or move to a competitor.* — Source: `prix membrane PVC armée piscine` cluster dominated by pages showing explicit €/m² figures. Homepage (and the whole site) shows **zero** pricing information — barrier: price sensitivity / information gap.

### `methode.html`

1. *As a homeowner nervous about workmanship, I want to understand exactly how the welding/installation works step by step, so I trust this isn't a rushed job.* — Source: process/procedural PAA cluster. The 4-step process section (diagnostic → calepinage → soudure → mise en eau), each photo captioned with a real town name (Saint-Restitut, Dieulefit, Grignan, Pont-de-Barret), is a strong match.
2. *As someone deciding between liner and PVC armé, I want a clear side-by-side comparison, so I can justify the higher cost to myself/my spouse.* — Source: `liner ou PVC armé comparatif` ranking prominently. The `compare-grid` table (thickness, welding vs. stapling, 8–10 yrs vs. 15–25 yrs lifespan) matches this almost exactly — one of the strongest pieces of content on the site.
3. *As a research-stage visitor, I want to know how long the work will disrupt my pool use, so I can plan around the summer season.* — Source: installation-timeframe questions in the competitor/PAA space. The callout "chantier réalisé en moyenne en 2 jours" answers this but doesn't mention drying/refill time or best-season-to-book, leaving a partial gap.

### `realisations.html`

1. *As a skeptical shopper who's been burned by vague quotes before, I want real, verifiable proof of finished work near me, not stock photography.* — Source: local portfolio/before-after search behavior. The interactive avant/après toggle with named towns (La Motte-Chalancon, Pont-de-Barret, Avignon, Poët-Laval) is a strong, differentiated match.
2. *As someone with a similarly shaped/sized pool, I want to find a comparable project, so I can visualize my own result.* — Source: evaluative "avant après piscine PVC armé" intent. The 4 case entries give only a town + finish name — no pool size, no reason for renovation, no budget tier — barrier: information gap, persona must extrapolate.
3. *As a decision-stage buyer close to choosing, I want a client quote next to the photos for third-party validation, not just marketing photography.* — Source: taxonomy's Service Page requirement for "at least one testimonial/case study." Zero testimonials exist anywhere on the site — critical trust gap at exactly the stage where it matters most.

### `contact.html`

1. *As a ready-to-buy homeowner, I want to request a quote in under a minute with minimal fields, so I don't abandon the form.* — Source: high local intent typically resolves via low-friction forms/phone. The form (nom, téléphone, e-mail, ville, type de piscine, nature du projet) is short and reasonable — good match.
2. *As someone hesitant without a price, I want reassurance that "no price shown" isn't evasiveness.* — Source: price-sensitivity barrier. The copy ("nous préférons un chiffrage juste plutôt qu'un prix générique affiché") is an honest, empathetic mitigation, but offers no starting-from figure at all, unlike virtually every competing guide page.
3. *As a risk-averse buyer about to hand a multi-thousand-euro project to a small local company, I want to see insurance/guarantee/certification info right before I submit my details, so I feel safe committing.* — Source: taxonomy's Trust barrier ("ads/pages emphasize trust badges" pattern) plus total sitewide absence of "assurance décennale" / certifications. Nothing on the contact page (or anywhere else) addresses this — barrier: trust gap, potential dead end right at the conversion moment.

## What works

- Homepage's structure (hero value prop → "Pourquoi nous choisir" → process teaser → portfolio teaser → short FAQ → dual CTA) mirrors the Service Page format that real local competitors (Pascal Terras, Les Piscines de l'Olympe, Exp'eau Piscine) use to rank for `rénovation piscine PVC armé Drôme/Montélimar` — correct page type for the local-transactional cluster.
- `methode.html`'s liner-vs-PVC-armé comparison table and material stats (150/100e thickness, 15–25 yr lifespan) closely mirror the structure of the informational/comparison guides (mypiscine.com, guide-piscine.fr) that dominate the `PVC armé vs liner` query — genuinely strong content-market fit and the site's best page.
- Consistent, low-friction dual CTA (call button + "Devis gratuit") in the header, a sticky mobile CTA bar, and a repeated end-of-page CTA band on every page — matches the "ready to act" local persona's need for an obvious next step.
- `realisations.html`'s interactive avant/après toggle (tap to reveal, not a static split image) is a more engaging proof format than the typical static side-by-side gallery used by competitors.
- `contact.html`'s form is short (6 fields) and is paired with an equally prominent phone CTA plus a plain-language explanation for why no generic price is shown — a reasonable, if incomplete, way to manage the price-secrecy objection.
- `FAQPage` + `LocalBusiness` JSON-LD is implemented, and the 3 FAQ answers on the homepage genuinely match real definitional queries ("qu'est-ce que le PVC armé", "quelle est la durée de vie") rather than generic filler.
- Full NAP (phone, email, street address) is repeated identically in the footer of all 4 pages — good footer consistency, aside from the schema conflict noted in Finding 3.

## Findings

### 1. No pricing information anywhere on the site, in a query space dominated by price content
- **Severity:** Critical
- **Evidence:** WebSearch for `membrane PVC armée piscine prix pose` returns results led by explicit €/m² figures (e.g., Alkorplan 150/100 posé: 80€/m² TTC; 8×4m pool: ~6 500€ TTC). On the target site, the only occurrence of "€" in any of the 4 HTML files is the non-numeric `"priceRange": "€€"` inside the hidden `LocalBusiness` JSON-LD — confirmed via full-site grep. Zero visible price, range, or "à partir de" figure exists anywhere in rendered content, and `contact.html` explicitly states pricing is withheld until a call.
- **Recommendation:** Add at least an indicative starting-from range (e.g., "à partir de X€/m² posé, chiffrage précis après diagnostic") on the homepage, `methode.html`, and `contact.html`. This captures top-of-funnel research traffic currently ceded entirely to third-party guide sites, without abandoning the "custom quote" positioning — frame it as a floor, not a fixed price.

### 2. Zero trust/social-proof signals anywhere on the site (no testimonials, no reviews, no rating)
- **Severity:** High
- **Evidence:** Site-wide grep for `avis|témoignage|review|étoile|note moyenne` returns no content matches in any HTML file. The Service Page taxonomy explicitly requires "at least one testimonial or case study" as a baseline element; none exists. `realisations.html` shows photos only, with no client quotes.
- **Recommendation:** Add 3–5 short client quotes tied to specific `realisations.html` projects, and once real Google reviews exist, surface a review-count/rating badge (header or footer) and consider `AggregateRating`/`Review` schema (cross-reference `/seo schema`).

### 3. Total absence of insurance/certification signals (no "assurance décennale", no RGE/Qualibat/Qualipiscine)
- **Severity:** High
- **Evidence:** Site-wide grep for `décennale|assurance|certifi|RGE|Qualibat|Qualipiscine|SIRET` returns no matches in any of the 4 HTML files. The only guarantee claim anywhere is the generic, undated "Garantie étanchéité sur la pose" on the homepage, with no stated duration or legal backing. For a French BTP-adjacent trade taking on projects worth several thousand euros, `assurance décennale` (10-year structural insurance) is a standard, expected trust signal that is completely missing.
- **Recommendation:** Add an "Assurances & garanties" block (assurance décennale, warranty duration in years, any professional certifications) visible on the homepage and immediately next to the contact form — this is the single highest-leverage fix for the Risk-Averse persona (see Persona Scores below).

### 4. Footer legal links are dead placeholders; no legal entity information displayed
- **Severity:** Medium
- **Evidence:** `<a href="#">Mentions légales</a>` and `<a href="#">Politique de confidentialité</a>` appear identically, unlinked, on `index.html`, `methode.html`, `realisations.html`, and `contact.html`. No SIRET or legal form (auto-entrepreneur, SARL, etc.) is displayed anywhere on the site.
- **Recommendation:** Publish real mentions légales (legal entity, SIRET, host, insurer) and a privacy policy before launch, and link them from the footer — this is both a French legal-compliance gap and a trust gap for a hesitant buyer checking legitimacy before a large purchase.

### 5. `LocalBusiness` schema NAP conflicts with the page's own visible footer NAP
- **Severity:** Medium
- **Evidence:** The `LocalBusiness` JSON-LD on all 4 pages sets `"addressLocality": "Montélimar"` with `"postalCode": "26220"`. The visible footer on all 4 pages states "417 Chemin de la Françoise, 26220 Dieulefit" — same street and postcode, different town name. (Dieulefit's postal code is 26220; Montélimar's is 26200, so the schema's `addressLocality` value looks like the likely error — this should be verified against the real registered address before launch.) A NAP conflict between a page's own visible content and its own structured data can confuse Google's entity resolution for Google Business Profile / local-pack matching.
- **Recommendation:** Reconcile `addressLocality` in the schema with the visible footer address on all 4 pages. Cross-reference with `/seo schema` and `/seo local` once the correct registered town is confirmed.

### 6. Marketing copy anchors exclusively on "Montélimar" while the registered address is Dieulefit
- **Severity:** Medium
- **Evidence:** Title tags, meta descriptions, and the homepage hero eyebrow all read "…à Montélimar et dans ses environs (rayon d'1h)" on every page, while the footer/schema street address is in Dieulefit — a distinct town roughly 25km away. This dilutes "Dieulefit"-specific local relevance and risks a mismatch once a Google Business Profile (which keys off the registered address) goes live.
- **Recommendation:** Decide the primary local anchor — most likely Dieulefit, since that's the registered address — and feature it explicitly in the title tag, H1, and hero copy, treating Montélimar as one served town within the 1h radius rather than the flagship location.

### 7. No embedded map or visual service-area indicator, despite an explicit 8-département coverage claim
- **Severity:** Medium
- **Evidence:** No `<iframe>` or map component exists in any of the 4 HTML files (verified by grep). `contact.html` lists the 8 covered départements as a flat text list only (`zones-list`), with no map to let a visitor self-qualify at a glance.
- **Recommendation:** Add an embedded map or a simple radius/zone graphic on `contact.html` and/or the homepage so visitors can immediately confirm "am I in range?" without reading a département list — this also satisfies a required element of the taxonomy's Local Page type.

### 8. `realisations.html` case studies lack narrative depth for evaluative-stage visitors
- **Severity:** Medium
- **Evidence:** Each before/after pair is captioned only with a town name + finish name (e.g., "La Motte-Chalancon · PVC Pierre de Bali"); the "Coulisses du chantier" gallery is images with alt text only, no accompanying story text. No pool dimensions, renovation reason, timeline, or client quote appears anywhere.
- **Recommendation:** Add 2–3 sentences per case study (pool size, why the owner renovated, finish chosen, and a client quote if available) to move this page from "gallery" to genuine decision-stage proof.

### 9. FAQ coverage is thin and skewed to definitional questions only
- **Severity:** Low
- **Evidence:** The `FAQPage` schema and visible FAQ (homepage only) contain 3 questions, all definitional/procedural ("qu'est-ce que le PVC armé", "quelle est la durée de vie", "intervenez-vous pour la rénovation"). No question addresses price, warranty/insurance, or pool-type compatibility (coque, béton, bois/acier — despite `contact.html`'s own form offering these as options), even though these are exactly the evaluative questions a considered, multi-thousand-euro purchase raises.
- **Recommendation:** Expand to 6–8 questions covering price range, insurance/warranty specifics, and compatibility with different pool types; mirror new entries in the `FAQPage` schema.

### 10. `methode.html`'s strong process/comparison content isn't reflected in schema markup
- **Severity:** Low / Info
- **Evidence:** `methode.html` contains a genuinely strong 4-step installation process and a liner-vs-PVC-armé comparison table, but only carries `LocalBusiness` schema (identical to the other 3 pages) — no `HowTo` or comparison-oriented markup that would help Google recognize this specific content type.
- **Recommendation:** Consider `/seo schema` for `HowTo` markup on the installation-process section once the page is live.

## Persona Scores

Personas derived from the SERP signal clusters above (not invented).

| Persona | Journey stage | Relevance /25 | Clarity /25 | Trust /25 | Action /25 | Total /100 | Rating |
|---|---|---|---|---|---|---|---|
| Budget-Conscious Researcher (pricing/comparison guides dominate this query) | Awareness | 10 | 8 | 12 | 15 | 45 | Needs Work |
| Renovation Comparison Shopper (liner vs. PVC armé) | Consideration | 22 | 18 | 14 | 18 | 72 | Good |
| Local Trust-Seeker (Dieulefit/Montélimar area) | Consideration | 18 | 14 | 9 | 18 | 59 | Needs Work |
| Risk-Averse Decision Maker (pre-commitment, multi-thousand-euro spend) | Decision | 12 | 10 | 6 | 15 | 43 | Needs Work |
| Visual Proof-Seeker (before/after driven) | Decision | 20 | 20 | 13 | 17 | 70 | Good |

### Weakest persona: Risk-Averse Decision Maker (43/100)
**Top issue:** Zero insurance/certification signals and zero testimonials anywhere on the site, right at the point of financial commitment.
**Recommended fix:** Add the "Assurances & garanties" block (Finding 3) and 3–5 client quotes (Finding 2), both visible on `contact.html` next to the form, not just buried on the homepage.

### Systemic issue
- **Trust dimension is the weakest across every persona** (6–14/25 range) — this is a single root cause (Findings 2, 3, 4) rather than five separate problems, and fixing it would lift all five persona scores simultaneously.

### Priority actions
1. Add insurance/certification + testimonials, surfaced on both the homepage and `contact.html` (fixes the weakest persona and the systemic Trust gap at once).
2. Add an indicative price range (Finding 1) to stop ceding 100% of the price-research query cluster to third-party guides.
3. Reconcile the Montélimar/Dieulefit branding and schema conflict (Findings 5–6) before the Google Business Profile goes live.

## SXO Gap Score: 59 / 100

*(Labelled "SXO Gap Score" — separate from any technical SEO Health Score produced elsewhere in this audit.)*

| Dimension | Score | Rationale |
|---|---|---|
| Page Type (0–15) | 12 | Correct Service Page format for the local-transactional query cluster; missing required Local Page elements (map, visible reviews). |
| Content Depth (0–15) | 9 | `methode.html` is genuinely strong; pricing content is entirely absent and FAQ/case-study depth is thin relative to competitors. |
| UX Signals (0–15) | 11 | Clear, repeated low-friction CTAs and a short form; undermined by dead legal links and no map/self-qualification tool. |
| Schema (0–15) | 7 | `LocalBusiness` + `FAQPage` present, but internally inconsistent NAP and no Review/HowTo markup. |
| Media (0–15) | 13 | Strong: hero video, interactive before/after, finish swatches, captioned jobsite photography with descriptive alt text throughout. |
| Authority (0–15) | 3 | No testimonials, no reviews/ratings, no insurance/certification, no team bios — the site's single biggest weakness. |
| Freshness (0–10) | 4 | Pre-launch with no dated project history or update cadence visible on-page (uniform `lastmod` at the sitemap level only). |
| **Total** | **59** | **Needs Work** — correct page-type foundations, but Authority/Trust and pricing gaps are severe enough to lose against both local competitors (who typically show reviews) and price-comparison guides. |

## Limitations

- The site is pre-launch (`provencepvcarme.fr` = DNS NXDOMAIN as of 2026-08-11), so this audit analyzed the local HTML source files directly rather than fetching live URLs via `render_page.py` — no rendered-DOM screenshot comparison or real Core Web Vitals/rendering behavior was assessed.
- No real SERP position data exists for this domain (it isn't indexed). SERP intent conclusions are based on general WebSearch queries for the underlying keyword space (`membrane PVC armée piscine prix`, `PVC armé vs liner`, `rénovation piscine Drôme Montélimar`), not on hyper-local long-tail variants or an actual top-10 crawl/classification of 10 ranked URLs.
- No access to Google Business Profile, Google Search Console, or Google Ads data — ad copy, PAA boxes, and related-searches signals referenced above come from WebSearch summaries, not a direct SERP screenshot.
- Postal-code claim (Dieulefit = 26220 vs. Montélimar = 26200) is stated with reasonable confidence but should be verified against the business's actual registered address before treating Finding 5/6 as confirmed rather than "verify."
- No CRO/analytics data (bounce rate, form completion rate) was available to validate persona friction points beyond structural/content inspection.

Cross-skill recommendations: run `/seo schema` for `HowTo`/`Review` markup gaps (Findings 2, 10), `/seo local` for the Montélimar/Dieulefit NAP conflict and Google Business Profile alignment (Findings 5–6), and `/seo content` for E-E-A-T depth (Authority dimension, Findings 2–4, 8).
