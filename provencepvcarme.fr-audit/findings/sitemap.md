# Audit Sitemap & robots.txt — provencepvcarme.fr

**Score : 92/100**

Fichier audité : `sitemap.xml` (racine du projet, 2613 octets, 13 URLs) + `robots.txt` (racine, 4 lignes).
Site vérifié **en ligne** (hébergement GitHub Pages + CDN Fastly) : `https://provencepvcarme.fr/sitemap.xml` et `https://provencepvcarme.fr/robots.txt` répondent tous les deux en **HTTP 200** en production, contrairement à l'audit précédent où seule la version locale avait pu être vérifiée.

---

## Corrigé depuis le dernier audit

- **Statut HTTP live vérifié (était HIGH/non vérifiable)** : les 13 URLs du sitemap, `sitemap.xml` et `robots.txt` répondent tous en `200 OK` en production. `http://` → `https://` et `https://www.` → `https://` (sans www) redirigent proprement en `301` vers l'URL canonique. Aucun `meta robots noindex` détecté sur l'accueil ni sur les pages villes testées, aucun en-tête `X-Robots-Tag` bloquant.
- **`lastmod` identique sur toutes les URLs (était HIGH)** : corrigé. Le sitemap affiche désormais 3 valeurs différenciées (`2026-09-28`, `2026-09-23`, `2026-08-24`) reflétant globalement l'historique réel des modifications, et non plus une date unique recopiée. Voir nuance ci-dessous (reste un point à affiner, rétrogradé en MEDIUM).
- **Couverture 1:1 sitemap ↔ pages réelles** : maintenue malgré la croissance de 6 → 13 URLs. Les 13 pages HTML de production (accueil, méthode, réalisations, contact, mentions légales, confidentialité, 7 pages villes) sont toutes dans le sitemap ; `methode-1.html`, `css/style-1.css` (brouillons non déployés) et `google0e3597e191fe6be9.html` (fichier de vérification Search Console) en sont exclus à juste titre.
- **Balises dépréciées `priority`/`changefreq`** : toujours présentes (voir Toujours ouvert), non aggravées.

## Toujours ouvert

### Balises dépréciées `priority` et `changefreq` — Sévérité : LOW
Chaque `<url>` porte encore `<priority>` (1.0 à 0.3) et `<changefreq>` (monthly/yearly), ignorées par Google depuis 2023. Sans impact sur le crawl, mais alourdit inutilement le fichier. Recommandation inchangée : suppression optionnelle, sans urgence.

### Sitemap image absent — Sévérité : INFO
Aucune extension `image:image` n'est utilisée dans `sitemap.xml` alors que plusieurs pages (réalisations, pages villes) exposent désormais de vraies photos de chantier (`media/after-3.jpg`, `media/pourquoi-realisation.jpg/webp`, photos Orange/Aix ajoutées le 25/09). Un sitemap image resterait facultatif à ce volume de photos, mais deviendrait pertinent si la galerie de réalisations s'étoffe. Non bloquant.

## Régression / nouveau problème

