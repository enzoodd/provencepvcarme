# Audit GEO / AI Search Readiness — provencepvcarme.fr

*Audit du 2026-09-28 — site désormais LIVE (HTTP 200 confirmé sur https://provencepvcarme.fr, hébergé sur GitHub Pages / CDN Fastly). L'audit de référence précédent (dossier `provencepvcarme.fr-audit-PREVIOUS-20260928`, en réalité daté du 2026-08-11) avait été réalisé en pré-lancement, sur fichiers sources locaux, alors que le domaine ne résolvait pas en DNS (NXDOMAIN) — aucune citation IA n'avait donc pu être testée. Le site est maintenant public et crawlable : c'est un point de départ neuf pour le GEO, pas une comparaison de régression.*

**Score GEO global : 74/100**

| Dimension | Poids | Score | Contribution |
|---|---|---|---|
| Citabilité | 25% | 82/100 | 20.5 |
| Lisibilité structurelle | 20% | 78/100 | 15.6 |
| Contenu multi-modal | 15% | 60/100 | 9.0 |
| Autorité & signaux de marque | 20% | 58/100 | 11.6 |
| Accessibilité technique | 20% | 90/100 | 18.0 |

Le site a fait un bond très net par rapport au socle identifié pré-lancement : la FAQ est passée de 3 questions de 30-50 mots à **7 questions de 131-160 mots** (quasi pile dans la fourchette optimale 134-167 mots), et la zone de service, auparavant un paragraphe narratif unique, est désormais éclatée en **7 pages dédiées par ville** avec mini-FAQ, schema `Service` et `BreadcrumbList` propres. Le principal frein restant est l'absence de signaux de marque externes (aucun `sameAs`, aucune mention Wikipedia/Reddit/YouTube/LinkedIn) et quelques trous de complétude (SIRET manquant, incohérence d'adresse, pas de `llms.txt`).

---

## Nouveau point de départ (site désormais indexable)

- **Le domaine résout et répond HTTP 200** sur les 13 pages listées dans `sitemap.xml` (accueil, méthode, réalisations, contact, mentions légales, confidentialité, 7 pages ville). Confirmé via fetch direct (`Server: GitHub.com`, `Last-Modified: Mon, 28 Sep 2026`).
- **`robots.txt` live identique au fichier source** : `User-agent: * / Allow: /`, avec `Sitemap:` déclaré. GPTBot, OAI-SearchBot, ClaudeBot et PerplexityBot sont donc **autorisés dès maintenant** — pour la première fois, ces crawlers peuvent effectivement atteindre et indexer le site.
- **`sitemap.xml` live à jour** : 13 URLs, `lastmod` récents (2026-09-23 à 2026-09-28), cohérent avec les 13 pages listées dans le brief.
- Ce changement d'état change la nature de l'audit : les recommandations ci-dessous portent sur l'optimisation d'un contenu déjà exposé aux crawlers IA, et non plus sur un préalable de déploiement.

## Toujours ouvert (repris de l'audit pré-lancement, non résolu)

- **`llms.txt` absent** (`/llms.txt` → HTTP 404 confirmé en live). Toujours non prioritaire pour Google Search mais reste une opportunité facile pour guider ChatGPT/Perplexity vers les pages clés — non traité depuis le dernier audit.
- **Aucun signal de marque externe** : toujours aucun `sameAs` dans le schema `GeneralContractor`, et toujours aucune mention détectée de Wikipedia, Reddit, YouTube ou LinkedIn dans le HTML source. C'est le signal qui corrèle le plus fortement avec les citations IA (YouTube ~0.737) et il reste à zéro.
- **Pas de `datePublished`/`dateModified` en JSON-LD** sur les pages de contenu — seule la page `mentions-legales.html` affiche une date lisible ("Dernière mise à jour : 24 août 2026"), aucune autre page n'a de signal de fraîcheur structuré.

## Points forts

