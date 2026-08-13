(() => {
  "use strict";

  const setYear = () => {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  };

  const playHeroVideo = () => {
    const video = document.querySelector(".hero__video");
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.play().catch(() => {});
  };

  const initCompareSliders = () => {
    document.querySelectorAll("[data-compare]").forEach((el) => {
      const range = el.querySelector("[data-compare-range]");
      if (!range) return;
      const setPos = () => el.style.setProperty("--pos", `${range.value}%`);
      range.addEventListener("input", setPos);
      setPos();
    });
  };

  const revealOnScroll = () => {
    const targets = document.querySelectorAll(".reveal, .reveal-image");
    if (!targets.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const groups = new Map();
    targets.forEach((el) => {
      const parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const siblings = groups.get(entry.target.parentElement) || [entry.target];
          const index = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.max(index, 0) * 0.08}s`;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((el) => observer.observe(el));
  };

  document.addEventListener("DOMContentLoaded", () => {
    setYear();
    revealOnScroll();
    playHeroVideo();
    initCompareSliders();
  });
})();
