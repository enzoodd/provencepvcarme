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

  // Mobile nav burger
  const burger = document.getElementById("navBurger");
  const navLinks = document.querySelector(".nav-links");
  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      const expanded = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!expanded));
      navLinks.classList.toggle("nav-links--open");
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

  // Devis form — placeholder submit handling (no backend wired yet)
  const form = document.getElementById("devisForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      const original = btn.textContent;
      btn.textContent = "Demande envoyée ✓";
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
      }, 3000);
      // TODO: brancher un vrai endpoint (Formspree, Netlify Forms, etc.)
    });
  }

  // Scroll-reveal for sections (subtle, respects reduced motion)
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduced && "IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(".process-step, .finish-card, .testimonial, .compare-card");
    revealTargets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)";
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach((el) => io.observe(el));
  }
})();
