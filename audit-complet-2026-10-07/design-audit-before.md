# Audit design — Provence PVC Armé (provencepvcarme.fr)

**Date :** 2026-10-07
**Méthodologie :** Design Auditor Skill (19 catégories) — audit de code (HTML/CSS/JS, `C:\Users\oddon\Desktop\provencepvcarme`) + vérification live sur `https://provencepvcarme.fr` via Playwright/Chromium, desktop 1440px et mobile 375px, scroll progressif complet (paliers ~350px, pauses) pour déclencher les animations GSAP/ScrollTrigger avant tout jugement de longueur ou de débordement.
**Confiance :** 🟢 Haute (code source + rendu live croisés ; contrastes calculés programmatiquement selon la formule de luminance WCAG, pas estimés visuellement).
**Détecté :** Site statique HTML/CSS/JS vanilla, GSAP + ScrollTrigger + Lenis (CDN), Three.js pour le schéma 3D de `methode.html`. Pas de design system tiers (shadcn/MUI/etc.), tokens CSS maison (`:root` — couleurs, espacement 8pt-ish, rayons, ombres) globalement bien respectés.
**Portée confirmée non modifiable (validée par le client, non auditée comme problème) :** police Manrope/Inter + Instrument Serif du hero, alternance des couleurs de section, séparateurs or, rail vertical doré fixe (`.seam-rail`) comme élément de signature. Aucun effet ripple/goutte d'eau détecté sur l'ensemble du site — confirmé propre.

---

## Résumé exécutif

| Page | Score global | Score Accessibilité (Cat. 2,6,7,15,16) | 🚫 | 🔴 | 🟡 | 🟢 |
|---|---|---|---|---|---|---|
| index.html | **69/100** | 95/100 | 0 | 2 | 3 | 3 |
| methode.html | **86/100** | 96/100 | 0 | 0 | 3 | 2 |
| realisations.html | **83/100** | 96/100 | 0 | 1 | 2 | 1 |
| contact.html | **82/100** | 83/100 | 0 | 0 | 4 | 2 |
| mentions-legales.html | **51/100** | 84/100 | 1 | 4 | 1 | 1 |
| confidentialite.html | **55/100** | 84/100 | 1 | 3 | 2 | 1 |
| **SCORE GLOBAL DU SITE** | **71/100** | — | **2** | **10** | **15** | **10** |

*(Score global = moyenne simple des 6 pages. Formule de notation par page : 100 − blockers×12 − critiques×8 − warnings×4 − tips×1, plancher 0.)*

**Ce qui tire la note vers le bas :** les deux pages légales (`mentions-legales.html`, `confidentialite.html`) n'ont manifestement pas suivi la refonte du reste du site — elles utilisent encore l'ancien logo texte, n'ont pas le rail doré signature, n'ont pas de skip-link fonctionnel, et `mentions-legales.html` contient un numéro de SIRET resté en placeholder (`[SIRET À COMPLÉTER]`) ainsi qu'une adresse différente du reste du site. Sur les pages principales, le point n°1 demandé par le client — la duplication du bloc « Finitions » entre `index.html` et `methode.html` — est confirmé, pixel pour pixel (mêmes 3 images, même structure, juste un titre différent).

### Top problèmes 🚫 Bloquant / 🔴 Critique (tous pages confondues)

