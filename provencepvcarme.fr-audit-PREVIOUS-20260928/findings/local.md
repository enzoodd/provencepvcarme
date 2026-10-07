# Audit SEO Local — provencepvcarme.fr

**Score Local SEO : 30/100**

| Dimension | Poids | Score /100 | Contribution |
|---|---|---|---|
| Signaux GBP | 25% | 5 | 1.25 |
| Avis & réputation | 20% | 5 | 1.0 |
| SEO on-page local | 20% | 55 | 11.0 |
| Cohérence NAP & citations | 15% | 50 | 7.5 |
| Schema local | 10% | 75 | 7.5 |
| Liens & autorité locale | 10% | 15 | 1.5 |
| **Total** | 100% | | **≈30/100** |

Type d'établissement détecté : **Hybride** (adresse physique complète visible en footer/mentions légales/schema, mais discours marketing orienté "zone de service" — voir Finding CRITICAL-1). Secteur : **Home Services / artisan du bâtiment (pose de membrane PVC armée pour piscines)**.

Pages auditées (6/6) : index.html, contact.html, methode.html, realisations.html, mentions-legales.html, confidentialite.html — servies via http://localhost:8804 (HTTP 200 vérifié, contenu identique aux fichiers sources).

---

## NAP — Comparatif des sources

| Champ | Schema JSON-LD (index/contact/méthode/réalisations) | Footer (6 pages) | Mentions légales (corps de texte) | Cohérent ? |
|---|---|---|---|---|
| Nom | Provence PVC Armé | Provence PVC Armé | Provence PVC Armé | Oui |
| Adresse | 417 Chemin de la Françoise, 26220 Dieulefit | 417 Chemin de la Françoise, 26220 Dieulefit | 417 Chemin de la Françoise, 26220 Dieulefit | Oui |
| Téléphone | +33660871651 | 06 60 87 16 51 | 06 60 87 16 51 | Oui (format E.164 vs national, équivalent) |
| Email | provencepvcarme@gmail.com | provencepvcarme@gmail.com | provencepvcarme@gmail.com | Oui |
| Ville "affichée" au client | — | — | — | **NON — voir Finding CRITICAL-1** |

La donnée technique NAP (schema + footer + mentions légales) est identique sur les 6 pages : aucune faute de frappe, aucun ancien numéro, aucune variante d'adresse. C'est un point fort.

---

## Findings

### CRITICAL-1 — Incohérence "ville de base" : Dieulefit (adresse réelle) vs Montélimar (discours marketing)
**Sévérité : Critique**
Le NAP réel (schema, footer, mentions légales) place l'entreprise à **Dieulefit (26220)**. Mais tout le discours visible utilise Montélimar comme ville d'ancrage :
- Meta description / title / og:description index.html : "à Montélimar et dans ses environs"
- Hero (index.html, ligne 161) : "Montélimar et ses environs (rayon de 2h)"
- Section Zone d'intervention (index.html, ligne 371) : **"Nous sommes basés à Montélimar, mais nous nous déplaçons..."** — affirmation factuellement fausse au regard du NAP.
- Le schéma SVG animé "zones-radius-map" (index.html, lignes 379-410) place le pin central et le label **"Montélimar"** au centre du rayon d'intervention, alors que le point géographique réel (geo lat/long du schema, qui correspond à Dieulefit) est différent.
- Footer et texte legal (toutes pages) : "à Montélimar et dans ses environs (rayon de 2h)".

Impact : si un Google Business Profile existe ou est créé pour cette activité, l'adresse GBP doit être Dieulefit (ou une adresse de service masquée si SAB) — un GBP affichant Montélimar en ville alors que le NAP web dit Dieulefit créerait une **incohérence NAP majeure entre site et GBP**, un facteur négatif direct pour le Local Pack. Par ailleurs si l'entreprise est en réalité SAB (Service Area Business) sans accueil client à l'adresse, le NAP visible expose inutilement une adresse tout en revendiquant publiquement une autre ville de rattachement — ce qui brouille le signal de proximité (le facteur #1 des variations de classement, 55.2%).
**Recommandation** : Choisir une seule vérité et l'appliquer partout — soit (a) le site assume Dieulefit comme ville de base et Montélimar comme marché principal desservi ("basés à Dieulefit, nous intervenons sur Montélimar et ses environs"), soit (b) configurer le GBP en mode Service Area Business centré sur Dieulefit avec Montélimar en zone desservie prioritaire. Corriger en priorité la phrase ligne 371 d'index.html et le label du schéma SVG.

### HIGH-2 — Aucun signal GBP détectable sur le site
**Sévérité : Élevée**
Recherche exhaustive (grep) sur les 6 pages : aucun embed Google Maps/iframe, aucun widget d'avis Google, aucune mention "Avis Google", aucun lien vers une fiche Google Business Profile, aucun `sameAs` dans le schema JSON-LD pointant vers un profil GBP ou réseaux sociaux. Étant donné que le "Primary GBP category" est le facteur de classement #1 (score 193, Whitespark 2026), l'absence totale de lien/preuve de fiche GBP est le point le plus pénalisant de cet audit.
**Recommandation** : Créer/vérifier la fiche GBP (catégorie principale précise : "Entreprise de piscines" ou équivalent le plus proche disponible, pas une catégorie générique de type "Entrepreneur général"), y intégrer les mêmes NAP que le site, puis ajouter un lien GBP dans le footer et un `sameAs` dans le schema `GeneralContractor`. Publier des posts GBP régulièrement (règle des 18 jours).

