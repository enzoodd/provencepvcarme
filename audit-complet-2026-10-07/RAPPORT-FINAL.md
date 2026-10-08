# Rapport final — Audit complet + corrections (design + SEO)

**Date :** 2026-10-07 · **Site :** provencepvcarme.fr (repo `enzoodd/provencepvcarme`, GitHub Pages)

---

## 1. Scores avant / après

### Design (design-auditor skill, 6 pages × desktop 1440px + mobile 375px)

| Page | Avant | Après | Δ | Détail |
|---|---|---|---|---|
| index.html | 69 | **93** | +24 | 2 🔴 corrigés (vidéo pause, rotation clavier) ; 1 🟡 sur 3 corrigé (Finitions allégée) ; page encore longue (2 teasers → 1 seul allégé) |
| methode.html | 86 | **94** | +8 | 1 🟡 sur 3 corrigé (duplication Finitions résolue côté index) ; reste : pas de repli si WebGL échoue sur le schéma 3D |
| realisations.html | 83 | **95** | +12 | 1 🔴 corrigé (rotation clavier) ; 1 🟡 sur 2 corrigé (cibles tactiles) ; reste : photos sans `srcset` responsive |
| contact.html | 82 | **94** | +12 | 3 🟡 sur 4 corrigés (champs requis, navigation clavier des onglets, cibles tactiles) ; reste : validation au blur par champ |
| mentions-legales.html | 51 | **84** | +33 | 🚫 corrigé (skip-link), 2 🔴 sur 4 corrigés (logo, rail doré) ; reste : SIRET (bloqué) + adresse (voir note ci-dessous) |
| confidentialite.html | 55 | **92** | +37 | 🚫 corrigé (skip-link), 2 🔴 sur 3 corrigés (logo, rail doré), 🟡 RGPD corrigé ; reste : adresse (voir note) |
| **Score global design** | **71** | **≈ 92** | **+21** | |

> **Méthode du score "après" :** recalculé avec la même formule que l'audit (`100 − 🚫×12 − 🔴×8 − 🟡×4 − 🟢×1`), en vérifiant un par un, par le code et par un test fonctionnel Playwright, lesquels des problèmes listés dans `design-audit-before.md` sont réellement corrigés. Je n'ai pas relancé un audit complet à l'aveugle une seconde fois : la comparaison item par item est plus précise et évite qu'un nouvel audit ne "redécouvre" différemment les mêmes points.
> **Note adresse (mentions-legales/confidentialite) :** l'audit design signale "Dieulefit" (pages légales) vs "Montélimar" (reste du site) comme une incohérence. **Je ne l'ai pas corrigée** : c'est l'état voulu, explicitement demandé dans ce brief ("Mettre uniquement Dieulefit, Drôme dans les mentions légales. Pour le SEO local, garder Montélimar"). Je la laisse comptée dans le score par souci de rigueur (c'est objectivement ce qu'un visiteur ou un crawler voit), mais ce n'est pas un bug.

### SEO (score du 2026-09-28, avant cette session de corrections)

Je n'ai pas relancé les 9 audits spécialistes une seconde fois (coût très élevé pour un retour sur un périmètre déjà très largement vérifié mécaniquement). À la place, j'ai vérifié directement chaque point corrigé.

| Catégorie | Score du 2026-09-28 | État après cette session |
|---|---|---|
| Technique | 80/100 | Inchangé (rien de nouveau cassé, vérifié) |
| Performance | 44/100 | **LCP `realisations.html` : 11,2s → 6,1s (−45 %)** sur le même profil de mesure throttlé ; régression de la session précédente corrigée |
| Contenu | 60/100 | FAQ déjà conforme (130-170 mots) ; reste : SIRET, preuve sociale |
| Schema | 58/100 | HowTo corrigé (phrase désynchronisée du texte visible) ; FAQPage ajouté sur les 7 pages ville ; `priceRange` générique retiré ; NAP inchangé (voir note adresse) |
| Sitemap | 92/100 | `lastmod` réels sur les 13 URLs (corrige les 4 dates obsolètes relevées) |
| Local | 38/100 | Inchangé (dépend de GBP/avis, hors du périmètre "corrections sans risque") |
| GEO/IA | 74/100 | Inchangé |
| Visuel/Mobile | 91/100 | Cibles tactiles nav/footer améliorées (~21px → ~40-43px) sur les 13 pages |
| SXO | 77/100 | SIRET reste le point n°1 signalé (bloqué, voir section 4) |

