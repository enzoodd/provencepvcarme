# Audit SEO Local — provencepvcarme.fr

**Score Local SEO : 38/100** (précédent audit du 2026-09-28 : 30/100)

| Dimension | Poids | Score /100 | Contribution |
|---|---|---|---|
| Signaux GBP | 25% | 5 | 1.25 |
| Avis & réputation | 20% | 5 | 1.0 |
| SEO on-page local | 20% | 70 | 14.0 |
| Cohérence NAP & citations | 15% | 35 | 5.25 |
| Schema local | 10% | 60 | 6.0 |
| Liens & autorité locale | 10% | 15 | 1.5 |
| **Total** | 100% | | **≈38/100** |

Type d'établissement détecté : **Hybride ambigu**. Le site communique presque partout comme s'il s'agissait d'un point d'ancrage physique clair ("notre atelier de Montélimar", schema avec `addressLocality: Montélimar`), sans jamais afficher de rue ni de numéro — ce qui se rapproche d'un modèle SAB (Service Area Business) à ville d'ancrage masquée. Mais les mentions légales (obligation légale française) révèlent une adresse réelle différente : **Dieulefit**. Cette double identité n'est toujours pas résolue (voir "Toujours ouvert" ci-dessous). Secteur : **Home Services / artisan du bâtiment (pose de membrane PVC armée pour piscines)**.

Pages auditées (13) : index.html, contact.html, methode.html, realisations.html, mentions-legales.html, confidentialite.html, et les 7 pages ville — pose-membrane-pvc-arme-{avignon, orange, pierrelatte, valence, marseille, montpellier, aix-en-provence}.html. Toutes servies en direct depuis **https://provencepvcarme.fr** (HTTP 200 confirmé sur les 13 URLs le jour de l'audit — changement majeur : le DNS ne résolvait pas lors de l'audit du 2026-09-28).

---

## Corrigé depuis le dernier audit (2026-09-28)

