# Audit SXO — provencepvcarme.fr

**SXO Gap Score : 69/100** (distinct du SEO Health Score)

| Dimension | Score | Max |
|---|---|---|
| Adéquation type de page (Page Type) | 13 | 15 |
| Profondeur de contenu | 9 | 15 |
| Signaux UX | 11 | 15 |
| Schema.org | 12 | 15 |
| Média | 12 | 15 |
| Autorité / preuve sociale | 6 | 15 |
| Fraîcheur | 6 | 10 |

Pages auditées : `index.html`, `methode.html`, `realisations.html`, `contact.html` (via `http://localhost:8804`).
Activité réelle du site : pose de **membrane PVC armée pour piscines** (thermosoudage), basée à Dieulefit/Montélimar (26), rayon 2h — pas de la menuiserie PVC malgré le nom de domaine.

---

## 1. Analyse SERP et adéquation du type de page

Recherche : *"PVC armé piscine Montélimar rénovation membrane"*. Le SERP mélange deux types de pages :
- **Service Page locale** (piscine-o-jardin.fr, piscine-eo.fr, moodpiscine.fr, danslo-piscine.com, mhpool.be) : entreprises régionales, méthodologie, zone d'intervention.
- **Guides/Blog informationnels** (guide-piscine.fr, tse-etancheite.fr, id-piscine.com "guide complet") : contenu définitionnel long format répondant aux questions "qu'est-ce que", "durée de vie", "prix au m²".

**Type dominant SERP : Service Page + signaux Local (NAP, zone d'intervention), avec sous-intention informationnelle forte.**

**Classification de la cible (taxonomie) :** Hybrid Service Page + Local Page — hero/CTA (traits Landing), méthodologie détaillée avec schema HowTo (traits Service Page), zone de chalandise + NAP + GeneralContractor schema (traits Local Page).

**Verdict de correspondance : ALIGNÉ (pas de mismatch critique).** Le site est structurellement du bon type. Le problème n'est pas le type de page mais la **profondeur et l'autorité perçue** face à des guides informationnels concurrents et des sites locaux avec plus de preuve sociale.

---

## 2. Findings

### FINDING 1 — Aucune preuve sociale client (avis, témoignages, note) — sévérité HIGH
**Description :** Aucune des 4 pages ne contient d'avis client, de note Google, de témoignage nommé, ni de schema `Review`/`AggregateRating`. Le contexte annonce des "badges de confiance" (norme NF T54-804, garantie fabricant 10 ans, 5+ ans d'expérience) mais ce sont des affirmations de l'entreprise elle-même, pas des preuves tierces. Pour un achat à fort enjeu (rénovation de piscine, plusieurs milliers d'euros), l'absence totale de tiers de confiance (avis Google, Trustpilot, témoignages clients avec ville) est un manque majeur — d'autant que le persona "Décideur averse au risque" est un signal SERP classique pour ce type de requête (achat cher, peu fréquent).
**Recommandation :** Ajouter un bloc "Avis clients" sur `index.html` (3-5 témoignages avec prénom + ville + type de projet) et intégrer un lien/widget vers les avis Google de la fiche établissement, avec schema `AggregateRating`/`Review` lié à l'entité `GeneralContractor`.

### FINDING 2 — Aucune mention d'assurance décennale — sévérité HIGH
**Description :** Sur un site de gros œuvre/étanchéité de piscine en France, l'absence de toute mention d'**assurance décennale** ou de garantie décennale (obligatoire légalement pour ce type de travaux) est un manque de réassurance majeur, et une requête PAA fréquente ("assurance décennale piscine PVC armé"). Les 3 badges actuels couvrent norme/garantie fabricant/expérience mais pas la couverture légale du chantier.
**Recommandation :** Ajouter un 4e badge "Assurance décennale" (ou intégrer la mention dans la section badges + mentions légales), avec numéro de police si disponible. Fort gain de confiance pour un coût de mise en œuvre faible.

