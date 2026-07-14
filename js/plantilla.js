const db = window.db || firebase.firestore();

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}


function buildPlayerCard(player) {
  const card = document.createElement('div');
  card.className = 'player-card reveal';
  
  const dorsal = (player.number != null && player.number !== '') ? player.number : '';
  if (dorsal !== '') {
    const dDiv = document.createElement('div');
    dDiv.className = 'player-dorsal';
    dDiv.textContent = dorsal;
    card.appendChild(dDiv);
  }
  
  const photoWrap = document.createElement('div');
  photoWrap.className = 'player-photo-wrap';
  const photoUrl = safeURL(player.photo, 'image');
  
  if (photoUrl) {
    const img = document.createElement('img');
    img.src = photoUrl;
    img.alt = player.name || 'Jugador';
    img.loading = 'lazy';
    img.onerror = () => {
       img.style.display = 'none';
       const ph = document.createElement('div');
       ph.className = 'player-photo-placeholder';
       ph.textContent = getInitials(player.name);
       photoWrap.appendChild(ph);
    };
    photoWrap.appendChild(img);
  } else {
    const ph = document.createElement('div');
    ph.className = 'player-photo-placeholder';
    ph.textContent = getInitials(player.name);
    photoWrap.appendChild(ph);
  }
  card.appendChild(photoWrap);
  
  const info = document.createElement('div');
  info.className = 'player-info';
  
  const nameDiv = document.createElement('div');
  nameDiv.className = 'player-name';
  nameDiv.textContent = player.name || 'Sin nombre';
  info.appendChild(nameDiv);
  
  if (player.position) {
    const posSpan = document.createElement('span');
    posSpan.className = 'player-position';
    posSpan.textContent = player.position;
    info.appendChild(posSpan);
  }
  
  card.appendChild(info);
  return card;
}


async function loadSquad() {
  const loadingEl = document.getElementById('squad-loading');
  const gridEl    = document.getElementById('squad-grid');
  const emptyEl   = document.getElementById('squad-empty');

  try {
    const snap = await db.collection('players').orderBy('number').get();

    const players = snap.docs
      .map(function(doc) { return Object.assign({ id: doc.id }, doc.data()); })
      .filter(function(p) {
        if (p.team !== 'senior-masculino') return false;
        if (p.active !== undefined) return p.active === true;
        return true;
      });

    loadingEl.style.display = 'none';

    if (!players.length) {
      emptyEl.style.display = 'block';
      feather.replace();
      if (typeof applyTranslations === 'function') applyTranslations();
      return;
    }

    gridEl.innerHTML=''; players.forEach(p => gridEl.appendChild(buildPlayerCard(p)));
    gridEl.style.display = 'grid';
    feather.replace();

    requestAnimationFrame(function() {
      var cards = gridEl.querySelectorAll('.reveal');
      cards.forEach(function(el, i) {
        setTimeout(function() { el.classList.add('visible'); }, i * 50);
      });
    });

    if (typeof applyTranslations === 'function') applyTranslations();

  } catch(err) {
    loadingEl.style.display = 'none';
    gridEl.style.display = 'grid';
    gridEl.textContent = 'Error: ' + err.message;
    console.error('[plantilla.html] Error cargando jugadores:', err);
  }
}


function buildStaffCard(member) {
  const card = document.createElement('div');
  card.className = 'staff-card reveal';
  
  const photoWrap = document.createElement('div');
  photoWrap.className = 'staff-photo-wrap';
  const photoUrl = safeURL(member.photo, 'image');
  
  if (photoUrl) {
    const img = document.createElement('img');
    img.src = photoUrl;
    img.alt = member.name || 'Staff';
    img.loading = 'lazy';
    img.onerror = () => { img.style.display = 'none'; };
    photoWrap.appendChild(img);
  } else {
    const ph = document.createElement('div');
    ph.className = 'staff-photo-placeholder';
    ph.textContent = getInitials(member.name);
    photoWrap.appendChild(ph);
  }
  card.appendChild(photoWrap);
  
  const info = document.createElement('div');
  info.className = 'staff-info';
  
  const nameDiv = document.createElement('div');
  nameDiv.className = 'staff-name';
  nameDiv.textContent = member.name || 'Sin nombre';
  info.appendChild(nameDiv);
  
  if (member.role) {
    const roleSpan = document.createElement('span');
    roleSpan.className = 'staff-role';
    roleSpan.textContent = member.role;
    info.appendChild(roleSpan);
  }
  
  card.appendChild(info);
  return card;
}


async function loadStaff() {
  const staffSection = document.getElementById('staff-section');
  const staffGrid    = document.getElementById('staff-grid');
  try {
    const snap = await db.collection('staff').orderBy('order').get();
    const members = snap.docs
      .map(function(doc) { return Object.assign({ id: doc.id }, doc.data()); })
      .filter(function(m) { return !m.team || m.team === 'senior-masculino'; });
    if (!members.length) return;
    staffGrid.innerHTML=''; members.forEach(m => staffGrid.appendChild(buildStaffCard(m)));
    staffSection.style.display = 'block';
    feather.replace();
    requestAnimationFrame(function() {
      staffGrid.querySelectorAll('.reveal').forEach(function(el, i) {
        setTimeout(function() { el.classList.add('visible'); }, i * 60);
      });
    });
    if (typeof applyTranslations === 'function') applyTranslations();
  } catch(err) {
    console.warn('[plantilla.html] Staff no cargado:', err.message);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  feather.replace();
  loadSquad();
  loadStaff();
});