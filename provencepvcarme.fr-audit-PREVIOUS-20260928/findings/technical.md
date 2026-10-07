# Audit Technique SEO — provencepvcarme.fr

**Score technique : 78/100**

Site testé en local sur http://localhost:8804 (fichiers statiques, `C:\Users\oddon\Desktop\provencepvcarme`).
Hébergement cible en production : GitHub Pages (fichier `CNAME` = `provencepvcarme.fr`).
6 pages auditées : `index.html`, `methode.html`, `realisations.html`, `contact.html`,
`mentions-legales.html`, `confidentialite.html`.

---

## 1. Crawlability

### Finding 1 — robots.txt correct et minimal (Info / Pass)
```
User-agent: *
Allow: /

Sitemap: https://provencepvcarme.fr/sitemap.xml
```
Autorise tout le crawl, déclare le sitemap. Aucune action requise.

### Finding 2 — sitemap.xml complet et cohérent (Info / Pass)
Liste les 6 pages avec `lastmod`, `changefreq`, `priority` cohérents avec les canonicals.
**Recommandation (Low)** : toutes les entrées partagent la même `lastmod` (2026-08-18) ; veiller à
ne mettre à jour cette date que lors de vraies modifications de contenu, pas par copier-coller
systématique, pour rester un signal fiable pour les crawlers.

### Finding 3 — Toutes les pages retournent 200 OK (Info / Pass)
Aucune redirection, aucune erreur 4xx/5xx détectée sur les 6 pages en local.

---

## 2. Indexability

### Finding 4 — Canonicals auto-référents corrects (Info / Pass)
Chaque page déclare un `<link rel="canonical">` absolu correct, y compris l'accueil canonicalisée
vers `https://provencepvcarme.fr/` (sans `index.html`). Aucun `meta robots noindex` détecté.

### Finding 5 — Incohérence mineure des liens internes vers l'accueil (Low)
Tous les liens internes vers l'accueil (logo, menu « Accueil », footer) pointent vers `index.html`
plutôt que vers `/`, alors que le canonical de la page déclare `https://provencepvcarme.fr/`. Sur
GitHub Pages, `index.html` et `/` servent le même contenu et le canonical devrait consolider les
signaux, mais cela reste une incohérence propre à corriger.
**Recommandation** : remplacer les `href="index.html"` par `href="/"` dans la nav, le logo et le
footer de toutes les pages, pour aligner liens internes et canonical.

---

## 3. Sécurité

### Finding 6 — Pas d'en-têtes de sécurité custom possibles (Info — limitation connue)
GitHub Pages ne permet pas de définir des en-têtes HTTP personnalisés (`Content-Security-Policy`,
`X-Content-Type-Options`, `Strict-Transport-Security`, `Referrer-Policy`, etc.) sans passer par un
proxy (Cloudflare en mode proxy orange, par exemple). HTTPS est cependant forcé nativement par
GitHub Pages pour les domaines personnalisés avec certificat géré automatiquement.
**Recommandation (Medium)** : si un niveau de sécurité supplémentaire est souhaité, mettre le
domaine derrière Cloudflare (mode proxy) pour ajouter HSTS, CSP, X-Content-Type-Options,
Referrer-Policy et X-Frame-Options via des Transform Rules / Response Headers, sans changer
d'hébergement.

### Finding 7 — Aucun lien externe en HTTP non sécurisé (Info / Pass)
Aucune ressource ni lien pointant vers `http://` (hors schémas `schema.org`/`w3.org`, non chargés)
n'a été trouvé dans les 6 pages. Les scripts tiers (GSAP, Lenis via cdn.jsdelivr.net) sont chargés
en HTTPS.

---

## 4. Structure des URLs

### Finding 8 — URLs propres mais avec extension .html (Low)
Structure d'URL simple et lisible (`/methode.html`, `/realisations.html`, etc.), cohérente avec les
canonicals et le sitemap. L'extension `.html` est visible dans les URLs, ce qui est un choix
esthétique mineur (non pénalisant pour le SEO) mais moins « propre » que des URLs sans extension.
**Recommandation** : optionnel — non prioritaire sur GitHub Pages sans configuration serveur
supplémentaire (nécessiterait des redirects via un service tiers type Cloudflare Workers).

---

## 5. Mobile-Friendliness

### Finding 9 — Viewport et responsive design corrects (Info / Pass)
`<meta name="viewport" content="width=device-width, initial-scale=1.0">` présent sur les 6 pages.
24 media queries détectées dans `css/style.css`, indiquant une approche responsive structurée
(pas uniquement desktop-first sans adaptation).
**Recommandation** : vérifier manuellement au Chrome DevTools (mode mobile) la taille des zones
cliquables (boutons CTA, liens de nav) pour confirmer un minimum de 44×44px, non mesurable
uniquement via le CSS source.

---

## 6. Core Web Vitals (indices depuis le code source)

