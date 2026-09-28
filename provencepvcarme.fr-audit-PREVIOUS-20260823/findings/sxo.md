# SXO Audit — Provence PVC Armé (provencepvcarme.fr)

**Audit date:** 2026-08-18. **Previous SXO score:** 59/100 (`provencepvcarme.fr-audit-PREVIOUS-20260813\findings\sxo.md`, pre-launch/source-only audit).

**Method:** Site is now live on the custom domain (GitHub Pages, confirmed via `render_page.py --mode auto` — HTTP 200, `Server: GitHub.com`, `Last-Modified: 13 Aug 2026`, rendered `extracted_text` matches source). This audit combines a live fetch of the homepage with a direct source read of all 6 pages (`index.html`, `methode.html`, `realisations.html`, `contact.html`, `mentions-legales.html`, `confidentialite.html`), fresh WebSearch SERP checks for the same keyword clusters used previously, and live spot-checks of two ranking local competitors for trust-signal benchmarking. Cross-referenced against this cycle's `findings/schema.md` (80/100, up from 60) and `findings/local.md` (44/100, up from 37) to avoid re-litigating issues already fully documented there — this report focuses on the **experience/conversion layer**, citing the schema/NAP work only where it directly affects a user-facing journey or reassurance signal.

---

## Business identity (unchanged, reconfirmed)

Provence PVC Armé — swimming-pool waterproofing specialist (thermo-welded PVC-armé membrane), 417 Chemin de la Françoise, 26220 **Dieulefit**, marketed as serving "Montélimar et ses environs (rayon de 2h)." Both construction neuve and rénovation are explicitly served (hero copy, "Pourquoi nous choisir," and the `contact.html` form's "Nature du projet" dropdown).

---

## What genuinely improved since the 59/100 audit (verified)

1. **NAP/radius consistency, at least on the 4 conversion pages, is now real.** The previous audit's Findings 5 and 6 (schema said "Montélimar" while the footer said "Dieulefit"; hero copy said "rayon d'1h" against an 8-département `areaServed`) are resolved on `index.html`, `methode.html`, `realisations.html`, and `contact.html`: schema `addressLocality` = "Dieulefit," matching the footer, and "rayon de 2h" appears identically in the hero eyebrow, meta description, footer copy, and the JSON-LD `description` field. Confirmed live via `render_page.py` (`extracted_text` shows "Montélimar et ses environs (rayon de 2h)" on the rendered homepage).
2. **A new "Infos pratiques" reassurance block exists on `contact.html`** (lines 194–230), directly at the point of conversion, that wasn't present in the previous audit: a tappable stat pair showing **"<24h — Réponse devis"** and **"~2h — Rayon d'intervention,"** backed by a 13-town `zones-list` and a plain-language note about serving further afield on request. This is a genuine, well-placed answer to "will they even take my job / how fast will they respond" right next to the form — exactly the kind of self-qualification signal the previous audit's Finding 7 said was missing.
3. **Real `mentions-legales.html` and `confidentialite.html` pages now exist** (previously dead `href="#"` links) with actual GDPR/legal content, correct Dieulefit address, and hosting disclosure.

---

## Lead finding: reassurance signals are inconsistent and, on the trust-verification page itself, actively self-undermining

**Severity: HIGH** (this is the primary finding — it directly answers the "reassurance element" question in scope and is new/sharper evidence, not a restatement of the previous audit).

The user asked specifically to verify that the 2h radius and hours are visible and coherent with what's now in schema. They are **not**, in two concrete ways:

- **"Rayon de 2h" is correct on the 4 pages a user converts through, but stale ("rayon d'1h") on the 2 pages a skeptical buyer checks for legitimacy.** `mentions-legales.html:117` and `confidentialite.html:116` still read "...dans ses environs (rayon d'1h)," contradicting every other page on the site, including the JSON-LD. A Risk-Averse persona who clicks through to "Mentions légales" specifically to verify the business is legitimate — the exact behavior this page exists to serve — encounters a factual contradiction about the business's own service area on the page designed to remove doubt, not add it. (Independently confirmed in `findings/local.md`, Finding L-01.)
- **Opening hours exist in schema (`Monday`–`Saturday`, `08:00`–`18:00`) but are displayed nowhere in visible content.** Grep across all 4 schema-bearing pages confirms `08:00`/`18:00` appear only inside the hidden `LocalBusiness` JSON-LD; the `contact.html` "Infos pratiques" block — the one place a visitor would expect this — shows response time (<24h) and radius (~2h) but has no "Horaires d'ouverture" tab. This matters specifically because the site's primary low-friction CTA is a persistent **"Appeler"** button in the header and a full-width **"Appeler maintenant"** mobile CTA bar — a user tapping to call at 7pm or on a Sunday has no on-page signal of whether anyone will pick up, while a benchmarked local competitor (Les Piscines de l'Olympe) displays hours explicitly (Mon–Fri 9:00–12:00/14:00–18:00, Sat 9:00–12:00) next to its phone number.

