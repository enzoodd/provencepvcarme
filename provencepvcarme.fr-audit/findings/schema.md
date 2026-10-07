# Audit Schema.org (JSON-LD) — provencepvcarme.fr

**Score : 58/100** (précédent : 67/100)

Pages auditées (13, conformes au sitemap) : `index.html`, `methode.html`, `realisations.html`, `contact.html`, `mentions-legales.html`, `confidentialite.html`, et les 7 pages villes `pose-membrane-pvc-arme-{avignon,orange,marseille,pierrelatte,valence,montpellier,aix-en-provence}.html`.

Méthode : extraction et parsing (`json.loads`) de chaque bloc `<script type="application/ld+json">` sur les 13 fichiers sources (repo local, HEAD de la branche `feature/seo-zones-avignon-orange-marseille`), comparaison avec le HTML visible (footer, breadcrumb UI, section FAQ, section zones, mentions légales).

## Détection

| Page | Blocs JSON-LD | `@type` |
|---|---|---|
| index.html | 2 | GeneralContractor, FAQPage |
| methode.html | 4 | GeneralContractor, Service, **HowTo**, BreadcrumbList |
| realisations.html | 2 | GeneralContractor, BreadcrumbList |
| contact.html | 2 | GeneralContractor, BreadcrumbList |
| mentions-legales.html | 0 | — |
| confidentialite.html | 0 | — |
| pose-membrane-pvc-arme-avignon.html | 2 | Service, BreadcrumbList |
| pose-membrane-pvc-arme-orange.html | 2 | Service, BreadcrumbList |
| pose-membrane-pvc-arme-marseille.html | 2 | Service, BreadcrumbList |
| pose-membrane-pvc-arme-pierrelatte.html | 2 | Service, BreadcrumbList |
| pose-membrane-pvc-arme-valence.html | 2 | Service, BreadcrumbList |
| pose-membrane-pvc-arme-montpellier.html | 2 | Service, BreadcrumbList |
| pose-membrane-pvc-arme-aix-en-provence.html | 2 | Service, BreadcrumbList |

