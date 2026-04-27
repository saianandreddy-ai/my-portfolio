const body = document.body;
const stormCanvas = document.getElementById('stormCanvas');
const loadingScreen = document.getElementById('loadingScreen');
const loadingFill = document.getElementById('loadingFill');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
const mobileLinks = Array.from(document.querySelectorAll('.mobile-nav a'));
const buttons = Array.from(document.querySelectorAll('.button, .button-mobile'));
const stats = document.querySelectorAll('.stat-value');
const sections = Array.from(document.querySelectorAll('.section, .hero-section'));
const interactiveCards = Array.from(document.querySelectorAll('.interactive-card'));
const deLorean = document.getElementById('deLorean');
const deLoreanLabel = document.querySelector('.deLorean-label');
const trailLeft = document.querySelector('.trail.trail-left');
const trailRight = document.querySelector('.trail.trail-right');
const vroomText = document.getElementById('vroomText');
const heroWordWraps = Array.from(document.querySelectorAll('.hero-word-wrap'));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let deLoreanX = window.innerWidth / 2 - 40;
let deLoreanY = window.innerHeight / 2 - 18;
let deLoreanTargetX = deLoreanX;
let deLoreanTargetY = deLoreanY;
let deLoreanLastMove = performance.now();
let deLoreanFacing = 'right';

const canvasContext = stormCanvas.getContext('2d');
let rainDrops = [];
let sparks = [];
let lightningActive = false;
let lastLightning = 0;
let visible = true;
let width = 0;
let height = 0;

function setCanvasSize() {
  width = window.innerWidth;
  height = window.innerHeight;
  stormCanvas.width = width * window.devicePixelRatio;
  stormCanvas.height = height * window.devicePixelRatio;
  stormCanvas.style.width = width + 'px';
  stormCanvas.style.height = height + 'px';
  canvasContext.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function createParticles() {
  rainDrops = [];
  const count = window.innerWidth < 768 ? 140 : 260;
  for (let i = 0; i < count; i += 1) {
    rainDrops.push({
      x: Math.random() * width * 1.2 - width * 0.1,
      y: Math.random() * height,
      length: 12 + Math.random() * 16,
      speed: 20 + Math.random() * 28,
      opacity: 0.02 + Math.random() * 0.03,
      tilt: 12,
    });
  }
  sparks = [];
  const sparkCount = window.innerWidth < 768 ? 20 : 30;
  for (let i = 0; i < sparkCount; i += 1) {
    sparks.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1 + Math.random() * 2,
      vx: Math.random() * 0.8 - 0.4,
      vy: Math.random() * 0.4 - 0.2,
      opacity: 0.2 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    });
  }
}

function drawBackground(timestamp) {
  if (!visible) return;
  canvasContext.clearRect(0, 0, width, height);
  const gradient = canvasContext.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#050508');
  gradient.addColorStop(1, '#0a0508');
  canvasContext.fillStyle = gradient;
  canvasContext.fillRect(0, 0, width, height);

  rainDrops.forEach((drop) => {
    canvasContext.strokeStyle = `rgba(255,255,255,${drop.opacity})`;
    canvasContext.lineWidth = 1;
    canvasContext.beginPath();
    canvasContext.moveTo(drop.x, drop.y);
    canvasContext.lineTo(drop.x + drop.tilt, drop.y + drop.length);
    canvasContext.stroke();
    drop.x += drop.speed * 0.02;
    drop.y += drop.speed * 0.9;
    if (drop.y > height) {
      drop.y = -drop.length;
      drop.x = Math.random() * width * 1.2 - width * 0.1;
    }
    if (drop.x > width + 20) {
      drop.x = -20;
    }
  });

  sparks.forEach((spark) => {
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.phase += 0.06;
    if (spark.x < 0 || spark.x > width || spark.y < 0 || spark.y > height) {
      spark.x = Math.random() * width;
      spark.y = Math.random() * height;
    }
    const opacity = spark.opacity * (0.4 + Math.sin(spark.phase) * 0.6);
    canvasContext.fillStyle = `rgba(0, 207, 255, ${opacity})`;
    canvasContext.beginPath();
    canvasContext.arc(spark.x, spark.y, spark.radius, 0, Math.PI * 2);
    canvasContext.fill();
  });

  const now = performance.now();
  if (!lightningActive && now - lastLightning > 4000 + Math.random() * 4000) {
    lightningActive = true;
    lastLightning = now;
  }

  if (lightningActive) {
    const flash = 0.03;
    canvasContext.fillStyle = `rgba(255,255,255,${flash})`;
    canvasContext.fillRect(0, 0, width, height);
    if (now - lastLightning > 150) lightningActive = false;
  }

  requestAnimationFrame(drawBackground);
}

