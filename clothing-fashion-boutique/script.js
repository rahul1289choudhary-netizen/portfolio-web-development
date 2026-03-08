document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════
     PAGE INTRO OVERLAY
  ════════════════════════════ */
  const intro = document.createElement('div');
  intro.className = 'page-intro';
  intro.innerHTML = `<div class="pi-logo">Riya's Closet</div>`;
  document.body.prepend(intro);
  setTimeout(() => intro.remove(), 2000);

  /* ════════════════════════════
     SCROLL PROGRESS BAR
  ════════════════════════════ */
  const sb = document.createElement('div');
  sb.className = 'scroll-bar';
  document.body.prepend(sb);
  window.addEventListener('scroll', () => {
    const pct = scrollY / (document.body.scrollHeight - innerHeight) * 100;
    sb.style.width = pct + '%';
  });

  /* ════════════════════════════
     CUSTOM CURSOR
  ════════════════════════════ */
  const dot    = Object.assign(document.createElement('div'), { className: 'cursor-dot' });
  const ring   = Object.assign(document.createElement('div'), { className: 'cursor-ring' });
  const ripple = Object.assign(document.createElement('div'), { className: 'click-ripple' });
  document.body.append(dot, ring, ripple);

  let mx = -300, my = -300, rx = -300, ry = -300;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    spawnTrail(mx, my);
  });
  (function trackRing() {
    rx += (mx - rx) * 0.11; ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(trackRing);
  })();
  document.querySelectorAll('a,button,.collection-card,.product-card,.testimonial-card,.insta-post,.value-item').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hov'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hov'));
  });
  document.addEventListener('mousedown', () => dot.classList.add('clk'));
  document.addEventListener('mouseup',   () => dot.classList.remove('clk'));
  document.addEventListener('click', e => {
    ripple.style.left = e.clientX + 'px';
    ripple.style.top  = e.clientY + 'px';
    ripple.classList.remove('go');
    void ripple.offsetWidth;
    ripple.classList.add('go');
  });

  let tTick = 0;
  function spawnTrail(x, y) {
    if (Date.now() - tTick < 38) return;
    tTick = Date.now();
    const p = document.createElement('div');
    p.className = 'tp';
    p.style.left   = x + 'px';
    p.style.top    = y + 'px';
    p.style.width  = p.style.height = (Math.random() * 3 + 2) + 'px';
    p.style.opacity = (Math.random() * .5 + .15).toString();
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 500);
  }

  /* ════════════════════════════
     HERO — inject bg div + canvas
  ════════════════════════════ */
  const hero = document.querySelector('.hero');
  if (hero) {
    // Background image div (so we can animate it separately from overlay)
    const bgDiv = document.createElement('div');
    bgDiv.className = 'hero-bg-img';
    hero.insertBefore(bgDiv, hero.firstChild);

    // Floating petals canvas
    const hCanvas = document.createElement('canvas');
    hCanvas.id = 'heroCanvas';
    hero.insertBefore(hCanvas, hero.firstChild);

    initHeroCanvas(hCanvas);
    spawnPetals(hero);
  }

  function initHeroCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;
    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Silky floating orbs / petals
    const ORBS = 70;
    const orbs = Array.from({ length: ORBS }, () => ({
      x:  Math.random() * 1920,
      y:  Math.random() * 1080,
      vx: (Math.random() - .5) * .3,
      vy: (Math.random() - .5) * .22,
      r:  Math.random() * 2.5 + .6,
      a:  Math.random() * .45 + .08,
      c:  Math.random() > .55 ? '212,165,165' : '201,169,110'
    }));

    let hmx = 960, hmy = 540;
    document.addEventListener('mousemove', e => { hmx = e.clientX; hmy = e.clientY; });

    (function draw() {
      ctx.clearRect(0, 0, W, H);

      // Soft connection threads
      for (let i = 0; i < ORBS; i++) {
        for (let j = i + 1; j < ORBS; j++) {
          const dx = orbs[i].x - orbs[j].x, dy = orbs[i].y - orbs[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(orbs[i].x, orbs[i].y);
            ctx.lineTo(orbs[j].x, orbs[j].y);
            ctx.strokeStyle = `rgba(212,165,165,${(1 - d / 90) * .1})`;
            ctx.lineWidth = .4;
            ctx.stroke();
          }
        }
      }

      orbs.forEach(o => {
        // Gentle mouse repel
        const dx = o.x - hmx, dy = o.y - hmy;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) { const f = (100 - d) / 100; o.vx += dx / d * f * .5; o.vy += dy / d * f * .5; }
        o.vx *= .982; o.vy *= .982;
        o.x += o.vx; o.y += o.vy;
        if (o.x < 0) o.x = W; if (o.x > W) o.x = 0;
        if (o.y < 0) o.y = H; if (o.y > H) o.y = 0;

        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${o.c},${o.a})`;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    })();
  }

  function spawnPetals(hero) {
    // Tiny CSS petal dots drifting across hero
    function makePetal() {
      const p = document.createElement('div');
      p.className = 'petal';
      const size = Math.random() * 5 + 3;
      Object.assign(p.style, {
        left:    Math.random() * 100 + '%',
        top:     (Math.random() * 60 + 5) + '%',
        width:   size + 'px',
        height:  size + 'px',
        animation: `petalDrift ${Math.random() * 8 + 6}s ease-in-out ${Math.random() * 4}s infinite`,
        background: Math.random() > .5 ? 'rgba(212,165,165,.55)' : 'rgba(201,169,110,.45)',
        borderRadius: Math.random() > .4 ? '50%' : '2px',
      });
      hero.appendChild(p);
    }
    for (let i = 0; i < 18; i++) makePetal();

    // Add petal drift keyframes once
    if (!document.getElementById('petalKF')) {
      const s = document.createElement('style');
      s.id = 'petalKF';
      s.textContent = `
        @keyframes petalDrift {
          0%   { transform: translate(0,0) rotate(0deg) scale(1); opacity: .6; }
          33%  { transform: translate(${Math.random()*40-20}px,${Math.random()*-30-10}px) rotate(120deg) scale(.8); }
          66%  { transform: translate(${Math.random()*50-25}px,${Math.random()*-50-10}px) rotate(240deg) scale(1.1); }
          100% { transform: translate(0,0) rotate(360deg) scale(1); opacity: .3; }
        }
      `;
      document.head.appendChild(s);
    }
  }

  /* ════════════════════════════
     NAVBAR SCROLL
  ════════════════════════════ */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', scrollY > 50));

  /* ════════════════════════════
     MOBILE MENU
  ════════════════════════════ */
  const mobileBtn  = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn   = document.querySelector('.close-btn');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => mobileMenu.classList.add('active'));
    closeBtn .addEventListener('click', () => mobileMenu.classList.remove('active'));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('active')));
  }

  /* ════════════════════════════
     SIZE GUIDE MODAL
  ════════════════════════════ */
  const modalBtn   = document.getElementById('size-guide-btn');
  const modal      = document.getElementById('size-modal');
  const modalClose = document.querySelector('.close-modal');
  if (modalBtn && modal) {
    modalBtn  .addEventListener('click', () => { modal.classList.add('show');    document.body.style.overflow = 'hidden'; });
    modalClose.addEventListener('click', () => { modal.classList.remove('show'); document.body.style.overflow = ''; });
    window    .addEventListener('click', e  => { if (e.target === modal) { modal.classList.remove('show'); document.body.style.overflow = ''; } });
  }

  /* ════════════════════════════
     3D TILT — COLLECTION CARDS
  ════════════════════════════ */
  document.querySelectorAll('.collection-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -7;
      const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  7;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px) scale(1.02)`;
      card.style.boxShadow = `0 30px 60px rgba(0,0,0,.2), 0 0 40px rgba(212,165,165,.3)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });

  /* ════════════════════════════
     3D TILT — PRODUCT CARDS
  ════════════════════════════ */
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -5;
      const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  5;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px) scale(1.02)`;
      card.style.boxShadow = `0 22px 48px rgba(0,0,0,.12), 0 0 28px rgba(212,165,165,.28)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });

  /* ════════════════════════════
     3D TILT — TESTIMONIAL CARDS
  ════════════════════════════ */
  document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -4;
      const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  4;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  /* ════════════════════════════
     PARALLAX ON SCROLL
  ════════════════════════════ */
  window.addEventListener('scroll', () => {
    const sy = scrollY;

    // Hero content fades & lifts as you scroll
    const hc = document.querySelector('.hero-content');
    if (hc) {
      hc.style.transform = `translateY(${sy * .25}px)`;
      hc.style.opacity   = Math.max(0, 1 - sy / 500);
    }

    // Hero bg slight parallax
    const hbg = document.querySelector('.hero-bg-img');
    if (hbg) hbg.style.transform = `scale(1.08) translateY(${sy * .12}px)`;

    // Section titles subtle parallax
    document.querySelectorAll('.section-title').forEach(t => {
      const rect = t.getBoundingClientRect();
      const offset = (rect.top - innerHeight / 2) * .04;
      t.style.transform = `translateY(${offset}px)`;
    });
  });

  /* ════════════════════════════
     SCROLL REVEAL (IntersectionObserver)
  ════════════════════════════ */
  // Mark elements for reveal
  const revealTargets = [
    { sel: '.collection-card', delay: .08 },
    { sel: '.product-card',    delay: .07 },
    { sel: '.testimonial-card',delay: .1  },
    { sel: '.insta-post',      delay: .05 },
    { sel: '.value-item',      delay: .1  },
    { sel: '.section-title',   delay: 0   },
    { sel: '.about-image',     delay: 0   },
    { sel: '.about-content',   delay: .15 },
    { sel: '.footer-col',      delay: .08 },
  ];
  revealTargets.forEach(({ sel, delay }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('rv');
      el.style.setProperty('--rd', (i * delay) + 's');
    });
  });

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));

  /* ════════════════════════════
     MAGNETIC BUTTONS
  ════════════════════════════ */
  document.querySelectorAll('.btn, .social-links a, .floating-wa').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * .28;
      const dy = (e.clientY - r.top  - r.height / 2) * .28;
      el.style.transform = `translate(${dx}px,${dy}px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });

  /* ════════════════════════════
     INSTAGRAM GRID — stagger 3D on section enter
  ════════════════════════════ */
  const instaSection = document.querySelector('.instagram-feed');
  if (instaSection) {
    new IntersectionObserver(([e], obs) => {
      if (e.isIntersecting) {
        document.querySelectorAll('.insta-post').forEach((p, i) => {
          setTimeout(() => {
            p.style.transform = 'scale(1.06) rotateZ(.5deg)';
            setTimeout(() => p.style.transform = '', 380);
          }, i * 70);
        });
        obs.unobserve(instaSection);
      }
    }, { threshold: .3 }).observe(instaSection);
  }

  /* ════════════════════════════
     FOOTER REVEAL — brand name letter-by-letter
  ════════════════════════════ */
  const footerLogo = document.querySelector('.footer-logo');
  if (footerLogo) {
    const txt = footerLogo.textContent;
    footerLogo.innerHTML = txt.split('').map((c, i) =>
      `<span style="display:inline-block;opacity:0;transform:translateY(14px);transition:opacity .4s ${i*.04}s,transform .4s ${i*.04}s">${c === ' ' ? '&nbsp;' : c}</span>`
    ).join('');

    new IntersectionObserver(([e], obs) => {
      if (e.isIntersecting) {
        footerLogo.querySelectorAll('span').forEach(s => { s.style.opacity = '1'; s.style.transform = 'translateY(0)'; });
        obs.unobserve(footerLogo);
      }
    }, { threshold: .8 }).observe(footerLogo);
  }

  /* ════════════════════════════
     HERO TITLE — split word animation
  ════════════════════════════ */
  const heroH1 = document.querySelector('.hero-content h1');
  if (heroH1) {
    const words = heroH1.textContent.trim().split(' ');
    heroH1.innerHTML = words.map((w, i) =>
      `<span class="hw" style="display:inline-block;opacity:0;transform:translateY(22px) rotateX(30deg);animation:hwIn .7s ${.3 + i * .1}s cubic-bezier(.34,1.56,.64,1) forwards">${w}</span>`
    ).join(' ');
    if (!document.getElementById('hwKF')) {
      const s = document.createElement('style');
      s.id = 'hwKF';
      s.textContent = `@keyframes hwIn{to{opacity:1;transform:translateY(0) rotateX(0)}}`;
      document.head.appendChild(s);
    }
  }

});
