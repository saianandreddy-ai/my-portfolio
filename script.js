// Typing Animation
const typingText = document.getElementById('typing-text');
const titles = [
    "Generative AI Engineer",
    "LLM Architect",
    "RAG Specialist",
    "Cloud AI Builder"
];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentTitle = titles[titleIndex];

    if (!isDeleting) {
        typingText.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentTitle.length) {
            isDeleting = true;
            setTimeout(typeWriter, 2000);
            return;
        }
    } else {
        typingText.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
        }
    }

    const typingSpeed = isDeleting ? 100 : 150;
    setTimeout(typeWriter, typingSpeed);
}

// Start typing animation
typeWriter();

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Observe skill categories
document.querySelectorAll('.skill-category').forEach((category, index) => {
    category.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(category);
});

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.15}s`;
    observer.observe(item);
});

// Mouse cursor glow
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = 0;
let mouseY = 0;
let glowX = 0;
let glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateCursorGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;

    cursorGlow.style.left = `${glowX - 10}px`;
    cursorGlow.style.top = `${glowY - 10}px`;

    requestAnimationFrame(updateCursorGlow);
}

updateCursorGlow();

// Sticky navbar blur effect
const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
});

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Smooth scroll for navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for navbar height
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }

        // Close mobile menu
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Skill pills animation stagger
document.querySelectorAll('.skill-pills').forEach(pills => {
    const skillPills = pills.querySelectorAll('.skill-pill');
    skillPills.forEach((pill, index) => {
        pill.style.animationDelay = `${index * 0.1}s`;
    });
});

// Hero buttons functionality (placeholder)
document.querySelector('.btn-primary').addEventListener('click', () => {
    // Scroll to experience section
    const experienceSection = document.getElementById('experience');
    const offsetTop = experienceSection.offsetTop - 80;
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
});

document.querySelector('.btn-secondary').addEventListener('click', () => {
    // Placeholder for resume download
    alert('Resume download functionality would be implemented here');
});

// LinkedIn button functionality
document.querySelector('.linkedin-btn').addEventListener('click', () => {
    window.open('https://www.linkedin.com/in/saianandreddysingareddy/', '_blank');
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Use debounced scroll handler for navbar
const debouncedScroll = debounce(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 10);

window.addEventListener('scroll', debouncedScroll);