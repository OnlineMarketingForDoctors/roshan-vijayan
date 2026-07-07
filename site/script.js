// year
document.getElementById('year').textContent = new Date().getFullYear();

// header scroll state
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// mobile menu
const toggle = document.getElementById('menuToggle');
const menu = document.getElementById('mobileMenu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menu.setAttribute('aria-hidden', String(!open));
  toggle.setAttribute('aria-expanded', String(open));
});
menu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

// scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), (i % 4) * 90);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// reviews carousel (multi-card + read more)
(function () {
  const track = document.getElementById('revTrack');
  if (!track) return;
  const slides = Array.from(track.children);
  const dotsWrap = document.getElementById('revDots');
  const prevBtn = document.getElementById('revPrev');
  const nextBtn = document.getElementById('revNext');
  let i = 0, maxIndex = 0, step = 0, timer;

  function setupReadMore() {
    slides.forEach(s => {
      const text = s.querySelector('.rev-text');
      if (!text || s.querySelector('.rev-more')) return;
      if (text.scrollHeight - text.clientHeight > 4) {
        const btn = document.createElement('button');
        btn.className = 'rev-more';
        btn.type = 'button';
        btn.textContent = 'Read more';
        btn.addEventListener('click', () => {
          const exp = s.classList.toggle('expanded');
          btn.textContent = exp ? 'Read less' : 'Read more';
        });
        text.after(btn);
      }
    });
  }

  function measure() {
    const cardW = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    step = cardW + gap;
    const vpW = track.parentElement.getBoundingClientRect().width;
    const perView = Math.max(1, Math.round((vpW + gap) / step));
    maxIndex = Math.max(0, slides.length - perView);
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let n = 0; n <= maxIndex; n++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.addEventListener('click', () => { go(n); reset(); });
      dotsWrap.appendChild(b);
    }
  }

  function go(n) {
    i = Math.max(0, Math.min(n, maxIndex));
    track.style.transform = `translateX(${-i * step}px)`;
    Array.from(dotsWrap.children).forEach((d, k) => d.classList.toggle('active', k === i));
    if (prevBtn) prevBtn.disabled = i === 0;
    if (nextBtn) nextBtn.disabled = i === maxIndex;
  }
  function next() { go(i >= maxIndex ? 0 : i + 1); }
  function prev() { go(i <= 0 ? maxIndex : i - 1); }
  function reset() { clearInterval(timer); timer = setInterval(next, 7000); }

  function build() { measure(); buildDots(); go(Math.min(i, maxIndex)); }

  nextBtn.addEventListener('click', () => { next(); reset(); });
  prevBtn.addEventListener('click', () => { prev(); reset(); });

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { setupReadMore(); build(); }, 150);
  });

  setupReadMore();
  build();
  reset();
  window.addEventListener('load', () => { setupReadMore(); build(); });
})();

// before/after sliders + result tabs
(function () {
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const set = (clientX) => {
      const r = slider.getBoundingClientRect();
      let pct = ((clientX - r.left) / r.width) * 100;
      pct = Math.max(3, Math.min(97, pct));
      slider.style.setProperty('--pos', pct + '%');
    };
    let dragging = false;
    slider.addEventListener('pointerdown', e => {
      dragging = true;
      try { slider.setPointerCapture(e.pointerId); } catch (_) {}
      set(e.clientX);
    });
    slider.addEventListener('pointermove', e => { if (dragging) set(e.clientX); });
    slider.addEventListener('pointerup', () => { dragging = false; });
    slider.addEventListener('pointercancel', () => { dragging = false; });
  });

  const tabs = Array.from(document.querySelectorAll('.ba-tab'));
  const panels = Array.from(document.querySelectorAll('.ba-panel'));
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.tab;
      tabs.forEach(t => {
        const on = t === tab;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', String(on));
      });
      panels.forEach(p => {
        const on = p.dataset.panel === key;
        p.classList.toggle('active', on);
        p.hidden = !on;
      });
    });
  });
})();

// services carousel (peeking cards)
(function () {
  const track = document.getElementById('svcTrack');
  if (!track) return;
  const cards = Array.from(track.children);
  const gap = 14;
  let active = 0, cw = 0;

  function measureCollapsed() {
    const c = cards.find((_, i) => i !== active) || cards[0];
    cw = c.getBoundingClientRect().width;
  }
  function render() {
    cards.forEach((c, i) => c.classList.toggle('active', i === active));
    track.style.transform = `translateX(${-active * (cw + gap)}px)`;
  }
  function go(n) { active = (n + cards.length) % cards.length; render(); }

  document.getElementById('svcPrev').addEventListener('click', () => go(active - 1));
  document.getElementById('svcNext').addEventListener('click', () => go(active + 1));
  cards.forEach((c, i) => c.addEventListener('click', () => { if (i !== active) go(i); }));

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { measureCollapsed(); render(); }, 150);
  });

  // measure with all cards collapsed, then activate the first
  cards.forEach(c => c.classList.remove('active'));
  measureCollapsed();
  go(0);
  // re-measure once images/fonts settle, in case layout shifted
  window.addEventListener('load', () => { measureCollapsed(); render(); });
})();
