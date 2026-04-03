/* ═══════════════════════════════════════════════════
   AKSHAYAGUNA™  ·  main.js v4  ·  Production-ready
═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* 1 ── Nav shrink on scroll */
  const nav = document.getElementById('navbar');
  if (nav) {
    const tick = () => nav.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', tick, { passive:true });
    tick();
  }

  /* 2 ── Hamburger / mobile overlay */
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mobileNav');
  if (ham && mob) {
    const close = () => {
      mob.classList.remove('open');
      ham.classList.remove('open');
      document.body.style.overflow = '';
    };
    ham.addEventListener('click', () => {
      const open = mob.classList.toggle('open');
      ham.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mob.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* 3 ── Scroll reveal — IntersectionObserver */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold:0.07, rootMargin:'0px 0px -24px 0px' });

  document.querySelectorAll('.fade-up,.fade-left,.scale-in').forEach(el => io.observe(el));

  /* 4 ── Auto-stagger grid children */
  const gridSelectors = '.prod-grid,.products-full-grid,.links-grid,.brand-row,.client-row,.contact-actions';
  const childSelectors = '.prod-card,.prod-full-card,.link-card,.brand-logo,.client-chip,.cta-btn';
  document.querySelectorAll(gridSelectors).forEach(grid => {
    const kids = grid.querySelectorAll(childSelectors);
    kids.forEach((c, i) => {
      if (!c.classList.contains('fade-up') && !c.classList.contains('scale-in')) {
        c.classList.add('scale-in');
        c.style.transitionDelay = `${i * 0.055}s`;
      }
    });
    const gio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.scale-in,.fade-up').forEach(c => c.classList.add('visible'));
          gio.unobserve(e.target);
        }
      });
    }, { threshold:0.04 });
    gio.observe(grid);
  });

  /* 5 ── Counter animation for .stat-num */
  document.querySelectorAll('.stat-num').forEach(el => {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const raw  = el.textContent.trim();
        const num  = parseFloat(raw);
        if (isNaN(num)) {
          // non-numeric e.g. "Delhi" — just pop in
          el.style.cssText += 'opacity:0;transform:translateY(8px)';
          requestAnimationFrame(() => {
            el.style.transition = 'opacity .7s var(--spring,ease), transform .7s var(--spring,ease)';
            el.style.opacity = '1'; el.style.transform = 'none';
          });
        } else {
          const sfx  = raw.replace(String(num), '');
          const dur  = 1100;
          const t0   = performance.now();
          const ease = t => 1 - Math.pow(1 - t, 3);
          const tick = now => {
            const t   = Math.min((now - t0) / dur, 1);
            const val = num * ease(t);
            el.textContent = (Number.isInteger(num) ? Math.round(val) : val.toFixed(1)) + sfx;
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
        cio.unobserve(el);
      });
    }, { threshold:.5 });
    cio.observe(el);
  });

  /* 6 ── Subtle hero parallax (desktop only) */
  if (window.matchMedia('(min-width:769px)').matches) {
    const bg = document.querySelector('.hero-bg, .page-hero-bg');
    if (bg) {
      window.addEventListener('scroll', () => {
        if (window.scrollY < window.innerHeight * 1.5)
          bg.style.transform = `translateY(${window.scrollY * .22}px)`;
      }, { passive:true });
    }
  }

  /* 7 ── Magnetic buttons (desktop only) */
  if (window.matchMedia('(min-width:769px)').matches) {
    document.querySelectorAll('.btn-solid,.cta-btn-primary').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * .14;
        const y = (e.clientY - r.top  - r.height / 2) * .14;
        btn.style.transform = `translate(${x}px,${y - 2}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* 8 ── WhatsApp form */
  document.querySelectorAll('#waForm').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = this.querySelector('.wa-input');
      if (!input) return;
      const num = input.value.trim().replace(/\D/g, '');
      if (num.length < 10) {
        input.style.borderColor = '#c0392b';
        input.style.animation   = 'shake .4s';
        setTimeout(() => { input.style.borderColor = ''; input.style.animation = ''; }, 1200);
        return;
      }
      const msg = encodeURIComponent("Hi AKSHAYGUNA! I'd like to enquire about your aluminium products and interior solutions.");
      window.open('https://wa.me/917428096601?text=' + msg, '_blank');
      input.value = '';
      const thanks = document.getElementById('waThanks');
      if (thanks) { thanks.style.display = 'block'; setTimeout(() => thanks.style.display = 'none', 5000); }
    });
  });

  /* 9 ── Soft cursor glow (desktop only) */
  if (window.matchMedia('(min-width:900px)').matches &&
      !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
    const glow = document.createElement('div');
    Object.assign(glow.style, {
      position:'fixed', width:'300px', height:'300px', borderRadius:'50%',
      pointerEvents:'none', zIndex:'0',
      background:'radial-gradient(circle,rgba(58,107,48,.065) 0%,transparent 70%)',
      transform:'translate(-50%,-50%)', top:'-600px', left:'-600px',
      mixBlendMode:'screen',
    });
    document.body.appendChild(glow);
    let mx = 0, my = 0, gx = 0, gy = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function loop() {
      gx += (mx - gx) * .07; gy += (my - gy) * .07;
      glow.style.left = gx + 'px'; glow.style.top = gy + 'px';
      requestAnimationFrame(loop);
    })();
  }

  /* 10 ── Respect prefers-reduced-motion */
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
    document.querySelectorAll('.fade-up,.fade-left,.scale-in').forEach(el => {
      el.style.transition = 'none'; el.classList.add('visible');
    });
  }

})();
