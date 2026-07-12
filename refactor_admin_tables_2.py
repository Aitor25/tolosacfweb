import re

with open('js/admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. loadStandings (categories)
standings_cat_regex = r"tbody\.innerHTML=standings\.map\(\(t,i\)=>\{(.*?)\}\)\.join\(''\);"
standings_cat_replace = """
    tbody.innerHTML = '';
    standings.forEach((t, i) => {
      const tr = document.createElement('tr');
      const tdPos = document.createElement('td'); tdPos.style.cssText = "font-family:'Barlow Condensed',sans-serif;font-weight:900;color:var(--accent-bright);font-size:1.1rem;"; tdPos.textContent = t.pos;
      const tdTeam = document.createElement('td'); tdTeam.style.cssText = "font-weight:600;color:white;"; tdTeam.textContent = t.team;
      const tdPJ = document.createElement('td'); tdPJ.style.cssText = "color:rgba(255,255,255,0.5);"; tdPJ.textContent = t.pj;
      const tdPG = document.createElement('td'); tdPG.textContent = t.pg;
      const tdPE = document.createElement('td'); tdPE.textContent = t.pe;
      const tdPP = document.createElement('td'); tdPP.textContent = t.pp;
      const tdGF = document.createElement('td'); tdGF.style.cssText = "color:rgba(255,255,255,0.4);font-size:.8rem;"; tdGF.textContent = t.gf;
      const tdGC = document.createElement('td'); tdGC.style.cssText = "color:rgba(255,255,255,0.4);font-size:.8rem;"; tdGC.textContent = t.gc;
      const tdDif = document.createElement('td'); tdDif.style.cssText = "color:rgba(255,255,255,0.5);font-size:.85rem;"; tdDif.textContent = t.dif;
      const tdPts = document.createElement('td'); tdPts.style.cssText = "font-weight:700;color:var(--accent-bright);"; tdPts.textContent = t.pts;
      
      const tdActions = document.createElement('td');
      const btnDelete = document.createElement('button'); btnDelete.className = "btn btn-danger btn-sm"; btnDelete.onclick = () => deleteStanding(t.id);
      const iconDelete = document.createElement('i'); iconDelete.setAttribute('data-feather', 'trash-2'); btnDelete.appendChild(iconDelete);
      tdActions.appendChild(btnDelete);
      
      tr.appendChild(tdPos); tr.appendChild(tdTeam); tr.appendChild(tdPJ); tr.appendChild(tdPG); tr.appendChild(tdPE);
      tr.appendChild(tdPP); tr.appendChild(tdGF); tr.appendChild(tdGC); tr.appendChild(tdDif); tr.appendChild(tdPts); tr.appendChild(tdActions);
      tbody.appendChild(tr);
    });
"""
js = re.sub(standings_cat_regex, standings_cat_replace, js, flags=re.DOTALL)

# 2. loadMatches (results)
matches_regex = r"tbody\.innerHTML=results\.map\(m=>\{(.*?)\}\)\.join\(''\);"
matches_replace = """
    tbody.innerHTML = '';
    results.forEach(m => {
      const tr = document.createElement('tr');
      const tdDate = document.createElement('td'); tdDate.style.cssText = "font-size:.8rem;color:rgba(255,255,255,0.4);"; tdDate.textContent = m.date || 'S/D';
      const tdTime = document.createElement('td'); tdTime.style.cssText = "font-family:'Barlow Condensed',sans-serif;font-weight:700;color:var(--accent-bright);"; tdTime.textContent = m.time || '-';
      const tdLocal = document.createElement('td'); tdLocal.style.cssText = "font-weight:600;color:white;text-align:right;"; tdLocal.textContent = m.local;
      const tdRes = document.createElement('td'); tdRes.style.cssText = "text-align:center;font-weight:900;background:rgba(255,255,255,0.05);border-radius:4px;"; tdRes.textContent = m.result || 'vs';
      const tdVisit = document.createElement('td'); tdVisit.style.cssText = "font-weight:600;color:white;"; tdVisit.textContent = m.visitor;
      
      const tdActions = document.createElement('td');
      const actionDiv = document.createElement('div'); actionDiv.style.cssText = "display:flex;gap:.4rem;";
      const btnEdit = document.createElement('button'); btnEdit.className = "btn btn-ghost btn-sm"; btnEdit.onclick = () => editResult(m.id);
      const iconEdit = document.createElement('i'); iconEdit.setAttribute('data-feather', 'edit-2'); btnEdit.appendChild(iconEdit);
      const btnDelete = document.createElement('button'); btnDelete.className = "btn btn-danger btn-sm"; btnDelete.onclick = () => deleteResult(m.id);
      const iconDelete = document.createElement('i'); iconDelete.setAttribute('data-feather', 'trash-2'); btnDelete.appendChild(iconDelete);
      
      actionDiv.appendChild(btnEdit); actionDiv.appendChild(btnDelete);
      tdActions.appendChild(actionDiv);
      
      tr.appendChild(tdDate); tr.appendChild(tdTime); tr.appendChild(tdLocal); tr.appendChild(tdRes); tr.appendChild(tdVisit); tr.appendChild(tdActions);
      tbody.appendChild(tr);
    });
"""
js = re.sub(matches_regex, matches_replace, js, flags=re.DOTALL)

with open('js/admin.js', 'w', encoding='utf-8') as f:
    f.write(js)
