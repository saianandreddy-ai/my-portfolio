const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = mobileMenu.querySelectorAll('a');
const pageSpotlight = document.querySelector('.page-spotlight');
const sections = document.querySelectorAll('.section');
const stats = document.querySelectorAll('.stat-card span');
const observerOptions = { threshold: 0.2 };
let hovered = false;

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
