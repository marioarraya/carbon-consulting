# Carbon Consulting — Marketing Site (v2)

Dark, Palantir/Anduril-adjacent marketing site for Carbon Consulting. Vite + vanilla JS + Three.js (WebGL hero mesh) + GSAP ScrollTrigger + Lenis smooth scroll.

## Develop

```bash
npm install
npm run dev          # http://localhost:5173
```

## Build & preview

```bash
npm run build        # outputs dist/
npm run preview      # serves dist locally
```

Deploy `dist/` to any static host (Netlify, Vercel, S3/CloudFront, GitHub Pages). No server runtime required.

## Direction note (v1 → v2)

The original brief in `carbon-master-prompt.md` specified a light, restrained, "architecture firm" aesthetic — no gradients, no motion beyond fades, muted palette.

**v2 is a deliberate break from that brief.** The user requested a darker, more technical register — Palantir / Anduril / Bloomberg rather than Lazard / Brunswick. The v1 hard rules (§4) and reference feel (§7) no longer apply. The copy is preserved verbatim for body paragraphs; three copy slots were rewritten:

- Hero eyebrow: `Carbon Consulting · Est. 2026 · Independent`
- Hero headline: `Technology decisions, handled with structure.` (replacing the firm name)
- Closing heads: `Begin with a briefing.` (replacing `Start the conversation.`)

Keep `carbon-master-prompt.md` as the historical brief; it is no longer the governing document.

## Architecture

- **Vite multi-page app.** Each `.html` at the repo root is a Rollup entry point (see `vite.config.js`).
- **One CSS file** at `src/styles/main.css`. Design tokens at the top (`:root { --bg, --ink, --red, ... }`). Component blocks below.
- **JS modules** in `src/js/`:
  - `main.js` — entry, imports CSS + boots every module
  - `hero-mesh.js` — Three.js wireframe plane with simplex-noise vertex displacement. Custom `ShaderMaterial`. Fog, slow camera drift, mouse parallax. Renders a single static frame when `prefers-reduced-motion: reduce`. `requestAnimationFrame` paused on tab hidden.
  - `smooth-scroll.js` — Lenis, driven by the GSAP ticker. Disabled under reduced motion.
  - `reveal.js` — GSAP ScrollTrigger: toggles `.is-visible` on `[data-reveal]` elements.
  - `nav.js` — sticky-nav scroll border, mobile overlay, ESC-to-close, Lenis stop/start during overlay.
  - `contact-form.js` — query-string preselect (`?inquiry=audit|scan|briefing`), client-side required-field validation, success-block swap on submit.

## Assets

- `public/favicon.svg` — CC monogram on dark, with a red dot.
- `public/og-image.png` — **NOT INCLUDED.** Produce a 1200×630 PNG before launch (current nav pages reference it via `<meta property="og:image" content="/og-image.png" />`).

## Contact form

Client-side only. On submit, required fields are validated and a success block replaces the form — no network request is made. To accept real submissions, wire the `<form>` to Netlify Forms, Formspree, or an equivalent and remove the `e.preventDefault()` in `src/js/contact-form.js`.

## Accessibility

- Focus rings on all interactive elements (`2px red outline, 3px offset`).
- Skip link on every page (`Skip to content` → `#main`).
- `prefers-reduced-motion: reduce` disables: body fade-in, hero line-stagger, Lenis smooth scroll, ScrollTrigger reveals, scroll cue animation. Hero mesh renders a single static frame.
- `aria-current="page"` on the active nav link, per page.
- Form labels wired to inputs; required fields marked with a small red `*`.

## Browser targets

Evergreen (Chrome, Edge, Firefox, Safari — current and prior major). WebGL is required for the hero mesh; fallback is a dark background with the grid overlay and vignette (no mesh visible). No IE11 / legacy polyfills.

## What's deliberately NOT here

- No analytics, no cookie banner, no third-party trackers.
- No backend. Form is theatrical until wired.
- No dark-mode toggle; the site is dark-only.
- No photography. Typography and the Three.js mesh do all the visual work.
