# Audit Visuel / Rendu Mobile — Provence PVC Armé

**Méthodologie :** site LIVE `https://provencepvcarme.fr` (HTTP 200), audité avec Playwright/Chromium headless. 5 pages testées : `index.html`, `methode.html`, `realisations.html`, `contact.html`, `pose-membrane-pvc-arme-avignon.html` (page ville représentative). Deux viewports (desktop 1366×900, mobile 390×844 avec UA iPhone) × deux modes de capture (`fold` = premier écran sans scroll, `full` = pleine page après un scroll progressif par paliers de ~400px + pauses, pour déclencher les animations GSAP ScrollTrigger avant capture) = 20 combinaisons page×viewport×mode. Débordement horizontal (`scrollWidth` vs `clientWidth`) mesuré à trois moments : au fold, après le scroll complet (`full`), et une troisième fois après une pause de 500 ms supplémentaire post-scroll (`settledOverflowAfterPause`) pour neutraliser le faux positif transitoire déjà documenté sur `.compare-table` de `methode.html`.

Captures : `C:\Users\oddon\Desktop\provencepvcarme\provencepvcarme.fr-audit\screenshots\<page>-<desktop|mobile>-<fold|full>.png` (20 fichiers) + captures ciblées `_crop-*.png` (tableau comparatif, hero réalisations, section sombre méthode, footer mobile).
Données brutes : `C:\Users\oddon\Desktop\provencepvcarme\provencepvcarme.fr-audit\capture-data.json`.

Référence de comparaison : `provencepvcarme.fr-audit-PREVIOUS-20260928\findings\visual.md` et `FULL-AUDIT-REPORT.md` du même dossier, qui documentaient un menu mobile cassé à 390 px comme point critique (header débordant de 84 px, bouton "Devis gratuit" tronqué, hamburger totalement hors écran) et un bouton "Appeler" mobile sous-dimensionné (46×38 px).

## Corrigé depuis le dernier audit

### 1. Menu mobile à 390px — RÉSOLU (était Critical)
Vérifié sur les 5 pages testées, aux deux modes (`fold` et `full`) : `document.documentElement.scrollWidth === clientWidth === 390` partout, `overflowAmount: 0` sans une seule exception dans les 20 relevés de `capture-data.json` (y compris la mesure `settledOverflowAfterPause`). Le bouton hamburger est intégralement dans le viewport (`left: 316, right: 366, top: 16, width: 50, height: 44, inViewport: true`) sur `index`, `methode`, `realisations`, `contact` et `avignon`. Aucun texte de CTA tronqué observé dans les captures `*-mobile-fold.png`. Le header mobile (logo, bouton appel, burger) tient proprement sur les 390 px sans aucun `flex-wrap` cassé.

### 2. Cible tactile du bouton "Appeler" mobile — RÉSOLU (était High)
Précédemment mesuré à 46×38 px (sous le minimum 44×44, WCAG 2.5.5 / Apple HIG). Aujourd'hui : **50×44px** sur les 5 pages testées, en mode `fold` comme en `full` — conforme au minimum recommandé sur les deux axes.

## Toujours ouvert (mineur, non bloquant)

### 3. Quelques cibles tactiles secondaires sous 44px sur mobile
- **Sévérité : Medium** — Le CTA secondaire du hero `index.html`, "Voir la méthode" (`.btn-ghost`), mesure 146×37px : sous le seuil recommandé de 44px en hauteur. C'est un lien d'action visible au-dessus de la ligne de flottaison, donc plus susceptible d'être manqué au doigt qu'un lien secondaire enfoui.
- **Sévérité : Low** — Les badges de villes sur la home (Avignon, Orange, Pierrelatte, Valence, Marseille, Montpellier, Aix-en-Provence) mesurent 84–141×42px : 2px sous le seuil AAA de 44px, mais largement au-dessus du seuil AA (WCAG 2.5.8, 24×24px). Impact pratique négligeable.
- **Sévérité : Low** — La liste de liens du footer (Navigation, Secteurs, Contact, Légal — ~24 liens au total sur chaque page) mesure chaque `<a>` à 342×21px en hauteur brute de bounding box. Cependant la capture ciblée (`_crop-footer-mobile.png`) montre un espacement vertical généreux entre les liens (~30px de rythme), ce qui réduit fortement le risque de mis-tap malgré la hauteur de hitbox techniquement sous le seuil. Amélioration possible (padding vertical sur les `<a>` du footer) mais impact utilisateur faible — liens de bas de page, pas un chemin de conversion primaire.
- **Sévérité : Low / Info** — Quelques liens inline dans le corps de texte (breadcrumb "Accueil", liens "Orange" / "Pierrelatte" / "toute la zone d'intervention" dans le paragraphe de `pose-membrane-pvc-arme-avignon.html`) ont des hitbox de 16–18px de hauteur — pattern normal pour des liens de texte courant, non traité comme un défaut de conception.

