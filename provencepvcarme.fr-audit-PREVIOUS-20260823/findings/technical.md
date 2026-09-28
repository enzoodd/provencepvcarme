# Audit Technique SEO — provencepvcarme.fr

Date : 2026-08-18
Site : https://provencepvcarme.fr (GitHub Pages + CDN Fastly, domaine custom)

Note de contexte : le domaine résout désormais correctement (DNS OK). Le Critical
"DNS ne résout pas" de l'audit précédent (score 71/100) n'est plus d'actualité et
est retiré de ce rapport.

## Score technique : 78/100

Méthodologie : vérifications live sur robots.txt, sitemap.xml, canonicals (4 pages
principales), en-têtes HTTP de sécurité, CNAME, redirections HTTP→HTTPS et www→apex,
poids de page, alt text images, données structurées, usage JS. Audit volontairement
ciblé (non exhaustif) sur demande.

---

## 1. Crawlability — PASS

- `robots.txt` accessible (200), règle `Allow: /` pour tous les user-agents,
  déclare correctement `Sitemap: https://provencepvcarme.fr/sitemap.xml`.
- `sitemap.xml` accessible (200), valide (urlset), 6 URLs listées : accueil,
  methode.html, realisations.html, contact.html, mentions-legales.html,
  confidentialite.html. `lastmod` cohérents (2026-08-09 / 2026-08-12).
- Aucune balise `noindex` détectée sur les 4 pages principales vérifiées.

## 2. Indexability — PASS

- Canonical présent et auto-référent sur les 4 pages principales :
  - index → `https://provencepvcarme.fr/`
  - methode.html → `https://provencepvcarme.fr/methode.html`
  - realisations.html → `https://provencepvcarme.fr/realisations.html`
  - contact.html → `https://provencepvcarme.fr/contact.html`
- Titres uniques et descriptifs par page (pas de duplication détectée sur
  l'échantillon vérifié).
- Aucun signe de contenu dupliqué/thin content sur les pages inspectées.

## 3. Security — MEDIUM ISSUES

- HTTPS actif, certificat valide (réponse 200 en HTTPS).
- Redirection `http://` → `https://` fonctionnelle (301).
- Redirection `www.` → apex fonctionnelle (301).
- **Absents** dans les en-têtes de réponse de la page live : `Strict-Transport-Security`
  (HSTS), `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`. GitHub Pages ne permet pas nativement
  l'ajout d'en-têtes custom pour les domaines personnalisés ; un proxy CDN
  (Cloudflare en mode proxy, ou Fastly Compute) serait nécessaire pour les injecter.

## 4. URL Structure — PASS

- URLs propres, en minuscules, sans paramètres, structure plate
  (`/methode.html`, `/realisations.html`, `/contact.html`).
- Un seul saut de redirection observé pour http→https et www→apex (pas de
  chaînes de redirections multiples).

## 5. Mobile — PASS

- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  présent sur les 4 pages vérifiées.

## 6. Core Web Vitals (indices depuis le code source) — PASS partiel

- Poids HTML raisonnable par page (13-22 Ko transférés, hors assets) :
  accueil ~22,5 Ko, methode ~18,8 Ko, realisations ~14,4 Ko, contact ~13,7 Ko.
- Images en lazy-loading (`loading="lazy"`) sur les visuels sous la ligne de
  flottaison (finitions, avant/après) — bon point pour LCP/bande passante.
- Pas de mesure réelle de LCP/INP/CLS possible depuis une simple analyse de
  source (nécessite Lighthouse/CrUX) — non exécuté dans cette passe rapide.
- Point de vigilance : vérifier que l'image hero (probable candidate LCP)
  n'est pas elle-même en lazy-load et qu'elle est correctement dimensionnée
  (`width`/`height` ou `aspect-ratio`) pour limiter le CLS.

## 7. Structured Data — PASS

- 2 blocs `application/ld+json` détectés sur la page d'accueil (cohérent avec
  le commit récent "ajoute le schema FAQPage sur l'accueil"). Validation fine
  du schéma (types, champs requis) non exécutée dans cette passe rapide.

## 8. JavaScript Rendering — PASS

- Contenu textuel présent directement dans le HTML brut servi (pas de coquille
  vide type SPA) ; 6 balises `<script>` sur l'accueil, usage JS limité à de
  l'amélioration progressive (animations au scroll, etc.), pas de dépendance
  bloquante pour l'indexation du contenu principal.

## 9. IndexNow Protocol — NOT VERIFIED

- Non testé dans cette passe rapide (nécessiterait une clé IndexNow dédiée).

---

## Findings priorisés

### Critical
Aucun.

### High
Aucun.

### Medium
1. **En-têtes de sécurité HTTP manquants** (HSTS, CSP, X-Content-Type-Options,
   X-Frame-Options, Referrer-Policy). Impact SEO indirect (Core Web Vitals /
   confiance) et risque sécurité (clickjacking, MIME-sniffing).
   Recommandation : placer un proxy Cloudflare (mode proxied, gratuit) devant
   le domaine GitHub Pages pour injecter ces en-têtes via des règles de
   transformation, ou migrer vers un hébergeur supportant les en-têtes custom
   (Netlify `_headers`, Cloudflare Pages `_headers`).

### Low
1. **Vérifier l'image LCP de la page d'accueil** : s'assurer qu'elle n'est pas
   `loading="lazy"` et qu'elle a des dimensions explicites pour limiter le CLS.
   À confirmer par un test Lighthouse/PageSpeed Insights réel (non exécuté ici).
2. **IndexNow non vérifié** : envisager son implémentation (Bing/Yandex/Naver)
   pour accélérer l'indexation après les mises à jour de contenu récentes.
3. **Sitemap** : seulement 6 URLs, cohérent avec la taille actuelle du site ;
   penser à le régénérer automatiquement si de nouvelles pages sont ajoutées
   (ex. futures pages de zones géographiques desservies).

---

## Fichiers/sources consultés
- https://provencepvcarme.fr/robots.txt (live)
- https://provencepvcarme.fr/sitemap.xml (live)
- https://provencepvcarme.fr/ , /methode.html , /realisations.html , /contact.html (live, headers + HTML)
- C:\Users\oddon\Desktop\provencepvcarme\CNAME (présence confirmée localement)
