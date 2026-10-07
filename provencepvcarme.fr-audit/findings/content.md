# Audit Contenu SEO — Provence PVC Armé

**Score global contenu : 60/100** (précédent : 52/100, dont un sous-score E-E-A-T pondéré de 43/100 — c'est ce 43/100 qui était cité comme référence la plus basse)

Méthodologie : lecture du site **live** (https://provencepvcarme.fr, HTTP 200, `Last-Modified: Mon, 28 Sep 2026` — déploiement du jour) via le renderer partagé (`render_page.py --mode never`, fetch brut, pas de rendu JS nécessaire — site statique). 13 pages du sitemap auditées : `/`, `/methode.html`, `/realisations.html`, `/contact.html`, `/mentions-legales.html`, `/confidentialite.html`, + 7 pages ville (Avignon, Orange, Marseille, Pierrelatte, Valence, Montpellier, Aix-en-Provence). Comptage de mots par extraction du contenu de `<main>` (hors nav/footer/script/style). `methode-1.html` et `css/style-1.css` ignorés (brouillons non déployés, absents du sitemap live).

---

## Corrigé depuis le dernier audit

1. **Liens légaux morts (`href="#"`) → corrigés.** `mentions-legales.html` et `confidentialite.html` sont de vraies pages, liées depuis le footer de **toutes** les pages échantillonnées (accueil, contact, méthode, réalisations, pages ville). Aucun `href="#"` résiduel trouvé.
2. **FAQ superficielle (3 questions) → largement étoffée.** La FAQ de l'accueil compte désormais **7 questions** avec des réponses de 130 à 190 mots chacune, factuelles et bien sourcées (norme NF T54-804, épaisseurs 150/100e vs 75/100e, durée de vie 15-25 ans vs 8-10 ans, justification de l'absence de prix affiché). Le schéma `FAQPage` correspond mot pour mot au HTML visible — bon point pour la citation IA.
3. **Aucun repère tarifaire, même indicatif → partiellement corrigé.** Toujours aucun prix chiffré, mais une nouvelle question FAQ dédiée (« Pourquoi n'y a-t-il pas de prix affiché sur le site ? ») explique la logique du devis personnalisé de façon transparente plutôt que de laisser un vide. C'est un signal de confiance appréciable, mais ce n'est pas un repère tarifaire — l'écart avec la checklist QRG reste partiel.
4. **Contenu local par zone « thin » (simple liste de pastilles) → résolu par une approche différente et meilleure.** Le rapport précédent réclamait un accordéon départemental ; l'équipe a plutôt créé **7 pages ville dédiées** (Avignon, Orange, Marseille, Pierrelatte, Valence, Montpellier, Aix-en-Provence), chacune avec 350-474 mots **réellement uniques** : distance précise depuis Montélimar, statut (zone cœur vs « étudié au cas par cas » au-delà du rayon habituel), chantier réel nommé quand disponible (Avignon : piscine neuve finition Authentic ; Orange : fond diamant gris clair ; Aix : finition granit grey), et mini-FAQ de 2 questions propre à chaque ville (non dupliquée mot pour mot d'une page à l'autre). La transparence sur les limites de zone (« nous préférons rester transparents sur cette limite plutôt que de promettre une couverture que nous ne pourrions pas tenir » — Marseille/Montpellier/Aix) est un bon signal de Trustworthiness.
5. **Portfolio `realisations.html` sans profondeur → non résolu sur cette page, mais compensé ailleurs.** Voir « Toujours ouvert » ci-dessous : la page elle-même n'a pas changé de fond, mais les pages ville apportent désormais le contexte narratif qui manquait (défi technique, type de chantier) pour 3 des 4 chantiers photographiés.
6. **Ambiguïté entre garantie fabricant et garantie de pose → clarifiée en partie.** Le badge de confiance porte désormais explicitement le libellé « Garantie **fabricant** » (10 ans), distinct de la carte « Garantie étanchéité **sur la pose** ». Les deux promesses sont mieux différenciées lexicalement qu'avant, même s'il n'existe toujours pas de phrase unique qui les relie explicitement (cf. « Toujours ouvert »).
7. **Politique de confidentialité et mentions légales référencées mutuellement.** Chaque page légale renvoie vers l'autre via une section « Voir aussi » — bon point de navigation/transparence.

---

## Toujours ouvert

### Critique

**1. SIRET toujours en placeholder visible sur une page publique indexable.**
`mentions-legales.html` (ligne 84-85 du HTML live) affiche **littéralement** :
```html
<!-- TODO: ajouter SIRET -->
<li>Numéro SIRET : [SIRET À COMPLÉTER]</li>
```
Vérifié directement sur le site live (`https://provencepvcarme.fr/mentions-legales.html`, HTTP 200) — **identique** à l'audit précédent malgré ~20 commits sur le repo depuis, dont plusieurs touchant les pages légales (favicon, rayon d'intervention). C'est une obligation légale pour un auto-entrepreneur exerçant une activité de travaux BTP (art. 111-2 et R.123-237 du Code de commerce), et un signal de Trustworthiness très négatif : n'importe quel visiteur, vérificateur ou crawler qui lit la page voit un texte « À COMPLÉTER » en production depuis au moins deux cycles d'audit.
**Recommandation inchangée :** renseigner le vrai SIRET, ou à défaut une formulation transparente temporaire (« Immatriculation en cours — SIRET communiqué sur demande ») plutôt qu'un placeholder de type TODO.

### Élevé

**2. `realisations.html` reste une galerie de légendes, sans texte narratif propre.**
188 mots de contenu `<main>` sur cette page, presque entièrement composés de légendes courtes (« La Motte-Chalancon · PVC Pierre de Bali », « Poët-Laval · PVC vert olive ») et d'alt-text. Aucun paragraphe n'explique le contexte du chantier, le défi technique ou le choix de finition — alors que c'est la page la mieux placée pour démontrer une Expérience de premier ordre avec des photos réelles et nommées. Fait notable : les pages ville Avignon/Orange/Aix apportent maintenant ce contexte narratif pour 3 des 4 chantiers montrés ici (Avignon = piscine neuve Authentic, Orange = fond diamant, Aix implicite via la mention granit grey), mais ce texte n'existe pas sur `realisations.html` elle-même — la page reste thin dans l'absolu.
**Recommandation :** reprendre les 2-3 phrases de contexte déjà rédigées pour les pages ville et les ajouter en légende étendue ou en accordéon sous chaque paire avant/après de `realisations.html`, plutôt que de laisser ce contenu uniquement sur les pages secondaires.

**3. `methode.html` toujours sous le seuil recommandé pour une page service (469 mots vs 800).**
Amélioration qualitative réelle depuis le dernier audit (fusion intro + soudure, nouveau tableau comparatif liner/membrane ligne par ligne, schéma matériau interactif) mais le comptage de mots n'a presque pas bougé (456 → 469). Le contenu est dense et factuellement solide (HowTo 4 étapes avec photos géolocalisées : Saint-Restitut, Dieulefit, Grignan, Pont-de-Barret ; tableau comparatif 5 critères), donc la sévérité est un cran en dessous d'un contenu vide, mais le volume de couverture topique reste limité pour une page qui devrait porter le plus de profondeur technique du site (ex. section « erreurs fréquentes », FAQ technique dédiée à la pose, détail des étapes de préparation du support).

**4. Aucune preuve sociale nulle part sur le site (inchangé).**
Recherche systématique (grep « avis », « témoignage », « note », étoiles) sur les 13 pages live : **zéro résultat**. Ni avis Google, ni témoignage nominatif, ni schema `Review`/`AggregateRating`. C'est le point faible principal d'Authoritativeness (25% du modèle E-E-A-T interne) : les seuls signaux de crédibilité externes restent les logos fournisseurs (Renolit, Fluidra, Maytronics, CGT Alkor, Elbe, APF, CF Group), qui attestent de partenariats matériel mais pas de la satisfaction client.
**Recommandation inchangée :** ajouter 3-5 témoignages (prénom + ville, cohérent avec les chantiers déjà nommés) et/ou lien vers les avis Google avec `AggregateRating` si le volume le permet.

### Moyen

**5. Bloc « Finitions » toujours dupliqué mot pour mot entre l'accueil et `methode.html`.**
Les trois blocs `finish-folder` (Effet Pierre de Bali, Effet Pierre naturelle, Unis) sont identiques — mêmes images, mêmes légendes, même ordre — sur `index.html` (section `#finitions`, aperçu) et `methode.html` (section `#finitions`, complète). Ce n'est pas un problème de contenu dupliqué au sens Google (pas de canonicalisation concurrente, une seule URL indexée par contenu), mais c'est une redite paresseuse en termes d'expérience utilisateur et une occasion manquée d'ajouter du texte différenciant sur `methode.html` (ex. quelle finition convient à quel usage, résistance UV comparée par gamme).

**6. Aucun signal d'expertise/auteur affiché publiquement.**
Confirmé de nouveau : « Enzo Oddon » n'apparaît **que** dans `mentions-legales.html` et `confidentialite.html` (obligation légale), jamais dans une section « qui sommes-nous », une bio ou un « à propos » sur l'accueil, la méthode ou les réalisations. Le badge « 5+ ans d'expérience » reste le seul signal d'expertise humaine visible, sans contexte (formation, nombre de chantiers, habilitation).

**7. Formulaire de contact : aucune mention/lien vers la politique de confidentialité au point de collecte des données et photos.**
`contact.html` collecte nom, téléphone, e-mail, ville, message et **photos du bassin** (`<input type="file" name="photos">`) mais la seule mention à proximité du formulaire est : « En envoyant ce formulaire, vous acceptez d'être recontacté au sujet de votre projet. » — aucune phrase ni lien renvoyant vers `confidentialite.html` directement sous le formulaire. Le lien existe bien dans le footer de la page (donc techniquement accessible), mais les bonnes pratiques RGPD recommandent un lien explicite au moment même de la collecte, en particulier pour des données sensibles comme des photos de domicile.
**Recommandation :** ajouter sous le formulaire une phrase du type « Vos données sont traitées conformément à notre [politique de confidentialité](confidentialite.html). »

### Faible

**8. `realisations.html` — H1 « Avant / Après » toujours peu descriptif malgré la refonte visuelle.**
La page a été redesignée avec un nouveau hero photo plein cadre (`after-4.jpg`) et un sous-titre correct (« Quatre chantiers récents, de la membrane posée à sec jusqu'à la mise en eau »), mais le H1 lui-même reste `<h1>Avant / Après</h1>` — inchangé depuis l'audit précédent. Un H1 plus descriptif (« Nos réalisations de piscines en PVC armé » ou similaire) apporterait un signal thématique plus net pour le SEO et les LLM.

**9. Double promesse de garantie encore non reliée explicitement.**
Amélioration lexicale actée (badge « Garantie fabricant » vs carte « Garantie étanchéité sur la pose »), mais aucune phrase du site (FAQ incluse) n'explicite que ce sont deux garanties distinctes avec des conditions différentes. Une ligne dans la FAQ suffirait à lever toute ambiguïté restante.

**10. Pages ville : FAQ visible mais non balisée en `FAQPage`.**
Chaque page ville affiche une mini-FAQ de 2 questions (« Intervenez-vous aussi pour la rénovation... », « Combien de temps pour obtenir un devis... », etc.) mais la vérification du JSON-LD des 7 pages ville ne montre que `BreadcrumbList`, `City`, `ListItem`, `Service` — **pas de `FAQPage`**. C'est un contenu citable qui n'est pas structuré pour l'être pleinement. Point à la marge entre contenu et schéma — signalé ici pour information, l'implémentation technique du balisage relève du sous-agent schema.

---

## Régression / nouveau problème

Aucune régression identifiée par rapport à l'audit précédent — tous les écarts constatés sont soit des non-corrections (SIRET, réalisations.html, finitions dupliquées, auteur, réassurance formulaire), soit des points déjà connus dans une forme légèrement modifiée (garantie).

---

## Comptage de mots par page (contenu `<main>`, hors nav/footer)

| Page | Type | Mots | Seuil recommandé | Statut |
|---|---|---|---|---|
| `/` (index.html) | Homepage | 1 532 | 500 | Largement au-dessus (porté par la FAQ étoffée à 7 Q/R) |
| `methode.html` | Service page | 469 | 800 | Sous le seuil (-41%), mais contenu dense (tableau comparatif, HowTo) |
| `realisations.html` | Portfolio | 188 | — | Toujours très thin, légendes seules |
| `contact.html` | Contact/conversion | 319 | — | Correct pour ce type de page |
| `mentions-legales.html` | Légal | 245 | — | Complet hormis le SIRET |
| `confidentialite.html` | Légal/RGPD | 304 | — | Complet et détaillé |
| Pages ville (7, moyenne) | Location page | ~380 (353–474) | 500-600 | Légèrement sous le seuil, mais contenu unique et non template |

---

## Qualité et unicité des pages ville (info complémentaire — pour approfondissement voir `seo-programmatic`)

Les 7 pages ville ne sont **pas** un contenu programmatique faible : chacune varie réellement le texte (distance précise, statut de zone, chantier réel cité quand disponible, mini-FAQ propre). Structure commune (mêmes sections, même schéma `Service`+`City`) mais phrasé et faits non interchangeables d'une ville à l'autre — un test de « copier une page ville sur une autre » échouerait immédiatement (contrairement à un template pur). Bon point de conformité au QRG de septembre 2025 sur les pages générées à grande échelle, à condition que ce schéma se maintienne si d'autres villes sont ajoutées.

---

## Score AI Citation Readiness : 74/100 (précédent : 68/100)

**Points forts :**
- `FAQPage` (accueil, 7 Q/R) correspond exactement au HTML visible — réponses auto-suffisantes, chiffrées, citables telles quelles (150/100e vs 75/100e, 15-25 ans vs 8-10 ans, NF T54-804, <24h, ~2h de rayon, 1 jour de chantier).
- `HowTo` (4 étapes, `methode.html`) + `Service` + `BreadcrumbList` cohérents sur les pages structurantes.
- Faits vérifiables et bien formulés pour extraction LLM : norme Afnor citée avec son numéro exact et sa portée expliquée en clair, comparaison chiffrée liner vs membrane répétée de façon cohérente sur 3 pages (accueil, méthode, FAQ) sans contradiction.
- Hiérarchie de titres propre (h1 > h2 > h3) sur les pages vérifiées.
- Contenu factuel désormais distribué sur davantage de pages (7 pages ville avec faits géographiques précis et vérifiables : temps de trajet en minutes depuis Montélimar).

**Points faibles :**
- Toujours pas de schema `Review`/`AggregateRating` ni `Person`/auteur — un LLM ne peut citer ni note de satisfaction ni expert nommé.
- Mini-FAQ des pages ville non balisée en `FAQPage` malgré un contenu Q/R visible et de bonne qualité.
- `realisations.html` reste pauvre en texte extractible (légendes courtes uniquement).
- SIRET manquant = un LLM interrogé sur la légitimité légale de l'entreprise ne trouvera pas cette information de base.

---

## Breakdown E-E-A-T (modèle de pondération interne à cette skill)

| Facteur | Poids | Score | Évolution | Justification |
|---|---|---|---|---|
| Experience | 20% | 60/100 | ↑ (55→60) | Photos de chantier réelles et géolocalisées (accueil, méthode, réalisations) + désormais des chantiers nommés et détaillés sur les pages ville (Avignon, Orange, Aix). Toujours aucun témoignage client, et `realisations.html` elle-même reste sans texte de contexte. |
| Expertise | 25% | 58/100 | ↑ (45→58) | FAQ technique très étoffée et cohérente (norme NF T54-804 expliquée en détail, comparatif matériau précis), tableau comparatif sur `methode.html`. Toujours aucune bio/auteur affiché publiquement — l'expertise est démontrée par le contenu, pas par une personne identifiée. |
| Authoritativeness | 25% | 30/100 | = (inchangé) | Toujours zéro avis client, zéro presse/mention externe. Seuls signaux : logos fournisseurs (partenariats matériel, pas crédibilité client). |
| Trustworthiness | 30% | 42/100 | ↑ léger (45→42, voir note) | Pages légales complètes, bien reliées entre elles et depuis le footer de toutes les pages, politique de confidentialité RGPD détaillée avec engagement explicite sur les photos clients. **Mais** le SIRET placeholder « [SIRET À COMPLÉTER] » reste visible en production — un défaut de transparence légale de base qui plafonne fortement ce facteur malgré les progrès de structure. Score légèrement revu à la baisse vs l'audit précédent car le nombre de cycles d'audit sans correction de ce point critique aggrave le constat. |
| **Pondéré** | | **≈47/100** | ↑ (43→47) | |

Score contenu global (E-E-A-T pondéré 47 + bonus structured data solide, FAQ profonde, fraîcheur, contenu ville différencié, mots-clés naturels — pénalité word count méthode/réalisations, absence de preuve sociale, SIRET critique non résolu) : **60/100**.

---

## Points positifs additionnels

- **Fraîcheur :** déploiement live daté du jour de l'audit (`Last-Modified: Mon, 28 Sep 2026`), cohérent avec l'historique Git récent (13 commits sur les 3 derniers jours touchant contenu/SEO).
- **Mots-clés naturels :** titres et meta descriptions bien ciblés (« PVC armé », « thermosoudage », « Montélimar », noms de ville en pages dédiées) sans bourrage, densité raisonnable, aucune sur-optimisation détectée.
- **Cohérence factuelle inter-pages :** les chiffres clés (150/100e, 15-25 ans, NF T54-804, <24h, 1 jour de chantier) sont répétés à l'identique sur l'accueil, `methode.html`, `contact.html` et les 7 pages ville — aucune contradiction relevée, bon signal de fiabilité pour un rater humain ou un LLM qui croiserait les pages.
- **Transparence sur les limites de service :** le ton assumé « nous préférons rester transparents sur cette limite plutôt que de promettre une couverture que nous ne pourrions pas tenir » (pages Marseille/Montpellier/Aix) est un signal de Trustworthiness qualitatif fort, rare sur ce type de site vitrine.

---

## Recommandations prioritaires (ordre d'impact)

1. **Critique** — Renseigner le vrai SIRET dans `mentions-legales.html` (ou formulation transparente temporaire). Non résolu depuis au moins deux audits consécutifs malgré ~20 commits sur le repo dans l'intervalle.
2. **Élevée** — Ajouter du texte narratif sur `realisations.html` (contexte, défi, finition) — le contenu existe déjà partiellement sur les pages ville, il suffit de le rapatrier/adapter en légendes étendues.
3. **Élevée** — Ajouter 3-5 témoignages clients + envisager un schema `AggregateRating` si le volume d'avis le permet — seul point qui reste à 0 sur deux audits consécutifs.
4. **Moyenne** — Pousser `methode.html` au-delà de 800 mots utiles (FAQ technique dédiée, section « erreurs fréquentes »), sans remplissage artificiel.
5. **Moyenne** — Ajouter un lien explicite vers `confidentialite.html` directement sous le formulaire de contact (au point de collecte des photos), pas seulement dans le footer.
6. **Moyenne** — Ajouter un encart « qui pose votre membrane » (bio Enzo Oddon, photo, nombre de chantiers) sur l'accueil.
7. **Faible** — Changer le H1 de `realisations.html` (« Avant / Après » → un intitulé plus descriptif).
8. **Faible** — Ajouter une phrase FAQ clarifiant explicitement garantie fabricant (matériau) vs garantie de pose (main d'œuvre).
9. **Faible** — Différencier le bloc Finitions entre l'accueil (aperçu, déjà correct) et `methode.html` (ajouter un texte d'usage/résistance par gamme plutôt que répéter les mêmes visuels).

---

*Méthodologie détaillée : fetch live via `render_page.py --mode never --output` (HTML brut complet, site 100% statique donc pas de rendu JS nécessaire pour le contenu texte) pour les 13 pages du sitemap. Comptage de mots par extraction regex du contenu entre `<main>` et `</main>` (exclut nav/footer répétés, scripts, styles). Vérification SIRET par lecture ligne à ligne du HTML live de `mentions-legales.html`. Vérification liens légaux et lien formulaire→confidentialité par grep sur le HTML brut de l'accueil, contact, méthode, réalisations et une page ville. Recherche de preuve sociale par grep insensible à la casse (« avis », « témoign », « note moyenne », « ★ ») sur l'ensemble des pages fetchées — zéro résultat hors faux positif dans `node_modules`.*
