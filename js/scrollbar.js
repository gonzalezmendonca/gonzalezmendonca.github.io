(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const rail = document.querySelector("[data-scrollbar]");
    const track = document.querySelector("[data-scrollbar-track]");
    const fill = document.querySelector("[data-scrollbar-fill]");
    const pct = document.querySelector("[data-scrollbar-pct]");
    const topFill = document.querySelector("[data-scrollbar-top-fill]");
    if ((!rail || !track || !fill) && !topFill) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ticks = track
      ? Array.from(document.querySelectorAll('[data-nav-link][href^="#"]'))
          .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
          .filter(Boolean)
          .map((target) => {
            const el = document.createElement("span");
            el.className = "scrollbar__tick";
            el.setAttribute("data-scrollbar-tick", "");
            track.appendChild(el);
            el.addEventListener("click", (e) => {
              e.stopPropagation();
              target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
            });
            return { el, target };
          })
      : [];

    const maxScroll = () => Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

    const layoutTicks = () => {
      if (!track) return;
      const trackHeight = track.clientHeight;
      const max = maxScroll();
      ticks.forEach(({ el, target }) => {
        const top = target.getBoundingClientRect().top + window.scrollY;
        const frac = Math.min(1, Math.max(0, top / max));
        el.style.top = `${frac * trackHeight}px`;
      });
    };

    const update = () => {
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll()));
      if (fill) fill.style.transform = `scaleY(${progress})`;
      if (topFill) topFill.style.transform = `scaleX(${progress})`;
      if (pct) pct.textContent = String(Math.round(progress * 100)).padStart(2, "0");

      const midline = window.innerHeight * 0.5;
      ticks.forEach(({ el, target }) => {
        el.classList.toggle("is-active", target.getBoundingClientRect().top <= midline);
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    layoutTicks();
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      layoutTicks();
      update();
    });

    if (track) {
      track.addEventListener("click", (e) => {
        if (e.target.closest("[data-scrollbar-tick]")) return;
        const rect = track.getBoundingClientRect();
        const frac = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
        window.scrollTo({ top: frac * maxScroll(), behavior: reduceMotion ? "auto" : "smooth" });
      });
    }
  });
})();
