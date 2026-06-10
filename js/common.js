/**
 * TOLOSA CF ESKUBALOIA - Common JS
 * Navbar, theme, mobile menu, renderNewsCards.
 */

// ── Aplicar tema ANTES de que el DOM renderice (evita flash) ──
// El tema inicial ya se aplica en el <script> inline de cada página.
// Este archivo gestiona los toggles y la lógica de UI.

function _applyTheme(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  // Actualizar icono del botón
  const toggleBtns = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle');
  toggleBtns.forEach(btn => {
    const icon = btn.querySelector('i[data-feather]') || btn.querySelector('svg');
    if (icon) {
      // Reemplazar el icono data-feather
      const newIcon = document.createElement('i');
      newIcon.setAttribute('data-feather', isDark ? 'sun' : 'moon');
      newIcon.style.cssText = 'width:15px;height:15px;';
      if (icon.tagName === 'svg') icon.replaceWith(newIcon);
      else icon.setAttribute('data-feather', isDark ? 'sun' : 'moon');
    }
  });
  const label = document.getElementById('mobile-theme-label');
  if (label) label.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
  if (typeof feather !== 'undefined') feather.replace();
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof feather !== 'undefined') feather.replace();

  // ── Navbar scroll ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ── Theme toggles ──
  // Sincronizar icono con estado actual
  const isDarkNow = document.documentElement.classList.contains('dark');
  document.querySelectorAll('#theme-toggle i[data-feather], #mobile-theme-toggle i[data-feather]').forEach(el => {
    el.setAttribute('data-feather', isDarkNow ? 'sun' : 'moon');
  });
  if (typeof feather !== 'undefined') feather.replace();

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      _applyTheme(!document.documentElement.classList.contains('dark'));
    });
  }
  const mobileThemeBtn = document.getElementById('mobile-theme-toggle');
  if (mobileThemeBtn) {
    mobileThemeBtn.addEventListener('click', () => {
      _applyTheme(!document.documentElement.classList.contains('dark'));
    });
  }

  // ── Mobile menu ──
  const overlay    = document.getElementById('mobile-menu-overlay');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuToggle = document.getElementById('menu-toggle');
  const closeBtn   = document.getElementById('close-menu');
  if (menuToggle && mobileMenu && overlay) {
    function openMenu()  { mobileMenu.classList.add('open');    overlay.classList.add('open');    document.body.style.overflow='hidden'; menuToggle.setAttribute('aria-expanded','true'); }
    function closeMenu() { mobileMenu.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow='';       menuToggle.setAttribute('aria-expanded','false'); }
    menuToggle.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  // ── Scroll reveal ──
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => revealObs.observe(el));

  // ── Ripple ──
  document.querySelectorAll('[data-ripple]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const r = document.createElement('span');
      r.classList.add('ripple');
      r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
      this.appendChild(r);
      setTimeout(() => r.remove(), 700);
    });
  });

  // ── Cargar noticias si hay contenedor ──
  // Se llama aquí para garantizar que Firebase ya está inicializado
  const newsGrid = document.getElementById('news-grid');
  if (newsGrid && typeof renderNewsCards === 'function') {
    newsGrid.innerHTML = '';
    renderNewsCards('news-grid', 5);
  }
});

// ── renderNewsCards ──
let _lastNewsDoc = null;
let _newsOffset  = 0;