function handleMouseMove(event) {
  if (!deLorean) return;
  deLoreanTargetX = event.clientX - 40;
  deLoreanTargetY = event.clientY - 18;
  deLoreanLastMove = performance.now();

  if (event.movementX > 1) {
    deLoreanFacing = 'right';
  } else if (event.movementX < -1) {
    deLoreanFacing = 'left';
  }

  deLorean.classList.toggle('face-left', deLoreanFacing === 'left');
  deLorean.classList.toggle('face-right', deLoreanFacing === 'right');
  deLorean.classList.remove('idle');
  deLoreanLabel?.classList.remove('visible');
}

function animateDeLorean() {
  if (!deLorean) return;
  const dx = deLoreanTargetX - deLoreanX;
  const dy = deLoreanTargetY - deLoreanY;
  const speed = Math.hypot(dx, dy);
  deLoreanX += dx * 0.06;
  deLoreanY += dy * 0.06;

  const idleOffset = deLorean.classList.contains('idle')
    ? Math.sin(performance.now() / 1500 * Math.PI * 2) * 8
    : 0;

  deLorean.style.transform = `translate3d(${deLoreanX}px, ${deLoreanY + idleOffset}px, 0) scaleX(${deLoreanFacing === 'left' ? -1 : 1})`;

  if (trailLeft && trailRight) {
    const trailScale = Math.min(Math.max(speed / 40, 0.9), 2.2);
    trailLeft.style.setProperty('--trail-scale', trailScale.toFixed(2));
    trailRight.style.setProperty('--trail-scale', trailScale.toFixed(2));

    if (deLoreanFacing === 'right') {
      trailLeft.classList.add('active');
      trailRight.classList.remove('active');
    } else {
      trailLeft.classList.remove('active');
      trailRight.classList.add('active');
    }

    trailLeft.style.left = `${deLoreanX}px`;
    trailLeft.style.top = `${deLoreanY + 8}px`;
    trailRight.style.left = `${deLoreanX + 80}px`;
    trailRight.style.top = `${deLoreanY + 8}px`;
  }

  if (deLoreanLabel) {
    deLoreanLabel.style.left = `${deLoreanX + 40}px`;
    deLoreanLabel.style.top = `${deLoreanY + 45}px`;
  }

  if (speed < 0.8 && performance.now() - deLoreanLastMove > 120) {
    deLorean.classList.add('idle');
  } else {
    deLorean.classList.remove('idle');
  }

  if (performance.now() - deLoreanLastMove > 1000) {
    deLoreanLabel?.classList.add('visible');
  } else {
    deLoreanLabel?.classList.remove('visible');
  }

  requestAnimationFrame(animateDeLorean);
}

function triggerButtonGlitch(element) {
  element.classList.add('button-glitch');
  setTimeout(() => element.classList.remove('button-glitch'), 160);
}

function openMobileMenu() {
  mobileMenu.classList.add('active');
  mobileMenu.setAttribute('aria-hidden', 'false');
  menuToggle.setAttribute('aria-expanded', 'true');
}

function closeMobileMenu() {
  mobileMenu.classList.remove('active');
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
}

