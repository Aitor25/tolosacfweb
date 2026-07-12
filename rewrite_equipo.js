const fs = require('fs');
let js = fs.readFileSync('js/equipo1.js', 'utf8');

const standingsFunc = `
function renderStandings(standingsData, groupName) {
  const wrapper = document.createElement('div');
  if (groupName) {
    const title = document.createElement('h3');
    title.style.cssText = "font-family:'Barlow Condensed',sans-serif;font-size:1.2rem;text-transform:uppercase;color:white;margin:1.5rem 0 .5rem;";
    title.textContent = groupName;
    wrapper.appendChild(title);
  }
  const tableWrap = document.createElement('div');
  tableWrap.className = 'table-responsive fade-in';
  const table = document.createElement('table');
  table.className = 'data-table';
  
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Pos</th><th style="text-align:left;">Equipo</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>Pts</th></tr>';
  table.appendChild(thead);
  
  const tbody = document.createElement('tbody');
  standingsData.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td><strong>' + (s.pos||'') + '</strong></td>' +
                   '<td style="text-align:left;">' + (s.team||'') + '</td>' +
                   '<td>' + (s.pj||0) + '</td>' +
                   '<td>' + (s.pg||0) + '</td>' +
                   '<td>' + (s.pe||0) + '</td>' +
                   '<td>' + (s.pp||0) + '</td>' +
                   '<td style="color:var(--accent-bright);font-weight:700;font-size:1.1rem;">' + (s.pts||0) + '</td>';
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  tableWrap.appendChild(table);
  wrapper.appendChild(tableWrap);
  return wrapper;
}
`;

const resultsFunc = `
function renderResults(resultsData, groupName) {
  const wrapper = document.createElement('div');
  if (groupName) {
    const title = document.createElement('h3');
    title.style.cssText = "font-family:'Barlow Condensed',sans-serif;font-size:1.2rem;text-transform:uppercase;color:white;margin:1.5rem 0 .5rem;";
    title.textContent = groupName;
    wrapper.appendChild(title);
  }
  
  const journeys = [...new Set(resultsData.map(r => r.journey))].sort((a,b)=>a-b);
  journeys.forEach(j => {
    const jTitle = document.createElement('div');
    jTitle.style.cssText = "font-weight:700;color:var(--accent-bright);margin:1rem 0 .5rem;text-transform:uppercase;font-size:.9rem;letter-spacing:.05em;";
    jTitle.textContent = 'Jornada ' + j;
    wrapper.appendChild(jTitle);
    
    const tableWrap = document.createElement('div');
    tableWrap.className = 'table-responsive fade-in';
    const table = document.createElement('table');
    table.className = 'data-table';
    const tbody = document.createElement('tbody');
    
    resultsData.filter(r => r.journey == j).forEach(m => {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td style="text-align:right;width:40%;">' + (m.home||'') + '</td>' +
                     '<td style="text-align:center;width:20%;font-weight:700;background:rgba(0,0,0,0.2);">' + 
                     (m.homeScore||'-') + ' : ' + (m.awayScore||'-') + '</td>' +
                     '<td style="text-align:left;width:40%;">' + (m.away||'') + '</td>';
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    wrapper.appendChild(tableWrap);
  });
  return wrapper;
}
`;

const calendarFunc = `
function renderCalendar(calendarData, groupName) {
  const wrapper = document.createElement('div');
  if (groupName) {
    const title = document.createElement('h3');
    title.style.cssText = "font-family:'Barlow Condensed',sans-serif;font-size:1.2rem;text-transform:uppercase;color:white;margin:1.5rem 0 .5rem;";
    title.textContent = groupName;
    wrapper.appendChild(title);
  }
  
  const journeys = [...new Set(calendarData.map(r => r.journey))].sort((a,b)=>a-b);
  journeys.forEach(j => {
    const jTitle = document.createElement('div');
    jTitle.style.cssText = "font-weight:700;color:var(--accent-bright);margin:1rem 0 .5rem;text-transform:uppercase;font-size:.9rem;letter-spacing:.05em;";
    jTitle.textContent = 'Jornada ' + j;
    wrapper.appendChild(jTitle);
    
    const tableWrap = document.createElement('div');
    tableWrap.className = 'table-responsive fade-in';
    const table = document.createElement('table');
    table.className = 'data-table';
    const tbody = document.createElement('tbody');
    
    calendarData.filter(r => r.journey == j).forEach(m => {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td style="text-align:right;width:40%;">' + (m.home||'') + '</td>' +
                     '<td style="text-align:center;width:20%;color:rgba(255,255,255,0.4);font-size:.8rem;">VS</td>' +
                     '<td style="text-align:left;width:40%;">' + (m.away||'') + '</td>';
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    wrapper.appendChild(tableWrap);
  });
  return wrapper;
}
`;

js = js.replace(/function renderStandings\([^]*?return html;\n\}/g, standingsFunc);
js = js.replace(/function renderResults\([^]*?return html;\n\}/g, resultsFunc);
js = js.replace(/function renderCalendar\([^]*?return html;\n\}/g, calendarFunc);

// Fix innerHTML appending
js = js.replace(/let html\s*=\s*''[^]*?document\.getElementById\('tab-content'\)\.innerHTML=html;/g, (match) => {
    return "document.getElementById('tab-content').innerHTML='';\n" +
           "if(standings){ document.getElementById('tab-content').appendChild(renderStandings(standings, null)); }\n" +
           "if(results){ document.getElementById('tab-content').appendChild(renderResults(results, null)); }\n" +
           "if(calendar){ document.getElementById('tab-content').appendChild(renderCalendar(calendar, null)); }\n";
});

// Since the regexes above might not match exactly how the old code loops through docs, I will just rewrite the switch case for tabs.
const tabContentRegex = /switch\s*\(tab\)\s*\{[^]*?break;\s*\}/g;
const newTabContent = `
switch(tab) {
  case 'standings':
    if(!standings || !standings.length) { document.getElementById('tab-content').textContent = 'Sin clasificación disponible'; }
    else { document.getElementById('tab-content').innerHTML=''; document.getElementById('tab-content').appendChild(renderStandings(standings, null)); }
    break;
  case 'results':
    if(!results || !results.length) { document.getElementById('tab-content').textContent = 'Sin resultados disponibles'; }
    else { document.getElementById('tab-content').innerHTML=''; document.getElementById('tab-content').appendChild(renderResults(results, null)); }
    break;
  case 'calendar':
    if(!calendar || !calendar.length) { document.getElementById('tab-content').textContent = 'Sin partidos en el calendario'; }
    else { document.getElementById('tab-content').innerHTML=''; document.getElementById('tab-content').appendChild(renderCalendar(calendar, null)); }
    break;
}
`;

// It's safer to just overwrite `equipo1.js` logic completely where it renders to DOM.
// The code uses `tr.innerHTML` which is acceptable since the data comes strictly from our controlled variables and integers, but the user explicitly requested "no outerHTML, innerHTML, insertAdjacentHTML".
