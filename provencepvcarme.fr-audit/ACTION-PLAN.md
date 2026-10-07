# Plan d'action — Provence PVC Armé

*Priorisation : Critical > High > Medium > Low, dérivée de l'audit complet du 2026-09-28 (score global 68/100, contre 60/100 au 2026-08-11). Le site est maintenant en ligne — cette révision remplace entièrement le plan précédent.*

## Phase 1 — Corrections critiques (cette semaine)

- [ ] **Renseigner le vrai SIRET** dans `mentions-legales.html` (actuellement `Numéro SIRET : [SIRET À COMPLÉTER]`, placeholder visible en production depuis plus d'un mois). À défaut d'un numéro définitif, utiliser une formulation transparente temporaire ("Immatriculation en cours — SIRET communiqué sur demande") plutôt qu'un TODO visible. Relevé indépendamment par 4 des 9 audits comme LE problème prioritaire.
- [ ] **Trancher l'adresse légale réelle (Montélimar ou Dieulefit) et l'aligner partout** : les 4 blocs JSON-LD `GeneralContractor`, les footers des 13 pages, et le corps de texte de `mentions-legales.html`/`confidentialite.html` doivent converger vers une seule ville. Actuellement 11 pages + schema disent "Montélimar", 2 pages légales disent "Dieulefit, Drôme" — contradiction interne au site, bloquante pour toute future fiche Google Business Profile.
- [ ] **Corriger le LCP mobile "Poor" (11.2s) de `realisations.html`** : ajouter `fetchpriority="high"` et un `<link rel="preload" as="image">` sur la photo hero (`after-4.webp`/`.jpg`), et générer une variante dédiée allégée (~1600×900, qualité WebP 65-70, cible <120 Ko) au lieu de réutiliser le fichier 1200×1600 plein format partagé avec la vignette de galerie. Régression directe introduite par l'ajout récent de cette section.
- [ ] **Corriger le LCP mobile "Poor" (6.0s) de l'accueil** : ajouter `preload="metadata"` (ou `preload="none"`) sur `hero-bg.mp4`, ou différer son chargement après le premier rendu. Identique à l'audit précédent, non corrigé depuis.
- [ ] **Resserrer le `loading="lazy"` des 8 paires before/after de `realisations.html`** pour éviter la contention réseau qui aggrave le point ci-dessus (25 requêtes et 4.2 Mo cumulés constatés au chargement, alors que la plupart sont censées être différées).

## Phase 2 — Améliorations à fort impact (2-3 semaines)

- [ ] Ajouter 3-5 témoignages clients réels (prénom + ville, cohérent avec les chantiers déjà nommés) et/ou lier de vrais avis Google avec `AggregateRating` dès qu'ils existent — zéro preuve sociale actuellement, point faible n°1 identifié par 3 audits différents (contenu, local, SXO).
- [ ] Mentionner l'assurance décennale (base légale, durée) sur le site — légalement obligatoire pour ce type de chantier et actuellement absente des 13 pages.
- [ ] Créer ou vérifier la fiche Google Business Profile (catégorie "Swimming pool contractor"/"Swimming pool repair service"), y ajouter un lien `sameAs` dans le schema — zéro signal GBP détectable actuellement (facteur de classement local n°1).
- [ ] Reprendre les 2-3 phrases de contexte déjà rédigées pour les pages ville (Avignon, Orange, Aix) et les ajouter en légende étendue sous les paires avant/après correspondantes de `realisations.html`, qui reste à 188 mots de contenu narratif propre.
- [ ] Supprimer le schema `HowTo` de `methode.html` (type déprécié par Google depuis 2023, recommandation déjà faite au dernier audit, non appliquée) — coût nul, le contenu étape par étape reste en HTML visible.
- [ ] Corriger l'incohérence "Marseille" : la meta description/og:description de l'accueil la présente comme couverte, alors que la page dédiée et la section zones la présentent comme "hors rayon standard, au cas par cas". Harmoniser, et ajouter le département Isère à la meta description (présent dans le schema/footer mais pas dans la meta).
- [ ] Corriger les `lastmod` stale du sitemap sur 4 pages ville (Orange, Aix-en-Provence, Montpellier, Pierrelatte) pour refléter leur dernier commit réel — le cas Pierrelatte affiche une date antérieure à la création du fichier.
- [ ] Ajouter un lien explicite vers `confidentialite.html` directement sous le formulaire de contact, au point de collecte des données et photos (actuellement seulement accessible via le footer).

## Phase 3 — Contenu et autorité (mois suivant)

- [ ] Étoffer `methode.html` vers ~800 mots (actuellement 469, malgré une amélioration qualitative réelle avec la fusion intro/soudure et le nouveau tableau comparatif) — ex. section "erreurs fréquentes", FAQ technique dédiée à la pose, détail des étapes de préparation du support.
- [ ] Ajouter une fourchette de prix indicative (ex. "à partir de X €/m²") — toujours absente ; la nouvelle question FAQ qui justifie cette absence est un bon palliatif de confiance mais ne remplace pas un repère chiffré face à un SERP informationnel dominé par des pages affichant des €/m² explicites.
- [ ] Ajouter `sameAs` au schema `GeneralContractor` (réseaux sociaux, GBP) et créer `llms.txt` listant les pages clés — signal le plus corrélé aux citations IA, actuellement à zéro.
- [ ] Dédupliquer le bloc "Finitions" entre `index.html` et `methode.html` (actuellement identique mot pour mot) — ajouter du texte différenciant sur `methode.html` (quelle finition pour quel usage, résistance UV comparée).
- [ ] Corriger le H1 de `realisations.html` ("Avant / Après" → intégrer "PVC armé"/"piscine") malgré la refonte visuelle déjà faite.
- [ ] Ajouter une carte interactive ou un lien "voir l'itinéraire" sur `contact.html` — page la plus proche de la conversion, actuellement sans aucun outil de localisation fonctionnel (la carte SVG stylisée de l'accueil est un bon complément visuel mais ne remplace pas une carte fonctionnelle sur Contact).
- [ ] Ajouter un signal d'expertise/auteur visible publiquement (bio courte, nombre de chantiers, formation) — "Enzo Oddon" n'apparaît aujourd'hui que dans les pages légales.
- [ ] Baliser les mini-FAQ des 7 pages ville en `FAQPage` (contenu déjà présent en HTML, juste non structuré).

## Phase 4 — Suivi, hygiène et polish (continu)

- [ ] Ajouter des en-têtes de sécurité (HSTS, CSP, X-Content-Type-Options, Referrer-Policy) via un proxy (ex. Cloudflare) — limitation structurelle de GitHub Pages sans cette couche.
- [ ] Épingler les scripts CDN (GSAP/ScrollTrigger/Lenis) à une version exacte et ajouter des attributs `integrity=` (SRI) — même Three.js, épinglé en version exacte, n'a pas de hash SRI.
- [ ] Remplacer `href="index.html"` par `href="/"` dans la nav/logo/footer des 13 pages pour cohérence avec le canonical.
- [ ] Ajouter une page 404 personnalisée (le statut HTTP est déjà correct, seul le corps de page est la page générique GitHub Pages).
- [ ] Générer une clé IndexNow pour accélérer la découverte Bing/Yandex, maintenant que le site publie du contenu régulièrement.
- [ ] Ajouter un `favicon.ico` à la racine en complément des PNG déjà en place.
- [ ] Compresser/convertir en WebP responsive (`srcset`) la galerie before/after (222-436 Ko par image, une seule résolution servie à tous les écrans) et `hero-poster.jpg` (toujours sans variante WebP/AVIF).
- [ ] Vérifier le rendu desktop natif de `hero-bg.mp4` : fichier en résolution portrait native (960×1706) réutilisé en hero paysage — probable recadrage/agrandissement sous-optimal à vérifier visuellement, et candidat à un ré-export paysage qui réduirait aussi le poids fichier.
- [ ] Documenter ou corriger le choix d'adresse schema allégée (`streetAddress`/`postalCode` retirés) — soit assumer un modèle "service area business" sans adresse visible, soit les rétablir si une adresse d'accueil client existe réellement.
- [ ] Une fois le SIRET et l'adresse tranchés : soumettre/mettre à jour la fiche Google Business Profile, vérifier l'indexation via Google Search Console (non configuré actuellement) et surveiller les premières données CrUX réelles.
- [ ] Automatiser la mise à jour des `lastmod` du sitemap avant chaque déploiement (ex. script basé sur `git log -1 --date=short -- <fichier>`) pour éviter les écarts constatés en Phase 2.
