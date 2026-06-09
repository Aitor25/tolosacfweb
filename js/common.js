/**
 * TOLOSA CF ESKUBALOIA - Common JS
 * Navbar, theme, mobile menu, y renderNewsCards.
 * Coleccion Firestore: 'news' (campos: title, date, tag, image, summary, content)
 */

// ── Navbar + Theme + Mobile menu (se engancha al DOMContentLoaded) ──
document.addEventListener('DOMContentLoaded', () => {
  if (typeof feather !== 'undefined') feather.replace();

  // Navbar scroll
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // Theme toggle
  function applyTheme(isDark) {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const label = document.getElementById('mobile-theme-label');
    if (label) label.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
    if (typeof feather !== 'undefined') feather.replace();
  }
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', () => applyTheme(!document.documentElement.classList.contains('dark')));
  const mobileThemeBtn = document.getElementById('mobile-theme-toggle');
  if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', () => applyTheme(!document.documentElement.classList.contains('dark')));

  // Mobile menu
  const overlay = document.getElementById('mobile-menu-overlay');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuToggle = document.getElementById('menu-toggle');
  const closeMenuBtn = document.getElementById('close-menu');
  if (menuToggle && mobileMenu && overlay) {
    function openMenu() { mobileMenu.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true'); }
    function closeMenu() { mobileMenu.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false'); }
    menuToggle.addEventListener('click', openMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  // Scroll reveal
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => revealObs.observe(el));

  // Ripple
  document.querySelectorAll('[data-ripple]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect(), size = Math.max(rect.width, rect.height) * 2;
      const r = document.createElement('span'); r.classList.add('ripple');
      r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
      this.appendChild(r); setTimeout(() => r.remove(), 700);
    });
  });
});

// ── renderNewsCards ──
// Lee de Firestore coleccion 'news' (campos: title, date, tag, image, summary)
// Fallback: window.NOTICIAS_FALLBACK si Firestore falla o esta vacio.
let _lastNewsDoc = null;
let _newsOffset = 0;

async function renderNewsCards(containerId, limit = 9, append = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!append) { _lastNewsDoc = null; _newsOffset = 0; }

  // Intenta Firestore
  try {
    const db = window.db || (typeof firebase !== 'undefined' && firebase.apps.length ? firebase.firestore() : null);
    if (db) {
      let q = db.collection('news').orderBy('timestamp', 'desc');
      if (append && _lastNewsDoc) q = q.startAfter(_lastNewsDoc);
      q = q.limit(limit);
      const snap = await q.get();
      if (!snap.empty) {
        _lastNewsDoc = snap.docs[snap.docs.length - 1];
        const html = snap.docs.map((doc, i) => buildNewsCardHTML({
          id: doc.id,
          title: doc.data().title || doc.data().titulo || 'Sin titulo',
          date: doc.data().date || doc.data().fecha || '',
          tag: doc.data().tag || doc.data().categoria || 'Club',
          image: doc.data().image || doc.data().imagen || '',
          summary: doc.data().summary || doc.data().resumen || ''
        }, i, append)).join('');
        if (append) container.insertAdjacentHTML('beforeend', html);
        else container.innerHTML = html;
        if (typeof feather !== 'undefined') feather.replace();
        const loadMore = document.getElementById('load-more-btn');
        if (loadMore && snap.docs.length < limit) { loadMore.textContent = 'No hay mas noticias'; loadMore.disabled = true; }
        return;
      }
    }
  } catch(e) { console.warn('Firestore error, usando fallback:', e); }

  // Fallback estatico
  const fallback = window.NOTICIAS_FALLBACK || [];
  if (!fallback.length) {
    if (!append) container.innerHTML = '<div style="grid-column:1/-1;padding:4rem;text-align:center;opacity:.4;"><p style="font-family:Barlow Condensed,sans-serif;text-transform:uppercase;font-weight:900;">Sin noticias disponibles</p></div>';
    return;
  }
  const page = fallback.slice(_newsOffset, _newsOffset + limit);
  _newsOffset += page.length;
  const html = page.map((n, i) => buildNewsCardHTML({
    id: n.id || i,
    title: n.title || n.titulo || 'Sin titulo',
    date: n.date || n.fecha || '',
    tag: n.tag || n.categoria || 'Club',
    image: n.image || n.imagen || '',
    summary: n.summary || n.resumen || ''
  }, i, append)).join('');
  if (append) container.insertAdjacentHTML('beforeend', html);
  else container.innerHTML = html;
  if (typeof feather !== 'undefined') feather.replace();
  const loadMore = document.getElementById('load-more-btn');
  if (loadMore && _newsOffset >= fallback.length) { loadMore.textContent = 'No hay mas noticias'; loadMore.disabled = true; }
}

function buildNewsCardHTML(n, i, append) {
  const isFirst = (i === 0 && !append);
  return `<a class="news-card${isFirst ? ' featured' : ''} reveal delay-${Math.min(i+1,5)}" href="noticia.html?id=${encodeURIComponent(n.id)}">
    ${n.image ? `<img class="news-card-img" src="${n.image}" alt="${n.title}" loading="lazy">` : '<div class="news-card-img" style="background:rgba(18,85,201,0.2);"></div>'}
    <div class="news-card-overlay" aria-hidden="true"></div>
    <div class="news-card-body">
      <span class="news-card-cat">${n.tag}</span>
      <h3 class="news-card-title">${n.title}</h3>
      <div class="news-card-date">${n.date}</div>
    </div>
  </a>`;
}

window.renderNewsCards = renderNewsCards;
