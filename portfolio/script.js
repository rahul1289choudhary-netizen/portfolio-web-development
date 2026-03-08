/* ═══════════════════════════════════════════
   DevForge — Portfolio JavaScript
   Features:
   - Custom cursor + trail
   - Hero particle canvas (mouse-reactive)
   - Contact canvas (floating nodes)
   - 3D tilt cards
   - Scroll reveal
   - Animated counters
   - Magnetic buttons
   - Typing badge text
   - Navbar scroll effect
   - Click ripple
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══ CUSTOM CURSOR ══ */
  const dot   = document.getElementById('cursorDot');
  const ring  = document.getElementById('cursorRing');
  const ripple = document.getElementById('clickRipple');

  let mx = -200, my = -200;
  let rx = -200, ry = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    spawnTrailParticle(mx, my);
  });

  // Smooth ring follow
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .p-card, .s-card, .tilt-card, input, textarea, select');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });

  // Click
  document.addEventListener('mousedown', () => dot.classList.add('clicking'));
  document.addEventListener('mouseup',   () => dot.classList.remove('clicking'));

  // Click ripple
  document.addEventListener('click', e => {
    ripple.style.left = e.clientX + 'px';
    ripple.style.top  = e.clientY + 'px';
    ripple.classList.remove('active');
    void ripple.offsetWidth;
    ripple.classList.add('active');
  });

  // Trail particles
  let trailThrottle = 0;
  function spawnTrailParticle(x, y) {
    if (Date.now() - trailThrottle < 30) return;
    trailThrottle = Date.now();
    const p = document.createElement('div');
    p.className = 'trail-particle';
    p.style.left = x + 'px';
    p.style.top  = y + 'px';
    p.style.opacity = Math.random() * 0.7 + 0.3;
    p.style.width  = Math.random() * 4 + 2 + 'px';
    p.style.height = p.style.width;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 500);
  }

  /* ══ HERO PARTICLE CANVAS ══ */
  const heroCanvas = document.getElementById('heroCanvas');
  const hCtx = heroCanvas.getContext('2d');
  let hW, hH, heroParticles = [];

  function resizeHero() {
    hW = heroCanvas.width  = heroCanvas.offsetWidth;
    hH = heroCanvas.height = heroCanvas.offsetHeight;
  }
  resizeHero();
  window.addEventListener('resize', resizeHero);

  class HeroParticle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * hW;
      this.y  = Math.random() * hH;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.5 + 0.5;
      this.a  = Math.random() * 0.6 + 0.1;
      this.color = Math.random() > 0.5 ? '0,229,255' : '105,240,174';
    }
    update(mouseX, mouseY) {
      // Mouse repulsion
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        this.vx += (dx / dist) * force * 0.8;
        this.vy += (dy / dist) * force * 0.8;
      }
      // Damping
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.x += this.vx;
      this.y += this.vy;
      // Wrap
      if (this.x < 0) this.x = hW;
      if (this.x > hW) this.x = 0;
      if (this.y < 0) this.y = hH;
      if (this.y > hH) this.y = 0;
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.a})`;
      ctx.fill();
    }
  }

  // Create particles
  const HERO_COUNT = 120;
  for (let i = 0; i < HERO_COUNT; i++) heroParticles.push(new HeroParticle());

  let heroMX = hW / 2, heroMY = hH / 2;
  document.addEventListener('mousemove', e => {
    const rect = heroCanvas.getBoundingClientRect();
    heroMX = e.clientX - rect.left;
    heroMY = e.clientY - rect.top;
  });

  function drawHero() {
    hCtx.clearRect(0, 0, hW, hH);

    // Draw connection lines
    for (let i = 0; i < heroParticles.length; i++) {
      for (let j = i + 1; j < heroParticles.length; j++) {
        const dx = heroParticles[i].x - heroParticles[j].x;
        const dy = heroParticles[i].y - heroParticles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.15;
          hCtx.beginPath();
          hCtx.moveTo(heroParticles[i].x, heroParticles[i].y);
          hCtx.lineTo(heroParticles[j].x, heroParticles[j].y);
          hCtx.strokeStyle = `rgba(0,229,255,${alpha})`;
          hCtx.lineWidth = 0.5;
          hCtx.stroke();
        }
      }
    }

    heroParticles.forEach(p => {
      p.update(heroMX, heroMY);
      p.draw(hCtx);
    });

    requestAnimationFrame(drawHero);
  }
  drawHero();

  /* ══ CONTACT CANVAS ══ */
  const cCanvas = document.getElementById('contactCanvas');
  const cCtx = cCanvas.getContext('2d');
  let cW, cH, cParticles = [];

  function resizeContact() {
    cW = cCanvas.width  = cCanvas.offsetWidth;
    cH = cCanvas.height = cCanvas.offsetHeight;
  }
  resizeContact();
  window.addEventListener('resize', resizeContact);

  class CNode {
    constructor() {
      this.x = Math.random() * cW;
      this.y = Math.random() * cH;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > cW) this.vx *= -1;
      if (this.y < 0 || this.y > cH) this.vy *= -1;
    }
    draw() {
      cCtx.beginPath();
      cCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      cCtx.fillStyle = 'rgba(0,229,255,0.4)';
      cCtx.fill();
    }
  }

  for (let i = 0; i < 60; i++) cParticles.push(new CNode());

  function drawContact() {
    cCtx.clearRect(0, 0, cW, cH);
    for (let i = 0; i < cParticles.length; i++) {
      for (let j = i + 1; j < cParticles.length; j++) {
        const dx = cParticles[i].x - cParticles[j].x;
        const dy = cParticles[i].y - cParticles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 120) {
          cCtx.beginPath();
          cCtx.moveTo(cParticles[i].x, cParticles[i].y);
          cCtx.lineTo(cParticles[j].x, cParticles[j].y);
          cCtx.strokeStyle = `rgba(0,229,255,${(1 - d/120) * 0.12})`;
          cCtx.lineWidth = 0.5;
          cCtx.stroke();
        }
      }
    }
    cParticles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(drawContact);
  }
  drawContact();

  /* ══ 3D TILT CARDS ══ */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width / 2;
      const cy   = rect.top  + rect.height / 2;
      const rx_  = ((e.clientY - cy) / (rect.height / 2)) * -10;
      const ry_  = ((e.clientX - cx) / (rect.width  / 2)) *  10;
      card.style.transform = `perspective(800px) rotateX(${rx_}deg) rotateY(${ry_}deg) scale(1.03)`;

      // Dynamic glow
      const color = card.dataset.color || '#00e5ff';
      card.style.boxShadow = `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${color}22`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      card.style.boxShadow = '';
    });
  });

  /* ══ MAGNETIC BUTTONS ══ */
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.3;
      const dy = (e.clientY - cy) * 0.3;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });

  /* ══ SCROLL REVEAL ══ */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(r => revealObserver.observe(r));

  /* ══ ANIMATED COUNTERS ══ */
  function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = target;
        clearInterval(interval);
      } else {
        el.textContent = start;
      }
    }, 16);
  }

  const counters = document.querySelectorAll('.counter, .hstat-num');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ══ TYPING BADGE TEXT ══ */
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    const phrases = [
      'Available for new projects',
      'Building for local businesses',
      'Fast · Beautiful · Affordable',
    ];
    let pi = 0, ci = 0, deleting = false;

    function type() {
      const phrase = phrases[pi];
      if (!deleting) {
        typingEl.textContent = phrase.slice(0, ci++);
        if (ci > phrase.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
      } else {
        typingEl.textContent = phrase.slice(0, ci--);
        if (ci < 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          ci = 0;
        }
      }
      setTimeout(type, deleting ? 40 : 60);
    }
    type();
  }

  /* ══ NAVBAR SCROLL ══ */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ══ HAMBURGER MENU ══ */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* ══ PARALLAX HERO ══ */
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.transform = `translateY(${sy * 0.25}px)`;
      heroContent.style.opacity = 1 - sy / 600;
    }
    const grid = document.querySelector('.grid-overlay');
    if (grid) grid.style.backgroundPositionY = sy * 0.2 + 'px';
  });

  /* ══ FORM SUBMIT ══ */
  window.handleSubmit = function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.submit-btn');
    const txt = btn.querySelector('.btn-text');
    const ico = btn.querySelector('.btn-icon');
    txt.textContent = 'Sending...';
    ico.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    setTimeout(() => {
      txt.textContent = 'Message Sent!';
      ico.innerHTML = '<i class="fa-solid fa-check"></i>';
      btn.style.background = '#69f0ae';
      btn.style.color = '#030608';
      btn.style.borderColor = '#69f0ae';
      setTimeout(() => {
        txt.textContent = 'Send Message';
        ico.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
        e.target.reset();
      }, 3000);
    }, 1500);
  };

  /* ══ GLITCH TITLE EFFECT (on hover) ══ */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.addEventListener('mouseenter', () => {
      heroTitle.style.filter = 'drop-shadow(0 0 10px #00e5ff) drop-shadow(2px 0 8px #ff6ec7)';
    });
    heroTitle.addEventListener('mouseleave', () => {
      heroTitle.style.filter = '';
    });
  }

});
