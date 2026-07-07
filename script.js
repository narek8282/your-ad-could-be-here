import * as THREE from "three";

const canvas = document.querySelector("#webgl");
const page = document.body.dataset.page || "home";
const pointer = new THREE.Vector2(0, 0);
const targetPointer = new THREE.Vector2(0, 0);
const clock = new THREE.Clock();
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const pageSettings = {
  home: { count: 680, radius: 6.8, colorA: 0xff3b4f, colorB: 0x58d7ff, cameraZ: 12.5 },
  concept: { count: 360, radius: 7.4, colorA: 0xd7ff58, colorB: 0xff3b4f, cameraZ: 13.5 },
  engine: { count: 720, radius: 7.8, colorA: 0x58d7ff, colorB: 0xd7ff58, cameraZ: 14.2 },
  slots: { count: 480, radius: 7.1, colorA: 0xff3b4f, colorB: 0xf3bd63, cameraZ: 13 },
  contact: { count: 300, radius: 6.5, colorA: 0xf3bd63, colorB: 0x58d7ff, cameraZ: 12.8 }
};

const settings = pageSettings[page] || pageSettings.home;
let slotEnergy = 0;
let slotPhase = 0;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x030306, 0.038);

const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 80);
camera.position.set(0, 1.2, settings.cameraZ);

const root = new THREE.Group();
scene.add(root);

const hemi = new THREE.HemisphereLight(0x93dfff, 0x1a050a, 1.6);
scene.add(hemi);

const key = new THREE.PointLight(settings.colorA, 18, 26);
key.position.set(-5, 4, 6);
scene.add(key);

const rim = new THREE.PointLight(settings.colorB, 12, 24);
rim.position.set(6, -2, -3);
scene.add(rim);

const panelGeometry = new THREE.BoxGeometry(0.72, 0.42, 0.035);
const panelMaterial = new THREE.MeshStandardMaterial({
  color: 0x111923,
  metalness: 0.7,
  roughness: 0.22,
  emissive: 0x111111,
  emissiveIntensity: 0.52
});
const panels = new THREE.InstancedMesh(panelGeometry, panelMaterial, settings.count);
panels.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
root.add(panels);

const dummy = new THREE.Object3D();
const panelData = Array.from({ length: settings.count }, (_, index) => {
  const layer = index % 9;
  const lane = index % 37;
  const golden = Math.PI * (3 - Math.sqrt(5));
  return {
    index,
    lane,
    layer,
    phase: index * golden,
    speed: 0.08 + (lane % 11) * 0.006,
    radius: settings.radius + Math.sin(index * 0.37) * 1.9 + layer * 0.06,
    yBias: (layer - 4) * 0.38,
    scale: 0.54 + ((index * 17) % 100) / 140
  };
});

const colors = [new THREE.Color(settings.colorA), new THREE.Color(settings.colorB), new THREE.Color(0xffffff)];
panelData.forEach((data, index) => {
  const color = colors[index % colors.length].clone();
  color.lerp(new THREE.Color(0x111923), 0.36 + (index % 5) * 0.08);
  panels.setColorAt(index, color);
});

const particleCount = page === "engine" ? 1800 : 1100;
const particlePositions = new Float32Array(particleCount * 3);
const particleColors = new Float32Array(particleCount * 3);
const colorA = new THREE.Color(settings.colorA);
const colorB = new THREE.Color(settings.colorB);

for (let i = 0; i < particleCount; i += 1) {
  const theta = i * 0.071;
  const radius = 2.8 + Math.sin(i * 0.019) * 2.4 + (i % 17) * 0.08;
  particlePositions[i * 3] = Math.sin(theta) * radius;
  particlePositions[i * 3 + 1] = Math.cos(i * 0.031) * 2.8;
  particlePositions[i * 3 + 2] = Math.cos(theta) * radius;
  const color = colorA.clone().lerp(colorB, (i % 100) / 100);
  particleColors[i * 3] = color.r;
  particleColors[i * 3 + 1] = color.g;
  particleColors[i * 3 + 2] = color.b;
}

