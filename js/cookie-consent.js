/**
 * js/cookie-consent.js
 * Banner de consentimiento de cookies (LSSI-CE / RGPD).
 *
 * El único elemento no esencial que carga cookies de terceros en este sitio
 * es el widget de Instagram (LightWidget) de la portada. Este script:
 *   1) Muestra un aviso pidiendo consentimiento antes de cargar nada no esencial.
 *   2) Si el visitante acepta, inyecta el widget de Instagram (solo entonces).
 *   3) Si rechaza, muestra un enlace directo a Instagram sin cookies de terceros.
 *   4) Recuerda la decisión en localStorage ('cookieConsent': 'accepted'|'rejected').
 *
 * El almacenamiento técnico de idioma/tema (localStorage 'lang'/'theme') no
 * requiere consentimiento por ser estrictamente necesario para una función
 * que el propio usuario solicita, así que no lo gestiona este banner.
 */
(function () {
  var CONSENT_KEY = 'cookieConsent';

  function getConsent() {
    return localStorage.getItem(CONSENT_KEY);
  }

  function t(key, fallback) {
    var lang = typeof getLang === 'function' ? getLang() : 'es';
    var dict = window.TRANSLATIONS && window.TRANSLATIONS[lang];
    return (dict && dict[key]) || fallback;
  }

  function injectInstagramWidget() {
    var wrap = document.getElementById('insta-widget');
    if (!wrap || wrap.dataset.igLoaded) return;
    var src = wrap.getAttribute('data-lightwidget-src');
    if (!src) return;
    wrap.dataset.igLoaded = 'true';
    wrap.innerHTML = '';
    var script = document.createElement('script');
    script.src = 'https://cdn.lightwidget.com/widgets/lightwidget.js';
    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.scrolling = 'no';
    iframe.setAttribute('allowtransparency', 'true');
    iframe.className = 'lightwidget-widget';
    iframe.style.cssText = 'width:100%;border:0;overflow:hidden;';
    wrap.appendChild(script);
    wrap.appendChild(iframe);
  }

  function showInstagramPlaceholder() {
    var wrap = document.getElementById('insta-widget');
    if (!wrap || wrap.dataset.igLoaded) return;
    wrap.innerHTML = '';
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.75rem;text-align:center;padding:2.5rem 1.5rem;min-height:200px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;';

    var p = document.createElement('p');
    p.style.cssText = 'font-size:.85rem;color:var(--text-secondary);max-width:360px;margin:0;';
    p.textContent = t('cookies.instaPlaceholder', 'Para ver aquí nuestras publicaciones de Instagram hace falta aceptar sus cookies de terceros.');
    wrap.appendChild(p);

    var btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = t('cookies.acceptAndView', 'Aceptar y ver Instagram');
    btn.addEventListener('click', function () { applyConsent('accepted'); });
    wrap.appendChild(btn);
  }

  function hideBanner() {
    var el = document.getElementById('cookie-banner');
    if (el) el.remove();
  }

  function applyConsent(status) {
    localStorage.setItem(CONSENT_KEY, status);
    hideBanner();
    if (status === 'accepted') injectInstagramWidget();
    else showInstagramPlaceholder();
  }

  function buildBanner() {
    hideBanner();
    var el = document.createElement('div');
    el.id = 'cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Aviso de cookies');
    el.style.cssText = 'position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:500;max-width:640px;margin:0 auto;background:var(--card-bg);color:var(--text-primary);border:1px solid var(--card-border);border-radius:12px;padding:1.25rem 1.5rem;box-shadow:0 12px 40px rgba(0,0,0,0.25);font-family:var(--font-body);';

    var text = document.createElement('p');
    text.style.cssText = 'font-size:.85rem;line-height:1.5;margin:0 0 1rem;color:var(--text-secondary);';
    text.textContent = t('cookies.bannerText', 'Usamos almacenamiento técnico necesario para recordar tu idioma y tema. Si aceptas, también cargamos el widget de Instagram, que instala sus propias cookies de terceros.');
    el.appendChild(text);

    var row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:.75rem;flex-wrap:wrap;align-items:center;';

    var acceptBtn = document.createElement('button');
    acceptBtn.className = 'btn btn-primary';
    acceptBtn.textContent = t('cookies.accept', 'Aceptar');
    acceptBtn.addEventListener('click', function () { applyConsent('accepted'); });

    var rejectBtn = document.createElement('button');
    rejectBtn.className = 'btn btn-ghost';
    rejectBtn.textContent = t('cookies.reject', 'Rechazar');
    rejectBtn.addEventListener('click', function () { applyConsent('rejected'); });

    var infoLink = document.createElement('a');
    infoLink.href = 'cookies.html';
    infoLink.textContent = t('cookies.moreInfo', 'Más información');
    infoLink.style.cssText = 'font-size:.8rem;color:var(--accent-bright);text-decoration:underline;margin-left:auto;';

    row.appendChild(acceptBtn);
    row.appendChild(rejectBtn);
    row.appendChild(infoLink);
    el.appendChild(row);

    document.body.appendChild(el);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var consent = getConsent();
    if (consent === 'accepted') {
      injectInstagramWidget();
    } else if (consent === 'rejected') {
      showInstagramPlaceholder();
    } else {
      showInstagramPlaceholder();
      buildBanner();
    }

    // Botón "volver a preguntar" en la página de Cookies (ambos idiomas conviven en el DOM,
    // así que se usa una clase en vez de un id para no duplicar identificadores)
    document.querySelectorAll('.cookie-settings-btn').forEach(function (btn) {
      btn.addEventListener('click', buildBanner);
    });
  });

  window.addEventListener('langchange', function () {
    if (document.getElementById('cookie-banner')) buildBanner();
  });
})();
