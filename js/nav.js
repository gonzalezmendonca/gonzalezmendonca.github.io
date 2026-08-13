(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector("[data-nav-toggle]");
    const menu = document.querySelector("[data-nav-menu]");
    if (!toggle || !menu) return;

    const lines = toggle.querySelectorAll(".nav__toggle-line");
    const ring = toggle.querySelector(".nav__toggle-ring");
    const badge = menu.querySelector(".nav__menu-badge svg");
    const items = menu.querySelectorAll(".nav__menu-item");
    const links = menu.querySelectorAll("[data-nav-link]");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasGsap = typeof window.gsap !== "undefined";

    let isOpen = false;
    let isAnimating = false;

    links.forEach((link) => link.setAttribute("tabindex", "-1"));

    // ---- Idle rotation on the ring text (GSAP-driven) ----
    if (hasGsap && !reduceMotion) {
      if (ring) gsap.to(ring, { rotation: 360, duration: 26, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
      if (badge) gsap.to(badge, { rotation: 360, duration: 32, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
    }

    // ---- Magnetic hover on the toggle circle ----
    if (hasGsap && !reduceMotion && window.matchMedia("(hover: hover)").matches) {
      const quickX = gsap.quickTo(toggle, "x", { duration: 0.5, ease: "power3" });
      const quickY = gsap.quickTo(toggle, "y", { duration: 0.5, ease: "power3" });

      toggle.addEventListener("mousemove", (e) => {
        const rect = toggle.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        quickX(relX * 0.3);
        quickY(relY * 0.3);
      });

      toggle.addEventListener("mouseleave", () => {
        quickX(0);
        quickY(0);
      });
    }

    const setLinksTabbable = (tabbable) => {
      links.forEach((link) => link.setAttribute("tabindex", tabbable ? "0" : "-1"));
    };

    const openMenu = () => {
      if (isOpen || isAnimating) return;
      isAnimating = true;
      isOpen = true;

      const rect = toggle.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const maxR = Math.hypot(
        Math.max(cx, window.innerWidth - cx),
        Math.max(cy, window.innerHeight - cy)
      ) * 1.05;

      document.documentElement.classList.add("nav-open");
      toggle.classList.add("is-active");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Cerrar menú");
      menu.setAttribute("aria-hidden", "false");
      menu.classList.add("is-visible");
      setLinksTabbable(true);

      if (!hasGsap || reduceMotion) {
        menu.style.clipPath = "circle(150% at 100% 0%)";
        menu.classList.add("is-open");
        if (hasGsap) gsap.set(items, { opacity: 1, yPercent: 0, rotate: 0 });
        isAnimating = false;
        return;
      }

      menu.style.clipPath = `circle(0px at ${cx}px ${cy}px)`;
      const state = { r: 0 };

      gsap.timeline({
        onComplete: () => {
          isAnimating = false;
          menu.classList.add("is-open");
        }
      })
        .to(state, {
          r: maxR,
          duration: 1.05,
          ease: "power4.inOut",
          onUpdate: () => {
            menu.style.clipPath = `circle(${state.r}px at ${cx}px ${cy}px)`;
          }
        }, 0)
        .to(lines[0], { rotate: 45, y: 3.4, duration: 0.4, ease: "power2.inOut" }, 0)
        .to(lines[1], { rotate: -45, y: -3.4, duration: 0.4, ease: "power2.inOut" }, 0)
        .fromTo(items,
          { yPercent: 120, rotate: 5, opacity: 0 },
          { yPercent: 0, rotate: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.055 },
          0.35
        );
    };

    const closeMenu = () => {
      if (!isOpen || isAnimating) return;
      isAnimating = true;
      isOpen = false;

      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú");
      menu.setAttribute("aria-hidden", "true");
      menu.classList.remove("is-open");
      setLinksTabbable(false);

      const finish = () => {
        isAnimating = false;
        menu.classList.remove("is-visible");
        document.documentElement.classList.remove("nav-open");
      };

      if (!hasGsap || reduceMotion) {
        menu.style.clipPath = "circle(0px at 100% 0%)";
        finish();
        return;
      }

      const rect = toggle.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const state = { r: Math.hypot(window.innerWidth, window.innerHeight) };

      gsap.timeline({ onComplete: finish })
        .to(lines[0], { rotate: 0, y: 0, duration: 0.35, ease: "power2.inOut" }, 0)
        .to(lines[1], { rotate: 0, y: 0, duration: 0.35, ease: "power2.inOut" }, 0)
        .to(items, { yPercent: -30, opacity: 0, duration: 0.3, ease: "power2.in", stagger: 0.02 }, 0)
        .to(state, {
          r: 0,
          duration: 0.75,
          ease: "power3.inOut",
          onUpdate: () => {
            menu.style.clipPath = `circle(${state.r}px at ${cx}px ${cy}px)`;
          }
        }, 0.08);
    };

    toggle.addEventListener("click", () => {
      isOpen ? closeMenu() : openMenu();
    });

    links.forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) closeMenu();
    });

    window.addEventListener("resize", () => {
      if (isOpen && (!hasGsap || reduceMotion)) return;
      if (isOpen) {
        const rect = toggle.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        menu.style.clipPath = `circle(150% at ${cx}px ${cy}px)`;
      }
    });
  });
})();
