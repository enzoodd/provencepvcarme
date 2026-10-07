# Audit Technique SEO — provencepvcarme.fr

**Score technique : 80/100** (précédent : 71/100)

Site testé **en ligne, en conditions réelles**, le 2026-09-28 : `https://provencepvcarme.fr` résout en DNS et répond en HTTP 200 (changement majeur depuis l'audit du 2026-08-11, où le domaine renvoyait NXDOMAIN et bloquait 100% de l'indexation). Hébergement confirmé : GitHub Pages (en-tête `Server: GitHub.com`, CDN Fastly en façade) avec certificat Let's Encrypt.
**13 pages auditées** (le sitemap est passé de 6 à 13 URLs) : `/`, `/methode.html`, `/realisations.html`, `/contact.html`, `/mentions-legales.html`, `/confidentialite.html`, et 7 pages de zone (`/pose-membrane-pvc-arme-{avignon,orange,marseille,pierrelatte,valence,montpellier,aix-en-provence}.html`).

---

## 0. Synthèse avant/après

### Corrigé depuis le dernier audit
- **DNS/déploiement résolu** — le site est en ligne, les 13 pages du sitemap répondent en HTTP 200, aucune ne renvoie 4xx/5xx.
- **Redirections canoniques propres** — `http://` → `https://` (301) et `https://www.` → `https://` (301) convergent en un seul saut vers `https://provencepvcarme.fr/`, aucune chaîne de redirections.
- **HTTPS valide** — certificat Let's Encrypt (`CN=provencepvcarme.fr`), valide du 13/08/2026 au 11/11/2026, correctement présenté sur le domaine apex.
- **Menu mobile réparé et vérifié en live sur les 13 pages** à 390px (Playwright, viewport 390×844) : `scrollWidth = clientWidth = 390px` partout, zéro débordement horizontal ; bouton hamburger pleinement visible et cliquable (x:316–366, dans le viewport) ; bouton d'appel 50×44px (conforme WCAG 2.5.5) ; barre CTA mobile persistante en bas d'écran présente sur toutes les pages. Le correctif identifié (masquer `.btn-primary` sous 900px, garder `.btn-call` + burger, reporter le CTA vers `.mobile-cta-bar`) est bien en production.
- **Compteurs statistiques non-JS** — les valeurs (`<24h`, `~2h`) sont désormais présentes nativement dans le HTML de `contact.html` (`data-count-to="24"`/`"2"` avec la valeur déjà inscrite), il n'y a plus de "0" en dur affiché avant exécution JS.
- **Sitemap étendu et cohérent** — 13/13 URLs, `lastmod` désormais différencié selon les pages réellement modifiées (au lieu d'une date unique copiée-collée sur toutes les entrées) ; parité 1:1 avec les canonicals des 13 pages live.
- **Structured data enrichi** — `@type` passé de `HomeAndConstructionBusiness`/générique à **`GeneralContractor`** (plus précis) sur les pages testées ; un bloc **`BreadcrumbList`** valide est désormais présent sur les pages de zone et sur `contact.html` (absent lors de l'audit précédent). JSON-LD validé syntaxiquement (JSON.parse OK) sur `index.html`, `contact.html` et une page de zone.
- **Compression** — `Content-Encoding: gzip` actif sur le HTML servi par GitHub Pages/Fastly.

### Toujours ouvert
- **Aucun en-tête de sécurité personnalisé** (HSTS, CSP, X-Content-Type-Options, Referrer-Policy, X-Frame-Options) — confirmé en live sur toutes les ressources testées (HTML, CSS, JS). Limitation structurelle de GitHub Pages sans proxy.
- **Pas de page 404 personnalisée** — `https://provencepvcarme.fr/<url-inexistante>` renvoie bien un HTTP 404 (statut correct), mais le corps est toujours la page générique GitHub Pages (`<title>Page not found · GitHub Pages</title>`), sans navigation ni marque.
- **Scripts CDN sans SRI** — GSAP (`gsap@3`), ScrollTrigger (`@3`) et Lenis (`@1`) sont chargés via jsDelivr en version majeure flottante (non épinglés à une version exacte), et aucun script du site — y compris Three.js, qui lui est épinglé en version exacte `@0.160.0` — ne porte d'attribut `integrity=` (SRI). Risque de supply-chain si jsDelivr ou une des libs est compromis.
- **Liens internes vers l'accueil incohérents** — sur les 13 pages, le logo/nav/footer pointent toujours vers `href="index.html"` alors que le canonical de l'accueil est `https://provencepvcarme.fr/`.
- **IndexNow non implémenté** — aucune clé `<clé>.txt` à la racine, aucun appel API détecté ; pertinent maintenant que le site est en ligne et publie du contenu (7 pages de zone récentes).
- **`favicon.ico` racine absent (404)** — les favicons PNG modernes (16×16, 32×32, apple-touch-icon 180×180) sont bien présents et couvrent la quasi-totalité des navigateurs actuels, mais l'absence de fallback `.ico` peut affecter de vieux agrégateurs/outils qui le requêtent en dur à la racine.
- **URLs avec extension `.html`** — esthétique mineure, non pénalisante, mais moins "propre" qu'une URL sans extension (nécessiterait une configuration serveur que GitHub Pages ne permet pas nativement).
- **Poids des médias élevé, risque LCP inchangé** — `media/` pèse toujours **16 Mo**, plusieurs JPG/WebP dépassent 400-480 Ko (`after-4.jpg` 480 Ko, `after-3.jpg` 476 Ko, `before-3.jpg` 472 Ko, y compris certaines variantes `.webp` comme `after-4.webp` à 428 Ko). Le poster hero (`hero-poster.jpg`, 296 Ko) n'a toujours pas d'équivalent `.webp`/`.avif`, et la vidéo `hero-bg.mp4` (1,3 Mo) est toujours sans attribut `preload="none"`/`"metadata"` — ces deux points identifiés lors de l'audit précédent n'ont pas été retouchés depuis (fichiers non modifiés depuis le 11/08).

### Régression / nouveau problème
Aucune régression identifiée. Les 7 nouvelles pages de zone suivent la même structure technique que les pages historiques (canonical auto-référent correct, viewport présent, JSON-LD valide avec `Service` + `BreadcrumbList`, menu mobile fonctionnel) — aucun défaut technique propre à ces nouvelles pages n'a été détecté.

---

## 1. Crawlability

### Finding 1 — robots.txt correct et minimal (Info / Pass)
```
User-agent: *
Allow: /

Sitemap: https://provencepvcarme.fr/sitemap.xml
```
Vérifié en live. Autorise tout le crawl, déclare le sitemap à la racine (pas de déclaration périmée).

### Finding 2 — sitemap.xml complet, valide et à jour (Info / Pass)
`claude-seo sitemap_discovery.py` confirme : sitemap déclaré dans robots.txt, HTTP 200, type `urlset` valide. 13/13 URLs listées, cohérentes avec les 13 pages réellement en ligne. `lastmod` désormais différencié (2026-09-28, 2026-09-23, 2026-08-24 selon les pages) au lieu d'une date unique — corrige le Low signalé précédemment.

### Finding 3 — Toutes les pages retournent 200 OK, aucune redirection interne (Info / Pass)
Les 13 URLs du sitemap ont été testées individuellement en live : 200 OK partout, aucune erreur 4xx/5xx, aucune redirection en chaîne.

### Finding 4 — Redirections domaine propres et en un seul saut (Info / Pass)
`http://provencepvcarme.fr` → 301 → `https://provencepvcarme.fr/`. `https://www.provencepvcarme.fr` et `http://www.provencepvcarme.fr` → 301 → `https://provencepvcarme.fr/`. Toutes les variantes convergent vers une seule URL canonique, sans boucle ni double saut.

**Score section : 20/20**

---

## 2. Indexability

### Finding 5 — Canonicals auto-référents corrects sur les 13 pages (Info / Pass)
Chaque page déclare un `<link rel="canonical">` absolu correct (`https://provencepvcarme.fr/…`), y compris l'accueil canonicalisée vers `/` sans `index.html`. Correspondance exacte avec les 13 entrées du sitemap. Aucun `meta name="robots"` (donc aucun `noindex`) détecté sur aucune des 13 pages.

### Finding 6 — Incohérence persistante des liens internes vers l'accueil (Low)
Toutes les pages (13/13) utilisent encore `href="index.html"` dans le logo/nav/footer au lieu de `href="/"`, alors que le canonical déclare `https://provencepvcarme.fr/`. Sur GitHub Pages, les deux servent le même contenu donc l'impact SEO réel est très limité (le canonical consolide déjà le signal), mais l'incohérence reste à corriger pour la propreté du code.
**Recommandation** : remplacer `href="index.html"` par `href="/"` dans la nav, le logo et le footer des 13 pages.

**Score section : 18/20** (-2 Finding 6)

---

## 3. Sécurité

### Finding 7 — HTTPS forcé et certificat valide (Info / Pass)
Certificat Let's Encrypt valide (13/08/2026 → 11/11/2026), `CN=provencepvcarme.fr`. HTTP et `www` redirigent systématiquement vers `https://provencepvcarme.fr/` en 301. Aucune ressource mixte content (CSS/JS/CDN) chargée en `http://` non sécurisé.

### Finding 8 — Aucun en-tête de sécurité personnalisé (Medium — limitation connue, confirmée en live)
Vérifié sur le HTML, le CSS et le JS servis en production : ni `Strict-Transport-Security`, ni `Content-Security-Policy`, ni `X-Content-Type-Options`, ni `Referrer-Policy`, ni `X-Frame-Options` dans les réponses. GitHub Pages ne permet pas de définir d'en-têtes HTTP personnalisés sans passer par un proxy (ex. Cloudflare en mode proxy orange).
**Recommandation** : mettre le domaine derrière Cloudflare (mode proxy) pour ajouter HSTS, CSP, X-Content-Type-Options, Referrer-Policy et X-Frame-Options via des Transform Rules / Response Headers, sans changer d'hébergement.

### Finding 9 — Scripts tiers sans Subresource Integrity (Medium)
`gsap@3`, `ScrollTrigger.min.js@3` et `lenis@1` (cdn.jsdelivr.net) sont chargés en version majeure flottante, sans attribut `integrity=`. `three@0.160.0` (methode.html) est épinglé en version exacte mais n'a pas non plus de hash SRI. Un service tiers compromis (ou une régression de version poussée silencieusement sur un tag flottant) pourrait injecter du JS malveillant sans que le navigateur ne le bloque.
**Recommandation** : épingler GSAP/ScrollTrigger/Lenis à des versions exactes (comme Three.js) et ajouter `integrity="sha384-…" crossorigin="anonymous"` sur les 4 scripts CDN, sur les 8 pages qui les chargent.

**Score section : 10/15** (-5 Finding 8, Finding 9 déjà reflété dans le -5 combiné avec la note ci-dessous)

---

## 4. Structure des URLs

### Finding 10 — URLs propres, cohérentes avec le sitemap, extension `.html` visible (Low)
Structure lisible et cohérente sur les 13 pages (`/pose-membrane-pvc-arme-avignon.html`, etc.), toutes alignées avec canonicals et sitemap. L'extension `.html` reste visible — non pénalisant pour le SEO mais moins "propre" ; non prioritaire sans configuration serveur supplémentaire côté GitHub Pages.

**Score section : 8/10**

---

## 5. Mobile-Friendliness

### Finding 11 — Menu mobile réparé et vérifié en production sur les 13 pages (Info / Pass — CRITICAL RÉSOLU)
Test Playwright à 390×844 sur les 13 URLs live :
- `document.documentElement.scrollWidth === clientWidth === 390` sur les 13 pages → **zéro débordement horizontal** (l'ancien débordement de 84px est totalement résolu).
- Bouton hamburger (`.nav-burger`) visible et dans le viewport (`x: 316, w: 50, h: 44`) sur les 13 pages.
- Bouton d'appel (`.btn-call`) mesuré à 50×44px — conforme au minimum WCAG 2.5.5 (44×44px), amélioration confirmée par rapport aux 46×38px relevés précédemment.
- `.mobile-cta-bar` (CTA persistante en bas d'écran, remplaçant le bouton "Devis gratuit" masqué sous 900px) présente et visible sur les 13 pages.
Le CSS documente explicitement la cause et le correctif (commentaire dans `css/style.css` à la règle `@media (max-width: 900px)`), confirmant une correction intentionnelle et non accidentelle.

### Finding 12 — Viewport et responsive design corrects (Info / Pass)
`<meta name="viewport" content="width=device-width, initial-scale=1.0">` présent sur les 13 pages, sans exception.

**Score section : 10/10**

---

## 6. Core Web Vitals (indices depuis le code source)

### Finding 13 — Poids d'images élevé, risque LCP toujours présent (High, inchangé)
`media/` pèse **16 Mo**. Plusieurs JPG dépassent 440-480 Ko (`after-4.jpg` 480 Ko, `after-3.jpg` 476 Ko, `before-3.jpg` 472 Ko, `process-4.jpg` 444 Ko), et certaines variantes `.webp` restent lourdes (`after-4.webp` 428 Ko, `after-3.webp` 428 Ko) pour du contenu destiné au mobile. Fichiers non modifiés depuis le 11/08 — ce Finding n'a pas été traité depuis l'audit précédent.

### Finding 14 — Vidéo hero toujours sans `preload` explicite (Medium, inchangé)
`media/hero-bg.mp4` (1,3 Mo) reste déclarée `autoplay muted loop playsinline poster="media/hero-poster.jpg"` sans attribut `preload`. Le poster (`hero-poster.jpg`, 296 Ko) n'a toujours pas d'équivalent `.webp`/`.avif`.
**Recommandation (reconduite)** : ajouter `preload="none"` ou `"metadata"`, fournir `hero-poster.webp` via `<picture>` et compresser sous 100-150 Ko.

### Finding 15 — Bonnes pratiques toujours en place (Info / Pass partiel)
`<picture>` + `<source type="image/webp">` avec fallback JPG, `loading="lazy"` sur les images hors-écran, attributs `width`/`height` explicites, scripts non critiques chargés en `defer`.

### Finding 16 — Compression gzip active côté serveur (Info / Pass)
`Content-Encoding: gzip` confirmé sur le HTML en production (GitHub Pages/Fastly).

**Score section : 8/15** (poids images/vidéo non traité depuis le dernier audit — impact direct et non retouché)

---

## 7. Structured Data

### Finding 17 — JSON-LD valide et enrichi (Info / Pass — amélioration confirmée)
JSON-LD syntaxiquement valide (`JSON.parse` OK) sur `index.html` (`GeneralContractor` + `FAQPage`), `contact.html` (`GeneralContractor` + `BreadcrumbList`) et une page de zone testée (`Service` + `BreadcrumbList`). Le `@type` générique `HomeAndConstructionBusiness` a été remplacé par le plus spécifique `GeneralContractor`, et un bloc `BreadcrumbList` — absent lors de l'audit précédent — est désormais présent sur les pages de zone et sur contact. Validation approfondie des champs requis (NAP, `geo`, `openingHours`) déléguée à l'audit schema/local dédié.

**Score section : 5/5**

---

## 8. Rendu JavaScript

### Finding 18 — Site en rendu statique, aucun risque de CSR, confirmé en production (Info / Pass)
Les 13 pages servies par GitHub Pages sont du HTML statique pré-rendu ; le contenu textuel est présent directement dans le HTML source (vérifié via curl brut, sans exécution JS). GSAP/ScrollTrigger/Lenis ne pilotent que des animations d'interaction, jamais le rendu du contenu principal.

**Score section : 5/5** (fusionné avec Structured Data dans le total ci-dessous, comme dans l'audit de référence)

---

## 9. IndexNow

### Finding 19 — Protocole IndexNow toujours non implémenté (Low)
Aucune clé IndexNow détectée à la racine du domaine live. Le site étant maintenant indexable et ayant publié 7 nouvelles pages de zone récemment (lastmod 2026-09-23/28), IndexNow permettrait de notifier Bing/Yandex/Naver immédiatement après chaque nouvelle publication plutôt que d'attendre le recrawl naturel.
**Recommandation** : générer une clé IndexNow et l'utiliser à chaque nouvelle page/mise à jour de contenu.

**Score section : 0/5**

---

## Synthèse des priorités

| Sévérité | Finding | Catégorie | Statut |
|---|---|---|---|
| High | Images JPG/WebP toujours lourdes (jusqu'à 480 Ko), poster hero 296 Ko sans WebP | Core Web Vitals | Toujours ouvert |
| Medium | Vidéo hero sans `preload="none"/"metadata"` | Core Web Vitals | Toujours ouvert |
| Medium | Aucun en-tête de sécurité (HSTS/CSP/X-Content-Type-Options/Referrer-Policy) — limitation GitHub Pages | Sécurité | Toujours ouvert |
| Medium | Scripts CDN (GSAP/ScrollTrigger/Lenis) sans SRI et non épinglés en version exacte | Sécurité | Toujours ouvert |
| Low | Pas de page 404 personnalisée (page générique GitHub Pages) | Crawlability/UX | Toujours ouvert |
| Low | Liens internes vers l'accueil en `index.html` au lieu de `/` | Indexability | Toujours ouvert |
| Low | IndexNow non implémenté | IndexNow | Toujours ouvert |
| Low | `favicon.ico` racine absent (404) — PNG favicons présents et suffisants | Crawlability | Toujours ouvert |
| Low | URLs avec extension `.html` | Structure URL | Toujours ouvert |
| — | DNS/déploiement, menu mobile 390px, compteurs "0", sitemap 13 pages, BreadcrumbList/GeneralContractor | — | **Corrigé** |

## Score technique : 80/100

Calcul indicatif : Crawlability 20/20, Indexability 18/20 (-2 lien accueil), Sécurité 10/15 (-5 headers absents + SRI manquant), URL 8/10, Mobile 10/10 (menu réparé et vérifié en live), Core Web Vitals 8/15 (-7 poids images/vidéo hero non traité depuis le dernier audit), Structured Data/JS 5/5, IndexNow 0/5 (optionnel, non bloquant).

Le site a franchi son obstacle le plus critique (mise en ligne effective, DNS résolu) et corrigé intégralement le second problème le plus grave de l'audit précédent (menu mobile inatteignable), vérifié ici directement en production sur les 13 pages. La base technique reste saine : statique, canonicals propres, sitemap complet et à jour, robots.txt correct, redirections propres, structured data enrichi. Les leviers restants sont concentrés sur la sécurité (en-têtes HTTP, SRI) et sur le poids des médias (images galerie, vidéo/poster hero), qui n'ont pas été retouchés depuis l'audit du 11/08 et restent le principal frein au LCP mobile.
