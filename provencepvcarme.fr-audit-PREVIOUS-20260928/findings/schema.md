# Audit Schema.org (JSON-LD) — provencepvcarme.fr

**Score : 67/100**

Pages auditées : `index.html`, `methode.html`, `realisations.html`, `contact.html`
Méthode : lecture directe des fichiers sources + validation JSON via `python3 json.tool` sur les 10 blocs `application/ld+json` détectés (tous syntaxiquement valides).

## Détection

| Page | Blocs JSON-LD | @type |
|---|---|---|
| index.html | 2 | GeneralContractor, FAQPage |
| methode.html | 4 | GeneralContractor, Service, HowTo, BreadcrumbList |
| realisations.html | 2 | GeneralContractor, BreadcrumbList |
| contact.html | 2 | GeneralContractor, BreadcrumbList |

Tous les blocs utilisent `"@context": "https://schema.org"` (https, correct) et des URLs absolues. Aucune erreur de syntaxe JSON détectée sur les 10 blocs.

## Findings

### 1. [High] HowTo présent sur methode.html — type déprécié, aucun rich result
Le bloc `HowTo` (lignes 103-132 de methode.html, 4 `HowToStep`) est syntaxiquement valide mais **Google a retiré les rich results HowTo en septembre 2023**. Ce schema n'apporte plus aucun bénéfice SERP et ajoute du poids de maintenance inutile.
**Recommandation** : supprimer purement et simplement ce bloc `application/ld+json`. Le contenu "étape par étape" peut rester en HTML visible (ce qui est déjà le cas) sans balisage `HowTo`.

