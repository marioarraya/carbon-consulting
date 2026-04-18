import "../styles/main.css";
import { initSmoothScroll } from "./smooth-scroll.js";
import { initReveals } from "./reveal.js";
import { initNav } from "./nav.js";
import { initContactForm } from "./contact-form.js";
import { initMotion } from "./motion.js";

function ready(fn) {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
  else fn();
}

ready(() => {
  const lenis = initSmoothScroll();
  initNav(lenis);
  initReveals();
  initMotion();
  initContactForm();

  // Hero mesh — lazy-loaded only on pages that have the canvas
  const canvas = document.querySelector("[data-hero-canvas]");
  if (canvas) {
    import("./hero-mesh.js").then(({ initHeroMesh }) => initHeroMesh(canvas));
  }

  // Harmony orb (right-side hero visual)
  const orbCanvas = document.querySelector("[data-harmony-orb]");
  if (orbCanvas) {
    import("./harmony-orb.js").then(({ initHarmonyOrb }) => initHarmonyOrb(orbCanvas));
  }

  // Body fade in
  requestAnimationFrame(() => document.body.classList.add("is-ready"));
});
