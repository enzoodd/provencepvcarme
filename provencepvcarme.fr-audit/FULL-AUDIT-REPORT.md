# Audit SEO complet — Provence PVC Armé (provencepvcarme.fr)

*Audit du 2026-09-28 — 9 spécialistes (technique, performance, contenu, SXO, schema, sitemap, local, GEO/IA, visuel/mobile) sur le site **LIVE** `https://provencepvcarme.fr` (HTTP 200, hébergé sur GitHub Pages derrière un CDN Fastly, certificat Let's Encrypt valide). Audit comparatif par rapport au précédent (archivé dans `provencepvcarme.fr-audit-PREVIOUS-20260928/`, dont le rapport principal datait du 2026-08-11 — le site ne résolvait alors pas en DNS et avait été audité sur fichiers sources locaux uniquement).*

## Résumé exécutif

**Score de santé SEO global : 68 / 100** (précédent : 60/100, **+8**)

*Méthodologie du score global : moyenne simple des 9 notes de catégorie ci-dessous. Note : le découpage par catégorie a légèrement changé par rapport à l'audit précédent (qui isolait "On-Page SEO" et "Images" comme catégories à part) — ce round, le on-page est couvert à cheval sur Technical/SXO/Schema, et Images est couvert dans Performance. Voir "Limites et méthodologie" en fin de document.*

| Catégorie | Score précédent | Score actuel | Δ |
|---|---|---|---|
| Technique | 71 | **80** | +9 |
| Performance (Core Web Vitals) | 50 | **44** | **−6** |
| Contenu | 43 (E-E-A-T pondéré) / 52 (global cité par l'agent) | **60** | +8 à +17 selon la base |
| SXO (Search Experience) | 59 (ou 69 selon la base retenue par l'agent) | **77** | +8 à +18 |
| Schema / Structured Data | 60 (ou 67 selon le périmètre) | **58** | −2 à −9 |
| Sitemap | 96 | **92** | −4 |
| SEO Local | 37 | **38** | +1 |
| GEO / IA (AI Search Readiness) | 63 | **74** | +11 |
| Visuel / Mobile UX | 62 | **91** | **+29** |
| **Moyenne globale** | **60** | **68** | **+8** |

> Le site est désormais en ligne, le menu mobile est réparé, et la zone de service a gagné 7 pages ville dédiées de bonne qualité. Mais un problème transversal — **le SIRET reste un placeholder `[SIRET À COMPLÉTER]` visible en production** — a été relevé indépendamment par 4 des 9 agents (contenu, local, SXO, GEO) comme le signal de confiance le plus négatif du site, inchangé depuis plus d'un mois malgré un développement actif ailleurs. L'incohérence NAP (Montélimar vs Dieulefit) n'est pas corrigée non plus, seulement déplacée : elle oppose maintenant 11 pages marketing + le JSON-LD (Montélimar) aux 2 pages légales (Dieulefit) — une contradiction interne au site, pire qu'avant pour la cohérence inter-pages.

### Top 5 des problèmes critiques

1. **SIRET non renseigné, placeholder visible en production** — `mentions-legales.html` affiche littéralement `Numéro SIRET : [SIRET À COMPLÉTER]` avec un commentaire `<!-- TODO -->`, inchangé depuis l'audit du 2026-08-11 malgré ~20 commits dans l'intervalle. Obligation légale pour un auto-entrepreneur BTP ; signal de confiance très négatif relevé indépendamment par 4 agents sur 9.
2. **Incohérence NAP interne au site, non résolue** — le JSON-LD (4 pages) et le footer de 11 pages sur 13 disent "Montélimar" ; `mentions-legales.html`/`confidentialite.html` (footer + corps de texte légal) disent "Dieulefit, Drôme". Ce n'est plus une contradiction schema-vs-marketing comme avant, mais une contradiction directe entre deux pages du même site — bloquant pour toute future fiche Google Business Profile.
3. **Régression de performance : LCP mobile "Poor" à 11.2s sur `realisations.html`** — la nouvelle photo hero (`after-4.webp`, 428 Ko) est chargée sans `fetchpriority`/`preload`, en concurrence réseau avec 7 autres photos galerie (4.2 Mo/25 requêtes au total). La page est passée d'un hero texte léger à la page la plus lourde du site en conditions mobiles réelles.
4. **`hero-bg.mp4` (1,3 Mo) toujours non différé, LCP "Poor" à 6.0s sur l'accueil** — identique à l'audit précédent, aucune correction apportée au fichier ni à son chargement depuis le 11/08.
5. **Zéro preuve sociale et aucune mention d'assurance décennale** — aucun avis, témoignage, `Review`/`AggregateRating` sur les 13 pages ; aucune mention de la garantie décennale (légalement obligatoire pour ce type de chantier) — point qui pèse le plus sur le persona "décideur averse au risque" (SXO) et sur l'autorité locale (GBP, citations Tier 1 : aucune détectée).

### Top 5 des quick wins

1. **Renseigner le vrai SIRET** dans `mentions-legales.html` (ou une formulation transparente temporaire type "Immatriculation en cours — SIRET communiqué sur demande") — quelques minutes, impact de confiance disproportionné.
2. **Trancher Montélimar vs Dieulefit une bonne fois** et aligner les 4 blocs JSON-LD + les 13 footers + le corps de `mentions-legales.html` sur une seule ville — un choix de fond à faire, puis une correction mécanique.
3. **Ajouter `fetchpriority="high"` + `<link rel="preload" as="image">` sur la photo hero de `realisations.html`**, et générer une variante allégée dédiée (~120 Ko) au lieu de réutiliser le fichier 1200×1600 plein format — corrige la régression LCP la plus sévère du site.
4. **Ajouter `preload="metadata"` (ou retirer l'autoplay) sur `hero-bg.mp4`** — corrige le LCP "Poor" de l'accueil, identifié depuis deux audits consécutifs.
5. **Supprimer le schema `HowTo` de `methode.html`** — type déprécié par Google depuis 2023, recommandation déjà faite lors du précédent audit et non appliquée ; coût de suppression nul.

---

## 1. Technical SEO — 80/100 *(précédent : 71/100)*

**Corrigé depuis le dernier audit :** DNS résolu et site en ligne (13/13 pages HTTP 200) ; redirections http→https et www→non-www propres en un seul saut 301 ; HTTPS valide (Let's Encrypt) ; **menu mobile réparé et vérifié en live sur les 13 pages** à 390px (zéro débordement, hamburger pleinement cliquable, bouton d'appel conforme WCAG) ; compteurs statistiques désormais en dur dans le HTML ; sitemap étendu 6→13 URLs avec `lastmod` différenciés ; `BreadcrumbList` ajouté (absent avant).

**Toujours ouvert :**
- **Medium** — Aucun en-tête de sécurité personnalisé (HSTS, CSP, X-Content-Type-Options, Referrer-Policy) ; limitation structurelle de GitHub Pages sans proxy (ex. Cloudflare).
- **Medium** — Scripts CDN (GSAP/ScrollTrigger/Lenis) en version majeure flottante, sans SRI (`integrity=`) — même Three.js, pourtant épinglé en version exacte, n'a pas de hash SRI.
- **Low** — Pas de page 404 personnalisée (le statut HTTP est correct, mais le corps est la page générique GitHub Pages) ; liens internes vers l'accueil toujours en `href="index.html"` au lieu de `href="/"` ; IndexNow non implémenté ; `favicon.ico` racine absent (les PNG modernes sont en place) ; poids des médias toujours élevé (16 Mo, plusieurs fichiers 400-480 Ko inchangés depuis le 11/08).

**Régression :** aucune. Les 7 nouvelles pages de zone suivent la même structure technique saine que les pages historiques.

Détail complet : `findings/technical.md`

## 2. Performance (Core Web Vitals) — 44/100 *(précédent : 50/100, −6)*

**Méthode :** mesures réelles sur le site live via Chromium/Playwright (PSI/CrUX indisponibles, quota API épuisé), profil mobile throttlé (Slow-4G-like, CPU×4) comparable à la méthodologie Lighthouse ayant produit le chiffre de référence précédent.

**Corrigé depuis le dernier audit :** Google Fonts auto-hébergées et préchargées (chaîne de rendu bloquante éliminée) ; CLS toujours excellent (0.0000 partout, y compris avec les nouveaux visuels) ; scripts déjà en `defer` ; TTFB production 228ms (bon).

**Toujours ouvert :** `hero-bg.mp4` (1,33 Mo) non différé, candidat LCP de l'accueil (6.0s, Poor) ; `hero-poster.jpg` toujours sans WebP/AVIF ; galerie before/after sans `srcset` responsive (222-436 Ko par image, une seule résolution servie à tous les écrans) ; coût CPU élevé de Three.js sur `methode.html` (TBT ~2024ms throttlé — risque INP).

**Régression confirmée :** la nouvelle section photo hero de `realisations.html` fait grimper le LCP mobile à **11.2s (Poor)**, aggravée par la contention réseau de 7 autres photos chargées en parallèle (4.2 Mo/25 requêtes). C'est la pire page du site en conditions mobiles réelles, alors qu'elle n'avait pas d'image de fond avant.

Détail complet : `findings/performance.md`

## 3. Qualité de contenu — 60/100 *(précédent : 43-52/100 selon la base)*

**Corrigé depuis le dernier audit :** liens légaux morts → vraies pages liées depuis tous les footers ; FAQ passée de 3 à 7 questions denses et factuelles (130-190 mots chacune) ; contenu local "thin" → remplacé par 7 pages ville réellement différenciées (distance précise, chantiers nommés, mini-FAQ propre) ; ambiguïté garantie fabricant/pose clarifiée lexicalement.

**Toujours ouvert :**
- **Critical** — SIRET placeholder (voir résumé exécutif).
- **High** — `realisations.html` reste une galerie de légendes sans texte narratif (188 mots) alors que les pages ville ont désormais ce contexte pour 3 des 4 chantiers montrés ; `methode.html` sous le seuil recommandé (469 mots vs 800, malgré une amélioration qualitative réelle) ; zéro preuve sociale nulle part.
- **Medium** — Bloc "Finitions" toujours dupliqué accueil/méthode ; aucun signal d'expertise/auteur affiché publiquement ; formulaire de contact sans lien vers la politique de confidentialité au point de collecte des photos.
- **Low** — H1 de `realisations.html` ("Avant / Après") toujours peu descriptif malgré la refonte visuelle ; double garantie (fabricant vs pose) encore non reliée explicitement ; FAQ des pages ville non balisée en `FAQPage`.

Détail complet : `findings/content.md`

## 4. Schema / Structured Data — 58/100 *(précédent : 60-67/100 selon le périmètre)*

**Corrigé depuis le dernier audit :** `BreadcrumbList` étendu aux 7 nouvelles pages ville, fidèle au HTML visible ; `Service.provider` par référence `@id` sur ces mêmes pages ; cohérence retrouvée entre le rayon "2h" du JSON-LD et le contenu visible (fini la contradiction 1h/8 départements) ; parité FAQPage/FAQ visible confirmée mot pour mot sur les 7 questions.

**Toujours ouvert :**
- **Critical** — Incohérence NAP non résolue (voir résumé exécutif) : Montélimar (JSON-LD + 11 footers) vs Dieulefit (mentions légales + son footer).
- **High** — `HowTo` toujours présent sur `methode.html` malgré la recommandation explicite du précédent audit de le retirer (type déprécié sans rich result depuis 2023).
- **Medium** — `sameAs` toujours absent des 4 blocs `GeneralContractor` ; `mentions-legales.html`/`confidentialite.html` n'ont aucun JSON-LD (0 bloc) ; `Service.areaServed` ferme sur Marseille/Montpellier/Aix alors que la page d'accueil présente ces villes comme "hors périmètre, au cas par cas" (nouvelle incohérence).

Détail complet : `findings/schema.md`

## 5. Sitemap & robots.txt — 92/100 *(précédent : 96/100, −4)*

**Corrigé depuis le dernier audit :** statut HTTP live vérifié pour les 13 URLs + sitemap.xml + robots.txt (tous 200 OK en production, contre une vérification locale uniquement avant) ; le pattern "date identique partout" a disparu, `lastmod` désormais différencié sur 9/13 URLs ; parité 1:1 maintenue malgré la croissance 6→13 URLs.

**Nouveau problème (Medium) :** `lastmod` stale de 1-2 jours sur 4 des 7 pages ville (Orange, Aix, Montpellier, Pierrelatte) par rapport à leur dernier commit réel — le cas Pierrelatte affiche même une date antérieure à la création du fichier.

**Toujours ouvert (Low/Info) :** balises dépréciées `priority`/`changefreq` toujours présentes ; sitemap image absent malgré l'ajout de vraies photos de chantier.

Détail complet : `findings/sitemap.md`

## 6. SEO Local — 38/100 *(précédent : 37/100, quasi stable)*

| Dimension | Score /100 |
|---|---|
| Signaux GBP | 5 |
| Avis & réputation | 5 |
| SEO on-page local | 70 |
| Cohérence NAP & citations | 35 |
| Schema local | 60 |
| Liens & autorité locale | 15 |

**Corrigé depuis le dernier audit :** site en ligne (prérequis absolu) ; incohérence "rayon d'intervention" résolue dans le contenu visible (uniformément "~2h" + 5 départements) ; **7 pages de service dédiées créées**, répondant directement à la recommandation n°1 de l'audit précédent, avec un contenu réellement différencié par ville (vérifié, pas de duplicate content).

**Toujours ouvert :** incohérence NAP Montélimar/Dieulefit (voir résumé exécutif) ; zéro signal GBP détectable (aucun embed Maps, aucun `sameAs`, aucun widget d'avis) ; zéro avis/témoignage ; aucune citation Tier 1 détectable (Pages Jaunes, Societe.com, etc.) ; SIRET placeholder.

**Nouveau :** incohérence entre la meta description homepage (qui cite Marseille comme couverte) et la page dédiée/section zones (qui la présente comme hors rayon standard, "au cas par cas") ; département Isère absent de la meta description alors que présent dans le schema/footer.

Détail complet : `findings/local.md`

## 7. GEO / AI Search Readiness — 74/100 *(précédent : 63/100, +11)*

| Dimension | Score /100 |
|---|---|
| Citabilité | 82 |
| Lisibilité structurelle | 78 |
| Contenu multi-modal | 60 |
| Autorité & signaux de marque | 58 |
| Accessibilité technique | 90 |

**Nouveau point de départ :** le site est désormais crawlable par les bots IA (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot tous autorisés par `robots.txt`, vérifié en live) — aucune citation IA n'avait pu être testée avant car le DNS ne résolvait pas.

**Points forts :** FAQ recalibrée dans la fourchette optimale de citation IA (131-160 mots/réponse) ; 7 pages ville avec mini-FAQ et schema dédiés ; ton globalement factuel et vérifiable (normes citées, transparence assumée sur les limites de zone) ; site 100% HTML statique, aucune dépendance JS pour le contenu textuel.

**Toujours ouvert :** `llms.txt` absent (404) ; aucun signal de marque externe (`sameAs`, Wikipedia, YouTube, LinkedIn) — le signal le plus corrélé aux citations IA et totalement absent ; pas de `datePublished`/`dateModified` structuré.

Détail complet : `findings/geo.md`

## 8. Visuel / Mobile UX — 91/100 *(précédent : 62/100, +29)*

**Corrigé depuis le dernier audit :**
- **Menu mobile à 390px : RÉSOLU** (était Critical) — vérifié sur 5 pages, fold et full : zéro débordement, hamburger pleinement cliquable et visible, bouton d'appel 50×44px conforme WCAG.
- **Cible tactile "Appeler" : RÉSOLUE** (était High) — passée de 46×38px à 50×44px.

**Toujours ouvert (mineur, non bloquant) :** quelques cibles tactiles secondaires sous 44px (CTA "Voir la méthode" 146×37px, badges de villes 42px de hauteur, liens du footer) ; léger chevauchement cosmétique entre la barre CTA sticky mobile et la dernière ligne du footer.

**Régression : aucune détectée.** Les deux refontes visuelles récentes (tableau comparatif `methode.html`, hero photo `realisations.html`) ont été vérifiées spécifiquement : rendu propre, contrasté, sans débordement ni chevauchement sur desktop comme mobile. 0 image cassée, 0 erreur console, 0 requête réseau échouée sur les 20 combinaisons testées.

Détail complet : `findings/visual.md` · Captures : `screenshots/` (20 captures + 4 crops ciblés) · Données brutes : `capture-data.json`

## 9. Search Experience (SXO) — 77/100 *(précédent : 59-69/100 selon la base)*

| Dimension | Score | Max |
|---|---|---|
| Adéquation type de page | 14 | 15 |
| Profondeur de contenu | 11 | 15 |
| Signaux UX | 12 | 15 |
| Schema.org | 13 | 15 |
| Média | 14 | 15 |
| Autorité / preuve sociale | 5 | 15 |
| Fraîcheur | 8 | 10 |

**Corrigé depuis le dernier audit :** FAQ courte → approfondie (7 questions) ; contenu local "thin" → 7 pages de zone dédiées, meilleur pattern SXO qu'un accordéon, reproduisant le pattern gagnant d'un concurrent direct (fusionpiscine.fr) observé sur le SERP.

**Toujours ouvert :** aucune preuve sociale tierce (maintenu High) ; aucune mention d'assurance décennale, légalement obligatoire (maintenu High) ; aucune fourchette de prix même indicative (sévérité adoucie par la nouvelle FAQ transparente) ; `realisations.html` pauvre en récit de chantier ; pas de carte interactive/lien itinéraire sur `contact.html`.

**Nouveau :** SIRET placeholder identifié comme LE problème prioritaire par cet agent également ("priorité plus haute que n'importe quel autre chantier SXO de cette liste").

**Verdict d'adéquation page/intention : ALIGNÉ, renforcé.** Aucun mismatch de type de page à corriger — le problème central reste un déficit d'autorité perçue / preuve tierce.

Détail complet : `findings/sxo.md`

---

## Synthèse : corrigé / toujours ouvert / régressé (vue transversale)

### Corrigé depuis l'audit du 2026-08-11
- Site déployé publiquement (DNS résolu, HTTPS valide, 13/13 pages HTTP 200).
- Menu mobile réparé et vérifié à 390px sur toutes les pages testées.
- Cible tactile du bouton "Appeler" mobile conforme WCAG.
- Pages légales réelles (`mentions-legales.html`, `confidentialite.html`) et liées depuis tous les footers.
- Zone de service clarifiée dans le contenu visible et le JSON-LD ("2h", 5 départements, fini la contradiction 1h/8 départements) — mais voir "Régressé" pour une incohérence résiduelle sur Marseille.
- FAQ étoffée de 3 à 7 questions, schema `FAQPage` fidèle au texte visible.
- 7 pages ville dédiées créées (Avignon, Orange, Marseille, Pierrelatte, Valence, Montpellier, Aix-en-Provence), contenu réellement différencié, schema `Service`/`BreadcrumbList` propre.
- `BreadcrumbList` ajouté sur les pages qui n'en avaient pas.
- Compteurs statistiques en dur dans le HTML (plus de "0" avant exécution JS).
- Google Fonts auto-hébergées (chaîne de rendu bloquante éliminée).
- Titres `<title>`/`og:title`/`twitter:title` simplifiés sur "PVC armé" (terme conservé dans les meta descriptions pour la requête secondaire "liner armé"), validé par l'agent SXO comme alignement SERP pertinent.

### Toujours ouvert (le même problème de fond, sous une forme parfois différente)
- **SIRET placeholder** — identique à avant, non corrigé.
- **Incohérence NAP** — toujours présente, déplacée de "schema vs footer sur 4 pages" à "11 pages marketing vs 2 pages légales".
- **`HowTo` déprécié sur `methode.html`** — recommandation de suppression de l'audit précédent non appliquée.
- **`hero-bg.mp4` non différé** — fichier identique, aucune correction depuis le 11/08.
- **Zéro preuve sociale, zéro signal GBP, zéro mention décennale** — inchangé.
- **Poids médias élevé** (16 Mo, galerie sans `srcset` responsive) — inchangé.
- **Aucune fourchette de prix** — toujours absente, mais désormais justifiée par une question FAQ transparente (progrès partiel).

### Régressé ou nouveau problème
- **Performance `realisations.html`** — nouvelle section photo hero sans `fetchpriority`/preload, LCP mobile 11.2s (Poor), pire page du site. Régression directe liée à une modification de cette session.
- **Incohérence Marseille** — meta description homepage présente Marseille comme couverte, alors que la page dédiée et la section zones la présentent comme "hors rayon standard, au cas par cas". Département Isère absent de la meta description alors que présent ailleurs.
- **`lastmod` stale sur 4 pages ville** — écart mineur (1-2 jours) mais le cas Pierrelatte affiche une date antérieure à la création du fichier.
- **Précision géo dégradée** — `geo` passé de 7 à 4 décimales (sous le seuil recommandé de 5), régression mineure compensée par le fait que les nouvelles coordonnées pointent au moins vers la bonne ville (Montélimar, cohérent avec `addressLocality`).
- **`address` schema appauvrie** — `streetAddress`/`postalCode` retirés sans que ce choix (modèle SAB sans adresse visible) soit assumé ou documenté ailleurs sur le site.

---

## Limites et méthodologie

- Le découpage en catégories diffère légèrement de l'audit précédent : "On-Page SEO" (72/100 précédemment) n'a pas été ré-audité comme catégorie isolée ce round — son périmètre est couvert à cheval sur Technical, Schema et SXO. "Images" (55/100 précédemment) est couvert dans Performance ce round plutôt qu'isolément. Les scores "précédent" affichés pour Contenu, SXO et Schema varient selon la base retenue par l'agent (global vs sous-score pondéré, ou périmètre 4 pages vs 13 pages) — ces nuances sont documentées dans chaque section et dans les fichiers `findings/` correspondants.
- Mesures de performance : PSI API et CrUX indisponibles (quota épuisé), remplacées par des mesures directes via Chromium/Playwright avec throttling réseau/CPU équivalent au profil "Slow 4G" historique de Lighthouse — ce sont des mesures *lab* (un run par page), pas des données *field* à 75e percentile. Le site vient de passer en ligne : pas encore assez de trafic Chrome réel pour peupler CrUX.
- Audit visuel limité à 5 pages représentatives (accueil, méthode, réalisations, contact, une page ville) sur les 13 — les 6 autres pages ville n'ont pas été capturées individuellement cette session (structure identique vérifiée par les agents content/local/schema sur le code source).
- Aucun accès Google Search Console / GA4 configuré — impossible de vérifier l'indexation réelle ou le trafic.

