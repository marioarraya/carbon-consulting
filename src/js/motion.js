import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initMotion() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  // Image parallax
  document.querySelectorAll("[data-parallax]").forEach((el) => {
    const speed = parseFloat(el.dataset.parallax) || 0.2;
    gsap.fromTo(
      el,
      { yPercent: -speed * 50 },
      {
        yPercent: speed * 50,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("[data-parallax-host]") || el.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });

  // Number counter
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.countDecimals) || 0;
    const prefix = el.dataset.countPrefix || "";
    const obj = { val: 0 };
    el.textContent = prefix + "0";
    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = prefix + obj.val.toFixed(decimals);
          },
        });
      },
    });
  });

  // Stagger child entrance for grids
  document.querySelectorAll("[data-stagger]").forEach((grid) => {
    const items = Array.from(grid.children);
    if (!items.length) return;
    gsap.set(items, { opacity: 0, y: 28 });
    ScrollTrigger.create({
      trigger: grid,
      start: "top 82%",
      once: true,
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: "power2.out",
        });
      },
    });
  });

  // Marquee — pause on hover
  document.querySelectorAll("[data-marquee]").forEach((marquee) => {
    marquee.addEventListener("mouseenter", () => marquee.classList.add("is-paused"));
    marquee.addEventListener("mouseleave", () => marquee.classList.remove("is-paused"));
  });

  // Spiral / vortex transition
  document.querySelectorAll("[data-spiral]").forEach((host) => {
    buildSpiral(host);
    const rings = host.querySelectorAll(".spiral__ring");
    rings.forEach((ring) => {
      const speed = parseFloat(ring.dataset.speed) || 1;
      gsap.to(ring, {
        rotation: 360 * speed,
        ease: "none",
        transformOrigin: "400px 400px",
        scrollTrigger: {
          trigger: host,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    });
    const inner = host.querySelector(".spiral__inner");
    if (inner) {
      gsap.fromTo(
        inner,
        { scale: 0.55, opacity: 0.35 },
        {
          scale: 1.15,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: host,
            start: "top bottom",
            end: "center center",
            scrub: 1,
          },
        }
      );
    }
    const label = host.querySelector(".spiral__label");
    if (label) {
      gsap.fromTo(
        label,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: host,
            start: "top 30%",
            end: "center center",
            scrub: true,
          },
        }
      );
    }
  });

  // Section divider line draw
  document.querySelectorAll(".section-divider").forEach((d) => {
    ScrollTrigger.create({
      trigger: d,
      start: "top 90%",
      once: true,
      onEnter: () => d.classList.add("is-visible"),
    });
  });

  // Why — horizontal pinned scroll (desktop only)
  const whySection = document.querySelector("[data-why-scroll]");
  if (whySection && window.matchMedia("(min-width: 901px)").matches) {
    const slides = whySection.querySelector(".why__slides");
    if (slides) {
      const getShift = () => Math.max(0, slides.scrollWidth - window.innerWidth);
      gsap.to(slides, {
        x: () => -getShift(),
        ease: "none",
        scrollTrigger: {
          trigger: whySection,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${getShift()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }
  }

  // Getting started — sequential card reveal + progress line fill
  const startPath = document.querySelector("[data-start-path]");
  if (startPath) {
    const cards = startPath.querySelectorAll(".start__card");
    const fill = startPath.querySelector(".start__progress-fill");
    ScrollTrigger.create({
      trigger: startPath,
      start: "top 75%",
      once: true,
      onEnter: () => {
        cards.forEach((c) => c.classList.add("is-active"));
        if (fill) {
          gsap.to(fill, {
            attr: { "stroke-dashoffset": 0 },
            duration: 1.4,
            ease: "power2.inOut",
            delay: 0.15,
          });
        }
      },
    });
  }
}

function buildSpiral(host) {
  const svg = host.querySelector(".spiral__svg");
  if (!svg) return;
  const NS = "http://www.w3.org/2000/svg";
  const rings = [
    { count: 6,  radius: 70,  size: 4,   speed: 1.2,  accent: 1 },
    { count: 14, radius: 130, size: 3.2, speed: -0.9, accent: 0 },
    { count: 22, radius: 200, size: 2.8, speed: 0.7,  accent: 2 },
    { count: 30, radius: 275, size: 2.4, speed: -0.55, accent: 0 },
    { count: 40, radius: 355, size: 2,   speed: 0.4,  accent: 3 },
    { count: 52, radius: 430, size: 1.6, speed: -0.3, accent: 0 },
  ];
  rings.forEach((ring, idx) => {
    const g = document.createElementNS(NS, "g");
    g.classList.add("spiral__ring");
    g.dataset.speed = ring.speed;
    const accentEvery = ring.accent ? Math.floor(ring.count / ring.accent) : 0;
    for (let j = 0; j < ring.count; j++) {
      const angle = (j / ring.count) * Math.PI * 2;
      const x = 400 + Math.cos(angle) * ring.radius;
      const y = 400 + Math.sin(angle) * ring.radius;
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", x.toFixed(2));
      c.setAttribute("cy", y.toFixed(2));
      c.setAttribute("r", ring.size);
      c.classList.add("spiral__dot");
      const isAccent = accentEvery && j % accentEvery === 0;
      if (isAccent) c.classList.add("spiral__dot--accent");
      const baseOpacity = 0.25 + 0.6 * (1 - idx / rings.length);
      c.setAttribute("opacity", isAccent ? Math.min(0.95, baseOpacity + 0.25).toFixed(2) : baseOpacity.toFixed(2));
      g.appendChild(c);
    }
    svg.appendChild(g);
  });

  // Faint connecting arcs across rings
  const arcs = document.createElementNS(NS, "g");
  arcs.classList.add("spiral__ring");
  arcs.dataset.speed = "0.2";
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2;
    const r1 = 70, r2 = 430;
    const x1 = 400 + Math.cos(a) * r1, y1 = 400 + Math.sin(a) * r1;
    const x2 = 400 + Math.cos(a) * r2, y2 = 400 + Math.sin(a) * r2;
    const path = document.createElementNS(NS, "path");
    const cx = 400 + Math.cos(a + 0.4) * 250;
    const cy = 400 + Math.sin(a + 0.4) * 250;
    path.setAttribute("d", `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`);
    path.classList.add("spiral__line");
    path.setAttribute("opacity", "0.35");
    arcs.appendChild(path);
  }
  svg.appendChild(arcs);
}
