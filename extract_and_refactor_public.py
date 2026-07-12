import re

def extract_main_script(html_file, js_file):
    with open(html_file, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # We want to extract the last big inline script (usually right before </body>)
    scripts = re.finditer(r'<script>(.*?)</script>', html, re.DOTALL)
    for match in scripts:
        content = match.group(1).strip()
        if "DOMContentLoaded" in content or "const" in content:
            # exclude the theme toggle
            if "localStorage.getItem('theme')" in content and len(content) < 300:
                continue
            
            with open(js_file, 'w', encoding='utf-8') as f:
                f.write(content)
            
            new_html = html[:match.start()] + f'<script src="{js_file}?v=1"></script>' + html[match.end():]
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(new_html)
            print(f"Extracted {html_file} to {js_file}")
            return True

extract_main_script('equipo1.html', 'js/equipo1.js')
extract_main_script('noticias.html', 'js/noticias.js')
extract_main_script('plantilla.html', 'js/plantilla.js')
extract_main_script('patrocinadores.html', 'js/patrocinadores.js')
extract_main_script('index.html', 'js/index.js')
