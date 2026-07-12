import re

with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add DOMPurify script to head
if 'purify.min.js' not in content:
    content = content.replace('</head>', '  <script src="js/vendor/purify.min.js"></script>\n</head>')

# Add helper functions to the start of the script
helpers = """
// --- DOM HELPERS ---
function createEl(tag, attrs = {}, text = '') {
  const el = document.createElement(tag);
  for(let k in attrs) {
    if(k === 'className') el.className = attrs[k];
    else if(k.startsWith('data-')) el.setAttribute(k, attrs[k]);
    else if(k === 'style') el.style.cssText = attrs[k];
    else el[k] = attrs[k];
  }
  if(text) el.textContent = text;
  return el;
}
function appendChildren(parent, children) {
  children.forEach(c => { if(c) parent.appendChild(c); });
  return parent;
}
function createIcon(name) {
  const i = document.createElement('i');
  i.setAttribute('data-feather', name);
  return i;
}
"""
content = content.replace('const auth = getAuth(app);', helpers + '\nconst auth = getAuth(app);')

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(content)
