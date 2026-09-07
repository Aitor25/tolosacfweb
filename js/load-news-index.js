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
      var currentLang = typeof getLang === 'function' ? getLang() : 'es';
      var t = window.TRANSLATIONS && window.TRANSLATIONS[currentLang];
      var emptyMsg = t && t['news.empty'] ? t['news.empty'] : 'Aún no hay noticias';
      grid.innerHTML = '<div class="news-placeholder featured" style="grid-column:1/-1;"><span class="news-placeholder-text">' + emptyMsg + '</span></div>';
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

  function loadFixtureBanner() {
    var db = window.db;
    if (!db) { console.warn('[load-news-index] window.db no disponible'); return; }
    
    Promise.all([
      db.collection('competitions').doc('senior-masculino').get(),
      db.collection('competitions').doc('teamLogos').get()
    ]).then(function(docs) {
        var compDoc = docs[0];
        var logoDoc = docs[1];
        if (!compDoc.exists) return;
        
        var globalLogos = {};
        if(logoDoc.exists) {
          var rawData = logoDoc.data();
          for(var key in rawData) {
            if(!key) continue;
            var normKey = key.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z0-9]/g, "");
            globalLogos[normKey] = rawData[key];
          }
        }
        
        function getCrestHtml(teamName) {
          if(!teamName) return '';
          var slug = teamName.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z0-9]/g, "");
          var isTolosa = slug.indexOf('TOLOSA') > -1;
          var src = isTolosa ? 'escudo.png' : (globalLogos[slug] || '');
          if(src) return '<img src="' + src + '" style="width:100%;height:100%;object-fit:contain;" alt="' + teamName + '">';
          return '<i data-feather="shield" style="width:50%;height:50%;opacity:0.2;"></i>';
        }
        
        var data = compDoc.data();
        var results = data.results || [];
        
        var tolosaMatches = results.filter(function(m) {
          var homeLower = (m.home || '').toLowerCase();
          var awayLower = (m.away || '').toLowerCase();
          return homeLower.indexOf('tolosa') > -1 || awayLower.indexOf('tolosa') > -1;
        });
        
        tolosaMatches.sort(function(a, b) {
          return (a.journey || 1) - (b.journey || 1);
        });
        
        var nextMatch = null;
        for (var i = 0; i < tolosaMatches.length; i++) {
          var m = tolosaMatches[i];
          var score = m.score || '';
          var parts = score.split('-').map(function(s) { return parseInt(s.trim(), 10); });
          var isPlayed = parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]);
          if (!isPlayed) {
            nextMatch = m;
            break;
          }
        }
        
        var lastResult = null;
        for (var j = tolosaMatches.length - 1; j >= 0; j--) {
          var m2 = tolosaMatches[j];
          var score2 = m2.score || '';
          var parts2 = score2.split('-').map(function(s) { return parseInt(s.trim(), 10); });
          var isPlayed2 = parts2.length === 2 && !isNaN(parts2[0]) && !isNaN(parts2[1]);
          if (isPlayed2) {
            lastResult = m2;
            break;
          }
        }
        
        var currentLang = typeof getLang === 'function' ? getLang() : 'es';
        var t = window.TRANSLATIONS && window.TRANSLATIONS[currentLang];

        function updateAll(selector, content, isHtml) {
          var els = document.querySelectorAll(selector);
          for(var k=0; k<els.length; k++) {
            if(isHtml) els[k].innerHTML = content;
            else els[k].textContent = content;
          }
        }

        if (nextMatch) {
          updateAll('.mc-next-home-name', nextMatch.home);
          updateAll('#mc-next-home-crest-a, #mc-next-home-crest-b', getCrestHtml(nextMatch.home), true);
          updateAll('.mc-next-away-name', nextMatch.away);
          updateAll('#mc-next-away-crest-a, #mc-next-away-crest-b', getCrestHtml(nextMatch.away), true);
          
          var dayOfWeek = typeof getDayOfWeekName === 'function' ? getDayOfWeekName(nextMatch.date, currentLang) : '';
          var dateText = dayOfWeek ? dayOfWeek + ', ' + (nextMatch.date || '') : (nextMatch.date || 'Pendiente');
          if (nextMatch.time && nextMatch.time !== 'Pendiente' && nextMatch.time !== '0:00') {
            dateText += ' • ' + nextMatch.time;
          }
          updateAll('.mc-next-date', dateText);
          updateAll('.mc-next-venue', nextMatch.venue || 'Usabal Kiroldegia');
        }
        
        if (lastResult) {
          updateAll('.mc-last-home-name', lastResult.home);
          updateAll('#mc-last-home-crest-a, #mc-last-home-crest-b', getCrestHtml(lastResult.home), true);
          updateAll('.mc-last-away-name', lastResult.away);
          updateAll('#mc-last-away-crest-a, #mc-last-away-crest-b', getCrestHtml(lastResult.away), true);
          
          updateAll('.mc-last-score', lastResult.score || '—');
          var jText = t && t['fixture.journey'] ? t['fixture.journey'] : 'Jornada';
          updateAll('.mc-last-journey', jText + ' ' + (lastResult.journey || 1));
        }
        
        if (typeof feather !== 'undefined') feather.replace();
        if (typeof applyTranslations === 'function') applyTranslations();
      })
      .catch(function(err) {
        console.warn('Error loading fixture banner:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      loadNews();
      loadFixtureBanner();
    });
  } else {
    loadNews();
    loadFixtureBanner();
  }
})();
