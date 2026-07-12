import re

def update_legal_page(file, title, content_html):
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Replace content between <div class="container" (or similar main content block) and <footer>
    match = re.search(r'(<div class="legal-container".*?>|<div class="container"[^>]*>.*?(?=<footer>))', html, re.DOTALL | re.IGNORECASE)
    if not match:
        match = re.search(r'(<main.*?>.*?</main>)', html, re.DOTALL | re.IGNORECASE)
        
    if match:
        # Reconstruct
        start = html[:match.start()]
        end = html[match.end():]
        # Just insert the new container
        new_html = start + f'\n<div class="container" style="max-width:800px; padding: 4rem 1rem;" id="main-content">\n<h1 style="font-family:var(--font-display);font-size:2.5rem;text-transform:uppercase;margin-bottom:2rem;color:white;">{title}</h1>\n<div style="color:rgba(255,255,255,0.7);line-height:1.6;">\n{content_html}\n</div>\n</div>\n' + end
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_html)

privacidad = """
<p><strong>[TU_NOMBRE_O_EMPRESA]</strong> (en adelante, el "Club"), con CIF <strong>[TU_CIF]</strong> y domicilio en <strong>[TU_DIRECCIÓN]</strong>, es el Responsable del Tratamiento de los datos personales del Usuario y le informa de que estos datos serán tratados de conformidad con lo dispuesto en el Reglamento (UE) 2016/679 de 27 de abril de 2016 (RGPD) y la Ley Orgánica 3/2018, de 5 de diciembre (LOPDGDD).</p>
<h2 style="color:white;margin-top:2rem;">1. Finalidad del tratamiento</h2>
<p>Mantener una relación con el Usuario y enviarle comunicaciones sobre nuestros servicios, eventos deportivos y gestión del club. Los datos no se cederán a terceros salvo obligación legal.</p>
<h2 style="color:white;margin-top:2rem;">2. Base jurídica</h2>
<p>El consentimiento inequívoco prestado por el usuario o el interés legítimo del Club para gestionar la relación deportiva.</p>
<h2 style="color:white;margin-top:2rem;">3. Transferencias internacionales (GitHub Pages y Firebase)</h2>
<p>Esta web se aloja temporalmente en <strong>GitHub Pages</strong> y utiliza los servicios de <strong>Google Firebase</strong> (Autenticación y base de datos) localizados en servidores fuera del EEE. Ambas plataformas operan bajo las cláusulas contractuales tipo (CCT) de la Comisión Europea, garantizando un nivel de protección adecuado.</p>
<h2 style="color:white;margin-top:2rem;">4. Derechos del usuario</h2>
<p>El Usuario puede ejercer en cualquier momento los derechos de acceso, rectificación, portabilidad y supresión de sus datos y a la limitación u oposición a su tratamiento dirigiendo un correo electrónico a <strong>[TU_EMAIL]</strong>. Tiene derecho a retirar el consentimiento y a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).</p>
"""

cookies = """
<p>En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI), <strong>[TU_NOMBRE_O_EMPRESA]</strong> informa de que este sitio web <strong>solo utiliza cookies y tecnologías estrictamente necesarias</strong> para su funcionamiento técnico.</p>
<h2 style="color:white;margin-top:2rem;">1. ¿Qué tecnologías utilizamos?</h2>
<ul>
  <li><strong>Firebase Authentication (IndexedDB/SessionStorage)</strong>: Necesario para mantener la sesión abierta de los administradores y gestionar los accesos seguros al panel de administración.</li>
  <li><strong>Google Fonts y Feather Icons</strong>: Cargan recursos visuales desde servidores externos, pero <strong>no</strong> instalan cookies de rastreo en su dispositivo.</li>
</ul>
<h2 style="color:white;margin-top:2rem;">2. Cookies Analíticas y Publicitarias</h2>
<p>Actualmente, este sitio web <strong>no</strong> utiliza Google Analytics, píxeles de Meta ni ninguna otra cookie de terceros destinada a fines analíticos, publicitarios o de rastreo del comportamiento del usuario. Por tanto, no se requiere la obtención del consentimiento previo.</p>
"""

aviso_legal = """
<p>En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que este sitio web es titularidad de <strong>[TU_NOMBRE_O_EMPRESA]</strong>, con CIF <strong>[TU_CIF]</strong> y domicilio en <strong>[TU_DIRECCIÓN]</strong>. Contacto: <strong>[TU_EMAIL]</strong>.</p>
<h2 style="color:white;margin-top:2rem;">1. Objeto</h2>
<p>El prestador, responsable del sitio web, pone a disposición de los usuarios el presente documento para el cumplimiento de las obligaciones legales e informar de las condiciones de uso.</p>
<h2 style="color:white;margin-top:2rem;">2. Propiedad Intelectual</h2>
<p>El sitio web, incluyendo su código fuente, diseño, logotipos, texto e imágenes (salvo aquellas extraídas de fuentes abiertas o de terceros que conserven sus derechos) son propiedad del Club o este dispone de autorización para su uso. Queda prohibida la reproducción total o parcial sin consentimiento.</p>
<h2 style="color:white;margin-top:2rem;">3. Limitación de Responsabilidad</h2>
<p>El Club no se hace responsable de la información y contenidos almacenados en enlaces de terceros. En todo caso, procederá a la retirada inmediata de cualquier contenido que contravenga la legislación en cuanto tenga conocimiento de ello.</p>
"""

update_legal_page('privacidad.html', 'Política de Privacidad', privacidad)
update_legal_page('cookies.html', 'Política de Cookies', cookies)
update_legal_page('terminos.html', 'Aviso Legal', aviso_legal)
