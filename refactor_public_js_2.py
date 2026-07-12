import re

# ------------- noticias.js -------------
try:
    with open('js/noticias.js', 'r', encoding='utf-8') as f:
        js = f.read()

    build_card = """
  // --- Construir card segura ---
  function buildCard(id, data, featured) {
    const title   = data.title   || data.titulo   || 'Sin titulo';
    const date    = data.date    || data.fecha    || '';
    const tag     = data.tag     || data.categoria || 'Club';
    const image   = safeURL(data.image || data.imagen, 'image');
    
    const a = document.createElement('a');
    a.className = 'news-card' + (featured ? ' featured' : '');
    a.href = 'noticia.html?id=' + encodeURIComponent(id);
    
    if(image) {
      const img = document.createElement('img');
      img.className = 'news-card-img';
      img.src = image;
      img.loading = 'lazy';
      img.alt = title;
      a.appendChild(img);
    } else {
      const div = document.createElement('div');
      div.className = 'news-card-img';
      div.style.background = 'rgba(18,85,201,0.15)';
      a.appendChild(div);
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'news-card-overlay';
    a.appendChild(overlay);
    
    const body = document.createElement('div');
    body.className = 'news-card-body';
    
    const tagSpan = document.createElement('span');
    tagSpan.className = 'news-card-cat';
    tagSpan.textContent = tag;
    body.appendChild(tagSpan);
    
    const h3 = document.createElement('h3');
    h3.className = 'news-card-title';
    h3.textContent = title;
    body.appendChild(h3);
    
    const dateDiv = document.createElement('div');
    dateDiv.className = 'news-card-date';
    dateDiv.textContent = date;
    body.appendChild(dateDiv);
    
    a.appendChild(body);
    return a;
  }
"""
    js = re.sub(r'function buildCard.*?return `.*?`;\n  }', build_card, js, flags=re.DOTALL)
    
    # render
    render_regex = r"const html = docs\.map\(\(doc, i\) => buildCard\(doc\.id, doc\.data\(\), i === 0 && !append\)\)\.join\(''\);\n.*?if \(append\).*?else.*?container\.innerHTML = html;\n.*?\}"
    render_replace = """
      if(!append) container.innerHTML = '';
      docs.forEach((doc, i) => {
        const card = buildCard(doc.id, doc.data(), i === 0 && !append);
        container.appendChild(card);
      });
"""
    js = re.sub(render_regex, render_replace, js, flags=re.DOTALL)
    
    with open('js/noticias.js', 'w', encoding='utf-8') as f:
        f.write(js)
except Exception as e:
    pass

# ------------- patrocinadores.js -------------
try:
    with open('js/patrocinadores.js', 'r', encoding='utf-8') as f:
        js = f.read()

    sponsors_regex = r"grid\.innerHTML = snap\.docs\.map\(\(doc,i\) => \{.*?\n        \}\)\.join\(''\);"
    sponsors_replace = """
        grid.innerHTML = '';
        snap.docs.forEach((doc, i) => {
          const s = doc.data();
          const href = safeURL(s.link || s.enlace, 'link');
          const logo = safeURL(s.logo || s.imagen, 'image');
          const delay = i * 50;
          
          let card;
          if (href) {
            card = document.createElement('a');
            card.href = href;
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
          } else {
            card = document.createElement('div');
          }
          card.className = 'sponsor-card fade-up';
          card.style.animationDelay = delay + 'ms';
          
          if(logo) {
            const img = document.createElement('img');
            img.src = logo;
            img.alt = s.name || s.nombre || 'Patrocinador';
            img.loading = 'lazy';
            img.onerror = () => { img.style.display = 'none'; };
            card.appendChild(img);
          } else {
            const div = document.createElement('div');
            div.style.cssText = "width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--text-secondary);font-size:1.5rem;";
            const icon = document.createElement('i');
            icon.setAttribute('data-feather', 'image');
            div.appendChild(icon);
            card.appendChild(div);
          }
          grid.appendChild(card);
        });
"""
    js = re.sub(sponsors_regex, sponsors_replace, js, flags=re.DOTALL)
    with open('js/patrocinadores.js', 'w', encoding='utf-8') as f:
        f.write(js)
except Exception as e:
    pass

