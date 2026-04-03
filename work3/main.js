/* ============================================================
   PRECISION 3D — Global JavaScript
   ============================================================ */

// ── Navbar scroll effect ──────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ── Mobile hamburger ──────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');
if (hamburger && navMobile) {
  hamburger.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity  = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

// ── Scroll Reveal ─────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.classList.contains('delay-1') ? 100 :
                    entry.target.classList.contains('delay-2') ? 200 :
                    entry.target.classList.contains('delay-3') ? 300 :
                    entry.target.classList.contains('delay-4') ? 400 : 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Counter animation ─────────────────────────────────────
function animateCount(el, target, suffix = '') {
  const dur = 1800;
  const start = performance.now();
  const update = (now) => {
    const t = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target).toLocaleString() + suffix;
    if (t < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || (el.dataset.count === '98' ? '%' : el.dataset.count === '12' ? '+' : '+');
      animateCount(el, target, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ── Portfolio filter (portfolio.html) ─────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      const cards = document.querySelectorAll('.portfolio-card[data-cat]');
      let visible = 0;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.cat === filter;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      const noResults = document.getElementById('noResults');
      if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    });
  });
}

// ── Toast helper ──────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  if (msg) toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ── Smooth hover lift for cards ───────────────────────────
document.querySelectorAll('.portfolio-card, .service-card, .testimonial-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.willChange = 'transform';
  });
  card.addEventListener('mouseleave', () => {
    card.style.willChange = '';
  });
});

// ── Active nav link highlight ────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  } else if (href !== 'index.html') {
    link.classList.remove('active');
  }
});

// ── Parallax on hero bg grid ──────────────────────────────
const heroGrid = document.querySelector('.hero-grid');
if (heroGrid) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.3;
    heroGrid.style.transform = `translateY(${y}px)`;
  }, { passive: true });
}

// ── Cursor glow effect (desktop only) ─────────────────────
if (window.matchMedia('(min-width:1024px)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; pointer-events:none; z-index:9998;
    width:400px; height:400px; border-radius:50%;
    background: radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%); transition: opacity 0.3s;
    top:0; left:0;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

// ── Keyboard accessibility: close mobile nav on Escape ────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMobile && navMobile.classList.contains('open')) {
    navMobile.classList.remove('open');
    if (hamburger) {
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }
});
