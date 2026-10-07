# Audit Sitemap — provencepvcarme.fr

**Score : 70/100**

Fichier audité : `sitemap.xml` (racine du projet, 1150 octets)
Référencé correctement dans `robots.txt` (`Sitemap: https://provencepvcarme.fr/sitemap.xml`).

---

## Résumé des vérifications (8 max)

1. Parsing XML (`xml.etree.ElementTree`) — bien formé, encodage UTF-8, namespace `urlset` correct.
2. Comparaison des 6 `<loc>` du sitemap avec les 6 pages HTML présentes à la racine du dépôt.
3. Comparaison des `<lastmod>` déclarés vs date du dernier commit git par page (`git log -1 --date=short -- <fichier>`).
4. Vérification `git status --short` : aucune modification non commitée sur les pages HTML (les commits sont bien la source de vérité pour la fraîcheur).
5. Historique récent (`git log --oneline`) : plusieurs commits de contenu significatif après le 18/08 (badges de confiance, bandeau partenaires, schéma zone d'intervention, refonte accueil, section réalisations, FAQPage).
6. Présence et syntaxe de `robots.txt` et de la directive `Sitemap:`.
7. Contrôle du nombre d'URLs (6) et de la taille du fichier vs limites Google (50 000 URLs / 50 Mo) — largement conforme.
8. Détection des balises dépréciées (`priority`, `changefreq`) ignorées par Google depuis 2023.

---

## Findings

### 1. `lastmod` obsolètes sur les 6 URLs — Sévérité : HIGH
**Description** : toutes les entrées du sitemap affichent `lastmod = 2026-08-18`, alors que l'historique git montre des modifications de contenu significatives postérieures à cette date pour chaque page :

| Page | lastmod déclaré | Dernier commit réel | Écart |
|---|---|---|---|
| `/` (index.html) | 2026-08-18 | 2026-08-23 | 5 jours |
| `/methode.html` | 2026-08-18 | 2026-08-23 | 5 jours |
| `/realisations.html` | 2026-08-18 | 2026-08-23 | 5 jours |
| `/contact.html` | 2026-08-18 | 2026-08-23 | 5 jours |
| `/mentions-legales.html` | 2026-08-18 | 2026-08-22 | 4 jours |
| `/confidentialite.html` | 2026-08-18 | 2026-08-22 | 4 jours |

Ces écarts correspondent à des changements de contenu réels (non triviaux) constatés dans les commits git : ajout du schéma FAQPage sur l'accueil, section "Coulisses du chantier" sur réalisations, refonte hero/cartes/teaser accueil, bandeau partenaires, badges de confiance, schéma zone d'intervention. `lastmod` doit refléter la dernière modification *significative*, pas une date figée.

**Recommandation** : régénérer `sitemap.xml` à chaque déploiement (script post-commit ou hook CI) en calculant `lastmod` depuis la date du dernier commit git touchant chaque fichier, ou depuis la date de publication réelle du contenu. Éviter toute date statique/identique sur toutes les URLs, qui indique généralement une génération manuelle non maintenue.

### 2. Balises dépréciées `priority` et `changefreq` — Sévérité : LOW
**Description** : chaque `<url>` contient `<priority>` (1.0 à 0.3) et `<changefreq>` (monthly/yearly). Google ignore officiellement ces deux balises depuis 2023 ; elles n'ont aucun effet sur le crawl ou le classement.

**Recommandation** : les supprimer pour alléger le fichier et éviter toute confusion ; conserver uniquement `<loc>` et `<lastmod>`. Optionnel, sans urgence.

### 3. Couverture des 6 pages — Sévérité : PASS
**Description** : les 6 pages HTML du site (`index.html`, `methode.html`, `realisations.html`, `contact.html`, `mentions-legales.html`, `confidentialite.html`) sont toutes présentes dans le sitemap, avec des URLs canoniques HTTPS cohérentes avec le domaine de production `provencepvcarme.fr`. Aucune page manquante, aucune URL orpheline.

**Recommandation** : aucune action requise. Revalider si de nouvelles pages sont ajoutées.

### 4. Validité XML et structure — Sévérité : PASS
**Description** : le fichier est bien formé (parsé sans erreur), respecte le schéma `http://www.sitemaps.org/schemas/sitemap/0.9`, déclaration XML et encodage UTF-8 corrects.

**Recommandation** : aucune action requise.

### 5. Limite de taille / nombre d'URLs — Sévérité : PASS
**Description** : 6 URLs pour 1150 octets, très loin des seuils de 50 000 URLs / 50 Mo par fichier. Pas de découpage en index de sitemaps nécessaire.

**Recommandation** : aucune action requise à ce stade (site de petite taille).

### 6. Référencement dans robots.txt — Sévérité : PASS
**Description** : `robots.txt` déclare correctement `Sitemap: https://provencepvcarme.fr/sitemap.xml` avec `Allow: /` pour tous les user-agents.

**Recommandation** : aucune action requise.

### 7. Vérification statuts HTTP en direct — Sévérité : INFO (non vérifié)
**Description** : l'audit a été réalisé sur les fichiers locaux du dépôt (`C:\Users\oddon\Desktop\provencepvcarme`), sans accès réseau au site live. Les statuts 200/redirections/noindex n'ont pas pu être vérifiés en conditions réelles.

**Recommandation** : lancer `sitemap_discovery.py` ou un crawler HTTP sur `https://provencepvcarme.fr` en production pour confirmer que les 6 URLs répondent bien en 200 sans redirection ni balise `noindex`.

---

**sitemap.md écrit avec succès**
