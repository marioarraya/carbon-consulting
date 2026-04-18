import * as THREE from "three";

export function initHarmonyOrb(canvas) {
  if (!canvas) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const parent = canvas.parentElement;
  const getSize = () => {
    const rect = parent.getBoundingClientRect();
    return { w: Math.max(rect.width, 1), h: Math.max(rect.height, 1) };
  };

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const { w, h } = getSize();
  const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
  camera.position.set(0, 0, 6.2);
  camera.lookAt(0, 0, 0);

  const group = new THREE.Group();
  scene.add(group);

  const COLOR_INK = 0xb8c2d3;
  const COLOR_MUTED = 0x5a7a99;
  const COLOR_RED = 0xb43a2e;

  // --- Outer icosahedron wireframe ---
  const outerGeom = new THREE.IcosahedronGeometry(2, 2);
  const outerEdges = new THREE.EdgesGeometry(outerGeom);
  const outerMat = new THREE.LineBasicMaterial({
    color: COLOR_MUTED,
    transparent: true,
    opacity: 0.55,
  });
  const outerLines = new THREE.LineSegments(outerEdges, outerMat);
  group.add(outerLines);

  // --- Vertex dots (some accented red) ---
  const vertCount = outerGeom.attributes.position.count;
  const dotsPos = new Float32Array(vertCount * 3);
  const dotsColor = new Float32Array(vertCount * 3);
  const pAttr = outerGeom.attributes.position;
  const accentRed = new THREE.Color(COLOR_RED);
  const accentInk = new THREE.Color(COLOR_INK);
  for (let i = 0; i < vertCount; i++) {
    dotsPos[i * 3] = pAttr.getX(i);
    dotsPos[i * 3 + 1] = pAttr.getY(i);
    dotsPos[i * 3 + 2] = pAttr.getZ(i);
    const c = i % 9 === 0 ? accentRed : accentInk;
    dotsColor[i * 3] = c.r;
    dotsColor[i * 3 + 1] = c.g;
    dotsColor[i * 3 + 2] = c.b;
  }
  const dotsGeom = new THREE.BufferGeometry();
  dotsGeom.setAttribute("position", new THREE.BufferAttribute(dotsPos, 3));
  dotsGeom.setAttribute("color", new THREE.BufferAttribute(dotsColor, 3));
  const dotsMat = new THREE.PointsMaterial({
    size: 0.08,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
  });
  const dots = new THREE.Points(dotsGeom, dotsMat);
  group.add(dots);

  // --- Inner counter-rotating icosahedron ---
  const innerGeom = new THREE.IcosahedronGeometry(1.2, 1);
  const innerEdges = new THREE.EdgesGeometry(innerGeom);
  const innerMat = new THREE.LineBasicMaterial({
    color: COLOR_RED,
    transparent: true,
    opacity: 0.48,
  });
  const inner = new THREE.LineSegments(innerEdges, innerMat);
  group.add(inner);

  // --- Three orbital rings on different tilt axes ---
  const ringMat = new THREE.LineBasicMaterial({
    color: COLOR_INK,
    transparent: true,
    opacity: 0.32,
  });
  const makeRing = (radius, tiltX, tiltY) => {
    const pts = [];
    const segs = 128;
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(g, ringMat);
    line.rotation.x = tiltX;
    line.rotation.y = tiltY;
    line.userData.radius = radius;
    return line;
  };
  const ring1 = makeRing(2.55, Math.PI / 3, 0);
  const ring2 = makeRing(2.75, -Math.PI / 6, Math.PI / 4);
  const ring3 = makeRing(2.35, Math.PI / 8, -Math.PI / 3);
  group.add(ring1);
  group.add(ring2);
  group.add(ring3);

  // --- Traveling particles on each ring ---
  const travelerGeom = new THREE.SphereGeometry(0.065, 12, 12);
  const makeTraveler = (ring, color, speed, offset) => {
    const m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 });
    const mesh = new THREE.Mesh(travelerGeom, m);
    mesh.userData = { ring, speed, offset };
    group.add(mesh);
    return mesh;
  };
  const travelers = [
    makeTraveler(ring1, COLOR_RED, 0.35, 0),
    makeTraveler(ring2, 0xe8ecf3, 0.22, 1.2),
    makeTraveler(ring3, COLOR_RED, 0.48, 2.3),
    makeTraveler(ring1, 0xe8ecf3, -0.28, 3.1),
  ];

  // --- Central glow ---
  const coreGeom = new THREE.SphereGeometry(0.28, 24, 24);
  const coreMat = new THREE.MeshBasicMaterial({
    color: COLOR_RED,
    transparent: true,
    opacity: 0.75,
  });
  const core = new THREE.Mesh(coreGeom, coreMat);
  group.add(core);

  // --- Resize ---
  const resize = () => {
    const { w, h } = getSize();
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(parent);

  // --- Animation loop ---
  const clock = new THREE.Clock();
  let rafId;
  const tmpVec = new THREE.Vector3();

  const render = () => {
    const t = clock.getElapsedTime();

    outerLines.rotation.y = t * 0.12;
    outerLines.rotation.x = t * 0.06;
    dots.rotation.y = t * 0.12;
    dots.rotation.x = t * 0.06;

    inner.rotation.y = -t * 0.22;
    inner.rotation.z = t * 0.14;

    ring1.rotation.z = t * 0.1;
    ring2.rotation.z = -t * 0.08;
    ring3.rotation.z = t * 0.06;

    group.rotation.y = Math.sin(t * 0.15) * 0.25;
    group.rotation.x = Math.cos(t * 0.12) * 0.1;

    core.scale.setScalar(1 + Math.sin(t * 1.8) * 0.12);
    coreMat.opacity = 0.6 + Math.sin(t * 1.4) * 0.2;

    travelers.forEach((tr) => {
      const { ring, speed, offset } = tr.userData;
      const angle = t * speed + offset;
      tmpVec.set(Math.cos(angle) * ring.userData.radius, Math.sin(angle) * ring.userData.radius, 0);
      tmpVec.applyEuler(ring.rotation);
      tr.position.copy(tmpVec);
    });

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(render);
  };

  if (reduceMotion) renderer.render(scene, camera);
  else render();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
    } else if (!reduceMotion) {
      render();
    }
  });

  return {
    destroy() {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      renderer.dispose();
      outerGeom.dispose();
      outerEdges.dispose();
      outerMat.dispose();
      dotsGeom.dispose();
      dotsMat.dispose();
      innerGeom.dispose();
      innerEdges.dispose();
      innerMat.dispose();
      ringMat.dispose();
      travelerGeom.dispose();
      travelers.forEach((tr) => tr.material.dispose());
      coreGeom.dispose();
      coreMat.dispose();
    },
  };
}
