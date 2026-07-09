/**
 * js/i18n.js — Sistema de traducciones Tolosa CF Eskubaloia
 *
 * USO EN HTML:
 *   <span data-i18n="nav.news">Noticias</span>
 *   <input data-i18n-placeholder="contact.namePlaceholder" placeholder="Tu nombre">
 *
 * Para añadir una página nueva:
 *   1. Añade atributos data-i18n a sus textos
 *   2. Añade las claves correspondientes en TRANSLATIONS.es y TRANSLATIONS.eu
 *   3. No hay que tocar nada más — common.js llama a applyTranslations() automáticamente
 */

window.TRANSLATIONS = {

  es: {
    // Navbar
    'nav.home':          'Inicio',
    'nav.news':          'Noticias',
    'nav.club':          'El Club',
    'nav.team':          '1. Equipo',
    'nav.sponsors':      'Patrocinadores',
    'nav.contact':       'Contacto',
    'nav.lightMode':     'Modo claro',
    'nav.darkMode':      'Modo oscuro',

    // Hero (index)
    'hero.word1':        'Pasión,',
    'hero.word2':        'fuerza',
    'hero.word3':        'y',
    'hero.word4':        'orgullo',
    'hero.sub':          'Sigue toda la actualidad del Tolosa CF Eskubaloia. Resultados, noticias y toda la emoción del balonmano vasco.',
    'hero.cta.news':     'Últimas noticias',
    'hero.cta.club':     'Conoce el club',

    // Fixture banner
    'fixture.label':     'Próximo partido',
    'fixture.vs':        'Tolosa CF vs',
    'fixture.cta':       'Ver equipo →',

    // Secciones index
    'section.news.eyebrow':  'Actualidad',
    'section.news.title':    'Últimas\nNoticias',
    'section.news.cta':      'Ver todas',

    // Stats
    'stats.years':       'Años de historia',
    'stats.teams':       'Equipos activos',
    'stats.players':     'Jugadores',
    'stats.division':    'División nacional',

    // Instagram
    'insta.eyebrow':     'Redes sociales',
    'insta.title':       'Síguenos en\nInstagram',
    'insta.desc':        'Fotos, vídeos y la actualidad del club en tiempo real.',
    'insta.btn':         'Seguir en Instagram',

    // Partners
    'partners.eyebrow':  'Nuestros patrocinadores',

    // Footer
    'footer.about':      'Más que un club, una familia unida por el balonmano desde hace más de 100 años.',
    'footer.sections':   'Secciones',
    'footer.club':       'El Club',
    'footer.contact':    'Contacto',
    'footer.history':    'Historia',
    'footer.firstTeam':  'Primer equipo',
    'footer.collaborate':'Colabora',
    'footer.legal':      'Aviso legal',
    'footer.privacy':    'Privacidad',
    'footer.cookies':    'Cookies',
    'footer.terms':      'Términos',
    'footer.copy':       '© 2025 Tolosa CF Eskubaloia.',

    // Botones generales
    'btn.seeTeam':       'Ver equipo →',
    'btn.seeAll':        'Ver todas',
    'btn.followIg':      'Seguir en Instagram',
    'btn.contact':       'Contactar ahora',
    'btn.seeStats':      'Ver estadísticas',

    // Club page
    'club.eyebrow':      'Nuestra filosofía',
    'club.title':        'Formando el Futuro',
    'club.p1':           'La clave de nuestro éxito como club es la formación de nuestras jugadoras y jugadores. No solo nos centramos en el apartado deportivo, sino también en formarlos en base a nuestros valores.',
    'club.p2':           'Fomentamos el trabajo en equipo, el compañerismo y el respeto mutuo en cada entrenamiento y partido en el polideportivo Usabal.',
    'club.p3':           'Contamos con más de 10 equipos en todas las categorías, fomentando el balonmano desde la escuela hasta el equipo de 1ª Nacional.',
    'club.cta.label':    'Primera División Nacional',
    'club.cta.title':    'Sigue al Primer Equipo',
    'club.cta.sub':      'Consulta la clasificación, resultados y calendario oficial.',
    'club.values.eyebrow': 'Lo que nos define',
    'club.values.title': 'Nuestros Valores',
    'club.val1.title':   'Pasión',
    'club.val1.text':    'Vivimos cada partido con intensidad y entregamos el alma en la pista.',
    'club.val2.title':   'Comunidad',
    'club.val2.text':    'Somos una familia unida que apoya a sus miembros dentro y fuera del campo.',
    'club.val3.title':   'Respeto',
    'club.val3.text':    'Valores deportivos ante todo: juego limpio con rivales, árbitros y afición.',
    'club.loading':      'Cargando datos...',
    'team.loading':      'Cargando datos...',
    'club.page.title':   'Nuestro Club',
    'club.page.subtitle':'Más de un siglo de historia, deporte y valores en el corazón de Tolosa.',
    'team.page.eyebrow': 'Competición',
    'team.page.title':   'Primer Equipo',
    'competition.name':  '1ª Nacional, Grupo C',
    'team.tab.standings': 'Clasificación',
    'team.tab.results':   'Resultados',
    'team.tab.calendar':  'Calendario',
    'fixture.lastResult': 'Último resultado',
    'contact.form.heading': 'Envíanos un mensaje',
    'contact.form.namePlaceholder': 'Tu nombre',
    'contact.form.emailPlaceholder': 'tu@email.com',
    'contact.form.subjectPlaceholder': '¿De qué se trata?',
    'contact.form.messagePlaceholder': 'Escribe tu mensaje aquí...',
    'news.page.title':   'Toda la<br><em>Actualidad</em>',
    'news.page.subtitle':'Mantente al día con todas las novedades del club, resultados y eventos.',
    'news.loading':      'Cargando noticias...',
    'news.loadMore':     'Cargar más noticias',
    'article.backToNews': 'Volver a noticias',
    'article.backToAll':  'Volver a todas las noticias',
    'sponsors.page.title':'Nuestros<br><em>Patrocinadores</em>',
    'sponsors.page.subtitle':'Gracias a su apoyo, el balonmano en Tolosa sigue creciendo cada día.',
    'sponsors.eyebrow':  'Con su apoyo',
    'sponsors.cta.label': 'Únete a nuestra familia',
    'sponsors.cta.title':'¿Quieres ser patrocinador?',
    'sponsors.cta.sub':  'Contáctanos y te explicamos cómo colaborar con el club.',
    'legal.cookies.title':'Política de<br>Cookies',
    'legal.terms.title': 'Términos<br>de Uso',
    'legal.privacy.title':'Política de<br>Privacidad',

    // Contacto page
    'contact.page.title': 'Ponte en Contacto',
    'contact.page.subtitle': '¿Tienes alguna duda o quieres unirte a nosotros? Estamos aquí para ayudarte.',
    'contact.eyebrow':   'Encuéntranos',
    'contact.title':     'Hablemos',
    'contact.loc.label': 'Ubicación',
    'contact.email.label':'Email',
    'contact.social.label':'Redes sociales',
    'contact.form.title':'Envíanos un mensaje',
    'contact.form.name': 'Nombre',
    'contact.form.email':'Email',
    'contact.form.subject':'Asunto',
    'contact.form.message':'Mensaje',
    'contact.form.send': 'Enviar mensaje',
    'lang.es': 'Castellano',
    'lang.eu': 'Euskera',
    'footer.aboutSimple': 'Tolosa CF Eskubaloia. Más que un club, una familia unida por el balonmano.',
    'footer.aboutShort': 'Tolosa CF Eskubaloia. Más que un club.',
    'sponsors.mainTitle': 'Colaboradores principales',
    'club.yearsInDivision': 'Años en 1ª Nacional',
    'fixture.noMatches': 'Sin partidos programados',
    'fixture.noResults': 'Sin resultados registrados',
    'fixture.journey': 'Jornada',
    'news.empty': 'Aún no hay noticias publicadas',
    'team.tab.calendar.empty': 'Sin partidos en el calendario',
    'team.tab.results.empty': 'Sin resultados disponibles',
    'team.tab.standings.empty': 'Sin clasificación disponible',
    'contact.form.success': '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.',
    'contact.form.error': 'Por favor, rellena todos los campos correctamente.',
    'contact.form.sending': 'Enviando...',
    'team.noDataTitle': 'Sin datos disponibles todavía',
    'team.noDataText': 'El administrador aún no ha subido datos para esta categoría.',

    // Sub-navegación 1. Equipo
    'team.subnav.season': 'Temporada',
    'team.subnav.squad':  'Plantilla',

    // Plantilla page
    'squad.page.eyebrow':  'Primer Equipo',
    'squad.page.title':    'Plantilla',
    'squad.page.subtitle': 'Conoce a los jugadores que componen el primer equipo esta temporada.',
    'squad.loading':       'Cargando plantilla...',
    'squad.empty':         'No hay jugadores registrados en la plantilla.',
    'squad.pos.label':     'Posición',
    'squad.dorsal.label':  'Dorsal',

    // Cuerpo Técnico
    'staff.section.title': 'Cuerpo Técnico',
    'staff.empty':         'No hay miembros del cuerpo técnico registrados.',
  },

  eu: {
    // Navbar
    'nav.home':          'Hasiera',
    'nav.news':          'Berriak',
    'nav.club':          'Kluba',
    'nav.team':          '1. Taldea',
    'nav.sponsors':      'Babeslariak',
    'nav.contact':       'Kontaktua',
    'nav.lightMode':     'Argi modua',
    'nav.darkMode':      'Ilun modua',

    // Hero (index)
    'hero.word1':        'Grina,',
    'hero.word2':        'indarra',
    'hero.word3':        'eta',
    'hero.word4':        'harrotasuna',
    'hero.sub':          'Jarraitu Tolosa CF Eskubaloia-ren albiste guztiak. Emaitzak, berriak eta euskal eskubaloiaren zirrara osoa.',
    'hero.cta.news':     'Azken berriak',
    'hero.cta.club':     'Ezagutu kluba',

    // Fixture banner
    'fixture.label':     'Hurrengo partida',
    'fixture.vs':        'Tolosa CF vs',
    'fixture.cta':       'Ikusi taldea →',

    // Secciones index
    'section.news.eyebrow':  'Albisteak',
    'section.news.title':    'Azken\nBerriak',
    'section.news.cta':      'Denak ikusi',

    // Stats
    'stats.years':       'Urteko historia',
    'stats.teams':       'Talde aktiboak',
    'stats.players':     'Jokalariak',
    'stats.division':    'Nazio maila',

    // Instagram
    'insta.eyebrow':     'Sare sozialak',
    'insta.title':       'Jarraitu\nInstagramen',
    'insta.desc':        'Argazkiak, bideoak eta klubaren albisteak denbora errealean.',
    'insta.btn':         'Instagramen jarraitu',

    // Partners
    'partners.eyebrow':  'Gure babeslariak',

    // Footer
    'footer.about':      'Kluba baino gehiago, eskubaloiak batutako familia, 100 urte baino gehiagoz.',
    'footer.sections':   'Atalak',
    'footer.club':       'Kluba',
    'footer.contact':    'Kontaktua',
    'footer.history':    'Historia',
    'footer.firstTeam':  'Lehen taldea',
    'footer.collaborate':'Lagundu',
    'footer.legal':      'Lege oharra',
    'footer.privacy':    'Pribatutasuna',
    'footer.cookies':    'Cookieak',
    'footer.terms':      'Baldintzak',
    'footer.copy':       '© 2025 Tolosa CF Eskubaloia.',

    // Botones generales
    'btn.seeTeam':       'Ikusi taldea →',
    'btn.seeAll':        'Denak ikusi',
    'btn.followIg':      'Instagramen jarraitu',
    'btn.contact':       'Kontaktatu orain',
    'btn.seeStats':      'Ikusi estatistikak',

    // Club page
    'club.eyebrow':      'Gure filosofia',
    'club.title':        'Etorkizuna prestatzen',
    'club.p1':           'Gure klubaren arrakastaren giltza jokalari eta jokalarien prestakuntza da. Ez soilik kirol aldetik, baita gure balioen arabera ere heztea.',
    'club.p2':           'Talde lana, lagunartea eta errespetua sustatzen ditugu Usabal kiroldegiaren entrenamendu eta partida guztietan.',
    'club.p3':           'Hamar talde baino gehiago ditugu kategoria guztietan, eskubaloia eskolatik 1. Nazio Mailako taldera arte sustatzen.',
    'club.cta.label':    'Lehen Nazio Maila',
    'club.cta.title':    'Jarraitu Lehen Taldea',
    'club.cta.sub':      'Kontsultatu sailkapen, emaitza eta egutegi ofiziala.',
    'club.values.eyebrow': 'Gu definitzen gaituena',
    'club.values.title': 'Gure Balioak',
    'club.val1.title':   'Grina',
    'club.val1.text':    'Partida bakoitza bizipen handiz bizi dugu eta ariman ematen dugu.',
    'club.val2.title':   'Komunitatea',
    'club.val2.text':    'Zelaian zein kanpoan kideak babesten dituen familia batua gara.',
    'club.val3.title':   'Errespetua',
    'club.val3.text':    'Kirol balioak lehenik: joko garbia aurkari, arbitro eta zaleen aurrean.',
    'club.loading':      'Datuak kargatzen...',
    'team.loading':      'Datuak kargatzen...',
    'club.page.title':   'Gure Kluba',
    'club.page.subtitle':'Tolosa bihotzean mende bat baino gehiagoz kirola eta balioak biltzen dituen taldea.',
    'team.page.eyebrow': 'Lehiaketa',
    'team.page.title':   'Lehen Taldea',
    'competition.name':  '1. Nazionala, C Taldea',
    'team.tab.standings': 'Sailkapena',
    'team.tab.results':   'Emaitzak',
    'contact.form.heading': 'Bidali mezua',
    'contact.form.namePlaceholder': 'Zure izena',
    'contact.form.emailPlaceholder': 'zure@email.com',
    'contact.form.subjectPlaceholder': 'Zer buruz da?',
    'contact.form.messagePlaceholder': 'Idatzi zure mezua hemen...',
    'news.page.title':   'Eguneko<br><em>Albisteak</em>',
    'news.page.subtitle':'Jarrai ezazu taldeen nobedadeak, emaitzak eta ekitaldiak egunerokoan.',
    'news.loading':      'Albisteak kargatzen...',
    'news.loadMore':     'Albiste gehiago kargatu',
    'article.backToNews': 'Itzuli berrietara',
    'article.backToAll':  'Itzuli albiste guztietara',
    'sponsors.page.title':'Gure<br><em>Babeslariak</em>',
    'sponsors.page.subtitle':'Laguntza eskertuz, Tolosa eskubaloia egunero hazten ari da.',
    'sponsors.eyebrow':  'Zure laguntzarekin',
    'sponsors.cta.label': 'Eman izena gure familiarekin',
    'sponsors.cta.title':'Babeslea izan nahi duzu?',
    'sponsors.cta.sub':  'Jarri gurekin harremanetan eta azalduko dizugu klubarekin nola lan egin.',
    'legal.cookies.title':'Cookie politika',
    'legal.terms.title': 'Erabilera-baldintzak',
    'legal.privacy.title':'Pribatutasun politika',

    // Contacto page
    'contact.page.title': 'Jar zaitez gurekin harremanetan',
    'contact.page.subtitle': 'Galderarik baduzu edo bat egin nahi baduzu, hemen gaude zuretzat.',
    'contact.eyebrow':   'Aurkitu gu',
    'contact.title':     'Hitz egin dezagun',
    'contact.loc.label': 'Kokapena',
    'contact.email.label':'Email',
    'contact.social.label':'Sare sozialak',
    'contact.form.title':'Bidali mezu bat',
    'contact.form.name': 'Izena',
    'contact.form.email':'Email',
    'contact.form.subject':'Gaia',
    'contact.form.message':'Mezua',
    'contact.form.send': 'Mezua bidali',
    'lang.es': 'Gaztelania',
    'lang.eu': 'Euskara',
    'footer.aboutSimple': 'Tolosa CF Eskubaloia. Kluba baino gehiago, eskubaloiak batutako familia.',
    'footer.aboutShort': 'Tolosa CF Eskubaloia. Kluba baino gehiago.',
    'sponsors.mainTitle': 'Babesle nagusiak',
    'club.yearsInDivision': 'Urteak 1. Nazio Mailan',
    'team.tab.standings': 'Sailkapena',
    'team.tab.results': 'Emaitzak',
    'team.tab.calendar':  'Egutegia',
    'fixture.lastResult': 'Azken emaitza',
    'fixture.noMatches': 'Ez dago partidarik programatuta',
    'fixture.noResults': 'Ez dago emaitzarik erregistratuta',
    'fixture.journey': 'Jardunaldia',
    'news.empty': 'Oraindik ez dago albisterik argitaratuta',
    'team.tab.calendar.empty': 'Ez dago partidarik egutegian',
    'team.tab.results.empty': 'Ez dago emaitzarik eskuragarri',
    'team.tab.standings.empty': 'Ez dago sailkapenik eskuragarri',
    'contact.form.success': 'Mezua ongi bidali da! Laster jarriko gara zurekin harremanetan.',
    'contact.form.error': 'Mesedez, bete eremu guztiak behar bezala.',
    'contact.form.sending': 'Bidaltzen...',
    'team.noDataTitle': 'Ez dago daturik eskuragarri oraindik',
    'team.noDataText': 'Administratzaileak ez du oraindik kategoria honetarako daturik igo.',

    // Sub-navegación 1. Equipo
    'team.subnav.season': 'Denboraldia',
    'team.subnav.squad':  'Plantila',

    // Plantilla page
    'squad.page.eyebrow':  'Lehen Taldea',
    'squad.page.title':    'Plantila',
    'squad.page.subtitle': 'Ezagutu denboraldi honetan lehen taldea osatzen duten jokalariak.',
    'squad.loading':       'Plantila kargatzen...',
    'squad.empty':         'Ez dago jokalaririk plantilan erregistratuta.',
    'squad.pos.label':     'Posizioa',
    'squad.dorsal.label':  'Dorsala',

    // Cuerpo Técnico
    'staff.section.title': 'Teknikari Taldea',
    'staff.empty':         'Ez dago teknikari talderik erregistratuta.',
  }
};

