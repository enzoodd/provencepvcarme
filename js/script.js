// Provence PVC Armé — interactions
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktopViewport = window.innerWidth >= 768;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const hasLenis = !!window.Lenis;

  if (hasGSAP) window.gsap.registerPlugin(window.ScrollTrigger);

  // Lenis — inertial smooth scroll. Desktop only: touch devices already have
  // great native momentum scrolling, and Lenis is really a mouse-wheel refinement.
  // Skipped entirely under prefers-reduced-motion.
  let lenis = null;
  if (hasLenis && !prefersReducedMotion && isDesktopViewport) {
    lenis = new window.Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    if (hasGSAP) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap.ticker.add((time) => lenis.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  // Seam progress bar (top, horizontal) + seam rail (left, vertical, fills as you scroll)
  const seam = document.getElementById("seamProgress");
  const seamRailFill = document.getElementById("seamRailFill");
  function setSeam(pct) {
    if (seam) seam.style.width = pct + "%";
    if (seamRailFill) seamRailFill.style.height = pct + "%";
  }
  if (hasGSAP) {
    window.ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => setSeam(self.progress * 100),
    });
  } else {
    const h = document.documentElement;
    function updateSeam() {
      const height = h.scrollHeight - h.clientHeight;
      setSeam(height > 0 ? (h.scrollTop / height) * 100 : 0);
    }
    document.addEventListener("scroll", updateSeam, { passive: true });
    updateSeam();
  }

  // Nav — solidifies (deeper background/shadow) once the page has scrolled a bit
  const siteNav = document.getElementById("siteNav");
  function updateNavScrolled() {
    if (siteNav) siteNav.classList.toggle("nav--scrolled", window.scrollY > 8);
  }
  document.addEventListener("scroll", updateNavScrolled, { passive: true });
  updateNavScrolled();

  // Hero video — subtle parallax drift while the hero is in view (never on text)
  const heroVideo = document.querySelector(".hero-video");
  const heroSection = document.querySelector(".hero--video");
  if (heroVideo && heroSection && !prefersReducedMotion) {
    if (hasGSAP) {
      window.gsap.to(heroVideo, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: heroSection, start: "top top", end: "bottom top", scrub: true },
      });
    } else {
      let parallaxTicking = false;
      function applyParallax() {
        parallaxTicking = false;
        const heroHeight = heroSection.offsetHeight;
        if (window.scrollY > heroHeight) return;
        const progress = Math.min(window.scrollY / heroHeight, 1);
        heroVideo.style.transform = "translateY(" + progress * 8 + "%)";
      }
      document.addEventListener(
        "scroll",
        function () {
          if (!parallaxTicking) {
            parallaxTicking = true;
            requestAnimationFrame(applyParallax);
          }
        },
        { passive: true }
      );
    }
  }

  // Mobile nav burger — opens a dropdown, closable via outside click, Escape, or picking a link
  const burger = document.getElementById("navBurger");
  const navLinks = document.querySelector(".nav-links");
  if (burger && navLinks) {
    function closeNav() {
      burger.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("nav-links--open");
    }
    function openNav() {
      burger.setAttribute("aria-expanded", "true");
      navLinks.classList.add("nav-links--open");
    }
    burger.addEventListener("click", function () {
      const expanded = burger.getAttribute("aria-expanded") === "true";
      if (expanded) closeNav(); else openNav();
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("click", function (e) {
      if (burger.getAttribute("aria-expanded") !== "true") return;
      if (!navLinks.contains(e.target) && !burger.contains(e.target)) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
        closeNav();
        burger.focus();
      }
    });
  }

  // Key facts tabs — click switches panel and highlights the selected card
  // (simple border/background state change only, no ripple/scale effects)
  const tabChips = document.querySelectorAll(".tab-chip");
  const tabPanels = document.querySelectorAll(".tab-panel");
  tabChips.forEach((chip) => {
    chip.addEventListener("click", function () {
      const target = chip.getAttribute("data-tab");

      tabChips.forEach((c) => {
        c.classList.remove("is-active");
        c.setAttribute("aria-selected", "false");
      });
      chip.classList.add("is-active");
      chip.setAttribute("aria-selected", "true");

      tabPanels.forEach((p) => {
        p.classList.toggle("is-active", p.getAttribute("data-panel") === target);
      });
    });
  });

  // Finish folders — the 3 sample chips fan out progressively as the user
  // scrolls through the section (see the ScrollTrigger scrub setup further
  // down); CLOSED/OPEN below are the two endpoints it interpolates between,
  // and also drive the static reduced-motion / no-GSAP fallback.
  const FINISH_CHIP_CLOSED = [
    { x: 8, y: 6, rotate: -6 },
    { x: 0, y: 0, rotate: 0 },
    { x: -8, y: 6, rotate: 6 },
  ];
  const FINISH_CHIP_OPEN = [
    { x: -72, y: -18, rotate: -14 },
    { x: 0, y: -32, rotate: 0 },
    { x: 72, y: -18, rotate: 14 },
  ];
  function applyFinishFan(chips, progress) {
    const eased = 1 - Math.pow(1 - progress, 2);
    chips.forEach((chip, i) => {
      const c = FINISH_CHIP_CLOSED[i];
      const o = FINISH_CHIP_OPEN[i];
      const x = c.x + (o.x - c.x) * eased;
      const y = c.y + (o.y - c.y) * eased;
      const r = c.rotate + (o.rotate - c.rotate) * eased;
      chip.style.transform = "translate(" + x.toFixed(2) + "px, " + y.toFixed(2) + "px) rotate(" + r.toFixed(2) + "deg)";
    });
  }

  // generic water-drop ripple on any button tagged .ripple-btn
  document.querySelectorAll(".ripple-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX || rect.width / 2) - rect.left;
      const y = (e.clientY || rect.height / 2) - rect.top;
      const size = Math.max(rect.width, rect.height) * 1.6;

      const ripple = document.createElement("span");
      ripple.className = "btn-ripple";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.style.width = size + "px";
      ripple.style.height = size + "px";
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });

  // before/after toggle — click swaps photo; GSAP adds a circular wipe from
  // the click point on top of the base CSS crossfade when available
  document.querySelectorAll(".ba-toggle").forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      const isAfter = toggle.classList.toggle("is-after");
      const tag = toggle.querySelector(".ba-tag");
      const hintLabel = toggle.querySelector(".ba-hint-label");
      if (tag) tag.textContent = isAfter ? "Après" : "Avant";
      if (hintLabel) hintLabel.textContent = isAfter ? "Voir avant" : "Voir après";

      if (hasGSAP && !prefersReducedMotion) {
        const revealImg = toggle.querySelector(isAfter ? ".ba-img-after" : ".ba-img-before");
        const rect = toggle.getBoundingClientRect();
        const originX = e.clientX ? ((e.clientX - rect.left) / rect.width) * 100 : 50;
        const originY = e.clientY ? ((e.clientY - rect.top) / rect.height) * 100 : 50;
        window.gsap.fromTo(
          revealImg,
          { clipPath: "circle(0% at " + originX + "% " + originY + "%)" },
          { clipPath: "circle(145% at " + originX + "% " + originY + "%)", duration: 0.85, ease: "power3.inOut" }
        );
      }
    });
  });

  // Devis form — placeholder submit handling (no backend wired yet)
  const form = document.getElementById("devisForm");
  const formStatus = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      const original = btn.textContent;
      btn.textContent = "Demande envoyée ✓";
      btn.disabled = true;
      if (formStatus) formStatus.textContent = "Votre demande a bien été envoyée. Nous vous recontactons sous 24h.";
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
        if (formStatus) formStatus.textContent = "";
      }, 3000);
      // TODO: brancher un vrai endpoint (Formspree, Netlify Forms, etc.)
    });
  }

  // Stat count-up (150/100e, <24h, 8 départements) — always falls back to the
  // final value so reduced-motion/no-JS users never see a stuck "0"
  function setCountFinal(el) {
    el.textContent = el.getAttribute("data-count-to");
  }
  function animateCount(el) {
    if (el.hasAttribute("data-counted")) return;
    el.setAttribute("data-counted", "true");
    const target = parseInt(el.getAttribute("data-count-to"), 10);
    if (!Number.isFinite(target)) return;
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out-cubic
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }
  if (prefersReducedMotion || !hasGSAP) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-count-to]").forEach(setCountFinal);
    }
  }

  // ---------- Scroll-driven entrance animations ----------
  if (hasGSAP && !prefersReducedMotion) {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    function revealGroup(selector, buildVars, opts) {
      opts = opts || {};
      const stagger = opts.stagger || 0.08;
      const ease = opts.ease || "power3.out";
      const duration = opts.duration || 0.8;
      const mod = opts.mod || 4;
      gsap.utils.toArray(selector).forEach((el, i) => {
        const vars = typeof buildVars === "function" ? buildVars(el, i) : buildVars;
        gsap.from(
          el,
          Object.assign({}, vars, {
            duration: duration,
            ease: ease,
            delay: (i % mod) * stagger,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onStart: function () {
              el.querySelectorAll("[data-count-to]").forEach(animateCount);
            },
          })
        );
      });
    }

    revealGroup(".process-step", { y: 40, opacity: 0, scale: 0.97 }, { stagger: 0.12, ease: "power3.out", duration: 0.9 });
    revealGroup(".finish-folder", { y: 28, opacity: 0, scale: 0.94 }, { stagger: 0.08, ease: "expo.out", duration: 0.8 });
    revealGroup(".membrane-scene", { y: 30, opacity: 0, scale: 0.97 }, { stagger: 0, ease: "power3.out", duration: 1 });
    revealGroup(
      ".compare-card",
      (el, i) => ({ x: i % 2 === 0 ? -60 : 60, opacity: 0 }),
      { stagger: 0.15, ease: "power3.out", duration: 0.9, mod: 2 }
    );
    revealGroup(".tab-chip", { y: 24, opacity: 0, scale: 0.94 }, { stagger: 0.08, ease: "back.out(1.6)", duration: 0.8 });
    revealGroup(
      ".ba-pair:not(.ba-pair--teaser)",
      (el, i) => ({ y: 40, opacity: 0, rotate: i % 2 === 0 ? -2.5 : 2.5 }),
      { stagger: 0.12, ease: "power3.out", duration: 0.9 }
    );
    // Homepage teaser pairs get a bolder, more deliberate wave: bigger lift,
    // scale-in from slightly under 1, snappier easing than the standard reveal.
    revealGroup(
      ".ba-pair--teaser",
      { y: 50, opacity: 0, scale: 0.95 },
      { stagger: 0.16, ease: "expo.out", duration: 0.9 }
    );
    revealGroup(".faq-item", { y: 16, opacity: 0 }, { stagger: 0.06, ease: "power2.out", duration: 0.6 });
    revealGroup(".detail-strip img", { scale: 0.9, opacity: 0 }, { stagger: 0.06, ease: "power2.out", duration: 0.7 });
    revealGroup(".zones-list span", { y: 8, opacity: 0 }, { stagger: 0.04, ease: "power1.out", duration: 0.45, mod: 8 });

    // "Pourquoi nous choisir" cards — staggered lift-in, each icon's ring
    // draws itself in right after the card settles.
    const RING_CIRCUMFERENCE = 163.4;
    gsap.utils.toArray(".diff-card").forEach((card, i) => {
      const ring = card.querySelector(".diff-icon-ring circle");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: card, start: "top 85%", once: true },
        delay: i * 0.12,
      });
      tl.from(card, { y: 30, opacity: 0, duration: 0.7, ease: "power3.out" });
      if (ring) {
        tl.fromTo(
          ring,
          { strokeDashoffset: RING_CIRCUMFERENCE },
          { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" },
          "-=0.4"
        );
      }
    });

    // Finish folders — the fan-out is scrubbed to scroll position (mirrors the
    // membrane 3D cross-section pattern): closed at the top of the section,
    // fully fanned once the section reaches the middle of the viewport. Each
    // folder gets a slight stagger off the same shared progress for a soft
    // wave across the row instead of all three snapping open in lockstep.
    document.querySelectorAll(".finish-folders").forEach((group) => {
      const folders = Array.from(group.querySelectorAll(".finish-folder"));
      if (!folders.length) return;
      const chipsByFolder = folders.map((folder) => folder.querySelectorAll(".finish-chip"));
      ScrollTrigger.create({
        trigger: group,
        start: "top bottom",
        end: "center center",
        scrub: 0.6,
        onUpdate: (self) => {
          folders.forEach((folder, i) => {
            const stagger = i * 0.12;
            const local = Math.max(0, Math.min(1, (self.progress - stagger) / (1 - stagger)));
            applyFinishFan(chipsByFolder[i], local);
          });
        },
      });
    });

    window.addEventListener("load", () => ScrollTrigger.refresh());
  } else {
    // Finish folders — no scroll-scrub available here (reduced motion, or GSAP
    // failed to load): show every sample already fanned out rather than stuck
    // in a stacked pile nobody can open.
    document.querySelectorAll(".finish-folder").forEach((folder) => {
      applyFinishFan(folder.querySelectorAll(".finish-chip"), 1);
    });

    // ---------- Fallback: IntersectionObserver reveal (no GSAP / reduced motion) ----------
    if (!prefersReducedMotion && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
              el.addEventListener(
                "transitionend",
                function handler() {
                  el.style.transition = "";
                  el.removeEventListener("transitionend", handler);
                },
                { once: true }
              );
              el.querySelectorAll("[data-count-to]").forEach(animateCount);
              io.unobserve(el);
            }
          });
        },
        { threshold: 0.15 }
      );

      const revealGroups = [
        ".process-step",
        ".diff-card",
        ".finish-folder",
        ".compare-card",
        ".tab-chip",
        ".ba-pair",
        ".faq-item",
        ".detail-strip img",
      ];
      revealGroups.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el, i) => {
          el.style.opacity = "0";
          el.style.transform = "translateY(16px)";
          el.style.transition =
            "opacity 0.6s cubic-bezier(0.16,1,0.3,1) " + (i % 4) * 0.08 + "s, " +
            "transform 0.6s cubic-bezier(0.16,1,0.3,1) " + (i % 4) * 0.08 + "s";
          io.observe(el);
        });
      });

      document.querySelectorAll(".zones-list span").forEach((el, i) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(8px)";
        el.style.transition =
          "opacity 0.45s cubic-bezier(0.16,1,0.3,1) " + (i % 8) * 0.05 + "s, " +
          "transform 0.45s cubic-bezier(0.16,1,0.3,1) " + (i % 8) * 0.05 + "s";
        io.observe(el);
      });
    }
  }
})();
