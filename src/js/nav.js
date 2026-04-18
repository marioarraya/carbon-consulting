export function initNav(lenis) {
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const overlay = document.querySelector("[data-nav-overlay]");
  const overlayClose = document.querySelector("[data-nav-close]");

  // Scroll border / blur
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 16) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function openNav() {
    if (!overlay) return;
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    if (lenis) lenis.stop();
    document.body.style.overflow = "hidden";
    const firstLink = overlay.querySelector("a");
    if (firstLink) firstLink.focus();
  }
  function closeNav() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    if (lenis) lenis.start();
    document.body.style.overflow = "";
    if (toggle) toggle.focus();
  }

  if (toggle) toggle.addEventListener("click", openNav);
  if (overlayClose) overlayClose.addEventListener("click", closeNav);
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target.tagName === "A") closeNav();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay && overlay.classList.contains("is-open")) closeNav();
  });
}
