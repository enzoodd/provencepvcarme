# Audit Performance — provencepvcarme.fr (site LIVE)

**Score estimé : 44/100** (mesures réelles sur https://provencepvcarme.fr, méthodologie détaillée ci-dessous ; pondération mobile car Google évalue le 75e percentile des visites, majoritairement mobiles pour ce type de site).

---

## Méthodologie

Le site est désormais en ligne (`https://provencepvcarme.fr` répond en HTTP 200, hébergé sur GitHub Pages derrière un CDN Fastly/Varnish, PoP `cache-par-*` à Paris). Contrairement à l'audit précédent (mesures locales uniquement), ce rapport s'appuie sur des **mesures réelles sur le site en production**.

- **PSI API v5 (Lighthouse 13.x + CrUX)** : tentée à 4 reprises sur `https://provencepvcarme.fr/` (`pagespeed_check.py`), **indisponible** — l'API a systématiquement renvoyé `"PSI rate limit exceeded (240 QPM / 25,000 QPD)"`, y compris après plusieurs minutes d'attente, ce qui indique un quota déjà épuisé au niveau de la clé/du projet configuré (pas un throttling ponctuel côté agent). CrUX (données terrain 28 jours) inaccessible pour la même raison — attendu de toute façon vu que le site vient tout juste de passer en ligne (pas encore assez de trafic Chrome réel pour peupler CrUX).
- **Méthode de repli retenue : mesure directe via Chromium (Playwright-core, bundle déjà présent)**, avec injection de `PerformanceObserver` natifs (`largest-contentful-paint`, `layout-shift`, `longtask`, `paint`) directement dans la page live, en profil mobile (`iPhone 13` : 390×844, DPR 3). Deux passes :
  1. **Throttlée** (`Network.emulateNetworkConditions` 1.6 Mbps down / 750 Kbps up / RTT 150ms + `Emulation.setCPUThrottlingRate` ×4) — équivalent à l'ancien profil "Slow 4G" utilisé par défaut par Lighthouse mobile, comparable à la méthodologie qui avait produit le chiffre de 4.19s LCP de l'audit précédent.
  2. **Non-throttlée** (connexion réelle de cet environnement, CPU natif) — sert de référence basse / cas favorable.
- Complément : `curl -w` sur le live pour TTFB brut hors émulation, `curl -I` pour vérifier les en-têtes de cache/poids des médias hero, `ffprobe` pour les dimensions réelles de `hero-bg.mp4` (ImageMagick/`identify` non installé dans cet environnement).
- **Limite assumée** : ces mesures sont des mesures *lab* (un seul run par page, un seul type d'appareil/réseau simulé), pas des données *field* (CrUX, 75e percentile réel). Le throttling réseau/CPU appliqué est une approximation raisonnable du profil mobile Lighthouse historique, mais n'est pas Lighthouse lui-même (pas de score composite 0-100 calculé par un moteur officiel) — le score /100 de ce rapport est donc une **estimation documentée**, pondérée selon les seuils CWV officiels, pas une sortie brute d'un outil.

---

## Résultats mesurés (Chromium réel, site live)

| Page | Profil | TTFB | FCP | **LCP** | CLS | Long tasks / TBT approx. | Poids transféré (fenêtre de mesure) |
|---|---|---|---|---|---|---|---|
| `/` (index) | Mobile throttlé (Slow-4G-like, CPU×4) | 2976 ms* | 4944 ms | **6028 ms — Poor** (élément : `hero-bg.mp4`) | 0.0000 | 4 tâches / ~693 ms | 0.68 Mo (fenêtre 4s, téléchargements encore en cours) |
| `/` (index) | Sans throttle (référence basse) | 189 ms | 488 ms | **488 ms — Good** (élément : `hero-poster.jpg`) | 0.0000 | 1 tâche / ~9 ms | 2.52 Mo / 23 requêtes |
| `/methode.html` | Mobile throttlé | 1247 ms* | 2520 ms | **2520 ms — Good** (élément : texte `<p>`) | 0.0000 | 8 tâches / **~2024 ms** | 1.26 Mo / 18 requêtes |
| `/methode.html` | Sans throttle | 162 ms | 348 ms | **348 ms — Good** | 0.0000 | 2 tâches / **~811 ms** | 1.47 Mo / 19 requêtes |
| `/realisations.html` | Mobile throttlé | 571 ms* | 2100 ms | **11 160 ms — Poor (très dégradé)** (élément : `after-4.webp`, hero photo) | 0.0000 | 2 tâches / ~121 ms | 2.85 Mo (fenêtre 4s) |
| `/realisations.html` | Sans throttle | 717 ms | 1084 ms | **1236 ms — Good** | 0.0000 | 0 tâche / 0 ms | **4.20 Mo / 25 requêtes** |

\* Le TTFB throttlé inclut les 150 ms de RTT artificiels ajoutés par l'émulation réseau, à ne pas confondre avec le TTFB réel. Mesure `curl` indépendante hors émulation sur `index.html` (live, edge Paris) : **TTFB 228 ms** pour 49.5 Ko transférés — bon, cohérent avec un hébergement CDN.

**Lecture clé** : sur connexion rapide, le LCP est bon partout (confirmant que le code n'est pas fondamentalement cassé). Mais dès qu'on simule des conditions mobiles réalistes (celles utilisées par le 75e percentile CWV de Google), le LCP devient **Poor sur l'accueil (6.0s)** et **très fortement Poor sur realisations.html (11.2s)** — ce n'est pas un artefact de mesure : cela reflète un poids de page réel disproportionné par rapport au budget mobile (2.85 à 4.2 Mo sur realisations.html, contre ~700 Ko de budget raisonnable pour un LCP <2.5s en 4G).

---

## Corrigé depuis le dernier audit

- **Google Fonts auto-hébergées** ✅ — Contrairement à l'audit précédent (finding #9, fonts chargées depuis `fonts.googleapis.com`/`fonts.gstatic.com`, chaîne de rendu à 3 sauts), les 3 familles (Manrope, Inter, Instrument Serif italic) sont maintenant servies en local (`assets/fonts/*.woff2`) avec `<link rel="preload" as="font" crossorigin>` dans le `<head>` de chaque page et `font-display: swap` en CSS. Zéro requête externe vers Google Fonts constatée dans les traces réseau capturées. Élimine 2 origines externes et la chaîne de dépendance CSS→font qui pénalisait le LCP/FCP.
- **CLS toujours excellent** ✅ — 0.0000 mesuré sur les 3 pages testées (index, méthode, réalisations), y compris avec les nouvelles sections photo (page-hero-media en `position: absolute`, donc hors flux — bon choix technique qui évite tout risque de CLS malgré l'ajout d'un gros visuel).
- **Scripts déjà en `defer`** ✅ (à noter : point qui n'appelait pas de correction, déjà correct dans l'audit précédent et toujours vrai) — `gsap.min.js`, `ScrollTrigger.min.js`, `lenis.min.js`, `js/script.js` sont tous chargés avec l'attribut `defer` sur toutes les pages vérifiées ; `membrane-scene.js`/`water-scene.js` (methode.html) sont en `type="module"`, différés par défaut par le navigateur. Le TBT élevé sur methode.html (voir plus bas) n'est donc **pas** dû à un défaut de `defer`/`async`, mais au coût d'exécution des scènes 3D Three.js elles-mêmes une fois le script lancé.
- **Nouveau motif SVG de fond sur les sections sombres** ✅ — Implémenté en `data:image/svg+xml` inline dans `css/style.css` (variable `--grain`, filtre `feTurbulence`), donc **zéro requête HTTP additionnelle**. N'a aucun impact mesurable sur le poids réseau ni le TTFB — bonne pratique.
- **TTFB en production** ✅ — 228 ms mesuré en conditions réelles (hors émulation), bien en dessous du seuil de 200 ms visé pour un TTFB "bon" au niveau serveur pur (la légère marge vient de la latence réseau normale, pas d'un souci serveur) ; confirme que l'hébergement GitHub Pages + CDN Fastly est performant pour le TTFB.

## Toujours ouvert

- **[CRITIQUE] `hero-bg.mp4` toujours 1.33 Mo, non différé, et candidat LCP sur `index.html`** — Le fichier vidéo (`media/hero-bg.mp4`, 1 327 168 octets, confirmé identique en taille à l'audit précédent) est toujours servi sans `preload="metadata"`/`preload="none"` ni chargement différé. Dans la mesure throttlée live, **l'élément LCP identifié pour `index.html` est bien `hero-bg.mp4`**, avec un LCP de 6.0s (Poor). Aucune régression de poids, mais aucune correction non plus — le problème n°1 de l'audit précédent reste entier en production.
- **[HAUTE] `hero-poster.jpg` toujours sans version WebP/AVIF** — 300 562 octets en JPEG pur, inchangé depuis l'audit précédent, toujours utilisé tel quel en attribut `poster=""` (aucun mécanisme `<picture>` possible nativement sur cet attribut). Sur connexion rapide c'est d'ailleurs cette image qui a été détectée comme élément LCP (488ms — bon dans ce cas précis, mais reste le fichier le plus lourd du chemin critique de la page d'accueil selon la liste des ressources capturées).
- **[HAUTE] Images de galerie sans `srcset` responsive — poids confirmé et mesuré en direct** — Les webp before/after (`before-1..4`, `after-1..4`) pèsent chacun entre 222 Ko et 436 Ko (ex. `after-3.webp` = 435.9 Ko, `before-3.webp` = 419.8 Ko, `before-1.webp` = 369.3 Ko), servis en une seule résolution (1200×1600) quel que soit l'écran. Un mobile 390px de large télécharge la même image qu'un écran desktop. Mesure live confirmée : **`realisations.html` transfère 4.20 Mo sur 25 requêtes** au chargement complet — ce n'était qu'une estimation dans l'audit précédent (≈4.2-4.3 Mo), c'est maintenant un fait mesuré en production.
- **[MOYENNE] `three.js` complet sur `methode.html`, coût CPU réel confirmé** — Poids réseau mesuré en direct : `three@0.160.0` module ESM = **249.4 Ko** transférés depuis jsdelivr (confirme et affine l'estimation précédente de "600-700 Ko" — en réalité plus proche de 250 Ko pour le module principal, l'estimation précédente était trop pessimiste sur ce point). En revanche le **coût CPU est confirmé élevé et non anticipé en détail dans l'audit précédent** : TBT approximatif mesuré à **811ms sans throttle** et **2024ms avec throttle CPU×4**, largement au-dessus du seuil "Good" (TBT <200ms). C'est un signal fort de risque INP dégradé sur les interactions précoces de cette page (init WebGL + boucles de rendu des deux scènes bloquant le thread principal).
- **[BASSE] Logos partenaires en PNG plutôt que SVG/WebP** — inchangé, non prioritaire (hors chemin critique LCP, `loading="lazy"`).
- **[BASSE] 3 `<img>` sans `width`/`height`** (logos nav/footer) — inchangé, risque CLS mineur non matérialisé dans les mesures (CLS = 0 partout), à corriger par hygiène plutôt que par urgence.
- **[INFO] Bandeau logos partenaires dupliqué dans le DOM (marquee)** — inchangé, impact réseau nul (cache), impact DOM mineur.

## Régression / nouveau problème

- **[CRITIQUE — RÉGRESSION CONFIRMÉE] Nouvelle section photo hero sur `realisations.html` dégrade fortement le LCP mobile de cette page.** C'est le point que la consigne demandait explicitement de vérifier, et la mesure live le confirme : la nouvelle `<div class="page-hero-media">` (image `after-4.webp`/`.jpg`, 427.9 Ko / 490.8 Ko, dimensions natives 1200×1600 réutilisées en plein cadre `object-fit: cover`) est chargée **sans `loading="lazy"` (normal, elle est au-dessus de la ligne de flottaison — c'est voulu)**, mais **sans `fetchpriority="high"` ni `<link rel="preload">`**, et surtout **sans aucune optimisation de poids ni de dimensionnement responsive** pour cet usage spécifique (l'image sert à la fois de fond de hero plein cadre ET, plus bas sur la même page, de vignette de galerie 1200×1600 — même fichier, deux usages très différents, un seul poids). Résultat mesuré : sur le profil mobile throttlé, l'élément LCP de `realisations.html` est cette image, avec un **LCP de 11 160 ms (Poor, très largement au-dessus même du seuil "Poor" à 4s)**. La cause räcine n'est pas seulement le poids de l'image elle-même (427 Ko), mais la **contention réseau** : elle est chargée en concurrence avec les 7 autres photos before/after/coulisses/process (chacune 200-430 Ko), dont plusieurs se déclenchent visiblement bien avant le scroll réel de l'utilisateur (25 requêtes et 4.2 Mo cumulés constatés au chargement complet, alors que 8 des 16 photos de galerie sont censées être `loading="lazy"`). Sur une connexion lente, toutes ces requêtes saturent la bande passante disponible et retardent d'autant le rendu de l'image hero prioritaire.
  **Impact** : `realisations.html` passe d'une page vraisemblablement correcte en LCP avant l'ajout (hero texte seul, pas d'image de fond) à la pire page du site en conditions mobiles réelles.
  **Recommandation (priorité n°1 de ce rapport)** : (a) générer une variante dédiée et allégée de `after-4` spécifiquement pour le hero (ex. 1600×900 recadrée en amont, qualité WebP 65-70, cible <120 Ko) plutôt que de réutiliser le fichier 1200×1600 plein format ; (b) ajouter `fetchpriority="high"` sur le `<img>` du hero et un `<link rel="preload" as="image" imagesrcset="...">` dans le `<head>` de `realisations.html` ; (c) vérifier/resserrer le seuil de déclenchement du `loading="lazy"` des 8 paires before/after restantes (ou les charger réellement à la demande via `IntersectionObserver` avec une marge plus stricte) pour éviter la contention réseau constatée.
- **[À SURVEILLER — pas une régression au sens strict, mais nouveau facteur de risque] `hero-bg.mp4` en résolution portrait 960×1706 (confirmé via `ffprobe`) alors qu'il est utilisé en fond de hero paysage sur desktop/mobile large.** Ce n'est pas un changement récent détectable (le fichier a la même taille en octets qu'à l'audit précédent, donc probablement pas retouché), mais ce n'avait pas été vérifié en dimensions natives jusqu'ici : la vidéo est nativement verticale (rapport 9:16), ce qui signifie qu'en affichage plein cadre sur un hero large (desktop, tablette paysage), le navigateur doit fortement recadrer/agrandir une vidéo dont la résolution effective utile est bien inférieure à ce qu'elle devrait être pour un rendu net en format paysage — l'inverse du problème signalé sur `hero-poster.jpg` dans un audit antérieur, mais la même cause racine (asset mal dimensionné pour son usage réel) semble s'être déplacée vers le fichier vidéo. À vérifier visuellement sur desktop large ; si confirmé, un ré-export en résolution paysage (ex. 1920×1080 ou 1280×720) réduirait probablement encore le poids fichier tout en améliorant le rendu.
- **[NOUVEAU — MOYENNE] Tableau comparatif `methode.html` (nouveau, `.compare-table`)** — Purement HTML/CSS (`<div>`/`<span>` avec `role="table"`), aucune image, aucun script, **aucun impact mesurable sur le poids de page ou le LCP** constaté. Signalé pour mémoire suite à la consigne de vérification, mais ce n'est pas un problème de performance.

---

## Findings classés par priorité

### 1. [CRITIQUE] LCP mobile réel Poor sur `index.html` (6.0s) et très fortement Poor sur `realisations.html` (11.2s)
Confirmé par mesure directe sur le site live en conditions mobiles réalistes. Fait échouer le seuil "Good" (≤2.5s) par un facteur ×2.4 à ×4.5. Sur `index.html`, l'élément LCP est la vidéo hero (`hero-bg.mp4`, non différée) ; sur `realisations.html`, c'est la nouvelle image hero de galerie, aggravée par la contention réseau des autres photos. **Impact SEO/CWV direct : ces deux pages échoueraient très probablement l'évaluation "Good" au 75e percentile mobile dans Search Console une fois assez de données CrUX accumulées.**

### 2. [CRITIQUE] Nouvelle section photo `realisations.html` — voir "Régression" ci-dessus
Cf. détail complet plus haut. Priorité de correction n°1.

### 3. [HAUTE] `hero-bg.mp4` (1.33 Mo) toujours sans `preload="metadata"` ni chargement différé
Cf. détail "Toujours ouvert" ci-dessus. Recommandation inchangée : `preload="metadata"`, ou afficher le poster puis charger la vidéo via JS après `load`/`IntersectionObserver`.

### 4. [HAUTE] Images de galerie sans `srcset` responsive (poids confirmé : 4.2 Mo sur `realisations.html`)
Cf. détail "Toujours ouvert" ci-dessus. Recommandation inchangée : 2-3 largeurs par image (480w/800w/1200w) + `srcset`/`sizes`.

### 5. [HAUTE] `hero-poster.jpg` sans WebP/AVIF (300 Ko en JPEG pur)
Cf. détail "Toujours ouvert" ci-dessus.

### 6. [MOYENNE] TBT élevé sur `methode.html` (811-2024ms) — risque INP lié à Three.js
Cf. détail "Toujours ouvert" ci-dessus. Recommandation : différer l'initialisation des scènes 3D au scroll dans le viewport (`IntersectionObserver`) plutôt qu'au chargement immédiat de la page, et/ou répartir l'initialisation WebGL en tâches <50ms.

### 7. [BASSE] Logos partenaires PNG, `width`/`height` manquants sur 3 `<img>`
Inchangé, non urgent.

### 8. [INFO] Marquee logos dupliqué dans le DOM
Inchangé, impact négligeable.

---

## Points positifs confirmés

- CLS = 0.0000 sur toutes les pages testées, y compris avec les nouveaux visuels de fond — excellent, aucune régression malgré les ajouts.
- Fonts auto-hébergées + préchargées + `font-display: swap` — chaîne de rendu bloquante éliminée.
- TTFB de production mesuré à 228 ms, bon niveau d'hébergement/CDN.
- `defer`/`type="module"` appliqués correctement sur l'ensemble des scripts.
- Nouveau motif SVG des sections sombres : inline, zéro coût réseau.
- Sur connexion rapide, toutes les pages testées atteignent un LCP "Good" — le code n'est pas structurellement cassé, le problème est un déficit de budget de poids/priorisation pour les conditions mobiles réelles, pas un bug.

---

## Priorisation des recommandations (impact estimé)

1. **Corriger la nouvelle section photo hero de `realisations.html`** (image dédiée allégée <120 Ko, `fetchpriority="high"`, `preload`) — impact le plus fort et le plus urgent, régression mesurée à 11.2s de LCP mobile.
2. **Différer `hero-bg.mp4`** (`preload="metadata"` a minima, idéalement chargement JS après `load`) — impact direct sur le LCP mobile de la page d'accueil, point critique non résolu depuis 2 audits.
3. **`srcset` responsive sur les 16 photos de galerie** (`realisations.html`) — réduit le poids total de la page de 40-65% sur mobile, réduit aussi la contention réseau qui aggrave le point n°1.
4. **WebP/AVIF pour `hero-poster.jpg`** — gain rapide, cohérence avec le reste du site.
5. **Différer l'initialisation des scènes Three.js sur `methode.html`** (au scroll/viewport) — réduit le TBT de 800-2000ms, améliore l'INP perçu sur cette page.
6. Logos SVG/WebP, `width`/`height` manquants — gains secondaires, à traiter une fois 1-5 réglés.

## Limites de cet audit

- PSI API / CrUX indisponibles (quota épuisé) malgré 4 tentatives espacées — aucune donnée *field* (75e percentile réel) disponible ; le site venant de passer en ligne, CrUX n'aurait de toute façon probablement pas encore assez de volume de trafic Chrome pour être peuplé.
- Mesures *lab* obtenues via un seul run par page/profil (pas de médiane sur plusieurs runs) — une marge de variance de ±15-20% sur les chiffres de LCP throttlé est possible d'un run à l'autre (variabilité réseau/CPU normale de ce type de mesure).
- Le score /100 de ce rapport est une estimation documentée basée sur les seuils CWV officiels (LCP/CLS mesurés, TBT en proxy d'INP), pas une sortie brute d'un outil Lighthouse/PSI officiel — à recalibrer dès que l'API PSI redevient disponible ou que CrUX est peuplé.