### Finding 10 — Poids d'images élevé, risque LCP (High)
Le dossier `media/` pèse **15 Mo** au total. Plusieurs photos JPG dépassent 400-490 Ko
(`after-4.jpg` 490 Ko, `after-3.jpg` 484 Ko, `before-3.jpg` 480 Ko, `process-4.jpg` 452 Ko...), et
même les versions `.webp` restent volumineuses (jusqu'à 437 Ko pour `after-4.webp`), ce qui est
élevé pour du WebP bien compressé (cible recommandée : <150-200 Ko pour des images de contenu).
Le poster vidéo du hero (`hero-poster.jpg`, candidat LCP probable sur l'accueil) pèse **300 Ko**
et n'a pas d'équivalent `.webp`/`.avif`.
**Recommandation** :
- Recompresser les JPG/WebP de la galerie réalisations (viser 100-200 Ko par image en 1200px de large).
- Fournir `hero-poster.webp` (ou `.avif`) via une balise `<picture>` ou un attribut `poster` adapté,
  et compresser sous les 100 Ko.
- Envisager des tailles responsives (`srcset`) pour les images `width="1200"` servies telles quelles
  même sur mobile.

### Finding 11 — Bonnes pratiques déjà en place (Info / Pass partiel)
Points positifs pour limiter le CLS et l'INP :
- `<picture>` + `<source type="image/webp">` avec fallback JPG sur toutes les images de contenu.
- `loading="lazy"` appliqué systématiquement aux images hors-écran (45 occurrences sur index.html,
  15 sur realisations.html, 13 sur methode.html).
- Attributs `width`/`height` explicites sur les images (évite le layout shift au chargement).
- JS applicatif et librairies tierces (GSAP, ScrollTrigger, Lenis) chargés avec `defer`.

### Finding 12 — Vidéo hero sans `preload` explicite (Medium)
La vidéo de fond `media/hero-bg.mp4` (1,3 Mo) est déclarée `autoplay muted loop playsinline` sans
attribut `preload`. Par défaut (`preload="auto"` dans la plupart des navigateurs), le navigateur peut
commencer à télécharger la vidéo en concurrence avec le CSS/JS critique, ce qui peut retarder le
First Contentful Paint / LCP sur connexions mobiles.
**Recommandation** : ajouter `preload="none"` ou `preload="metadata"` sur la balise `<video>`, et
s'assurer que `hero-poster.jpg` (le vrai LCP visuel avant lecture de la vidéo) est servi le plus vite
possible et en poids réduit (cf. Finding 10).

### Finding 13 — CSS non préchargé, fichier unique (Low)
`css/style.css` (56 Ko) est chargé de façon standard via `<link rel="stylesheet">` sans `preload`,
et sans découpage critique CSS. Pour un fichier de cette taille, l'impact reste limité, mais un
`<link rel="preload" as="style">` ou un CSS critique inline pourrait légèrement améliorer le LCP sur
mobile/3G.

---

## 7. Structured Data

### Finding 14 — JSON-LD présent sur l'accueil (Info / Pass)
Deux blocs `<script type="application/ld+json">` détectés sur `index.html` (lignes 32 et 78),
cohérent avec l'ajout récent du schema FAQPage mentionné dans l'historique Git. Validation détaillée
du balisage (types, champs requis) à déléguer à une revue schema.org dédiée si nécessaire.

---

## 8. Rendu JavaScript

### Finding 15 — Site en rendu serveur/statique, aucun risque de CSR (Info / Pass)
Toutes les pages sont du HTML statique pré-rendu (pas de framework SPA/CSR). Le contenu textuel est
présent directement dans le HTML source, donc entièrement crawlable sans exécution JS. Les scripts
(GSAP, Lenis, script.js) ne servent qu'à des animations/interactions, pas au rendu du contenu
principal — aucun risque d'indexation lié au JS.

---

## 9. IndexNow

### Finding 16 — Protocole IndexNow non implémenté (Low)
Aucune clé IndexNow (fichier `<clé>.txt` à la racine) ni appel API détecté. Optionnel pour un site
vitrine à faible fréquence de publication, mais utile pour notifier Bing/Yandex/Naver rapidement
après chaque mise à jour de contenu (ex. nouvelles réalisations).
**Recommandation** : facultatif — à envisager si le site publie du contenu plus régulièrement
(articles, nouvelles réalisations) pour accélérer la réindexation.

---

## Synthèse des priorités

| Sévérité | Finding | Catégorie |
|---|---|---|
| High | Images JPG/WebP trop lourdes (jusqu'à 490 Ko), poster hero 300 Ko sans WebP | Core Web Vitals |
| Medium | Vidéo hero sans `preload="none"/"metadata"` | Core Web Vitals |
| Medium | Pas d'en-têtes de sécurité (limitation GitHub Pages, solution : proxy Cloudflare) | Sécurité |
| Low | Liens internes vers l'accueil en `index.html` au lieu de `/` | Indexability |
| Low | CSS non préchargé (fichier unique 56 Ko) | Core Web Vitals |
| Low | URLs avec extension `.html` | Structure URL |
| Low | IndexNow non implémenté | IndexNow |
| Low | `lastmod` du sitemap à maintenir avec rigueur | Crawlability |

## Score technique : 78/100

Calcul indicatif : Crawlability 18/20, Indexability 16/20 (-4 lien accueil), Sécurité 12/15
(-3 limitation headers, atténuable), URL 8/10, Mobile 9/10, Core Web Vitals 10/15 (-5 poids images/
vidéo hero), Structured Data/JS 5/5, IndexNow 0/5 (optionnel, non bloquant).

Le site est globalement solide techniquement (statique, canonicals propres, robots/sitemap valides,
responsive, aucun rendu JS bloquant). Le principal levier d'amélioration est le poids des images et
de la vidéo hero, qui impacte directement le LCP — surtout sur mobile/3G, cible probable d'une part
significative du trafic local.
