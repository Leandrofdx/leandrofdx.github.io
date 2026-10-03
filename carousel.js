(() => {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const track = root.querySelector(".carousel__track");
  const section = root.closest("section") || root.parentElement;
  const prev = section.querySelector("[data-carousel-prev]");
  const next = section.querySelector("[data-carousel-next]");
  if (!track || !prev || !next) return;

  const step = () => {
    const slide = track.querySelector(".carousel__slide");
    if (!slide) return 300;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "16") || 16;
    return slide.getBoundingClientRect().width + gap;
  };

  const update = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
  };

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -step(), behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    track.scrollBy({ left: step(), behavior: "smooth" });
  });

  track.addEventListener("scroll", () => {
    window.clearTimeout(track._t);
    track._t = window.setTimeout(update, 60);
  }, { passive: true });

  window.addEventListener("resize", update);
  update();
})();