### 4. Barre CTA mobile sticky en bas de page chevauche légèrement la dernière ligne du footer
- **Sévérité : Low / Info** — Sur mobile, la barre persistante "Demander un devis gratuit" (`.mobile-cta-bar` ou équivalent) reste fixée en bas d'écran même arrivé tout en bas de la page, et recouvre partiellement la toute dernière ligne du footer (liens légaux / copyright), visible dans `_crop-footer-mobile.png`. Impact très limité : ce ne sont que les mentions légales et le copyright, pas un lien de conversion.

### 5. Points de l'audit précédent non re-testés aujourd'hui
Hors du périmètre des 5 pages/2 viewports/2 modes couverts par cet audit : dépendance JS du toggle avant/après pour le contenu non-JS, `<br>` dans le H1 cassant l'extraction texte pur. Non re-vérifiés, statut inchangé présumé.

## Régression / nouveau problème — Aucune détectée

Vérification ciblée des deux refontes visuelles récentes :

- **`methode.html` — section intro fusionnée + nouveau tableau comparatif liner/membrane + fond SVG monogramme sur sections sombres :** rendu propre sur desktop (1366px) et mobile (390px). Le tableau comparatif (`_crop-methode-mobile-comparetable.png`) s'affiche en 3 colonnes bien lisibles sur mobile sans débordement ni retour à la ligne cassé, contraste correct (fond beige/liner classique vs fond marine/membrane armée avec coche teal). Le motif SVG monogramme sur la section CTA sombre est discret, ne chevauche aucun texte, visible en fond du bloc "Prêt à démarrer votre projet ?" sur desktop et mobile (`methode-desktop-full.png`). Aucun débordement horizontal mesuré (`overflowAmount: 0` en fold, full, et settled sur les deux viewports).
- **`realisations.html` — nouvelle section hero avec photo de fond (remplace un bloc texte sur fond clair) :** rendu vérifié via capture ciblée (`_crop-realisations-hero-desktop.png`, `_crop-realisations-hero-mobile.png`) : photo de piscine en fond avec overlay sombre, bon contraste texte blanc/breadcrumb teal, H1 "Avant / Après" parfaitement lisible, aucun chevauchement avec le header sticky ni avec la section suivante. Fonctionne aussi bien en desktop qu'en mobile.
- Sur les 20 combinaisons page×viewport×mode : **0 image cassée** (`naturalWidth === 0`) sur un total de 49 (`index`), 16 (`methode`), 19 (`realisations`), 3 (`contact`) et 4 (`avignon`) images par page ; **0 erreur console** ; **0 requête réseau échouée** (aucune réponse ≥400, aucun `requestfailed`).

## What works (confirmé aujourd'hui)

- Header mobile 390px entièrement fonctionnel : hamburger accessible et cliquable, bouton d'appel à taille de cible conforme, aucun débordement horizontal sur les 5 pages testées.
- Above-the-fold desktop de `index.html` : H1 entièrement visible sans scroll, CTA primaire "Demander un devis gratuit" visible sans scroll, hero propre et bien contrasté.
- Zéro débordement horizontal, zéro image cassée, zéro erreur console/réseau sur l'intégralité des 20 combinaisons testées.
- Les deux refontes récentes (tableau comparatif `methode.html`, hero photo `realisations.html`) s'intègrent sans régression visuelle détectable, desktop et mobile.
- Page ville `pose-membrane-pvc-arme-avignon.html` : rendu cohérent avec le reste du site, header et footer partagés fonctionnent normalement, breadcrumb clair.

## Catégorie Score : 91 / 100

**Justification :** les deux défauts qui plombaient lourdement le score de l'audit de référence — menu mobile totalement cassé et inatteignable à 390px (Critical), cible tactile "Appeler" sous-dimensionnée (High) — sont confirmés **résolus** aujourd'hui sur un périmètre élargi (5 pages au lieu de 4, testées en fold *et* full, avec triple mesure du débordement). Les deux refontes visuelles récentes (tableau comparatif de `methode.html`, hero photo de `realisations.html`) ont été vérifiées spécifiquement et n'introduisent aucune régression : rendu propre, contrasté, sans débordement ni chevauchement sur desktop comme mobile. Le score ne monte pas plus haut en raison de points mineurs non bloquants : quelques cibles tactiles secondaires sous le seuil de 44px (CTA "Voir la méthode", badges de villes, liste de liens du footer), et un léger chevauchement cosmétique entre la barre CTA sticky mobile et la toute dernière ligne du footer. Aucun de ces points n'affecte la navigation principale, la conversion, ou l'accessibilité au sens critique du terme.
