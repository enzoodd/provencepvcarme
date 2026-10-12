# Rapport — Refonte architecture SEO : 7 pages ville → 7 pages département

**Date :** 2026-10-12 · 4 commits (`64ac97b` → `c67ccc6`), tous poussés sur `main`.

---

## 1. Méthode de redirection utilisée

**Vérification DNS effectuée en premier, comme demandé :**
- `provencepvcarme.fr` résout vers les IP GitHub Pages (185.199.108-111.153).
- Nameservers : `ns106.ovh.net` / `dns106.ovh.net` — **OVH**, pas Cloudflare.
- En-têtes HTTP live : `Server: GitHub.com`, `Via: 1.1 varnish`, `X-Served-By: cache-mrs1530027-MRS` (Fastly) — aucune trace de Cloudflare (`cf-ray` absent).

**Conclusion : Cloudflare n'est nulle part dans la chaîne**, ni en proxy (nuage orange), ni même en DNS-only (le DNS est chez OVH, pas chez Cloudflare). L'option 1 (Redirect Rules Cloudflare) est donc inapplicable.

**Solution retenue : option 2, pages de redirection minimales.** Chaque ancien fichier ville contient désormais :
- `<link rel="canonical" href="...">` vers la nouvelle page département (avec ancre sur le secteur d'origine)
- `<meta http-equiv="refresh" content="0; url=...">` vers la même URL
- Un lien de secours visible, stylé (`.btn-primary`, cohérent avec le reste du site)
- Un `<title>`/meta description adaptés, mentionnant explicitement la nouvelle destination (jamais vides)
- **Aucun** `noindex`/`nofollow` — vérifié par script sur les 7 fichiers.

---

## 2. Les 7 anciennes pages ville traitées

| Ancienne page | Destination exacte |
|---|---|
| `pose-membrane-pvc-arme-avignon.html` | `pvc-arme-vaucluse.html#grand-avignon` |
| `pose-membrane-pvc-arme-orange.html` | `pvc-arme-vaucluse.html#nord-vaucluse` |
| `pose-membrane-pvc-arme-pierrelatte.html` | `pvc-arme-drome.html#tricastin` |
| `pose-membrane-pvc-arme-valence.html` | `pvc-arme-drome.html#vallee-du-rhone` |
| `pose-membrane-pvc-arme-marseille.html` | `pvc-arme-bouches-du-rhone.html#marseille-metropole` |
| `pose-membrane-pvc-arme-aix-en-provence.html` | `pvc-arme-bouches-du-rhone.html#pays-d-aix` |
| `pose-membrane-pvc-arme-montpellier.html` | `pvc-arme-herault.html#montpellier-metropole` |

Chaque ancre correspond à l'`id` HTML réel d'une `.sector-card` qui mentionne explicitement la ville d'origine (pas un atterrissage générique en haut de page) — vérifié fichier par fichier.

---

## 3. Les 7 nouvelles pages département

| Page | Secteurs (cards) | Photo hero | Stat-chips |
|---|---|---|---|
| `pvc-arme-drome.html` | Montélimar & agglo · Tricastin · Vallée du Rhône/Valence · Baronnies & Drôme provençale | Oui (Pont-de-Barret, réel) | — |
| `pvc-arme-vaucluse.html` | Grand Avignon · Nord Vaucluse · Carpentras & l'Enclave des Papes | Oui (Avignon, réel) | ~1h Avignon · ~45min Orange |
| `pvc-arme-bouches-du-rhone.html` | Marseille Métropole · Pays d'Aix | Oui (Aix, réel) | ~2h Marseille · ~1h40 Aix |
| `pvc-arme-herault.html` | Montpellier Métropole | Non (pas de photo réelle dispo) | — |
| `pvc-arme-gard.html` | Nîmes et agglomération · Gard rhodanien | Non | — |
| `pvc-arme-ardeche.html` | Rhône ardéchois · Aubenas et le Sud Ardèche | Non | — |
| `pvc-arme-isere.html` | Sud Isère | Non | — |

**Contenu réel préservé des anciennes pages** (rien perdu, tout réintégré dans les cards) :
- Avignon : construction neuve, finition PVC effet pierre naturelle « Authentic »
- Orange : chantier fond diamant, finition PVC gris clair
- Aix-en-Provence : chantier finition PVC granit grey
- Temps de trajet déjà vérifiés : Avignon ~1h, Orange ~45min, Pierrelatte ~15min, Valence ~35min, Marseille ~2h, Montpellier ~1h45, Aix ~1h40

**FAQ propre à chaque département** (2 questions, jamais du copier-coller) — parité mot pour mot avec le JSON-LD vérifiée par script sur les 7 pages (0 écart).

**Pas de chiffre inventé** : Gard, Ardèche, Isère n'ont aucune donnée de trajet vetetee préexistante — ces pages restent volontairement qualitatives ("à proximité immédiate", "étudié au cas par cas") plutôt que d'afficher des minutes inventées.

---

## 4. Réutilisation des composants existants (aucun système importé)

| Composant | Réutilisé depuis | Usage sur les pages département |
|---|---|---|
| `.sector-card` (nouveau) | Calqué sur `.diff-card` (index.html) — mêmes valeurs exactes de padding/radius/ombre/hover | Grille de secteurs |
| `.diff-icon-wrap` + variantes `--lagon`/`--gold`/`--marine` | Existant, repris tel quel | Icônes circulaires des cards |
| `.stat-chip` (nouveau) | Recette visuelle de `.tab-chip` (methode.html/contact.html), sans le JS tablist | Temps de trajet (Vaucluse, Bouches-du-Rhône) |
| `.section--photo` / `.page-hero-media` | Existant (créé pour realisations.html) | Hero photo (Drôme, Vaucluse, Bouches-du-Rhône) |
| `.section--dark` / `.cta-band` | Existant, inchangé | CTA de fin de page |
| `.faq-list` / `.faq-item` | Existant, inchangé | Mini-FAQ département |
| `.breadcrumb` / `.breadcrumb--light` | Existant, inchangé | Fil d'Ariane 2 niveaux |

Aucune nouvelle couleur, aucune nouvelle police, aucun framework externe — uniquement `--marine`/`--lagon`/`--gold`/`--sand` et Manrope/Inter déjà en place.

---

## 5. Schéma du maillage final

```
index.html (footer "Secteurs" + section #zones)
methode.html (footer)
realisations.html (footer)
contact.html (footer)
mentions-legales.html (footer)
confidentialite.html (footer)
        │
        ├──► pvc-arme-drome.html
        ├──► pvc-arme-vaucluse.html
        ├──► pvc-arme-bouches-du-rhone.html
        ├──► pvc-arme-herault.html
        ├──► pvc-arme-gard.html
        ├──► pvc-arme-ardeche.html
        └──► pvc-arme-isere.html

Anciennes URLs (toujours en ligne, jamais 404) :
pose-membrane-pvc-arme-avignon.html           ──301 (meta-refresh)──► pvc-arme-vaucluse.html#grand-avignon
pose-membrane-pvc-arme-orange.html            ──301 (meta-refresh)──► pvc-arme-vaucluse.html#nord-vaucluse
pose-membrane-pvc-arme-pierrelatte.html       ──301 (meta-refresh)──► pvc-arme-drome.html#tricastin
pose-membrane-pvc-arme-valence.html           ──301 (meta-refresh)──► pvc-arme-drome.html#vallee-du-rhone
pose-membrane-pvc-arme-marseille.html         ──301 (meta-refresh)──► pvc-arme-bouches-du-rhone.html#marseille-metropole
pose-membrane-pvc-arme-aix-en-provence.html   ──301 (meta-refresh)──► pvc-arme-bouches-du-rhone.html#pays-d-aix
pose-membrane-pvc-arme-montpellier.html       ──301 (meta-refresh)──► pvc-arme-herault.html#montpellier-metropole
```

sitemap.xml : 13 URLs (7 anciennes ville retirées, 7 département ajoutées, 6 pages pilier inchangées).

---

## 6. Départements lointains du concurrent — non construits, par choix

Le concurrent (pvcarmesudest.fr) a 11 pages département, remontant jusqu'à Lyon, Saint-Étienne et les Hautes-Alpes. **Je n'ai construit que 7 pages**, correspondant à un rayon honnête d'environ 2h autour de Montélimar, cohérent avec le ton déjà établi sur le site ("étude au cas par cas au-delà de 2h"). Les 4 départements manquants — **Rhône, Loire, Hautes-Alpes, Alpes-de-Haute-Provence** — n'ont **pas** été créés.

C'est un choix, pas un oubli. Si le volume (passer à 11+ pages, comme le concurrent) devient prioritaire sur la cohérence du rayon annoncé, dis-le-moi et je construis les 4 pages manquantes — avec la même rigueur (pas de temps de trajet inventé, ton honnête sur la distance).

---

## Vérifications effectuées

- HTML bien formé + JSON-LD valide sur les 20 fichiers touchés (13 pages de contenu + 7 redirections).
- Parité FAQPage/texte visible vérifiée mot pour mot sur les 7 pages département (0 écart).
- Title (50-60 car.) et meta description (140-160 car.) vérifiés sur les 7 pages département.
- Balayage Playwright complet (13 pages × 2 viewports, scroll complet) : **0 débordement, 0 image cassée, 0 erreur console, 0 requête échouée**.
- Les 7 pages de redirection vérifiées une par une : canonical correct, refresh correct, lien de secours présent, aucun noindex.
- Plus aucune référence aux 7 anciennes URLs ville nulle part sur le site (footer, section zones d'intervention homepage), hors fichiers brouillon non suivis par git.

**Point d'attention pour Enzo :** les redirections meta-refresh ne peuvent être testées en conditions réelles qu'une fois le site déployé (en local, elles naviguent correctement vers l'URL de production, qui renvoie 404 tant que ce commit n'est pas en ligne — comportement attendu, pas un bug). Une fois GitHub Pages à jour (quelques minutes après le push), vérifie une des 7 anciennes URLs dans un navigateur pour confirmer la redirection visuelle.
