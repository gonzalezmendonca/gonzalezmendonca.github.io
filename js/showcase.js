(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector(".showcase");
    const pin = document.querySelector("[data-showcase]");
    const track = document.querySelector("[data-showcase-track]");
    if (!wrapper || !pin || !track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
    if (reduceMotion || !hasGsap) return;

    gsap.registerPlugin(ScrollTrigger);

    // Igual que el resto de las secciones .hscroll: el paneo lateral atado
    // al scroll vertical queda reservado a desktop/tablet grande.
    ScrollTrigger.matchMedia({
      "(min-width: 981px)": function () {
        wrapper.classList.add("is-pinned");

        // La frase recorre todo su ancho (no solo lo que sobra del viewport)
        // para que termine de salir por la izquierda antes de despinear.
        const getDistance = () => track.scrollWidth;
        // Más scroll vertical del que ocupa el paneo en píxeles: hace que el
        // recorrido se sienta más largo/pesado en vez de 1:1 con el mouse.
        const scrollMultiplier = 1.6;

        const st = ScrollTrigger.create({
          trigger: wrapper,
          start: "top top",
          end: () => "+=" + getDistance() * scrollMultiplier,
          scrub: 0.6,
          pin: pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          animation: gsap.to(track, { x: () => -getDistance(), ease: "none" }),
        });

        return () => {
          wrapper.classList.remove("is-pinned");
          gsap.set(track, { clearProps: "transform" });
          st.kill();
        };
      },
    });
  });
})();
