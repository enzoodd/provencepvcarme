# Audit SEO complet — Provence PVC Armé (provencepvcarme.fr)

*Audit du 2026-08-11 — 9 spécialistes (technique, contenu, schema, sitemap, performance, images, visuel/mobile, GEO/IA, local, SXO) sur les fichiers sources locaux, servis via un serveur local (le domaine public ne résout pas encore en DNS).*

## Résumé exécutif

**Score de santé SEO global : 60 / 100**

**Type d'activité détecté :** entreprise locale de service (hybride vitrine/zone de service) — spécialiste de la pose de membrane PVC armée par thermosoudage pour piscines (construction, rénovation, étanchéité), basée 417 Chemin de la Françoise, 26220 Dieulefit, revendiquant une zone "Montélimar et environs (rayon d'1h)" et 8 départements desservis.

> ⚠️ Correction de cadrage : le brief initial décrivait un menuisier fenêtres/portes. Le site réel est un spécialiste de l'étanchéité de piscine par membrane PVC armée — aucun contenu fenêtres/portes n'existe sur le site. Cet audit porte sur le site tel qu'il existe réellement.

### Top 5 des problèmes critiques

1. **Site non déployé publiquement** — `provencepvcarme.fr` renvoie NXDOMAIN (DNS non résolu) au 2026-08-11. Bloque 100% de l'indexation tant que ce n'est pas corrigé.
2. **Menu mobile cassé sur toutes les pages** — à 390px de large, le header déborde de 84px, le bouton "Devis gratuit" est tronqué et le bouton hamburger est poussé entièrement hors écran (inatteignable).
3. **Aucune preuve de confiance légale/professionnelle** — pas de SIRET, pas de mention d'assurance décennale ou de certification, et les liens "Mentions légales"/"Politique de confidentialité" sont des placeholders `href="#"` alors qu'un formulaire collecte nom, téléphone, email et **photos du domicile**.
4. **Incohérence NAP dupliquée sur les 4 pages** — le schema LocalBusiness indique `addressLocality: "Montélimar"` avec le code postal 26220 (celui de Dieulefit), contredisant le footer visible ; la zone de service annoncée ("rayon d'1h autour de Montélimar") contredit aussi la liste de 8 départements de la page contact.
5. **LCP mesuré "Poor" à 4.19s** (Lighthouse mobile réel) — `hero-poster.jpg` fait 1,16 Mo en résolution portrait 1920×2560 inadaptée ; la vidéo `hero-bg.mp4` (3,5 Mo) n'est pas différée, contrairement à ce que supposait l'audit manuel précédent.

### Top 5 des quick wins

1. Corriger le CSS `.nav-inner` (ajouter un point de rupture/wrap sous 900px) — un seul fichier à modifier, répare le menu mobile sur les 4 pages.
2. Remplacer `addressLocality: "Montélimar"` par l'adresse légale réelle dans le JSON-LD des 4 pages — correction d'une ligne × 4 fichiers.
3. Réexporter `hero-poster.jpg` en résolution paysage (~1920×1080) et format WebP/AVIF — plus gros levier LCP disponible.
4. Mettre la valeur réelle des compteurs statistiques dans le HTML (actuellement "0" en dur, animé par JS).
5. Ajouter le schema `BreadcrumbList` correspondant aux fils d'Ariane déjà visibles sur méthode/réalisations/contact — aucun nouveau contenu requis.

---

## 1. Technical SEO — 71/100

**Ce qui fonctionne bien :** site statique multi-pages entièrement crawlable sans JS, robots.txt/sitemap.xml cohérents, canonicals/viewport/OG corrects sur les 4 pages, CSS respectueux de `prefers-reduced-motion`, aucun lien interne cassé.

**Principaux problèmes :**
- **Critical** — Site non déployé (DNS NXDOMAIN), bloque l'indexation.
- **High** — NAP incohérent dans le schema (Montélimar / CP 26220).
- **High** — `hero-poster.jpg` surdimensionné, candidat LCP principal.
- **Medium** — Compteurs statistiques affichent "0" sans JS ; H1 hero retardé par une animation opacity ; en-têtes de sécurité indéterminés ; liens légaux morts.
- **Low/Info** — Scripts CDN non épinglés sans SRI, pas de page 404, 11 photos galerie non compressées, geo/openingHours absents, pas de BreadcrumbList, pas de favicon fallback, pas de clé IndexNow.