### HIGH-3 — Aucun signal d'avis / réputation
**Sévérité : Élevée**
Pas d'`aggregateRating`, pas de note affichée, pas de widget d'avis clients, pas de témoignages sur aucune des 6 pages.
**Recommandation** : Ajouter une section témoignages/avis sur index.html (et idéalement `aggregateRating` dans le schema une fois des avis GBP réels collectés — ne jamais inventer de notes). Mettre en place une demande d'avis systématique en fin de chantier pour maintenir une vélocité d'avis régulière (règle des 18 jours de Sterling Sky).

### MEDIUM-4 — Zone déclarée en schema plus large que le contenu visible correspondant
**Sévérité : Moyenne**
Le schema JSON-LD (`areaServed`) sur index/contact/méthode/réalisations liste 12 villes + 5 départements entiers (Drôme, Ardèche, Vaucluse, Gard, Isère). Mais :
- index.html détaille bien les 5 départements dans son texte visible (section "Zones d'intervention", ligne 371 + chips ligne 374) — bon alignement contenu/schema sur cette page.
- contact.html (section "Infos pratiques", lignes 239 et 243-245) ne liste que les 12 villes proches de Montélimar dans son contenu visible et sa liste de chips — **aucune mention des 5 départements** pourtant présents dans son propre schema `areaServed` (ligne 58). Un visiteur ou un moteur analysant uniquement le texte visible de contact.html perçoit une zone plus restreinte que celle déclarée en schema.
- Aucune page dédiée par ville ou département (ex. "pose PVC armé Nîmes/Gard", "... Grenoble/Isère") : la couverture élargie à 5 départements repose uniquement sur une liste de mots-clés en schema/texte, sans pages de service dédiées — or les "dedicated service pages" sont le facteur #1 SEO local organique et #2 en visibilité IA.
**Recommandation** : Harmoniser le contenu visible de contact.html avec son schema (ajouter la mention des 5 départements). À moyen terme, envisager des pages de service par département ou grande zone (ex. "Intervention Gard / Nîmes", "Intervention Vaucluse / Avignon") avec contenu unique, pour soutenir la promesse de couverture 5 départements plutôt qu'une simple liste de mots-clés.

### MEDIUM-5 — Pas de citations Tier 1 détectables depuis le code source
**Sévérité : Moyenne**
Aucune mention ni lien vers Yelp, Pages Jaunes, Waze, Societe.com/annuaires professionnels français, ou tout autre annuaire, dans le code des 6 pages. Impossible de confirmer la présence/absence réelle sur ces plateformes sans accès outil externe (le site testé est en local, non encore crawlable en production pour cette vérification).
**Recommandation** : Créer/mettre à jour les fiches sur Pages Jaunes, Google Business Profile, et annuaires BTP/piscine spécialisés (ex. Fédération des Professionnels de la Piscine) avec un NAP strictement identique à celui du site (417 Chemin de la Françoise, 26220 Dieulefit / 06 60 87 16 51). Rappel : 3 des 5 facteurs de visibilité IA sont liés aux citations.

### LOW-6 — SIRET absent des mentions légales (placeholder non complété)
**Sévérité : Faible (conformité, indirectement E-E-A-T local)**
mentions-legales.html ligne 86 : `Numéro SIRET : [SIRET À COMPLÉTER]` — commentaire `<!-- TODO: ajouter SIRET -->` toujours présent. Un numéro SIRET visible renforce la légitimité de l'entreprise (signal de confiance local/E-E-A-T) et est une obligation légale française pour un auto-entrepreneur exerçant un commerce.
**Recommandation** : Compléter le SIRET dès son obtention/disponibilité.

### LOW-7 — Schema `GeneralContractor` sans `sameAs`, `hasMap` ni `aggregateRating`
**Sévérité : Faible**
Le type `GeneralContractor` (sous-type valide de `LocalBusiness` > `HomeAndConstructionBusiness`) est correctement utilisé et contient : name, address, geo (précision à 7 décimales, dépasse largement la recommandation de 5), openingHoursSpecification, telephone, url, image, priceRange, areaServed, hasCredential (NF T54-804). C'est une bonne base. Il manque toutefois `sameAs` (profils GBP/réseaux sociaux) et `hasMap` (lien Google Maps), et `aggregateRating` ne pourra être ajouté que lorsque des avis réels existeront (ne pas fabriquer de données).
**Recommandation** : Ajouter `sameAs` dès la création de la fiche GBP/réseaux sociaux, et `hasMap` pointant vers la fiche Maps.

---

## Checklist GBP (détecté vs manquant)

