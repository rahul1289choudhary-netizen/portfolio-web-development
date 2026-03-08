/* 
===============================================
   IRONEDGE FITNESS — ELECTRIC JAVASCRIPT
===============================================
*/

document.addEventListener('DOMContentLoaded', () => {

    // 1. MOBILE MENU
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');
    const icon = mobileMenuBtn.querySelector('i');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    });
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    // 2. NAVBAR + PROGRESS BAR
    const navbar = document.getElementById('navbar');
    const progressBar = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progressBar.style.width = ((window.scrollY / h) * 100) + '%';
    });

    // 3. SCROLL REVEAL
    const revealIO = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(r => revealIO.observe(r));

    // 4. BMI CALCULATOR
    const calcBtn = document.getElementById('calculate-btn');
    if (calcBtn) {
        calcBtn.addEventListener('click', () => {
            const h = parseFloat(document.getElementById('height').value);
            const w = parseFloat(document.getElementById('weight').value);
            if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) { alert('Please enter valid values.'); return; }
            const bmi = (w / ((h / 100) ** 2)).toFixed(1);
            let cat, col;
            if      (bmi < 18.5)                { cat = 'Underweight';  col = '#69f0ae'; }
            else if (bmi >= 18.5 && bmi < 24.9) { cat = 'Normal Weight'; col = '#CDFF00'; }
            else if (bmi >= 25   && bmi < 29.9) { cat = 'Overweight';   col = '#FFD600'; }
            else                                { cat = 'Obese';        col = '#ff5252'; }
            document.getElementById('bmi-value').textContent = bmi;
            const catEl = document.getElementById('bmi-category');
            catEl.textContent = cat;
            catEl.style.color = col;
            catEl.style.textShadow = `0 0 10px ${col}88`;
            document.getElementById('bmi-result').classList.remove('hidden');
            spawnVoltBurst(calcBtn);
        });
    }

    // 5. INJECT KEYFRAMES
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        @keyframes sparkFly {
            0%   { opacity: 1; transform: translate(0, 0) scale(1); }
            100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0); }
        }
        @keyframes voltBurst {
            0%   { opacity: 1; transform: translate(-50%, -50%) scale(0); }
            50%  { opacity: 0.8; }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(3); }
        }
        @keyframes boltFlash {
            0%   { opacity: 0; }
            20%  { opacity: 1; }
            40%  { opacity: 0; }
            60%  { opacity: 0.8; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(styleEl);

    // 6. SPARK HELPER
    let sparkThrottle = 0;
    function spawnSpark(x, y) {
        const spark = document.createElement('div');
        const size  = Math.random() * 4 + 1;
        const angle = Math.random() * 360;
        const dist  = Math.random() * 25 + 5;
        spark.style.cssText = `
            position:fixed; left:${x}px; top:${y}px;
            width:${size}px; height:${size}px;
            background:#CDFF00; border-radius:50%;
            pointer-events:none; z-index:9999;
            box-shadow:0 0 ${size*3}px #CDFF00;
            animation:sparkFly 0.4s ease-out forwards;
            --dx:${Math.cos(angle*Math.PI/180)*dist}px;
            --dy:${Math.sin(angle*Math.PI/180)*dist}px;
        `;
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 400);
    }

    // Cursor sparks
    document.addEventListener('mousemove', e => {
        if (Date.now() - sparkThrottle < 45) return;
        sparkThrottle = Date.now();
        if (Math.random() > 0.55) spawnSpark(e.clientX, e.clientY);
    });

    // 7. VOLT BURST
    function spawnVoltBurst(el) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width/2, cy = r.top + r.height/2;
        const burst = document.createElement('div');
        burst.style.cssText = `
            position:fixed; left:${cx}px; top:${cy}px;
            width:80px; height:80px;
            border:2px solid #CDFF00; border-radius:50%;
            pointer-events:none; z-index:9998;
            box-shadow:0 0 20px #CDFF0066, inset 0 0 20px #CDFF0033;
            animation:voltBurst 0.5s ease-out forwards;
        `;
        document.body.appendChild(burst);
        for (let i = 0; i < 8; i++) spawnSpark(cx + (Math.random()-0.5)*30, cy + (Math.random()-0.5)*30);
        setTimeout(() => burst.remove(), 500);
    }

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', () => spawnVoltBurst(btn));
    });

    // 8. HERO LIGHTNING BOLTS
    function createLightningBolt() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        const bolt = document.createElement('div');
        bolt.style.cssText = `
            position:absolute; left:${Math.random()*100}%;
            top:0; width:2px; height:${Math.random()*60+20}%;
            background:linear-gradient(to bottom,transparent,#CDFF00,transparent);
            box-shadow:0 0 8px #CDFF00,0 0 20px rgba(205,255,0,0.4);
            pointer-events:none; z-index:2; opacity:0;
            animation:boltFlash ${Math.random()*0.2+0.1}s ease forwards;
        `;
        hero.appendChild(bolt);
        setTimeout(() => bolt.remove(), 400);
    }

    (function scheduleLightning() {
        setTimeout(() => {
            createLightningBolt();
            if (Math.random() > 0.5) setTimeout(createLightningBolt, 100);
            scheduleLightning();
        }, Math.random() * 4000 + 2000);
    })();

    // 9. FEATURE CARD sparks on hover
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const r = card.getBoundingClientRect();
            for (let i = 0; i < 6; i++) {
                setTimeout(() => spawnSpark(r.left + Math.random()*r.width, r.top + Math.random()*8), i*40);
            }
        });
    });

    // 10. SECTION TITLE glitch on hover
    document.querySelectorAll('.section-title').forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.textShadow = '2px 0 #CDFF00, -2px 0 rgba(255,82,82,0.5)';
            el.style.transform  = 'skewX(-1deg)';
            setTimeout(() => { el.style.textShadow=''; el.style.transform=''; }, 150);
        });
    });

    // 11. INPUT focus sparks
    document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('focus', () => {
            const r = el.getBoundingClientRect();
            for (let i = 0; i < 4; i++) spawnSpark(r.left + Math.random()*r.width, r.bottom);
        });
    });

    // 12. HERO entry arc
    setTimeout(() => {
        const ht = document.querySelector('.hero-title');
        if (!ht) return;
        const r = ht.getBoundingClientRect();
        for (let i = 0; i < 14; i++) {
            setTimeout(() => spawnSpark(r.left + Math.random()*r.width, r.top + Math.random()*r.height), i*55);
        }
    }, 900);

});
