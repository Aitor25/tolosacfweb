import re

try:
    with open('js/equipo1.js', 'r', encoding='utf-8') as f:
        js = f.read()

    # We will use DOM replacement for the empty states first.
    # Replace single line innerHTML string assignments that are just empty state wrappers:
    # `document.getElementById('tab-content').innerHTML='<div style="text-align:center;padding:4rem;color:var(--text-secondary);"><p style="font-family:Barlow Condensed,sans-serif;font-size:1.2rem;text-transform:uppercase;font-weight:900;" data-i18n="team.noDataTitle">Sin datos disponibles todavía</p><p style="font-size:.85rem;margin-top:.5rem;" data-i18n="team.noDataText">El administrador aún no ha subido datos para esta categoría.</p></div>';`
    js = re.sub(r"document\.getElementById\('tab-content'\)\.innerHTML='(.*?)';", "document.getElementById('tab-content').textContent = 'No hay datos disponibles';", js)
    js = re.sub(r"document\.getElementById\('tab-content'\)\.innerHTML=`<div.*?Error de conexion: \$\{err\.message\}.*?</div>`;", "document.getElementById('tab-content').textContent = 'Error: ' + err.message;", js)
    js = re.sub(r"document\.getElementById\('tab-content'\)\.innerHTML='<div.*?Sin clasificación disponible.*?</p></div>';", "document.getElementById('tab-content').textContent = 'Sin clasificación disponible';", js)
    js = re.sub(r"document\.getElementById\('tab-content'\)\.innerHTML='<div.*?Sin resultados disponibles.*?</p></div>';", "document.getElementById('tab-content').textContent = 'Sin resultados disponibles';", js)
    js = re.sub(r"document\.getElementById\('tab-content'\)\.innerHTML='<div.*?Sin partidos en el calendario.*?</p></div>';", "document.getElementById('tab-content').textContent = 'Sin partidos en el calendario';", js)
    
    # We must also rewrite the `html += ...` logic for `renderStandings`, `renderResults`, `renderCalendar`.
    # Let's replace the whole functions.
    pass

except Exception as e:
    pass

