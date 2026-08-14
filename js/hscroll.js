(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".hscroll");
    if (!sections.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
    if (reduceMotion || !hasGsap) return;

    gsap.registerPlugin(ScrollTrigger);

    // El desplazamiento lateral queda reservado a desktop/tablet grande:
    // en touch el paneo horizontal atado al scroll vertical se siente forzado.
    ScrollTrigger.matchMedia({
      "(min-width: 981px)": function () {
        sections.forEach((section) => {
          const track = section.querySelector(".hscroll__track");
          if (!track) return;

          gsap.fromTo(
            track,
            { xPercent: 18, opacity: 0.4 },
            {
              xPercent: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "top 30%",
                scrub: 0.6,
              },
            }
          );
        });

        return () => {
          gsap.set(Array.from(sections).map((s) => s.querySelector(".hscroll__track")).filter(Boolean), {
            clearProps: "all",
          });
        };
      },
    });
  });
})();