Détail complet : `findings/technical.md`

## 2. Content Quality — 43/100

**Ce qui fonctionne bien :** photos de chantier réelles et spécifiques (villages nommés), copy technique précis et non générique, FAQPage JSON-LD fidèle au contenu visible, bonne scannabilité, positionnement prix honnête et assumé.

**Principaux problèmes :**
- **Critical** — Aucune mention SIRET/assurance décennale/certification nulle part.
- **Critical** — Liens légaux morts + formulaire collectant des données personnelles et des photos sans politique de confidentialité liée.
- **High** — Contenu léger sur chaque page (378/463/103/166 mots vs seuils de 500/800/-/300+) ; NAP incohérent ; zéro preuve sociale ; portfolio sans profondeur narrative (légendes seules).
- **Medium** — FAQ trop superficielle (3 questions) ; aucun repère tarifaire même indicatif ; contenu zone de service = liste de tags sans texte ; schémas HowTo/BreadcrumbList manquants malgré contenu déjà structuré.
- **Low/Info** — Bloc "Finitions" dupliqué accueil/méthode, H1 faible sur réalisations, terme "lé" non défini à sa première occurrence, lastmod bumpé sans changement proportionnel.

Détail complet : `findings/content.md`

## 3. On-Page SEO — 72/100

**Ce qui fonctionne bien :** title tags uniques et bien calibrés, meta descriptions uniques (130-175 caractères), un seul H1 par page, maillage interne complet sans lien cassé.

**Principaux problèmes :** H1 générique sur réalisations, bloc de contenu dupliqué entre deux pages, valeurs des compteurs absentes du HTML statique.

## 4. Schema / Structured Data — 60/100

**Ce qui fonctionne bien :** LocalBusiness et FAQPage JSON-LD valides et bien formés sur les 4 pages.

**Principaux problèmes :**
- **Critical** — Incohérence NAP confirmée dans le JSON-LD, dupliquée sur les 4 pages.
- **Medium** — `geo`/`openingHours` toujours absents (nécessite données réelles du propriétaire) ; `@type` générique (`HomeAndConstructionBusiness` recommandé) ; `BreadcrumbList` absent malgré une UI déjà présente.
- **Low/Info** — Pas de `sameAs`/`@id`, pas de schema Service, FAQPage sans bénéfice SERP direct (Google a retiré les rich results FAQ pour tous les sites le 7 mai 2026, mais le schema garde sa valeur GEO/E-E-A-T), pas de Review/AggregateRating (normal, en attente de vrais avis).

Détail complet : `findings/schema.md`

## 5. Sitemap — 96/100

**Ce qui fonctionne bien :** XML bien formé, parité parfaite 1:1 avec les pages réelles, ancres correctement exclues, robots.txt référence le sitemap correctement, sitemap index non nécessaire à cette échelle.

**Principaux problèmes :** statut HTTP live invérifiable (pré-lancement, High mais lié au déploiement, pas à une erreur d'auteur) ; lastmod identique sur les 4 URLs (pattern à éviter à l'avenir) ; opportunité de sitemap image pour les 26 photos.

Détail complet : `findings/sitemap.md`

## 6. Performance (Core Web Vitals) — 50/100

**Méthode :** audit Lighthouse mobile réel sur la page d'accueil (via serveur local) ; analyse statique pour les 3 autres pages.

**Ce qui fonctionne bien :** CLS excellent (0.002), DOM léger, TTFB quasi nul, `font-display: swap` correctement utilisé, lazy loading appliqué sur la quasi-totalité des images.

**Principaux problèmes :**
- **Critical** — LCP mesuré "Poor" à 4.19s ; hero-poster.jpg surdimensionné et vidéo hero non différée.
- **High** — Chaîne de rendu bloquante Google Fonts (3 sauts, ~106 Ko) ; 16 photos galerie non optimisées (5,88 Mo).
- **Medium** — Scripts sans defer/async (TBT 441ms).
- **Info** — 3 pages non mesurées en lab cette session (à refaire une fois en ligne).

Détail complet : `findings/performance.md`

## 7. Images — 55/100

**Ce qui fonctionne bien :** alt text descriptif, lazy loading appliqué, aspect-ratio CSS réservé pour limiter le CLS.

**Principaux problèmes :** hero-poster.jpg surdimensionné et mal orienté (High) ; 16 photos de galerie non compressées, ~5,9 Mo cumulés (High) ; marque fournisseur "Renolit" visible uniquement en alt text (Low).

