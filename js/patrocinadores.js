document.addEventListener('DOMContentLoaded', async () => {
  feather.replace();
  try {
    const db = window.db;
    if (db) {
      const snap = await db.collection('sponsors').get();
      if (!snap.empty) {
        const grid = document.getElementById('sponsors-grid');
        
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

        feather.replace();
      }
    }
  } catch(e) { console.warn('Sponsors:', e.message); }
});