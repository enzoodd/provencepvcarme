# Audit de performance (Core Web Vitals) — provencepvcarme.fr

**Date** : 2026-08-18
**Page auditée** : https://provencepvcarme.fr/ (accueil, mobile)
**Méthode** : analyse manuelle (TTFB en direct + inspection du code source live vs. local). Lighthouse CLI a échoué (aucune installation Chrome sur la machine) et l'API PageSpeed Insights a renvoyé une erreur de quota persistante (`PSI rate limit exceeded`) sur 3 tentatives espacées de ~1 min. **Aucun score Lighthouse/PSI officiel n'a donc pu être obtenu** — les constats ci-dessous reposent sur l'inspection directe du HTML servi en production, des en-têtes HTTP, et de la comparaison avec le dépôt local.

## Score estimé

**~45/100 (estimation manuelle, mobile)** — à confirmer dès que Lighthouse/PSI redevient disponible. Cette estimation est tirée à la baisse principalement par la découverte n°1 ci-dessous (le travail d'optimisation WebP n'est pas encore en ligne) et par la vidéo hero non compressée.

Aucun score chiffré ne doit être considéré comme définitif tant qu'une mesure Lighthouse/CrUX réelle n'a pas été effectuée.

## Constat majeur : le travail d'optimisation WebP n'est pas déployé

`git status` sur le dépôt local montre que **`index.html` est modifié mais non commité**, et que **tous les fichiers `.webp`** (`media/*.webp`, `media/finitions/*.webp`) sont **non trackés (`??`)** :

```
 M index.html
?? media/after-1.webp ... (18 fichiers .webp au total)
?? media/finitions/*.webp
?? media/coulisses-*.webp / process-*.webp / gallery-extra-1.webp / finish-detail-1.webp
```

Comparaison directe :
- **HTML local** (`index.html`) : les images utilisent bien `<picture><source srcset="…webp" type="image/webp"><img src="…jpg" …></picture>` (17 balises `<picture>`, 17 références `.webp`).
- **HTML réellement servi en production** (`curl https://provencepvcarme.fr/`) : toujours les anciennes balises `<img src="media/finitions/bali-gris.jpg" …>` **sans** `<picture>` ni WebP. Le `Last-Modified` du fichier live est le 13 août, alors que le fichier local a été modifié le 18 août.

**Conséquence : les visiteurs réels ne bénéficient d'aucun gain de la conversion WebP tant que ces fichiers ne sont pas commités puis publiés (push/déploiement GitHub Pages).** Toute mesure CrUX/PSI faite aujourd'hui sur l'URL publique reflète encore l'ancien poids d'images JPG, pas les ~22% de réduction annoncés.

**Action immédiate (sévérité : bloquant)** : `git add` des fichiers `.webp` + `index.html` (et les autres pages modifiées : `contact.html`, `methode.html`, `realisations.html`, `mentions-legales.html`, `confidentialite.html`), commit, puis déploiement. Sans cette étape, le reste de l'audit ci-dessous restera vrai en production.

## Constats par sévérité

### Critique

1. **Optimisation WebP non déployée** (voir ci-dessus). Impact direct sur le poids total de page et potentiellement sur le LCP des sections "Finitions" et "Réalisations".
2. **Vidéo hero non compressée : `media/hero-bg.mp4` = 3,57 Mo**. Chargée en `autoplay muted loop` dès l'arrivée sur la page, sans lazy-loading ni adaptation à la connexion. Sur mobile/4G, cela pèse lourdement sur la bande passante disponible pendant la fenêtre critique de chargement et peut retarder le rendu des ressources suivantes (fonts, CSS restant, JS). Ce n'est pas l'élément LCP au sens strict (le LCP est probablement le `<h1>` texte ou le poster), mais la vidéo consomme une part importante du budget réseau mobile en concurrence avec les autres ressources.
   - Recommandation : recompresser en H.264 CRF 28-32 (cible <800 Ko), ajouter `preload="none"` ou différer le chargement de la `<source>` via JS après le premier paint, ou basculer vers un format plus léger (WebM/AV1) avec fallback.

### Élevée

