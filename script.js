const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = mobileMenu.querySelectorAll('a');
const pageSpotlight = document.querySelector('.page-spotlight');
const sections = document.querySelectorAll('.section');
const stats = document.querySelectorAll('.stat-card span');
const observerOptions = { threshold: 0.2 };
let hovered = false;

// Particle effect setup
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedY = Math.random() * 0.3 + 0.1;
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.y += this.speedY;
    if (this.y > canvas.height) {
      this.y = -10;
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    ctx.fillStyle = `rgba(200, 169, 110, ${this.opacity})`;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let particle of particles) {
    particle.update();
    particle.draw();
  }

  requestAnimationFrame(animateParticles);
}

// Initialize particles
resizeCanvas();
initParticles();
animateParticles();

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

function lerp(start, end, t) {
  return start + (end - start) * t;
}

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 40;
  navbar.classList.toggle('scrolled', scrolled);
});

menuToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('mousemove', (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  const currentX = parseFloat(pageSpotlight.dataset.x || mouseX);
  const currentY = parseFloat(pageSpotlight.dataset.y || mouseY);
  const nextX = lerp(currentX, mouseX, 0.12);
  const nextY = lerp(currentY, mouseY, 0.12);
  pageSpotlight.style.left = `${nextX}px`;
  pageSpotlight.style.top = `${nextY}px`;
  pageSpotlight.dataset.x = nextX;
  pageSpotlight.dataset.y = nextY;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

sections.forEach(section => revealObserver.observe(section));

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStats();
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

statObserver.observe(document.querySelector('.hero-section'));

function animateStats() {
  const values = [10, 5, 30];
  stats.forEach((stat, index) => {
    const target = values[index];
    let current = 0;
    const increment = target / 40;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      stat.textContent = index === 2 ? `${Math.round(current)}%` : `${Math.round(current)}+`;
    }, 25);
  });
}

window.addEventListener('load', () => {
  pageSpotlight.dataset.x = window.innerWidth / 2;
  pageSpotlight.dataset.y = window.innerHeight / 2;
});