// ── Obtener idioma actual ──
function getLang() {
  return localStorage.getItem('lang') || 'es';
}

// ── Cambiar idioma y aplicar ──
function setLanguage(lang) {
  if (!window.TRANSLATIONS[lang]) return;
  localStorage.setItem('lang', lang);
  applyTranslations();
  updateLangSelector(lang);
}

// ── Aplicar traducciones al DOM ──
function applyTranslations() {
  const lang = getLang();
  const t = window.TRANSLATIONS[lang];
  if (!t) return;

  // Textos normales: data-i18n="key"
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      let text = t[key];
      const season = el.getAttribute('data-season');
      if (season) {
        text = `${text} | ${season}`;
      }
      // Soporte para saltos de línea con \n (para títulos con <br>)
      if (el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3') {
        el.innerHTML = text.replace(/\n/g, '<br>');
      } else {
        el.textContent = text;
      }
    }
  });

  // Placeholders: data-i18n-placeholder="key"
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // Mostrar u ocultar elementos específicos según el idioma activo
  document.querySelectorAll('[data-lang-show]').forEach(el => {
    if (el.getAttribute('data-lang-show') === lang) {
      el.style.display = '';
    } else {
      el.style.display = 'none';
    }
  });

  // Actualizar atributo lang del html para accesibilidad
  document.documentElement.setAttribute('lang', lang === 'eu' ? 'eu' : 'es');
}

// ── Actualizar aspecto visual del selector ──
function updateLangSelector(lang) {
  // Selector desktop
  const current = document.getElementById('lang-current');
  if (current) {
    const flagSrc = lang === 'eu' ? 'images/flag-eu.svg' : 'images/flag-es.svg';
    current.innerHTML = `<img src="${flagSrc}" alt="${lang.toUpperCase()}" class="flag-icon"> <span>${lang.toUpperCase()}</span>`;
  }
  // Marcar activo en el dropdown desktop y botones móviles
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

// Exponer globalmente
window.setLanguage       = setLanguage;
window.applyTranslations = applyTranslations;
window.getLang           = getLang;
