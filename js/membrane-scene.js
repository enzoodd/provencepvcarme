// Provence PVC Armé — 3D exploded cross-section of the membrane (Three.js)
// Self-contained module: reads GSAP/ScrollTrigger off window (loaded classically
// in index.html before this module runs) so it can drive its own scroll sync.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

(function init() {
  const container = document.getElementById("membraneScene");
  const canvas = document.getElementById("membraneCanvas");
  if (!container || !canvas) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // ---------- renderer ----------
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = !isMobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 1.85, 4.1);
  camera.lookAt(0, -0.08, 0);

  // studio-style environment for soft, realistic PBR reflections on the PVC layers
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  // ---------- lighting rig (key / fill / rim / hemisphere) ----------
  const key = new THREE.DirectionalLight(0xfff2df, 2.4);
  key.position.set(2.6, 4, 3);
  key.castShadow = !isMobile;
  if (!isMobile) {
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 6;
    key.shadow.bias = -0.0025;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 10;
    key.shadow.camera.left = -2.2;
    key.shadow.camera.right = 2.2;
    key.shadow.camera.top = 2.2;
    key.shadow.camera.bottom = -2.2;
  }
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x8fd6de, 0.6); // lagon-tinted cool fill, softens shadow side
  fill.position.set(-3, 1.3, -1.2);
  scene.add(fill);

  const rim = new THREE.PointLight(0xc9a876, 22, 9, 2); // gold rim/accent light
  rim.position.set(-1.6, 1.1, -2.4);
  scene.add(rim);

  const hemi = new THREE.HemisphereLight(0xf5f3ed, 0x0b2b3c, 0.55); // paper sky / marine ground fill
  scene.add(hemi);

  // ---------- ground shadow catcher ----------
  let ground = null;
  if (!isMobile) {
    ground = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.ShadowMaterial({ opacity: 0.22 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.62;
    ground.receiveShadow = true;
    scene.add(ground);
  }

  // ---------- woven polyester texture (procedural, no external image) ----------
  function createWeaveTexture() {
    const size = isMobile ? 128 : 256;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#c9a876";
    ctx.fillRect(0, 0, size, size);
    const strands = 9;
    const step = size / strands;
    ctx.lineWidth = step * 0.62;
    ctx.strokeStyle = "rgba(245,243,237,0.5)";
    for (let i = 0; i < strands; i++) {
      const y = step * i + step / 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(139,109,58,0.55)";
    for (let i = 0; i < strands; i++) {
      const x = step * i + step / 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(7, 3.2);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = isMobile ? 1 : 4;
    return tex;
  }

  // ---------- geometry & materials ----------
  const LAYER_W = 3.5;
  const LAYER_D = 1.7;
  const LAYER_H = 0.16;
  const CORE_H = 0.13;
  const bevelSegments = isMobile ? 2 : 4;

  const skinGeo = new RoundedBoxGeometry(LAYER_W, LAYER_H, LAYER_D, bevelSegments, 0.05);
  const coreGeo = new RoundedBoxGeometry(LAYER_W, CORE_H, LAYER_D, bevelSegments, 0.03);

  const topMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x9fd8dc),
    roughness: 0.22,
    metalness: 0,
    transmission: 0.38,
    thickness: 0.5,
    clearcoat: 0.7,
    clearcoatRoughness: 0.15,
    ior: 1.42,
    envMapIntensity: 1.3,
  });
  const bottomMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xe6ddc9),
    roughness: 0.3,
    metalness: 0,
    transmission: 0.22,
    thickness: 0.5,
    clearcoat: 0.5,
    clearcoatRoughness: 0.25,
    ior: 1.4,
    envMapIntensity: 1.1,
  });
  const coreMat = new THREE.MeshStandardMaterial({
    map: createWeaveTexture(),
    roughness: 0.8,
    metalness: 0.05,
    envMapIntensity: 0.5,
  });

  const group = new THREE.Group();
  const topLayer = new THREE.Mesh(skinGeo, topMat);
  const coreLayer = new THREE.Mesh(coreGeo, coreMat);
  const bottomLayer = new THREE.Mesh(skinGeo, bottomMat);
  [topLayer, coreLayer, bottomLayer].forEach((m) => {
    m.castShadow = !isMobile;
    m.receiveShadow = !isMobile;
    group.add(m);
  });
  group.rotation.y = -0.36;
  group.rotation.x = 0.08;
  scene.add(group);

  // ---------- explode state (driven by scroll, eased) ----------
  const REST_OFFSET = LAYER_H / 2 + CORE_H / 2;
  const MAX_EXTRA = 0.82;
  let scrollProgress = prefersReducedMotion ? 0.55 : 0;
  let displayProgress = scrollProgress;

  function layerOffsets(p) {
    const extra = p * MAX_EXTRA;
    return { top: REST_OFFSET + extra, bottom: -(REST_OFFSET + extra) };
  }

  // ---------- pointer tilt (desktop, fine pointer only — subtle, no autorotation) ----------
  const baseRotation = { x: group.rotation.x, y: group.rotation.y };
  let tiltTargetX = 0;
  let tiltTargetY = 0;
  let tiltCurrentX = 0;
  let tiltCurrentY = 0;

  if (isFinePointer && !isMobile && !prefersReducedMotion) {
    container.addEventListener("pointermove", (e) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      tiltTargetY = nx * 0.35;
      tiltTargetX = ny * 0.22;
    });
    container.addEventListener("pointerleave", () => {
      tiltTargetX = 0;
      tiltTargetY = 0;
    });
  }

  // ---------- labels (manual 3D → screen projection, no CSS2DRenderer needed) ----------
  const labelEls = {
    top: container.querySelector('.membrane-label[data-layer="top"]'),
    core: container.querySelector('.membrane-label[data-layer="core"]'),
    bottom: container.querySelector('.membrane-label[data-layer="bottom"]'),
  };
  const anchorLocal = new THREE.Vector3();
  const anchorWorld = new THREE.Vector3();

  function updateLabel(el, mesh, offsetY) {
    if (!el) return;
    anchorLocal.set(LAYER_W / 2 - 0.35, offsetY, LAYER_D / 4);
    anchorWorld.copy(anchorLocal);
    group.localToWorld(anchorWorld);
    anchorWorld.project(camera);
    const w = container.clientWidth;
    const h = container.clientHeight;
    const x = (anchorWorld.x * 0.5 + 0.5) * w;
    const y = (-anchorWorld.y * 0.5 + 0.5) * h;
    el.style.transform = "translate(" + x.toFixed(1) + "px, " + y.toFixed(1) + "px)";
    const fade = Math.max(0, Math.min(1, (displayProgress - 0.12) / 0.5));
    el.style.opacity = String(fade);
  }

  // ---------- resize ----------
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(container);

  // ---------- visibility-gated render loop ----------
  let isVisible = false;
  let loopRunning = false;

  function renderFrame() {
    const offsets = layerOffsets(displayProgress);
    topLayer.position.y = offsets.top;
    bottomLayer.position.y = offsets.bottom;

    tiltCurrentX += (tiltTargetX - tiltCurrentX) * 0.08;
    tiltCurrentY += (tiltTargetY - tiltCurrentY) * 0.08;
    group.rotation.x = baseRotation.x + tiltCurrentX;
    group.rotation.y = baseRotation.y + tiltCurrentY + displayProgress * 0.1;

    updateLabel(labelEls.top, topLayer, offsets.top);
    updateLabel(labelEls.core, coreLayer, 0);
    updateLabel(labelEls.bottom, bottomLayer, offsets.bottom);

    container.classList.toggle("is-explored", displayProgress > 0.12);

    renderer.render(scene, camera);
  }

  function tick() {
    if (!isVisible) {
      loopRunning = false;
      return;
    }
    displayProgress += (scrollProgress - displayProgress) * 0.09;
    renderFrame();
    requestAnimationFrame(tick);
  }
  function startLoop() {
    if (loopRunning) return;
    loopRunning = true;
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) startLoop();
        });
      },
      { threshold: 0.05 }
    ).observe(container);
  } else {
    isVisible = true;
    startLoop();
  }

  // static single frame for reduced-motion users (no continuous rAF loop)
  if (prefersReducedMotion) {
    resize();
    renderFrame();
    window.addEventListener("resize", () => {
      resize();
      renderFrame();
    });
  }

  // ---------- scroll-driven explode, via the shared GSAP/ScrollTrigger instance ----------
  if (!prefersReducedMotion && window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.create({
      trigger: container,
      start: "top 78%",
      end: "bottom 45%",
      scrub: 0.6,
      onUpdate: (self) => {
        scrollProgress = self.progress;
      },
    });
    window.addEventListener("load", () => window.ScrollTrigger.refresh());
  }
})();