**Recommendation:** (1) Propagate "rayon de 2h" to the footer of `mentions-legales.html` and `confidentialite.html` — a 2-line text fix. (2) Add a third stat/tab to the `contact.html` "Infos pratiques" block ("Horaires — Lun–Sam, 8h–18h") so the schema's `openingHoursSpecification` has a visible, matching counterpart next to the call CTA.

---

## Second finding: the site's own SIRET placeholder is now visible to the exact persona who goes looking for it

**Severity: HIGH**

`mentions-legales.html:83-84` displays, in rendered body text (not a hidden comment): `Numéro SIRET : [SIRET À COMPLÉTER]`. Before this audit cycle, the site had no legal page at all, so this gap was invisible; now that the page exists and is linked from every footer, a Risk-Averse Decision Maker who clicks through specifically to validate the business before handing over a multi-thousand-euro renovation or new-build project sees a literal unfilled placeholder at the exact moment they're checking legitimacy. This is a **regression in visibility**, not severity — the underlying gap (no SIRET, no décennale insurance disclosure anywhere) is the same one flagged in the previous audit, but it is now actively encountered rather than silently absent. (Independently confirmed in `findings/local.md`, Finding L-06.)

**Recommendation:** Treat completing the SIRET field as higher priority than before, precisely because it is now visibly incomplete rather than invisibly missing. Pair it with the still-open "assurance décennale" disclosure (see Persona Scores below) — both benchmarked competitors (Les Piscines de l'Olympe: "garantie décennale" + FPP federation membership displayed; the target site: only an undated, non-specific "Garantie étanchéité sur la pose").

---

## Page-type / intent fit — `methode.html` specifically

The user asked whether `methode.html` answers an informational query about the installation process. **Yes, and this remains the site's strongest content-market fit, unchanged since the last audit:**

- Classified type: **Hybrid (Service Process + informational Comparison)**, per `page-type-taxonomy.md`.
- The dominant SERP type for `PVC armé vs liner` / `pose membrane piscine` queries is Comparison/guide content (guide-piscine.fr, mypiscine.com, piscinosa.fr — reconfirmed live via WebSearch: "Prix membrane PVC armé de piscine : tarifs 2026," "Liner Standard ou Liner PVC Armé : Le Comparatif 2026"), and `methode.html`'s 4-step process (diagnostic → calepinage → soudure → mise en eau, each captioned with a real town) plus its `compare-grid` table (agrafé/75-100e/8-10 ans vs soudé/150-100e/15-25 ans) is a near-exact structural match to what ranks for that intent.
- **Gap unchanged from previous audit:** the page still carries no `HowTo` schema for the process section (see `findings/schema.md`, Finding 4) and still doesn't answer the sequencing question a **new-construction** buyer specifically needs ("at what stage of the build do you come in — after the shell cures, before coping stones are laid?"). See the persona comparison below — this is where the renovation vs. new-build asymmetry originates.

**Page-type mismatch severity (site-wide): MEDIUM, unchanged.** No page is the wrong *format* for its intent — the gap is still in required elements being absent (pricing, reviews, insurance disclosure, map), not structural mismatch.

---

## Conversion journey to devis

The path (any page → "Devis gratuit" / "Appeler" in header or sticky mobile bar → `contact.html` → 6-field form or `tel:` link) is short and consistently reinforced with a repeated CTA band on every page — this remains a genuine strength, unchanged from the previous audit. Two journey-specific observations from this cycle:

- The form's "Nature du projet" dropdown (Rénovation / Construction neuve / Réparation ponctuelle) correctly acknowledges both target personas at the point of conversion — but nothing upstream (FAQ, case studies) segments content by that same distinction, so a new-construction visitor reaches the form having self-served less than a renovation visitor. See Persona Scores.
- The `contact.html` "Infos pratiques" addition (see above) shortens the gap between "I'm ready to convert" and "do I actually qualify for service" — a real UX improvement that reduces the risk of a qualified lead abandoning the form to go re-verify coverage elsewhere.

---

## CTA clarity

Unchanged and still a strength: consistent dual CTA (call + "Devis gratuit") in every header, a persistent mobile CTA bar (swapping intelligently to "Appeler maintenant" on `contact.html` itself, "Demander un devis gratuit" elsewhere), and a repeated end-of-page CTA band with matching copy on every page. No new friction was introduced. No new finding here beyond what's already resolved above (hours visibility next to the call CTA).

---

## User stories (signal-cited, spanning awareness → decision)

1. *As a homeowner with an aging liner Googling "PVC armé vs liner," I want a clear comparison table before I call, so I can justify the extra cost to myself.* — Source: WebSearch confirms guide-piscine.fr / mypiscine.com dominate this query with explicit comparison tables and 2026-dated price tiers. `methode.html`'s `compare-grid` matches this closely — **served well**.
2. *As someone planning a new-build pool, I want to know when in my construction timeline you get involved and whether you coordinate with my pool builder, so I can sequence trades correctly.* — Source: contact form explicitly offers "Construction neuve" as a project type, but no FAQ or process copy addresses build-sequencing. **Barrier: information gap, new-construction persona underserved relative to renovation.**
3. *As a skeptical shopper about to commit several thousand euros, I want to verify this is a real, insured, legitimate business before I submit my details, so I click through to "Mentions légales."* — Source: taxonomy's Service Page trust requirement + the page's own existence this cycle. **Barrier: trust gap, sharpened this cycle** — the page now exists but shows a visible `[SIRET À COMPLÉTER]` placeholder and a stale radius claim, actively undermining rather than just omitting reassurance.
4. *As someone deciding whether to call right now, I want to know if the business is open, so I don't leave a message into the void.* — Source: persistent "Appeler" CTA in the header and mobile bar on every page, paired with schema-level `openingHoursSpecification` that has no visible UI counterpart. **Barrier: information gap between what schema promises and what the page shows.**
5. *As a price-sensitive researcher mid-funnel, I want at least a floor price, so I know whether to keep researching here or move to a guide site.* — Source: WebSearch confirms the `prix membrane PVC armée` cluster is still dominated by pages with explicit €/m² figures (guide-piscine.fr, prix-pose.com, etancheite-piscine.fr all 2026-dated). Unchanged: **zero visible price anywhere on the site** (only `"priceRange": "€€"` in schema).

---

## Persona Scores

Personas derived from SERP signal clusters (WebSearch) and, per the user's specific request, expanded to directly compare **Renovation** vs. **New-Construction** intent — both explicitly served by the site's own form but not equally served by its content.

| Persona | Journey stage | Relevance /25 | Clarity /25 | Trust /25 | Action /25 | Total /100 | Rating |
|---|---|---|---|---|---|---|---|
| Renovation Homeowner (aging liner, comparing to PVC armé) | Consideration | 22 | 19 | 9 | 19 | **69** | Good |
| New-Construction Pool Owner (choosing membrane for a new build) | Consideration | 14 | 13 | 8 | 15 | **50** | Needs Work |
| Local Trust-Seeker (Dieulefit/Montélimar, verifying coverage & hours) | Consideration | 20 | 15 | 12 | 18 | **65** | Good |
| Risk-Averse Decision Maker (pre-commitment, checks Mentions légales) | Decision | 12 | 12 | 5 | 14 | **43** | Needs Work |
| Budget-Conscious Researcher (price-comparison cluster) | Awareness | 10 | 8 | 12 | 15 | **45** | Needs Work |

### Renovation vs. New-Construction: a measurable, evidence-based gap (directly answering the user's request)
- **Renovation is well served:** the hero copy, "Pourquoi nous choisir," `methode.html`'s liner-vs-PVC-armé comparison table, and one of three homepage FAQ entries ("Intervenez-vous pour la rénovation de piscines existantes ?") all speak directly to this persona. Score: 69/100.
- **New construction is materially underserved**, despite being named equally in the hero ("construction comme en rénovation") and offered as a form option: no FAQ entry addresses new-build sequencing or compatibility with different shell types (the form itself asks "Enterrée béton / Coque polyester / Piscine bois-acier" but no page content explains how the membrane pose relates to any of these), and `realisations.html`'s four case studies are captioned only with town + finish name (e.g., "La Motte-Chalancon · PVC Pierre de Bali") — none are labeled as renovation or new-build, so a new-construction visitor cannot find a single comparable reference project despite the form explicitly asking them to self-identify as one. Score: 50/100.
- **Recommended fix:** label each `realisations.html` case as "Rénovation" or "Construction neuve" (a one-line addition to each `<figcaption>`), and add 1–2 FAQ entries (mirrored in the `FAQPage` schema) specifically for new-build sequencing and shell-type compatibility — this closes the gap with near-zero design cost, reusing content patterns that already work for the renovation persona.

### Weakest persona: Risk-Averse Decision Maker (43/100)
**Top issue:** No insurance/certification disclosure anywhere on the site, and the one page built to reassure this persona (`mentions-legales.html`) instead surfaces a visible SIRET placeholder and a stale radius claim.
**Recommended fix:** Complete the SIRET field, add a real "Assurances & garanties" statement (assurance décennale status, warranty duration in years) visible on `contact.html` next to the form — not buried on the homepage — and fix the stale "rayon d'1h" text on the two legal pages (2-line change, see Lead Finding).

### Systemic issue
Trust remains the weakest dimension across every persona (5–12/25), same root cause identified in the previous audit (Findings 2–3: no testimonials, no insurance disclosure) — but this cycle adds concrete new evidence that the gap is now **actively visible** (SIRET placeholder, stale legal-page text) rather than simply absent, which is a worse user experience, not a better one, even though the underlying schema/NAP work this cycle was genuinely good.

### Priority actions
1. Fix the two-page stale "rayon d'1h" text and add a visible "Horaires" stat to `contact.html`'s Infos pratiques block, so the site's own reassurance signals stop contradicting its own schema (Lead Finding).
2. Complete the SIRET placeholder and add a real, specific insurance/warranty statement next to the contact form — highest-leverage fix for the weakest persona (Second Finding).
3. Label `realisations.html` case studies by project type (Rénovation / Construction neuve) and add 1–2 new-build-specific FAQ entries — closes the 19-point gap between the Renovation and New-Construction personas at near-zero cost.
4. (Carried over, unchanged) Add an indicative starting-from price range to stop ceding the entire price-research query cluster to third-party guides.

---

## Gap Analysis (7 dimensions, 100 points)

| Dimension | Score | Δ vs. 59/100 audit | Evidence |
|---|---|---|---|
| Page Type (0–15) | 12 | — | Correct Service Page / Hybrid format for the local-transactional and comparison query clusters; still missing required Local Page elements (map, visible reviews). |
| Content Depth (0–15) | 9 | — | `methode.html` remains genuinely strong for renovation intent; new-construction and FAQ coverage still thin, now with a quantified persona gap (69 vs. 50). |
| UX Signals (0–15) | 12 | +1 | New "Infos pratiques" reassurance block on `contact.html` is a real improvement; offset by the newly-visible stale-text and SIRET-placeholder issues. |
| Schema (0–15) | 10 | +3 | NAP conflict resolved and `openingHoursSpecification` added (see `findings/schema.md`, 80/100) — but hours have no visible UI counterpart, so the schema improvement isn't yet fully reflected in the on-page experience. |
| Media (0–15) | 13 | — | Unchanged strength: hero video, interactive before/after, captioned jobsite photography. |
| Authority (0–15) | 4 | +1 | Real legal pages now exist (up from dead links), but a visible SIRET placeholder and continued absence of testimonials/décennale disclosure keep this the site's weakest dimension. |
| Freshness (0–10) | 5 | +1 | Site is live with real HTTP headers (`Last-Modified: 13 Aug 2026`) and a working sitemap; still no dated project history or update cadence visible on-page. |
| **Total** | **65** | **+6** | Genuine, measurable progress driven by the NAP/schema fixes and the new contact-page reassurance block — but Authority/Trust remains the binding constraint, and two new, easily-fixed inconsistencies (stale legal-page text, visible SIRET placeholder) partly offset the gains. |

---

## Limitations

- No access to Google Business Profile, Google Search Console, or Google Ads data; SERP conclusions rely on WebSearch summaries and two live competitor fetches (Les Piscines de l'Olympe, Piscine O Jardin), not a full top-10 crawl/classification with screenshots.
- The site is not yet indexed for its target keywords (recently launched), so no real ranking-position data exists to validate the SERP-consensus assumptions against actual competitor set for this exact domain.
- No CRO/analytics data (bounce rate, form completion/abandonment rate, call-tracking) was available to validate persona friction points beyond structural/content inspection.
- Persona scores are qualitative judgments grounded in cited page evidence and SERP signals, not A/B-tested or panel-validated.

Cross-skill references: `/seo local` for the stale-radius-text and SIRET items (already tracked as L-01/L-06 in `findings/local.md`); `/seo schema` for `HowTo` markup on `methode.html` and `geo` coordinates (tracked in `findings/schema.md`); `/seo content` for E-E-A-T depth once real insurance/testimonial data exists.

## SXO Gap Score: 65 / 100

*(Labelled "SXO Gap Score" — separate from any technical SEO Health Score produced elsewhere in this audit. Up from 59/100.)*

Generate a PDF report? Use `/seo google report`