### FINDING 3 — "Contenu local en accordéon départemental" annoncé mais absent du HTML livré — sévérité HIGH
**Description :** Le contexte de la tâche mentionne un "contenu local en accordéon départemental" comme amélioration récente. Vérification par grep sur les 4 pages : le seul `<details>` présent est la FAQ (3 questions, `index.html`). La section "Zones d'intervention" (`index.html` #zones et `contact.html` #infos-pratiques) affiche une simple liste de tags plats (Drôme, Ardèche, Vaucluse, Gard, Isère / villes) sans accordéon ni contenu unique par département. Il n'y a donc aucune différenciation de contenu local par zone (pas de texte spécifique "PVC armé piscine en Ardèche" vs "...dans le Vaucluse"), alors que le SERP montre des concurrents avec du contenu local ciblé par ville/secteur.
**Recommandation :** Implémenter réellement l'accordéon départemental prévu, avec un paragraphe unique par département (villes desservies, spécificités locales, délai d'intervention) — cela crée de la profondeur de contenu local et des ancrages pour les recherches "PVC armé piscine [département/ville]".

### FINDING 4 — Aucune indication de prix, même indicative — sévérité MEDIUM
**Description :** `contact.html` justifie explicitement l'absence de prix ("nous préférons un chiffrage juste plutôt qu'un prix générique affiché"), et aucune des 4 pages ne donne de fourchette de prix au m² ou par type de projet. Or le SERP informationnel (guides concurrents) répond frontalement à "prix membrane PVC armée piscine". Le persona sensible au prix (Budget-Conscious) arrivant depuis une recherche informationnelle n'a aucun repère et doit appeler pour la moindre estimation — friction élevée pour un visiteur en phase de découverte.
**Recommandation :** Ajouter une fourchette indicative ("à partir de X €/m²" ou par taille de bassin type) sur `methode.html` ou dans une nouvelle section FAQ, tout en gardant l'argument du devis personnalisé pour le chiffrage final.

### FINDING 5 — Page Réalisations sans récit ni données de chantier — sévérité MEDIUM
**Description :** `realisations.html` propose 4 paires avant/après + une galerie "coulisses", mais chaque chantier n'a qu'une légende d'une ligne (ville + finition). Aucune donnée de contexte (surface du bassin, durée du chantier, problème initial résolu, type de piscine) qui permettrait à un persona "Évaluateur technique/Comparateur" de se projeter — ce type de contenu correspond pourtant aux "case studies" attendues par la taxonomie Service Page.
**Recommandation :** Ajouter 2-3 lignes de récit par chantier (contexte, durée réelle du chantier, résultat), ou a minima enrichir les `figcaption` avec durée + type de bassin.

### FINDING 6 — Pas de carte / itinéraire sur la page Contact — sévérité MEDIUM
**Description :** `contact.html` a le schema `GeneralContractor` avec adresse et geo-coordonnées, mais aucune carte Google Maps embarquée ni lien "itinéraire". La taxonomie Local Page exige une carte intégrée comme élément requis, et les recherches locales ("PVC armé piscine près de Montélimar") s'attendent à visualiser rapidement la zone couverte, au-delà du schéma stylisé non géographique déjà présent sur `index.html`.
**Recommandation :** Intégrer une carte Google Maps (ou lien "Voir l'itinéraire") sur `contact.html`, avec le rayon d'intervention réel si possible.

### FINDING 7 — FAQ très courte face à des guides concurrents approfondis — sévérité LOW
**Description :** La FAQ (schema `FAQPage`) ne compte que 3 questions génériques, alors que les concurrents informationnels du SERP (guide-piscine.fr, id-piscine.com) couvrent des dizaines de sous-questions (entretien, hivernage, compatibilité forme de bassin, coût, comparatif liner/coque/carrelage). Ce contenu court limite les chances de capter du trafic informationnel top-of-funnel et de gagner des featured snippets/PAA.
**Recommandation :** Étendre la FAQ à 6-8 questions (entretien, hivernage, délai de séchage, compatibilité formes de bassin) en s'appuyant sur `methode.html` qui a déjà la profondeur technique nécessaire.

