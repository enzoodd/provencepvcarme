# Plan d'action — Provence PVC Armé

*Priorisation : Critical > High > Medium > Low, dérivée de l'audit complet du 2026-08-11 (score global 60/100).*

## Phase 1 — Corrections critiques (Semaine 1)

- [ ] **Réparer le menu mobile** : corriger le CSS `.nav-inner` (ajouter un point de rupture/`flex-wrap` sous 900px dans `css/style.css`) — actuellement le header déborde de 84px à 390px et le bouton hamburger est totalement hors écran sur les 4 pages.
- [ ] **Publier les pages légales réelles** : "Mentions légales" et "Politique de confidentialité" (actuellement `href="#"` sur les 4 pages) — obligation légale (LCEN) et RGPD, aggravée par le fait que le formulaire de contact collecte nom, téléphone, email et photos du domicile.
- [ ] **Corriger l'adresse dans le schema** : `addressLocality` du JSON-LD LocalBusiness indique "Montélimar" avec le code postal 26220 (celui de Dieulefit) sur les 4 pages, contredisant le footer visible. Trancher l'adresse légale réelle et l'aligner partout.
- [ ] **Clarifier la zone de service** : "rayon d'1h autour de Montélimar" (title/meta/hero/footer) contredit le schema `areaServed` et la liste de 8 départements de la page contact (certains à plus de 2h). Choisir une seule définition cohérente.
- [ ] **Planifier la mise en ligne effective** : DNS + hébergement + certificat HTTPS — `provencepvcarme.fr` ne résout pas encore, ce qui bloque 100% de l'indexation tant que non résolu.

## Phase 2 — Améliorations à fort impact (Semaines 2-3)

- [ ] Réexporter `media/hero-poster.jpg` en résolution paysage (~1920×1080) + WebP/AVIF qualité 75-80, ajouter un `preload` — c'est le plus gros levier LCP (LCP mesuré à 4.19s, "Poor").
- [ ] Convertir la galerie de 16+ photos (réalisations/méthode/coulisses, ~5,9 Mo cumulés) en WebP avec fallback JPEG.
- [ ] Mettre les valeurs réelles des compteurs statistiques (`data-count-to`) directement dans le HTML au lieu de "0", pour garantir un contenu correct même sans exécution JS.
- [ ] Ajouter la mention SIRET, préciser la durée et la base légale de la garantie étanchéité (ou garantie décennale), mentionner la certification installateur (ex. Renolit/Alkorplan).
- [ ] Ajouter `defer`/`async` sur les scripts non critiques (GSAP/ScrollTrigger/Lenis) et épingler leurs versions exactes (comme déjà fait pour Three.js).
- [ ] Auto-héberger ou précharger les polices Google Fonts pour réduire la chaîne de rendu bloquante (~106 Ko, 3 sauts).

## Phase 3 — Contenu et autorité (Mois 2)

- [ ] Étoffer `methode.html` (section entretien, FAQ sur le process) pour atteindre ~800 mots (actuellement 463).
- [ ] Transformer `realisations.html` en véritables études de cas : 2-3 phrases par projet phare (dimensions, choix technique, délai) au lieu de légendes de 3-6 mots.
- [ ] Ajouter 3-5 témoignages clients réels ou intégrer de vrais avis Google dès qu'ils existent (zéro preuve sociale actuellement).
- [ ] Étoffer la FAQ à 8-10 questions : coût, saisonnalité, compatibilité par type de piscine (concret/coque/bois/acier — déjà proposés dans le formulaire), gestion d'une fuite après pose.
- [ ] Ajouter une fourchette de prix indicative (ex. "à partir de X €/m²") pour donner un ancrage factuel aux utilisateurs et aux assistants IA.
- [ ] Ajouter les schemas `BreadcrumbList` (fils d'Ariane déjà visibles sur méthode/réalisations/contact) et `HowTo` (process en 4 étapes déjà rédigé sur méthode.html) — coût d'implémentation quasi nul, aucun nouveau contenu requis.
- [ ] Corriger le H1 de `realisations.html` ("Avant / Après" → intégrer "PVC armé"/"piscine") et dédupliquer le bloc "Finitions" répété entre `index.html` et `methode.html`.
- [ ] Agrandir la cible tactile du bouton "Appeler" sur mobile (actuellement 46×38px, sous le seuil de 44-48px recommandé).

## Phase 4 — Suivi et itération (Continu)

- [ ] Une fois en ligne : soumettre le sitemap dans Google Search Console et Bing Webmaster Tools, configurer les en-têtes de sécurité (HSTS, CSP, X-Content-Type-Options, Referrer-Policy).
- [ ] Géocoder l'adresse validée pour ajouter `geo` (latitude/longitude) et renseigner `openingHours` dans le schema (données réelles requises, ne pas inventer).
- [ ] Créer/optimiser la fiche Google Business Profile avec la bonne catégorie ("Swimming pool contractor"/"Swimming pool repair service", pas menuiserie) et surveiller les avis.
- [ ] Revalider Core Web Vitals (les 3 pages non mesurées cette session) et GEO/citations IA une fois le site indexé et en ligne.
- [ ] Éviter de mettre à jour le `lastmod` du sitemap sans changement de contenu proportionnel.
- [ ] Ajouter un `favicon.ico`/`apple-touch-icon` en complément du SVG actuel, et une page 404 personnalisée.
- [ ] Générer une clé IndexNow au lancement pour accélérer la découverte par Bing/Yandex.