function toggleMobileMenu() {
  if (mobileMenu.classList.contains('active')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function animateStats() {
  stats.forEach((stat) => {
    const target = parseInt(stat.dataset.target, 10) || 0;
    const suffix = stat.dataset.suffix || '';
    const duration = 1400;
    const startTime = performance.now();

    function step(timestamp) {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      stat.textContent = `${Math.floor(progress * target)}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        stat.textContent = `${target}${suffix}`;
      }
    }

    requestAnimationFrame(step);
  });
}

function splitHeroLetters() {
  heroWordWraps.forEach((wrap) => {
    const text = wrap.textContent.trim();
    wrap.innerHTML = text.split('').map((char) => `<span class="hero-letter">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
  });
}

function animateHeroLetters() {
  const letters = Array.from(document.querySelectorAll('.hero-letter'));
  letters.forEach((letter, index) => {
    letter.style.opacity = '0';
    letter.style.transform = 'translateY(-24px)';
    letter.style.display = 'inline-block';
    letter.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
    requestAnimationFrame(() => {
      letter.style.opacity = '1';
      letter.style.transform = 'translateY(0)';
    });
  });
}

function flashSection(section) {
  const flash = section.querySelector('.section-flash');
  if (!flash) return;
  flash.classList.add('active');
  setTimeout(() => flash.classList.remove('active'), 700);
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      flashSection(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18 });

  sections.forEach((section) => {
    const flashLayer = document.createElement('div');
    flashLayer.className = 'section-flash';
    section.appendChild(flashLayer);
    observer.observe(section);
  });
}

function animateNavGlitch(link) {
  const letters = Array.from(link.querySelectorAll('span'));
  if (letters.length === 0) return;
  const glitchCount = Math.min(3, letters.length);
  for (let i = 0; i < glitchCount; i += 1) {
    const targetIndex = Math.floor(Math.random() * letters.length);
    letters[targetIndex].classList.add('glitch-char');
    setTimeout(() => letters[targetIndex].classList.remove('glitch-char'), 120 + i * 30);
  }
}

function prepareNavLinks() {
  navLinks.forEach((link) => {
    const text = link.textContent.trim();
    link.innerHTML = text.split('').map((char) => `<span>${char}</span>`).join('');
    link.addEventListener('mouseenter', () => animateNavGlitch(link));
    link.addEventListener('focus', () => animateNavGlitch(link));
  });
}

function handleCardTilt(event) {
  if (window.innerWidth <= 768) return;
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const rotateX = ((y / rect.height) - 0.5) * 16;
  const rotateY = ((x / rect.width) - 0.5) * 16;
  card.style.transform = `perspective(1000px) rotateX(${ -rotateX }deg) rotateY(${ rotateY }deg) translateZ(0) translateY(-8px)`;
}

function resetCardTilt(event) {
  const card = event.currentTarget;
  card.style.transform = '';
}

function addCardInteractions() {
  interactiveCards.forEach((card) => {
    card.addEventListener('mousemove', handleCardTilt);
    card.addEventListener('mouseleave', resetCardTilt);
  });
}

function createSparkBurst(pill) {
  const rect = pill.getBoundingClientRect();
  for (let i = 0; i < 4; i += 1) {
    const spark = document.createElement('span');
    spark.className = 'pill-spark';
    spark.style.left = `${rect.width / 2}px`;
    spark.style.top = `${rect.height / 2}px`;
    spark.style.transform = `rotate(${i * 90}deg)`;
    pill.appendChild(spark);
    setTimeout(() => spark.remove(), 320);
  }
}

function attachSkillHover() {
  const pills = document.querySelectorAll('.skill-tags span');
  pills.forEach((pill) => {
    pill.addEventListener('mouseenter', () => createSparkBurst(pill));
  });
}

function attachExperienceHover() {
  const entries = document.querySelectorAll('.experience-entry');
  entries.forEach((entry) => {
    entry.addEventListener('mouseenter', () => {
      entry.classList.add('bolt-active');
      setTimeout(() => entry.classList.remove('bolt-active'), 500);
    });
  });
}

function attachButtonEffects() {
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      triggerButtonGlitch(button);
      if (button.classList.contains('button-primary') && button.closest('.contact-cta')) {
        const flash = document.createElement('div');
        flash.className = 'page-flash';
        body.appendChild(flash);
        setTimeout(() => flash.remove(), 200);
      }
    });
  });
}