22 blocs au total (contre 10 lors de l'audit précédent, qui ne couvrait que 4 pages). **Tous syntaxiquement valides** (`json.loads` sans erreur sur les 22 blocs). `@context: "https://schema.org"` (https) et URLs absolues partout, sauf le `BreadcrumbList` des 7 pages villes qui pointe vers `https://provencepvcarme.fr/#zones` (item 2) — bien absolu, cohérent avec le lien visible `index.html#zones` en relatif (résout vers la même URL).

Fichier confirmé non déployé/hors sitemap, ignoré comme demandé : `methode-1.html`.

---

## Corrigé depuis le dernier audit

- **BreadcrumbList étendu aux 7 nouvelles pages villes**, à 3 niveaux (Accueil / Zone d'intervention / Ville), et fidèle au breadcrumb visible en HTML (`<p class="breadcrumb">Accueil / Zone d'intervention / Avignon</p>` sur `pose-membrane-pvc-arme-avignon.html`, vérifié à l'identique sur les 7 pages). Bonne pratique.
- **`Service.provider` par référence `@id`** sur les 7 pages villes : `"provider": {"@id": "https://provencepvcarme.fr/#business"}` au lieu de dupliquer l'entité complète. C'est exactement le pattern que l'audit précédent recommandait (finding #6) — mais **seulement appliqué aux nouvelles pages**, pas rétrofité sur `methode.html` (voir "Toujours ouvert").
- **Le rayon d'intervention est redevenu cohérent** entre JSON-LD et contenu visible : `description` du GeneralContractor et `areaServed` disent désormais "rayon de 2h" / liste de 5 départements (Drôme, Ardèche, Vaucluse, Gard, Isère) + villes, et la section `#zones` visible dit explicitement "jusqu'à deux heures de route à la ronde" avec les 5 mêmes départements affichés en légende de carte. La contradiction "rayon d'1h vs 8 départements" relevée dans un audit encore antérieur n'existe plus dans le JSON-LD actuel.
- **Parité FAQPage ↔ FAQ visible : conforme, mot pour mot.** Les 7 `Question`/`Answer` du bloc `FAQPage` d'`index.html` correspondent exactement au texte des 7 `<details class="faq-item">` visibles (chaque réponse visible est scindée en 2 `<p>`, concaténés avec un espace simple dans le champ `text` du JSON-LD — aucune divergence de contenu détectée).
- Toujours aucune invention de `Review`/`AggregateRating` (conforme, absence correcte).

## Toujours ouvert

### 1. [Critical] Incohérence NAP non résolue — Montélimar (JSON-LD) vs Dieulefit (adresse légale réelle)
Le bloc `GeneralContractor` (`@id: https://provencepvcarme.fr/#business`, répété à l'identique sur `index.html`, `methode.html`, `realisations.html`, `contact.html`) déclare :
```json
"address": { "@type": "PostalAddress", "addressLocality": "Montélimar", "addressRegion": "Auvergne-Rhône-Alpes", "addressCountry": "FR" },
"geo": { "@type": "GeoCoordinates", "latitude": 44.5579, "longitude": 4.7503 }
```
Ces coordonnées correspondent au centre de **Montélimar** (et non de Dieulefit, ~44.518°N/5.060°E). Le footer des 11 pages "marketing" (accueil, méthode, réalisations, contact, 7 pages villes) affiche également `<span>Montélimar</span>` sans code postal ni rue.

Mais `mentions-legales.html`, qui fait foi juridiquement, déclare noir sur blanc :
> « Adresse : Dieulefit, Drôme, France »

et son propre footer (partagé avec `confidentialite.html`) affiche `<span>Dieulefit, Drôme</span>` — **une troisième variante, différente à la fois du JSON-LD et du footer des 11 autres pages**. Confirmé par grep sur les 13 fichiers : 11 pages disent "Montélimar" (footer + JSON-LD), 2 pages disent "Dieulefit, Drôme" (footer + corps de texte légal).

C'est la même incohérence de fond que l'audit précédent (à l'époque : JSON-LD "Montélimar" + CP 26220 qui est en réalité celui de Dieulefit), simplement présentée différemment : le code postal fautif a été retiré, mais l'écart entre la ville légale (Dieulefit) et la ville utilisée dans tout le schema + le marketing (Montélimar) n'a jamais été corrigé à la racine. Pour Google (cohérence NAP / Google Business Profile / E-E-A-T local), avoir une entité `LocalBusiness` structurée qui contredit la page "Mentions légales" du même site est un signal négatif direct, indépendamment de la légitimité du positionnement marketing sur Montélimar.

**Remarque additionnelle** : `mentions-legales.html` indique aussi `"Numéro SIRET : [SIRET À COMPLÉTER]"` — le SIRET n'est toujours pas renseigné (placeholder non retiré). Cela n'affecte pas directement le JSON-LD (aucun `taxID`/`vatID` n'est déclaré nulle part, donc pas d'incohérence schema sur ce point précis), mais cela fragilise la valeur de "source de vérité légale" de cette page tant que le SIRET manque — à corriger côté contenu, hors périmètre strict schema.

**Recommandation** : trancher une bonne fois la story NAP avant de toucher au schema :
- Si l'adresse d'exercice réelle est Dieulefit (ce que confirme la page légale) : mettre `addressLocality: "Dieulefit"` (ou `addressLocality: "Dieulefit"` + `addressRegion: "Drôme"`, avec `postalCode: "26220"` si souhaité) et des coordonnées `geo` de Dieulefit dans les 4 blocs GeneralContractor, tout en conservant "Montélimar" comme ville de repère marketing dans les textes visibles (`name`/`description` peuvent continuer à mentionner Montélimar sans que ce soit l'`addressLocality`).
- Si Montélimar est réellement le lieu d'exercice (bureau, atelier, zone de chalandise principale) et Dieulefit n'est qu'une adresse postale historique : corriger `mentions-legales.html` et son footer pour refléter Montélimar, avec le vrai code postal.
Dans les deux cas, **les 4 blocs JSON-LD, les 13 footers et le texte des mentions légales doivent converger vers une seule et même ville**.

### 2. [High] `HowTo` toujours présent sur methode.html — type déprécié, sans bénéfice SERP
Le bloc `HowTo` (4 `HowToStep`) n'a pas été retiré malgré la recommandation explicite de l'audit précédent (finding #1, priorité 1). Google a retiré les rich results HowTo en septembre 2023 ; ce bloc n'apporte plus rien et ajoute du poids de maintenance.
**Recommandation** : supprimer le bloc `application/ld+json` de type `HowTo` sur `methode.html`. Le contenu "étape par étape" reste en HTML visible sans balisage.

### 3. [Medium] `sameAs` toujours absent
Aucun des 4 blocs `GeneralContractor` n'a de propriété `sameAs`. Opportunité manquée pour lier l'entité à une fiche Google Business Profile / réseaux sociaux si ces présences existent.
**Recommandation** : ajouter `sameAs` avec des URLs réelles uniquement (ne rien inventer).

### 4. [Low] `GeneralContractor` toujours dupliqué intégralement sur 4 pages
Le bloc complet (adresse, geo, areaServed 20 entrées, openingHoursSpecification, hasCredential) reste recopié à l'identique sur `index.html`, `methode.html`, `realisations.html`, `contact.html` plutôt qu'un stub `{"@id": "..."}` sur les pages secondaires. Toujours synchronisé (les 4 blocs sont identiques, vérifié), mais le risque de dérive manuelle reste entier — et vient d'être illustré en creux par le finding #1 (une correction NAP oubliée sur une seule page suffirait à recréer l'incohérence).

### 5. [Low] `Service.provider` sur methode.html toujours non lié par `@id`
Contrairement aux 7 pages villes (qui font `"provider": {"@id": "https://provencepvcarme.fr/#business"}`), le bloc `Service` de `methode.html` définit encore un `provider` en dur :
```json
"provider": { "@type": "GeneralContractor", "name": "Provence PVC Armé", "telephone": "+33660871651" }
```
**Recommandation** : aligner sur le pattern déjà utilisé sur les pages villes — `"provider": { "@id": "https://provencepvcarme.fr/#business" }`.

### 6. [Info] FAQPage — toujours aucun bénéfice SERP Google
Confirmé : plus de rich result FAQ pour aucun site depuis mai 2026. Le contenu reste pertinent indépendamment du schema ; parité texte confirmée bonne (voir "Corrigé"). Ne pas investir davantage tant qu'un bénéfice AI/GEO n'est pas confirmé.

### 7. [Info] `@type GeneralContractor` — toujours un choix acceptable mais approximatif
Inchangé depuis l'audit précédent : schema.org n'offre pas de sous-type dédié "pool contractor". `GeneralContractor` (sous-type de `HomeAndConstructionBusiness`) reste le plus proche disponible. Passer à `HomeAndConstructionBusiness` directement serait plus générique et n'apporterait pas de bénéfice de rich result supplémentaire — aucune action requise.

---

## Régression / nouveau problème

### 8. [Medium] Incohérence `areaServed` vs discours "hors zone, au cas par cas" pour Marseille/Montpellier/Aix-en-Provence
La section `#zones` d'`index.html` (contenu visible) dit explicitement :
> « Basés à Montélimar, nous intervenons dans tout le Sud-Est : Drôme, Ardèche, Vaucluse, Gard et une partie de l'Isère, jusqu'à deux heures de route à la ronde. **Pour un projet plus éloigné — vers Marseille par exemple — contactez-nous pour étudier la faisabilité au cas par cas.** »

Le `GeneralContractor.areaServed` (20 entrées) reflète bien cette zone à 2h — il ne contient ni Marseille, ni Montpellier, ni Aix-en-Provence (villes hors des 5 départements listés : Bouches-du-Rhône et Hérault n'y figurent pas). Cohérent avec le texte.

Mais les 3 pages villes dédiées à ces destinations (`pose-membrane-pvc-arme-marseille.html`, `-montpellier.html`, `-aix-en-provence.html`) déclarent un `Service.areaServed` ferme et sans réserve :
```json
"areaServed": { "@type": "City", "name": "Marseille" }
```
sans aucune nuance "au cas par cas" côté structured data, alors que la page d'accueil présente justement Marseille comme l'exemple type du "hors zone à étudier". C'est une opportunité manquée de cohérence plutôt qu'une erreur de syntaxe : Google (et un futur utilisateur d'IA générative s'appuyant sur ce balisage) peut interpréter le `Service` structuré comme une couverture ferme de Marseille, en contradiction avec le message éditorial de prudence affiché sur la page d'accueil.
**Recommandation** : soit assumer pleinement ces 3 villes comme zone de service à part entière (et retirer/nuancer la mention "au cas par cas, Marseille par exemple" sur la page d'accueil), soit ajouter une qualification dans le contenu visible de ces 3 pages villes (et refléter cette réserve dans la `description` du `Service`, schema.org n'ayant pas de propriété dédiée pour encoder une "zone secondaire sur devis"). Ne pas laisser le schema affirmer plus que ce que dit le reste du site.

Ce n'est pas une régression au sens strict (ces pages n'existaient pas lors de l'audit précédent, qui ne couvrait que 4 pages), mais un nouveau problème né de l'extension du site aux 7 pages villes depuis le dernier audit schema.

---

## Points positifs (à ne pas casser)

- 22/22 blocs JSON-LD syntaxiquement valides, `@context` https, URLs absolues.
- `hasCredential` (NF T54-804) toujours bien formé et pertinent.
- `geo`, `openingHoursSpecification`, `email`, `areaServed` cohérents entre les 4 pages qui portent le `GeneralContractor`.
- `BreadcrumbList` bien implémenté et fidèle au HTML visible sur 9 pages (methode, realisations, contact + 7 villes).
- Pattern `@id` de référence correctement utilisé sur les 7 nouvelles pages villes (`Service.provider`).
- Parité FAQPage / FAQ visible mot pour mot, confirmée sur les 7 questions.
- Aucun faux `Review`/`AggregateRating` inventé.
- `mentions-legales.html` et `confidentialite.html` n'ont pas de JSON-LD — correct, pas d'opportunité obligatoire pour des pages purement légales (un stub `WebPage`/`Organization` par `@id` serait un "nice to have" Info, pas une lacune).

## Priorités d'action

1. **Trancher et unifier le NAP** (Montélimar vs Dieulefit) dans les 4 blocs `GeneralContractor`, les 13 footers et le texte de `mentions-legales.html` — Critical, non résolu depuis l'audit précédent.
2. **Supprimer le bloc `HowTo`** sur `methode.html` — High, recommandé depuis le dernier audit et toujours en place.
3. Clarifier la cohérence `areaServed` vs message "au cas par cas" pour Marseille/Montpellier/Aix-en-Provence — Medium, nouveau.
4. Ajouter `sameAs` avec des URLs réelles si disponibles — Medium.
5. Lier `Service.provider` de `methode.html` par `@id`, comme déjà fait sur les 7 pages villes — Low.
6. Envisager de factoriser le `GeneralContractor` via des stubs `@id` sur les pages secondaires pour réduire le risque de dérive NAP future — Low.
