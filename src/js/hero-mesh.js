import * as THREE from "three";

// Simplex noise GLSL (Ashima / Ian McEwan)
const NOISE_GLSL = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m*m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform vec2  uMouse;
varying float vElev;
varying vec3  vPos;

${NOISE_GLSL}

void main() {
  vec3 pos = position;

  // Two layers of noise at different scales for organic depth
  float n1 = snoise(vec3(pos.x * uFreq,        pos.y * uFreq,        uTime * 0.05));
  float n2 = snoise(vec3(pos.x * uFreq * 2.3,  pos.y * uFreq * 2.3,  uTime * 0.08 + 100.0));

  float elev = n1 * uAmp + n2 * uAmp * 0.35;

  // Mouse lift — very subtle
  float dist = distance(pos.xy, uMouse * 4.0);
  elev += smoothstep(3.5, 0.0, dist) * 0.12;

  pos.z += elev;
  vElev = elev;
  vPos  = pos;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const FRAGMENT = /* glsl */ `
uniform vec3  uColorLow;
uniform vec3  uColorMid;
uniform vec3  uColorHigh;
uniform vec3  uAccent;
uniform float uAccentMix;
varying float vElev;
varying vec3  vPos;

void main() {
  // Map elevation to color ramp
  float t = clamp(vElev * 1.6 + 0.5, 0.0, 1.0);
  vec3 col = mix(uColorLow, uColorMid, smoothstep(0.0, 0.55, t));
  col = mix(col, uColorHigh, smoothstep(0.55, 1.0, t));

  // Accent wash — more visible near peaks
  col = mix(col, uAccent, smoothstep(0.7, 1.0, t) * uAccentMix);

  // Fog toward edges and depth
  float edge = smoothstep(3.2, 4.8, length(vPos.xy));
  col = mix(col, vec3(0.039, 0.055, 0.078), edge);

  gl_FragColor = vec4(col, 1.0);
}
`;

export function initHeroMesh(canvas) {
  if (!canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const parent = canvas.parentElement;
  const getSize = () => {
    const rect = parent.getBoundingClientRect();
    return { w: rect.width, h: rect.height };
  };

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: false,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x0a0e14, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0e14, 0.16);

  const { w, h } = getSize();
  const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
  camera.position.set(0, -2.4, 3.2);
  camera.lookAt(0, 0, 0);

  const geometry = new THREE.PlaneGeometry(9, 9, 180, 180);

  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    wireframe: true,
    transparent: false,
    uniforms: {
      uTime:       { value: 0 },
      uAmp:        { value: 0.42 },
      uFreq:       { value: 0.52 },
      uMouse:      { value: new THREE.Vector2(0, 0) },
      uColorLow:   { value: new THREE.Color(0x0f1624) }, // valley
      uColorMid:   { value: new THREE.Color(0x2a3e54) }, // mid (steel)
      uColorHigh:  { value: new THREE.Color(0x5a7a99) }, // peak
      uAccent:     { value: new THREE.Color(0xb43a2e) }, // red
      uAccentMix:  { value: 0.32 },
    },
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2.4;
  mesh.rotation.z = Math.PI / 8;
  scene.add(mesh);

  // Second sparser wireframe for depth
  const ghostMat = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    wireframe: true,
    transparent: true,
    uniforms: {
      uTime:       { value: 0 },
      uAmp:        { value: 0.55 },
      uFreq:       { value: 0.32 },
      uMouse:      { value: new THREE.Vector2(0, 0) },
      uColorLow:   { value: new THREE.Color(0x0a0e14) },
      uColorMid:   { value: new THREE.Color(0x1a2636) },
      uColorHigh:  { value: new THREE.Color(0x3e5c76) },
      uAccent:     { value: new THREE.Color(0xb43a2e) },
      uAccentMix:  { value: 0.12 },
    },
  });
  const ghostGeom = new THREE.PlaneGeometry(12, 12, 40, 40);
  const ghost = new THREE.Mesh(ghostGeom, ghostMat);
  ghost.rotation.x = -Math.PI / 2.4;
  ghost.rotation.z = -Math.PI / 7;
  ghost.position.z = -2.0;
  ghost.material.opacity = 0.35;
  scene.add(ghost);

  // Resize
  const resize = () => {
    const { w, h } = getSize();
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();

  const ro = new ResizeObserver(resize);
  ro.observe(parent);

  // Mouse parallax
  const mouse = new THREE.Vector2(0, 0);
  const target = new THREE.Vector2(0, 0);
  const onMouseMove = (e) => {
    const rect = parent.getBoundingClientRect();
    target.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    target.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };
  window.addEventListener("pointermove", onMouseMove, { passive: true });

  // Loop
  const clock = new THREE.Clock();
  let rafId;

  const render = () => {
    const t = clock.getElapsedTime();
    material.uniforms.uTime.value = t;
    ghostMat.uniforms.uTime.value = t * 0.7;

    mouse.lerp(target, 0.05);
    material.uniforms.uMouse.value.copy(mouse);
    ghostMat.uniforms.uMouse.value.copy(mouse);

    // Slow camera drift
    camera.position.x = Math.sin(t * 0.05) * 0.3 + mouse.x * 0.18;
    camera.position.y = -2.4 + Math.cos(t * 0.04) * 0.15 + mouse.y * 0.12;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(render);
  };

  if (reduceMotion) {
    // Single static frame
    material.uniforms.uTime.value = 12;
    ghostMat.uniforms.uTime.value = 12;
    renderer.render(scene, camera);
  } else {
    render();
  }

  // Pause when tab hidden
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
      window.removeEventListener("pointermove", onMouseMove);
      renderer.dispose();
      geometry.dispose();
      ghostGeom.dispose();
      material.dispose();
      ghostMat.dispose();
    },
  };
}
