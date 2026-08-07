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

  // Key facts tabs — click switches panel, spawns a water-drop ripple at the tap point
  const tabChips = document.querySelectorAll(".tab-chip");
  const tabPanels = document.querySelectorAll(".tab-panel");
  tabChips.forEach((chip) => {
    chip.addEventListener("click", function (e) {
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

      // ripple positioned at the click coordinates within the chip
      const rect = chip.getBoundingClientRect();
      const x = (e.clientX || rect.width / 2) - rect.left;
      const y = (e.clientY || rect.height / 2) - rect.top;
      const size = Math.max(rect.width, rect.height) * 1.8;

      const ripple = document.createElement("span");
      ripple.className = "chip-ripple";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.style.width = size + "px";
      ripple.style.height = size + "px";
      chip.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });

    // water-splash droplets on hover (desktop / fine pointers only)
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      chip.addEventListener("mouseenter", function () {
        const dropCount = 7;
        for (let i = 0; i < dropCount; i++) {
          const angle = (Math.PI * 2 * i) / dropCount + (Math.random() * 0.4 - 0.2);
          const distance = 26 + Math.random() * 22;
          const dx = Math.cos(angle) * distance;
          const dy = Math.sin(angle) * distance - 8; // slight upward bias, like a splash
          const drop = document.createElement("span");
          drop.className = "splash-drop";
          drop.style.setProperty("--dx", dx + "px");
          drop.style.setProperty("--dy", dy + "px");
          drop.style.animationDelay = Math.random() * 0.05 + "s";
          chip.appendChild(drop);
          drop.addEventListener("animationend", () => drop.remove());
        }
      });
    }
  });

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

  // Membrane detail video — deferred below the fold: only fetched/played once
  // the section is about to scroll into view, paused again once it leaves
  const featureVideo = document.querySelector(".feature-video-el");
  if (featureVideo && "IntersectionObserver" in window) {
    let featureVideoLoaded = false;
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!featureVideoLoaded) {
              featureVideoLoaded = true;
              featureVideo.load();
            }
            featureVideo.play().catch(() => {});
          } else {
            featureVideo.pause();
          }
        });
      },
      { rootMargin: "200px 0px" }
    ).observe(featureVideo);
  } else if (featureVideo) {
    featureVideo.play().catch(() => {});
  }

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
    revealGroup(".finish-card", { y: 28, opacity: 0, scale: 0.94 }, { stagger: 0.08, ease: "expo.out", duration: 0.8 });
    revealGroup(".membrane-scene", { y: 30, opacity: 0, scale: 0.97 }, { stagger: 0, ease: "power3.out", duration: 1 });
    revealGroup(".feature-video", { opacity: 0, scale: 1.03 }, { stagger: 0, ease: "power2.out", duration: 1 });
    revealGroup(
      ".compare-card",
      (el, i) => ({ x: i % 2 === 0 ? -60 : 60, opacity: 0 }),
      { stagger: 0.15, ease: "power3.out", duration: 0.9, mod: 2 }
    );
    revealGroup(".tab-chip", { y: 24, opacity: 0, scale: 0.94 }, { stagger: 0.08, ease: "back.out(1.6)", duration: 0.8 });
    revealGroup(
      ".ba-pair",
      (el, i) => ({ y: 40, opacity: 0, rotate: i % 2 === 0 ? -2.5 : 2.5 }),
      { stagger: 0.12, ease: "power3.out", duration: 0.9 }
    );
    revealGroup(
      ".testimonial",
      (el, i) => ({ y: 32, opacity: 0, rotate: i === 0 ? -1.5 : i === 2 ? 1.5 : 0 }),
      { stagger: 0.1, ease: "power3.out", duration: 0.8, mod: 3 }
    );
    revealGroup(".faq-item", { y: 16, opacity: 0 }, { stagger: 0.06, ease: "power2.out", duration: 0.6 });
    revealGroup(".detail-strip img", { scale: 0.9, opacity: 0 }, { stagger: 0.06, ease: "power2.out", duration: 0.7 });
    revealGroup(".zones-list span", { y: 8, opacity: 0 }, { stagger: 0.04, ease: "power1.out", duration: 0.45, mod: 8 });

    const mm = gsap.matchMedia();

    // ---- Desktop-only: custom cursor ----
    mm.add("(min-width: 768px) and (pointer: fine)", function () {
      // Custom cursor — a ring that magnetises toward interactive elements
      const cursor = document.createElement("div");
      cursor.className = "custom-cursor";
      cursor.innerHTML = '<div class="custom-cursor-ring"></div><div class="custom-cursor-dot"></div>';
      document.body.appendChild(cursor);
      document.documentElement.classList.add("has-custom-cursor");

      const xTo = gsap.quickTo(cursor, "x", { duration: 0.45, ease: "power3" });
      const yTo = gsap.quickTo(cursor, "y", { duration: 0.45, ease: "power3" });

      function onMove(e) {
        xTo(e.clientX);
        yTo(e.clientY);
        cursor.classList.add("is-visible");
      }
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));

      const magneticTargets = document.querySelectorAll(
        ".ripple-btn, .hero-scroll-cue, .zones-list span, .nav-links a, .footer-col a, .faq-item summary"
      );
      magneticTargets.forEach((el) => {
        el.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
        el.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
      });

      // photos/swatches/3D panels get the larger "media" cursor instead of the button one
      const mediaTargets = document.querySelectorAll(
        ".ba-toggle, .finish-swatch, .process-img, .feature-video, .detail-strip img, .membrane-scene"
      );
      mediaTargets.forEach((el) => {
        el.addEventListener("mouseenter", () => cursor.classList.add("is-media"));
        el.addEventListener("mouseleave", () => cursor.classList.remove("is-media"));
      });

      return function cleanup() {
        document.removeEventListener("mousemove", onMove);
        cursor.remove();
        document.documentElement.classList.remove("has-custom-cursor");
      };
    });

    window.addEventListener("load", () => ScrollTrigger.refresh());
  } else {
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
        ".finish-card",
        ".testimonial",
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