const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
particleGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));
const particleMaterial = new THREE.PointsMaterial({
  size: 0.035,
  vertexColors: true,
  transparent: true,
  opacity: 0.72,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
root.add(particles);

const torusMaterial = new THREE.MeshBasicMaterial({
  color: settings.colorB,
  transparent: true,
  opacity: 0.22,
  wireframe: true
});
const rings = new THREE.Group();
for (let i = 0; i < 5; i += 1) {
  const torus = new THREE.Mesh(new THREE.TorusGeometry(2.4 + i * 0.92, 0.006, 8, 160), torusMaterial);
  torus.rotation.x = Math.PI / 2 + i * 0.17;
  torus.rotation.y = i * 0.33;
  rings.add(torus);
}
root.add(rings);

function updatePanels(time) {
  panelData.forEach((data, index) => {
    const t = time * data.speed;
    const modulation = Math.sin(time * 0.31 + data.index * 0.017);
    const theta = data.phase + t + pointer.x * 0.8;
    const radius = data.radius + modulation * 0.38 + slotEnergy * Math.sin(index * 0.1 + slotPhase) * 0.22;
    const x = Math.sin(theta) * radius;
    const y = Math.cos(time * 0.27 + data.index * 0.11) * 1.42 + data.yBias + pointer.y * 0.9;
    const z = Math.cos(theta) * radius + Math.sin(time * 0.19 + data.lane) * 0.55;

    dummy.position.set(x, y, z);
    dummy.lookAt(camera.position);
    dummy.rotateZ(Math.sin(time + data.index) * 0.12);
    const pulse = data.scale * (1 + Math.max(0, modulation) * 0.12 + slotEnergy * 0.1);
    dummy.scale.set(pulse, pulse, pulse);
    dummy.updateMatrix();
    panels.setMatrixAt(index, dummy.matrix);
  });
  panels.instanceMatrix.needsUpdate = true;
}

function updateParticles(time) {
  const positions = particleGeometry.attributes.position.array;
  for (let i = 0; i < particleCount; i += 1) {
    const offset = i * 3;
    const theta = i * 0.071 + time * (0.045 + (i % 13) * 0.001);
    const radius = 2.8 + Math.sin(i * 0.019 + time * 0.26) * 2.4 + (i % 17) * 0.08;
    positions[offset] = Math.sin(theta + pointer.x * 0.35) * radius;
    positions[offset + 1] = Math.cos(i * 0.031 + time * 0.42) * 2.8 + pointer.y * 0.55;
    positions[offset + 2] = Math.cos(theta) * radius;
  }
  particleGeometry.attributes.position.needsUpdate = true;
}

function animateCounters() {
  document.querySelectorAll("[data-counter]").forEach((node) => {
    const target = Number(node.dataset.counter);
    if (!Number.isFinite(target)) return;
    const start = performance.now();
    const duration = 1100 + target * 0.03;
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = Math.round(target * eased).toString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

function bindSlotConsole() {
  const slotButtons = document.querySelectorAll("[data-slot]");
  slotButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      slotButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      slotEnergy = 1.4;
      slotPhase = index * 0.9;
      setTimeout(() => {
        slotEnergy = 0.45;
      }, 520);
    });
  });
  slotButtons[0]?.classList.add("is-active");
  if (slotButtons.length) slotEnergy = 0.45;
}

function animate() {
  const elapsed = clock.getElapsedTime();
  pointer.lerp(targetPointer, 0.055);

  if (!reducedMotion) {
    updatePanels(elapsed);
    updateParticles(elapsed);
    root.rotation.y = elapsed * 0.055 + pointer.x * 0.17;
    root.rotation.x = -0.12 + pointer.y * 0.08;
    rings.rotation.z = elapsed * 0.09;
    rings.rotation.x = Math.PI * 0.12 + pointer.y * 0.14;
  }

  camera.position.x += (pointer.x * 1.25 - camera.position.x) * 0.035;
  camera.position.y += (1.2 + pointer.y * 0.7 - camera.position.y) * 0.035;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function onPointerMove(event) {
  const point = event.touches ? event.touches[0] : event;
  targetPointer.x = (point.clientX / window.innerWidth - 0.5) * 2;
  targetPointer.y = -(point.clientY / window.innerHeight - 0.5) * 2;
}

function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.position.z = width < 720 ? settings.cameraZ + 3.2 : settings.cameraZ;
  camera.updateProjectionMatrix();
}

window.addEventListener("pointermove", onPointerMove, { passive: true });
window.addEventListener("touchmove", onPointerMove, { passive: true });
window.addEventListener("resize", onResize);

onResize();
updatePanels(0);
updateParticles(0);
animateCounters();
bindSlotConsole();
animate();