- **Le site est en ligne** — le DNS ne résolvait pas lors du dernier audit local ; les 13 pages répondent en HTTP 200 en production. C'est un prérequis absolu pour tout signal local (indexation, GBP, citations) : sans site accessible, aucun des points ci-dessous n'a de valeur.
- **Incohérence "rayon d'intervention" résolue au niveau du contenu visible.** Le rayon annoncé est désormais uniformément "environ 2h" avec 5 départements nommés (Drôme, Ardèche, Vaucluse, Gard, Isère) sur index.html (hero de la section zones, footer, schema `areaServed`), contact.html (infos pratiques + chips) et methode.html — cohérence retrouvée entre le message et la liste de zones. C'était le point MEDIUM-4 du précédent rapport (contact.html ne listait que les villes, pas les départements) : corrigé, contact.html mentionne maintenant explicitement les 5 départements dans son texte visible.
- **7 pages de service dédiées créées** (Avignon, Orange, Pierrelatte, Valence, Marseille, Montpellier, Aix-en-Provence), répondant directement au HIGH-2/MEDIUM-4 du précédent audit ("aucune page de service localisée", "dedicated service pages" identifié comme facteur #1 SEO local organique). Chaque page a un schema `Service` propre, un `BreadcrumbList`, une URL indexée au sitemap, et un contenu réellement différencié (voir section dédiée ci-dessous).
- **La zone SVG "carte de France" a remplacé le schéma radius précédent** — le label central reste "Montélimar", cohérent avec le reste du discours marketing (même s'il reste en tension avec l'adresse légale, voir plus bas).

## Toujours ouvert

- **CRITIQUE — Incohérence NAP Montélimar / Dieulefit, toujours présente, sous une nouvelle forme.** Le précédent audit signalait une contradiction entre un NAP technique (schema + footer + mentions légales, tous alignés sur Dieulefit à l'époque) et un discours marketing parlant de Montélimar. Aujourd'hui, la situation s'est inversée sans se résoudre : le schema JSON-LD (`addressLocality: "Montélimar"`, geo 44.5579/4.7503 = coordonnées réelles du centre de Montélimar) et le footer de **11 pages sur 13** (index, contact, methode, realisations + les 7 pages ville) affichent "Montélimar". Mais **mentions-legales.html** et **confidentialite.html** affichent toujours, en footer et dans le corps du texte légal, **"Dieulefit, Drôme"** ("Adresse : Dieulefit, Drôme, France" dans mentions-legales.html, ligne 81). Un même site affiche donc deux villes différentes selon la page consultée. Le NAP le plus juridiquement engageant (mentions légales, obligation légale française) contredit le NAP commercial dominant. C'est exactement le type d'incohérence NAP qui, si une fiche GBP est créée avec l'une ou l'autre ville, produira un signal négatif direct pour le Local Pack (NAP consistency = facteur #12 Whitespark 2026).
- **HIGH — Toujours aucun signal GBP détectable.** Recherche exhaustive sur les 13 pages : aucun embed Google Maps, aucun lien vers une fiche Google Business Profile, aucun `sameAs`, aucun widget d'avis. Point le plus pénalisant de l'audit (catégorie GBP primaire = facteur #1 de classement, score 193 Whitespark 2026) — inchangé depuis le dernier audit.
- **HIGH — Toujours aucun signal d'avis / réputation.** Aucun `aggregateRating`, aucune note affichée, aucun témoignage client sur les 13 pages. Inchangé.
- **MEDIUM — Aucune citation Tier 1 détectable.** Recherche externe (moteur de recherche) sur "Provence PVC Armé" + Dieulefit/Montélimar : aucun résultat de type Pages Jaunes, Societe.com, BBB, Google Business Profile ou autre annuaire n'apparaît dans les ~96 400 résultats retournés — seuls des sites touristiques génériques sur la Provence remontent. Confirme l'absence totale de présence en ligne hors du site propre.
- **LOW — SIRET toujours en placeholder.** mentions-legales.html ligne 84-85 contient toujours le commentaire `<!-- TODO: ajouter SIRET -->` et le texte `Numéro SIRET : [SIRET À COMPLÉTER]`. Non corrigé malgré une refonte visible de cette page (date de mise à jour affichée : 24 août 2026, adresse simplifiée en "Dieulefit, Drôme, France" sans rue/CP). À noter pour le brief : le SIRET n'est **pas** présent contrairement à ce qui pouvait être supposé — c'est toujours un placeholder actif.

## Régression / nouveau problème

- **RÉGRESSION MINEURE — Précision géo dégradée.** Le schema `GeneralContractor` affichait précédemment une précision de 7 décimales sur `geo` (largement au-dessus des 5 décimales recommandées). La version actuelle affiche `44.5579` / `4.7503` — **4 décimales seulement**, sous le seuil recommandé de 5 décimales (~1,1 m de précision visée). Le point positif : les nouvelles coordonnées correspondent bien au centre de Montélimar (cohérentes avec `addressLocality`), contrairement à avant où le geo pointait vers Dieulefit alors que le texte disait Montélimar — donc gain de cohérence interne au prix d'une perte de précision technique.
- **RÉGRESSION MINEURE — `address` schema appauvrie.** Le précédent schema contenait `streetAddress` et `postalCode` (417 Chemin de la Françoise, 26220 Dieulefit). La version actuelle ne contient plus que `addressLocality` + `addressRegion` + `addressCountry`, sans rue ni code postal, sur les 4 pages qui portent le schema `GeneralContractor` (index, contact, methode, realisations). C'est défendable si le choix est d'assumer un modèle SAB sans adresse d'accueil client publique — mais ce choix n'est nulle part assumé explicitly dans le contenu (le site continue de parler d'un "atelier à Montélimar" comme d'un lieu fixe). Si c'est un choix délibéré de confidentialité, il faudrait le documenter/assumer (ex. configurer un GBP en mode "service area business" sans adresse visible) plutôt que de laisser un entre-deux.
- **NOUVEAU — Incohérence "Marseille" entre meta description homepage et page ville dédiée.** La meta description et l'og:description d'index.html promettent une couverture "à Montélimar et dans le Sud-Est — Drôme, Ardèche, Vaucluse, Gard, **jusqu'à Avignon, Orange et Marseille**" (Marseille citée comme dans la zone couverte). Mais la page dédiée `pose-membrane-pvc-arme-marseille.html` et la section "Zones d'intervention" d'index.html positionnent explicitly Marseille comme **hors du rayon habituel de 2h**, "étudiée au cas par cas" ("Pour un projet plus éloigné — vers Marseille par exemple — contactez-nous pour étudier la faisabilité au cas par cas"). Un extrait Google (meta description) qui promet Marseille en couverture standard, alors que la page cible dit l'inverse, crée un risque de déception/rebond et un signal de contenu incohérent entre la promesse SERP et le contenu réel.
- **NOUVEAU (mineur) — Département Isère absent de la meta description homepage.** La meta description liste 4 départements ("Drôme, Ardèche, Vaucluse, Gard") alors que le schema `areaServed`, la section zones et le footer en citent 5 (+ Isère). Incohérence mineure entre ce que Google affiche dans les SERP et ce que le site/schema déclare réellement couvrir.

---

## NAP — Comparatif des sources

| Champ | Schema JSON-LD (index/contact/méthode/réalisations) | Footer (11 pages commerciales) | Footer + corps de texte (mentions-legales.html, confidentialite.html) | Cohérent ? |
|---|---|---|---|---|
| Nom | Provence PVC Armé | Provence PVC Armé | Provence PVC Armé | Oui |
| Ville | Montélimar | Montélimar | **Dieulefit, Drôme** | **NON — voir "Toujours ouvert"** |
| Rue / CP | Non renseigné (absent du schema) | Non affiché | Non affiché (mentions légales dit juste "Dieulefit, Drôme, France", sans rue ni CP) | N/A (donnée absente partout désormais) |
| Téléphone | +33660871651 | 06 60 87 16 51 | 06 60 87 16 51 | Oui (E.164 vs national, équivalent) |
| Email | provencepvcarme@gmail.com | provencepvcarme@gmail.com | provencepvcarme@gmail.com | Oui |
| SIRET | — | — | `[SIRET À COMPLÉTER]` (placeholder non rempli) | N/A — absent |

Le téléphone et l'email sont parfaitement cohérents sur les 13 pages — c'est un point fort maintenu. La ville est la seule variable NAP réellement incohérente, mais c'est la plus visible et la plus structurante pour toute future fiche GBP.

---

## Qualité des 7 pages ville — analyse de différenciation

Comparaison ligne à ligne de 3 pages (Avignon, Orange, Marseille) et vérification croisée sur les 4 autres (Pierrelatte, Valence, Montpellier, Aix-en-Provence).

**Verdict : les 7 pages sont réellement différenciées, pas de duplicate content avec simple substitution du nom de ville.** Ce n'est pas un test "doorway page swap" qui échoue — chaque page a un H1/lede propre avec une information factuelle différente (distance de route précise et crédible depuis "l'atelier de Montélimar"), pas un gabarit figé :

| Page | Distance annoncée | Statut de couverture | Photo de chantier réelle | FAQ locale spécifique |
|---|---|---|---|---|
| Pierrelatte | "à peine un quart d'heure" | Zone cœur, intervention très régulière, mention réparations ponctuelles | Non (placeholder commenté dans le HTML) | Oui, orientée réactivité/proximité |
| Orange | "à peine 45 minutes" | Zone cœur | Oui — fond diamant, PVC gris clair | Oui, orientée piscine récente |
| Valence | "environ 35 minutes", "préfecture de la Drôme" | Zone cœur, agglomération | Non (placeholder) | Oui, orientée agglomération |
| Avignon | "environ une heure" | Zone cœur, "la plus régulière" | Oui — effet pierre naturelle "Authentic" | Oui, orientée rénovation |
| Aix-en-Provence | "environ 1h40" | Limite de zone, cas par cas | Oui — granit grey | Oui, orientée "petit chantier possible ?" |
| Montpellier | "environ 1h45", via A9 | Hors zone, cas par cas | Non (placeholder) | Oui, orientée justification du déplacement |
| Marseille | "environ deux heures" | Hors zone, cas par cas, "limite de notre rayon" | Non (placeholder) | Oui, orientée "intervenez-vous vraiment jusque-là ?" |

Points forts constatés :
- Chaque page a un corps de texte unique (150-200 mots), pas un template avec uniquement le nom de ville substitué — le narratif change selon la distance réelle (proximité = réactivité/interventions ponctuelles ; distance = "privilégier les chantiers d'ampleur", "étudier la faisabilité au cas par cas").
- Les 4 pages sans photo réelle (Pierrelatte, Valence, Marseille, Montpellier) contiennent un commentaire HTML honnête (`<!-- Ajouter une photo de chantier à [ville] dès qu'on en a une réelle -->`) plutôt qu'une photo générique ou trompeuse réutilisée d'une autre ville — bonne pratique anti-duplication mais qui laisse 4/7 pages visuellement plus faibles.
- Chaque page a son propre schema `Service` (`areaServed` = la ville précise, `provider` lié par `@id` au `GeneralContractor` de la page d'accueil) et son propre `BreadcrumbList` — implémentation technique correcte et non dupliquée bêtement.
- Le maillage interne "Voir aussi" en bas de chaque page pointe vers 2 pages villes voisines géographiquement (ex. Avignon → Orange, Pierrelatte ; Marseille → Aix-en-Provence, Montpellier) — cohérent et pertinent, pas un maillage aléatoire.
- Liens vers les 7 pages ville présents dans le footer des 13 pages ET dans la section "Zones d'intervention" d'index.html — bonne profondeur de lien interne (1 clic depuis n'importe quelle page).

Point d'attention (Medium) : la distinction entre les 3 villes "zone cœur avec couverture garantie" (Avignon, Orange, Pierrelatte, Valence) et les 3 villes "hors zone, étudiées au cas par cas" (Marseille, Montpellier, Aix-en-Provence) est bien assumée et transparente dans le contenu — bon point E-E-A-T (pas de survente). Mais cela crée un mélange de pages à intention différente dans une même série "Secteurs" du footer, sans distinction visuelle immédiate pour l'utilisateur avant de cliquer (le footer liste les 7 villes à l'identique, sans indiquer lesquelles sont en zone garantie vs cas par cas).

---

## Findings détaillés

### CRITICAL-1 — Incohérence NAP Montélimar (11 pages) vs Dieulefit (2 pages légales)
**Sévérité : Critique**
Voir détail dans "Toujours ouvert" ci-dessus. Impact : bloque toute création fiable de fiche GBP tant que la ville de référence n'est pas tranchée. Une fiche GBP doit utiliser l'adresse de vérification réelle (déclarée aux impôts / SIRET) : si celle-ci est Dieulefit, alors afficher "Montélimar" partout ailleurs sur le site crée une divergence entre le NAP web dominant et le NAP GBP — un signal négatif direct. Si l'adresse réelle a changé pour Montélimar, alors mentions-legales.html et confidentialite.html doivent être mis à jour en priorité (obligation légale : ces pages doivent refléter l'adresse réelle de l'entrepreneur individuel).
**Recommandation** : Trancher définitivement quelle ville sert d'ancrage NAP (celle de l'adresse SIRET réelle) et harmoniser mentions-legales.html + confidentialite.html avec le reste du site — ou l'inverse si Dieulefit est la vérité légale. Ne pas créer de fiche GBP tant que cette décision n'est pas prise.

### HIGH-2 — Aucun signal GBP détectable sur le site
**Sévérité : Élevée**
Inchangé depuis le dernier audit. Aucun embed Maps, aucun lien de fiche, aucun `sameAs`. Le facteur de classement local #1 (catégorie GBP primaire, score 193) ne peut être évalué ni optimisé sans fiche.
**Recommandation** : Créer/vérifier la fiche GBP une fois le NAP unifié (CRITICAL-1 résolu), avec catégorie principale précise pour la pose de revêtement de piscine (type "Swimming pool contractor" / équivalent français le plus proche — pas une catégorie générique BTP), puis lier le GBP depuis le footer du site et ajouter `sameAs` au schema `GeneralContractor` sur les 4 pages concernées.

### HIGH-3 — Aucun signal d'avis / réputation
**Sévérité : Élevée**
Inchangé. Pas d'`aggregateRating`, pas de témoignage, pas de note visible sur les 13 pages, alors même que le site a maintenant 7 pages ville qui pourraient chacune accueillir un avis local pertinent.
**Recommandation** : Mettre en place une collecte d'avis systématique en fin de chantier (règle des 18 jours — la vélocité compte plus que le volume). Ajouter une section témoignages sur index.html et, une fois des avis réels GBP collectés, un `aggregateRating` (jamais de données fabriquées).

### MEDIUM-4 — Promesse de couverture Marseille incohérente entre meta description homepage et page ville dédiée
**Sévérité : Moyenne**
Voir détail dans "Régression / nouveau problème". La meta description d'index.html laisse penser que Marseille est couverte au même titre qu'Avignon/Orange, alors que la page dédiée et la section zones du site la présentent comme hors zone standard, étudiée au cas par cas.
**Recommandation** : Reformuler la meta description d'index.html pour distinguer clairement la zone cœur (Drôme, Ardèche, Vaucluse, Gard, Isère — garantie) de l'extension "cas par cas" (Marseille, Montpellier, Aix), par exemple : "...à Montélimar et dans le Sud-Est (Drôme, Ardèche, Vaucluse, Gard, Isère). Projets étudiés au cas par cas vers Marseille, Aix-en-Provence, Montpellier."

### MEDIUM-5 — Aucune citation Tier 1 détectable
**Sévérité : Moyenne**
Inchangé. Recherche externe confirmant l'absence de toute présence sur annuaires (Pages Jaunes, Societe.com, BBB, GBP) pour "Provence PVC Armé".
**Recommandation** : Une fois le NAP unifié, créer les fiches Pages Jaunes, Google Business Profile, Bing Places et annuaires BTP/piscine spécialisés (ex. Fédération des Professionnels de la Piscine) avec un NAP strictement identique partout. Rappel : 3 des 5 facteurs de visibilité IA (Whitespark 2026) sont liés aux citations.

### LOW-6 — SIRET toujours absent (placeholder actif)
**Sévérité : Faible (conformité légale + E-E-A-T)**
Inchangé malgré la mise à jour visible de mentions-legales.html (24 août 2026). Le TODO et le placeholder sont toujours dans le code source livré.
**Recommandation** : Compléter le SIRET dès disponibilité — obligation légale française pour un auto-entrepreneur exerçant une activité commerciale, et signal de confiance/E-E-A-T local.

### LOW-7 — Précision `geo` réduite à 4 décimales (sous le seuil recommandé de 5)
**Sévérité : Faible**
`44.5579` / `4.7503` = 4 décimales sur les 4 pages portant le schema `GeneralContractor`, contre 7 décimales dans la version précédente. Sous le seuil des 5 décimales recommandé par Google.
**Recommandation** : Régénérer les coordonnées avec au moins 5 décimales (ex. via Google Maps, clic droit sur le point exact) une fois l'adresse de référence tranchée (Montélimar ou Dieulefit).

### LOW-8 — Schema `GeneralContractor` toujours sans `sameAs`, `hasMap`, `aggregateRating`
**Sévérité : Faible**
Inchangé depuis le précédent audit. Les propriétés requises (`name`, `address`) sont présentes ; les recommandées `openingHoursSpecification`, `telephone`, `url`, `image`, `priceRange`, `areaServed`, `hasCredential` (NF T54-804) sont bien présentes et cohérentes sur les 4 pages qui portent ce schema. Il manque `sameAs`, `hasMap`, et `aggregateRating` (légitimement absent tant qu'aucun avis réel n'existe).
**Recommandation** : Ajouter `sameAs` et `hasMap` dès la création de la fiche GBP.

### INFO-9 — Incohérence mineure "4 vs 5 départements" entre meta description et contenu
**Sévérité : Info**
La meta description d'index.html cite 4 départements (Drôme, Ardèche, Vaucluse, Gard) alors que le schema/footer/section zones en citent 5 (+ Isère). Impact SEO faible (peu de recherches portent sur "Isère" pour cette activité vu l'éloignement), mais un signal d'incohérence facile à corriger en même temps que MEDIUM-4.

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
| Preuve photographique liée à GBP | Manquant (photos de chantier existent sur le site — 3 des 7 pages ville, plus la page réalisations — mais aucun lien vers une galerie GBP) |

## Snapshot avis

Aucune note, aucun volume d'avis, aucun `aggregateRating`, aucun taux de réponse observable sur les 13 pages. Dimension entièrement absente, non évaluable sans accès à une fiche GBP réelle (hors périmètre de cet audit code-source).

## Validation schema local

- Type utilisé : `GeneralContractor` (sous-type correct pour un artisan du bâtiment) sur index, contact, methode, realisations — cohérent entre ces 4 pages (même `@id`, mêmes valeurs).
- Propriétés requises : `name` ✔, `address` ✔ (mais incomplète — voir ci-dessous).
- Propriétés recommandées : `geo` ✔ mais précision insuffisante (4 décimales, sous le seuil de 5 — LOW-7), `openingHoursSpecification` ✔, `telephone` ✔, `url` ✔, `image` ✔, `priceRange` ✔, `areaServed` ✔ (19 villes + 5 départements, cohérent entre les 4 pages), `hasCredential` ✔ (bonus, norme NF T54-804).
- Manquant : `sameAs`, `hasMap`, `aggregateRating` (légitimement absent tant qu'aucun avis réel n'existe).
- Régression : `address` ne contient plus `streetAddress` ni `postalCode` (seulement `addressLocality`, `addressRegion`, `addressCountry`) — recommandé par Google mais pas strictement requis ; réduit la richesse de l'objet `PostalAddress` par rapport à la version précédente.
- Les 7 pages ville portent un schema `Service` bien formé : `serviceType`, `provider` (référence `@id` vers le `GeneralContractor`), `areaServed` (type `City`, nom correct), `url`. Chaque page a également un `BreadcrumbList` cohérent à 3 niveaux (Accueil > Zone d'intervention > [Ville]). Implémentation technique propre, aucune duplication de schema brute entre les pages ville.
- mentions-legales.html et confidentialite.html n'ont aucun schema JSON-LD (acceptable pour des pages légales).

## Qualité des pages ville (multi-localisation)

Voir la section dédiée ci-dessus ("Qualité des 7 pages ville — analyse de différenciation"). Résumé : contenu réellement unique par page (distance de trajet différenciée et crédible, statut de couverture explicite zone cœur vs cas-par-cas, photos réelles sur 3/7 pages, FAQ locale spécifique par ville, maillage interne pertinent vers les villes voisines). Pas de test "doorway page swap" qui échouerait ici — ce n'est pas un gabarit avec simple substitution du nom de ville. Point d'amélioration : ajouter les 4 photos de chantier manquantes (Pierrelatte, Valence, Marseille, Montpellier) dès que des réalisations réelles existent dans ces secteurs, et clarifier visuellement dans le footer/le maillage la distinction entre zone garantie et zone "cas par cas".

---

## Top 10 actions prioritaires

1. **[Critical]** Trancher l'incohérence NAP Montélimar (11 pages + schema) vs Dieulefit (mentions-legales.html, confidentialite.html) — harmoniser sur l'adresse SIRET réelle avant toute création de fiche GBP.
2. **[High]** Créer ou auditer la fiche Google Business Profile une fois le NAP unifié : catégorie principale précise (type piscine, pas BTP générique), NAP identique au site, puis lier le GBP depuis le footer + `sameAs` en schema.
3. **[High]** Mettre en place une collecte d'avis clients systématique en fin de chantier (règle des 18 jours) pour alimenter un futur `aggregateRating`.
4. **[High]** Ajouter une section témoignages/avis visible sur index.html dès que des avis réels existent.
5. **[Medium]** Reformuler la meta description/og:description d'index.html pour ne pas laisser penser que Marseille est couverte au même titre que la zone cœur (Drôme/Ardèche/Vaucluse/Gard/Isère) — aligner avec le discours "cas par cas" de la page dédiée Marseille.
6. **[Medium]** Créer/vérifier les citations Tier 1 pertinentes (Google Business Profile, Pages Jaunes, Bing Places, annuaires BTP/piscine) avec NAP strictement identique, une fois le NAP unifié.
7. **[Medium]** Ajouter les 4 photos de chantier réelles manquantes sur les pages ville Pierrelatte, Valence, Marseille, Montpellier (actuellement en placeholder commenté).
8. **[Low]** Compléter le numéro SIRET dans mentions-legales.html (placeholder toujours actif malgré la mise à jour de la page le 24 août 2026).
9. **[Low]** Régénérer les coordonnées `geo` avec au moins 5 décimales de précision (actuellement 4) une fois l'adresse de référence tranchée.
10. **[Low]** Ajouter `sameAs` et `hasMap` au schema `GeneralContractor` sur les 4 pages concernées, dès la création de la fiche GBP.

---

## Limitations

- Audit réalisé par fetch direct des pages en production (curl, HTTP 200 confirmé sur les 13 URLs) — pas d'accès à une fiche Google Business Profile réelle (existence, exactitude, catégorie, avis, posts) : ces éléments nécessitent un accès GBP authentifié ou un outil type DataForSEO (non disponible dans cette session).
- La recherche de citations externes (Pages Jaunes, BBB, Societe.com, etc.) a été effectuée via un moteur de recherche web générique (résultats limités à ce qu'un fetch simple retourne) plutôt qu'un audit de citations dédié (type BrightLocal/Whitespark) — l'absence constatée est indicative, pas exhaustive à 100%.
- Proximité géographique (55,2 % de la variance de classement selon Search Atlas) hors du contrôle de cet audit — dépend de l'implantation réelle (Dieulefit ou Montélimar, à trancher) et de la configuration GBP, non du code source.
- Vélocité d'avis, taux de réponse, catégorie GBP réelle : non évaluables sans accès à la fiche GBP.
- L'analyse fine de la validité technique du JSON-LD (syntaxe, erreurs de parsing, tests Rich Results) est laissée à l'agent schema dédié, conformément au périmètre de cet audit local SEO.