## 8. AI Search Readiness (GEO) — 63/100

**Ce qui fonctionne bien :** HTML entièrement rendu côté serveur, robots.txt permissif pour les crawlers IA, FAQ native mirrorée exactement dans le schema, plusieurs faits courts et citables tels quels, tableau comparatif et coupe 3D avec texte DOM réel.

**Principaux problèmes :**
- **High** — Incohérence NAP dans le JSON-LD ; le terme "PVC armé" seul est ambigu en français (plus associé aux fenêtres/portes qu'aux piscines) sans ancrage de désambiguïsation externe.
- **Medium** — Pas de llms.txt, passages trop courts pour la fenêtre de citation IA optimale (134-167 mots) ; aucun signal auteur/expérience/certification.
- **Low** — Étapes du process non marquées en HowTo, crawlers IA non explicitement nommés dans robots.txt (déjà autorisés implicitement).

Score détaillé : Citabilité 65, Lisibilité structurelle 78, Multi-modal 45, Signaux d'autorité/marque 40, Accessibilité technique 80.

Détail complet : `findings/geo.md`

## 9. Local SEO — 37/100

**Ce qui fonctionne bien :** adresse et téléphone visibles et cohérents dans le footer, zone de service mentionnée à plusieurs endroits.

**Principaux problèmes :**
- **Critical** — NAP contredit sur les 4 pages (schema Montélimar vs footer Dieulefit, même code postal 26220).
- **High** — La zone de service se contredit elle-même (rayon 1h vs 8 départements listés dont certains à 2h+) ; zéro signal Google Business Profile (pas de carte, pas de lien itinéraire, pas de réseaux sociaux) ; zéro avis/témoignage.
- **Medium** — Type de schema générique (HomeAndConstructionBusiness/GeneralContractor recommandé au lieu de LocalBusiness) ; geo/openingHoursSpecification absents ; lien "Mentions légales" mort.

Détail complet : `findings/local.md`

## 10. Visual / Mobile UX — 62/100

**Ce qui fonctionne bien :** vidéo hero et scènes canvas s'affichent correctement sans erreur console, contenu essentiel survit avec JS désactivé, toggle avant/après fonctionnel.

**Principaux problèmes :**
- **Critical** — Menu mobile complètement inatteignable sur toutes les pages (header déborde de 84px à 390px, hamburger poussé hors écran). Cause identifiée dans `css/style.css` (`.nav-inner` sans wrap sous 900px).
- **Medium** — Cible tactile "Appeler" sous-dimensionnée (46×38px vs 44-48px recommandé).
- **Low** — Numéro de téléphone non visible en clair sur le header mobile.

Détail complet : `findings/visual.md` · Captures : `screenshots/`

## 11. Search Experience (SXO) — 59/100

**Ce qui fonctionne bien :** le format de page (hero + process + portfolio + contact) correspond globalement à l'intent recherché pour le cluster de requêtes locales-transactionnelles.

**Principaux problèmes :**
- **Critical** — Zéro information de prix, alors que l'espace de mots-clés associé est dominé par des pages affichant des €/m² explicites.
- **High** — Zéro témoignage/avis ; aucune mention d'assurance décennale/certifications pour un achat à considération élevée.
- **Medium** — Persona "décideur averse au risque" note seulement 43/100 (le plus faible des 5 personas testés) ; pas de carte intégrée malgré 8 départements revendiqués.

Score détaillé (7 dimensions) : Type de page 12/15, Profondeur contenu 9/15, Signaux UX 11/15, Schema 7/15, Média 13/15, **Autorité 3/15** (dimension la plus faible), Fraîcheur 4/10.

Détail complet : `findings/sxo.md`

---

## Limites de cet audit

- Le domaine `provencepvcarme.fr` ne résout pas en DNS au moment de l'audit (site pré-lancement) — aucune requête live n'a été faite vers le domaine public ; l'analyse s'appuie sur les fichiers sources et un serveur local miroir.
- Pas de données Google Search Console / GA4 / CrUX (aucun identifiant configuré) ni de profil de backlinks (le domaine n'étant pas encore indexé, il n'existe pas de backlinks à analyser).
- 3 des 4 pages n'ont pas été mesurées en Lighthouse "lab" cette session (analyse statique uniquement) ; à refaire une fois le site en ligne.
