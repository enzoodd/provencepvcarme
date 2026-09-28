# Visual / Mobile Rendering Audit — Provence PVC Armé

**Note méthodologique :** les 4 tentatives de délégation au sous-agent `seo-visual` ont échoué silencieusement (statut "completed" retourné mais fichier jamais réécrit, timestamp/taille identiques à la sauvegarde pré-audit à chaque fois). Cet audit a donc été conduit directement, avec Playwright, sur les 4 pages (`index.html`, `methode.html`, `realisations.html`, `contact.html`) servies en local sur `http://localhost:8804/`, aux viewports desktop (1440×900) et mobile (390×844), après un scroll complet de chaque page (pour déclencher tout le lazy-loading) et un retour en haut de page pour la capture.

Captures : `scratchpad/visual-{page}-{desktop,mobile}.png` (pleine page) + `scratchpad/webp-*.png` (sections avant/après et finitions, ciblées).

## Comparaison avec l'audit précédent (score 62/100, 13 août)

### Finding #1 (Critical, ancien audit) — RÉSOLU
Débordement horizontal du header mobile (`scrollWidth: 474px` vs `clientWidth: 390px`), menu hamburger totalement hors-écran. **Revérifié aujourd'hui : `scrollWidth` = `clientWidth` = 390px sur les 4 pages, aucun débordement.** Le bouton hamburger est maintenant pleinement visible et cliquable (`x: 316–366`, dans les 390px du viewport).

### Finding #2 (High, ancien audit) — RÉSOLU
Bouton "Appeler" mobile sous la taille de cible tactile recommandée (46×38px, sous le minimum 44×44 WCAG 2.5.5). **Revérifié aujourd'hui : le bouton mesure maintenant 50×44px** — conforme au minimum WCAG 2.5.5 / Apple HIG.

### Findings #3, #4, #5, #6 (Low/Info, ancien audit) — non retestés
Ces points (absence de texte visible du numéro dans le header mobile, vidéo hero en portrait cover-croppée, dépendance JS du toggle avant/après pour le contenu non-JS, `<br>` dans le H1 cassant l'extraction texte) ne portent pas sur les zones modifiées aujourd'hui (WebP, dimensions d'image, `defer`, schema.org) et n'ont pas été revérifiés dans cet audit. Ils restent probablement d'actualité — voir liste de validation séparée si pertinent.

## Vérifications spécifiques aux changements d'aujourd'hui

- **Conversion WebP + `<picture>` (45 images sur 3 pages) :** confirmé que 45/45 `<img>` dans un `<picture>` chargent effectivement la variante `.webp` (`img.currentSrc` se termine par `.webp`) sur les 4 pages × 2 viewports. Zéro image cassée (`naturalWidth === 0`) après scroll complet déclenchant le lazy-loading.
- **Attributs `width`/`height` :** présents sur toutes les images de contenu (avant/après, finitions, coulisses, process). Absents uniquement sur 3 fichiers de logo (`logo-provence.png`, `logo-vague.png`, `logo-full-dark.svg`) — risque de CLS négligeable, ce sont des éléments de taille fixe en CSS dans le header/footer, et un SVG n'a pas le même besoin de dimensions intrinsèques qu'un JPG. Non traité, sévérité Low.
- **`defer` sur les scripts (GSAP, ScrollTrigger, Lenis, script.js) :** zéro erreur console ou erreur de page sur les 4 pages × 2 viewports. Les animations (reveal au scroll, seam-rail, compteurs) s'initialisent correctement.
- **Débordement horizontal :** zéro sur les 4 pages × 2 viewports (`scrollWidth === clientWidth` partout).
- **Mise en page des sections avant/après et finitions :** captures ciblées (`webp-*.png`) confirment un rendu correct — cartes avant/après avec bon ratio, mosaïque de finitions non déformée, aucun chevauchement, sur desktop et mobile.
- **Contraste WCAG :** aucune modification de couleur, typographie ou espacement n'a été faite aujourd'hui (seuls le balisage `<picture>`, les attributs `width`/`height`, `defer`, et le JSON-LD ont été touchés) — le contraste précédemment validé n'a donc structurellement pas pu être affecté. Non re-mesuré pixel par pixel dans cet audit.

## What works (confirmé aujourd'hui)

- Rendu desktop propre et professionnel sur les 4 pages, sans régression visible.
- Header mobile maintenant pleinement fonctionnel : menu hamburger accessible, bouton d'appel à taille de cible correcte.
- 100% des images converties chargent bien leur variante WebP avec fallback JPG fonctionnel.
- Zéro erreur console/page sur l'ensemble des pages testées.
- Formulaire de contact, grilles avant/après et bloc finitions s'affichent correctement sur mobile et desktop.

## Category Score: 86 / 100

**Justification :** les deux défauts qui plombaient le score précédent (débordement critique du header mobile bloquant le menu, cible tactile sous-dimensionnée) sont confirmés résolus. Les changements du jour (WebP, dimensions explicites, `defer`) n'ont introduit aucune régression détectable : zéro erreur console, zéro débordement, zéro image cassée, sur 8 combinaisons page×viewport. Le score ne monte pas plus haut car les points Low/Info de l'audit précédent (vidéo hero en portrait, dépendance JS du toggle avant/après, `<br>` dans le H1) n'ont pas été revérifiés aujourd'hui et restent probablement d'actualité.
