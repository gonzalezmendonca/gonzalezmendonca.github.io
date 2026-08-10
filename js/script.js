(() => {
  "use strict";

  const setYear = () => {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  };

  const parallaxGlow = () => {
    const glowA = document.querySelector(".glow-wrap--a");
    const glowB = document.querySelector(".glow-wrap--b");
    if (!glowA || !glowB) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener("pointermove", (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    const tick = () => {
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;
      glowA.style.transform = `translate(${currentX * 18}px, ${currentY * 18}px)`;
      glowB.style.transform = `translate(${currentX * -14}px, ${currentY * -14}px)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  document.addEventListener("DOMContentLoaded", () => {
    setYear();
    parallaxGlow();
  });
})();
