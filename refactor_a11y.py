import glob, re

css_to_add = """
/* ── ACCESSIBILITY ── */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--accent);
  color: white;
  padding: 8px;
  z-index: 9999;
  transition: top 0.2s;
}
.skip-link:focus { top: 0; }
"""
with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()
if '.skip-link' not in css:
    with open('styles.css', 'a', encoding='utf-8') as f:
        f.write(css_to_add)

files = glob.glob('*.html')
for fname in files:
    if fname in ['index_tail.html']: continue
    with open(fname, 'r', encoding='utf-8') as f:
        c = f.read()
        
    # 1. Add skip link right after body
    if 'class="skip-link"' not in c:
        c = c.replace('<body>', '<body>\n<a href="#main-content" class="skip-link">Saltar al contenido principal</a>')
        
    # 2. Add id="main-content" to the main tag or the first container.
    # We will find the first <main> or create one if it doesn't exist, but it's safer to just wrap the content or add to first major div
    if 'id="main-content"' not in c:
        # For simplicity, if there's no <main>, let's assume the first major section/div after nav is main.
        # Actually, let's just do regex replacement for <main> or inject <div id="main-content">
        # Many pages don't have <main>. Let's see if there's <div class="container" or <section
        match = re.search(r'(<div class="container".*?>|<section.*?>|<main.*?>)', c)
        if match:
            tag = match.group(0)
            if 'id=' not in tag:
                new_tag = tag.replace('>', ' id="main-content">')
                c = c.replace(tag, new_tag, 1)
                
    # 3. Add lang attributes based on translations (default es)
    if '<html lang=' not in c:
        c = c.replace('<html>', '<html lang="es">').replace('<html >', '<html lang="es">')
        
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(c)

print("A11y refactor completed")
