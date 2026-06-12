/**
 * js/load-news-index.js
 * Carga noticias en la portada desde Firestore.
 * Requiere que window.db este inicializado antes (firebase-config.js).
 */
(function() {
  'use strict';

  function buildCard(id, data, featured) {
    var title = data.title || data.titulo || 'Sin titulo';
    var date  = data.date  || data.fecha  || '';
    var tag   = data.tag   || data.categoria || 'Club';
    var image = data.image || data.imagen || '';
    var href  = 'noticia.html?id=' + encodeURIComponent(id);
    var imgHtml = image
      ? '<img class="news-card-img" src="' + image + '" alt="' + title + '" loading="lazy">'
      : '<div class="news-card-img" style="background:rgba(18,85,201,0.15);"></div>';
    return '<a class="news-card' + (featured ? ' featured' : '') + '" href="' + href + '">'
      + imgHtml
      + '<div class="news-card-overlay"></div>'
      + '<div class="news-card-body">'
      + '<span class="news-card-cat">' + tag + '</span>'
      + '<h3 class="news-card-title">' + title + '</h3>'
      + '<div class="news-card-date">' + date + '</div>'
      + '</div></a>';
  }

  function sortByDate(docs) {
    return docs.slice().sort(function(a, b) {
      var da = a.data(), db = b.data();
      var ta = da.timestamp ? da.timestamp.seconds : 0;
      var tb = db.timestamp ? db.timestamp.seconds : 0;
      if (ta !== tb) return tb - ta;
      return (db.date || '').localeCompare(da.date || '');
    });
  }

  function render(docs) {
    var grid = document.getElementById('news-grid');
    if (!grid) return;
    if (!docs.length) {
      grid.innerHTML = '<div class="news-placeholder featured" style="grid-column:1/-1;"><span class="news-placeholder-text">Aun no hay noticias</span></div>';
      return;
    }
    grid.innerHTML = docs.map(function(doc, i) {
      return buildCard(doc.id, doc.data(), i === 0);
    }).join('');
    if (typeof feather !== 'undefined') feather.replace();
  }

  function loadNews() {
    var db = window.db;
    if (!db) { console.warn('[load-news-index] window.db no disponible'); return; }
    var grid = document.getElementById('news-grid');
    if (!grid) return;

    // Intento 1: orderBy timestamp
    db.collection('news').orderBy('timestamp', 'desc').limit(5).get()
      .then(function(snap) {
        if (!snap.empty) { render(snap.docs); return; }
        // Vacio: intentar sin orden
        return db.collection('news').limit(20).get().then(function(s2) {
          render(s2.empty ? [] : sortByDate(s2.docs).slice(0, 5));
        });
      })
      .catch(function(e) {
        console.warn('[load-news-index] orderBy fallo:', e.message);
        // Intento 2: sin orden en el catch
        db.collection('news').limit(20).get()
          .then(function(s2) {
            render(s2.empty ? [] : sortByDate(s2.docs).slice(0, 5));
          })
          .catch(function(e2) {
            console.error('[load-news-index] Error:', e2.message);
          });
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNews);
  } else {
    loadNews();
  }
})();
