# Audit Contenu SEO — Provence PVC Armé
**Score global : 52/100**

Pages auditées (lecture directe des fichiers, site servi sur http://localhost:8804) : `index.html`, `methode.html`, `realisations.html`, `contact.html`, `mentions-legales.html`, `confidentialite.html`.

---

## 1. Finding critique — SIRET toujours en placeholder

**Sévérité : Critique**

`mentions-legales.html` (lignes 85-86) affiche toujours :
```html
<!-- TODO: ajouter SIRET -->
<li>Numéro SIRET : [SIRET À COMPLÉTER]</li>
```
Le SIRET n'a **pas été renseigné** malgré la refonte récente. Pour un auto-entrepreneur exerçant une activité de travaux (BTP), le numéro SIRET est une mention légale obligatoire (art. 111-2 et R.123-237 du Code de commerce). Cette lacune est visible publiquement sur une page indexable et constitue un signal de **Trustworthiness négatif direct** (30% du score E-E-A-T interne) : un visiteur, un vérificateur ou un crawler qui la lit voit littéralement « À COMPLÉTER ».

**Recommandation :** renseigner le SIRET réel avant la prochaine publication. Si l'immatriculation est en cours, remplacer temporairement par une formulation transparente (« Immatriculation en cours — SIRET communiqué sur demande ») plutôt que laisser un texte de type TODO visible en production.

---

## 2. Finding — Contenu local par département : signal beaucoup plus faible qu'annoncé

**Sévérité : Élevée**

Le brief mentionne un « accordéon Drôme/Ardèche/Vaucluse/Gard/Isère » avec du contenu local par ville. Vérification faite (grep + lecture complète d'`index.html`) : **il n'existe aucun accordéon**. Les 5 départements n'apparaissent que :
- dans le tableau `areaServed` du JSON-LD (liste plate, non visible pour l'utilisateur) ;
- dans une simple rangée de pastilles textuelles (`.zones-list`) sans description, sans villes par département, sans contenu unique — section « Zones d'intervention » (lignes 364-415).

Le texte visible autour de la carte SVG (`section-lede`, ~80 mots) est le **seul** contenu rédactionnel de la section : une phrase générique couvrant les 5 départements sans détail spécifique par zone (pas de mention de villes précises pour l'Ardèche, le Gard ou l'Isère par exemple, contrairement à la Drôme/Vaucluse citées dans le corps du texte).

**Impact :** si l'objectif SEO est de couvrir les recherches locales par département (ex. « pose PVC armé Ardèche »), le contenu actuel est **thin** — une liste de noms de lieux n'apporte pas de couverture topique réelle et présente un risque de contenu "programmatique" perçu comme faible valeur si dupliqué sur d'autres pages sans texte différenciant (cf. sous-skill `seo-programmatic` si des pages dédiées par département sont créées).

**Recommandation :** soit ajouter un vrai accordéon avec 2-4 phrases uniques par département (villes desservies, spécificités de terrain, exemples de chantiers locaux), soit ajuster la communication interne pour refléter l'état réel (simple liste de zones, pas de contenu local approfondi).

---

## 3. Finding — Contenu sous le seuil minimum (word count)

**Sévérité : Élevée (methode.html, realisations.html)**

Comptage des mots visibles (hors `<script>`/`<style>`, y compris nav/footer répétés sur chaque page — donc le contenu réellement unique est encore inférieur à ces chiffres) :

| Page | Type | Mots comptés | Seuil recommandé | Statut |
|---|---|---|---|---|
| index.html | Homepage | ~620 | 500 | OK, mais marge faible une fois le chrome (nav/footer ~70 mots) retiré |
| methode.html | Service page | ~456 | 800 | **Sous le seuil (-43%)** |
| realisations.html | Galerie/portfolio | ~182 | — (pas de seuil strict, mais quasi entièrement composé de légendes photo) | **Très thin**, aucun texte narratif |
| contact.html | Contact/conversion | ~281 | — | Acceptable pour ce type de page |

`methode.html` est la page qui devrait porter le plus de profondeur E-E-A-T (méthode, matériau, comparatif liner/PVC armé) mais reste sous le plancher recommandé pour une service page malgré la fusion récente de la section matériau. `realisations.html` repose presque uniquement sur des légendes courtes (« La Motte-Chalancon · PVC Pierre de Bali ») sans paragraphe expliquant le contexte du chantier, les défis rencontrés ou le résultat — alors que c'est la page la mieux placée pour démontrer une **Expérience** de premier ordre.

**Recommandation :** ajouter sur `realisations.html` 2-3 phrases par chantier (contexte, défi technique, finition choisie) et étoffer `methode.html` avec un paragraphe FAQ technique supplémentaire ou une section « erreurs fréquentes / questions techniques » pour dépasser 800 mots de contenu utile, sans remplissage artificiel.

---

## 4. Finding — Absence de preuve sociale (avis clients / témoignages)

**Sévérité : Moyenne**

Aucune des pages auditées ne contient d'avis client, de note Google, de témoignage nominatif ou de schema `Review`/`AggregateRating`. C'est le principal point faible du facteur **Authoritativeness** (25%) : les seuls signaux de crédibilité externes sont les logos fournisseurs (Renolit, Fluidra, Maytronics, etc.), qui attestent de partenariats matériel mais pas de la qualité perçue par les clients.

**Recommandation :** ajouter 3-5 témoignages clients (avec prénom + ville, cohérent avec les chantiers déjà présentés) et/ou intégrer un lien vers les avis Google, avec le schema `AggregateRating` correspondant si le volume d'avis le permet.

---

## 5. Finding — Incohérence entre deux promesses de garantie

**Sévérité : Moyenne**

`index.html` affiche deux garanties différentes sans les relier ni les expliquer :
- Section « Pourquoi nous choisir » (ligne 201-202) : « Garantie étanchéité sur la pose » (garantie de mise en œuvre, décennale/parfait achèvement).
- Section badges de confiance (ligne 233, 240-243) : badge SVG « Garantie fabricant 10 ans » (garantie produit du fabricant de membrane).

Rien dans le texte ne précise que ce sont deux garanties distinctes (pose vs matériau) ni leurs conditions. Pour un investissement piscine (souvent plusieurs milliers d'euros), une promesse de garantie ambiguë est un signal de **Trustworthiness** défavorable — un rater QRG ou un visiteur méfiant peut le lire comme une exagération marketing non étayée.

**Recommandation :** ajouter une phrase de clarification (ex. dans la FAQ ou en note sous les badges) : « Garantie fabricant de 10 ans sur la membrane + garantie d'étanchéité de notre pose, conditions détaillées lors du devis. »

---

## 6. Finding — Aucun signal d'expertise/auteur affiché sur le site public

**Sévérité : Moyenne**

Enzo Oddon n'est identifié nulle part sur les pages publiques (accueil, méthode, réalisations) comme responsable/expert — son nom n'apparaît que dans `mentions-legales.html` (obligation légale), pas dans une bio, une section « qui sommes-nous » ou un « à propos ». Le badge « 5+ ans d'expérience » est le seul signal d'expertise humaine visible, sans contexte (formation, certification individuelle, parcours).

**Recommandation :** ajouter un court encart « qui pose votre membrane » avec photo, prénom, nombre de chantiers réalisés, éventuelle formation/habilitation — renforce Expertise et Experience simultanément.

---

## 7. Points positifs (E-E-A-T et readiness IA)

- **Structured data solide** : `GeneralContractor` (NAP complet, géoloc, `hasCredential` NF T54-804) répliqué de façon cohérente sur toutes les pages, `FAQPage` (3 Q/R factuelles et citables) sur l'accueil, `HowTo` (4 étapes claires) sur `methode.html`, `BreadcrumbList` sur les pages internes. Bonne base pour l'AI citation readiness.
- **Fraîcheur** : `mentions-legales.html` et `confidentialite.html` affichent la même date de mise à jour cohérente (« 12 août 2026 »), copyright 2026 cohérent en pied de page.
- **Faits vérifiables et citables** : épaisseur 150/100e vs liner 75/100e, durée de vie 15-25 ans vs 8-10 ans, délai de réponse devis <24h — ce sont des données chiffrées, spécifiques, bien formulées pour une extraction par un LLM ou un featured snippet.
- **Signaux d'expérience de premier plan (photos)** : avant/après nommés par ville réelle (La Motte-Chalancon, Pont-de-Barret, Avignon, Poët-Laval) et section « Coulisses du chantier » avec photos de process localisées (Saint-Restitut, Dieulefit, Grignan) — bon socle, mais sous-exploité faute de texte d'accompagnement (cf. finding 3).
- **Mots-clés naturels** : titres et meta descriptions bien ciblés (« PVC armé », « thermosoudage », « Montélimar ») sans bourrage, densité raisonnable.
- **Politique de confidentialité RGPD claire**, base légale, durée de conservation précisée (12 mois), engagement explicite de non-usage commercial des photos clients sans accord — bon signal de transparence.

---

## Score AI Citation Readiness : 68/100

Points forts : FAQPage + HowTo + LocalBusiness schema cohérents et factuellement corrects, hiérarchie de titres claire (h1 > h2 > h3), réponses FAQ auto-suffisantes (répondent à la question sans dépendre du contexte visuel).
Points faibles : pas de schema `Review`/`AggregateRating`, pas de schema `Person`/auteur, contenu factuel concentré sur 3 questions FAQ seulement (pourrait être étendu), page `realisations.html` quasiment vide de texte donc rien à citer pour un LLM au-delà des légendes.

---

## Breakdown E-E-A-T (modèle de pondération interne à cette skill)

| Facteur | Poids | Score | Justification courte |
|---|---|---|---|
| Experience | 20% | 55/100 | Photos avant/après réelles, lieux nommés, mais aucun texte de contexte/récit de chantier |
| Expertise | 25% | 45/100 | Contenu technique précis et cohérent, mais aucune bio/auteur affiché publiquement |
| Authoritativeness | 25% | 30/100 | Aucun avis client, aucune presse/mention externe, seulement des logos fournisseurs |
| Trustworthiness | 30% | 45/100 | NAP + pages légales RGPD présentes, MAIS SIRET placeholder visible + promesse de garantie ambiguë |
| **Pondéré** | | **≈43/100** | |

Score contenu global (43 E-E-A-T pondéré + bonus structured data/fraîcheur/mots-clés, pénalité word-count) : **52/100**.

---

## Recommandations prioritaires (ordre d'impact)

1. **Critique** — Renseigner le vrai SIRET dans `mentions-legales.html` (ou formulation transparente temporaire).
2. **Élevée** — Étoffer `realisations.html` avec un paragraphe par chantier (contexte, défi, résultat) : gain direct Experience + word count.
3. **Élevée** — Clarifier l'écart entre l'annonce d'un accordéon départemental et la réalité (liste plate) : soit développer un vrai contenu par département, soit documenter l'écart pour les prochains audits.
4. **Élevée** — Porter `methode.html` au-delà de 800 mots utiles (FAQ technique, section erreurs fréquentes).
5. **Moyenne** — Ajouter avis clients / témoignages + schema `AggregateRating`.
6. **Moyenne** — Clarifier la double promesse de garantie (pose vs fabricant).
7. **Moyenne** — Ajouter un encart « qui pose votre membrane » (bio Enzo Oddon) sur l'accueil ou une page dédiée.

---

*Méthodologie : lecture directe des fichiers HTML locaux (pas de rendu Playwright), comptage de mots par suppression regex des balises `<script>`/`<style>`/HTML (les totaux incluent donc le chrome nav/footer répété sur chaque page, environ 60-80 mots — le contenu unique réel est inférieur aux chiffres indiqués). SIRET vérifié par lecture ligne à ligne de `mentions-legales.html`.*