1. 🚫 **Skip-link et ancre `#main-content` absents** — `mentions-legales.html`, `confidentialite.html`. WCAG 2.4.1 (Bypass Blocks, niveau A).
2. 🔴 **Logo d'en-tête incohérent** — `mentions-legales.html` et `confidentialite.html` utilisent encore l'ancien logo texte (`⌇ Provence PVC Armé`) au lieu du logo image utilisé partout ailleurs. Le gap est même documenté dans un commentaire CSS (`css/style.css` ligne 261-264).
3. 🔴 **Rail doré vertical (élément signature) absent** — totalement manquant du HTML de `mentions-legales.html` et `confidentialite.html`.
4. 🔴 **Adresse de l'entreprise incohérente** — « Dieulefit, Drôme » dans le footer et le corps des pages légales vs « Montélimar » partout ailleurs (footer des 4 autres pages + schéma JSON-LD).
5. 🔴 **Numéro de SIRET en placeholder visible** dans `mentions-legales.html` (`[SIRET À COMPLÉTER]`, avec commentaire `<!-- TODO -->`) — obligation légale LCEN non remplie, publiée en production.
6. 🔴 **Vidéo de fond du hero sans contrôle pause/stop** et sans respect de `prefers-reduced-motion` pour la lecture elle-même — `index.html`. WCAG 2.2.2 (Pause, Stop, Hide, niveau A).
7. 🔴 **Rotation automatique des photos avant/après ne se met en pause qu'au survol/tactile, jamais au focus clavier** — `index.html` (bloc teaser) et `realisations.html` (grille complète). WCAG 2.2.2.

Le reste du rapport détaille chaque page, catégorie par catégorie, avec fichier/ligne/sélecteur et correctif concret.

---

## 1. index.html

**Scope :** page d'accueil — hero vidéo, Pourquoi nous choisir, Finitions (teaser), Réalisations (teaser), Zone d'intervention, FAQ, Marques, CTA final.
**Score : 100 − (2×8) − (3×4) − (3×1) = 100 − 16 − 12 − 3 = 69/100**
**Accessibilité (Cat 2,6,7,15,16) : 100 − (1×4 touch target) − (1×1 tip) = 95/100**

### 🔴 Critique

> **Vidéo de fond du hero sans mécanisme pause/stop**
> `<video class="hero-video" autoplay muted loop playsinline poster="media/hero-poster.webp">` (index.html, ligne 185) tourne indéfiniment sans bouton pause/stop visible, et `js/script.js` (lignes 67-97) ne coupe la lecture que pour l'effet de parallax quand `prefers-reduced-motion` est actif — pas pour la vidéo elle-même, qui continue de boucler.
> Fix : ajouter un bouton pause/stop discret (icône) superposé au hero, ET appeler `heroVideo.pause()` / ne pas déclencher `autoplay` quand `prefersReducedMotion` est vrai — exactement le traitement déjà appliqué à `.btn-call` (voir `css/style.css` ligne 318-320, qui cite explicitement WCAG 2.2.2 en commentaire : la vigilance existe déjà sur le site, juste pas ici).
> Base légale : WCAG 2.2.2 (Pause, Stop, Hide), niveau A.
> Localisation : index.html ligne 184-207 ; js/script.js lignes 67-97.

> **Rotation automatique avant/après : pause au survol/tactile uniquement, pas au focus clavier**
> `js/script.js` lignes 183-218 : `toggle.addEventListener("mouseenter"/"mouseleave"/"touchstart"/"touchend", ...)` mais aucun listener `focus`/`blur`. Un utilisateur clavier qui tabule jusqu'au bouton `.ba-toggle` (teaser « Quelques chantiers récents », 4 cartes) ne peut pas arrêter le cycle automatique de 4,5s.
> Fix : ajouter `toggle.addEventListener("focus", () => paused = true)` et `toggle.addEventListener("blur", () => paused = false)` à côté des listeners souris/tactile existants.
> Base légale : WCAG 2.2.2 (Pause, Stop, Hide), niveau A.
> Localisation : index.html lignes 348-385 (`.ba-pair--teaser`) ; js/script.js lignes 183-218.

### 🟡 À corriger

