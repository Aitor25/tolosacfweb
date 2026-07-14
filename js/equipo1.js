
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

// Firebase inline
const db=window.db || firebase.firestore();

let currentData=null,activeTab='standings',selectedJourney=null;
const competitionId='senior-masculino';

function loadData(){
  db.collection('competitions').doc(competitionId).onSnapshot(doc=>{
    document.getElementById('loading').style.display='none';
    document.getElementById('tab-content').style.display='block';
    if(doc.exists){
      currentData=doc.data();
      const subEl = document.getElementById('competition-name');
      subEl.setAttribute('data-i18n', 'competition.name');
      subEl.setAttribute('data-season', currentData.season || '2026/27');
      renderActiveTab();
    }else{
      document.getElementById('tab-content').textContent = '<div style="text-align:center;padding:4rem;color:var(--text-secondary);"><p style="font-family:Barlow Condensed,sans-serif;font-size:1.2rem;text-transform:uppercase;font-weight:900;" data-i18n="team.noDataTitle">Sin datos disponibles todavía</p><p style="font-size:.85rem;margin-top:.5rem;" data-i18n="team.noDataText">El administrador aún no ha subido datos para esta categoría.</p></div>';
      if(typeof applyTranslations==='function')applyTranslations();
    }
  },err=>{
    document.getElementById('loading').style.display='none';
    document.getElementById('tab-content').style.display='block';
    document.getElementById('tab-content').textContent = `<div style="text-align:center;padding:4rem;color:#f87171;"><p style="font-weight:700;">Error de conexion: ${err.message}</p></div>`;
  });
}

function switchTab(tab){
  activeTab=tab;
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  const btn = event.target.closest('.tab-btn');
  if (btn) btn.classList.add('active');
  renderActiveTab();
}

function renderActiveTab(){
  if(!currentData)return;
  if(activeTab==='standings')renderStandings();
  else if(activeTab==='results')renderResults();
  else renderCalendar();
  feather.replace();
  if(typeof applyTranslations==='function')applyTranslations();
}

function renderStandings(){
  const standings=currentData.standings||[];
  if(!standings.length){
    document.getElementById('tab-content').textContent = '<div style="text-align:center;padding:4rem;opacity:.5;color:var(--text-secondary);"><p style="font-family:Barlow Condensed,sans-serif;font-size:1.2rem;text-transform:uppercase;font-weight:900;" data-i18n="team.tab.standings.empty">Sin clasificación disponible</p></div>';
    return;
  }
  let html=`<div style="overflow-x:auto;border-radius:12px;border:1px solid var(--border);" class="dark-border">
  <table class="standings-table">
  <thead><tr><th style="text-align:center;">Pos</th><th>Equipo</th><th style="text-align:center;">PJ</th><th style="text-align:center;">PG</th><th style="text-align:center;">PE</th><th style="text-align:center;">PP</th><th style="text-align:center;">GF</th><th style="text-align:center;">GC</th><th style="text-align:center;">DG</th><th style="text-align:center;color:var(--accent-bright);">PTS</th></tr></thead>
  <tbody>`;
  standings.forEach(item=>{
    const isTolosa=item.team?.toLowerCase().includes('tolosa');
    const dg=(item.gf||0)-(item.gc||0);
    let posEl=`<span style="font-family:'Barlow Condensed',sans-serif;font-weight:900;">${item.pos}</span>`;
    if(item.pos===1)posEl=`<span class="pos-medal pos-1">${item.pos}</span>`;
    if(item.pos===2)posEl=`<span class="pos-medal pos-2">${item.pos}</span>`;
    if(item.pos===3)posEl=`<span class="pos-medal pos-3">${item.pos}</span>`;
    html+=`<tr class="${isTolosa?'is-tolosa':''}"><td style="text-align:center;">${posEl}</td><td style="font-weight:${isTolosa?'700':'400'};">${item.team}${isTolosa?' <span style="color:var(--accent-bright);font-size:.7rem;">&#9679;</span>':''}</td><td style="text-align:center;">${item.pj||0}</td><td style="text-align:center;color:#22c55e;">${item.pg||0}</td><td style="text-align:center;">${item.pe||0}</td><td style="text-align:center;color:#ef4444;">${item.pp||0}</td><td style="text-align:center;">${item.gf||0}</td><td style="text-align:center;">${item.gc||0}</td><td style="text-align:center;color:${dg>0?'#22c55e':dg<0?'#ef4444':'inherit'}">${dg>0?'+':''}${dg}</td><td style="text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1.15rem;color:var(--accent-bright);">${item.pts||0}</td></tr>`;
  });
  html+=`</tbody></table></div>`;
  document.getElementById('tab-content').innerHTML = html;
}