---

## 2. Ce qui a été corrigé, par commit

**`Audit SEO complet du 2026-09-28`** — audit de référence (déjà réalisé avant cette session, committé au début de celle-ci).

**`Chantier 0 (1/2)`** — suppression de tout effet ripple/goutte d'eau :
- Shader Three.js "eau qui ondule" supprimé du header de `methode.html` (fichier `js/water-scene.js` entier + canvas HTML + règle CSS).
- Animation "goutte qui coule" du `scroll-cue` remplacée par un simple pulse d'opacité.
- Réutilisation du même scroll-cue (déjà validé) en bas du header de `methode.html`, libellé "Jusqu'au premier bain".
- Carte radar de la zone d'intervention agrandie (430px → 520px desktop, 320px → 380px mobile).
- Section "Le matériau" fusionnée en grille 2 colonnes sur desktop (visuel 3D + tableau comparatif côte à côte, plus compact que l'empilement vertical précédent) ; chiffres en double dans le texte d'intro retirés (déjà présents dans le tableau juste à côté).

**`Chantier 0 (2/2)`** — vidéo hero :
- `hero-bg.mp4` réencodé (H.264 CRF 36) : 1,33 Mo → 1,00 Mo, qualité vérifiée visuellement identique ; au passage, un tag colorimétrique HDR/BT.2020 incorrect hérité du fichier source a disparu (pouvait causer un rendu légèrement différent selon navigateur).
- Poster WebP généré et branché (`media/hero-poster.webp`).

**`Audit SEO complet du 2026-09-28`** (committé en même temps, travail de la session précédente) — voir `provencepvcarme.fr-audit/`.

**`SEO (1/n)`** :
- Title (50-60 car.) et meta description (140-160 car.) ajustés sur les 13 pages. La description de `index.html` ne liste plus les villes individuellement, ce qui corrige au passage l'incohérence Marseille (présentée comme couverte alors que sa page dédiée dit le contraire).
- `priceRange: "€€"` (valeur générique) retiré des 4 blocs `GeneralContractor`.
- HowTo de `methode.html` : phrase désynchronisée entre JSON-LD et texte visible ("le bassin" vs "votre bassin") recollée.
- FAQPage JSON-LD ajouté aux 7 pages ville, extrait du HTML visible existant, vérifié mot pour mot identique.

**`Design (1/n) + SEO (2/n)`** :
- `mentions-legales.html` / `confidentialite.html` : skip-link + ancre `#main-content` ajoutés (WCAG 2.4.1), rail/barre de progression dorés ajoutés, logo texte remplacé par le logo image (header **et** footer) partout ailleurs sur le site, `defer` ajouté sur `js/script.js`.
- `confidentialite.html` : droit à la portabilité + droit de réclamation CNIL ajoutés dans "Vos droits" (RGPD art. 13(2)(d), manquant).
- Vidéo hero `index.html` : bouton pause/lecture visible ajouté (coin bas-droit), vidéo mise en pause automatiquement si `prefers-reduced-motion` est actif (WCAG 2.2.2).
- Rotation automatique avant/après (`.ba-toggle`, composant partagé accueil + réalisations) : pause ajoutée au focus clavier, en plus du survol/tactile déjà géré (WCAG 2.2.2).
- Cibles tactiles des liens de nav et de footer (13 pages) : hauteur mesurée ~21px → ~40-43px.
- Attributs `width`/`height` ajoutés sur les 3 logos repris sur les 13 pages (seul point manquant de l'audit images).

**`Design (2/n)`** :
- `contact.html` : astérisque + `aria-required="true"` sur les 4 champs obligatoires, légende "* Champs obligatoires" ; navigation clavier flèches/Home/End sur les onglets "Réactivité & couverture" (pattern ARIA tablist).
- `index.html`, section Finitions : version animée à 9 images remplacée par un aperçu statique à 3 images (une par famille). La version complète et animée reste uniquement sur `methode.html`. C'était le point n°1 signalé dans le brief (répétition index/méthode).

**`SEO/Perf (3/n)`** :
- `realisations.html` : régression de performance mesurée et corrigée — `fetchpriority="high"` + `<link rel="preload">` sur la photo hero ; chargement différé réel (IntersectionObserver, `rootMargin: 50px`) sur les 8 photos de la grille avant/après, qui se chargeaient toutes dès l'arrivée sur la page malgré `loading="lazy"` natif (la grille est trop proche du haut de page pour que le seuil natif du navigateur s'applique). **LCP mobile mesuré : 11,2s → 6,1s.**
- `sitemap.xml` : `lastmod` mis à jour sur les 13 URLs pour refléter les modifications réelles de ce jour (corrige les dates obsolètes relevées sur 4 pages ville + les 2 pages légales).

**Vérifications finales (ce rapport)** :
- HTML bien formé + JSON-LD valide sur les 13 pages (script de validation).
- Balayage complet des 13 pages × 2 viewports (desktop 1440px, mobile 375px) avec scroll progressif complet : **0 débordement horizontal, 0 image cassée, 0 erreur console, 0 requête réseau échouée** sur les 26 combinaisons testées.

---

## 3. À VALIDER PAR ENZO

Ce que je n'ai **pas** appliqué moi-même, parce que ça touche à une décision de contenu, de design ou de priorité :

1. **Réduire encore la page d'accueil.** Le rapport design-auditor propose de fusionner le teaser "Finitions" (déjà allégé) et le teaser "Réalisations" en un seul bloc compact — je ne l'ai pas fait, c'est une vraie décision de structure. Dis-moi si tu veux que je l'applique.
2. **Fiches "études de cas" sur `realisations.html`.** Le brief demandait de préparer la structure (lieu, type de bassin, travaux) pour les 4 chantiers réels (La Motte-Chalancon, Pont-de-Barret, Avignon, Poët-Laval). Je n'ai **pas** créé cette structure : seul le chantier d'Avignon a un fait vérifié en plus de la finition (construction neuve, déjà écrit sur sa page ville) — pour La Motte-Chalancon, Pont-de-Barret et Poët-Laval, je ne connais ni le type de bassin ni la nature exacte des travaux, et je ne voulais pas inventer 3 fiches sur 4 à moitié vides à côté d'une seule complète. Si tu me donnes ces infos (ou confirmes qu'il n'y en a pas d'autres), je peux construire les fiches proprement.
3. **Validation de formulaire au blur (`contact.html`).** L'audit recommande un message d'erreur par champ au moment où l'utilisateur quitte le champ, plutôt que seulement à la soumission. Je ne l'ai pas fait : c'est un chantier JS plus conséquent (UX de validation complète), pas un correctif ponctuel.
4. **Repli visuel si le schéma 3D (Three.js) échoue** sur `methode.html` — nécessite de générer une image statique de secours du schéma, que je n'ai pas produite.
5. **`srcset` responsive sur les photos de `realisations.html`** (19 images en pleine résolution, ex. 1200×1600, servies identiques à un mobile 375px) — nécessite de générer plusieurs largeurs par photo, hors du périmètre "corrections sans risque" de cette session.
6. **Score Technique/SEO détaillé "après"** — je n'ai pas relancé les 9 agents spécialistes une seconde fois (coût disproportionné par rapport aux points réellement en jeu) ; les corrections concrètes sont listées section 2 et vérifiées individuellement.

