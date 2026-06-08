// Funciones comunes compartidas entre páginas.
// Se exponen en `window` para que las plantillas (sin módulos) las
// puedan llamar directamente.

/**
 * Formatea una fecha en formato corto en español.
 */
function formatFecha(fecha) {
  if (!fecha) return "";
  try {
    const d = (fecha instanceof Date) ? fecha : new Date(fecha);
    if (isNaN(d.getTime())) return String(fecha);
    return d.toLocaleDateString("es-ES", {
      year: "numeric", month: "short", day: "2-digit"
    });
  } catch (e) {
    return String(fecha);
  }
}

/**
 * Escapa HTML básico para evitar inyecciones al renderizar contenido.
 */
function escapeHTML(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u003c")
    .replace(/>/g, "\u003e")
    .replace(/"/g, "\u0022")
    .replace(/'/g, "\u0027");
}

/**
 * Pinta tarjetas de noticias en un contenedor.
 * @param {string} containerId  id del elemento destino
 * @param {number} limit        máximo de tarjetas a mostrar
 *
 * Intenta leer primero desde Firestore (si está configurado y disponible);
 * si no, usa window.NOTICIAS_FALLBACK para no dejar la web vacía.
 */
function renderNewsCards(containerId, limit) {
  const cont = document.getElementById(containerId);
  if (!cont) return;

  const max = (typeof limit === "number" && limit > 0) ? limit : 5;
  const paint = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      cont.innerHTML =
        '<div class="news-placeholder reveal delay-1">' +
          '<span class="news-placeholder-text">Sin noticias por ahora</span>' +
        '</div>';
      return;
    }

    const html = items.slice(0, max).map((n, i) => {
      const featured = (i === 0) ? " featured" : "";
      const delay = " delay-" + Math.min(i + 1, 5);
      const titulo = escapeHTML(n.titulo || "Sin título");
      const categoria = escapeHTML(n.categoria || "Actualidad");
      const fecha = escapeHTML(formatFecha(n.fecha));
      const imagen = escapeHTML(n.imagen || "");
      const resumen = escapeHTML(n.resumen || "");
      const href = "noticia.html?id=" + encodeURIComponent(n.id || "");

      return (
        '<a class="news-card' + featured + ' reveal' + delay + '" href="' + href + '">' +
          (imagen
            ? '<img class="news-card-img" src="' + imagen + '" alt="' + titulo + '">'
            : '<div class="news-placeholder" style="aspect-ratio:3/2;"></div>') +
          '<div class="news-card-overlay" aria-hidden="true"></div>' +
          '<div class="news-card-body">' +
            '<span class="news-card-cat">' + categoria + '</span>' +
            '<h3 class="news-card-title">' + titulo + '</h3>' +
            (resumen ? '<p class="news-card-date">' + resumen + '</p>' : '') +
            '<div class="news-card-date">' + fecha + '</div>' +
          '</div>' +
        '</a>'
      );
    }).join("");

    cont.innerHTML = html;

    // Re-engancha el observador de "reveal" si existe en la página.
    if (typeof window.__revealObserver === "function") {
      window.__revealObserver();
    }
  };

  // Intentar Firestore; si falla, fallback estático.
  try {
    if (typeof firebase !== "undefined" &&
        firebase.apps.length &&
        firebase.firestore) {
      const db = firebase.firestore();
      db.collection("noticias")
        .orderBy("fecha", "desc")
        .limit(max)
        .get()
        .then(snap => {
          if (snap.empty) {
            paint(window.NOTICIAS_FALLBACK);
            return;
          }
          const items = [];
          snap.forEach(doc => items.push(Object.assign({ id: doc.id }, doc.data())));
          paint(items);
        })
        .catch(() => paint(window.NOTICIAS_FALLBACK));
      return;
    }
  } catch (e) {
    /* seguimos al fallback */
  }

  paint(window.NOTICIAS_FALLBACK);
}

// Exponer en window (plantillas sin módulos).
window.renderNewsCards = renderNewsCards;
window.formatFecha = formatFecha;
window.escapeHTML = escapeHTML;