- **FAQ largement étoffée et recalibrée pour la citation IA** : 7 questions sur la page d'accueil, réponses de 131 à 160 mots (calculé sur le JSON-LD `FAQPage`), soit très proche de la fourchette optimale 134-167 mots identifiée pour l'extraction par les moteurs IA — contre 30-50 mots dans la version pré-lancement.
- **Zone de service restructurée en 7 pages dédiées** (`pose-membrane-pvc-arme-{avignon,orange,marseille,pierrelatte,valence,montpellier,aix-en-provence}.html`), chacune avec un H1 spécifique, un paragraphe d'intro autonome, 2 questions de mini-FAQ propres à la ville, un maillage "voir aussi" vers les secteurs voisins, et un schema `Service` (`areaServed: City`) + `BreadcrumbList`. C'est exactement la recommandation #3 du précédent audit, implémentée.
- **Ton globalement factuel et vérifiable**, particulièrement soigné dans la FAQ et le tableau comparatif de `methode.html` : les affirmations s'appuient sur des repères objectifs (norme Afnor NF T54-804, épaisseur 150/100e vs 75/100e, durée de vie 15-25 ans vs 8-10 ans) plutôt que sur des superlatifs commerciaux. Formulations notables : *"un repère objectif au-delà des seules affirmations commerciales"*, *"pas seulement à nos propres standards internes"* — un ton qui va dans le sens de ce que valorisent les moteurs IA (contenu vérifiable, non promotionnel).
- **Transparence assumée sur les limites de zone** : les pages Marseille, Montpellier et Aix-en-Provence précisent explicitement être "à la limite de notre rayon d'intervention habituelle" et que les projets y sont "étudiés au cas par cas... plutôt que couverts de façon systématique", avec la phrase *"Nous préférons rester transparents sur cette limite plutôt que de promettre une couverture que nous ne pourrions pas tenir"* (page Marseille). C'est un signal de fiabilité factuelle directement aligné avec la consigne du propriétaire d'éviter les affirmations non prouvables.
- **HowTo schema ajouté sur `methode.html`** (4 étapes : visite & relevé, conception, pose & thermosoudage, contrôle & livraison), en plus de `Service` et `BreadcrumbList` — bon enrichissement structurel pour la citabilité du processus.
- **Site 100% HTML statique servi côté serveur**, `script.js` vérifié : aucune injection de contenu textuel via JS (seulement bascules UI avant/après, compteurs, statut de formulaire) — accessibilité technique maximale pour les crawlers IA qui ne rendent pas toujours le JavaScript.

---

## Statut d'accès crawlers IA (robots.txt, vérifié en live)

```
User-agent: *
Allow: /

Sitemap: https://provencepvcarme.fr/sitemap.xml
```

