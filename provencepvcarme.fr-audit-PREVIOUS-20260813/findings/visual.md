# Visual / Mobile Rendering Audit — Provence PVC Armé

Audited via local mirror at `http://localhost:8791/` (provencepvcarme.fr does not resolve yet, pre-launch). Pages: `/`, `/methode.html`, `/realisations.html`, `/contact.html`. Captured with headless Chromium at desktop (1440×900) and mobile (390×844, iPhone-class viewport/UA) using Playwright, plus a JS-disabled pass on the homepage and DOM/CSS inspection of the shared header.

Screenshots: `C:\Users\oddon\Desktop\provencepvcarme\provencepvcarme.fr-audit\screenshots\`
- `{home,methode,realisations,contact}-desktop.png` / `-mobile.png` (above-the-fold viewport captures)
- `{home,methode,realisations,contact}-desktop-full.png` / `-mobile-full.png` (full-page captures)
- `home-desktop-nojs.png` (JavaScript disabled)
- `realisations-toggle-after.png` (before/after toggle after interaction)

Raw diagnostic data (tel-link geometry, h1 geometry, scroll width, console errors) saved to `C:\Users\oddon\Desktop\provencepvcarme\provencepvcarme.fr-audit\capture-data.json`.

## What works

- Desktop above-the-fold (1440×900) is clean and professional on all four pages: H1 fully visible without scrolling, generous whitespace, sticky header with both "Appeler" and "Devis gratuit" CTAs always visible.
- Hero video (`media/hero-bg.mp4`) loads and plays correctly (`readyState: 4`, not paused, no decode errors), with the `hero-poster.jpg` wired as a fallback. No console errors or page errors were observed on any of the four pages.
- Hero text legibility is strong: the dark gradient/radial overlay (`.hero-video-overlay`) gives white/teal/gold headline text sufficient contrast against the moving video background on both desktop and mobile.
- Scroll-reveal title animations and the custom canvas scenes (`water-canvas` on `methode.html`) render correctly, sit below the fold, are `position:absolute` inside their section (no layout shift), and respect `prefers-reduced-motion`.
- The homepage's core content is server-rendered, not JS-injected: with JavaScript fully disabled, the `<h1>`, body copy, and the `tel:` link are all present and visible in the raw DOM (confirmed via a JS-disabled Playwright pass) — low risk for crawlers with limited/no JS execution.
- The before/after comparison toggle (`.ba-toggle`) on `realisations.html` works as expected: clicking swaps the "Avant" label/photo state to "Après" and updates the "Voir après" / "Voir avant" affordance text.
- `contact.html` puts the phone number as a tappable/clickable CTA (`06 60 87 16 51`) inside the first visible content block on both desktop and mobile — a strong, low-friction conversion path for a local service business.
- No horizontal-scroll or layout-breakage issues were found in the page body/content areas themselves (grids, cards, forms all reflow correctly at 390px) — the overflow issue found (below) is isolated to the header row.

## Findings

### 1. Mobile header overflows the viewport; the hamburger menu is completely off-screen and unusable
- **Severity:** Critical
- **Evidence:** At 390px width (iPhone-class viewport, used on all four pages via the shared header), `document.documentElement.scrollWidth` is 474px against a `clientWidth` of 390px — an 84px horizontal overflow present on every page. DOM measurement of the header row shows: `.nav-cta` right edge at x=414 (24px past the 390px viewport edge, clipping the "Devis gratuit" button, which renders as "Devis gratui…" — visible in `home-mobile.png`, `methode-mobile.png`, `realisations-mobile.png`, `contact-mobile.png`), and `.nav-burger` (the hamburger/menu-open button) positioned entirely off-screen at `left: 438px, right: 474px`. The cause is structural: `.nav-inner` still lays out three flex children (`.nav-logo`, `.nav-cta`, `.nav-burger`) with `justify-content: space-between` and no wrapping below the 900px breakpoint, and `.nav-cta { flex-shrink: 0 }` keeps both the call button and the full-width "Devis gratuit" pill at full size instead of collapsing/hiding one of them for narrow screens.
- **Recommendation:** On mobile, either hide the icon-only call button and shrink "Devis gratuit" to fit next to the burger, or move the call button out of the nav row (e.g., into the mobile CTA bar that already exists in CSS as `.mobile-cta-bar`) so `.nav-inner` never exceeds the viewport width. Add an explicit test/breakpoint check that the hamburger button is always reachable within `100vw` at widths down to 320px (smallest common phone). This is a site-wide regression affecting every page and directly blocks access to the mobile nav menu (Méthode / Réalisations / FAQ links are unreachable on mobile without knowing to scroll the header sideways).

### 2. "Appeler" tap target below recommended minimum size on mobile
- **Severity:** High
- **Evidence:** The icon-only call button (`.btn-call`) in the mobile header measures 46px wide × 38px tall (from DOM `getBoundingClientRect`). This is under both the 48×48px target recommended in this audit's own checklist and the commonly cited 44×44px (WCAG 2.5.5 / Apple HIG) minimum, specifically on the height axis.
- **Recommendation:** Increase vertical padding on `.btn-call` (currently `padding: 10px 14px`) so the tappable area is at least 44–48px tall on mobile, independent of the icon's intrinsic size.

### 3. No visible phone number text in the mobile header (icon-only)
- **Severity:** Low
- **Evidence:** On mobile, `.btn-call` renders as a bare phone icon with no visible digits (the "Appeler" text label is present in desktop but effectively invisible/undersized in the mobile capture); the first place a mobile visitor sees the actual number "06 60 87 16 51" as readable text is far down the page (~top: 6131px on the homepage) or, on `contact.html`, inside the first content block (~top: 624px, roughly one screen down).
- **Recommendation:** This is an acceptable click-to-call pattern (tapping the icon does place the call), but consider surfacing the digits as visible text near the top of `contact.html` sooner, or adding a persistent bottom mobile CTA bar (the `.mobile-cta-bar` component already exists in the CSS/markup but its content/positioning should be verified once finding #1 is fixed) so the number is visible without any scrolling on every page, not just contact.

### 4. Hero background video is portrait-oriented, relying entirely on `object-fit: cover` cropping for the landscape hero
- **Severity:** Low / Info
- **Evidence:** The video's intrinsic dimensions are 960×1706 (portrait) while it's displayed in a landscape hero region (`object-fit: cover; object-position: center 55%`). This renders acceptably at the tested viewports (1440×900 and 390×844) since the crop framing looked correct in captures, but portrait source footage stretched to cover very wide (e.g., ultrawide 2560px+) or very short landscape viewports increases the risk of cropping out the intended subject (the pool edge/membrane detail) — not verified beyond the two tested widths.
- **Recommendation:** Spot-check the hero at 1920×1080 and at very short viewport heights (e.g., landscape mobile ~390×700) to confirm the subject stays framed; consider a landscape-shot or re-cropped video source for wider desktop breakpoints if not already handled elsewhere.

### 5. Before/After toggle interaction is JS-dependent (secondary risk only)
- **Severity:** Info
- **Evidence:** The `.ba-toggle` swap on `realisations.html` (4 instances) is driven by a click handler that updates label text ("Voir après" ⇄ "Voir avant") and swaps the visible photo/state; this was confirmed working with JS enabled. Behavior with JS fully disabled was not separately re-tested for this specific component (the homepage JS-disabled check only covered the H1/tel link), so it's unconfirmed whether the "Après" image/alt text is present in the initial DOM for non-JS crawlers or only becomes available on interaction.
- **Recommendation:** Confirm both "avant" and "après" `<img>` elements (with descriptive `alt` text) are present in the initial server-rendered HTML for each of the 4 comparison pairs, with only the *visual* toggle behavior gated by JS — this protects image-indexing/crawlability regardless of the header/JS finding above.

### 6. H1 accent styling relies on a `<br>` line break inside the string
- **Severity:** Info
- **Evidence:** The homepage H1 markup is `Donnez à votre piscine<br>une finition <span>d'exception</span>.` — visually this renders correctly (confirmed in screenshots), but `textContent`/`innerText` extraction (e.g., for `<title>`-adjacent SEO tooling, screen readers, or copy-paste) collapses to "Donnez à votre piscineune finition d'exception." with no space at the break point.
- **Recommendation:** Not a rendering bug, but consider replacing the bare `<br>` with a construct that preserves a text-level space (e.g., `<br aria-hidden="true"> ` with a following space, or CSS `display:block` on a wrapping span) so assistive tech and text-extraction tools don't concatenate the two lines without a space.

## Category Score: 62 / 100

**Justification:** Desktop presentation, hero video/canvas performance, JS-independent core content, and the interactive before/after comparison all work well and reflect a polished, conversion-oriented design (strong contrast, clear CTAs, phone number prominent on the contact page). However, a **Critical**, site-wide mobile defect drags the score down substantially: at a very common mobile viewport width (390px, e.g. iPhone 12–15), the header overflows horizontally, cutting off the primary "Devis gratuit" CTA button and pushing the hamburger menu completely off-screen and unreachable — meaning mobile visitors on every page of the site cannot open the navigation menu at all through normal interaction. Combined with an undersized "Appeler" tap target on mobile, this materially harms both usability and conversion for a local service business whose traffic is likely majority-mobile. Fixing finding #1 alone would likely move this score into the 80s.
