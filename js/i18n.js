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

    // Accesibilidad (etiquetas para lectores de pantalla)
    'a11y.skip':         'Saltar al contenido principal',
    'a11y.mainNav':      'Navegación principal',
    'a11y.legalNav':     'Información legal',
    'a11y.openMenu':     'Abrir menú',
    'a11y.closeMenu':    'Cerrar menú',
    'a11y.changeTheme':  'Cambiar tema',
    'a11y.changeLang':   'Cambiar idioma',
    'hero.scroll':       'Desliza',

    // Títulos de pestaña
    'title.home': 'Tolosa CF Eskubaloia',
    'title.news': 'Noticias | Tolosa CF Eskubaloia',
    'title.club': 'El Club | Tolosa CF Eskubaloia',
    'title.team': 'Temporada | Tolosa CF Eskubaloia',
    'title.squad': 'Plantilla | Tolosa CF Eskubaloia',
    'title.sponsors': 'Patrocinadores | Tolosa CF Eskubaloia',
    'title.contact': 'Contacto | Tolosa CF Eskubaloia',
    'title.privacy': 'Política de privacidad | Tolosa CF Eskubaloia',
    'title.cookies': 'Política de cookies | Tolosa CF Eskubaloia',
    'title.terms': 'Términos de uso | Tolosa CF Eskubaloia',
    'title.e404': 'Página no encontrada | Tolosa CF Eskubaloia',
    'e404.eyebrow':      'Error 404',
    'e404.title':        'Página no encontrada',
    'e404.text':         'La página que buscas no existe o se ha movido.',
    'e404.cta':          'Volver al inicio',

    // Hero (index)
    'hero.word1':        'Ongi',
    'hero.word2':        'etorri',
    'hero.word3':        'familia',
    'hero.word4':        'urdinera!',
    'hero.sub':          'Sigue toda la actualidad del Tolosa CF Eskubaloia. Resultados, noticias y toda la información del balonmano Tolosarra.',
    'hero.cta.news':     'Últimas noticias',
    'hero.cta.club':     'Conoce el club',

    // Fixture banner
    'fixture.label':     'Próximo partido',
    'fixture.vs':        'Tolosa CF vs',
    'fixture.cta':       'Ver equipo',

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
    'footer.copy':       '© {year} Tolosa CF Eskubaloia.',

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
    'baseteams.eyebrow': 'Cantera',
    'baseteams.title':   'Sigue a Nuestras Categorías',
    'baseteams.subtitle':'Consulta la clasificación y los resultados de cada equipo de base en la web de la federación.',
    'baseteams.cta':     'Ver clasificación',
    'baseteams.comingSoon': 'Enlace próximamente',
    'baseteams.empty':   'Aún no hay equipos de base publicados.',
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
    'fixture.today': 'Hoy',
    'st.pos': 'Pos', 'st.team': 'Equipo', 'st.pj': 'PJ', 'st.pg': 'PG', 'st.pe': 'PE', 'st.pp': 'PP', 'st.gf': 'GF', 'st.gc': 'GC', 'st.dg': 'DG', 'st.pts': 'PTS',
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
    'cookies.bannerText': 'Usamos almacenamiento técnico necesario para recordar tu idioma y tema. Si aceptas, también cargamos el widget de Instagram, que instala sus propias cookies de terceros.',
    'cookies.title': 'Aviso de cookies',
    'cookies.instaTitle': 'Últimas publicaciones de Instagram del club',
    'cookies.accept': 'Aceptar',
    'cookies.reject': 'Rechazar',
    'cookies.moreInfo': 'Más información',
    'cookies.instaPlaceholder': 'Para ver aquí nuestras publicaciones de Instagram hace falta aceptar sus cookies de terceros.',
    'cookies.acceptAndView': 'Aceptar y ver Instagram',
    'cookies.settingsBtn': 'Cambiar mi decisión sobre las cookies',
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
    'contact.form.failure': 'No se ha podido enviar el mensaje. Escríbenos directamente a eskubaloia.tolosacf@gmail.com.',
    'contact.form.info': 'Responsable: Tolosa CF. Finalidad: atender tu consulta. Base jurídica: tu consentimiento. Destinatarios: no se ceden datos a terceros, salvo obligación legal; el envío se realiza a través de nuestros proveedores Firebase (Google) y EmailJS. Derechos: acceso, rectificación, supresión, oposición, limitación y portabilidad, escribiendo a eskubaloia.tolosacf@gmail.com.',
    'contact.consent.before': 'He leído y acepto la',
    'contact.consent.link': 'Política de Privacidad',
    'contact.consent.after': '.',
    'contact.form.consentError': 'Para enviar el mensaje debes aceptar la Política de Privacidad.',
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

    // Posiciones de jugador (valores fijos del selector del panel de admin)
    'squad.pos.Portero':           'Portero',
    'squad.pos.Lateral izquierdo': 'Lateral izquierdo',
    'squad.pos.Central':           'Central',
    'squad.pos.Lateral derecho':   'Lateral derecho',
    'squad.pos.Extremo izquierdo': 'Extremo izquierdo',
    'squad.pos.Extremo derecho':   'Extremo derecho',
    'squad.pos.Pivote':            'Pivote',

    // Cuerpo Técnico
    'staff.section.title': 'Cuerpo Técnico',
    'staff.empty':         'No hay miembros del cuerpo técnico registrados.',

    // Cargos del cuerpo técnico (valores fijos del selector del panel de admin)
    'staff.role.Entrenador':             'Entrenador',
    'staff.role.Ayudante de Entrenador': 'Ayudante de Entrenador',
    'staff.role.Delegado':               'Delegado',
  },

  eu: {
    // Navbar
    'nav.home':          'Hasiera',
    'nav.news':          'Berriak',
    'nav.club':          'Kluba',
    'nav.team':          '1. Taldea',
    'nav.sponsors':      'Babesleak',
    'nav.contact':       'Kontaktua',
    'nav.lightMode':     'Modu argia',
    'nav.darkMode':      'Modu iluna',

    // Accesibilidad (etiquetas para lectores de pantalla)
    'a11y.skip':         'Joan eduki nagusira',
    'a11y.mainNav':      'Nabigazio nagusia',
    'a11y.legalNav':     'Informazio legala',
    'a11y.openMenu':     'Ireki menua',
    'a11y.closeMenu':    'Itxi menua',
    'a11y.changeTheme':  'Aldatu gaia',
    'a11y.changeLang':   'Aldatu hizkuntza',
    'hero.scroll':       'Korritu',

    // Títulos de pestaña
    'title.home': 'Tolosa CF Eskubaloia',
    'title.news': 'Berriak | Tolosa CF Eskubaloia',
    'title.club': 'Kluba | Tolosa CF Eskubaloia',
    'title.team': 'Denboraldia | Tolosa CF Eskubaloia',
    'title.squad': 'Jokalariak | Tolosa CF Eskubaloia',
    'title.sponsors': 'Babesleak | Tolosa CF Eskubaloia',
    'title.contact': 'Kontaktua | Tolosa CF Eskubaloia',
    'title.privacy': 'Pribatutasun politika | Tolosa CF Eskubaloia',
    'title.cookies': 'Cookien politika | Tolosa CF Eskubaloia',
    'title.terms': 'Erabilera-baldintzak | Tolosa CF Eskubaloia',
    'title.e404': 'Ez da orria aurkitu | Tolosa CF Eskubaloia',
    'e404.eyebrow':      '404 errorea',
    'e404.title':        'Ez da orria aurkitu',
    'e404.text':         'Bilatzen duzun orria ez dago edo lekuz aldatu da.',
    'e404.cta':          'Itzuli hasierara',

    // Hero (index)
    'hero.word1':        'Ongi',
    'hero.word2':        'etorri',
    'hero.word3':        'familia',
    'hero.word4':        'urdinera!',
    'hero.sub':          'Hemen Tolosa CF Eskubaloiko informazio guztia topatuko duzu. Ezagutu gure taldeak, taldekideak, emaitzak eta azken berriak.',
    'hero.cta.news':     'Azken berriak',
    'hero.cta.club':     'Ezagutu kluba',

    // Fixture banner
    'fixture.label':     'Hurrengo partida',
    'fixture.vs':        'Tolosa CF vs',
    'fixture.cta':       'Ikusi sailkapena',

    // Secciones index
    'section.news.eyebrow':  'Albisteak',
    'section.news.title':    'Azken\nBerriak',
    'section.news.cta':      'Denak',

    // Stats
    'stats.years':       'Urteko historia',
    'stats.teams':       'Talde aktiboak',
    'stats.players':     'Jokalariak',
    'stats.division':    'Nazio maila',

    // Instagram
    'insta.eyebrow':     'Sare sozialak',
    'insta.title':       'Jarraitu\nInstagramen',
    'insta.desc':        'Argazkiak, bideoak eta klubaren albisteak denbora errealean.',
    'insta.btn':         'Jarraitu Instagramen',

    // Partners
    'partners.eyebrow':  'Gure babesleak',

    // Footer
    'footer.about':      'Kluba baino gehiago, eskubaloiak batutako familia, 100 urte baino gehiagoz.',
    'footer.sections':   'Atalak',
    'footer.club':       'Kluba',
    'footer.contact':    'Kontaktua',
    'footer.history':    'Historia',
    'footer.firstTeam':  'Lehen taldea',
    'footer.collaborate':'Babesleak',
    'footer.legal':      'Lege oharra',
    'footer.privacy':    'Pribatutasuna',
    'footer.cookies':    'Cookieak',
    'footer.terms':      'Baldintzak',
    'footer.copy':       '© {year} Tolosa CF Eskubaloia.',

    // Botones generales
    'btn.seeTeam':       'Ikusi taldea →',
    'btn.seeAll':        'Ikusi denak',
    'btn.followIg':      'Jarraitu Instagramen',
    'btn.contact':       'Kontaktatu orain',
    'btn.seeStats':      'Ikusi estatistikak',

    // Club page
    'club.eyebrow':      'Gure filosofia',
    'club.title':        'Etorkizuna prestatzen',
    'club.p1':           'Gure klubaren arrakastaren gakoa gure jokalarien prestakuntza da. Ez gara kirol arloan soilik oinarritzen; gure balioetan oinarrituta ere heztu nahi ditugu.',
    'club.p2':           'Talde lana, lagunartea eta elkarren arteko errespetua sustatzen ditugu Usabal kiroldegiko entrenamendu eta partida guztietan.',
    'club.p3':           'Hamar talde baino gehiago ditugu kategoria guztietan, eskubaloia eskolatik 1. Nazio Mailako taldera arte sustatzen.',
    'club.cta.label':    'Lehen Nazio Maila',
    'club.cta.title':    'Jarraitu Lehen Taldea',
    'club.cta.sub':      'Kontsultatu sailkapena, emaitzak eta egutegi ofiziala.',
    'club.values.eyebrow': 'Gu definitzen gaituena',
    'club.values.title': 'Gure Balioak',
    'club.val1.title':   'Grina',
    'club.val1.text':    'Partida bakoitza bizipen handiz bizi dugu eta gure arima ematen dugu pistan.',
    'club.val2.title':   'Komunitatea',
    'club.val2.text':    'Zelaian zein kanpoan kideak babesten dituen familia batua gara.',
    'club.val3.title':   'Errespetua',
    'club.val3.text':    'Kirol balioak lehenik: joko garbia aurkari, epaile eta zaleen aurrean.',
    'baseteams.eyebrow': 'Harrobia',
    'baseteams.title':   'Jarraitu Gure Kategoriak',
    'baseteams.subtitle':'Kontsultatu oinarrizko talde bakoitzaren sailkapena eta emaitzak federazioaren webgunean.',
    'baseteams.cta':     'Ikusi sailkapena',
    'baseteams.comingSoon': 'Laster eskuragarri',
    'baseteams.empty':   'Oraindik ez dago oinarrizko talderik argitaratuta.',
    'club.loading':      'Datuak kargatzen...',
    'team.loading':      'Datuak kargatzen...',
    'club.page.title':   'Gure Kluba',
    'club.page.subtitle':'Ehun urte baino gehiagoko historia, kirola eta balioak Tolosaren bihotzean.',
    'team.page.eyebrow': 'Lehiaketa',
    'team.page.title':   'Lehen Taldea',
    'competition.name':  '1. Nazionala, C Taldea',
    'team.tab.standings': 'Sailkapena',
    'team.tab.results':   'Emaitzak',
    'team.tab.calendar':  'Egutegia',
    'fixture.lastResult': 'Azken emaitza',
    'fixture.today': 'Gaur',
    'st.pos': 'Post.', 'st.team': 'Taldea', 'st.pj': 'J', 'st.pg': 'I', 'st.pe': 'B', 'st.pp': 'G', 'st.gf': 'GA', 'st.gc': 'GK', 'st.dg': 'GD', 'st.pts': 'PT',
    'contact.form.heading': 'Bidali mezu bat',
    'contact.form.namePlaceholder': 'Zure izena',
    'contact.form.emailPlaceholder': 'zure@email.com',
    'contact.form.subjectPlaceholder': 'Zeren buruz da?',
    'contact.form.messagePlaceholder': 'Idatzi zure mezua hemen...',
    'news.page.title':   'Eguneko<br><em>Albisteak</em>',
    'news.page.subtitle':'Egon eguneratuta klubaren berri guztiekin, emaitzekin eta ekitaldiekin.',
    'news.loading':      'Albisteak kargatzen...',
    'news.loadMore':     'Albiste gehiago kargatu',
    'article.backToNews': 'Itzuli berrietara',
    'article.backToAll':  'Itzuli albiste guztietara',
    'sponsors.page.title':'Gure<br><em>Babesleak</em>',
    'sponsors.page.subtitle':'Haien laguntzari esker, eskubaloia Tolosan egunetik egunera hazten ari da.',
    'sponsors.eyebrow':  'Zuen laguntzarekin',
    'sponsors.cta.label': 'Egin bat gure familiarekin',
    'sponsors.cta.title':'Babeslea izan nahi duzu?',
    'sponsors.cta.sub':  'Jarri gurekin harremanetan eta azalduko dizugu klubarekin nola lan egin.',
    'legal.cookies.title':'Cookien<br><em>Politika</em>',
    'cookies.bannerText': 'Zure hizkuntza eta gaia gogoratzeko beharrezko biltegiratze teknikoa erabiltzen dugu. Onartzen baduzu, Instagramen widgeta ere kargatuko dugu, eta horrek bere hirugarrenen cookieak ezarriko ditu.',
    'cookies.title': 'Cookie oharra',
    'cookies.instaTitle': 'Klubaren Instagrameko azken argitalpenak',
    'cookies.accept': 'Onartu',
    'cookies.reject': 'Ez onartu',
    'cookies.moreInfo': 'Informazio gehiago',
    'cookies.instaPlaceholder': 'Hemen gure Instagrameko argitalpenak ikusteko, haien hirugarrenen cookieak onartu behar dituzu.',
    'cookies.acceptAndView': 'Onartu eta ikusi Instagram',
    'cookies.settingsBtn': 'Cookieei buruzko nire erabakia aldatu',
    'legal.terms.title': 'Erabilera<br><em>Baldintzak</em>',
    'legal.privacy.title':'Pribatutasun<br><em>Politika</em>',

    // Contacto page
    'contact.page.title': 'Jar zaitez gurekin harremanetan',
    'contact.page.subtitle': 'Galderaren bat egin edo gurera batu nahi baduzu, bete hurrengo formularioa konpromisorik gabe.',
    'contact.eyebrow':   'Aurki gaitzazu',
    'contact.title':     'Hitz egin dezagun',
    'contact.loc.label': 'Kokapena',
    'contact.email.label':'Email',
    'contact.social.label':'Sare sozialak',
    'contact.form.title':'Bidali mezu bat',
    'contact.form.name': 'Izena',
    'contact.form.email':'Email',
    'contact.form.subject':'Gaia',
    'contact.form.message':'Mezua',
    'contact.form.send': 'Bidali mezua',
    'lang.es': 'Gaztelania',
    'lang.eu': 'Euskara',
    'footer.aboutSimple': 'Tolosa CF Eskubaloia. Kluba baino gehiago, eskubaloiak batutako familia.',
    'footer.aboutShort': 'Tolosa CF Eskubaloia. Kluba baino gehiago.',
    'sponsors.mainTitle': 'Babesle nagusiak',
    'club.yearsInDivision': 'Urteak 1. Nazio Mailan',
    'fixture.noMatches': 'Ez dago partidarik programatuta',
    'fixture.noResults': 'Ez dago emaitzarik erregistratuta',
    'fixture.journey': 'Jardunaldia',
    'news.empty': 'Oraindik ez dago albisterik argitaratuta',
    'team.tab.calendar.empty': 'Ez dago partidarik egutegian',
    'team.tab.results.empty': 'Ez dago emaitzarik eskuragarri',
    'team.tab.standings.empty': 'Ez dago sailkapenik eskuragarri',
    'contact.form.success': 'Mezua ongi bidali da! Laster jarriko gara zurekin harremanetan.',
    'contact.form.failure': 'Ezin izan da mezua bidali. Idatzi zuzenean eskubaloia.tolosacf@gmail.com helbidera.',
    'contact.form.info': 'Arduraduna: Tolosa CF. Helburua: zure kontsulta erantzutea. Oinarri juridikoa: zure baimena. Hartzaileak: datuak ez zaizkie hirugarrenei lagatzen, lege-betebeharra izan ezean; mezua gure hornitzaileen (Firebase –Google– eta EmailJS) bidez bidaltzen da. Eskubideak: datuetara sartzeko, zuzentzeko, ezabatzeko, aurka egiteko, tratamendua mugatzeko eta eramangarritasunerako eskubideak erabil ditzakezu eskubaloia.tolosacf@gmail.com helbidera idatziz.',
    'contact.consent.before': '',
    'contact.consent.link': 'Pribatutasun Politika',
    'contact.consent.after': ' irakurri dut eta onartzen dut.',
    'contact.form.consentError': 'Mezua bidaltzeko, Pribatutasun Politika onartu behar duzu.',
    'contact.form.error': 'Mesedez, bete eremu guztiak behar bezala.',
    'contact.form.sending': 'Bidaltzen...',
    'team.noDataTitle': 'Ez dago daturik eskuragarri oraindik',
    'team.noDataText': 'Administratzaileak ez du oraindik kategoria honetarako daturik igo.',

    // Sub-navegación 1. Equipo
    'team.subnav.season': 'Denboraldia',
    'team.subnav.squad':  'Jokalariak',

    // Plantilla page
    'squad.page.eyebrow':  'Lehen Taldea',
    'squad.page.title':    'Jokalariak',
    'squad.page.subtitle': 'Ezagutu denboraldi honetan lehen taldea osatzen duten jokalariak.',
    'squad.loading':       'Jokalariak kargatzen...',
    'squad.empty':         'Ez dago jokalaririk erregistratuta.',
    'squad.pos.label':     'Posizioa',
    'squad.dorsal.label':  'Dorsala',

    // Posiciones de jugador (mismas claves que en es, valor traducido)
    'squad.pos.Portero':           'Atezaina',
    'squad.pos.Lateral izquierdo': 'Ezker atzelaria',
    'squad.pos.Central':           'Erdilaria',
    'squad.pos.Lateral derecho':   'Eskuin atzelaria',
    'squad.pos.Extremo izquierdo': 'Ezker hegalekoa',
    'squad.pos.Extremo derecho':   'Eskuin hegalekoa',
    'squad.pos.Pivote':            'Pibota',

    // Cuerpo Técnico
    'staff.section.title': 'Teknikari Taldea',
    'staff.empty':         'Ez dago teknikari talderik erregistratuta.',

    // Cargos del cuerpo técnico (mismas claves que en es, valor traducido)
    'staff.role.Entrenador':             'Entrenatzailea',
    'staff.role.Ayudante de Entrenador': 'Entrenatzaile laguntzailea',
    'staff.role.Delegado':               'Ordezkaria',
  }
};

