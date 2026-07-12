import re

def update_legal_page(file, title, content_html):
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()
    
    match = re.search(r'(<div class="legal-container".*?>|<div class="container"[^>]*>.*?(?=<footer>))', html, re.DOTALL | re.IGNORECASE)
    if not match:
        match = re.search(r'(<div class="container"[^>]*id="main-content">.*?(?=<footer>))', html, re.DOTALL | re.IGNORECASE)
        
    if match:
        start = html[:match.start()]
        end = html[match.end():]
        new_html = start + f'\n<div class="container" style="max-width:800px; padding: 4rem 1rem;" id="main-content">\n<h1 style="font-family:var(--font-display);font-size:2.5rem;text-transform:uppercase;margin-bottom:2rem;color:white;">{title}</h1>\n<div style="color:rgba(255,255,255,0.7);line-height:1.6;">\n{content_html}\n</div>\n</div>\n' + end
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_html)

privacidad = """
<p><strong>[TU_NOMBRE_O_EMPRESA]</strong> (en adelante, el "Club"), con CIF <strong>[TU_CIF]</strong> y domicilio en <strong>[TU_DIRECCIÓN]</strong>, es el Responsable del Tratamiento de los datos personales del Usuario y le informa de que estos datos serán tratados de conformidad con lo dispuesto en el Reglamento (UE) 2016/679 de 27 de abril de 2016 (RGPD) y la Ley Orgánica 3/2018, de 5 de diciembre (LOPDGDD).</p>

<div style="background:rgba(255,200,0,0.1); border-left:4px solid #ffc107; padding:1rem; margin-bottom:1rem; color:#ffc107; font-size:0.9rem;">
<strong>Nota de Auditoría:</strong> La página web actual <strong>no recoge datos de visitantes</strong>. El formulario de contacto actual es un modelo estático que no almacena ni envía correos. Si en el futuro conectas el formulario a un servidor o a Firebase, deberás actualizar esta política indicando el plazo de conservación, destinatario (proveedor de email) y añadir una casilla de aceptación obligatoria en el formulario.
</div>

<h2 style="color:white;margin-top:2rem;">1. Finalidad del tratamiento</h2>
<p>Mantener una relación con el Usuario y enviarle comunicaciones sobre nuestros servicios, eventos deportivos y gestión del club. Los datos no se cederán a terceros salvo obligación legal.</p>

<h2 style="color:white;margin-top:2rem;">2. Base jurídica</h2>
<p>El consentimiento inequívoco prestado por el usuario o el interés legítimo del Club para gestionar la relación deportiva.</p>

<h2 style="color:white;margin-top:2rem;">3. Transferencias internacionales (GitHub Pages y Firebase)</h2>
<p>Esta web se aloja temporalmente en <strong>GitHub Pages</strong> y utiliza los servicios de <strong>Google Firebase</strong> (exclusivamente para el acceso privado al panel de administración). Estas plataformas operan bajo las cláusulas contractuales tipo (CCT) de la Comisión Europea.</p>

<h2 style="color:white;margin-top:2rem;">4. Derechos del usuario</h2>
<p>El Usuario puede ejercer en cualquier momento los derechos de acceso, rectificación, portabilidad y supresión de sus datos, limitación u oposición, dirigiendo un correo a <strong>[TU_EMAIL]</strong>.</p>
"""

cookies = """
<p>En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI), <strong>[TU_NOMBRE_O_EMPRESA]</strong> informa de que este sitio web <strong>solo utiliza tecnologías de almacenamiento estrictamente necesarias</strong> para su funcionamiento técnico. No utilizamos cookies de rastreo ni análisis.</p>

<h2 style="color:white;margin-top:2rem;">1. Tecnologías de almacenamiento utilizadas</h2>
<ul>
  <li><strong>IndexedDB de Firebase Auth</strong>: Se utiliza un almacenamiento interno del navegador (no es una "cookie") y <strong>solo se activa</strong> si accedes a la página del panel de administración (`/admin.html`). Su única finalidad es mantener de forma segura la sesión iniciada del administrador del club. No se utiliza para rastrear a los visitantes públicos.</li>
  <li><strong>Google Fonts y Feather Icons</strong>: Cargan recursos visuales desde servidores externos, pero <strong>no</strong> instalan cookies ni almacenamiento local en su dispositivo.</li>
</ul>

<h2 style="color:white;margin-top:2rem;">2. Exención de Consentimiento</h2>
<p>Dado que el único almacenamiento empleado (IndexedDB para sesión de administradores) es <strong>estrictamente necesario</strong> para el funcionamiento del servicio expresamente solicitado por el usuario administrador (mantener su sesión abierta), y los visitantes públicos no reciben ninguna tecnología de almacenamiento, <strong>no se requiere la obtención del consentimiento previo</strong> (exención de la LSSI).</p>
"""

update_legal_page('privacidad.html', 'Política de Privacidad', privacidad)
update_legal_page('cookies.html', 'Política de Cookies', cookies)
