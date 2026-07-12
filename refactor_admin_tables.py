import re

with open('js/admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. loadTeams
teams_regex = r"tbody\.innerHTML=snap\.docs\.map\(doc=>\{const t=doc\.data\(\);return`<tr>(.*?)</tr>`;\}\)\.join\(''\);"
teams_replace = """
    tbody.innerHTML = '';
    snap.docs.forEach(doc => {
      const t = doc.data();
      const tr = document.createElement('tr');
      const tdName = document.createElement('td'); tdName.style.cssText = "font-weight:600;color:white;"; tdName.textContent = t.name;
      const tdCat = document.createElement('td'); const spanCat = document.createElement('span'); spanCat.className = "badge badge-blue"; spanCat.textContent = t.category || '-'; tdCat.appendChild(spanCat);
      const tdCoach = document.createElement('td'); tdCoach.style.cssText = "color:rgba(255,255,255,0.6);"; tdCoach.textContent = t.coach || '-';
      const tdSeason = document.createElement('td'); tdSeason.style.cssText = "color:rgba(255,255,255,0.4);"; tdSeason.textContent = t.season || '-';
      const tdActions = document.createElement('td');
      const actionDiv = document.createElement('div'); actionDiv.style.cssText = "display:flex;gap:.4rem;";
      
      const btnEdit = document.createElement('button'); btnEdit.className = "btn btn-ghost btn-sm"; btnEdit.onclick = () => editTeam(doc.id);
      const iconEdit = document.createElement('i'); iconEdit.setAttribute('data-feather', 'edit-2'); btnEdit.appendChild(iconEdit);
      
      const btnDelete = document.createElement('button'); btnDelete.className = "btn btn-danger btn-sm"; btnDelete.onclick = () => deleteTeam(doc.id);
      const iconDelete = document.createElement('i'); iconDelete.setAttribute('data-feather', 'trash-2'); btnDelete.appendChild(iconDelete);
      
      actionDiv.appendChild(btnEdit); actionDiv.appendChild(btnDelete);
      tdActions.appendChild(actionDiv);
      
      tr.appendChild(tdName); tr.appendChild(tdCat); tr.appendChild(tdCoach); tr.appendChild(tdSeason); tr.appendChild(tdActions);
      tbody.appendChild(tr);
    });
"""
js = re.sub(teams_regex, teams_replace, js, flags=re.DOTALL)

# 2. loadPlayers
players_regex = r"tbody\.innerHTML=docs\.map\(doc=>\{const p=doc\.data\(\);return`<tr>(.*?)</tr>`;\}\)\.join\(''\);"
players_replace = """
    tbody.innerHTML = '';
    docs.forEach(doc => {
      const p = doc.data();
      const tr = document.createElement('tr');
      const tdNum = document.createElement('td'); tdNum.style.cssText = "font-family:'Barlow Condensed',sans-serif;font-weight:900;color:var(--accent-bright);font-size:1rem;"; tdNum.textContent = p.number || '-';
      const tdName = document.createElement('td'); tdName.style.cssText = "font-weight:600;color:white;"; tdName.textContent = p.name;
      const tdPos = document.createElement('td'); const spanPos = document.createElement('span'); spanPos.className = "badge badge-gray"; spanPos.textContent = p.position || '-'; tdPos.appendChild(spanPos);
      const tdTeam = document.createElement('td'); tdTeam.style.cssText = "font-size:.78rem;color:rgba(255,255,255,0.4);"; tdTeam.textContent = p.team || '-';
      
      const tdActions = document.createElement('td');
      const actionDiv = document.createElement('div'); actionDiv.style.cssText = "display:flex;gap:.4rem;";
      const btnEdit = document.createElement('button'); btnEdit.className = "btn btn-ghost btn-sm"; btnEdit.onclick = () => editPlayer(doc.id);
      const iconEdit = document.createElement('i'); iconEdit.setAttribute('data-feather', 'edit-2'); btnEdit.appendChild(iconEdit);
      const btnDelete = document.createElement('button'); btnDelete.className = "btn btn-danger btn-sm"; btnDelete.onclick = () => deletePlayer(doc.id);
      const iconDelete = document.createElement('i'); iconDelete.setAttribute('data-feather', 'trash-2'); btnDelete.appendChild(iconDelete);
      
      actionDiv.appendChild(btnEdit); actionDiv.appendChild(btnDelete);
      tdActions.appendChild(actionDiv);
      
      tr.appendChild(tdNum); tr.appendChild(tdName); tr.appendChild(tdPos); tr.appendChild(tdTeam); tr.appendChild(tdActions);
      tbody.appendChild(tr);
    });
"""
js = re.sub(players_regex, players_replace, js, flags=re.DOTALL)

# 3. loadStaffAdmin
staff_regex = r"tbody\.innerHTML=snap\.docs\.map\(doc=>\{const m=doc\.data\(\);return`<tr>(.*?)</tr>`;\}\)\.join\(''\);"
staff_replace = """
    tbody.innerHTML = '';
    snap.docs.forEach(doc => {
      const m = doc.data();
      const tr = document.createElement('tr');
      const tdName = document.createElement('td'); tdName.style.cssText = "font-weight:600;color:white;"; tdName.textContent = m.name;
      const tdRole = document.createElement('td'); const spanRole = document.createElement('span'); spanRole.className = "badge badge-blue"; spanRole.textContent = m.role || '-'; tdRole.appendChild(spanRole);
      const tdOrder = document.createElement('td'); tdOrder.style.cssText = "color:rgba(255,255,255,0.4);"; tdOrder.textContent = m.order || 0;
      
      const tdActions = document.createElement('td');
      const actionDiv = document.createElement('div'); actionDiv.style.cssText = "display:flex;gap:.4rem;";
      const btnEdit = document.createElement('button'); btnEdit.className = "btn btn-ghost btn-sm"; btnEdit.onclick = () => editStaff(doc.id);
      const iconEdit = document.createElement('i'); iconEdit.setAttribute('data-feather', 'edit-2'); btnEdit.appendChild(iconEdit);
      const btnDelete = document.createElement('button'); btnDelete.className = "btn btn-danger btn-sm"; btnDelete.onclick = () => deleteStaff(doc.id);
      const iconDelete = document.createElement('i'); iconDelete.setAttribute('data-feather', 'trash-2'); btnDelete.appendChild(iconDelete);
      
      actionDiv.appendChild(btnEdit); actionDiv.appendChild(btnDelete);
      tdActions.appendChild(actionDiv);
      
      tr.appendChild(tdName); tr.appendChild(tdRole); tr.appendChild(tdOrder); tr.appendChild(tdActions);
      tbody.appendChild(tr);
    });
"""
js = re.sub(staff_regex, staff_replace, js, flags=re.DOTALL)

# 4. loadSponsors
sponsors_regex = r"grid\.innerHTML=snap\.docs\.map\(doc=>\{const s=doc\.data\(\);return`<div style=\"background:rgba\(255,255,255,0\.04\).*?</div>`;\}\)\.join\(''\);"
sponsors_replace = """
    grid.innerHTML = '';
    snap.docs.forEach(doc => {
      const s = doc.data();
      const div = document.createElement('div');
      div.style.cssText = "background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:1rem;text-align:center;";
      
      if(s.logo) {
          const img = document.createElement('img'); img.src = s.logo; img.style.cssText = "height:40px;object-fit:contain;margin:0 auto .75rem;display:block;";
          img.onerror = () => img.style.display = 'none';
          div.appendChild(img);
      } else {
          const iconHolder = document.createElement('div'); iconHolder.style.cssText = "height:40px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.2);margin-bottom:.75rem;";
          const icon = document.createElement('i'); icon.setAttribute('data-feather', 'image'); icon.style.cssText = "width:24px;height:24px;";
          iconHolder.appendChild(icon);
          div.appendChild(iconHolder);
      }
      
      const nameDiv = document.createElement('div'); nameDiv.style.cssText = "font-weight:700;font-size:.85rem;color:white;margin-bottom:.25rem;"; nameDiv.textContent = s.name; div.appendChild(nameDiv);
      const catDiv = document.createElement('div'); catDiv.className = "badge badge-blue"; catDiv.style.cssText = "margin-bottom:.75rem;"; catDiv.textContent = s.category || 'colaborador'; div.appendChild(catDiv);
      
      const actionDiv = document.createElement('div'); actionDiv.style.cssText = "display:flex;gap:.5rem;justify-content:center;";
      const btnEdit = document.createElement('button'); btnEdit.className = "btn btn-ghost btn-sm"; btnEdit.onclick = () => editSponsor(doc.id);
      const iconEdit = document.createElement('i'); iconEdit.setAttribute('data-feather', 'edit-2'); btnEdit.appendChild(iconEdit);
      const btnDelete = document.createElement('button'); btnDelete.className = "btn btn-danger btn-sm"; btnDelete.onclick = () => deleteSponsor(doc.id);
      const iconDelete = document.createElement('i'); iconDelete.setAttribute('data-feather', 'trash-2'); btnDelete.appendChild(iconDelete);
      
      actionDiv.appendChild(btnEdit); actionDiv.appendChild(btnDelete); div.appendChild(actionDiv);
      grid.appendChild(div);
    });
"""
js = re.sub(sponsors_regex, sponsors_replace, js, flags=re.DOTALL)

with open('js/admin.js', 'w', encoding='utf-8') as f:
    f.write(js)
