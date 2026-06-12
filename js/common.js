/**
 * TOLOSA CF ESKUBALOIA - Common JS
 * Navbar, theme, mobile menu, renderNewsCards.
 *
 * IMPORTANTE: renderNewsCards NO se llama automáticamente aquí.
 * Cada página la invoca explícitamente cuando su contenedor esté listo
 * y Firebase ya esté inicializado.
 */

function _applyTheme(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  const toggleBtns = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle');
  toggleBtns.forEach(btn => {
    const icon = btn.querySelector('i[data-feather]') || btn.querySelector('svg');
    if (icon) {
      if (icon.tagName === 'svg') {
        const newIcon = document.createElement('i');
        newIcon.setAttribute('data-feather', isDark ? 'sun' : 'moon');
        newIcon.style.cssText = 'width:15px;height:15px;';
        icon.replaceWith(newIcon);
      } else {
        icon.setAttribute('data-feather', isDark ? 'sun' : 'moon');
      }
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

  // NOTA: renderNewsCards ya NO se llama aquí.
  // noticias.html y index.html la llaman ellas mismas tras inicializar Firebase.
});

// ── renderNewsCards ──
// Pública. La llama cada página con su propio containerId.
// Orden de llamada garantizado: Firebase inline → noticias-data.js → common.js → inline DOMContentLoaded
let _lastNewsDoc = null;
let _newsOffset  = 0;

async function renderNewsCards(containerId, limit, append) {
  limit = limit || 9;
  append = append || false;

  const container = document.getElementById(containerId);
  if (!container) {
    console.warn('[renderNewsCards] Contenedor no encontrado:', containerId);
    return;
  }

  if (!append) { _lastNewsDoc = null; _newsOffset = 0; }

  // Obtener instancia db
  const db = window.db ||
    (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length
      ? firebase.firestore()
      : null);

  if (db) {
    // Intento 1: con orderBy timestamp desc
    // Firestore excluye docs sin campo timestamp — si hay docs sin él caeremos al intento 2
    try {
      let q = db.collection('news').orderBy('timestamp', 'desc').limit(limit);
      if (append && _lastNewsDoc) q = q.startAfter(_lastNewsDoc);
      const snap = await q.get();

      if (!snap.empty) {
        _lastNewsDoc = snap.docs[snap.docs.length - 1];
        _renderDocs(snap.docs, container, append, limit);
        return;
      }
      // snap vacío con orderBy: puede haber docs sin timestamp — continuar al intento 2
      console.info('[Noticias] orderBy timestamp devuelve vacío, reintentando sin orden...');
    } catch(e1) {
      console.warn('[Noticias] orderBy timestamp falló:', e1.code, e1.message);
    }

    // Intento 2: sin orderBy — funciona aunque los docs no tengan timestamp
    try {
      let q2 = db.collection('news').limit(limit);
      const snap2 = await q2.get();

      if (!snap2.empty) {
        // Ordenar en JS por el mejor campo disponible
        const sorted = snap2.docs.slice().sort((a, b) => {
          const da = a.data(), db_ = b.data();
          // timestamp (Firestore Timestamp)
          const ta = da.timestamp?.seconds || 0;
          const tb = db_.timestamp?.seconds || 0;
          if (ta !== tb) return tb - ta;
          // date string ("12 ENE 2026") — comparar lexicográficamente como aproximación
          const sa = da.date || da.fecha || '';
          const sb = db_.date || db_.fecha || '';
          return sb.localeCompare(sa);
        });
        _renderDocs(sorted, container, append, limit);
        return;
      }

      // Colección realmente vacía en Firestore
      if (!append) container.innerHTML = _emptyMsg();
      return;

    } catch(e2) {
      console.error('[Noticias] Error Firestore intento 2:', e2.code, e2.message);
      if (!append) {
        container.innerHTML = e2.code === 'permission-denied' ? _permMsg() : _errMsg(e2.message);
      }
      return;
    }
  }

  // Sin Firebase disponible — fallback estático
  console.warn('[Noticias] Firebase no disponible, usando fallback estático');
  const fallback = window.NOTICIAS_FALLBACK || [];
  if (!fallback.length) {
    if (!append) container.innerHTML = _emptyMsg();
    return;
  }
  const page = fallback.slice(_newsOffset, _newsOffset + limit);
  _newsOffset += page.length;
  const html = page.map((n, i) => _buildCard({
    id:      n.id || i,
    title:   n.title   || n.titulo   || 'Sin titulo',
    date:    n.date    || n.fecha    || '',
    tag:     n.tag     || n.categoria || 'Club',
    image:   n.image   || n.imagen   || '',
    summary: n.summary || n.resumen  || ''
  }, i, append)).join('');
  if (append) container.insertAdjacentHTML('beforeend', html);
  else container.innerHTML = html;
  if (typeof feather !== 'undefined') feather.replace();
  const lb = document.getElementById('load-more-btn');
  if (lb && _newsOffset >= fallback.length) { lb.textContent = 'No hay más noticias'; lb.disabled = true; }
}

function _renderDocs(docs, container, append, limit) {
  const html = docs.map((docOrObj, i) => {
    // Acepta tanto DocumentSnapshot como objeto plano (del sort)
    const d = typeof docOrObj.data === 'function' ? docOrObj.data() : docOrObj;
    const id = docOrObj.id || d.id || i;
    return _buildCard({
      id,
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
    ${n.image
      ? `<img class="news-card-img" src="${n.image}" alt="${n.title}" loading="lazy">`
      : '<div class="news-card-img" style="background:rgba(18,85,201,0.15);"></div>'
    }
    <div class="news-card-overlay"></div>
    <div class="news-card-body">
      <span class="news-card-cat">${n.tag}</span>
      <h3 class="news-card-title">${n.title}</h3>
      <div class="news-card-date">${n.date}</div>
    </div>
  </a>`;
}

function _emptyMsg() {
  return '<div style="grid-column:1/-1;padding:4rem;text-align:center;opacity:.5;"><p style="font-family:Barlow Condensed,sans-serif;text-transform:uppercase;font-weight:900;font-size:1.1rem;">Aún no hay noticias publicadas</p><p style="font-size:.85rem;margin-top:.5rem;">Vuelve pronto.</p></div>';
}
function _permMsg() {
  return '<div style="grid-column:1/-1;padding:3rem;text-align:center;background:rgba(239,68,68,0.08);border-radius:8px;border:1px solid rgba(239,68,68,0.15);"><p style="color:#ef4444;font-weight:700;">Error de permisos Firestore</p><p style="font-size:.82rem;margin-top:.5rem;color:rgba(0,0,0,0.5);">Comprueba las reglas de la colección news en Firebase Console.</p></div>';
}
function _errMsg(m) {
  return `<div style="grid-column:1/-1;padding:3rem;text-align:center;"><p style="color:#ef4444;font-size:.85rem;">Error al cargar noticias: ${m}</p></div>`;
}

// Exports globales
window.renderNewsCards   = renderNewsCards;
window.buildNewsCardHTML = _buildCard;
