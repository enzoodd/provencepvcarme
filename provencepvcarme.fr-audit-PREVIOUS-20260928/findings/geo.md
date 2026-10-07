# Audit GEO / AI Search Readiness — provencepvcarme.fr

**Score GEO global : 58/100**

| Dimension | Poids | Score | Contribution |
|---|---|---|---|
| Citabilité | 25% | 55/100 | 13.8 |
| Lisibilité structurelle | 20% | 60/100 | 12.0 |
| Contenu multi-modal | 15% | 65/100 | 9.8 |
| Autorité & signaux de marque | 20% | 40/100 | 8.0 |
| Accessibilité technique | 20% | 75/100 | 15.0 |

Site statique (HTML brut, pas de framework CSR), donc **très favorable techniquement** aux crawlers IA, mais **signaux d'autorité/marque faibles** et **contenu départemental pas structuré pour l'extraction** (paragraphe narratif unique au lieu de blocs question/réponse par zone).

---

## Statut d'accès crawlers IA (robots.txt)

`robots.txt` (racine) :
```
User-agent: *
Allow: /
Sitemap: https://provencepvcarme.fr/sitemap.xml
```

- GPTBot : **autorisé** (règle générique `*`)
- OAI-SearchBot : **autorisé**
- ClaudeBot : **autorisé**
- PerplexityBot : **autorisé**
- CCBot / anthropic-ai / cohere-ai : **autorisés aussi** (aucune règle spécifique ne les bloque — choix possible mais non fait)

**Sévérité : Info.** Aucun blocage détecté, c'est le point le plus sain de l'audit. Le site n'exploite cependant pas la possibilité de bloquer sélectivement les crawlers d'entraînement (CCBot, anthropic-ai) tout en gardant les crawlers de recherche IA — ce n'est pas un problème, juste une non-optimisation mineure.

## llms.txt

**Statut : ABSENT** (`/llms.txt` non trouvé à la racine, confirmé par `ls`).

**Sévérité : Élevée.** Aucun fichier `llms.txt` ni licence RSL 1.0 détectés. Pour un site vitrine artisanal ce n'est pas bloquant pour l'indexation, mais c'est une opportunité manquée facile à corriger pour guider les LLM vers les pages clés (méthode, réalisations, FAQ, zones desservies).

## Citabilité des passages

- **FAQPage schema présent** (`index.html`, lignes 78-109) avec 3 questions/réponses : définition PVC armé, durée de vie, rénovation. Bon signal structurel, réponses directes en tête de paragraphe.
- Mais les réponses font **30-50 mots**, nettement **sous la fourchette optimale de 134-167 mots** identifiée pour la citation IA — elles sont trop courtes pour servir de passage autonome riche en contexte (bonnes pour featured snippet, insuffisantes pour une réponse IA détaillée).
- Seulement **3 questions** couvrent tout le site : aucune FAQ sur le prix, les délais, la zone d'intervention détaillée, ou les spécificités par département/ville (« Faites-vous des piscines à Nyons ? », « Intervenez-vous dans le Vaucluse ? »).
- La section « Nos secteurs autour de Montélimar » (ligne 371) est un **paragraphe narratif unique** listant ~15 communes et 5 départements en une seule phrase longue, non segmentée en blocs extractibles par zone.

**Sévérité : Élevée.** La citabilité est le poids le plus lourd du score (25%) et c'est la faiblesse principale.

## Signaux d'autorité et de marque

- Schema `GeneralContractor` complet et bien formé (NAP, `geo` coordinates, `hasCredential` NF T54-804, `areaServed` couvrant Drôme/Ardèche/Vaucluse/Gard/Isère) — bon socle d'entité locale.
- **Aucun `sameAs`** vers Google Business Profile, réseaux sociaux, annuaires professionnels.
- **Aucune mention détectée** (dans le HTML source) de YouTube, Reddit, Wikipedia ou LinkedIn — or ces signaux sont ceux qui corrèlent le plus fortement avec les citations IA (YouTube ~0.737, Reddit et Wikipedia élevés). Pour une TPE du bâtiment c'est attendu, mais c'est le principal levier de score manquant.
- **Aucun signal d'auteur/date sur le contenu** : pas de `datePublished`/`dateModified` dans les données structurées des pages (seul le `sitemap.xml` porte un `lastmod` global au niveau technique, pas visible dans le contenu ni en JSON-LD).

**Sévérité : Élevée.** Dimension la plus faible (40/100) alors qu'elle pèse 20%.

