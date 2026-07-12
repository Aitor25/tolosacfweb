const fs = require('fs');
let js = fs.readFileSync('js/equipo1.js', 'utf8');

// Replace ANY innerHTML assignments with textContent or createElement patterns.
const innerHTMLRegex = /\.innerHTML\s*=/g;
if(innerHTMLRegex.test(js)) {
  console.log("Still has innerHTML, let's fix it by rewriting render logic completely.");
}

const safeRenderCode = `
function createTd(content, isHTML = false, styles = "") {
  const td = document.createElement('td');
  if (styles) td.style.cssText = styles;
  if (isHTML) {
    // Actually we don't want innerHTML, if we have HTML we parse or just use textContent
    td.textContent = content;
  } else {
    td.textContent = content;
  }
  return td;
}

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
  const trHead = document.createElement('tr');
  ['Pos', 'Equipo', 'PJ', 'PG', 'PE', 'PP', 'Pts'].forEach((h, i) => {
    const th = document.createElement('th');
    th.textContent = h;
    if(i === 1) th.style.textAlign = 'left';
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);
  
  const tbody = document.createElement('tbody');
  standingsData.forEach(s => {
    const tr = document.createElement('tr');
    tr.appendChild(createTd(s.pos||''));
    tr.children[0].style.fontWeight = 'bold';
    tr.appendChild(createTd(s.team||'', false, "text-align:left;"));
    tr.appendChild(createTd(s.pj||0));
    tr.appendChild(createTd(s.pg||0));
    tr.appendChild(createTd(s.pe||0));
    tr.appendChild(createTd(s.pp||0));
    const ptsTd = createTd(s.pts||0, false, "color:var(--accent-bright);font-weight:700;font-size:1.1rem;");
    tr.appendChild(ptsTd);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  tableWrap.appendChild(table);
  wrapper.appendChild(tableWrap);
  return wrapper;
}

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
      tr.appendChild(createTd(m.home||'', false, "text-align:right;width:40%;"));
      tr.appendChild(createTd((m.homeScore||'-') + ' : ' + (m.awayScore||'-'), false, "text-align:center;width:20%;font-weight:700;background:rgba(0,0,0,0.2);"));
      tr.appendChild(createTd(m.away||'', false, "text-align:left;width:40%;"));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    wrapper.appendChild(tableWrap);
  });
  return wrapper;
}

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
      tr.appendChild(createTd(m.home||'', false, "text-align:right;width:40%;"));
      tr.appendChild(createTd("VS", false, "text-align:center;width:20%;color:rgba(255,255,255,0.4);font-size:.8rem;"));
      tr.appendChild(createTd(m.away||'', false, "text-align:left;width:40%;"));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    wrapper.appendChild(tableWrap);
  });
  return wrapper;
}
`;

js = js.replace(/function renderStandings\([^]*?return wrapper;\n\}/g, '');
js = js.replace(/function renderResults\([^]*?return wrapper;\n\}/g, '');
js = js.replace(/function renderCalendar\([^]*?return wrapper;\n\}/g, '');
js = safeRenderCode + "\n" + js;

// Make sure NO document.getElementById('tab-content').innerHTML exists
js = js.replace(/document\.getElementById\('tab-content'\)\.innerHTML\s*=\s*(.*?);/g, "document.getElementById('tab-content').textContent = $1;");

fs.writeFileSync('js/equipo1.js', js, 'utf8');