| Élément | Statut |
|---|---|
| Lien/référence vers fiche GBP sur le site | Manquant |
| Embed Google Maps | Manquant |
| Widget d'avis Google | Manquant |
| `aggregateRating` en schema | Manquant |
| `sameAs` vers GBP en schema | Manquant |
| Catégorie GBP principale correcte | Non vérifiable depuis le code (pas de lien GBP) |
| Preuve de posts GBP réguliers | Manquant |
| Preuve photographique liée à GBP | Manquant (les photos existent sur le site mais aucun lien vers une galerie GBP) |

## Snapshot avis

Aucune note, aucun volume d'avis, aucun `aggregateRating`, aucun taux de réponse observable sur le site — dimension entièrement absente. Ne peut être complété sans accès à une fiche GBP réelle (hors périmètre de cet audit code-source).

## Validation schema local

- Type utilisé : `GeneralContractor` (sous-type correct pour un artisan du bâtiment ; cohérent sur les 4 pages qui l'implémentent — index, contact, méthode, réalisations).
- Propriétés requises : `name` ✔, `address` ✔.
- Propriétés recommandées : `geo` ✔ (précision > 5 décimales), `openingHoursSpecification` ✔, `telephone` ✔, `url` ✔, `image` ✔, `priceRange` ✔, `areaServed` ✔ (villes + 5 départements), `hasCredential` ✔ (bonus, norme NF T54-804).
- Manquant : `sameAs`, `hasMap`, `aggregateRating` (légitimement absent tant qu'aucun avis réel n'existe).
- mentions-legales.html et confidentialite.html n'ont **aucun schema JSON-LD** (acceptable, ce sont des pages légales, pas des pages commerciales — faible priorité).
- Schema `Service` (méthode.html) et `BreadcrumbList` (contact/méthode/réalisations) bien formés et cohérents avec l'`areaServed` du `GeneralContractor`.

## Qualité des pages (multi-zones)

Le site n'a **pas** de pages dédiées par ville/département (pas de structure multi-localisation classique) : la couverture des 17 villes + 5 départements est gérée via une unique section "Zones d'intervention" sur index.html (accordéon/schéma SVG départemental) et une liste de villes sur contact.html. Il n'y a donc pas de test "doorway page swap" applicable, ni de dilution de contenu dupliqué entre pages de ville — mais à l'inverse, aucune page de service localisée ne capte de requêtes long-tail par ville/département (cf. Finding MEDIUM-4).

---

## Top 10 actions prioritaires

1. **[Critical]** Résoudre l'incohérence Dieulefit (NAP réel) vs Montélimar (discours "basés à Montélimar", ligne 371 index.html + label du schéma SVG) avant toute création/mise à jour de fiche GBP.
2. **[Critical]** Créer ou auditer la fiche Google Business Profile : catégorie principale précise, NAP identique au site, puis lier le GBP depuis le site (footer + `sameAs` schema).
3. **[High]** Mettre en place une collecte d'avis clients en fin de chantier (process récurrent, pas ponctuel) pour respecter la règle des 18 jours et alimenter un futur `aggregateRating`.
4. **[High]** Ajouter une section témoignages/avis visible sur index.html dès que des avis réels existent.
5. **[High]** Ajouter `sameAs` et `hasMap` au schema `GeneralContractor` sur les 4 pages concernées.
6. **[Medium]** Harmoniser le contenu visible de contact.html avec son propre `areaServed` (ajouter les 5 départements dans le texte/chips, pas seulement les 12 villes).
7. **[Medium]** Créer/vérifier les citations Tier 1 pertinentes pour la France (Google Business Profile, Pages Jaunes, annuaires BTP/piscine) avec NAP strictement identique.
8. **[Medium]** Envisager des pages de service dédiées par grande zone/département (Gard, Isère notamment, les plus excentrées) pour soutenir la promesse de couverture élargie avec du contenu unique et des requêtes locales long-tail.
9. **[Low]** Compléter le numéro SIRET dans mentions-legales.html (placeholder actuellement visible).
10. **[Low]** Ajouter un embed Google Maps (une fois la fiche GBP créée) sur contact.html pour renforcer les signaux de proximité/adresse en page.

---

## Limitations

- Audit réalisé sur fichiers locaux servis via localhost:8804 (site non encore vérifié en production réelle) : impossible de confirmer l'existence, l'exactitude ou l'absence d'une fiche Google Business Profile réelle, de citations sur annuaires tiers (Pages Jaunes, Yelp, etc.), ou de position dans le Local Pack — ces éléments nécessitent un accès GBP authentifié ou un outil type DataForSEO (non disponible dans cette session).
- Le fichier de référence `skills/seo/references/local-schema-types.md` n'a pas été trouvé dans l'environnement ; la validation du sous-type schema (`GeneralContractor`) s'appuie donc sur la connaissance générale de la hiérarchie schema.org plutôt que sur la référence dédiée du skill.
- Proximité géographique (55.2% de la variance de classement selon Search Atlas) hors du contrôle de cet audit — dépend de l'implantation réelle Dieulefit et de la configuration GBP, non du code source.
- Vélocité d'avis, taux de réponse, catégorie GBP réelle : non évaluables sans accès à la fiche GBP.
