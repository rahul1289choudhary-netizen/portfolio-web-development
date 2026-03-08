/* ============================================
   PRIYA'S BEAUTY STUDIO — LUXURY INTERACTIONS
   Three.js 3D Scene + Glitter Cursor + Particles
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== CUSTOM CURSOR — MAKEUP BRUSH =====
  const cursorBrush = document.getElementById('cursor-brush');
  const cursorGlow = document.getElementById('cursor-glow');
  let mouseX = 0, mouseY = 0;
  let prevX = 0, prevY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const dx = mouseX - prevX;
    const dy = mouseY - prevY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    cursorBrush.style.left = mouseX + 'px';
    cursorBrush.style.top = mouseY + 'px';
    cursorBrush.style.transform = `translate(-50%, -50%) rotate(${angle - 60}deg)`;

    cursorGlow.style.left = mouseX + 'px';
    cursorGlow.style.top = mouseY + 'px';

    prevX = mouseX;
    prevY = mouseY;
  });

  const interactiveEls = document.querySelectorAll('a, button, .service-card, .gallery-item, .testimonial-card, select, input');
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mouseleave', () => {
    cursorBrush.style.opacity = '0';
    cursorGlow.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorBrush.style.opacity = '1';
    cursorGlow.style.opacity = '1';
  });


  // ===== GLITTER TRAIL =====
  const glitterCanvas = document.getElementById('glitter-canvas');
  const gCtx = glitterCanvas.getContext('2d');
  glitterCanvas.width = window.innerWidth;
  glitterCanvas.height = window.innerHeight;

  const glitters = [];
  const glitterColors = [
    'rgba(255, 75, 159, 0.9)',
    'rgba(255, 182, 217, 0.9)',
    'rgba(212, 160, 176, 0.9)',
    'rgba(255, 214, 236, 0.9)',
    'rgba(212, 175, 122, 0.9)',
    'rgba(255, 255, 255, 0.9)',
    'rgba(255, 145, 200, 0.9)',
  ];

  let lastGlitterTime = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastGlitterTime < 25) return;
    lastGlitterTime = now;

    const count = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < count; i++) {
      glitters.push({
        x: e.clientX + (Math.random() - 0.5) * 14,
        y: e.clientY + (Math.random() - 0.5) * 14,
        size: Math.random() * 4 + 1,
        color: glitterColors[Math.floor(Math.random() * glitterColors.length)],
        alpha: 1,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5 - 0.8,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        shape: Math.random() > 0.5 ? 'star' : 'diamond',
      });
    }
  });

  function drawStar(ctx, x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const innerAngle = outerAngle + Math.PI / 5;
      if (i === 0) ctx.moveTo(Math.cos(outerAngle) * size, Math.sin(outerAngle) * size);
      else ctx.lineTo(Math.cos(outerAngle) * size, Math.sin(outerAngle) * size);
      ctx.lineTo(Math.cos(innerAngle) * size * 0.4, Math.sin(innerAngle) * size * 0.4);
    }
    ctx.closePath();
    ctx.restore();
  }

  function drawDiamond(ctx, x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.6, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.6, 0);
    ctx.closePath();
    ctx.restore();
  }

  function animateGlitter() {
    gCtx.clearRect(0, 0, glitterCanvas.width, glitterCanvas.height);

    for (let i = glitters.length - 1; i >= 0; i--) {
      const g = glitters[i];
      g.x += g.vx;
      g.y += g.vy;
      g.vy += 0.06;
      g.alpha -= 0.035;
      g.rotation += g.rotSpeed;

      if (g.alpha <= 0) { glitters.splice(i, 1); continue; }

      gCtx.save();
      gCtx.globalAlpha = g.alpha;
      gCtx.fillStyle = g.color;
      gCtx.shadowColor = g.color;
      gCtx.shadowBlur = 6;

      if (g.shape === 'star') {
        drawStar(gCtx, g.x, g.y, g.size, g.rotation);
      } else {
        drawDiamond(gCtx, g.x, g.y, g.size, g.rotation);
      }
      gCtx.fill();
      gCtx.restore();
    }

    requestAnimationFrame(animateGlitter);
  }

  animateGlitter();

  window.addEventListener('resize', () => {
    glitterCanvas.width = window.innerWidth;
    glitterCanvas.height = window.innerHeight;
  });


  // ===== CLICK SPARKLE BURST =====
  document.addEventListener('click', (e) => {
    const colors = ['#FF4B9F', '#FFB6D9', '#D4A0B0', '#FF91C8', '#D4AF7A', '#FFFFFF'];
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      glitters.push({
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.3,
        shape: Math.random() > 0.5 ? 'star' : 'diamond',
      });
    }
  });


  // ===== PARTICLE BACKGROUND =====
  const particlesCanvas = document.getElementById('particles-canvas');
  const pCtx = particlesCanvas.getContext('2d');
  particlesCanvas.width = window.innerWidth;
  particlesCanvas.height = window.innerHeight;

  let pmx = window.innerWidth / 2, pmy = window.innerHeight / 2;
  document.addEventListener('mousemove', (e) => { pmx = e.clientX; pmy = e.clientY; });

  window.addEventListener('resize', () => {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    r: Math.random() * 1.8 + 0.4,
    color: Math.random() > 0.6 ? '#FF91C8' : Math.random() > 0.5 ? '#D4A0B0' : '#D4AF7A',
    alpha: Math.random() * 0.4 + 0.1,
    pulse: Math.random() * Math.PI * 2,
  }));

  function drawParticles() {
    pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    const W = particlesCanvas.width, H = particlesCanvas.height;

    particles.forEach(p => {
      const dx = p.x - pmx, dy = p.y - pmy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        const force = (130 - dist) / 130 * 0.012;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      p.vx *= 0.99; p.vy *= 0.99;
      p.x += p.vx; p.y += p.vy;
      p.pulse += 0.03;

      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      const pulseAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pCtx.fillStyle = p.color;
      pCtx.globalAlpha = pulseAlpha;
      pCtx.shadowColor = p.color;
      pCtx.shadowBlur = 8;
      pCtx.fill();
    });

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          pCtx.beginPath();
          pCtx.moveTo(particles[i].x, particles[i].y);
          pCtx.lineTo(particles[j].x, particles[j].y);
          pCtx.strokeStyle = particles[i].color;
          pCtx.globalAlpha = (1 - d / 100) * 0.1;
          pCtx.lineWidth = 0.5;
          pCtx.shadowBlur = 0;
          pCtx.stroke();
        }
      }
    }
    pCtx.globalAlpha = 1;
    requestAnimationFrame(drawParticles);
  }
  drawParticles();


  // ===== THREE.JS HERO 3D SCENE =====
  if (typeof THREE !== 'undefined') {
    initHeroScene();
  }

  function initHeroScene() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const hero = document.querySelector('.hero');
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 1000);
    camera.position.set(0, 0, 30);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.width, canvas.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Materials
    const matPink = new THREE.MeshBasicMaterial({ color: 0xFF4B9F, wireframe: true, transparent: true, opacity: 0.18 });
    const matDeepPink = new THREE.MeshBasicMaterial({ color: 0xC2185B, wireframe: true, transparent: true, opacity: 0.15 });
    const matRoseGold = new THREE.MeshBasicMaterial({ color: 0xD4A0B0, wireframe: true, transparent: true, opacity: 0.2 });
    const matGold = new THREE.MeshBasicMaterial({ color: 0xD4AF7A, wireframe: true, transparent: true, opacity: 0.16 });
    const matBlush = new THREE.MeshBasicMaterial({ color: 0xFFB6D9, wireframe: true, transparent: true, opacity: 0.12 });

    // Central icosahedron
    const icosa = new THREE.Mesh(new THREE.IcosahedronGeometry(7, 1), matPink);
    icosa.position.set(16, -1, -12);
    scene.add(icosa);

    // Second icosahedron
    const icosa2 = new THREE.Mesh(new THREE.IcosahedronGeometry(4.5, 1), matRoseGold);
    icosa2.position.set(-18, 5, -15);
    scene.add(icosa2);

    // Torus rings — like salon mirrors
    const torus1 = new THREE.Mesh(new THREE.TorusGeometry(11, 0.06, 16, 100), matDeepPink);
    torus1.position.set(-16, 2, -18);
    torus1.rotation.x = Math.PI / 3;
    scene.add(torus1);

    const torus2 = new THREE.Mesh(new THREE.TorusGeometry(7, 0.05, 16, 80), matPink);
    torus2.position.set(-16, 2, -18);
    torus2.rotation.y = Math.PI / 5;
    scene.add(torus2);

    const torus3 = new THREE.Mesh(new THREE.TorusGeometry(14, 0.04, 16, 120), matBlush);
    torus3.position.set(15, -2, -25);
    torus3.rotation.x = Math.PI / 6;
    scene.add(torus3);

    // Octahedron — like a gem/diamond
    const octa = new THREE.Mesh(new THREE.OctahedronGeometry(5, 0), matGold);
    octa.position.set(-12, -8, -10);
    scene.add(octa);

    // Small floating sparkle spheres
    const sparkles = [];
    for (let i = 0; i < 40; i++) {
      const size = Math.random() * 0.25 + 0.05;
      const color = [0xFF4B9F, 0xD4A0B0, 0xD4AF7A, 0xFFB6D9, 0xFF91C8][Math.floor(Math.random() * 5)];
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: Math.random() * 0.6 + 0.3,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(size, 6, 6), mat);
      mesh.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 25 - 5
      );
      mesh.userData = {
        speed: Math.random() * 0.01 + 0.004,
        offset: Math.random() * Math.PI * 2,
        amplitude: Math.random() * 2 + 0.5,
        rotSpeed: (Math.random() - 0.5) * 0.05,
      };
      scene.add(mesh);
      sparkles.push(mesh);
    }

    // Floating plane grid
    const grid = new THREE.GridHelper(100, 35, 0xFFB6D9, 0xFFD6EC);
    grid.position.y = -18;
    grid.material.transparent = true;
    grid.material.opacity = 0.12;
    scene.add(grid);

    // Mouse parallax
    let tRotX = 0, tRotY = 0, cRotX = 0, cRotY = 0;
    document.addEventListener('mousemove', (e) => {
      tRotY = ((e.clientX / window.innerWidth) - 0.5) * 0.35;
      tRotX = ((e.clientY / window.innerHeight) - 0.5) * -0.18;
    });

    let clock3d = 0;
    function animate3D() {
      requestAnimationFrame(animate3D);
      clock3d += 0.006;

      cRotX += (tRotX - cRotX) * 0.04;
      cRotY += (tRotY - cRotY) * 0.04;
      scene.rotation.x = cRotX;
      scene.rotation.y = cRotY;

      icosa.rotation.x += 0.004;
      icosa.rotation.y += 0.006;
      icosa2.rotation.x += 0.005;
      icosa2.rotation.z += 0.004;
      torus1.rotation.z += 0.003;
      torus2.rotation.x += 0.004;
      torus2.rotation.y += 0.003;
      torus3.rotation.z -= 0.002;
      octa.rotation.x += 0.007;
      octa.rotation.z += 0.005;

      sparkles.forEach(s => {
        s.position.y += Math.sin(clock3d + s.userData.offset) * s.userData.speed;
        s.position.x += Math.cos(clock3d * 0.5 + s.userData.offset) * s.userData.speed * 0.4;
        s.rotation.y += s.userData.rotSpeed;
      });

      // Pulsing opacity on icosa
      icosa.material.opacity = 0.12 + 0.06 * Math.sin(clock3d);
      torus1.material.opacity = 0.1 + 0.05 * Math.sin(clock3d + 1);

      renderer.render(scene, camera);
    }

    animate3D();

    window.addEventListener('resize', () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }


  // ===== HEADER SCROLL =====
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  });

  // Scroll to top
  document.getElementById('scrollTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ===== MOBILE NAV =====
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = hamburger?.querySelector('i');
      if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-times'); }
    });
  });


  // ===== SCROLL REVEAL =====
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => revealObs.observe(el));


  // ===== 3D CARD TILT =====
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const rx = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -7;
      const ry = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 7;
      card.style.transform = `translateY(-10px) perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.7s cubic-bezier(0.23,1,0.32,1)';
    });
  });


  // ===== GALLERY TILT =====
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const rx = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -4;
      const ry = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 4;
      item.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
      item.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)';
    });
  });


  // ===== MAGNETIC BUTTONS =====
  document.querySelectorAll('.btn-glow, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      btn.style.transform = `translate(${(e.clientX - cx) * 0.18}px, ${(e.clientY - cy) * 0.18}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s';
    });
  });


  // ===== FLOATING ITEMS PARALLAX =====
  const floatItems = document.querySelectorAll('.beauty-item');
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    floatItems.forEach((item, i) => {
      const depth = parseFloat(item.dataset.depth || 0.3);
      item.style.transform = `translateY(${scrollY * depth * 0.25}px)`;
    });
  });


  // ===== TESTIMONIAL CAROUSEL =====
  const track = document.getElementById('testimonialTrack');
  const cards = track?.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('tDots');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');

  if (track && cards) {
    let currentIdx = 0;
    let cardsPerView = window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;

    // Create dots
    cards.forEach((_, i) => {
      if (i < cards.length - cardsPerView + 1) {
        const dot = document.createElement('button');
        dot.className = 't-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    });

    function goTo(idx) {
      const maxIdx = cards.length - cardsPerView;
      currentIdx = Math.max(0, Math.min(idx, maxIdx));
      const cardW = cards[0].offsetWidth + 28;
      track.style.transform = `translateX(-${currentIdx * cardW}px)`;
      dotsContainer.querySelectorAll('.t-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentIdx);
      });
    }

    prevBtn?.addEventListener('click', () => goTo(currentIdx - 1));
    nextBtn?.addEventListener('click', () => goTo(currentIdx + 1));

    window.addEventListener('resize', () => {
      cardsPerView = window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;
      goTo(currentIdx);
    });

    // Auto slide
    let autoSlide = setInterval(() => goTo(currentIdx + 1 > cards.length - cardsPerView ? 0 : currentIdx + 1), 4500);
    track.addEventListener('mouseenter', () => clearInterval(autoSlide));
    track.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => goTo(currentIdx + 1 > cards.length - cardsPerView ? 0 : currentIdx + 1), 4500);
    });
  }


  // ===== BOOKING FORM =====
  const bookingForm = document.getElementById('bookingForm');
  const modal = document.getElementById('bookingModal');
  const modalMsg = document.getElementById('modalMsg');

  if (bookingForm) {
    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const service = document.getElementById('service').value;
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;

      if (name && service && date && time) {
        modalMsg.textContent = `Thank you, ${name}! Your ${service} appointment on ${date} at ${time} has been requested. We'll confirm within 24 hours.`;
        modal.classList.add('visible');
        bookingForm.reset();

        // Sparkle burst in modal
        const sparkleContainer = document.getElementById('modalSparkles');
        for (let i = 0; i < 30; i++) {
          setTimeout(() => {
            const sp = document.createElement('div');
            sp.style.cssText = `
              position: absolute;
              width: ${Math.random() * 8 + 4}px;
              height: ${Math.random() * 8 + 4}px;
              background: ${['#FF4B9F','#FFB6D9','#D4AF7A','#FFFFFF'][Math.floor(Math.random()*4)]};
              border-radius: 50%;
              top: ${Math.random() * 100}%;
              left: ${Math.random() * 100}%;
              animation: sparkleOut 1s ease-out forwards;
              pointer-events: none;
            `;
            sparkleContainer.appendChild(sp);
            setTimeout(() => sp.remove(), 1000);
          }, i * 40);
        }
      }
    });
  }

  document.getElementById('modalClose')?.addEventListener('click', () => {
    modal.classList.remove('visible');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('visible');
  });

  // Add sparkle keyframe dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes sparkleOut {
      0% { transform: scale(0) translate(0, 0); opacity: 1; }
      100% { transform: scale(1) translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 80 + 20}px, -${Math.random() * 80 + 20}px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);


  // ===== ACTIVE NAV HIGHLIGHT =====
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.style.color = '';
          const href = a.getAttribute('href');
          if (href === `#${entry.target.id}`) a.style.color = 'var(--pink-primary)';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObs.observe(s));


  // ===== SALON LIGHTS HOVER GLOW =====
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      heroSection.style.setProperty('--mouse-x', `${x}%`);
      heroSection.style.setProperty('--mouse-y', `${y}%`);
    });
  }


  // ===== INPUT FOCUS GLOW =====
  document.querySelectorAll('.form-group input, .form-group select').forEach(input => {
    input.addEventListener('focus', () => {
      const glow = input.nextElementSibling;
      if (glow && glow.classList.contains('input-glow')) glow.style.transform = 'scaleX(1)';
    });
    input.addEventListener('blur', () => {
      const glow = input.nextElementSibling;
      if (glow && glow.classList.contains('input-glow') && !input.value) glow.style.transform = 'scaleX(0)';
    });
  });


  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ===== RESIZE =====
  window.addEventListener('resize', () => {
    const heroCanvas = document.getElementById('hero-canvas');
    const hero = document.querySelector('.hero');
    if (heroCanvas && hero) {
      heroCanvas.width = hero.offsetWidth;
      heroCanvas.height = hero.offsetHeight;
    }
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
  });

  console.log("✨ Priya's Beauty Studio — Luxury Experience Loaded ✨");
});