- GPTBot : **autorisé**
- OAI-SearchBot : **autorisé**
- ClaudeBot : **autorisé**
- PerplexityBot : **autorisé**
- CCBot / anthropic-ai / cohere-ai : **autorisés aussi** (aucun blocage sélectif de l'entraînement — choix possible mais non fait, non bloquant)

**Sévérité : Info.** Aucun blocage détecté. C'est désormais un accès *réel*, alors qu'il était purement théorique lors du dernier audit (DNS ne résolvait pas).

## llms.txt

**Statut : ABSENT** — `https://provencepvcarme.fr/llms.txt` renvoie HTTP 404 (vérifié en live). Aucune licence RSL 1.0 détectée non plus.

**Sévérité : Moyenne.** Non bloquant pour l'indexation Google/Bing, mais opportunité manquée pour guider explicitement les LLM (ChatGPT, Perplexity, Claude) vers les pages à forte valeur : accueil (FAQ), méthode (HowTo), réalisations, et les 7 pages ville. Effort de création très faible maintenant que le site est stable.

## Citabilité des passages

- **FAQPage schema (accueil) : 7 questions, réponses de 131 à 160 mots** (mesuré directement sur le JSON-LD) — dans ou très proche de la fourchette optimale de 134-167 mots. Grosse amélioration par rapport aux 30-50 mots précédents.
- Chaque réponse **commence par une réponse directe** dans les 20-30 premiers mots (ex. *"Une membrane PVC armée affiche une durée de vie de 15 à 25 ans, contre 8 à 10 ans en moyenne pour un liner classique."*), suivie d'un développement contextuel — structure idéale pour l'extraction par un LLM (réponse courte extractible + contexte pour approfondir).
- Le HTML visible (`<details><summary>`) reproduit fidèlement le JSON-LD, découpé en 2 paragraphes par réponse — bon pour la lisibilité humaine ET la citation, avec redondance saine entre balisage structuré et texte visible.
- **7 pages ville** ajoutent chacune 2 questions de mini-FAQ courtes et directes (ex. *"Combien de temps pour obtenir un devis pour une piscine à Avignon ?"*) mais **sans schema `FAQPage` propre à ces pages** — seul le HTML `<details>` est présent, pas de JSON-LD. Un LLM qui lit le texte brut peut toujours les citer, mais l'opportunité de balisage structuré est manquée sur 14 questions au total (2×7 pages).
- La section "Nos secteurs autour de Montélimar" sur l'accueil reste un paragraphe narratif (2-3 phrases) mais renvoie maintenant vers les 7 pages dédiées — le paragraphe sert d'aiguillage plutôt que de tenter de tout couvrir lui-même, ce qui est la bonne approche.

**Sévérité : Faible (point fort de l'audit).** La citabilité, poids le plus lourd du score (25%), est désormais la dimension la mieux traitée.

## Signaux d'autorité et de marque

- Schema `GeneralContractor` cohérent sur les 4 pages principales (accueil, méthode, réalisations, contact) : NAP, `geo`, `areaServed` (20 localités/départements), `hasCredential` NF T54-804, `openingHoursSpecification`, `priceRange`. Bon socle d'entité locale, répliqué correctement à l'identique sur chaque page via `@id`.
- **Toujours aucun `sameAs`** vers Google Business Profile, réseaux sociaux ou annuaires professionnels — inchangé depuis le dernier audit.
- **Toujours aucune mention de YouTube, Reddit, Wikipedia ou LinkedIn** dans le HTML — signal le plus fortement corrélé aux citations IA, absent.
- **Auteur/éditeur identifié pour la première fois** : `mentions-legales.html` nomme "Enzo Oddon, entrepreneur individuel (auto-entrepreneur)" comme éditeur et directeur de publication, avec adresse (Dieulefit, Drôme), téléphone, e-mail. C'est un signal d'E-E-A-T positif nouveau (personne physique identifiable), mais il n'est présent que sur la page légale, pas en JSON-LD `Person`/`author` sur les pages de contenu.
- **SIRET manquant, placeholder visible en production** : `mentions-legales.html` ligne 85 affiche littéralement `<li>Numéro SIRET : [SIRET À COMPLÉTER]</li>` (avec commentaire HTML `<!-- TODO: ajouter SIRET -->` juste au-dessus, également visible dans le code source). C'est un signal de confiance manquant et surtout un placeholder de brouillon exposé publiquement — mauvais pour la crédibilité perçue par un utilisateur ou un moteur IA évaluant le sérieux de l'entité, et c'est aussi une obligation légale française pour un auto-entrepreneur.
- **Incohérence d'adresse (NAP) entre pages** : le footer des pages commerciales (accueil, méthode, réalisations, contact, pages ville) affiche `Montélimar` comme localité de contact, cohérent avec le JSON-LD (`addressLocality: "Montélimar"`). Mais le footer et le corps de `mentions-legales.html` indiquent une adresse légale différente : `Dieulefit, Drôme`. Le texte de méthode le justifie indirectement ("chantier à Dieulefit" mentionné comme lieu de chantier réel), donc il pourrait s'agir d'une distinction assumée entre zone commerciale affichée et adresse légale privée (pratique courante pour un auto-entrepreneur à domicile) — mais du point de vue d'un LLM qui construit une fiche d'entité, cette double localité sans explication est une incohérence NAP susceptible de brouiller la confiance dans l'adresse réelle.
- **Badges de confiance non étayés par du texte** : le bandeau "Pourquoi nous choisir" affiche 3 badges SVG — "Conforme à la norme Afnor NF T54-804" (vérifiable, référencé aussi dans la FAQ), "Plus de 5 ans d'expérience" (affirmation générique, faible risque), et **"Garantie fabricant de 10 ans"** — cette dernière n'est expliquée nulle part ailleurs sur le site (pas de FAQ, pas de mention dans les mentions légales, pas de précision sur le fabricant concerné ni sur ce que couvre la garantie). C'est exactement le type d'affirmation isolée et non contextualisée que les moteurs IA pénalisent, même si le chiffre lui-même n'est pas nécessairement faux.

**Sévérité : Élevée.** Dimension la plus faible avec le multi-modal ; c'est le principal chantier restant.

## Accessibilité technique pour crawlers IA

- **Confirmé en live** : HTTP 200 sur toutes les pages testées, HTML statique complet dès la réponse brute (`mode: raw` suffisant, pas de rendu JS nécessaire — `is_spa: false`).
- `script.js` audité : aucune injection de contenu textuel via `innerHTML`/`fetch` au chargement — seulement bascules UI (avant/après, compteurs animés, statut de formulaire). Le texte de fond (FAQ, méthode, zones) est 100% présent dans le HTML brut.
- En-têtes HTTP sains : `Content-Type: text/html; charset=utf-8`, `Cache-Control`, `ETag`, pas de blocage détecté côté CDN (Fastly) pour les user-agents bots.
- `sitemap.xml` live cohérent avec les 13 URLs attendues, `lastmod` échelonnés et crédibles (pas de date unique dupliquée sur toutes les pages, contrairement à ce que notait l'audit pré-lancement).
- Fichier orphelin `methode-1.html` détecté dans le dépôt local (373 lignes, version antérieure de `methode.html`) : confirmé **non déployé** (`https://provencepvcarme.fr/methode-1.html` → HTTP 404) et non lié depuis aucune page. Aucun impact GEO réel, mais mérite un nettoyage du dépôt pour éviter toute confusion future.

**Sévérité : Faible.** Meilleure dimension du site (90/100), confirmée pour la première fois en conditions réelles.

## Contenu multi-modal

- Vidéo hero (`media/hero-bg.mp4`) avec poster, nombreuses photos avant/après avec `alt` descriptifs et légendes de lieu (ex. "Bassin après mise en eau, Pont-de-Barret, PVC gris clair"), schéma SVG de carte de France avec `<title>`/`<desc>` accessibles décrivant explicitement le rayon d'intervention.
- Logos partenaires (Renolit Alkorplan, CGT Alkor, Elbe, Fluidra, APF Pool Design, Maytronics, CF Group) en double affichage : version décorative `alt=""` + liste texte équivalente en `visually-hidden` pour la bande défilante, et version `alt` complet dans la grille statique — bonne pratique d'accessibilité et de lisibilité par un parseur texte, mais aucun lien vers les sites de ces marques (pas de valeur d'association d'autorité externe exploitée).
- **Toujours pas de contenu vidéo public (YouTube)** ni de légendes riches exploitables comme passages autonomes distincts du texte environnant.
- Le comparatif "Liner classique vs Membrane PVC armée" dans `methode.html` est un tableau HTML sémantique (`role="table"`) à 5 critères — bon format structuré, mais son contenu textuel n'est repris nulle part ailleurs en prose extractible (un LLM devrait parser une structure de tableau plutôt qu'une phrase citable).

**Sévérité : Moyenne.**

---

## Top 5 changements à plus fort impact

| # | Recommandation | Impact | Effort |
|---|---|---|---|
| 1 | Compléter le SIRET dans `mentions-legales.html` (retirer le placeholder `[SIRET À COMPLÉTER]` visible en production) et clarifier/justifier la double adresse Montélimar (zone commerciale) / Dieulefit (adresse légale) en une phrase | Élevé | Faible (~15 min une fois le SIRET en main) |
| 2 | Créer `llms.txt` à la racine listant les pages clés (accueil/FAQ, méthode/HowTo, réalisations, 7 pages ville) avec description courte de chaque page | Élevé | Faible (~30 min) |
| 3 | Ajouter `sameAs` au schema `GeneralContractor` vers Google Business Profile et tout profil professionnel existant (annuaires BTP, réseaux sociaux) ; envisager une page/vidéo YouTube d'un chantier (corrélation la plus forte avec les citations IA) | Élevé | Faible pour `sameAs` (15 min si comptes existants) / Moyen pour une vidéo |
| 4 | Étayer ou retirer le badge "Garantie fabricant de 10 ans" : ajouter une phrase précisant le fabricant concerné et ce que couvre la garantie (dans la FAQ ou en légende du badge), pour éviter une affirmation isolée non contextualisée | Moyen | Faible (~30 min de rédaction) |
| 5 | Ajouter un schema `FAQPage` propre aux mini-FAQ des 7 pages ville (déjà présentes en HTML `<details>`, il ne manque que le balisage JSON-LD) ; ajouter `dateModified` en JSON-LD `WebPage` sur les pages de contenu pour renforcer le signal de fraîcheur | Moyen | Faible-Moyen (~2h pour les 7 pages) |

## Scores par plateforme (estimation qualitative)

| Plateforme | Score estimé | Raison principale |
|---|---|---|
| Google AI Overviews | ~78/100 | FAQPage + HowTo + Service/BreadcrumbList bien formés, réponses courtes et directes en tête de paragraphe, site maintenant réellement crawlable |
| ChatGPT / OAI-SearchBot | ~65/100 | Passages FAQ dans la fourchette optimale, mais pas de `llms.txt` et aucun signal de marque externe (Reddit/YouTube/Wikipedia) pour renforcer la confiance en dehors du domaine |
| Perplexity | ~68/100 | Crawler autorisé, HTML statique propre, contenu factuel et bien sourcé (norme Afnor citée), mais absence totale de présence hors-site à agréger |
| Bing Copilot | ~72/100 | robots.txt permissif + sitemap à jour + schema riche jouent en sa faveur, mêmes limites de signaux de marque externes |

---

geo.md écrit — score global : 74/100.