function attachDeLoreanHover() {
  if (!deLorean) return;
  deLorean.addEventListener('mouseenter', () => {
    deLorean.classList.add('hovered');
    setTimeout(() => deLorean.classList.remove('hovered'), 550);
  });
}

function attachMobileMenuEvents() {
  menuToggle.addEventListener('click', toggleMobileMenu);
  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
}

function attachLinkSmoothScroll() {
  const allLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  allLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#') && targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          event.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
          closeMobileMenu();
        }
      }
    });
  });
}

function handleVisibilityChange() {
  visible = document.visibilityState === 'visible';
  if (visible) {
    requestAnimationFrame(drawBackground);
  }
}

// =====================
// CHATBOT
// =====================

const GROQ_API_KEY = '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';

const SYSTEM_PROMPT = `You are Sai Anand Reddy Singareddy, a Generative AI Engineer with 10 years of experience. Answer all questions as Sai Anand speaking in first person. Be professional, confident and friendly. Keep answers 2 to 4 sentences unless more detail is needed.

Name: Sai Anand Reddy Singareddy
Current Role: Generative AI Engineer at New York Life Insurance, New York NY, Oct 2024 to Present
Email: saianandreddys@gmail.com
Phone: +1(913) 428-9284
LinkedIn: https://www.linkedin.com/in/saianandreddysingareddy/
Education: Bachelor of Technology, Sreenidhi University Hyderabad
Status: Open to senior AI roles and consulting opportunities

Experience:
1. New York Life Insurance, Generative AI Engineer, Oct 2024 to Present. Built RAG pipelines for claims intelligence using Vertex AI, LangChain, Hugging Face. 18 percent reduction in claims processing time. 15 percent improvement in underwriting turnaround. AWS EKS, FAISS, OpenSearch hybrid retrieval. PII masking, IAM, KMS encryption for compliance.
2. Citigroup, Generative AI Data Scientist, Apr 2022 to Sep 2024. 16 percent improvement in document classification accuracy. 12 percent reduction in fraud false positives. RAG architectures with LangChain and FAISS. Fraud detection using XGBoost and Neo4j. FastAPI REST APIs, Jenkins CI/CD.
3. The Home Depot, AI ML Engineer, Aug 2020 to Mar 2022. 14 percent improvement in recommendation relevance. 12 percent increase in customer engagement. Collaborative filtering and reinforcement learning. BERT and TensorFlow for sentiment analysis. PySpark on Amazon EMR, Kafka.
4. Anthem, Data Scientist ML Engineer, Jan 2019 to Jul 2020. 25 percent improvement in fraud detection accuracy. 30 percent faster claims processing. Random Forest, XGBoost, deep learning models. spaCy and NLTK for medical NLP. Azure Kubernetes Service, Docker.
5. GGK Technologies, Software Developer, Aug 2016 to Dec 2018. 18 percent application performance improvement. Django REST Framework and Flask APIs. Python migration from Perl and PHP. Linux, WebLogic, JBoss.

Skills:
AI and ML: LLMs, RAG, NLP, Prompt Engineering, Fraud Detection, Feature Engineering, Anomaly Detection
Frameworks: TensorFlow, PyTorch, LangChain, Hugging Face, Scikit-learn, FastAPI, Keras, spaCy, NLTK
Cloud: AWS SageMaker, EKS, S3, Glue, Azure OpenAI, ML, Databricks, AKS, GCP Vertex AI
Big Data: Apache Spark, PySpark, Kafka, Airflow, Hadoop, Snowflake
DevOps: Docker, Kubernetes, Jenkins, MLflow, Prometheus, Grafana
Databases: PostgreSQL, MongoDB, Neo4j, Oracle, FAISS, OpenSearch
Programming: Python SQL Node.js Bash

If asked about the resume say they can download it from the website. If asked about availability say you are open to senior AI roles and consulting. Always speak as Sai Anand in first person. Never break character.`;

