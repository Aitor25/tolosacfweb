import re

try:
    with open('js/common.js', 'r', encoding='utf-8') as f:
        js = f.read()

    # Refactor safeURL
    new_safe_url = """// Centralized URL Validator
function safeURL(urlStr, type = 'link') {
  if (!urlStr) return '';
  try {
    const u = new URL(urlStr, window.location.origin);
    const proto = u.protocol.toLowerCase();
    
    // Rechazar explícitamente credenciales embebidas para mitigar ataques de phishing (ej. http://user:pass@google.com)
    if (u.username || u.password) return '';
    
    if (type === 'image') {
      if (proto === 'https:' || proto === 'http:') return u.href;
      return ''; 
    }
    
    if (type === 'link') {
      if (['http:', 'https:', 'mailto:', 'tel:'].includes(proto)) return u.href;
      return '';
    }
    return '';
  } catch(e) {
    return '';
  }
}
"""
    js = re.sub(r'// Centralized URL Validator\nfunction safeURL\(urlStr, type = \'link\'\) \{.*?\n\}\n', new_safe_url, js, flags=re.DOTALL)

    # Refactor renderNewsCards and its helpers to use createElement
    # We will completely replace all functions from `// ── renderNewsCards (para common.js — no se autoinvoca) ──` to the end of URL Validator

    render_regex = r"// ── renderNewsCards.*?window\.buildNewsCardHTML = _buildCard;\n"
    
    new_render_code = """// ── renderNewsCards (para common.js — no se autoinvoca) ──
let _lastNewsDoc = null;
let _newsOffset  = 0;

function _emptyMsg() {
  const div = document.createElement('div');
  div.style.cssText = "grid-column:1/-1;padding:4rem;text-align:center;opacity:.5;";
  const p = document.createElement('p');
  p.style.cssText = "font-family:'Barlow Condensed',sans-serif;text-transform:uppercase;font-weight:900;font-size:1.1rem;";
  p.textContent = "Aún no hay noticias publicadas";
  div.appendChild(p);
  return div;
}

function _permMsg() {
  const div = document.createElement('div');
  div.style.cssText = "grid-column:1/-1;padding:3rem;text-align:center;";
  const p = document.createElement('p');
  p.style.cssText = "color:#ef4444;font-weight:700;";
  p.textContent = "Error de permisos Firestore";
  div.appendChild(p);
  return div;
}

function _errMsg(m) {
  const div = document.createElement('div');
  div.style.cssText = "grid-column:1/-1;padding:3rem;text-align:center;";
  const p = document.createElement('p');
  p.style.cssText = "color:#ef4444;font-size:.85rem;";
  p.textContent = "Error: " + m;
  div.appendChild(p);
  return div;
}

function _buildCard(n, i, append) {
  const a = document.createElement('a');
  a.className = 'news-card' + ((i === 0 && !append) ? ' featured' : '') + ' reveal delay-' + Math.min(i+1, 5);
  a.href = 'noticia.html?id=' + encodeURIComponent(n.id);
  
  if (n.image) {
    const img = document.createElement('img');
    img.className = 'news-card-img';
    img.src = safeURL(n.image, 'image');
    img.alt = n.title;
    img.loading = 'lazy';
    a.appendChild(img);
  } else {
    const imgDiv = document.createElement('div');
    imgDiv.className = 'news-card-img';
    imgDiv.style.background = 'rgba(18,85,201,0.15)';
    a.appendChild(imgDiv);
  }
  
  const overlay = document.createElement('div');
  overlay.className = 'news-card-overlay';
  a.appendChild(overlay);
  
  const body = document.createElement('div');
  body.className = 'news-card-body';
  
  const cat = document.createElement('span');
  cat.className = 'news-card-cat';
  cat.textContent = n.tag;
  body.appendChild(cat);
  
  const h3 = document.createElement('h3');
  h3.className = 'news-card-title';
  h3.textContent = n.title;
  body.appendChild(h3);
  
  const dateDiv = document.createElement('div');
  dateDiv.className = 'news-card-date';
  dateDiv.textContent = n.date;
  body.appendChild(dateDiv);
  
  a.appendChild(body);
  return a;
}

function _renderDocs(docs, container, append, limit) {
  if (!append) container.textContent = '';
  docs.forEach((doc, i) => {
    const d = typeof doc.data === 'function' ? doc.data() : doc;
    const id = doc.id || d.id || i;
    const cardData = { id, title: d.title||d.titulo||'Sin titulo', date: d.date||d.fecha||'', tag: d.tag||d.categoria||'Club', image: d.image||d.imagen||'', summary: d.summary||d.resumen||'' };
    container.appendChild(_buildCard(cardData, i, append));
  });
  if (typeof feather !== 'undefined') feather.replace();
  const lb = document.getElementById('load-more-btn');
  if (lb && docs.length < limit) { lb.textContent = 'No hay más noticias'; lb.disabled = true; }
}

async function renderNewsCards(containerId, limit, append) {
  limit = limit || 9;
  append = append || false;
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!append) { _lastNewsDoc = null; _newsOffset = 0; }
  
  const db = window.db || (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length ? firebase.firestore() : null);
  if (db) {
    try {
      let q = db.collection('news').orderBy('timestamp', 'desc').limit(limit);
      if (append && _lastNewsDoc) q = q.startAfter(_lastNewsDoc);
      const snap = await q.get();
      if (!snap.empty) {
        _lastNewsDoc = snap.docs[snap.docs.length - 1];
        _renderDocs(snap.docs, container, append, limit);
        return;
      }
    } catch(e1) {
      console.warn('[Noticias] orderBy timestamp falló:', e1.message);
    }
    try {
      const snap2 = await db.collection('news').limit(limit).get();
      if (!snap2.empty) { _renderDocs(snap2.docs, container, append, limit); return; }
      if (!append) { container.textContent = ''; container.appendChild(_emptyMsg()); }
    } catch(e2) {
      if (!append) { container.textContent = ''; container.appendChild(e2.code === 'permission-denied' ? _permMsg() : _errMsg(e2.message)); }
    }
    return;
  }
  
  const fallback = window.NOTICIAS_FALLBACK || [];
  if (!fallback.length) { 
    if (!append) { container.textContent = ''; container.appendChild(_emptyMsg()); }
    return; 
  }
  
  const page = fallback.slice(_newsOffset, _newsOffset + limit);
  _newsOffset += page.length;
  
  if (!append) container.textContent = '';
  page.forEach((n, i) => {
    const cardData = { id: n.id||i, title: n.title||n.titulo||'Sin titulo', date: n.date||n.fecha||'', tag: n.tag||n.categoria||'Club', image: n.image||n.imagen||'', summary: n.summary||n.resumen||'' };
    container.appendChild(_buildCard(cardData, i, append));
  });
  if (typeof feather !== 'undefined') feather.replace();
}

window.renderNewsCards   = renderNewsCards;
window.buildNewsCardHTML = _buildCard;
"""
    js = re.sub(render_regex, new_render_code, js, flags=re.DOTALL)
    
    with open('js/common.js', 'w', encoding='utf-8') as f:
        f.write(js)
except Exception as e:
    print(e)
