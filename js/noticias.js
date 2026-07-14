(function() {
  // Inicializar Firebase
  const cfg = {
    apiKey: "AIzaSyB2mYl__UKQCc90tSEW2dGQ_6D60bO4xuM",
    authDomain: "tolosa-cf-eskubaloia.firebaseapp.com",
    projectId: "tolosa-cf-eskubaloia",
    storageBucket: "tolosa-cf-eskubaloia.firebasestorage.app",
    messagingSenderId: "243368570014",
    appId: "1:243368570014:web:181d7f5f5990014fbf9f8f"
  };
  if (!firebase.apps.length) firebase.initializeApp(cfg);
  const db = firebase.firestore();
  window.db = db; // exponer para debug

  const PAGE_SIZE = 9;
  let lastDoc = null;
  let allLoaded = false;

  // ── Construir card HTML ──
  
  // --- Construir card segura ---
  function buildCard(id, data, featured) {
    const title   = data.title   || data.titulo   || 'Sin titulo';
    const date    = data.date    || data.fecha    || '';
    const tag     = data.tag     || data.categoria || 'Club';
    const image   = safeURL(data.image || data.imagen, 'image');
    
    const a = document.createElement('a');
    a.className = 'news-card' + (featured ? ' featured' : '');
    a.href = 'noticia.html?id=' + encodeURIComponent(id);
    
    if(image) {
      const img = document.createElement('img');
      img.className = 'news-card-img';
      img.src = image;
      img.loading = 'lazy';
      img.alt = title;
      a.appendChild(img);
    } else {
      const div = document.createElement('div');
      div.className = 'news-card-img';
      div.style.background = 'rgba(18,85,201,0.15)';
      a.appendChild(div);
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'news-card-overlay';
    a.appendChild(overlay);
    
    const body = document.createElement('div');
    body.className = 'news-card-body';
    
    const tagSpan = document.createElement('span');
    tagSpan.className = 'news-card-cat';
    tagSpan.textContent = tag;
    body.appendChild(tagSpan);
    
    const h3 = document.createElement('h3');
    h3.className = 'news-card-title';
    h3.textContent = title;
    body.appendChild(h3);
    
    const dateDiv = document.createElement('div');
    dateDiv.className = 'news-card-date';
    dateDiv.textContent = date;
    body.appendChild(dateDiv);
    
    a.appendChild(body);
    return a;
  }


  // ── Ordenar docs en JS (por timestamp o date) ──
  function sortDocs(docs) {
    return docs.slice().sort((a, b) => {
      const da = a.data(), db_ = b.data();
      const ta = da.timestamp ? da.timestamp.seconds : 0;
      const tb = db_.timestamp ? db_.timestamp.seconds : 0;
      if (ta !== tb) return tb - ta;
      // fallback: comparar string de fecha
      return (db_.date || '').localeCompare(da.date || '');
    });
  }

  // ── Cargar noticias ──
  async function loadNoticias(append) {
    const container = document.getElementById('news-container');
    const btn = document.getElementById('load-more-btn');
    if (!container) return;

    if (!append) {
      lastDoc = null;
      allLoaded = false;
      container.innerHTML = `<div style="grid-column:1/-1;padding:3rem;text-align:center;">
        <div style="width:28px;height:28px;border:3px solid rgba(18,85,201,.15);border-top-color:#1e6ef5;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto;"></div>
      </div>`;
    }
    if (btn) btn.style.display = 'none';

    try {
      let docs = [];

      // Intento 1: con orderBy timestamp
      try {
        let q = db.collection('news').orderBy('timestamp', 'desc').limit(PAGE_SIZE);
        if (append && lastDoc) q = q.startAfter(lastDoc);
        const snap = await q.get();
        if (!snap.empty) {
          docs = snap.docs;
          lastDoc = snap.docs[snap.docs.length - 1];
        }
      } catch (e1) {
        console.warn('[Noticias] orderBy falló, leyendo sin orden:', e1.message);
      }

      // Intento 2: sin orderBy si el 1 devolvió vacío
      if (!docs.length) {
        const snap2 = await db.collection('news').limit(50).get();
        if (!snap2.empty) {
          docs = sortDocs(snap2.docs);
          allLoaded = true; // cargamos todo de golpe
        }
      }

      if (!docs.length) {
        if (!append) {
          container.innerHTML = `<div style="grid-column:1/-1;padding:4rem;text-align:center;opacity:.5;">
            <p style="font-family:'Barlow Condensed',sans-serif;text-transform:uppercase;font-weight:900;font-size:1.1rem;">Aún no hay noticias publicadas</p>
          </div>`;
        }
        return;
      }

      // Renderizar
      
      if(!append) container.innerHTML = '';
      docs.forEach((doc, i) => {
        const card = buildCard(doc.id, doc.data(), i === 0 && !append);
        container.appendChild(card);
      });


      if (typeof feather !== 'undefined') feather.replace();

      // Mostrar botón cargar más si puede haber más
      if (!allLoaded && docs.length >= PAGE_SIZE) {
        if (btn) { btn.style.display = 'inline-flex'; btn.disabled = false; }
      }

    } catch (e) {
      console.error('[Noticias] Error:', e.code, e.message);
      if (!append) {
        container.innerHTML = `<div style="grid-column:1/-1;padding:3rem;text-align:center;">
          <p style="color:#ef4444;font-size:.9rem;">Error al cargar noticias: ${e.message}</p>
        </div>`;
      }
    }
  }

  // Exponer función para el botón "cargar más"
  window.loadMoreNoticias = function() {
    const btn = document.getElementById('load-more-btn');
    if (btn) btn.disabled = true;
    loadNoticias(true).then(() => {
      if (typeof feather !== 'undefined') feather.replace();
    });
  };

  // Arrancar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => loadNoticias(false));
  } else {
    loadNoticias(false);
  }
})();