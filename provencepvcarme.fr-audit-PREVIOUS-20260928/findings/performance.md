# Audit Performance — provencepvcarme.fr (local)

**Score estimé : 58/100** (estimation manuelle documentée — Lighthouse/PSI indisponibles en environnement local, aucun accès réseau public vers l'URL de prod. Toutes les valeurs ci-dessous sont mesurées sur le filesystem local et le serveur `http://localhost:8804`, sauf mention contraire "estimation".)

## Méthodologie

- Serveur testé : `http://localhost:8804` (fichiers statiques servis depuis `C:\Users\oddon\Desktop\provencepvcarme`)
- Mesures : `curl -w` pour TTFB local, `ls -la` / `find` pour poids des fichiers, `grep`/`sed` sur le HTML pour compter requêtes, balises `<img>`/`<picture>`/`<script>`, attributs `width`/`height`, `preload`, `loading=lazy`.
- Pas de Lighthouse/PSI exécuté (indisponible dans cet environnement) → **aucune métrique LCP/INP/CLS chiffrée réelle**, uniquement des risques identifiés par inspection statique, à confirmer en conditions réelles (Lighthouse, CrUX) une fois le site en production.
- TTFB local mesuré à 1.4ms sur `index.html` — **non représentatif** : c'est un serveur de fichiers statiques local sans réseau, latence DNS/TLS/CDN de production, ni compression gzip/brotli vérifiable ici. Ne pas utiliser cette valeur comme preuve de performance en prod.

---

## Poids des ressources (mesuré sur disque)

| Ressource | Poids |
|---|---|
| index.html | 36.9 KB |
| methode.html | 21.4 KB |
| realisations.html | 16.9 KB |
| contact.html | 14.8 KB |
| css/style.css (unique, partagé) | 55.3 KB |
| js/script.js (unique, partagé) | 23.9 KB |
| js/membrane-scene.js (methode.html only) | 11.8 KB |
| js/water-scene.js (methode.html only) | 4.5 KB |
| media/hero-bg.mp4 | 1 327 KB (1.33 Mo) |
| media/hero-poster.jpg | 300.5 KB |
| 7 logos partenaires (uniques, PNG/SVG) | ≈ 137.9 KB |
| Images galerie realisations.html (webp, cumulé si tout le scroll est parcouru) | ≈ 4 216 KB (4.2 Mo), estimation calculée à partir des 18 fichiers .webp utilisés (before/after 1‑4, coulisses 1‑3, process‑2/3, finish‑detail‑1, gallery‑extra‑1) |
| GSAP + ScrollTrigger + Lenis (CDN jsdelivr) | non mesurable localement — **estimation documentée** ≈ 130‑150 KB combiné (non minifié tree-shaké) |
| three.js (`three@0.160.0` module ESM, methode.html) | non mesurable localement — **estimation documentée** ≈ 600‑700 KB pour le module core seul (import ESM complet sans tree-shaking, chargé via importmap) + addons non chiffrés |
| Google Fonts (Manrope 4 graisses, Inter 4 graisses, Instrument Serif italic) | non mesurable localement — **estimation** 6-9 fichiers de police |

Poids initial estimé page d'accueil (`index.html`, ressources uniques hors scroll complet des logos partenaires dédupliqués par le cache) : **≈ 2.0-2.2 Mo**, ~33-35 requêtes.

Poids potentiel `realisations.html` si l'utilisateur parcourt toute la galerie : **≈ 4.3 Mo**, dominé à 100% par les images.

---

## Findings

### 1. [CRITIQUE] Images de galerie sans `srcset` responsive — poids ~4.2 Mo cumulés sur realisations.html
**Description :** Les 18 images before/after, coulisses et process utilisent `<picture><source type="image/webp">` avec un fallback `.jpg`, ce qui est une bonne pratique de format — mais **une seule résolution est servie** (1200×1600, 1100×1466, etc.) quelle que soit la taille d'écran. Un mobile en 375px de large télécharge la même image qu'un écran 4K. Chaque image webp pèse entre 77 Ko et 436 Ko.
**Impact :** Fort impact LCP/bande passante mobile, surtout sur `realisations.html` où 8 paires before/after + 3 coulisses + 4 process sont chargées en `loading="lazy"` au scroll.
**Recommandation :** Générer 2-3 largeurs par image (ex. 480w/800w/1200w) et utiliser `srcset`/`sizes` dans chaque `<source>` et `<img>`. Gain estimé : 40-65% de poids d'image sur mobile.

### 2. [ÉLEVÉ] Vidéo hero (`hero-bg.mp4`, 1.33 Mo) sans attribut `preload` explicite
**Description :** `<video class="hero-video" autoplay muted loop playsinline poster="media/hero-poster.jpg"><source src="media/hero-bg.mp4" type="video/mp4"></video>` (index.html ligne 155-156). Sans `preload="metadata"` ou `preload="none"`, le comportement par défaut du navigateur (`auto` dans la plupart des cas pour une vidéo `autoplay`) tend à télécharger la totalité ou une large portion du fichier dès le chargement de page, y compris sur mobile/4G où l'utilisateur n'a pas forcément besoin de la vidéo en entier (boucle de quelques secondes).
**Impact :** Consommation de données inutile, concurrence avec les autres ressources critiques (CSS/fonts) pour la bande passante disponible au chargement initial, peut retarder le rendu du reste de la page sur connexions lentes.
**Recommandation :** Ajouter `preload="metadata"`, envisager un chargement différé de la vidéo (afficher le poster, charger la vidéo via JS après `load` ou via `IntersectionObserver`), ou réduire encore la durée/bitrate de la boucle. Le ré-encodage déjà effectué (3.65 Mo → 1.33 Mo) est une bonne première étape mais le poids reste élevé pour un élément non essentiel au contenu.

### 3. [ÉLEVÉ] `hero-poster.jpg` sans version WebP (incohérence avec le reste du site)
**Description :** Contrairement à toutes les autres images du site (converties en `.webp` avec fallback `<picture>`), `media/hero-poster.jpg` (300.5 Ko) n'a **aucune version WebP** et est référencé directement en `poster=""` sur la balise `<video>` (pas de mécanisme `<picture>` possible nativement pour un attribut `poster`).
**Impact :** C'est potentiellement l'élément visible le plus lourd au-dessus de la ligne de flottaison avant que la vidéo ne démarre — candidat LCP plausible sur connexions lentes ou navigateurs bloquant l'autoplay. 300 Ko en JPEG pur est significativement plus lourd qu'un WebP équivalent.
**Recommandation :** Réencoder `hero-poster.jpg` en WebP/AVIF (gain estimé 40-60%, soit ~120-180 Ko économisés) et servir la meilleure image disponible selon le support navigateur (ex. détection JS légère, ou accepter le JPEG optimisé à qualité réduite si `<picture>` n'est pas utilisable sur `poster`).

### 4. [MOYEN] Logos partenaires en PNG plutôt qu'en WebP/SVG
**Description :** 5 des 7 logos partenaires (`assets/logo/partners/*.png`) sont en PNG (7.8 Ko à 34.6 Ko chacun, total ≈ 127 Ko pour les 5 PNG + 11 Ko pour les 2 SVG = 137.9 Ko), alors que le reste du site utilise systématiquement WebP. Étant des logos (formes simples, peu de couleurs), ils sont de bons candidats à un vectoriel SVG (comme `renolit-alkorplan.svg` et `maytronics.svg`, déjà en SVG et bien plus légers proportionnellement) ou à défaut WebP.
**Impact :** Poids non-optimal mais **modéré** — ces images sont en `loading="lazy"` et positionnées plus bas dans `index.html` (ligne ~459), donc hors du chemin critique LCP. Impact surtout sur le poids total de page.
**Recommandation :** Convertir les 5 PNG restants en SVG (idéal pour des logos) ou WebP. Gain estimé 50-70% sur ces fichiers (~65-90 Ko).

### 5. [MOYEN] Bandeau logos partenaires dupliqué dans le DOM (marquee en boucle)
**Description :** La section logos partenaires contient **28 balises `<img>`** pour 14 occurrences dupliquées de 7 logos uniques (`brand-logo-item` apparaît 28 fois dans index.html), technique classique pour une animation de défilement infini (marquee) en CSS pur.
**Impact :** Pas d'impact réseau significatif (le navigateur met en cache la ressource après le premier fetch, les duplicatas suivants sont servis depuis le cache mémoire), mais alourdit le DOM (~14 nœuds `<img>` supplémentaires + wrappers) et peut légèrement augmenter le temps de style/layout sur les appareils bas de gamme.
**Recommandation :** Vérifier si une duplication CSS (`background-repeat` ou `animation` avec un seul jeu d'images plus `overflow` en boucle via JS) permettrait de réduire à un seul jeu de 7 `<img>`. Priorité basse.

### 6. [MOYEN] `three.js` chargé en entier via `importmap` sur methode.html (aucun tree-shaking)
**Description :** `methode.html` charge `three@0.160.0` complet depuis `cdn.jsdelivr.net` via `<script type="importmap">` pour deux scènes 3D (`membrane-scene.js`, `water-scene.js`). Sans bundler (Vite/Rollup/webpack) pour tree-shaker les imports, le module ESM complet de Three.js est susceptible d'être chargé (estimation documentée : plusieurs centaines de Ko, potentiellement 600-700 Ko pour le core seul, addons non inclus dans cette estimation).
**Impact :** `methode.html` a le plus de scripts de toutes les pages (13 balises `<script>`/`<link>` contre 8 sur les autres pages). Risque INP/TBT élevé sur cette page en particulier si l'exécution JS (init WebGL, boucles de rendu) bloque le thread principal, surtout sur mobile bas de gamme.
**Recommandation :** Mesurer le poids réel transféré (impossible en local sans accès réseau à jsdelivr) et envisager soit un bundle avec tree-shaking, soit un chargement différé des scènes 3D (au clic/scroll dans le viewport plutôt qu'au chargement de page), soit une version simplifiée (CSS/canvas 2D) si le rendu 3D n'est pas essentiel au message.

### 7. [FAIBLE] 3 badges SVG inline + section confiance — pas d'impact requêtes
**Description :** Les 3 nouveaux badges SVG (`trust-badges-section`, lignes 217-254 index.html) sont inline dans le HTML (pas de fichiers externes), donc **zéro requête HTTP supplémentaire**. Bonne pratique.
**Impact :** Négligeable, alourdit légèrement le HTML transféré (quelques centaines d'octets) mais évite 3 requêtes réseau qu'un `<img src="badge.svg">` aurait générées.
**Recommandation :** Aucune action requise — approche correcte pour de petites icônes vectorielles utilisées une seule fois.

### 8. [FAIBLE] 3 `<img>` sans attribut `width`/`height` (risque CLS mineur)
**Description :** `logo-provence.png`, `logo-vague.png` (nav) et `logo-full-dark.png` (footer) n'ont pas d'attributs `width`/`height` explicites dans index.html, contrairement aux 45 autres `<img>` de la page qui en sont pourvus.
**Impact :** Risque de CLS faible — ce sont des logos de petite taille, généralement contraints par CSS (`max-width`/`height: auto`), mais l'absence de dimensions explicites empêche le navigateur de réserver l'espace avant chargement, ce qui peut causer un micro-décalage de layout notamment au premier rendu ou en connexion lente.
**Recommandation :** Ajouter `width`/`height` (ou `aspect-ratio` en CSS) sur ces 3 balises pour éliminer tout risque résiduel de CLS.

### 9. [FAIBLE] Polices Google Fonts en `<link rel="stylesheet">` bloquant (mitigation déjà en place)
**Description :** `index.html` (et les autres pages) chargent 3 familles (Manrope 4 graisses, Inter 4 graisses, Instrument Serif italic) via un lien stylesheet classique vers `fonts.googleapis.com`, avec `&display=swap` déjà présent dans l'URL et `rel="preconnect"` vers `fonts.googleapis.com`/`fonts.gstatic.com` déjà en place. C'est une implémentation raisonnable, mais reste un point de blocage de rendu (2 origines externes + fichiers de police additionnels non mesurables localement).
**Impact :** Faible à modéré selon la latence réseau réelle vers Google Fonts en prod ; `display=swap` évite le FOIT (texte invisible) mais peut causer du FOUT (changement visible de police), source potentielle de CLS mineur si les métriques de fallback ne sont pas alignées.
**Recommandation :** Envisager l'auto-hébergement des polices (subset des caractères utilisés, `font-display: swap` local) pour supprimer 2 origines externes et gagner en fiabilité TTFB/LCP, ou réduire le nombre de graisses chargées si toutes ne sont pas utilisées visuellement.

---

## Points positifs constatés

- Toutes les images de contenu (galerie, before/after, finitions) utilisent `<picture>` + `<source type="image/webp">` avec fallback JPEG — bonne pratique généralisée.
- `loading="lazy"` appliqué systématiquement sur les images hors zone critique (galerie, logos partenaires).
- `width`/`height` présents sur 45/48 `<img>` de index.html (bonne prévention CLS globale).
- Scripts `js/script.js` et les librairies CDN (GSAP, ScrollTrigger, Lenis) chargés avec `defer` sur toutes les pages — non bloquant pour le rendu initial.
- `rel="preconnect"` déjà en place pour les origines Google Fonts.
- Vidéo hero déjà ré-encodée récemment (3.65 Mo → 1.33 Mo, H.264, sans piste audio) — effort d'optimisation réel, mais encore perfectible (finding #2).
- Badges de confiance en SVG inline plutôt qu'en fichiers externes — zéro requête additionnelle.

---

## Priorisation des recommandations (impact estimé)

1. **Srcset responsive sur les images de galerie** (finding #1) — impact le plus fort, surtout mobile/realisations.html.
2. **`preload="metadata"` ou chargement différé de hero-bg.mp4** (finding #2) — réduit la contention bande passante au chargement initial du site entier (index.html étant la page d'entrée principale).
3. **Conversion WebP/AVIF de hero-poster.jpg** (finding #3) — gain rapide et peu coûteux, cohérence avec le reste du site.
4. **Audit réel du poids three.js sur methode.html** (finding #6) — nécessite un test réseau réel (impossible en local), à vérifier en priorité avant mise en production si cette page est un point d'entrée important.
5. Logos partenaires en SVG/WebP (finding #4), largeur/hauteur manquantes (finding #8), auto-hébergement fonts (finding #9) — gains secondaires, à traiter une fois les points 1-4 réglés.

## Limites de cet audit

- Aucun accès à Lighthouse/PSI dans cet environnement : score et findings basés sur inspection statique du code source et du filesystem, pas de mesure réelle de LCP/INP/CLS en pixels/ms.
- Poids des dépendances CDN (GSAP, ScrollTrigger, Lenis, three.js, Google Fonts) non mesurables localement (pas de fetch réseau vers ces domaines depuis cet environnement) — valeurs indiquées comme "estimation documentée" à partir de la connaissance des tailles publiées de ces librairies, **à vérifier avec un test réseau réel avant de prioriser des actions coûteuses**.
- TTFB mesuré (1.4 ms) reflète un serveur de fichiers statiques local et n'est **pas** représentatif du TTFB de production (dépend de l'hébergeur/CDN choisi).