> **Section « Finitions » quasi identique à celle de methode.html**
> index.html lignes 294-339 reprend les 3 mêmes finitions (Bali / Pierre naturelle / Unis), les mêmes 3 photos par carte, la même animation d'éventail, avec juste un sous-titre différent de methode.html lignes 290-328. C'est le problème n°1 signalé par le client.
> Recommandation (à ne pas appliquer ici) : garder une seule version complète — idéalement sur `methode.html`, qui est la page dédiée au matériau — et remplacer la section index par un teaser plus léger (une seule image composite + lien « Voir toutes les finitions », sans dupliquer les 3 cartes animées). Cela réduit aussi la longueur de la page d'accueil (voir point suivant).

> **Cibles tactiles sous 44px sur les liens de nav et de footer**
> `.nav-links a` (css/style.css ligne 274-300) et `.footer-col a` (ligne ~1449+) n'ont aucun padding vertical : hauteur mesurée en live ≈ 21px (ex. « Méthode », « Réalisations », « FAQ » en desktop ; tous les liens de footer sur les 6 pages). Sous le minimum de 44px recommandé (iOS) et sous le minimum WCAG 2.2 SC 2.5.8 (24px CSS).
> Fix : ajouter `padding: 10-12px 0` sur `.footer-col a`, et un padding vertical équivalent sur `.nav-links a` en ajustant le positionnement du soulignement `::after` (ligne 289-297) en conséquence.
> Localisation : css/style.css, `.nav-links a` ligne 281, `.footer-col a` (section footer ~1440-1460). Reproduit à l'identique sur les 6 pages (composant partagé).

> **Page d'accueil longue avec deux sections « teaser » qui ne font que répéter une autre page**
> 9 sections pleines (hero, Pourquoi, Finitions, Réalisations teaser, Zones, FAQ, Marques, CTA, footer), dont deux (Finitions + Réalisations) ne servent qu'à renvoyer vers `methode.html` / `realisations.html` sans apporter d'information propre.
> Recommandation (à ne pas appliquer ici) : fusionner Finitions-teaser et Réalisations-teaser en un seul bloc compact « Découvrez notre travail » avec deux liens/onglets plutôt que deux sections pleine largeur — gain d'environ un écran de défilement, cohérent avec l'esprit sobre déjà en place.

### 🟢 Amélioration optionnelle

> **CLS mesuré ≈ 0,026 au chargement desktop** (sources : `.hero-inner`, `.nav-cta`, `.nav-links`, `.btn-call`) — reste dans la zone « Good » (<0,1) mais non nul, probablement dû au swap de police (`font-display: swap`) qui re-déclenche un reflow de la nav. Envisager `font-display: optional` pour Manrope sur la nav, ou réserver une hauteur de ligne plus stricte.

> **Liens « Avignon / Orange / … » de la zone d'intervention mesurent 42px de haut** (index.html ligne 407) — 2px sous la cible de 44px. Ajouter 1-2px de padding vertical.