## Accessibilité technique pour crawlers IA

- Pages 100% HTML statique servies directement (`index.html`, `methode.html`, `realisations.html`, `contact.html`) — **pas de rendu côté client requis**, tout le texte est présent dans le HTML brut. Très favorable aux crawlers IA qui ne rendent pas toujours le JS.
- Les fichiers JS (`script.js`, `membrane-scene.js`, `water-scene.js`) servent à l'animation/interactivité visuelle (reveal au scroll, scène 3D/canvas), pas à injecter du contenu textuel — donc pas de risque de contenu invisible pour un crawler non-JS.
- `sitemap.xml` présent et à jour (6 URLs, `lastmod` 2026-08-18), référencé dans `robots.txt`.

**Sévérité : Faible.** Bon point de l'audit, rien à corriger en urgence.

## Contenu multi-modal

- Vidéo hero (`media/hero-bg.mp4`) avec poster, images « avant/après », schéma SVG des zones desservies avec `<title>`/`<desc>` accessibles (bon pour l'alt-text sémantique).
- Logos partenaires en `alt=""` (décoratifs) mais liste texte équivalente fournie en `visually-hidden` — bonne pratique, contenu quand même lisible par un parseur texte.
- Pas de contenu vidéo public (YouTube) ni d'images avec légendes riches exploitables comme passages citables séparés.

**Sévérité : Moyenne.**

## Alignement du contenu départemental avec les critères de citation IA

Le nouveau contenu géographique (`areaServed` schema + section « Nos secteurs ») couvre bien Drôme, Ardèche, Vaucluse, Gard, Isère et une quinzaine de communes, mais :
- Il est **entièrement contenu dans un seul paragraphe long** sur la page d'accueil, pas dans des sections/pages dédiées par département ou ville.
- Aucune **question directe par zone** dans la FAQ (« Travaillez-vous en Ardèche ? », « Quel délai pour un chantier dans le Vaucluse ? »).
- Le SVG de carte est stylisé/non géographique (`desc` le précise explicitement), donc n'apporte pas de données de localisation exploitables par un LLM au-delà du texte déjà présent.
- Résultat : un LLM interrogé sur « piscine PVC armé à Nyons » ou « rénovation piscine Vaucluse » devra extraire l'info d'une phrase noyée parmi 15 autres noms de villes, plutôt que de citer un passage autonome et direct — ce qui réduit fortement la probabilité de citation par rapport à un bloc dédié.

**Sévérité : Moyenne-Élevée.**

---

## Top 5 changements à plus fort impact

| # | Recommandation | Impact | Effort |
|---|---|---|---|
| 1 | Créer `llms.txt` à la racine listant les pages clés (accueil, méthode, réalisations, FAQ, zones) avec description courte de chaque page | Élevé | Faible (~30 min) |
| 2 | Étoffer la FAQPage : passer de 3 à 10-15 questions couvrant prix, délais, garanties, et zones/départements spécifiques ; viser 100-160 mots par réponse pour les questions non binaires | Élevé | Moyen (0.5-1 jour, rédaction) |
| 3 | Restructurer la section « Nos secteurs » en blocs courts par département (Drôme, Ardèche, Vaucluse, Gard, Isère) avec une phrase d'ouverture directe par bloc, au lieu d'un seul paragraphe fondu | Élevé | Moyen (quelques heures) |
| 4 | Ajouter `sameAs` au schema `GeneralContractor` vers Google Business Profile et tout profil professionnel existant (annuaires BTP, réseaux sociaux) | Moyen | Faible (15 min si comptes existants) |
| 5 | Ajouter `datePublished`/`dateModified` visibles (JSON-LD `WebPage` ou `Article`) sur les pages de contenu (méthode, réalisations) pour renforcer la fraîcheur perçue | Moyen | Faible (~1h) |

## Scores par plateforme (estimation qualitative)

| Plateforme | Score estimé | Raison principale |
|---|---|---|
| Google AI Overviews | ~60/100 | FAQPage + entité locale schema.org bien formée jouent en sa faveur |
| ChatGPT / OAI-SearchBot | ~45/100 | Pas de llms.txt, passages FAQ trop courts, peu de profondeur citable |
| Perplexity | ~50/100 | Crawler autorisé, HTML statique propre, mais signaux de marque (Reddit/YouTube/Wikipedia) absents |
| Bing Copilot | ~55/100 | robots.txt permissif + sitemap à jour, mais mêmes limites de citabilité |

---

geo.md écrit avec succès, taille : 6847 octets, score : 58/100