### 2. [Info] FAQPage présent sur index.html — plus de bénéfice SERP Google
Le bloc `FAQPage` (3 `Question`/`Answer`, structure valide) ne génère plus de rich result depuis le retrait généralisé par Google (mai 2026, qui étend la restriction gouv/santé d'août 2023 à tous les sites). Un éventuel bénéfice AI/GEO (Overviews, assistants IA) n'est pas confirmé.
**Recommandation** : ce n'est pas bloquant, mais ne pas investir davantage dans FAQPage en attendant une confirmation du bénéfice IA. Le contenu FAQ visible (section `#faq`) reste pertinent indépendamment du schema.

### 3. [Medium] Aucune propriété `sameAs` sur l'entité GeneralContractor
Aucun des 4 blocs GeneralContractor (`@id: https://provencepvcarme.fr/#business`) ne contient de `sameAs`. C'est une opportunité manquée pour consolider l'entité auprès de Google (fiche Google Business Profile, réseaux sociaux, annuaires professionnels) et renforcer la désambiguïsation de l'entité locale.
**Recommandation** : si l'entreprise dispose d'une fiche Google Business Profile, Facebook, Instagram, Pages Jaunes, etc., ajouter un tableau `sameAs` avec les URLs absolues correspondantes. Ne pas inventer d'URLs si elles n'existent pas.

### 4. [Medium] Incohérence NAP potentielle : adresse Dieulefit vs discours "basé à Montélimar"
Le JSON-LD indique systématiquement `addressLocality: "Dieulefit"` (26220), ce qui correspond au footer visible ("417 Chemin de la Françoise, 26220 Dieulefit"). Mais le contenu éditorial de plusieurs pages (hero index.html : *"Montélimar et ses environs"*, section Zones : *"Nous sommes basés à Montélimar"*) affirme explicitement une implantation à Montélimar, une ville différente de Dieulefit (~25 km).
**Recommandation** : clarifier la story locale. Si l'adresse légale/postale est à Dieulefit mais que le positionnement marketing cible Montélimar comme ville de référence (zone de chalandise), c'est acceptable pour le contenu éditorial, mais le JSON-LD doit rester fidèle à l'adresse réelle (ce qui est déjà le cas). Éviter toute formulation ambiguë du type "nous sommes basés à Montélimar" si l'adresse officielle est Dieulefit — cela peut nuire à la cohérence NAP perçue par Google (risque pour Google Business Profile / SEO local), indépendamment du schema lui-même.

### 5. [Low] GeneralContractor dupliqué intégralement sur les 4 pages sans `@id`-only reference
Le bloc GeneralContractor complet (adresse, geo, areaServed à 18 entrées, openingHoursSpecification, hasCredential) est recopié à l'identique sur index.html, methode.html, realisations.html et contact.html au lieu d'utiliser une référence `{"@id": "https://provencepvcarme.fr/#business"}` allégée sur les pages secondaires. Google supporte ce pattern (Google peut fusionner via `@id` identique), donc ce n'est pas une erreur de validité, mais cela crée un risque de dérive : toute future modification (ex. changement d'horaires, ajout d'un `sameAs`) devra être répercutée manuellement dans les 4 fichiers.
**Recommandation** : soit conserver l'entité complète uniquement sur index.html et utiliser sur les 3 autres pages un stub `{"@type": "GeneralContractor", "@id": "https://provencepvcarme.fr/#business"}` sans redupliquer toutes les propriétés, soit mettre en place un include côté build pour garantir la synchronisation. Actuellement, les 4 blocs sont bien identiques (vérifié), donc pas de désynchronisation active, mais le risque reste réel en maintenance manuelle.

### 6. [Low] Service.provider sur methode.html ne référence pas l'entité principale via `@id`
Le bloc `Service` (methode.html, lignes 87-101) définit un `provider` en dur (`{"@type": "GeneralContractor", "name": "...", "telephone": "..."}`) au lieu de référencer l'entité complète déjà déclarée juste au-dessus via `"@id": "https://provencepvcarme.fr/#business"`. Cela crée deux représentations partielles et non liées du même fournisseur dans la même page.
**Recommandation** :
```json
"provider": { "@id": "https://provencepvcarme.fr/#business" }
```

### 7. [Info] index.html ne porte pas de BreadcrumbList
methode.html, realisations.html et contact.html ont un `BreadcrumbList` valide (position, name, item en URL absolue). index.html (page d'accueil) n'en a pas, ce qui est normal/optionnel pour une page de niveau racine — pas de correction obligatoire.

### 8. [Info] Type `GeneralContractor` : choix acceptable mais approximatif
`GeneralContractor` (sous-type de `HomeAndConstructionBusiness`) est un type valide et non déprécié, mais l'activité réelle (pose de membrane PVC armée pour piscines) n'est pas un chantier de gros œuvre générique. Schema.org ne propose pas de sous-type dédié "pool contractor" — `GeneralContractor` reste le choix le plus proche disponible dans la hiérarchie `HomeAndConstructionBusiness`. Aucune action requise, mais à noter si un type plus spécifique apparaît dans le vocabulaire schema.org à l'avenir.

## Points positifs (à ne pas casser)

- Tous les blocs sont en JSON-LD (pas de Microdata/RDFa), `@context` en https, URLs absolues, dates non applicables (pas de contenu daté type Article).
- `hasCredential` (EducationalOccupationalCredential, NF T54-804) est une utilisation correcte et pertinente de la propriété pour une certification professionnelle réelle.
- `geo`, `openingHoursSpecification`, `email`, `areaServed` élargi (villes + 5 départements) sont bien formés et cohérents entre les 4 pages.
- **Aucune invention de `Review`/`AggregateRating`** : conforme aux bonnes pratiques — ne pas fabriquer de faux avis. C'est une absence correcte, pas une erreur. Si de vrais avis clients existent (Google, etc.), ce serait la seule opportunité valable à ajouter plus tard, avec des données réelles uniquement.
- `BreadcrumbList` bien implémenté sur les 3 pages secondaires.

## Priorités d'action

1. Supprimer le bloc `HowTo` sur methode.html (High).
2. Ajouter `sameAs` avec les vraies URLs de présence en ligne, si disponibles (Medium).
3. Vérifier/clarifier le discours "basé à Montélimar" vs adresse Dieulefit dans le JSON-LD et le contenu (Medium).
4. Lier `Service.provider` à l'entité principale via `@id` (Low).
5. Envisager de factoriser l'entité GeneralContractor pour éviter la dérive multi-fichiers (Low).
6. Conserver FAQPage tel quel sans y investir davantage tant que le bénéfice IA n'est pas confirmé (Info).
