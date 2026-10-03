(() => {
  const root = document.getElementById("stack");
  if (!root) return;

  const filters = root.querySelectorAll("[data-stack-filter]");
  const groups = root.querySelectorAll("[data-stack-group]");
  const chips = root.querySelectorAll(".stack-chip");
  if (!filters.length || !groups.length) return;

  const setFilter = (key) => {
    filters.forEach((btn) => {
      const on = btn.getAttribute("data-stack-filter") === key;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });

    groups.forEach((group) => {
      const match = key === "all" || group.getAttribute("data-stack-group") === key;
      group.hidden = !match;
      group.classList.toggle("is-dimmed", false);
      if (match) {
        group.classList.remove("is-out");
        group.classList.add("is-in");
      }
    });
  };

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      setFilter(btn.getAttribute("data-stack-filter") || "all");
    });
  });

  chips.forEach((chip) => {
    chip.setAttribute("aria-pressed", "false");
    chip.addEventListener("click", () => {
      const active = chip.classList.toggle("is-lit");
      chip.setAttribute("aria-pressed", active ? "true" : "false");
    });
  });

  setFilter("all");
})();
