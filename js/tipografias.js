(() => {
  "use strict";

  const initPaletteSwitch = () => {
    const buttons = document.querySelectorAll(".palette-swatch");
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const palette = btn.dataset.palette;
        document.body.dataset.palette = palette;

        buttons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-pressed", String(active));
        });
      });
    });
  };

  document.addEventListener("DOMContentLoaded", initPaletteSwitch);
})();