async function renderNewsCards(containerId, limit = 9, append = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!append) { _lastNewsDoc = null; _newsOffset = 0; }

  // Obtener instancia db de forma segura
  const db = window.db ||
    (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length
      ? firebase.firestore()
      : null);

  if (db) {
    // Intento 1: con orderBy timestamp (requiere que el campo exista en todos los docs)
    try {
      let q = db.collection('news').orderBy('timestamp', 'desc').limit(limit);
      if (append && _lastNewsDoc) q = q.startAfter(_lastNewsDoc);
      const snap = await q.get();
      if (!snap.empty) {
        _lastNewsDoc = snap.docs[snap.docs.length - 1];
        _renderDocs(snap.docs, container, append, limit);
        return;
      }
      // Colección vacía (con timestamp)
      // Puede que haya docs sin timestamp, intentar sin orderBy
    } catch(e1) {
      console.warn('[Noticias] orderBy timestamp falló, reintentando sin orden:', e1.code, e1.message);
    }

    // Intento 2: sin orderBy (funciona aunque los docs no tengan timestamp)
    try {
      let q2 = db.collection('news').limit(limit);
      const snap2 = await q2.get();
      if (!snap2.empty) {
        _renderDocs(snap2.docs, container, append, limit);
        return;
      }
      // Colección realmente vacía
      if (!append) container.innerHTML = _emptyMsg();
      return;
    } catch(e2) {
      console.error('[Noticias] Error Firestore:', e2.code, e2.message);
      if (!append) {
        container.innerHTML = e2.code === 'permission-denied'
          ? _permMsg()
          : _errMsg(e2.message);
      }
      return;
    }
  }

  // Fallback estático
  const fallback = window.NOTICIAS_FALLBACK || [];
  if (!fallback.length) {
    if (!append) container.innerHTML = _emptyMsg();
    return;
  }
  const page = fallback.slice(_newsOffset, _newsOffset + limit);
  _newsOffset += page.length;
  const html = page.map((n, i) => _buildCard({
    id: n.id || i, title: n.title||n.titulo||'Sin titulo',
    date: n.date||n.fecha||'', tag: n.tag||n.categoria||'Club',
    image: n.image||n.imagen||'', summary: n.summary||n.resumen||''
  }, i, append)).join('');
  if (append) container.insertAdjacentHTML('beforeend', html);
  else container.innerHTML = html;
  if (typeof feather !== 'undefined') feather.replace();
  const lb = document.getElementById('load-more-btn');
  if (lb && _newsOffset >= fallback.length) { lb.textContent = 'No hay más noticias'; lb.disabled = true; }
}

function _renderDocs(docs, container, append, limit) {
  const html = docs.map((doc, i) => {
    const d = doc.data();
    return _buildCard({
      id: doc.id,
      title:   d.title   || d.titulo   || 'Sin titulo',
      date:    d.date    || d.fecha    || '',
      tag:     d.tag     || d.categoria || 'Club',
      image:   d.image   || d.imagen   || '',
      summary: d.summary || d.resumen  || ''
    }, i, append);
  }).join('');
  if (append) container.insertAdjacentHTML('beforeend', html);
  else container.innerHTML = html;
  if (typeof feather !== 'undefined') feather.replace();
  const lb = document.getElementById('load-more-btn');
  if (lb && docs.length < limit) { lb.textContent = 'No hay más noticias'; lb.disabled = true; }
}

function _buildCard(n, i, append) {
  const isFirst = (i === 0 && !append);
  return `<a class="news-card${isFirst?' featured':''} reveal delay-${Math.min(i+1,5)}" href="noticia.html?id=${encodeURIComponent(n.id)}">
    ${n.image ? `<img class="news-card-img" src="${n.image}" alt="${n.title}" loading="lazy">` : '<div class="news-card-img" style="background:rgba(18,85,201,0.15);"></div>'}
    <div class="news-card-overlay"></div>
    <div class="news-card-body">
      <span class="news-card-cat">${n.tag}</span>
      <h3 class="news-card-title">${n.title}</h3>
      <div class="news-card-date">${n.date}</div>
    </div>
  </a>`;
}

function _emptyMsg() { return '<div style="grid-column:1/-1;padding:4rem;text-align:center;opacity:.5;"><p style="font-family:Barlow Condensed,sans-serif;text-transform:uppercase;font-weight:900;font-size:1.1rem;">Aún no hay noticias publicadas</p></div>'; }
function _permMsg() { return '<div style="grid-column:1/-1;padding:3rem;text-align:center;background:rgba(239,68,68,0.08);border-radius:8px;"><p style="color:#ef4444;font-weight:700;">Error de permisos Firestore</p></div>'; }
function _errMsg(m) { return `<div style="grid-column:1/-1;padding:3rem;text-align:center;"><p style="color:#ef4444;font-size:.85rem;">Error: ${m}</p></div>`; }

// Aliases para compatibilidad
window.renderNewsCards = renderNewsCards;
window.buildNewsCardHTML = _buildCard;