### `lastmod` stale sur 4 des 7 pages villes — Sévérité : MEDIUM
**Description** : le sitemap actuel (commit du 28/09) a bien mis à jour `lastmod` pour les pages effectivement modifiées ce jour-là (accueil, méthode, réalisations, contact, Avignon, Marseille, Valence — cohérent avec l'historique git). En revanche, 4 pages villes affichent un `lastmod = 2026-09-23` qui ne correspond à aucun commit réel et est antérieur à leur dernière modification significative :

| Page | `lastmod` déclaré | Dernier commit réel (git) | Écart | Nature du changement non reflété |
|---|---|---|---|---|
| `/pose-membrane-pvc-arme-orange.html` | 2026-09-23 | 2026-09-25 | 2 jours | Ajout d'une vraie photo de chantier |
| `/pose-membrane-pvc-arme-aix-en-provence.html` | 2026-09-23 | 2026-09-25 | 2 jours | Ajout d'une vraie photo de chantier |
| `/pose-membrane-pvc-arme-montpellier.html` | 2026-09-23 | 2026-09-24 | 1 jour | Rééquilibrage texte neuf/rénovation |
| `/pose-membrane-pvc-arme-pierrelatte.html` | 2026-09-23 | 2026-09-24 | 1 jour | **Date de création de la page elle-même** — `lastmod` déclaré est antérieur à la première existence du fichier, ce qui est logiquement impossible |

Ce sont des changements de contenu réels (texte reformulé, photo ajoutée), pas du boilerplate — ils justifient une mise à jour de `lastmod`. À l'inverse, `mentions-legales.html` et `confidentialite.html` conservent volontairement `lastmod = 2026-08-24` malgré un commit du 24/09 : ce commit n'a ajouté que 4 lignes de lien de navigation dans le pied de page (liste "Secteurs"), un changement de type boilerplate — c'est le bon comportement (ne pas gonfler artificiellement la fraîcheur pour un lien de nav), donc **pas** un problème.

**Sévérité justifiée** : rétrogradé de HIGH (audit précédent, dates identiques et jamais mises à jour) à MEDIUM, car le pattern global s'est nettement amélioré (dates différenciées, mise à jour correcte pour 9 des 13 URLs) et l'écart réel ne porte que sur 1-2 jours pour 4 pages secondaires — mais le cas Pierrelatte (date antérieure à la création du fichier) est une incohérence factuelle qui mérite correction.

**Recommandation** : avant chaque commit qui modifie une page ville, mettre à jour son `<lastmod>` dans `sitemap.xml` dans le même commit (et non dans une commit ultérieure dédiée au sitemap qui ne rattrape que les pages touchées ce jour-là). Envisager un script simple (`git log -1 --date=short -- <fichier>`) exécuté avant chaque déploiement pour régénérer automatiquement les 13 `lastmod` et éliminer ce type d'oubli.

---

## Résumé des vérifications

1. **Parsing XML** — bien formé (`xml.etree.ElementTree`), encodage UTF-8, namespace `urlset` correct, 13 `<url>` uniques (aucun doublon de `<loc>`).
2. **Statuts HTTP live** — 13/13 URLs + `sitemap.xml` + `robots.txt` en `200 OK` sur `https://provencepvcarme.fr` (vérifié en production, pas seulement en local). Redirections `http→https` et `www→non-www` propres en `301`.
3. **Parité sitemap ↔ dépôt** — 13 pages HTML de production = 13 URLs du sitemap, exclusions légitimes de `methode-1.html`, `css/style-1.css` (brouillons) et `google0e3597e191fe6be9.html` (vérification GSC) confirmées.
4. **Cohérence `lastmod` vs historique git** — 9/13 URLs correctement à jour, 4/13 stale de 1-2 jours (voir Régression), plus d'occurrence de date unique recopiée sans changement.
5. **`robots.txt`** — `User-agent: *`, `Allow: /`, `Sitemap: https://provencepvcarme.fr/sitemap.xml` correctement déclaré et accessible en ligne ; aucune directive `Disallow` qui bloquerait le crawl des 13 pages.
6. **Limite de taille/nombre d'URLs** — 13 URLs, 2613 octets, très loin des seuils Google (50 000 URLs / 50 Mo). Aucun index de sitemap nécessaire à ce stade.
7. **Balises dépréciées** — `priority`/`changefreq` toujours présentes mais sans effet (Google les ignore depuis 2023).
8. **Quality gate pages villes** — 7 pages de zone (< seuil WARNING de 30), contenu vérifié réellement différencié par ville (distance, honnêteté "cas par cas" pour Montpellier/Aix vs zone habituelle pour Pierrelatte/Valence, CTA adaptés) via diff de contenu — aucun doorway page à contenu dupliqué. **PASS**, aucun garde-fou déclenché.
9. **Sitemap image** — absent, facultatif à ce volume (INFO).
10. **Découverte automatisée** (`sitemap_discovery.py --json`) — confirme `sitemap.xml` déclaré dans `robots.txt`, valide, `200`, type `urlset` ; aucun sitemap index alternatif trouvé (normal, non requis).

---

## Détail des 13 URLs (statut live + fraîcheur)

| URL | HTTP | `lastmod` sitemap | Dernier commit git | Cohérent ? |
|---|---|---|---|---|
| `/` | 200 | 2026-09-28 | 2026-09-28 | Oui |
| `/methode.html` | 200 | 2026-09-28 | 2026-09-28 | Oui |
| `/realisations.html` | 200 | 2026-09-28 | 2026-09-28 | Oui |
| `/contact.html` | 200 | 2026-09-28 | 2026-09-28 | Oui |
| `/pose-membrane-pvc-arme-avignon.html` | 200 | 2026-09-28 | 2026-09-28 | Oui |
| `/pose-membrane-pvc-arme-orange.html` | 200 | 2026-09-23 | 2026-09-25 | Non — stale 2j |
| `/pose-membrane-pvc-arme-marseille.html` | 200 | 2026-09-28 | 2026-09-28 | Oui |
| `/pose-membrane-pvc-arme-pierrelatte.html` | 200 | 2026-09-23 | 2026-09-24 | Non — stale 1j (antérieur à la création) |
| `/pose-membrane-pvc-arme-valence.html` | 200 | 2026-09-28 | 2026-09-28 | Oui |
| `/pose-membrane-pvc-arme-montpellier.html` | 200 | 2026-09-23 | 2026-09-24 | Non — stale 1j |
| `/pose-membrane-pvc-arme-aix-en-provence.html` | 200 | 2026-09-23 | 2026-09-25 | Non — stale 2j |
| `/mentions-legales.html` | 200 | 2026-08-24 | 2026-09-24 (boilerplate footer) | Oui (conservatif, correct) |
| `/confidentialite.html` | 200 | 2026-08-24 | 2026-09-24 (boilerplate footer) | Oui (conservatif, correct) |

---

## Calcul du score

- Base 100.
- -5 : 4/13 `lastmod` stale de 1-2 jours par rapport à un vrai changement de contenu (MEDIUM).
- -2 : cas Pierrelatte, `lastmod` antérieur à la création du fichier (incohérence factuelle, sous-composante du point précédent).
- -1 : balises dépréciées `priority`/`changefreq` toujours présentes (LOW, cosmétique).
- 0 (INFO, non déduit) : absence de sitemap image, facultatif au volume actuel.
- Aucune pénalité : XML valide, parité 1:1, tous statuts HTTP live 200, redirections propres, `robots.txt` correct, aucun doorway page, aucun dépassement de seuil.

**Score final : 92/100** (contre 96/100 à l'audit précédent — légère baisse malgré des progrès nets, car le point HIGH précédent devient vérifiable et globalement résolu, mais révèle en creux un nouveau défaut MEDIUM plus spécifique sur la fraîcheur de 4 pages villes qui n'existait pas quand il n'y avait que 6 URLs).