function getDayOfWeekName(dateStr, lang='es') {
  if (!dateStr || dateStr.toLowerCase().includes('pendiente')) {
    return '';
  }
  const parts = dateStr.split(/[-/]/);
  if (parts.length !== 3) return '';
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  
  const date = new Date(year, month, day);
  if (isNaN(date.getTime())) return '';
  
  const daysEs = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const daysEu = ['Igandea', 'Astelehena', 'Asteartea', 'Asteazkena', 'Osteguna', 'Ostirala', 'Larunbata'];
  
  return lang === 'eu' ? daysEu[date.getDay()] : daysEs[date.getDay()];
}

function renderResults(){
  const results=currentData.results||[];
  if(!results.length){
    document.getElementById('tab-content').textContent = '<div style="text-align:center;padding:4rem;opacity:.5;color:var(--text-secondary);"><p style="font-family:Barlow Condensed,sans-serif;font-size:1.2rem;text-transform:uppercase;font-weight:900;" data-i18n="team.tab.results.empty">Sin resultados disponibles</p></div>';
    return;
  }
  const journeys=[...new Set(results.map(m=>m.journey||1))].sort((a,b)=>a-b);
  if(selectedJourney===null)selectedJourney=journeys[0];

  let html=buildJourneySelector(journeys, selectedJourney);

  const filtered=results.filter(m=>(m.journey||1)==selectedJourney);
  filtered.sort((a,b)=>{
    const aTol=a.home?.toLowerCase().includes('tolosa')||a.away?.toLowerCase().includes('tolosa');
    const bTol=b.home?.toLowerCase().includes('tolosa')||b.away?.toLowerCase().includes('tolosa');
    if(aTol && !bTol) return -1;
    if(!aTol && bTol) return 1;
    return 0;
  });
  filtered.forEach(m=>{
    const isTolosa=m.home?.toLowerCase().includes('tolosa')||m.away?.toLowerCase().includes('tolosa');
    const currentLang = typeof getLang === 'function' ? getLang() : 'es';
    const dayOfWeek = getDayOfWeekName(m.date, currentLang);
    const dateDisplay = dayOfWeek ? `${dayOfWeek}, ${m.date || ''}` : (m.date || '');
    
    const score=m.score||'';
    const parts=score.split('-').map(s=>parseInt(s.trim(),10));
    const isPlayed=parts.length===2&&!isNaN(parts[0])&&!isNaN(parts[1]);
    const displayScore=isPlayed ? score : 'VS';
    
    html+=`<div class="match-card ${isTolosa?'is-tolosa-match':''}">
      <div class="match-header">
        <span class="match-journey">J${m.journey||1}</span>
        <span class="match-header-separator">•</span>
        <span class="match-date" style="font-weight:700;">${dateDisplay} ${m.time && m.time !== 'Pendiente' && m.time !== '0:00' ? `• ${m.time}` : ''}</span>
      </div>
      <div class="match-body">
        <div class="match-team match-home" style="font-weight:${m.home?.toLowerCase().includes('tolosa')?'700':'400'};">${m.home}</div>
        <div class="match-score ${isPlayed?'':'unplayed'}">${displayScore}</div>
        <div class="match-team match-away" style="font-weight:${m.away?.toLowerCase().includes('tolosa')?'700':'400'};">${m.away}</div>
      </div>
      <div class="match-footer" style="opacity:.7;font-size:.78rem;">
        <span><i data-feather="map-pin" style="width:11px;height:11px;display:inline-block;vertical-align:middle;margin-right:.25rem;"></i>${m.venue||''}</span>
      </div>
    </div>`;
  });

  if(!filtered.length)html+=`<div style="text-align:center;padding:3rem;opacity:.5;" data-i18n="fixture.noMatches">Sin partidos en esta jornada</div>`;
  html+=`</div>`;
  document.getElementById('tab-content').innerHTML = html;
}

