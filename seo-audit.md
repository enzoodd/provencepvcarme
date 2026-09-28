# Audit SEO technique — Provence PVC Armé
*Audit manuel (skill claude-seo non installé) — 2026-08-09*

## ✅ Déjà bon

- **Structure multi-pages propre** : 4 pages (accueil, méthode, réalisations, contact), un seul `<h1>` par page, hiérarchie de titres cohérente.
- **Sitemap.xml** : les 4 pages y figurent, avec priorités logiques (accueil 1.0, sous-pages 0.8).
- **Robots.txt** : correct, `Allow: /` + référence au sitemap avec le bon domaine.
- **Meta descriptions** : toutes entre 130 et 175 caractères, uniques par page, pas de troncature à prévoir.
- **Title tags** : uniques, ~50-65 caractères, formule cohérente `Page | Provence PVC Armé`.
- **Canonical + Open Graph + Twitter Card** : présents sur les 4 pages, URLs absolues.
- **Liens internes** : aucun lien cassé détecté — tous les `href` vers `*.html` et les ancres (`#faq`, `#pourquoi`, `methode.html#finitions`, etc.) pointent vers des cibles réelles.
- **CLS (Cumulative Layout Shift)** : la plupart des images ont un `aspect-ratio` fixé en CSS (`.ba-toggle`, `.teaser-grid img`, `.finish-chip`, `.coulisses-item`) — l'espace est réservé même sans attributs `width`/`height` HTML.
- **Lazy loading** : appliqué sur la quasi-totalité des images de galerie.
- **Schema.org LocalBusiness** : présent sur les 4 pages (nom, adresse, téléphone, zone desservie, gamme de prix).
- **Schema.org FAQPage** : ✅ ajouté aujourd'hui sur l'accueil (3 questions, contenu identique à la section visible).

## ⚠️ À corriger — nécessite ton input (pas appliqué)

| Point | Détail |
|---|---|
| **Geo coordinates** (schema.org) | Pas de `latitude`/`longitude` dans le LocalBusiness. Je peux les ajouter mais il faut une vraie géolocalisation de l'adresse (417 Chemin de la Françoise, 26220 Dieulefit) — je ne veux pas inventer de coordonnées. Dis-moi si tu as un point GPS ou si je peux géocoder l'adresse via un service. |
| **openingHours** (schema.org) | Absent — je n'ai pas vos horaires réels. À ajouter dès que tu me les donnes (ex. "Lun-Ven 8h-18h"). |
| **Incohérence adresse/ville** *(déjà signalée précédemment)* | `addressLocality: "Montélimar"` mais `postalCode: "26220"` (qui est celui de Dieulefit). Ça peut nuire à la cohérence NAP (Name-Address-Phone) aux yeux de Google. À trancher : soit remettre `Dieulefit`, soit confirmer que Montélimar est bien la ville légale. |

## 📸 Poids des images / Core Web Vitals

**Poids total de `media/` : ~12 Mo.** Rien de dramatique, mais plusieurs images sont plus lourdes que nécessaire pour du web :

| Fichier | Poids | Résolution | Remarque |
|---|---|---|---|
| `hero-poster.jpg` | **1,2 Mo** | 1920×2560 (portrait) | Le plus gros fichier du site, chargé tôt (poster vidéo hero = candidat LCP). Résolution portrait bizarre pour un fond de hero — à vérifier que c'est le bon fichier. |
| `hero-bg.mp4` | 3,5 Mo | — | Normal pour une vidéo de fond, déjà gérée en lazy côté JS. |
| `after-3/4.jpg`, `before-3/4.jpg`, `process-4/5.jpg`, `coulisses-2/3.jpg` | 350-490 Ko chacune | ~1100-1600px | Photos de chantier non compressées pour le web (probablement directement issues du téléphone). |
| Le reste (finitions, gallery-extra, finish-detail) | < 200 Ko | — | Déjà raisonnable. |

**Recommandation (non appliquée) : conversion en WebP.**
Un export WebP qualité 75-80 réduirait typiquement ces fichiers de 40-60% sans perte visuelle notable — sur les ~15 photos de chantier/réalisations concernées, ça representerait plusieurs Mo économisés au total, avec un effet direct sur le LCP (surtout `hero-poster.jpg`) et sur le temps de chargement des pages réalisations/méthode qui chargent le plus d'images.

Je n'ai **pas** appliqué cette conversion — je peux le faire si tu confirmes (ça demande soit un outil de conversion, soit de re-exporter les fichiers sources en WebP avec fallback JPEG pour compatibilité).

## 🔧 Corrections appliquées aujourd'hui (simples et sûres)

1. ✅ **Schema FAQPage** ajouté sur l'accueil (JSON-LD, 3 questions reprises telles quelles).
2. ✅ **`<lastmod>` du sitemap.xml** mis à jour à la date du jour sur les 4 pages.

## Priorisation suggérée pour la suite

1. **Haute priorité** — Trancher l'incohérence Montélimar/Dieulefit dans le schema (impact confiance/local SEO).
2. **Moyenne priorité** — Compresser `hero-poster.jpg` (impact LCP direct, un seul fichier à traiter).
3. **Moyenne priorité** — Ajouter `openingHours` si vous avez des horaires fixes (renforce le rich snippet LocalBusiness).
4. **Basse priorité mais bénéfice cumulé** — Conversion WebP du reste de la galerie photo.
5. **Optionnel** — Géocoder l'adresse pour les `geo` coordinates (aide le pack local Google Maps).