let chatHistory = [];
let chatInitialized = false;

function initChatbot() {
  const chatFloatingBtn = document.getElementById('chatFloatingBtn');
  const chatPopup = document.getElementById('chatPopup');
  const chatMinimize = document.getElementById('chatMinimize');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');

  if (!chatFloatingBtn || !chatPopup) return;

  setTimeout(() => {
    if (!chatInitialized) {
      openChat();
    }
  }, 5000);

  chatFloatingBtn.addEventListener('click', openChat);
  chatMinimize.addEventListener('click', closeChat);
  chatSend.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

function openChat() {
  const chatFloatingBtn = document.getElementById('chatFloatingBtn');
  const chatPopup = document.getElementById('chatPopup');
  chatFloatingBtn.style.display = 'none';
  chatPopup.classList.add('open');
  chatPopup.setAttribute('aria-hidden', 'false');
  chatInitialized = true;
  document.body.classList.add('chat-open');
  setTimeout(() => {
    document.getElementById('chatInput')?.focus();
  }, 400);
}

function closeChat() {
  const chatFloatingBtn = document.getElementById('chatFloatingBtn');
  const chatPopup = document.getElementById('chatPopup');
  chatPopup.classList.remove('open');
  chatPopup.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('chat-open');
  setTimeout(() => {
    chatFloatingBtn.style.display = 'flex';
  }, 400);
}

async function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  const message = chatInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  chatInput.value = '';
  showTyping();

  try {
    const reply = await getGroqResponse(message);
    removeTyping();
    addMessage(reply, 'bot');
  } catch (error) {
    removeTyping();
    addMessage('Timeline disrupted. Please try again.', 'bot');
    console.error('Chat error:', error);
  }
}

function addMessage(text, sender) {
  const chatMessages = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender === 'user' ? 'user-message' : 'bot-message'}`;
  messageDiv.innerHTML = `<p>${escapeHtml(text)}</p>`;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const chatMessages = document.getElementById('chatMessages');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-message bot-message chat-typing';
  typingDiv.id = 'chatTyping';
  typingDiv.innerHTML = '<span></span><span></span><span></span>';
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById('chatTyping');
  if (typing) typing.remove();
}

async function getGroqResponse(userMessage) {
  chatHistory.push({ role: 'user', content: userMessage });

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...chatHistory
  ];

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Groq API Error:', errorData);
    throw new Error(errorData.error?.message || 'API request failed');
  }

  const data = await response.json();
  const botReply = data.choices[0].message.content;
  chatHistory.push({ role: 'assistant', content: botReply });
  return botReply;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function init() {
  setCanvasSize();
  createParticles();
  if (!prefersReducedMotion) {
    requestAnimationFrame(drawBackground);
  }

  splitHeroLetters();
  prepareNavLinks();
  initScrollReveal();
  addCardInteractions();
  attachSkillHover();
  attachExperienceHover();
  attachButtonEffects();
  attachDeLoreanHover();
  attachMobileMenuEvents();
  attachLinkSmoothScroll();
  document.addEventListener('mousemove', handleMouseMove);
  requestAnimationFrame(animateDeLorean);

  setTimeout(() => {
    loadingFill.style.width = '100%';
  }, 100);

  setTimeout(() => {
    loadingScreen.classList.add('glitch');
    animateHeroLetters();
  }, 2100);

  setTimeout(() => {
    loadingScreen.classList.add('loaded');
    body.classList.remove('loading');
    animateStats();
  }, 2400);

  window.addEventListener('resize', () => {
    setCanvasSize();
    createParticles();
  });

  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 24) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  document.addEventListener('visibilitychange', handleVisibilityChange);
  initChatbot();
}

window.addEventListener('DOMContentLoaded', init);