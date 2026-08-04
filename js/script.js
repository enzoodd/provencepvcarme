// Provence PVC Armé — interactions
(function () {
  "use strict";

  // Seam progress bar (scroll indicator tied to the weld-line signature)
  const seam = document.getElementById("seamProgress");
  function updateSeam() {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const height = h.scrollHeight - h.clientHeight;
    const pct = height > 0 ? (scrolled / height) * 100 : 0;
    if (seam) seam.style.width = pct + "%";
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
