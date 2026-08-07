// Provence PVC Armé — interactions
(function () {
  "use strict";

  // Seam progress bar (top, horizontal) + seam rail (left, vertical, fills as you scroll)
  const seam = document.getElementById("seamProgress");
  const seamRailFill = document.getElementById("seamRailFill");
  function updateSeam() {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const height = h.scrollHeight - h.clientHeight;
    const pct = height > 0 ? (scrolled / height) * 100 : 0;
    if (seam) seam.style.width = pct + "%";
    if (seamRailFill) seamRailFill.style.height = pct + "%";
  }
  document.addEventListener("scroll", updateSeam, { passive: true });
  updateSeam();

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

  // before/after toggle — click swaps photo with a crossfade
  document.querySelectorAll(".ba-toggle").forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const isAfter = toggle.classList.toggle("is-after");
      const tag = toggle.querySelector(".ba-tag");
      const hintLabel = toggle.querySelector(".ba-hint-label");
      if (tag) tag.textContent = isAfter ? "Après" : "Avant";
      if (hintLabel) hintLabel.textContent = isAfter ? "Voir avant" : "Voir après";
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

  // Scroll-reveal for sections (subtle, staggered, respects reduced motion)
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            // drop the reveal-only inline transition once it has run, so hover/press
            // states go back to using each component's own CSS-authored transition
            // (otherwise a hover box-shadow etc. would inherit the reveal's timing/delay forever)
            el.addEventListener(
              "transitionend",
              function handler() {
                el.style.transition = "";
                el.removeEventListener("transitionend", handler);
              },
              { once: true }
            );
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    // groups revealed individually so each grid staggers on its own rhythm
    // rather than one long cascade across the whole page
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
      const els = document.querySelectorAll(selector);
      els.forEach((el, i) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(16px)";
        el.style.transition =
          "opacity 0.6s cubic-bezier(0.16,1,0.3,1) " + (i % 4) * 0.08 + "s, " +
          "transform 0.6s cubic-bezier(0.16,1,0.3,1) " + (i % 4) * 0.08 + "s";
        io.observe(el);
      });
    });

    // zones chips get a lighter, quicker stagger (small inline tags, not cards)
    document.querySelectorAll(".zones-list span").forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
      el.style.transition =
        "opacity 0.45s cubic-bezier(0.16,1,0.3,1) " + (i % 8) * 0.05 + "s, " +
        "transform 0.45s cubic-bezier(0.16,1,0.3,1) " + (i % 8) * 0.05 + "s";
      io.observe(el);
    });
  }
})();
