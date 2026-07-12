import re

# ------------- plantilla.js -------------
try:
    with open('js/plantilla.js', 'r', encoding='utf-8') as f:
        js = f.read()

    build_player = """
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
"""
    js = re.sub(r'function renderPlayerCard\(player\) \{.*?\n\}', build_player, js, flags=re.DOTALL)
    js = re.sub(r"gridEl\.innerHTML = players\.map\(renderPlayerCard\)\.join\(''\);", "gridEl.innerHTML=''; players.forEach(p => gridEl.appendChild(buildPlayerCard(p)));", js)
    js = re.sub(r"gridEl\.innerHTML = '<div.*?Error al cargar la plantilla: ' \+ err\.message \+ '</p></div>';", "gridEl.textContent = 'Error: ' + err.message;", js)

    build_staff = """
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
"""
    js = re.sub(r'function renderStaffCard\(member\) \{.*?\n\}', build_staff, js, flags=re.DOTALL)
    js = re.sub(r"staffGrid\.innerHTML = members\.map\(renderStaffCard\)\.join\(''\);", "staffGrid.innerHTML=''; members.forEach(m => staffGrid.appendChild(buildStaffCard(m)));", js)

    with open('js/plantilla.js', 'w', encoding='utf-8') as f:
        f.write(js)
except Exception as e:
    pass