3. **Aucun attribut `width`/`height` sur les balises `<img>`** (0 occurrence sur 20 `<img>` dans `index.html`, live et local). Sans dimensions explicites ni `aspect-ratio` CSS garanti, chaque image chargée (finitions, avant/après, logo) est un risque de CLS au moment où elle apparaît, en particulier pour les images `loading="lazy"` qui se chargent après le premier rendu. À vérifier dans `css/style.css` si un `aspect-ratio` fixe est déjà appliqué aux conteneurs (`.finish-chip`, `.ba-img-*`) — si oui le risque CLS est atténué mais reste fragile ; ajouter systématiquement `width`/`height` (ou `aspect-ratio` CSS explicite) reste la pratique recommandée par les Core Web Vitals.
4. **`hero-poster.jpg` = 300 Ko pour 1600×900**, non converti en WebP/AVIF (choix assumé, absence de fallback natif pour `<video poster>`). C'est un poids correct mais optimisable : une solution consiste à définir le poster en CSS `background-image` avec `<picture>`-like fallback via `image-set()`, ou à accepter le compromis actuel (300 Ko reste raisonnable comparé aux 3,6 Mo de la vidéo — priorité nettement plus faible que le point 2).
5. **Feuille de style Google Fonts chargée en synchrone et bloquante** : `<link href="https://fonts.googleapis.com/css2?family=Manrope…&family=Inter…&family=Instrument+Serif…&display=swap" rel="stylesheet">` sans `media="print" onload=…` ni `rel="preload"`. Trois familles de polices (3 poids chacune pour Manrope/Inter + Instrument Serif italique) sont chargées via une requête bloquante supplémentaire malgré le `preconnect` déjà en place. `display=swap` limite le FOIT mais pas le blocage de la CSSOM.
   - Recommandation : auto-héberger les fichiers de police (fonts en `woff2`, self-hosted) avec `font-display: swap` et `<link rel="preload" as="font">` sur la police utilisée par le `<h1>`, pour supprimer la dépendance réseau tierce et gagner un aller-retour DNS/TLS.

### Moyenne

6. **Trois scripts tiers chargés en fin de `<body>` sans `defer`/`async`** : `gsap.min.js`, `ScrollTrigger.min.js`, `lenis.min.js` (CDN jsdelivr) puis `js/script.js`. Positionnés en fin de document, ils ne bloquent pas le premier rendu, mais s'exécutent de façon synchrone et séquentielle juste avant `DOMContentLoaded`/interactivité complète — GSAP + ScrollTrigger + Lenis (smooth-scroll) représentent une charge non négligeable de parsing/exécution JS sur le thread principal, avec un risque sur l'INP si l'utilisateur interagit (clic, scroll) pendant cette fenêtre. Lenis en particulier intercepte les événements de scroll natifs, ce qui peut ajouter de la latence perçue aux premières interactions.
   - Recommandation : ajouter `defer` sur les 4 balises `<script>`, et évaluer si `ScrollTrigger`/`Lenis` sont réellement nécessaires au-dessus de la ligne de flottaison ou peuvent être chargés après l'interaction initiale (`requestIdleCallback` ou événement de scroll utilisateur).
7. **TTFB mesuré = 230 ms** (bon, <200-500ms) — la page est servie via CDN GitHub Pages/Fastly avec cache HIT (`Age: 374`, `Cache-Control: max-age=600`). Ce point n'est pas un problème mais confirme que la couche réseau/hébergement n'est pas le goulot d'étranglement actuel : les gains à chercher sont côté poids de page et exécution JS, pas côté serveur.

### Faible

8. **CSS total 51 Ko, JS local 21,5 Ko** : tailles raisonnables, pas de blocage majeur identifié à ce niveau. Non vérifié : présence de CSS critique inline vs. CSS complet bloquant (à vérifier avec un outrail Lighthouse dès que possible).

## Recommandations priorisées

| Priorité | Action | Impact attendu |
|---|---|---|
| 1 | Committer + déployer les 18 fichiers `.webp` et le nouveau `index.html`/pages associées | Débloque le gain de poids d'image déjà produit (~22%) — actuellement nul en production |
| 2 | Recompresser `media/hero-bg.mp4` (3,6 Mo → cible <800 Ko) et/ou différer son chargement | Réduction directe du poids total de page mobile, moins de contention réseau au chargement |
| 3 | Ajouter `width`/`height` (ou `aspect-ratio` CSS garanti) sur toutes les `<img>` | Réduction du risque CLS, notamment sur les carrousels finitions et avant/après |
| 4 | Auto-héberger les polices Google Fonts avec `preload` | Suppression d'une requête bloquante tierce, amélioration du LCP texte |
| 5 | Ajouter `defer` sur GSAP/ScrollTrigger/Lenis/script.js | Réduction du risque sur l'INP en début de session |

## Prochaine étape recommandée

Dès que le quota PSI API se libère ou qu'une installation Chrome est disponible localement, relancer une mesure Lighthouse/PSI mobile réelle sur https://provencepvcarme.fr/ **après déploiement du point 1 ci-dessus**, pour obtenir un score chiffré fiable (LCP/INP/CLS en valeurs de laboratoire, puis données de terrain CrUX une fois le trafic suffisant).