// ── Obtener idioma actual ──
function getLang() {
  return localStorage.getItem('lang') || 'eu';
}

// ── Cambiar idioma y aplicar ──
function setLanguage(lang) {
  if (!window.TRANSLATIONS[lang]) return;
  localStorage.setItem('lang', lang);
  applyTranslations();
  updateLangSelector(lang);
  // Avisa a contenido dinámico (noticias, etc.) para que se vuelva a pintar en el nuevo idioma
  window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
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
      let text = t[key].replace('{year}', new Date().getFullYear());
      const season = el.getAttribute('data-season');
      if (season) {
        text = `${text} | ${season}`;
      }
      // Soporte para saltos de línea con \n o <br> y cursivas con <em>
      if (el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3') {
        el.textContent = '';
        let parsedText = text.replace(/<br\s*\/?>/gi, '\n');
        parsedText.split('\n').forEach((line, index, array) => {
          const emMatch = line.match(/^(.*?)<em>(.*?)<\/em>(.*)$/i);
          if (emMatch) {
            if (emMatch[1]) el.appendChild(document.createTextNode(emMatch[1]));
            const em = document.createElement('em');
            em.textContent = emMatch[2];
            el.appendChild(em);
            if (emMatch[3]) el.appendChild(document.createTextNode(emMatch[3]));
          } else {
            el.appendChild(document.createTextNode(line));
          }
          if (index < array.length - 1) {
            el.appendChild(document.createElement('br'));
          }
        });
      } else {
        el.textContent = text;
      }
    }
  });

  // Etiquetas accesibles: data-i18n-aria="key"
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
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

  // Título de la pestaña (las páginas fijas declaran su clave en <html data-title-key>)
  const titleKey = document.documentElement.getAttribute('data-title-key');
  if (titleKey && t[titleKey]) document.title = t[titleKey];

  // Actualizar atributo lang del html para accesibilidad
  document.documentElement.setAttribute('lang', lang === 'eu' ? 'eu' : 'es');
}

// ── Actualizar aspecto visual del selector ──
function updateLangSelector(lang) {
  // Selector desktop
  const current = document.getElementById('lang-current');
  if (current) {
    const flagSrc = lang === 'eu' ? 'images/flag-eu.svg' : 'images/flag-es.svg';
    current.textContent = '';
    const img = document.createElement('img');
    img.src = flagSrc;
    img.alt = '';
    img.className = 'flag-icon';
    const span = document.createElement('span');
    span.textContent = lang.toUpperCase();
    current.appendChild(img);
    current.appendChild(document.createTextNode(' '));
    current.appendChild(span);
    const toggle = document.getElementById('lang-toggle');
    const tr = window.TRANSLATIONS[lang];
    if (toggle && tr) toggle.setAttribute('aria-label', lang.toUpperCase() + ' – ' + tr['a11y.changeLang']);
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
