export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  // Pre-select inquiry from query string
  const params = new URLSearchParams(window.location.search);
  const inquiry = params.get("inquiry");
  const map = {
    audit: "Website security audit",
    scan: "Network port scan",
    briefing: "Initial briefing",
  };
  if (inquiry && map[inquiry]) {
    const select = form.querySelector("select[name='inquiry']");
    if (select) {
      for (const opt of select.options) {
        if (opt.value === map[inquiry] || opt.textContent === map[inquiry]) {
          select.value = opt.value;
          break;
        }
      }
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll("[required]").forEach((input) => {
      const wrap = input.closest(".field");
      const err = wrap ? wrap.querySelector(".field__error") : null;
      if (!input.value.trim()) {
        valid = false;
        if (wrap) wrap.classList.add("is-invalid");
        if (err) err.hidden = false;
      } else {
        if (wrap) wrap.classList.remove("is-invalid");
        if (err) err.hidden = true;
      }
    });
    if (!valid) return;

    const success = document.querySelector("[data-contact-success]");
    form.hidden = true;
    if (success) {
      success.hidden = false;
      success.focus();
    }
  });

  // Clear invalid state on input
  form.querySelectorAll(".field__input, .field__select, .field__textarea").forEach((input) => {
    input.addEventListener("input", () => {
      const wrap = input.closest(".field");
      if (wrap && wrap.classList.contains("is-invalid") && input.value.trim()) {
        wrap.classList.remove("is-invalid");
        const err = wrap.querySelector(".field__error");
        if (err) err.hidden = true;
      }
    });
  });
}