### FINDING 8 — Points positifs à noter (ALIGNÉ, aucune action requise)
**Description :** Le formulaire de contact fonctionnel en AJAX (Formspree, `contact.html` #devisForm avec `formStatus` `aria-live`), les badges de confiance, le bandeau de marques partenaires, le schema riche (`GeneralContractor`, `Service`, `HowTo`, `FAQPage`, `BreadcrumbList`), la page Méthode avec comparatif liner/membrane et étapes illustrées par vrais chantiers (Saint-Restitut, Dieulefit, Grignan) sont des signaux de qualité forts et correctement exécutés, alignés avec les attentes SERP "Service Page".

---

## 3. User stories dérivées du SERP

1. **En tant que** propriétaire de piscine dégradée cherchant une solution durable, **je veux** comprendre pourquoi le PVC armé dure plus longtemps qu'un liner classique, **parce que** je ne veux pas refaire les travaux dans 8 ans, **mais je suis bloqué par** l'absence de comparaison chiffrée facilement trouvable — *(source : `methode.html` a bien ce comparatif, mais il n'est pas repris/teasé sur `index.html` ni en FAQ)*.
2. **En tant qu'**acheteur sensible au prix, **je veux** une fourchette de budget avant d'appeler, **parce que** je qualifie plusieurs prestataires avant de m'engager, **mais je suis bloqué par** l'absence totale de prix indicatif sur le site — *(source : Finding 4, guides SERP concurrents répondent à "prix membrane PVC armée")*.
3. **En tant que** décideur averse au risque (gros montant, chantier irréversible), **je veux** voir des avis d'autres clients de la région, **parce que** je veux vérifier le sérieux avant de laisser mes coordonnées, **mais je suis bloqué par** l'absence d'avis tiers/notes Google — *(source : Finding 1, requête à fort enjeu financier typique du secteur BTP/piscine)*.
4. **En tant qu'**habitant d'un département périphérique (Ardèche, Gard, Isère), **je veux** savoir si l'entreprise intervient vraiment chez moi et sous quel délai, **parce que** je ne veux pas perdre de temps à demander un devis hors zone, **mais je suis bloqué par** l'absence de contenu local différencié par département — *(source : Finding 3, liste de tags plate sans contenu par zone)*.

---

## 4. Personas (échantillon, dérivés des signaux SERP)

| Persona | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| Décideur averse au risque (gros budget) | 18/25 | 16/25 | 8/25 | 18/25 | 60/100 | Bon mais fragile (trust) |
| Acheteur sensible au prix | 14/25 | 12/25 | 14/25 | 16/25 | 56/100 | À travailler |
| Habitant hors Montélimar (Ardèche/Gard/Isère) | 15/25 | 13/25 | 14/25 | 17/25 | 59/100 | À travailler |
| Chercheur informationnel ("qu'est-ce que le PVC armé") | 20/25 | 20/25 | 15/25 | 15/25 | 70/100 | Bon |

**Persona le plus faible : Acheteur sensible au prix (56/100).**
**Problème principal :** aucun repère de prix nulle part sur le site.
**Correctif recommandé :** ajouter une fourchette indicative sur `methode.html` ou en FAQ (voir Finding 4).

---

## 5. Limitations

- SERP réel non consulté depuis la position géographique de l'entreprise (résultats Google via WebSearch générique, pas de vérification du pack local / Google Business Profile).
- Analyse basée sur lecture directe du code source des 4 fichiers HTML (pas de rendu Playwright), donc pas de vérification du comportement JS réel du formulaire (AJAX vs fallback) ni du rendu final de l'accordéon FAQ / animations.
- Pas de vérification des Core Web Vitals ni de l'expérience mobile réelle (hors périmètre SXO, voir audit performance séparé).
- Score /100 basé sur la grille interne à 7 dimensions du skill SXO, distinct de tout score SEO technique.

---

Prochaine étape suggérée : `/seo content` pour combler les gaps E-E-A-T (avis, décennale) et `/seo schema` pour ajouter `Review`/`AggregateRating`.
