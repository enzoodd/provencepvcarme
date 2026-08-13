// Provence PVC Armé — animated water ripple shader (Three.js), discreet
// background layer for the dark "Notre signature" section.
import * as THREE from "three";

(function init() {
  const canvas = document.getElementById("waterCanvas");
  if (!canvas) return;
  const section = canvas.closest("section");
  if (!section) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
  camera.position.set(0, 0, 2.1);

  const segX = isMobile ? 30 : 90;
  const segY = isMobile ? 18 : 54;
  const geometry = new THREE.PlaneGeometry(1, 1, segX, segY);

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color(0x0b2b3c) },
      uLagon: { value: new THREE.Color(0x1c8c94) },
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying float vElevation;

      float wave(vec2 pos, vec2 dir, float freq, float speed, float amp, float time) {
        return sin(dot(pos, dir) * freq + time * speed) * amp;
      }

      void main() {
        vUv = uv;
        vec3 pos = position;
        float e = 0.0;
        e += wave(pos.xy, normalize(vec2(1.0, 0.35)), 3.2, 0.55, 0.045, uTime);
        e += wave(pos.xy, normalize(vec2(-0.55, 1.0)), 4.6, 0.38, 0.03, uTime);
        e += wave(pos.xy, normalize(vec2(0.3, -1.0)), 7.8, 0.8, 0.015, uTime);
        pos.z += e;
        vElevation = e;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uDeep;
      uniform vec3 uLagon;
      varying vec2 vUv;
      varying float vElevation;

      void main() {
        // stay close to deep marine everywhere; only wave crests glint
        vec3 color = mix(uDeep, uLagon, 0.26 + vUv.y * 0.14);
        float crestSharp = pow(clamp(vElevation * 12.0, 0.0, 1.0), 2.4);
        color += crestSharp * vec3(0.55, 0.82, 0.78) * 0.85;

        // concentrated in the lower half of the section, invisible near the
        // heading/lede so text contrast is never at risk
        float verticalMask = smoothstep(0.2, 0.55, vUv.y) * smoothstep(1.0, 0.75, vUv.y);
        float sideMask = smoothstep(0.0, 0.35, vUv.x) * smoothstep(1.0, 0.55, vUv.x);
        float alpha = 0.46 * verticalMask * mix(1.0, sideMask, 0.6);
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });

  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -0.12;
  scene.add(plane);

  function fitPlane() {
    const w = section.clientWidth;
    const h = section.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const dist = camera.position.z;
    const visibleH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * dist;
    const visibleW = visibleH * camera.aspect;
    plane.scale.set(visibleW * 1.08, visibleH * 1.35, 1);
  }
  fitPlane();
  new ResizeObserver(fitPlane).observe(section);

  let isVisible = false;
  let loopRunning = false;
  let t = 0;

  function renderFrame() {
    renderer.render(scene, camera);
  }

  function tick(now) {
    if (!isVisible) {
      loopRunning = false;
      return;
    }
    t = prefersReducedMotion ? t + 0.002 : now * 0.001;
    material.uniforms.uTime.value = t;
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
    ).observe(section);
  } else {
    isVisible = true;
    startLoop();
  }

  if (prefersReducedMotion) {
    renderFrame();
  }
})();
