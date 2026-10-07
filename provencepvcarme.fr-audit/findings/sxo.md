# Audit SXO — provencepvcarme.fr (site live, 13 pages)

**SXO Gap Score : 77/100** (distinct du SEO Health Score) — précédent audit (20260928, 4 pages via localhost, DNS non résolu à l'époque) : **69/100**.

| Dimension | Score | Max | Δ vs précédent |
|---|---|---|---|
| Adéquation type de page (Page Type) | 14 | 15 | +1 |
| Profondeur de contenu | 11 | 15 | +2 |
| Signaux UX | 12 | 15 | +1 |
| Schema.org | 13 | 15 | +1 |
| Média | 14 | 15 | +2 |
| Autorité / preuve sociale | 5 | 15 | -1 |
| Fraîcheur | 8 | 10 | +2 |

Pages auditées (13/13 du sitemap, en live via `https://provencepvcarme.fr`) : `index.html`, `methode.html`, `realisations.html`, `contact.html`, `mentions-legales.html`, `confidentialite.html`, et les 7 pages de zone (`pose-membrane-pvc-arme-{avignon,orange,marseille,pierrelatte,valence,montpellier,aix-en-provence}.html`). Le site est désormais résolu en HTTP 200 (hébergé sur GitHub Pages, `Last-Modified` du jour), ce qui permet pour la première fois un audit SXO complet sur l'ensemble du périmètre plutôt que sur 4 pages locales.

---

## Vue d'ensemble : corrigé / toujours ouvert / nouveau

### Corrigé depuis le dernier audit
- **FAQ courte → FAQ approfondie (7 questions)** : `index.html#faq` est passée de 3 à 7 questions (définition, durée de vie, rénovation, norme NF T54-804, justification de l'absence de prix, délai de devis, durée de chantier), avec schema `FAQPage` complet. *(ancien Finding 7, LOW)*
- **"Contenu local en accordéon" promis mais absent → remplacé par une solution supérieure** : au lieu d'un accordéon départemental, le site a livré **7 pages de zone dédiées** (Avignon, Orange, Pierrelatte, Valence, Marseille, Montpellier, Aix-en-Provence), chacune avec H1 unique, lede localisée, schema `Service` (`areaServed` = la ville), `BreadcrumbList`, mini-FAQ locale (2 questions par ville, différentes d'une ville à l'autre) et maillage "voir aussi" vers les villes voisines. C'est un meilleur pattern SXO qu'un accordéon : il crée de vraies pages indexables par ville plutôt qu'un contenu replié en JS. *(ancien Finding 3, HIGH — largement dépassé)*

### Toujours ouvert
- **Aucune preuve sociale tierce (avis, notes Google, témoignages)** — *(ancien Finding 1, HIGH → maintenu HIGH)*
- **Aucune mention d'assurance décennale** sur aucune des 13 pages, alors que la couverture décennale est **légalement obligatoire** pour tout chantier de piscine (construction/rénovation) en France — *(ancien Finding 2, HIGH → maintenu HIGH, voir aussi le nouveau Finding ci-dessous qui aggrave ce point)*
- **Aucune fourchette de prix, même indicative** — la nouvelle FAQ "Pourquoi n'y a-t-il pas de prix affiché ?" explique honnêtement la logique (bassins tous différents, refus du prix d'appel trompeur), ce qui réduit la frustration par rapport à un silence pur et simple, mais ne donne toujours aucun repère chiffré alors que le SERP informationnel ("prix liner armé", "guide-piscine.fr", "prix-pose.com") répond frontalement à cette requête — *(ancien Finding 4, MEDIUM → maintenu MEDIUM, sévérité perçue légèrement adoucie par la transparence de la FAQ)*
- **`realisations.html` reste pauvre en récit de chantier** : 124 mots au total, 4 paires avant/après avec légende d'une ligne (ville + finition), galerie "coulisses" de 7 photos sans texte. Aucune donnée de contexte (surface du bassin, durée réelle, problème initial) malgré le nouveau hero photo — *(ancien Finding 5, MEDIUM → maintenu MEDIUM)*
- **Pas de carte interactive ni de lien "itinéraire" sur `contact.html`** — la page la plus proche de la conversion n'a toujours qu'un bloc texte ("infos pratiques" en onglets), pas de `<iframe>` Google Maps ni de lien "voir l'itinéraire". Une carte de France stylisée (SVG, non géolocalisée précisément) a bien été ajoutée sur `index.html#zones`, ce qui est un bon complément visuel mais ne remplace pas un outil fonctionnel sur la page Contact — *(ancien Finding 6, MEDIUM → maintenu MEDIUM, partiellement compensé)*

### Nouveau problème
- **CRITICAL — Numéro SIRET non renseigné, placeholder visible en production** : `mentions-legales.html` ligne 85 affiche littéralement `Numéro SIRET : [SIRET À COMPLÉTER]` (avec un commentaire HTML `<!-- TODO: ajouter SIRET -->` juste au-dessus), sur une page datée "Dernière mise à jour : 24 août 2026" — donc restée en l'état pendant plus d'un mois de développement actif du site (multiples commits sur les autres pages entre-temps). Pour un persona "Décideur averse au risque" qui vérifie la légitimité de l'entreprise avant un engagement de plusieurs milliers d'euros — comportement typique avant un chantier de piscine — tomber sur un placeholder non complété sur la page légale est le pire signal possible : cela suggère un site inachevé ou une entreprise peu rigoureuse, à l'exact moment où l'utilisateur cherche à se rassurer. C'est aussi une non-conformité légale (le SIRET est obligatoire dans les mentions légales d'un auto-entrepreneur en France). Ce problème n'existait pas dans le scope du précédent audit (qui ne couvrait pas `mentions-legales.html`).
  **Recommandation :** corriger en urgence — ajouter le vrai numéro SIRET. Priorité plus haute que n'importe quel autre chantier SXO de cette liste : c'est un correctif de quelques minutes avec un risque de dissuasion élevé s'il reste en l'état.
- **LOW — Copy du hero `realisations.html` suppose une interaction tactile** : "Touchez une photo pour voir le résultat" — formulation orientée mobile/tactile alors qu'une partie du trafic desktop utilisera la souris (le bouton fonctionne au clic, mais le mot "touchez" peut créer une légère confusion ou donner une impression moins universelle). Correctif simple : "Cliquez sur une photo..." ou une formulation neutre ("Sélectionnez une photo...").
- **INFO (positif) — Bonne gestion de la dissonance distance/faisabilité sur les villes hors rayon** : les pages Marseille, Montpellier et Aix-en-Provence assument explicitement d'être "à la limite" ou "au-delà" du rayon d'intervention, avec un CTA adapté au stade de parcours ("Vérifier la faisabilité de votre projet à Marseille" plutôt que "Demander un devis gratuit"). C'est un signal de transparence qui sert la confiance plutôt que de la desservir — bonne pratique à ne pas casser en généralisant un CTA unique sur toutes les pages de zone.

---

## 1. Analyse SERP et adéquation du type de page

Recherches effectuées : *"PVC armé Montélimar piscine"*, *"pose membrane PVC armé Avignon piscine"*, *"liner armé piscine prix"*, *"PVC armé / liner armé piscine avis clients"*.

Le SERP pour ce secteur (pose de membrane PVC armée / liner armé pour piscines, Sud-Est France) confirme la même structure qu'au précédent audit, avec un signal supplémentaire important :

- **Service/Local Pages d'entreprises régionales** : piscine-o-jardin.fr, fusionpiscine.fr, betex-piscine-vaucluse.fr, aquapro-piscine.fr, provencepiscines.com, jean-pierre-piscine.fr, pvc-arme.com. Signal notable : **fusionpiscine.fr utilise exactement le pattern que Provence PVC Armé vient d'adopter** — une page dédiée par ville/commune ("Membrane piscine Avignon", "Membrane piscine Villeneuve-lès-Avignon", "Membrane piscine Morières-lès-Avignon"...). Cela confirme que la stratégie de pages de zone est alignée sur ce que Google récompense déjà pour ce cluster de requêtes locales.
- **Guides informationnels** répondant en priorité au prix et à la comparaison ("Prix d'un liner armé pour piscine : tarifs au m²" — guide-piscine.fr ; "Prix pose liner armé piscine" — lamipose-liner-arme.fr ; "Différence de prix entre liner et PVC armé" — manouvellepiscine.com). Ces pages captent une intention amont ("combien ça coûte avant même d'appeler quelqu'un") que le site cible ne capte que partiellement (justification de l'absence de prix, sans fourchette).
- **Confirmation d'un cluster de confiance légale distinct** : la recherche "rénovation piscine assurance décennale obligatoire" retourne exclusivement des pages juridiques/assurance (village-justice.com, april.fr, reassurez-moi.fr) confirmant que c'est une requête à part entière, à fort enjeu ("interdiction de démarrer un chantier sans décennale", sanctions pénales) — un signal PAA/informationnel clair que le site ne couvre sur aucune page.

**Type dominant SERP : Service Page + Local Page (NAP, zone de chalandise, pages par ville), avec sous-intention informationnelle forte sur le prix et la confiance légale (décennale, avis).**

**Classification de la cible (taxonomie) :** Hybrid Service Page + Local Page — hero/CTA (traits Landing), méthodologie avec schema `HowTo` et tableau comparatif (traits Service Page), 7 pages `Service` géolocalisées par ville + `GeneralContractor` schema + carte schématique (traits Local Page).

**Verdict de correspondance : ALIGNÉ, renforcé par rapport au précédent audit.** Le passage d'une simple liste de villes en tags plats à 7 pages de zone dédiées avec schema `Service`/`areaServed` par ville comble exactement l'écart structurel identifié précédemment, et reproduit le pattern gagnant observé chez un concurrent direct (fusionpiscine.fr). Il n'y a donc **aucun mismatch de type de page à corriger** — le problème central reste, comme avant, un déficit d'**autorité perçue / preuve tierce**, aggravé cette fois par un défaut de forme (placeholder SIRET) qui mine directement la confiance sur la page légale.

---

## 2. "PVC armé" vs "liner armé" dans les balises `<title>` — verdict SXO

**Décision validée par les données SERP.** Les concurrents directs sur ce marché régional utilisent tous "PVC armé" en priorité dans leurs pages/titres — confirmé à nouveau cette session avec **jean-pierre-piscine.fr** ("Spécialistes de la pose PVC Armé — Vaucluse") et **pvc-arme.com** ("Pose LINER PVC armé piscines en région PACA") qui met "PVC armé" en position dominante malgré son propre nom de domaine contenant "pvc-arme". Le choix de titrer en "PVC armé" et de conserver "liner armé" comme synonyme en meta description et dans le corps de texte est donc cohérent avec l'intention de recherche dominante identifiée sur le marché régional, sans sacrifier la requête secondaire :
- `methode.html` : "c'est ce qu'on appelle aussi la pose de liner armé" (glissé naturellement dans le texte du H2 "Le matériau en quelques repères")
- `pose-membrane-pvc-arme-avignon.html` : "membranes PVC armées — aussi appelées liner armé" dans le lede du H1
- Toutes les meta descriptions des pages de zone incluent "(liner armé)" entre parenthèses juste après "PVC armée"

**Aucune cannibalisation détectée** entre les deux formulations : un seul jeu de balises `<title>` par page, la variante "liner armé" n'apparaît jamais en H1 ni en title, uniquement en synonyme contextuel. Ce point est **INFO / bonne pratique**, pas une action requise.

---

## 3. Les pages villes répondent-elles à l'intention locale ?

**Oui, globalement bien — avec un gradient de qualité selon la proximité.**

- **Villes proches (Avignon, Orange, Pierrelatte, Valence)** : contenu unique et crédible — Avignon référence un vrai chantier documenté (photo réelle "après-3.jpg", finition "Authentic" identifiable), la lede indique un temps de trajet précis (~1h), le mini-FAQ pose des questions spécifiques au secteur. Bon niveau de spécificité pour l'intention locale "pose membrane PVC armé [ville]".
- **Villes en limite/hors rayon (Marseille, Montpellier, Aix-en-Provence)** : contenu honnête sur la limite de couverture ("étudié au cas par cas"), CTA ajusté au stade de parcours (vérification de faisabilité plutôt que devis ferme), argument technique adapté au contexte local (résistance aux UV du "littoral méditerranéen" pour Marseille). C'est un bon exemple d'alignement persona/stade de parcours — voir Finding INFO positif ci-dessus.
- **Limite commune à toutes les pages de zone** : aucune n'intègre de carte, d'avis clients localisés, ni de schema `LocalBusiness`/`ProfessionalService` dédié à la ville (elles pointent toutes vers `Service` + `#business` générique) — cohérent avec le gap Autorité identifié plus haut, simplement décliné ville par ville.
- **Risque de contenu proche-dupliqué à surveiller** : la structure (intro > photo/texte > CTA > mini-FAQ > "voir aussi") est identique sur les 7 pages, avec un delta de contenu réel d'environ 250-400 mots uniques par page — suffisant pour être indexable sans pénalité de duplication mais à surveiller si de nouvelles villes sont ajoutées sans renforcer la spécificité (ex. mentionner des quartiers, copropriétés avec piscine collective, salinité de l'eau locale, etc.).

---

## 4. Le nouveau hero photo de `realisations.html` sert-il l'intention de la page ?

**Partiellement.** La page est passée d'un hero probablement textuel (non observé, hors scope de l'audit précédent) à un hero plein écran avec une vraie photo "après" (Poët-Laval, finition PVC vert olive), overlay de lecture, breadcrumb et lede orientée interaction ("Touchez une photo pour voir le résultat"). C'est cohérent avec l'intention de la page — preuve visuelle avant conversion, page de type "case studies" attendue par la taxonomie Service Page — et une nette amélioration esthétique par rapport à un hero purement textuel.

**Ce qui manque pour que le hero serve pleinement la conversion :**
- **Aucun chiffre de preuve sociale en overlay** (ex. "40+ piscines rénovées", "5 ans d'expérience" — repris des badges de `index.html`) : le hero est une belle photo, mais une photo seule ne raconte pas l'ampleur de l'activité.
- **Le pattern d'interaction "avant/après tactile" n'est pas teasé dans le hero lui-même** : il apparaît seulement dans la section qui suit. Un slider avant/après directement dans le hero (au lieu d'une photo "après" statique) aurait immédiatement démontré la mécanique de preuve visuelle dès le premier écran, plutôt que de la découvrir après un scroll.
- Le copy "Touchez" suppose une interaction tactile — voir Finding LOW ci-dessus.

Verdict : bon choix directionnel, exécution correcte mais encore générique — voir Finding 5 (récit de chantier) et le point ci-dessus pour les prochaines itérations.

---

## 5. User stories dérivées du SERP

1. **En tant que** décideur averse au risque (chantier à plusieurs milliers d'euros, irréversible), **je veux** vérifier que l'entreprise est légalement en règle et couverte par une assurance décennale avant de laisser mes coordonnées, **parce que** je sais que ce chantier peut légalement engager ma responsabilité si le prestataire n'est pas couvert, **mais je suis bloqué par** l'absence totale de mention "assurance décennale" sur les 13 pages **et** par un placeholder `[SIRET À COMPLÉTER]` visible sur la page légale que je consulte justement pour vérifier le sérieux de l'entreprise — *(source : recherche "assurance décennale piscine obligatoire" confirmant un cluster de requêtes légales à fort enjeu ; finding nouveau CRITICAL sur `mentions-legales.html`)*.
2. **En tant qu'**acheteur sensible au prix qui compare plusieurs prestataires avant d'appeler, **je veux** une fourchette de budget même large, **parce que** je veux éliminer les devis hors budget sans perdre de temps au téléphone, **mais je suis bloqué par** l'absence de tout repère chiffré, malgré une FAQ qui explique honnêtement pourquoi — *(source : guide-piscine.fr, prix-pose.com, lamipose-liner-arme.fr dominent le SERP informationnel sur "prix liner armé")*.
3. **En tant qu'**habitant de Marseille, Montpellier ou Aix-en-Provence, **je veux** savoir rapidement si l'entreprise se déplace vraiment chez moi avant de remplir un formulaire, **parce que** je ne veux pas perdre de temps sur une demande hors zone, **et cette fois je ne suis PAS bloqué** : la page dédiée répond immédiatement et honnêtement ("étudié au cas par cas"), avec un CTA adapté — *(source : Finding "Corrigé", ex-Finding 3 ; bon exemple à documenter)*.
4. **En tant que** propriétaire de piscine dégradée comparant liner classique et PVC armé, **je veux** un comparatif chiffré clair (durée de vie, épaisseur, résistance), **parce que** je ne veux pas refaire les travaux dans 8 ans, **et je suis globalement bien servi** par le tableau comparatif de `methode.html`, même s'il n'est pas teasé sur `index.html` en dehors de la FAQ — *(source : tableau `compare-table` sur `methode.html`, articles "avantages/inconvénients" bien classés sur le SERP)*.
5. **En tant que** propriétaire proche (Avignon, Orange, Pierrelatte) prêt à démarrer rapidement, **je veux** voir un exemple concret réalisé près de chez moi et pouvoir appeler en un geste, **parce que** je suis déjà en phase de décision, **et je suis bien servi** : page dédiée, vraie photo de chantier local, CTA double (appel + formulaire), bandeau CTA mobile sticky — *(source : `pose-membrane-pvc-arme-avignon.html`, mobile-cta-bar présente sur toutes les pages)*.

Ces 5 user stories couvrent 3 stades de parcours : *awareness* (story 1, vérification légitimité), *consideration* (stories 2 et 4, comparaison prix/matériau), *decision* (stories 3 et 5, passage à l'action).

---

## 6. Personas (dérivés des signaux SERP)

| Persona | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| Chercheur "assurance décennale / légitimité légale" | 6/25 | 5/25 | 5/25 | 10/25 | 26/100 | Mismatch critique |
| Décideur averse au risque (gros budget) | 16/25 | 18/25 | 8/25 | 17/25 | 59/100 | À travailler |
| Acheteur sensible au prix | 18/25 | 14/25 | 15/25 | 18/25 | 65/100 | Bon mais fragile |
| Comparateur technique (liner vs PVC armé) | 23/25 | 21/25 | 17/25 | 17/25 | 78/100 | Bon |
| Habitant hors rayon (Marseille/Montpellier/Aix) | 22/25 | 22/25 | 19/25 | 22/25 | 85/100 | Excellent |
| Chercheur local proche prêt à agir (Avignon/Orange/Pierrelatte) | 23/25 | 22/25 | 17/25 | 23/25 | 85/100 | Excellent |

### Persona le plus faible : Chercheur "assurance décennale / légitimité légale" (26/100)
**Problème principal :** aucune des 13 pages ne mentionne l'assurance décennale, et la page légale que ce persona consulte précisément pour vérifier la légitimité affiche un placeholder SIRET non complété.
**Correctif recommandé :** (1) compléter le SIRET immédiatement sur `mentions-legales.html` — correctif prioritaire, quelques minutes ; (2) ajouter un badge "Assuré décennale" (avec numéro de police si disponible) dans la rangée `trust-badges-row` d'`index.html`, aux côtés de la norme NF T54-804 et de la garantie fabricant ; (3) ajouter une question FAQ dédiée ("Êtes-vous couvert par une assurance décennale ?").

### Persona secondaire le plus faible : Décideur averse au risque (59/100)
**Problème principal :** badges de confiance présents mais 100% auto-déclarés par l'entreprise, aucun tiers de confiance (avis Google, témoignage nommé, schema `Review`/`AggregateRating`).
**Correctif recommandé :** ajouter un bloc "Avis clients" sur `index.html` avec 3-5 témoignages nommés (prénom + ville + type de projet) et un lien vers la fiche Google Business Profile si elle existe, avec schema `AggregateRating` lié à l'entité `GeneralContractor` (`@id": "https://provencepvcarme.fr/#business"`).

### Problèmes systémiques
- **Dimension Trust** : c'est la dimension la plus faible sur presque tous les personas (5 à 19/25) — le déficit d'autorité tierce touche transversalement le décideur à risque, le chercheur décennale et, dans une moindre mesure, le comparateur technique.
- **Dimension Clarity** pour le persona prix : l'info existe (FAQ) mais n'est pas visible dès le premier écran ni reprise ailleurs (pas de teaser "voir la fourchette de prix" depuis le hero ou le CTA final).

### Actions prioritaires (triées par persona le plus faible)
1. Compléter le SIRET sur `mentions-legales.html` (persona "chercheur décennale/légitimité" — correctif immédiat, risque de dissuasion élevé).
2. Ajouter une mention d'assurance décennale visible (badge + FAQ) sur `index.html`, `methode.html`, `contact.html` (persona "chercheur décennale" + "décideur averse au risque").
3. Ajouter 3-5 avis clients nommés + schema `Review`/`AggregateRating` sur `index.html` (persona "décideur averse au risque").
4. Ajouter une fourchette de prix indicative (ex. "à partir de X €/m²") en complément de la FAQ existante (persona "acheteur sensible au prix").
5. Enrichir `realisations.html` avec 2-3 lignes de contexte par chantier (surface, durée réelle, problème initial résolu) et envisager un slider avant/après dans le hero (persona "comparateur technique" + qualité générale de la page Réalisations).

---

## 7. Limitations

- SERP consulté via WebSearch générique (résultats non géolocalisés depuis la position exacte de l'entreprise), sans accès direct au pack local Google ni à la fiche Google Business Profile — impossible de confirmer si une fiche GBP existe et si elle contient déjà des avis (ce qui changerait le diagnostic du Finding "aucune preuve sociale").
- Analyse basée sur le rendu HTML brut (`render_page.py --mode auto`, aucune page détectée comme SPA) et lecture directe du code source des 13 fichiers HTML du dépôt local — cohérent avec le contenu servi en production (vérifié via `parse_html.py` sur les URLs live), mais sans vérification du comportement JS runtime (formulaire AJAX Formspree, animations GSAP/Lenis, scène 3D `membrane-scene.js`) ni de capture d'écran visuelle du rendu final.
- `confidentialite.html` n'a pas été analysée en détail (hors périmètre SXO prioritaire, contenu principalement juridique).
- Pas de vérification des Core Web Vitals ni de l'expérience mobile réelle (hors périmètre SXO, voir audit performance séparé si disponible).
- Le score de positionnement réel "1ère position sur PVC armé Montélimar" rapporté par le propriétaire n'a pas pu être vérifié indépendamment (recherches WebSearch non géolocalisées) ; il est pris comme acquis pour ce cadrage.
- Score /100 basé sur la grille interne à 7 dimensions du skill SXO, distincte de tout score SEO technique.

---

Prochaines étapes suggérées :
- `/seo content` pour combler le gap E-E-A-T (avis, décennale, récits de chantier sur `realisations.html`).
- `/seo schema` pour ajouter `Review`/`AggregateRating` lié à l'entité `GeneralContractor`.
- Correctif indépendant hors scope SEO/SXO mais urgent : compléter le SIRET sur `mentions-legales.html` (action technique simple, pas un chantier de contenu).

Générer un rapport PDF ? Utilisez `/seo google report`.