---

## 4. BLOQUÉ / EXTERNE — rien n'a été inventé pour ces points

- **Numéro SIRET** — toujours un placeholder `[SIRET À COMPLÉTER]` dans `mentions-legales.html`. C'est le point signalé comme prioritaire par pratiquement tous les audits (contenu, local, SXO, GEO, design). Obligation légale LCEN active. Je ne peux pas l'inventer — j'ai besoin du vrai numéro.
- **Fiche Google Business Profile** — aucune trace détectée (pas de `sameAs`, pas d'embed Maps). À créer/connecter de ton côté.
- **Vrais avis clients** — zéro avis/témoignage sur le site. Je n'en ai inventé aucun. Si tu as de vrais retours clients (même informels), donne-moi le texte exact et le prénom/ville, et je les intègre avec un schema `Review`/`AggregateRating`.
- **Attestation d'assurance décennale** — mentionnée nulle part sur le site, légalement recommandée pour ce type de chantier. Je n'ai pas inventé de texte : dis-moi la compagnie/référence si tu veux que je l'ajoute.
- **Adresse légale réelle** — confirmée dans ce brief comme volontairement différente de "Montélimar" (utilisé pour le SEO local). Je l'ai laissée telle quelle.

---

## 5. Ce qui reste pour se rapprocher de 100 %

Par ordre d'impact :

1. **SIRET réel** (quelques minutes une fois le numéro en main) — débloque à lui seul une bonne partie des points perdus sur mentions-legales.html, mais aussi en contenu/SXO/local.
2. **Avis clients / fiche GBP** — le point le plus pénalisant en SEO local (`38/100`), sans solution de contournement possible sans vraies données.
3. **`srcset` responsive** sur les galeries (`realisations.html` en particulier) — gain de performance mobile réel, nécessite de générer plusieurs tailles par photo (outil ou service dédié).
4. **Fusionner les 2 teasers de l'accueil** (Finitions + Réalisations) en un seul bloc — allégerait encore la page, décision de structure à valider.
5. **Fiches par chantier sur `realisations.html`** — en attente des informations manquantes (point 2 de la section "À valider").
6. **Validation de formulaire au blur + repli WebGL methode.html** — chantiers techniques de taille modeste mais réels.
7. **En-têtes de sécurité (HSTS/CSP), SRI sur les scripts CDN, page 404 personnalisée, `llms.txt`, `sameAs`** — déjà identifiés dans l'audit SEO du 28/09, non traités cette session (priorité moindre, certains nécessitent un proxy Cloudflare que GitHub Pages seul ne permet pas).

---

## 6. Autres skills qui pourraient t'être utiles

- **`seo-image-gen`** ou un outil de génération de `srcset` — pour le point 3 ci-dessus (images responsives), qui revient dans plusieurs audits sans jamais être traité faute d'outil adapté dans cette session.
- **`seo-google`** — une fois Google Search Console connecté, pour suivre l'indexation réelle et les données Core Web Vitals de terrain (CrUX), qui manquaient à tous les audits de performance faute de trafic réel accumulé.
- **`seo-local` / `seo-maps`** — utile une fois la fiche Google Business Profile créée, pour vérifier la cohérence des citations (Pages Jaunes, Societe.com...) et suivre le classement local.

---

## Confirmation finale

- Les 9 commits de cette session sont poussés sur `origin/main` (dernier commit : `df69d24`).
- Le site en ligne (`https://provencepvcarme.fr`, GitHub Pages) reflète ces commits dans les minutes qui suivent le push (délai de build GitHub Pages standard).
- Aucune régression détectée : 13 pages × 2 viewports vérifiées (scroll complet), 0 débordement, 0 image cassée, 0 erreur console.