function buildJourneySelector(journeys, selected){
  // Desktop/tablet: grid de botones
  let desktop=`<div class="journey-selector">`;
  journeys.forEach(j=>{
    desktop+=`<button class="journey-btn ${j==selected?'active':''}" onclick="selectJourney(${j})">J${j}</button>`;
  });
  desktop+=`</div>`;

  // Mobile: navegador prev/next
  const idx=journeys.indexOf(selected);
  const total=journeys.length;
  const prevJ=idx>0?journeys[idx-1]:null;
  const nextJ=idx<total-1?journeys[idx+1]:null;
  const mobile=`<div class="journey-selector-mobile">
    <button class="journey-nav-btn" ${prevJ===null?'disabled':''} onclick="selectJourney(${prevJ})" aria-label="Jornada anterior">&#8249;</button>
    <div class="journey-nav-label">J${selected}<span class="journey-nav-counter">${idx+1} / ${total}</span></div>
    <button class="journey-nav-btn" ${nextJ===null?'disabled':''} onclick="selectJourney(${nextJ})" aria-label="Jornada siguiente">&#8250;</button>
  </div>`;

  return desktop+mobile+`<div style="display:flex;flex-direction:column;gap:1rem;">`;
}

function selectJourney(j){
  selectedJourney=j;
  renderActiveTab();
}

function renderCalendar(){
  const results=currentData.results||[];
  if(!results.length){
    document.getElementById('tab-content').textContent = '<div style="text-align:center;padding:4rem;opacity:.5;color:var(--text-secondary);"><p style="font-family:Barlow Condensed,sans-serif;font-size:1.2rem;text-transform:uppercase;font-weight:900;" data-i18n="team.tab.calendar.empty">Sin partidos en el calendario</p></div>';
    return;
  }
  
  const journeys=[...new Set(results.map(m=>m.journey||1))].sort((a,b)=>a-b);
  if(selectedJourney===null)selectedJourney=journeys[0];

  let html=buildJourneySelector(journeys, selectedJourney);

  const filtered=results.filter(m=>(m.journey||1)==selectedJourney);
  filtered.sort((a,b)=>{
    const aTol=a.home?.toLowerCase().includes('tolosa')||a.away?.toLowerCase().includes('tolosa');
    const bTol=b.home?.toLowerCase().includes('tolosa')||b.away?.toLowerCase().includes('tolosa');
    if(aTol && !bTol) return -1;
    if(!aTol && bTol) return 1;
    return 0;
  });
  
  filtered.forEach(m=>{
    const isTolosa=m.home?.toLowerCase().includes('tolosa')||m.away?.toLowerCase().includes('tolosa');
    const score=m.score||'';
    const parts=score.split('-').map(s=>parseInt(s.trim(),10));
    const isPlayed=parts.length===2&&!isNaN(parts[0])&&!isNaN(parts[1]);
    const displayScore=isPlayed ? score : 'VS';
    
    const currentLang = typeof getLang === 'function' ? getLang() : 'es';
    const dayOfWeek = getDayOfWeekName(m.date, currentLang);
    const dateDisplay = dayOfWeek ? `${dayOfWeek}, ${m.date || ''}` : (m.date || '');
    
    html+=`<div class="match-card ${isTolosa?'is-tolosa-match':''}">
      <div class="match-header">
        <span class="match-journey">J${m.journey||1}</span>
        <span class="match-header-separator">•</span>
        <span class="match-date" style="font-weight:700;">${dateDisplay} ${m.time && m.time !== 'Pendiente' && m.time !== '0:00' ? `• ${m.time}` : ''}</span>
      </div>
      <div class="match-body">
        <div class="match-team match-home" style="font-weight:${m.home?.toLowerCase().includes('tolosa')?'700':'400'};">${m.home}</div>
        <div class="match-score ${isPlayed?'':'unplayed'}">${displayScore}</div>
        <div class="match-team match-away" style="font-weight:${m.away?.toLowerCase().includes('tolosa')?'700':'400'};">${m.away}</div>
      </div>
      <div class="match-footer" style="opacity:.7;font-size:.78rem;">
        <span><i data-feather="map-pin" style="width:11px;height:11px;display:inline-block;vertical-align:middle;margin-right:.25rem;"></i>${m.venue||''}</span>
      </div>
    </div>`;
  });
  
  if(!filtered.length)html+=`<div style="text-align:center;padding:3rem;opacity:.5;" data-i18n="fixture.noMatches">Sin partidos en esta jornada</div>`;
  html+=`</div>`;
  document.getElementById('tab-content').innerHTML = html;
}

document.addEventListener('DOMContentLoaded',()=>{
  loadData();
});