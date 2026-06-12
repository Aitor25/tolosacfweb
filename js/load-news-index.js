/**
 * js/load-news-index.js
 * Carga las noticias del index desde Firestore de forma autonoma.
 * Se incluye despues de firebase-config.js en index.html
 */
(function() {
  function buildCard(id, data, featured) {
    const title = data.title || data.titulo || 'Sin titulo';
    const date  = data.date  || data.fecha  || '';
    const tag   = data.tag   || data.categoria || 'Club';
    const image = data.image || data.imagen || '';
    return '<a class="news-card' + (featured ? ' featured' : '') + '" href="noticia.html?id=' + encodeURIComponent(id) + '">'
      + (image ? '<img class="news-card-img" src="' + image + '" alt="' + title + '" loading="lazy">' : '<div class="news-card-img" style="background:rgba(18,85,201,0.15);"></div>')
      + '<div class="news-card-overlay"></div>'
      + '<div class="news-card-body">'
      + '<span class="news-card-cat">' + tag + '</span>'
      + '<h3 class="news-card-title">' + title + '</h3>'
      + '<div class="news-card-date">' + date + '</div>'
      + '</div></a>';
  }

  function sortDocs(docs) {
    return docs.slice().sort(function(a, b) {
      var da = a.data(), db_ = b.data();
      var ta = da.timestamp ? da.timestamp.seconds : 0;
      var tb = db_.timestamp ? db_.timestamp.seconds : 0;
      if (ta !== tb) return tb - ta;
      return (db_.date || '').localeCompare(da.date || '');
    });
  }

  function loadHomeNews() {
    var grid = document.getElementById('news-grid');
    if (!grid) return;
    var db = window.db;
    if (!db) {
      console.warn('[Index] window.db no disponible');
      return;
    }

    // Intento 1: con orderBy timestamp
    db.collection('news').orderBy('timestamp', 'desc').limit(5).get()
      .then(function(snap) {
        if (!snap.empty) {
          grid.innerHTML = snap.docs.map(function(doc, i) {
            return buildCard(doc.id, doc.data(), i === 0);
          }).join('');
          if (typeof feather !== 'undefined') feather.replace();
          return;
        }
        // Vacio con orderBy: intentar sin orden
        return db.collection('news').limit(20).get().then(function(snap2) {
          if (snap2.empty) {
            grid.innerHTML = '<div class="news-placeholder featured" style="grid-column:1/-1;"><span class="news-placeholder-text">Aun no hay noticias</span></div>';
            return;
          }
          var sorted = sortDocs(snap2.docs).slice(0, 5);
          grid.innerHTML = sorted.map(function(doc, i) {
            return buildCard(doc.id, doc.data(), i === 0);
          }).join('');
          if (typeof feather !== 'undefined') feather.replace();
        });
      })
      .catch(function(e) {
        console.warn('[Index] orderBy fallo, reintentando sin orden:', e.message);
        // Intento 2 en el catch
        db.collection('news').limit(20).get().then(function(snap2) {
          if (snap2.empty) return;
          var sorted = sortDocs(snap2.docs).slice(0, 5);
          grid.innerHTML = sorted.map(function(doc, i) {
            return buildCard(doc.id, doc.data(), i === 0);
          }).join('');
          if (typeof feather !== 'undefined') feather.replace();
        }).catch(function(e2) {
          console.error('[Index] Error cargando noticias:', e2.message);
        });
      });
  }

  // Arrancar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHomeNews);
  } else {
    loadHomeNews();
  }
})();
