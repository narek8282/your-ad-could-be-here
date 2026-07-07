const canvas = document.querySelector(".signal-canvas");
const context = canvas.getContext("2d");
const particles = [];
let pointerX = 0.5;
let pointerY = 0.5;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function seedParticles() {
  particles.length = 0;
  const count = Math.min(120, Math.max(52, Math.floor(window.innerWidth / 14)));

  for (let index = 0; index < count; index += 1) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      z: Math.random(),
      speed: 0.12 + Math.random() * 0.48,
      size: 0.8 + Math.random() * 2.6,
      hot: Math.random() > 0.78
    });
  }
}

function draw() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle, index) => {
    const parallaxX = (pointerX - 0.5) * particle.z * 44;
    const parallaxY = (pointerY - 0.5) * particle.z * 28;

    particle.y += particle.speed;
    if (particle.y > window.innerHeight + 16) {
      particle.y = -16;
      particle.x = Math.random() * window.innerWidth;
    }

    const x = particle.x + parallaxX;
    const y = particle.y + parallaxY;
    const alpha = 0.16 + particle.z * 0.46;

    context.fillStyle = particle.hot
      ? `rgba(255, 75, 75, ${alpha})`
      : `rgba(105, 216, 255, ${alpha * 0.72})`;
    context.fillRect(x, y, particle.size, particle.size);

    const next = particles[index + 1];
    if (next && Math.abs(next.x - particle.x) < 96 && Math.abs(next.y - particle.y) < 74) {
      context.strokeStyle = `rgba(255, 255, 255, ${0.025 + particle.z * 0.035})`;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(next.x + parallaxX, next.y + parallaxY);
      context.stroke();
    }
  });

  requestAnimationFrame(draw);
}

window.addEventListener("pointermove", (event) => {
  pointerX = event.clientX / window.innerWidth;
  pointerY = event.clientY / window.innerHeight;
});

window.addEventListener("resize", () => {
  resizeCanvas();
  seedParticles();
});

resizeCanvas();
seedParticles();
draw();