> **Photos pleine résolution sans `srcset`/`sizes`** — ex. `media/after-4.jpg` 480 Ko, `before-3.jpg` 472 Ko — servies identiques à un visiteur mobile 375px et à un desktop 1440px. 49 images au total sur cette page (la plupart en `loading="lazy"`, ce qui atténue l'impact, mais le poids téléchargé reste le même une fois visible).

### ✅ Points positifs

- Aucune image sur 49 sans `alt` (vérifié par script), aucune balise de formulaire sans label, aucun bouton/lien sans nom accessible.
- Skip-link fonctionnel, premier élément focusable, ancre `#main-content` présente et correcte.
- Réductions de mouvement respectées pour GSAP/Lenis/parallax, badges de confiance en `role="img"` + `aria-label`, liens jamais distingués par la seule couleur (icône + soulignement + couleur).
- FAQ en `<details>` natif — accessibilité clavier/lecteur d'écran gratuite, pas de JS custom à maintenir.
- Pas de débordement horizontal détecté après scroll complet sur desktop ni mobile.

---

## 2. methode.html

**Scope :** méthode de pose (4 étapes), matériau (schéma 3D + tableau comparatif), finitions complètes, CTA final.
**Score : 100 − (3×4) − (2×1) = 100 − 12 − 2 = 86/100**
**Accessibilité : 100 − (1×4 touch target) = 96/100**

### 🟡 À corriger

> **Section Finitions dupliquée avec index.html** — voir détail ci-dessus (methode.html lignes 290-328). Recommandation : faire de cette page la version canonique complète, alléger celle d'index.

> **Cibles tactiles footer/nav <44px** — même composant partagé, même correctif que ci-dessus.

> **Schéma 3D du matériau (Three.js) sans repli si WebGL échoue**
> `js/membrane-scene.js` ligne 18 : `new THREE.WebGLRenderer({ canvas, ... })` n'est entouré d'aucun `try/catch`. Si le CDN jsDelivr est bloqué, si l'import map échoue, ou si WebGL est indisponible (contexte restreint, très vieux device), le canvas reste vide dans `.keyfacts-grid` (methode.html lignes 236-244) sans image statique de secours — alors que le `.membrane-scene` est `aria-hidden="true"` (décoratif), un visiteur voyant perd l'illustration pédagogique sans aucun repli visuel.
> Fix : envelopper l'initialisation du renderer dans un `try/catch`, et prévoir une image statique du schéma (ex. rendu de la coupe en PNG/WebP) affichée en `background` du conteneur avant que le canvas Three.js ne prenne le relais — elle resterait visible en cas d'échec silencieux.
> Localisation : js/membrane-scene.js ligne 1-30 ; methode.html lignes 236-244.

### 🟢 Amélioration optionnelle

> **Three.js + 2 addons chargés via CDN** pour une animation décorative de défilement — poids JS non négligeable pour l'effet obtenu, bien que déjà limité par un `IntersectionObserver` (ligne 299-300) qui évite de faire tourner le rendu hors écran. Envisager un bundle pré-optimisé/tree-shaké si le poids réel (vérifiable via Network) dépasse ~150 Ko compressé.

> **Compteur de process (« 01 », « 02 »… en grand filigrane) correctement décoratif** — rien à signaler, juste noté pour mémoire que `.process-step::before` est bien en `z-index:0` sous le contenu réel (ligne 800-812) : bon exemple de hiérarchie, pas un défaut.

### ✅ Points positifs

- Tableau comparatif « Liner classique / Membrane PVC armée » : distinction jamais par la seule couleur (icône ✓ teal vs — gris + couleur), contrastes vérifiés (texte clair sur marine 13,3:1, ink-soft sur sable 5,6:1) — exemplaire.
- Aucun débordement horizontal détecté même pendant l'animation scrub du `.compare-table` (faux positif documenté résolu après scroll complet + 500ms, confirmé par le script).
- Breadcrumb visuel + JSON-LD `BreadcrumbList` cohérents.
- CLS = 0 mesuré sur desktop et mobile.

---

## 3. realisations.html

**Scope :** galerie avant/après (4 paires), coulisses de chantier (7 photos), CTA final.
**Score : 100 − (1×8) − (2×4) − (1×1) = 100 − 8 − 8 − 1 = 83/100**
**Accessibilité : 100 − (1×4 touch target) = 96/100**

### 🔴 Critique

> **Rotation automatique avant/après : pas de pause au focus clavier** (identique à index.html, composant `.ba-toggle` partagé, ici sur les 4 paires de la grille principale `realisations.html` lignes 148-186). Même correctif : ajouter `focus`/`blur` à côté de `mouseenter`/`mouseleave`/`touchstart`/`touchend` dans js/script.js lignes 183-218.

### 🟡 À corriger

> **Poids d'image élevé sur une page-galerie** — 19 images en pleine résolution (avant/après 1200×1600 + coulisses 1100×1466/1200×1600), moyenne 400-480 Ko chacune, sans `srcset`/`sizes` adapté au viewport. `loading="lazy"` est bien présent partout, ce qui limite l'impact initial, mais un visiteur qui fait défiler toute la page télécharge la même définition qu'un desktop 1440px même sur un mobile 375px.
> Fix : générer 2-3 largeurs par photo (ex. 600/1000/1600px) et les servir via `srcset`+`sizes`.

> **Cibles tactiles footer/nav <44px** — même composant partagé.

### 🟢 Amélioration optionnelle

> **Figures `.coulisses-item` sans légende visible** — le texte descriptif n'existe que dans l'attribut `alt` (ex. « Détail des escaliers en membrane PVC armée »), invisible pour un visiteur voyant qui voudrait savoir ce qu'il regarde sans deviner. Un `<figcaption>` discret (comme sur les paires avant/après) renforcerait la lecture sans alourdir le design.

### ✅ Points positifs

- CLS = 0 mesuré sur desktop et mobile — aucun saut de mise en page.
- Toutes les images (19/19) ont un `alt` descriptif et spécifique (ville + teinte), pas de texte générique répété.
- Image de fond `page-hero-media` correctement marquée `alt=""` + conteneur `aria-hidden="true"` (décorative).
- Aucun débordement horizontal après scroll complet.

---

## 4. contact.html

**Scope :** formulaire de devis (upload photo inclus), bloc téléphone, infos pratiques (tabs).
**Score : 100 − (4×4) − (2×1) = 100 − 16 − 2 = 82/100**
**Accessibilité : 100 − (4×4) − (1×1) = 100 − 16 − 1 = 83/100**

### 🟡 À corriger

> **Aucun repère visuel pour les champs obligatoires**
> Nom, Téléphone, E-mail et Ville portent l'attribut `required` (contact.html lignes 150-167) mais sans astérisque, sans texte « obligatoire », et sans `aria-required="true"`. L'utilisateur ne découvre qu'un champ est requis qu'au moment où le navigateur affiche sa bulle de validation native au clic sur « Envoyer » — bulle qui ne reprend pas du tout l'habillage sombre et premium du reste du formulaire.
> Fix : ajouter un `*` après le libellé des 4 champs requis + une légende « * champs obligatoires » sous le formulaire + `aria-required="true"` sur chaque `<input>` concerné.
> Localisation : contact.html lignes 149-167.

> **Pas de validation ni de message d'erreur au blur, uniquement au submit natif du navigateur**
> Le formulaire s'appuie entièrement sur la validation HTML5 native (`required`, `type="email"`, `type="tel"`) déclenchée seulement à la soumission — aucune validation ni aucun message d'erreur personnalisé par champ, aucun `aria-describedby` reliant un champ à un message d'erreur.
> Fix : ajouter une validation légère au `blur` de chaque champ requis, avec un message inline relié par `aria-describedby`, cohérent visuellement avec `.form-status--error` déjà existant (css/style.css ligne 1424).
> Localisation : contact.html lignes 147-205 ; js/script.js lignes 220-264 (gère uniquement le succès/échec réseau, pas la validation de champ).

> **Onglets « Réactivité & couverture » sans navigation clavier par flèches**
> `role="tablist"` / `role="tab"` est bien posé (contact.html lignes 215-227), mais `js/script.js` lignes 132-149 ne gère que le `click` — aucune gestion de `ArrowLeft`/`ArrowRight` entre les deux `tab-chip`, contrairement au pattern attendu par les ARIA Authoring Practices pour un tablist. Les deux boutons restent atteignables au Tab normal, donc le contenu reste opérable, mais le modèle d'interaction attendu pour `role="tab"` n'est pas implémenté.
> Fix : ajouter la gestion clavier flèches gauche/droite avec déplacement du focus + activation, ou simplifier en remplaçant `role="tablist"`/`role="tab"` par de simples boutons (`<button>` sans rôle ARIA tab) si l'interaction complète n'est pas prioritaire.
> Localisation : js/script.js lignes 132-149 ; contact.html lignes 215-227.

> **Cibles tactiles footer/nav <44px** — même composant partagé que les autres pages.

### 🟢 Amélioration optionnelle

> **Champ « Photos du bassin » sans indication de format/poids accepté** — `accept="image/*" multiple` (contact.html ligne 194) sans texte d'aide visible (formats acceptés, nombre max, poids max). Ajouter une petite légende sous le champ.

> **Boutons natifs non stylés dans un formulaire par ailleurs entièrement personnalisé** — le bouton « Choose Files » et les `<select>` (« Type de piscine », « Nature du projet ») gardent le style par défaut du système, détonnant visuellement dans l'habillage sombre premium du formulaire (contact.html lignes 172-186, 192-195). Un style de `<select>` personnalisé (chevron custom, fond cohérent) et un bouton de fichier habillé renforceraient la cohérence visuelle déjà soignée partout ailleurs.

### ✅ Points positifs

- Labels tous correctement associés par encapsulation (`<label><span>…</span><input…></label>`) — pattern valide et robuste.
- Message de succès/erreur relié par `role="status"` + `aria-live="polite"` (contact.html ligne 204), texte humain et actionnable (« Une erreur est survenue… appelez-nous directement au 06 60 87 16 51 ») plutôt qu'un message technique — exemplaire pour Cat. 11/12.
- `autocomplete` correctement renseigné sur tous les champs pertinents (`name`, `tel`, `email`, `address-level2`).
- Bouton d'envoi affiche un état de chargement (« Envoi en cours… », `disabled`) puis une confirmation (« Demande envoyée ✓ ») — bonne couverture Cat. 11 (Peak-End).
- CLS quasi nul (0,0004 desktop / 0,0009 mobile), sources liées à l'animation des compteurs `<24h`/`~2h`, négligeable.

---

## 5. mentions-legales.html

**Scope :** page légale statique.
**Score : 100 − (1×12) − (4×8) − (1×4) − (1×1) = 100 − 12 − 32 − 4 − 1 = 51/100**
**Accessibilité : 100 − (1×12 skip-link) − (1×4 touch target) = 84/100**

Cette page n'a visiblement pas suivi la refonte appliquée au reste du site (hero vidéo, logo image, rail doré, skip-link). Elle partage son gabarit avec `confidentialite.html` — les deux portent les mêmes écarts.

### 🚫 Bloquant

> **Skip-link absent et ancre `#main-content` manquante**
> Les 4 autres pages (index, methode, realisations, contact) ont toutes `<a href="#main-content" class="skip-link">Aller au contenu principal</a>` juste après `<body>`, et `<main id="main-content">`. Sur `mentions-legales.html`, aucun skip-link n'existe, et `<main>` (ligne 61) n'a pas d'`id`. Un utilisateur clavier n'a aucun moyen de sauter directement au contenu et doit retraverser toute la nav à chaque page.
> Fix : copier le skip-link des autres pages et ajouter `id="main-content"` à `<main>`.
> Base légale : WCAG 2.4.1 (Bypass Blocks), niveau A.
> Localisation : mentions-legales.html, à insérer après la ligne 30 (`<body>`), et ligne 61 (`<main>`).

### 🔴 Critique

> **Logo d'en-tête différent du reste du site**
> mentions-legales.html lignes 34-37 utilise `<a class="nav-logo"><span class="nav-logo-mark">⌇</span><span class="nav-logo-text">Provence <em>PVC Armé</em></span></a>` (logo texte) au lieu de `nav-logo--image` avec les deux `<img>` (logo-provence.png + logo-vague.png) utilisé sur les 4 autres pages. Le décalage est confirmé dans le code lui-même : `css/style.css` ligne 261-264 commente explicitement « mentions-legales and confidentialite still use the original text+mark logo ».
> Fix : remplacer le bloc logo par celui des autres pages (voir index.html lignes 154-157).
> Localisation : mentions-legales.html lignes 34-37 ; css/style.css ligne 261-264 (commentaire confirmant l'écart connu).

> **Rail doré vertical (élément de signature) absent**
> `.seam-progress` et `.seam-rail` (présents en haut de `<body>` sur les 4 autres pages) n'existent pas du tout dans le HTML de cette page. L'élément explicitement désigné comme signature du site (voir `css/style.css` ligne 607, commentaire « signature element ») est donc invisible sur cette page.
> Fix : ajouter les deux blocs `<div class="seam-progress" id="seamProgress" aria-hidden="true"></div>` et `<div class="seam-rail" aria-hidden="true">…</div>` (copier index.html lignes 145-150).
> Localisation : mentions-legales.html, à insérer après `<body>`.

> **Adresse de l'entreprise incohérente avec le reste du site**
> Footer (ligne 141) et corps de page (ligne 81) indiquent « Dieulefit, Drôme », alors que le footer des 4 autres pages affiche « Montélimar » et que le JSON-LD `GeneralContractor` (présent sur index/methode/realisations/contact) déclare `addressLocality: "Montélimar"`. Une page légale avec une adresse différente du reste du site pose un vrai problème de cohérence et de confiance, pas seulement esthétique.
> Fix : vérifier l'adresse exacte à utiliser (siège réel vs zone d'intervention communiquée) et harmoniser partout — footer des 6 pages + JSON-LD + corps des mentions légales.
> Localisation : mentions-legales.html lignes 81, 141.

> **Numéro de SIRET laissé en placeholder visible en production**
> Ligne 84-85 : `<!-- TODO: ajouter SIRET --> <li>Numéro SIRET : [SIRET À COMPLÉTER]</li>`. Au-delà du placeholder (traité comme critique dès le stade « dev handoff » par la méthodologie), la loi LCEN impose un numéro SIRET (ou équivalent) sur les mentions légales d'un site professionnel français — c'est donc aussi un manquement légal actif, publié en ligne.
> Fix : renseigner le vrai numéro SIRET et retirer le commentaire TODO.
> Localisation : mentions-legales.html ligne 84-85.

### 🟡 À corriger

> **Cibles tactiles footer/nav <44px** — même composant partagé que les autres pages.

### 🟢 Amélioration optionnelle

> **`<script src="js/script.js"></script>` sans attribut `defer`** — présent avec `defer` sur les 4 autres pages (`<script src="js/script.js" defer>`). Sans impact fonctionnel ici car le script est placé juste avant `</body>`, mais c'est un signe de plus que cette page n'a pas reçu le même passage de nettoyage/standardisation que le reste du site.
> Localisation : mentions-legales.html ligne 154.

### ✅ Points positifs

- Contenu juridique clair, structuré par `<h2>` cohérents, longueur de ligne confortable (`.section-inner--narrow`, max-width 720px).
- Contrastes du texte légal conformes (ink sur paper 13,2:1).
- Pas de débordement horizontal, CLS = 0.

---

## 6. confidentialite.html

**Scope :** politique de confidentialité RGPD.
**Score : 100 − (1×12) − (3×8) − (2×4) − (1×1) = 100 − 12 − 24 − 8 − 1 = 55/100**
**Accessibilité : 100 − (1×12 skip-link) − (1×4 touch target) = 84/100**

Même gabarit que `mentions-legales.html` — partage les mêmes écarts structurels (non listés deux fois en détail, voir page 5 pour le détail technique identique).

### 🚫 Bloquant

> **Skip-link absent et ancre `#main-content` manquante** — identique à mentions-legales.html. Localisation : confidentialite.html, à insérer après la ligne 30 ; `<main>` ligne 61 sans `id`.

### 🔴 Critique

> **Logo d'en-tête différent du reste du site** — identique à mentions-legales.html. Localisation : confidentialite.html lignes 34-37.

> **Rail doré vertical (élément de signature) absent** — identique à mentions-legales.html. Localisation : confidentialite.html, à insérer après `<body>`.

> **Adresse de l'entreprise incohérente** — footer ligne 140 : « Dieulefit, Drôme » vs « Montélimar » partout ailleurs. Localisation : confidentialite.html ligne 140.

### 🟡 À corriger

> **Information RGPD incomplète : pas de mention du droit de réclamation CNIL ni de la portabilité des données**
> La section « Vos droits » (confidentialite.html lignes 98-99) cite le droit d'accès, de rectification et de suppression, mais omet le droit à la portabilité des données et surtout le droit d'introduire une réclamation auprès de la CNIL — une mention attendue par l'article 13(2)(d) du RGPD.
> Fix : ajouter une phrase du type « Vous disposez également d'un droit à la portabilité de vos données et du droit d'introduire une réclamation auprès de la CNIL (cnil.fr). »
> Localisation : confidentialite.html lignes 98-99.
> *(Note : vérifier ce point avec un conseil juridique pour votre situation spécifique — ce rapport signale un pattern UI/contenu détectable, pas un avis légal.)*

> **Cibles tactiles footer/nav <44px** — même composant partagé que les autres pages.

### 🟢 Amélioration optionnelle

> **`<script src="js/script.js"></script>` sans `defer`** — identique à mentions-legales.html. Localisation : confidentialite.html ligne 153.

### ✅ Points positifs

- Politique rédigée en langage clair, sans jargon inutile, section « Cookies » honnête (« ce site n'utilise actuellement aucun cookie de suivi ») — bonne pratique de transparence.
- Finalité du traitement des photos explicitement limitée (pas d'usage commercial sans accord explicite) — bon niveau de détail RGPD pour le reste du contenu.
- Pas de débordement horizontal, CLS = 0.

---

## Annexe — vérifications transverses effectuées

- **Contrastes calculés (luminance WCAG, formule exacte)** sur toutes les paires couleur texte/fond identifiées dans `css/style.css` : texte principal sur fond clair (13,2:1), texte clair sur marine (13,3:1), `.eyebrow` lagon-deep sur paper/sable (6,5:1 / 5,5:1), `--gold` et `--lagon` en usage réel toujours sur fond marine (6,6:1 / 3,7:1 — ce dernier suffisant car utilisé en contour de focus/UI, seuil 3:1), boutons `.btn-primary` (dégradé lagon-deep, commentaire CSS ligne 331-333 montrant qu'un premier passage de correction de contraste a déjà eu lieu), `.mobile-cta-bar` (lagon-deep/paper, 6,45:1). Aucune combinaison réellement utilisée en production n'est sous le seuil AA — la couleur `--error` (#E8776B), qui échouerait sur fond clair (2,6:1), n'est en pratique jamais posée sur un fond clair : elle sert uniquement de fond teinté à 16% sur le formulaire de contact (sur fond marine, texte clair résultant à 10,8:1) et de trait du cercle de la carte de zone.
- **CLS mesuré en conditions réelles** (PerformanceObserver, scroll complet) : 0 sur 8 des 12 combinaisons page×viewport, ≤0,001 sur 2, et un seul cas notable à 0,026 (index desktop) — toutes largement sous le seuil « Good » de 0,1.
- **Débordement horizontal** : `scrollWidth` vs `clientWidth` vérifié après scroll complet + pause sur les 6 pages × 2 viewports = aucun écart détecté, y compris sur `.compare-table` de methode.html (confirme que le faux positif documenté est bien résolu après le scroll complet).
- **Alt text / labels de formulaire / noms accessibles** : script d'audit DOM exécuté sur chaque page — 0 image sans `alt` (sur 136 images cumulées), 0 champ de formulaire sans label associé, 0 bouton/lien sans nom accessible.
- **Ordre de tabulation** : vérifié sur les 6 pages — skip-link (quand présent) toujours premier, puis logo, puis nav, cohérent avec l'ordre visuel.
