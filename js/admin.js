// ── FIREBASE ──
const auth=firebase.auth(), db=window.db || firebase.firestore();

// --- DOM HELPERS ---

async function uploadImageToStorage(fileInputId, progressId, folder) {
  const fileInput = document.getElementById(fileInputId);
  const file = fileInput?.files[0];
  if (!file) return null;
  if (!window.storage) {
    toast('Firebase Storage no está inicializado. Revisa firebase-config.js', 'error');
    return null;
  }
  const progressDiv = document.getElementById(progressId);
  if(progressDiv) progressDiv.style.display = 'block';
  try {
    const ext = file.name.split('.').pop();
    const filename = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2,8)}.${ext}`;
    const ref = window.storage.ref().child(filename);
    await ref.put(file);
    const url = await ref.getDownloadURL();
    if(progressDiv) progressDiv.style.display = 'none';
    return url;
  } catch(e) {
    if(progressDiv) progressDiv.style.display = 'none';
    toast('Error subiendo imagen: ' + e.message, 'error');
    throw e;
  }
}

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

// --- AUTO LOGOUT & TIMEOUTS ---
let logoutTimer;
function resetLogoutTimer() {
  clearTimeout(logoutTimer);
  // 30 mins = 1800000 ms
  logoutTimer = setTimeout(() => {
    if (auth && auth.currentUser) {
      auth.signOut();
      alert('Sesión cerrada por inactividad.');
    }
  }, 1800000);
}
['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(evt => 
  document.addEventListener(evt, resetLogoutTimer, { passive: true })
);
resetLogoutTimer();

// ── LEVENSHTEIN — solo para comparar, nunca para guardar ──
function levenshtein(a,b){
  const m=a.length,n=b.length;
  const dp=Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i===0?j:j===0?i:0));
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++)
    dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[m][n];
}
function similarity(a,b){
  const maxLen=Math.max(a.length,b.length);
  if(maxLen===0)return 1;
  return(maxLen-levenshtein(a,b))/maxLen;
}

// ── ADMIN LOGIC ──
const AdminLogic={
  config:{pointsWin:2,pointsDraw:1,pointsLoss:0},

  // ─────────────────────────────────────────────────────────────────────
  // parseJourneyText: extrae partidos del texto pegado.
  //
  // REGLA DE NOMBRES:
  //   - home / away se guardan con el nombre ORIGINAL del texto (trimmed).
  //   - normalizeTeamName() NO se aplica aquí. Solo se usa en:
  //       · getMatchKey()  → deduplicación interna (no guarda nada)
  //       · findSimilarMaster() → comparación con lista maestra (no guarda nada)
  // ─────────────────────────────────────────────────────────────────────
  parseJourneyText(text,journeyNumber=1){
    const lines=text.split('\n').map(l=>l.trim()).filter(l=>l.length>0);
    const matches=[];let currentJourney=journeyNumber,currentDate='',currentTime='',currentVenue='';
    for(let i=0;i<lines.length;i++){
      const line=lines[i];
      const jM=line.match(/jornada\s*(\d+)/i);if(jM){currentJourney=parseInt(jM[1]);continue;}
      if(line.match(/\d{2}\/\d{2}\/\d{4}/)){currentDate=line.match(/\d{2}\/\d{2}\/\d{4}/)[0];continue;}
      if(line.match(/^\d{2}:\d{2}$/)){currentTime=line;if(lines[i+1]&&!lines[i+1].includes('-')&&!lines[i+1].match(/acta/i)){currentVenue=lines[i+1];i++;}continue;}
      if(line.match(/^\d+\s*[-\u2013]\s*\d+$/) || line.toLowerCase() === 'vs' || line === '-' || line === '\u2013'){
        const score=(line.match(/^\d+\s*[-\u2013]\s*\d+$/)) ? line.replace('\u2013','-') : 'vs';
        let hIdx=i-1;while(hIdx>=0&&(lines[hIdx].match(/acta/i)||lines[hIdx].match(/\d{2}\/\d{2}\/\d{4}/)||lines[hIdx].match(/^\d{2}:\d{2}$/))){hIdx--;}
        const teamHome=lines[hIdx]||'Equipo Local';
        let aIdx=i+1;while(aIdx<lines.length&&(lines[aIdx].match(/acta/i)||!lines[aIdx].trim())){aIdx++;}
        const teamAway=lines[aIdx]||'Equipo Visitante';
        matches.push({
          journey:parseInt(currentJourney),
          date:currentDate||'Pendiente',
          time:currentTime||'Pendiente',
          venue:currentVenue||'Pabellon',
          // ✅ Nombre original completo — NO se normaliza aquí
          home: teamHome.trim(),
          away: teamAway.trim(),
          score,
          status: score === 'vs' ? 'Programado' : 'Finalizado'
        });
      }
    }
    return matches;
  },

  parseStandingsTable(text){
    const lines=text.split('\n').map(l=>l.trim()).filter(l=>l.length>0);
    const standings=[];
    lines.forEach(line=>{
      const parts=line.split(/\t|\s{2,}/);
      if(parts.length>=8){const pos=parseInt(parts[0]);const pts=parseInt(parts[parts.length-1]);const pj=parseInt(parts[2]);
      // ✅ Nombre original completo desde el texto pegado
      if(!isNaN(pos)&&parts[1])standings.push({pos,team:parts[1].trim(),pj,pg:parseInt(parts[3])||0,pe:parseInt(parts[4])||0,pp:parseInt(parts[5])||0,gf:parseInt(parts[6])||0,gc:parseInt(parts[7])||0,pts});}
    });
    return standings.sort((a,b)=>a.pos-b.pos);
  },

  parseCalendarText(text){
    try {
      const lines=text.split('\n').map(l=>l.trim()).filter(l=>l.length>0);
      const matches=[];let currentJourney=1,currentDate='';
      const teamsSet=new Set();
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        const journeyMatch = line.match(/JORNADA\s*(\d+)(?:\s*\(([^)]+)\))?/i);
        if (journeyMatch) {
          currentJourney = parseInt(journeyMatch[1], 10);
          currentDate = journeyMatch[2] ? journeyMatch[2].trim() : 'Pendiente';
          continue;
        }
        
        if (line.toUpperCase().startsWith('VS')) {
          const home    = lines[i + 1] || '';
          const away    = lines[i + 3] || '';
          const rawScore= lines[i + 7] || '';
          const rawTime = lines[i + 8] || '';
          const venue   = lines[i + 9] || '';
          
          let score = 'vs';
          let time = 'Pendiente';
          if (rawScore && rawScore !== '0 - 0' && rawScore !== '0-0') {
            score = rawScore.replace(/\s+/g, '');
          }
          if (rawTime && rawTime !== '0:00') {
            time = rawTime;
          }
          
          if (home) teamsSet.add(home.trim());
          if (away) teamsSet.add(away.trim());
          
          matches.push({
            journey: currentJourney,
            date: currentDate,
            time: time,
            home: home.trim() || 'Equipo Local',
            away: away.trim() || 'Equipo Visitante',
            score: score,
            venue: venue.trim() || 'Pabellon',
            status: score === 'vs' ? 'Programado' : 'Finalizado'
          });
          
          i += 9;
        }
      }
      
      return { matches, teams: Array.from(teamsSet).sort() };
    } catch(e) {
      console.error('[parseCalendarText] Error al parsear el texto del calendario:', e);
      return { matches: [], teams: [] };
    }
  },

  // normalizeTeamName: SOLO para comparaciones internas.
  // NUNCA usar el valor devuelto para guardar en Firestore.
  normalizeTeamName(name){
    if(!name)return'';
    return name.toUpperCase()
      .replace(/\./g,'')
      .replace(/\s+/g,' ')
      .trim();
  },

  getMatchKey(match){
    // Solo para deduplicación interna — no guarda nada
    return`${match.journey}-${this.normalizeTeamName(match.home)}-${this.normalizeTeamName(match.away)}`;
  },

  calculateStandings(allResults, masterTeams=[]){
    const teams={};
    if (masterTeams && masterTeams.length) {
      masterTeams.forEach(t => {
        teams[t] = this.createNewTeamEntry(t);
      });
    }
    allResults.forEach(m=>{
      if(!m.score)return;
      const parts=m.score.split('-').map(g=>g.trim());
      if(parts.length!==2)return;
      const gHome=parseInt(parts[0],10);
      const gAway=parseInt(parts[1],10);
      if(isNaN(gHome)||isNaN(gAway))return; // Ignorar partidos no jugados o sin marcador numérico en la tabla de clasificación
      
      if(!teams[m.home])teams[m.home]=this.createNewTeamEntry(m.home);
      if(!teams[m.away])teams[m.away]=this.createNewTeamEntry(m.away);
      const tH=teams[m.home],tA=teams[m.away];
      tH.pj++;tA.pj++;tH.gf+=gHome;tH.gc+=gAway;tA.gf+=gAway;tA.gc+=gHome;
      if(gHome>gAway){tH.pg++;tH.pts+=this.config.pointsWin;tA.pp++;tA.pts+=this.config.pointsLoss;}
      else if(gHome<gAway){tA.pg++;tA.pts+=this.config.pointsWin;tH.pp++;tH.pts+=this.config.pointsLoss;}
      else{tH.pe++;tH.pts+=this.config.pointsDraw;tA.pe++;tA.pts+=this.config.pointsDraw;}
    });
    return Object.values(teams).sort((a,b)=>{if(b.pts!==a.pts)return b.pts-a.pts;const dA=a.gf-a.gc,dB=b.gf-b.gc;if(dB!==dA)return dB-dA;return a.team.localeCompare(b.team);}).map((t,i)=>({...t,pos:i+1}));
  },

  createNewTeamEntry(name){return{team:name,pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0};},

  mergeResults(oldResults,newResults){
    if(!newResults||newResults.length===0)return oldResults||[];
    const journeysToReplace=new Set(newResults.map(m=>Number(m.journey||1)));
    const filtered=(oldResults||[]).filter(m=>!journeysToReplace.has(Number(m.journey||1)));
    return[...filtered,...newResults].sort((a,b)=>a.journey-b.journey);
  },

  generateCategoryData(name,competition,season,results,standings,teams){
    return{name,competition,season,lastUpdate:new Date().toISOString(),results,standings,teams:teams||[]};
  }
};

// ── TOAST ──
function toast(msg,type='info'){
  const el=document.createElement('div');el.className=`toast toast-${type}`;
  const icons={success:'check-circle',error:'alert-circle',info:'info',warning:'alert-triangle'};
  el.innerHTML=`<i data-feather="${icons[type]||'info'}" style="width:16px;height:16px;flex-shrink:0;"></i> ${msg}`;
  document.getElementById('toast-container').appendChild(el);feather.replace();
  setTimeout(()=>{el.style.opacity='0';el.style.transform='translateX(100%)';el.style.transition='all .3s';setTimeout(()=>el.remove(),300);},4000);
}

const sectionTitles={dashboard:'Dashboard',noticias:'Noticias',imagenes:'Imagenes',resultados:'Resultados',clasificacion:'Clasificacion',equipos:'Equipos',jugadores:'Jugadores',patrocinadores:'Patrocinadores'};

function showSection(name){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('section-'+name)?.classList.add('active');
  document.querySelector(`[data-section="${name}"]`)?.classList.add('active');
  document.getElementById('page-title').textContent=sectionTitles[name]||name;
  if(name==='noticias')loadNewsList();
  if(name==='resultados')loadCompetitionData();
  if(name==='clasificacion')loadStandings();
  if(name==='equipos')loadTeams();
  if(name==='jugadores'){loadPlayers();loadStaffAdmin();}
  if(name==='patrocinadores')loadSponsors();
  if(name==='imagenes')renderImageGallery();
  closeSidebar();
}

function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open');document.getElementById('sidebar-overlay').classList.toggle('visible');}
function closeSidebar(){document.getElementById('sidebar').classList.remove('open');document.getElementById('sidebar-overlay').classList.remove('visible');}

// ── AUTH ──
auth.onAuthStateChanged(user=>{
  if(user){
    document.getElementById('login-screen').style.display='none';
    document.getElementById('app').classList.add('visible');
    document.getElementById('user-avatar').textContent=user.email.slice(0,2).toUpperCase();
    document.getElementById('user-email-display').textContent=user.email;
    loadDashboardStats();
  }else{
    document.getElementById('login-screen').style.display='flex';
    document.getElementById('app').classList.remove('visible');
  }
});

async function doLogin(){
  const email=document.getElementById('login-email').value,pass=document.getElementById('login-pass').value;
  const btn=document.getElementById('login-btn'),err=document.getElementById('login-error');
  if(!email||!pass)return;
  btn.innerHTML='<div class="spinner"></div>';btn.disabled=true;err.style.display='none';
  try{await auth.signInWithEmailAndPassword(email,pass);}
  catch(e){
    err.textContent = e.code === 'auth/too-many-requests' ? 'Demasiados intentos. Inténtalo más tarde.' : 'Email o contraseña incorrectos.';
    err.style.display='block';
  }finally{btn.innerHTML='<i data-feather="log-in"></i> Entrar';btn.disabled=false;feather.replace();}
}

async function doGoogleLogin(){
  const btn=document.getElementById('google-login-btn'),err=document.getElementById('login-error');
  btn.innerHTML='<div class="spinner"></div>';btn.disabled=true;err.style.display='none';
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
  } catch(e) {
    err.textContent = 'Error: ' + e.message;
    err.style.display='block';
  } finally {
    btn.innerHTML='<svg style="width:18px;height:18px;margin-right:8px;" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> Iniciar sesión con Google';
    btn.disabled=false;
  }
}


async function doResetPassword(){
  const email=document.getElementById('login-email').value;
  if(!email){alert('Introduce tu email primero.');return;}
  await auth.sendPasswordResetEmail(email);toast('Email de recuperación enviado.','success');
}
function doLogout(){auth.signOut();}

document.addEventListener('DOMContentLoaded',()=>{
  feather.replace();
  document.getElementById('login-pass')?.addEventListener('keydown',e=>{if(e.key==='Enter')doLogin();});
});

// ── DASHBOARD ──
async function loadDashboardStats(){
  try{
    const[news,players,sponsors]=await Promise.all([db.collection('news').get(),db.collection('players').get(),db.collection('sponsors').get()]);
    document.getElementById('stat-noticias').textContent=news.size;
    document.getElementById('stat-jugadores').textContent=players.size;
    document.getElementById('stat-patrocinadores').textContent=sponsors.size;
    let totalPartidos=0;
    try{const c=await db.collection('competitions').doc('senior-masculino').get();if(c.exists)totalPartidos=(c.data().results||[]).length;}catch(e){}
    document.getElementById('stat-resultados').textContent=totalPartidos;
    const recentNews=news.docs.sort((a,b)=>(b.data().timestamp?.seconds||0)-(a.data().timestamp?.seconds||0)).slice(0,5);
    document.getElementById('dashboard-recent-news').innerHTML=recentNews.length
      ?recentNews.map(d=>`<div style="padding:.6rem 0;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;justify-content:space-between;align-items:center;"><span style="font-weight:600;font-size:.82rem;color:rgba(255,255,255,0.8);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;margin-right:.5rem;">${d.data().title}</span><span class="badge badge-blue">${d.data().tag||'CLUB'}</span></div>`).join('')
      :'<div style="color:rgba(255,255,255,0.3);font-size:.82rem;text-align:center;padding:1rem;">Sin noticias todavía</div>';
  }catch(e){console.error(e);}
}

// ── NOTICIAS ──
function updateNewsPreview(){
  document.getElementById('preview-title').textContent=document.getElementById('news-title').value||'Título de la noticia';
  document.getElementById('preview-tag').textContent=document.getElementById('news-tag').value||'CLUB';
  document.getElementById('preview-summary').textContent=document.getElementById('news-summary').value||'El resumen aparecerá aquí...';
  const image=document.getElementById('news-image').value,wrap=document.getElementById('preview-img-wrap');
  if(image&&wrap){
    if(wrap.tagName==='IMG'){wrap.src=image;}
    else{const img=document.createElement('img');img.id='preview-img-wrap';img.className='news-preview-img';img.src=image;img.onerror=()=>{img.outerHTML='<div id="preview-img-wrap" class="news-preview-img-placeholder"><i data-feather="image" style="width:32px;height:32px;"></i></div>';feather.replace();};wrap.replaceWith(img);}
  }
}
async function loadNewsList(){
  const container=document.getElementById('news-list');
  container.innerHTML='<div style="text-align:center;padding:1.5rem;"><div class="spinner" style="margin:0 auto;"></div></div>';
  try{
    const snap=await db.collection('news').orderBy('timestamp','desc').get();
    if(snap.empty){container.innerHTML='<div style="text-align:center;padding:2rem;color:rgba(255,255,255,0.3);font-size:.82rem;">No hay noticias publicadas</div>';return;}
    
    container.innerHTML = '';
    snap.docs.forEach(doc => {
      const d = doc.data();
      const div = document.createElement('div');
      div.style.cssText = "display:flex;justify-content:space-between;align-items:center;padding:1rem;background:rgba(255,255,255,0.03);border-radius:8px;margin-bottom:.5rem;";
      
      const infoDiv = document.createElement('div');
      const titleDiv = document.createElement('div'); titleDiv.style.cssText = "font-weight:700;color:white;margin-bottom:.25rem;"; titleDiv.textContent = d.title;
      const metaDiv = document.createElement('div'); metaDiv.style.cssText = "font-size:.8rem;color:rgba(255,255,255,0.4);display:flex;gap:1rem;";
      
      const dateSpan = document.createElement('span');
      const dVal = d.timestamp ? new Date(d.timestamp.seconds * 1000).toLocaleDateString() : '';
      dateSpan.textContent = dVal;
      
      const tagSpan = document.createElement('span');
      tagSpan.className = "badge badge-blue"; tagSpan.textContent = d.tag || '';
      
      metaDiv.appendChild(dateSpan); metaDiv.appendChild(tagSpan);
      infoDiv.appendChild(titleDiv); infoDiv.appendChild(metaDiv);
      
      const actionDiv = document.createElement('div'); actionDiv.style.cssText = "display:flex;gap:.5rem;";
      const btnEdit = document.createElement('button'); btnEdit.className = "btn btn-ghost btn-sm"; btnEdit.onclick = () => editNews(doc.id);
      const iconEdit = document.createElement('i'); iconEdit.setAttribute('data-feather', 'edit-2'); btnEdit.appendChild(iconEdit);
      const btnDelete = document.createElement('button'); btnDelete.className = "btn btn-danger btn-sm"; btnDelete.onclick = () => deleteNews(doc.id);
      const iconDelete = document.createElement('i'); iconDelete.setAttribute('data-feather', 'trash-2'); btnDelete.appendChild(iconDelete);
      
      actionDiv.appendChild(btnEdit); actionDiv.appendChild(btnDelete);
      div.appendChild(infoDiv); div.appendChild(actionDiv);
      container.appendChild(div);
    });

    feather.replace();
  }catch(e){container.innerHTML=`<div style="color:#f87171;font-size:.8rem;padding:1rem;">Error: ${e.message}</div>`;}
}
async function saveNews(){
  const title=document.getElementById('news-title').value?.trim(),content=document.getElementById('news-content').value?.trim();
  if(!title||!content){toast('Título y contenido son obligatorios','error');return;}
  const btn=document.getElementById('news-save-btn');btn.innerHTML='<div class="spinner"></div>';btn.disabled=true;
  try {
    let imageUrl = document.getElementById('news-image').value;
    const uploadedUrl = await uploadImageToStorage('news-image-file', 'news-upload-progress', 'news');
    if (uploadedUrl) imageUrl = uploadedUrl;
    
    const data={title,date:document.getElementById('news-date').value,tag:document.getElementById('news-tag').value,image:imageUrl,summary:document.getElementById('news-summary').value,content,timestamp:firebase.firestore.FieldValue.serverTimestamp()};
    const editId=document.getElementById('news-edit-id').value;
    
    if(editId)await db.collection('news').doc(editId).update(data);else await db.collection('news').add(data);
    toast(editId?'Noticia actualizada':'Noticia publicada','success');clearNewsForm();loadNewsList();loadDashboardStats();
  } catch(e) {
    toast('Error: '+e.message,'error');
  } finally {
    btn.innerHTML='<i data-feather="send"></i> Publicar';btn.disabled=false;feather.replace();
  }
}
async function editNews(id){
  const doc=await db.collection('news').doc(id).get();if(!doc.exists)return;
  const n=doc.data();
  document.getElementById('news-edit-id').value=id;document.getElementById('news-title').value=n.title||'';document.getElementById('news-date').value=n.date||'';document.getElementById('news-tag').value=n.tag||'';document.getElementById('news-image').value=n.image||'';document.getElementById('news-summary').value=n.summary||'';document.getElementById('news-content').value=n.content||'';
  document.getElementById('news-form-title').textContent='Editar noticia';document.getElementById('news-save-btn').innerHTML='<i data-feather="save"></i> Actualizar';
  feather.replace();updateNewsPreview();
}
async function deleteNews(id){
  if(!confirm('Eliminar esta noticia?'))return;
  await db.collection('news').doc(id).delete();toast('Noticia eliminada','success');loadNewsList();loadDashboardStats();
}
function clearNewsForm(){
  ['news-edit-id','news-title','news-date','news-tag','news-image','news-summary','news-content','news-image-file'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  const lbl=document.getElementById('news-image-filename');if(lbl)lbl.textContent='';
  document.getElementById('news-form-title').textContent='Nueva noticia';document.getElementById('news-save-btn').innerHTML='<i data-feather="send"></i> Publicar';
  feather.replace();updateNewsPreview();
}

// ── COMPETICIONES ──
let currentDBData=null, compMode='journey';

function setCompMode(mode){
  compMode=mode;
  const jBtn=document.getElementById('mode-journey'),sBtn=document.getElementById('mode-standings'),cBtn=document.getElementById('mode-calendar'),jGrp=document.getElementById('journey-num-group');
  if(mode==='journey'){
    jBtn.className='btn btn-primary btn-sm';sBtn.className='btn btn-ghost btn-sm';cBtn.className='btn btn-ghost btn-sm';
    jGrp.style.display='block';
    document.getElementById('raw-input').placeholder='Pega los partidos de la jornada...';
  } else if(mode==='standings') {
    sBtn.className='btn btn-primary btn-sm';jBtn.className='btn btn-ghost btn-sm';cBtn.className='btn btn-ghost btn-sm';
    jGrp.style.display='none';
    document.getElementById('raw-input').placeholder='Pega la tabla de clasificación (Pos Equipo PJ PG PE PP GF GC Pts)...';
  } else {
    cBtn.className='btn btn-primary btn-sm';jBtn.className='btn btn-ghost btn-sm';sBtn.className='btn btn-ghost btn-sm';
    jGrp.style.display='none';
    document.getElementById('raw-input').placeholder='Pega el calendario completo de todas las jornadas...';
  }
}

async function loadCompetitionData(){
  const catId=document.getElementById('comp-category').value;
  try{
    const doc=await db.collection('competitions').doc(catId).get();
    currentDBData=doc.exists?doc.data():{name:catId,competition:'Pendiente',season:'2025/26',results:[],standings:[],teams:[]};
    if(!currentDBData.teams)currentDBData.teams=[];
    
    document.getElementById('comp-competition-name').value = currentDBData.competition || '';
    document.getElementById('comp-season-name').value = currentDBData.season || '';
    
    renderResultsTable(currentDBData.results||[]);
    renderMasterTeams(currentDBData.teams||[]);
  }catch(e){toast('Error cargando datos: '+e.message,'error');}
}

// ── LISTA MAESTRA DE EQUIPOS ──
function renderMasterTeams(teams){
  const el=document.getElementById('master-teams-list');
  if(!teams.length){
    el.innerHTML='<span style="color:rgba(255,255,255,0.25);font-size:.8rem;">Sin equipos registrados. Añade los nombres oficiales de los equipos de la competición.</span>';
    return;
  }
  el.innerHTML=teams.map((t,i)=>`
    <div style="display:inline-flex;align-items:center;gap:.4rem;background:rgba(18,85,201,0.12);border:1px solid rgba(18,85,201,0.25);border-radius:20px;padding:.25rem .75rem .25rem .65rem;font-size:.8rem;color:rgba(255,255,255,0.85);">
      ${t}
      <button onclick="removeMasterTeam(${i})" style="background:none;border:none;color:rgba(255,255,255,0.35);cursor:pointer;padding:0;display:flex;align-items:center;" title="Eliminar"><i data-feather="x" style="width:12px;height:12px;"></i></button>
    </div>
  `).join('');
  feather.replace();
}

function openAddTeamModal(){document.getElementById('new-master-team').value='';document.getElementById('add-team-modal').style.display='flex';setTimeout(()=>document.getElementById('new-master-team').focus(),100);}

async function addMasterTeam(){
  const name=document.getElementById('new-master-team').value.trim();
  if(!name){toast('Introduce un nombre','error');return;}
  if(!currentDBData){toast('Carga primero la categoría','error');return;}
  const teams=[...(currentDBData.teams||[])];
  if(teams.includes(name)){toast('Ese equipo ya existe en la lista','error');return;}
  teams.push(name);
  const catId=document.getElementById('comp-category').value;
  try{
    await db.collection('competitions').doc(catId).update({teams});
    currentDBData.teams=teams;
    renderMasterTeams(teams);
    document.getElementById('add-team-modal').style.display='none';
    toast(`"${name}" añadido a la lista maestra`,'success');
  }catch(e){toast('Error: '+e.message,'error');}
}

async function removeMasterTeam(idx){
  if(!currentDBData)return;
  const name=currentDBData.teams[idx];
  if(!confirm(`¿Eliminar "${name}" de la lista maestra?\n\nEsto no borra sus resultados, solo el nombre oficial de la lista.`))return;
  const teams=[...(currentDBData.teams||[])].filter((_,i)=>i!==idx);
  const catId=document.getElementById('comp-category').value;
  try{
    await db.collection('competitions').doc(catId).update({teams});
    currentDBData.teams=teams;
    renderMasterTeams(teams);
    toast(`"${name}" eliminado de la lista`,'success');
  }catch(e){toast('Error: '+e.message,'error');}
}

// ── DETECCIÓN DE DUPLICADOS ──
// Compara con normalizeTeamName (solo mayúsculas+espacios) para detectar parecidos.
// El nombre que se GUARDA es siempre el nombre oficial de la lista maestra.
const SIM_THRESHOLD = 0.75;

function findSimilarMaster(rawName, masterTeams){
  // Comparamos versiones normalizadas, pero devolvemos el nombre oficial original
  const normRaw = AdminLogic.normalizeTeamName(rawName);
  let best=null, bestSim=0;
  for(const t of masterTeams){
    const normMaster = AdminLogic.normalizeTeamName(t);
    const sim = similarity(normRaw, normMaster);
    if(sim>bestSim){bestSim=sim;best=t;}
  }
  // Solo avisar si no es coincidencia exacta (normalizada) con algún maestro
  const exactNormMatch = masterTeams.some(t => AdminLogic.normalizeTeamName(t) === normRaw);
  return (!exactNormMatch && bestSim>=SIM_THRESHOLD && best) ? {match:best, sim:bestSim} : null;
}

let _dupPendingMatches=null, _dupPendingAllResults=null, _dupPendingStandings=null;

function checkDuplicatesAndProceed(matches, allResults, standings){
  const masterTeams=currentDBData.teams||[];
  if(!masterTeams.length){
    _finalizeSave(matches, allResults, standings, []);
    return;
  }

  const allNames=[...new Set(matches.flatMap(m=>[m.home,m.away]))];
  const suspectRows=[];
  for(const name of allNames){
    // Coincidencia exacta de string → no avisar
    if(masterTeams.includes(name))continue;
    const found=findSimilarMaster(name, masterTeams);
    if(found)suspectRows.push({detected:name, suggested:found.match, sim:found.sim});
  }

  if(!suspectRows.length){
    _finalizeSave(matches, allResults, standings, []);
    return;
  }

  _dupPendingMatches=matches;
  _dupPendingAllResults=allResults;
  _dupPendingStandings=standings;
  showDupModal(suspectRows, masterTeams);
}

function showDupModal(rows, masterTeams){
  const container=document.getElementById('dup-rows');
  container.innerHTML=rows.map((r,i)=>{
    const opts=masterTeams.map(t=>`<option value="${t}" ${t===r.suggested?'selected':''}>${t}</option>`).join('');
    return`<div class="team-map-row" data-detected="${r.detected}">
      <span class="team-map-detected" title="${Math.round(r.sim*100)}% similar">⚠️ ${r.detected}</span>
      <span class="team-map-arrow">→ usar:</span>
      <select class="team-map-select" data-idx="${i}">${opts}<option value="__keep__">[Conservar tal cual]</option></select>
    </div>`;
  }).join('');
  feather.replace();
  document.getElementById('dup-modal').style.display='flex';
}

function closeDupModal(){
  document.getElementById('dup-modal').style.display='none';
  _dupPendingMatches=null;
  toast('Importación cancelada','info');
}

function applyDupMappings(){
  if(!_dupPendingMatches)return;
  const selects=document.querySelectorAll('.team-map-select');
  const mapping={};
  selects.forEach(sel=>{
    const detected=sel.closest('[data-detected]').dataset.detected;
    const chosen=sel.value;
    // __keep__ = conservar el nombre original tal cual (sin reemplazar)
    if(chosen!=='__keep__')mapping[detected]=chosen;
  });

  // Aplicar mapeo: sustituir nombre detectado → nombre oficial elegido
  function applyMap(name){return mapping[name]||name;}
  const fixedMatches=_dupPendingMatches.map(m=>({...m,home:applyMap(m.home),away:applyMap(m.away)}));
  const fixedAllResults=_dupPendingAllResults.map(m=>({...m,home:applyMap(m.home),away:applyMap(m.away)}));
  const fixedStandings=AdminLogic.calculateStandings(fixedAllResults, currentDBData.teams);

  document.getElementById('dup-modal').style.display='none';
  const applied=Object.keys(mapping);
  _finalizeSave(fixedMatches, fixedAllResults, fixedStandings, applied);
}

function _finalizeSave(matches, allResults, standings, mappingsApplied){
  if(mappingsApplied.length) toast(`Nombres corregidos: ${mappingsApplied.join(', ')}`, 'success');
  displayPreview(matches, standings, allResults);
}

// ── TABLA RESULTADOS ──
function renderResultsTable(results){
  const tbody=document.getElementById('results-tbody');
  if(!results.length){
    tbody.innerHTML='<tr><td colspan="6" style="text-align:center;color:rgba(255,255,255,0.3);">Sin resultados</td></tr>';
    return;
  }
  const journeys=[...new Set(results.map(r=>r.journey))].sort((a,b)=>a-b);
  const filterSelect=document.getElementById('filter-journey');
  const currentVal=filterSelect.value;
  filterSelect.innerHTML='<option value="">Todas las jornadas</option>'+journeys.map(j=>`<option value="${j}" ${currentVal==j?'selected':''}>Jornada ${j}</option>`).join('');
  tbody.innerHTML=results.map((m,idx)=>
    `<tr>
      <td><span class="badge badge-blue">J${m.journey}</span></td>
      <td style="font-weight:600;color:white;">${m.home}</td>
      <td style="text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1rem;color:var(--accent-bright);">${m.score}</td>
      <td style="font-weight:600;color:white;">${m.away}</td>
      <td style="color:rgba(255,255,255,0.4);font-size:.78rem;">${m.date||''} ${m.time||''}</td>
      <td style="text-align:center;">
        <button onclick="openEditMatchModal(${idx})" class="btn btn-ghost btn-sm" style="background:none;border:none;color:var(--accent-bright);margin-right:.25rem;" title="Editar"><i data-feather="edit-2" style="width:14px;height:14px;"></i></button>
        <button onclick="deleteMatch(${idx})" class="btn btn-danger btn-sm" title="Borrar este partido"><i data-feather="trash-2" style="width:14px;height:14px;"></i></button>
      </td>
    </tr>`
  ).join('');
  feather.replace();
}

function filterResults(){
  if(!currentDBData)return;
  const j=document.getElementById('filter-journey').value;
  const results=j?(currentDBData.results||[]).filter(r=>r.journey==j):(currentDBData.results||[]);
  const tbody=document.getElementById('results-tbody');
  if(!results.length){
    tbody.innerHTML='<tr><td colspan="6" style="text-align:center;color:rgba(255,255,255,0.3);">Sin resultados para esta jornada</td></tr>';
    return;
  }
  const allResults=currentDBData.results||[];
  
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

  feather.replace();
}

// ── BORRAR PARTIDO INDIVIDUAL ──
async function deleteMatch(idx){
  if(!currentDBData)return;
  const allResults=currentDBData.results||[];
  const m=allResults[idx];
  if(!m){toast('Partido no encontrado','error');return;}
  if(!confirm(`¿Borrar el partido:\n${m.home} ${m.score} ${m.away} (J${m.journey})?\n\nSe recalculará la clasificación automáticamente.`))return;
  const newResults=allResults.filter((_,i)=>i!==idx);
  const newStandings=AdminLogic.calculateStandings(newResults, currentDBData.teams);
  const catId=document.getElementById('comp-category').value;
  try{
    await db.collection('competitions').doc(catId).set(
      AdminLogic.generateCategoryData(currentDBData.name,currentDBData.competition,currentDBData.season,newResults,newStandings,currentDBData.teams)
    );
    currentDBData.results=newResults;
    currentDBData.standings=newStandings;
    toast('Partido borrado. Clasificación recalculada.','success');
    renderResultsTable(newResults);
    const j=document.getElementById('filter-journey').value;
    if(j)filterResults();
  }catch(e){toast('Error: '+e.message,'error');}
}

// ── BORRAR JORNADA COMPLETA ──
async function deleteFilteredJourney(){
  const j=document.getElementById('filter-journey').value;
  if(!j){toast('Selecciona una jornada en el filtro primero','error');return;}
  if(!currentDBData)return;
  if(!confirm(`¿Borrar COMPLETAMENTE la Jornada ${j} y todos sus partidos?\n\nSe recalculará la clasificación.`))return;
  const newResults=(currentDBData.results||[]).filter(m=>String(m.journey)!==String(j));
  const newStandings=AdminLogic.calculateStandings(newResults, currentDBData.teams);
  const catId=document.getElementById('comp-category').value;
  try{
    await db.collection('competitions').doc(catId).set(
      AdminLogic.generateCategoryData(currentDBData.name,currentDBData.competition,currentDBData.season,newResults,newStandings,currentDBData.teams)
    );
    currentDBData.results=newResults;
    currentDBData.standings=newStandings;
    toast(`Jornada ${j} eliminada. Clasificación recalculada.`,'success');
    document.getElementById('filter-journey').value='';
    renderResultsTable(newResults);
  }catch(e){toast('Error: '+e.message,'error');}
}

// ── PROCESAR INPUT ──
function processInput(){
  const text=document.getElementById('raw-input').value;
  const journeyNum=parseInt(document.getElementById('journey-number').value);
  if(!text.trim())return;
  if(!currentDBData){toast('Carga primero los datos de la categoría','error');return;}
  if(compMode==='journey'){
    const newMatches=AdminLogic.parseJourneyText(text,journeyNum);
    if(!newMatches.length){toast('No se detectaron partidos','error');return;}
    const hist=(currentDBData.results||[]).filter(m=>Number(m.journey||1)!==journeyNum);
    const allResults=AdminLogic.mergeResults(hist,newMatches);
    const newStandings=AdminLogic.calculateStandings(allResults, currentDBData.teams);
    checkDuplicatesAndProceed(newMatches, allResults, newStandings);
  }else if(compMode==='standings'){
    const newStandings=AdminLogic.parseStandingsTable(text);
    if(!newStandings.length){toast('No se pudo procesar la tabla','error');return;}
    displayPreviewStandingsOnly(newStandings);
  }else{
    const data=AdminLogic.parseCalendarText(text);
    if(!data.matches.length){toast('No se pudo procesar el calendario completo','error');return;}
    displayCalendarPreview(data.matches, data.teams);
  }
}

function displayPreview(matches, standings, allResults){
  document.getElementById('preview-area').style.display='block';
  document.getElementById('match-count').textContent=`${matches.length} partidos`;
  document.getElementById('parsed-results').innerHTML=matches.map(m=>`
    <div style="background:rgba(255,255,255,0.04);padding:.65rem .875rem;border-radius:8px;border:1px solid rgba(255,255,255,0.06);margin-bottom:.5rem;display:flex;justify-content:space-between;align-items:center;font-size:.82rem;">
      <span style="color:rgba(255,255,255,0.5);">J${m.journey}</span>
      <span style="font-weight:600;color:white;">${m.home}</span>
      <span style="font-family:'Barlow Condensed',sans-serif;font-weight:900;color:var(--accent-bright);padding:.2rem .6rem;background:rgba(18,85,201,0.2);border-radius:4px;">${m.score}</span>
      <span style="font-weight:600;color:white;">${m.away}</span>
    </div>`).join('');
  const tolosa=standings.find(t=>t.team?.toLowerCase().includes('tolosa'));
  document.getElementById('standings-summary').textContent=tolosa?`Tolosa CF queda en #${tolosa.pos} con ${tolosa.pts} puntos.`:`${standings.length} equipos en la clasificación.`;
  window.finalData=AdminLogic.generateCategoryData(currentDBData.name||'Categoría',currentDBData.competition||'Competición',currentDBData.season||'2025/26',allResults,standings,currentDBData.teams);
}

function displayPreviewStandingsOnly(standings){
  document.getElementById('preview-area').style.display='block';
  document.getElementById('match-count').textContent=`${standings.length} equipos`;
  document.getElementById('parsed-results').innerHTML=`<table class="data-table"><thead><tr><th>Pos</th><th>Equipo</th><th>PJ</th><th>Pts</th></tr></thead><tbody>${standings.map(t=>`<tr><td style="color:var(--accent-bright);font-weight:700;">${t.pos}</td><td>${t.team}</td><td>${t.pj}</td><td style="font-weight:700;">${t.pts}</td></tr>`).join('')}</tbody></table>`;
  const tolosa=standings.find(t=>t.team?.toLowerCase().includes('tolosa'));
  document.getElementById('standings-summary').textContent=tolosa?`Tolosa CF en #${tolosa.pos} con ${tolosa.pts} puntos.`:'Clasificación importada manualmente.';
  window.finalData=AdminLogic.generateCategoryData(currentDBData.name,currentDBData.competition,currentDBData.season,currentDBData.results||[],standings,currentDBData.teams);
}

async function saveToCloud(){
  if(!window.finalData)return;
  const btn=document.getElementById('save-btn'),catId=document.getElementById('comp-category').value;
  btn.innerHTML='<div class="spinner"></div>';btn.disabled=true;
  try{
    await db.collection('competitions').doc(catId).set(window.finalData);
    toast('¡Guardado en Firebase!','success');
    document.getElementById('preview-area').style.display='none';
    document.getElementById('raw-input').value='';
    await loadCompetitionData();
  }catch(e){toast('Error al guardar: '+e.message,'error');}
  finally{btn.innerHTML='<i data-feather="cloud"></i> Guardar en Firebase';btn.disabled=false;feather.replace();}
}

async function repairDatabase(){
  if(!confirm('Ejecutar limpieza de duplicados?'))return;
  try{
    const catId=document.getElementById('comp-category').value;
    const doc=await db.collection('competitions').doc(catId).get();
    if(!doc.exists){toast('Sin datos que reparar','info');return;}
    const data=doc.data(),oldResults=data.results||[];
    const resultsMap=new Map();
    oldResults.forEach(m=>resultsMap.set(AdminLogic.getMatchKey(m),m));
    const cleaned=Array.from(resultsMap.values()).sort((a,b)=>a.journey-b.journey);
    const newStandings=AdminLogic.calculateStandings(cleaned, data.teams);
    await db.collection('competitions').doc(catId).set(AdminLogic.generateCategoryData(data.name,data.competition,data.season,cleaned,newStandings,data.teams||[]));
    toast(`Limpieza: ${oldResults.length} → ${cleaned.length} partidos`,'success');loadCompetitionData();
  }catch(e){toast('Error: '+e.message,'error');}
}

// ── CLASIFICACIÓN ──
async function loadStandings(){
  const catId=document.getElementById('standings-category').value;
  const tbody=document.getElementById('standings-tbody');
  tbody.innerHTML='<tr><td colspan="11" style="text-align:center;"><div class="spinner" style="margin:0 auto;"></div></td></tr>';
  try{
    const doc=await db.collection('competitions').doc(catId).get();
    if(!doc.exists||!doc.data().standings?.length){
      tbody.innerHTML='<tr><td colspan="11" style="text-align:center;color:rgba(255,255,255,0.3);">Sin clasificación para esta categoría</td></tr>';return;
    }
    const standings=doc.data().standings;
    
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

    feather.replace();
  }catch(e){tbody.innerHTML=`<tr><td colspan="11" style="color:#f87171;padding:1rem;">Error: ${e.message}</td></tr>`;}
}

// ── BORRAR FILA DE CLASIFICACIÓN ──
async function deleteStandingRow(catId, teamName){
  if(!confirm(`¿Borrar a "${teamName}" de la clasificación?\n\nSolo borra esta fila de standings. Sus partidos en results NO se borran.`))return;
  try{
    const doc=await db.collection('competitions').doc(catId).get();
    if(!doc.exists)return;
    const data=doc.data();
    const newStandings=(data.standings||[]).filter(t=>t.team!==teamName);
    newStandings.forEach((t,i)=>t.pos=i+1);
    await db.collection('competitions').doc(catId).update({standings:newStandings});
    toast(`"${teamName}" eliminado de la clasificación`,'success');
    loadStandings();
  }catch(e){toast('Error: '+e.message,'error');}
}

// ── EQUIPOS (colección teams) ──
async function saveTeam(){
  const name=document.getElementById('team-name').value?.trim();
  if(!name){toast('El nombre es obligatorio','error');return;}
  const data={name,category:document.getElementById('team-category').value,season:document.getElementById('team-season').value,coach:document.getElementById('team-coach').value,competition:document.getElementById('team-competition').value};
  const editId=document.getElementById('team-edit-id').value;
  try{if(editId)await db.collection('teams').doc(editId).update(data);else await db.collection('teams').add(data);toast(editId?'Equipo actualizado':'Equipo guardado','success');clearTeamForm();loadTeams();}catch(e){toast('Error: '+e.message,'error');}
}
async function loadTeams(){
  const tbody=document.getElementById('teams-tbody');
  tbody.innerHTML='<tr><td colspan="5" style="text-align:center;"><div class="spinner" style="margin:0 auto;"></div></td></tr>';
  try{
    const snap=await db.collection('teams').get();
    if(snap.empty){tbody.innerHTML='<tr><td colspan="5" style="text-align:center;color:rgba(255,255,255,0.3);">Sin equipos registrados</td></tr>';return;}
    
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

    feather.replace();
  }catch(e){tbody.innerHTML=`<tr><td colspan="5" style="color:#f87171;padding:1rem;">Error: ${e.message}</td></tr>`;}
}
async function editTeam(id){
  const doc=await db.collection('teams').doc(id).get();if(!doc.exists)return;const t=doc.data();
  document.getElementById('team-edit-id').value=id;document.getElementById('team-name').value=t.name||'';document.getElementById('team-category').value=t.category||'senior';document.getElementById('team-season').value=t.season||'';document.getElementById('team-coach').value=t.coach||'';document.getElementById('team-competition').value=t.competition||'';
  document.getElementById('team-form-title').textContent='Editar equipo';
}
async function deleteTeam(id){if(!confirm('Eliminar este equipo?'))return;await db.collection('teams').doc(id).delete();toast('Equipo eliminado','success');loadTeams();}
function clearTeamForm(){['team-edit-id','team-name','team-season','team-coach','team-competition'].forEach(id=>document.getElementById(id).value='');document.getElementById('team-category').value='senior';document.getElementById('team-form-title').textContent='Nuevo equipo';}

// ── JUGADORES ──
async function savePlayer(){
  const name=document.getElementById('player-name').value?.trim();
  if(!name){toast('El nombre es obligatorio','error');return;}
  try {
    let photoUrl = document.getElementById('player-photo').value;
    const uploadedUrl = await uploadImageToStorage('player-photo-file', 'player-upload-progress', 'players');
    if (uploadedUrl) photoUrl = uploadedUrl;
    
    const data={name,number:parseInt(document.getElementById('player-number').value)||0,position:document.getElementById('player-position').value,team:document.getElementById('player-team').value,photo:photoUrl,notes:document.getElementById('player-notes').value};
    const editId=document.getElementById('player-edit-id').value;
    if(editId) await db.collection('players').doc(editId).update(data);
    else await db.collection('players').add(data);
    toast(editId?'Jugador actualizado':'Jugador guardado','success');
    clearPlayerForm();loadPlayers();loadDashboardStats();
  } catch(e) {
    toast('Error: '+e.message,'error');
  }
}
async function loadPlayers(){
  const tbody=document.getElementById('players-tbody');
  tbody.innerHTML='<tr><td colspan="5" style="text-align:center;"><div class="spinner" style="margin:0 auto;"></div></td></tr>';
  const teamFilter=document.getElementById('player-filter-team').value;
  try{
    const snap=await db.collection('players').orderBy('number').get();
    const docs=teamFilter?snap.docs.filter(d=>d.data().team===teamFilter):snap.docs;
    if(!docs.length){tbody.innerHTML='<tr><td colspan="5" style="text-align:center;color:rgba(255,255,255,0.3);">Sin jugadores registrados</td></tr>';return;}
    
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

    feather.replace();
  }catch(e){tbody.innerHTML=`<tr><td colspan="5" style="color:#f87171;padding:1rem;">Comprueba las reglas de Firestore: ${e.message}</td></tr>`;}
}
async function editPlayer(id){
  const doc=await db.collection('players').doc(id).get();if(!doc.exists)return;const p=doc.data();
  document.getElementById('player-edit-id').value=id;document.getElementById('player-name').value=p.name||'';document.getElementById('player-number').value=p.number||'';document.getElementById('player-position').value=p.position||'Central';document.getElementById('player-team').value=p.team||'senior-masculino';document.getElementById('player-photo').value=p.photo||'';document.getElementById('player-notes').value=p.notes||'';
  document.getElementById('player-form-title').textContent='Editar jugador';
}
async function deletePlayer(id){if(!confirm('Eliminar este jugador?'))return;await db.collection('players').doc(id).delete();toast('Jugador eliminado','success');loadPlayers();loadDashboardStats();}
function clearPlayerForm(){['player-edit-id','player-name','player-number','player-photo','player-notes','player-photo-file'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});const lbl=document.getElementById('player-photo-filename');if(lbl)lbl.textContent='';document.getElementById('player-form-title').textContent='Nuevo jugador';}

// ── CUERPO TÉCNICO ──
async function saveStaff(){
  const name=document.getElementById('staff-name').value?.trim();
  const role=document.getElementById('staff-role').value?.trim();
  if(!name||!role){toast('Nombre y cargo son obligatorios','error');return;}
  const data={name,role,photo:document.getElementById('staff-photo').value?.trim()||'',order:parseInt(document.getElementById('staff-order').value)||0,team:'senior-masculino'};
  const editId=document.getElementById('staff-edit-id').value;
  try{
    if(editId)await db.collection('staff').doc(editId).update(data);
    else await db.collection('staff').add(data);
    toast(editId?'Miembro actualizado':'Miembro guardado','success');
    clearStaffForm();loadStaffAdmin();
  }catch(e){toast('Error: '+e.message,'error');}
}
async function loadStaffAdmin(){
  const tbody=document.getElementById('staff-tbody');
  if(!tbody)return;
  tbody.innerHTML='<tr><td colspan="4" style="text-align:center;"><div class="spinner" style="margin:0 auto;"></div></td></tr>';
  try{
    const snap=await db.collection('staff').orderBy('order').get();
    if(snap.empty){tbody.innerHTML='<tr><td colspan="4" style="text-align:center;color:rgba(255,255,255,0.3);">Sin miembros registrados</td></tr>';return;}
    
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

    feather.replace();
  }catch(e){tbody.innerHTML=`<tr><td colspan="4" style="color:#f87171;padding:1rem;">Error: ${e.message}</td></tr>`;}
}
async function editStaff(id){
  const doc=await db.collection('staff').doc(id).get();if(!doc.exists)return;const m=doc.data();
  document.getElementById('staff-edit-id').value=id;
  document.getElementById('staff-name').value=m.name||'';
  document.getElementById('staff-role').value=m.role||'';
  document.getElementById('staff-photo').value=m.photo||'';
  document.getElementById('staff-order').value=m.order||0;
  document.getElementById('staff-form-title').textContent='Editar miembro';
}
async function deleteStaff(id){if(!confirm('Eliminar este miembro del cuerpo técnico?'))return;await db.collection('staff').doc(id).delete();toast('Miembro eliminado','success');loadStaffAdmin();}
function clearStaffForm(){['staff-edit-id','staff-name','staff-role','staff-photo','staff-order','staff-photo-file'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});const lbl=document.getElementById('staff-photo-filename');if(lbl)lbl.textContent='';document.getElementById('staff-form-title').textContent='Nuevo miembro';}


// ── PATROCINADORES ──
async function saveSponsor(){
  const name=document.getElementById('sponsor-name').value?.trim();
  if(!name){toast('El nombre es obligatorio','error');return;}
  try {
    let logoUrl = document.getElementById('sponsor-logo').value;
    const uploadedUrl = await uploadImageToStorage('sponsor-logo-file', 'sponsor-upload-progress', 'sponsors');
    if (uploadedUrl) logoUrl = uploadedUrl;
    
    const data={name,logo:logoUrl,url:document.getElementById('sponsor-url').value,category:document.getElementById('sponsor-category').value};
    const editId=document.getElementById('sponsor-edit-id').value;
    if(editId) await db.collection('sponsors').doc(editId).update(data);
    else await db.collection('sponsors').add(data);
    toast(editId?'Patrocinador actualizado':'Patrocinador guardado','success');
    clearSponsorForm();loadSponsors();loadDashboardStats();
  } catch(e) {
    toast('Error: '+e.message,'error');
  }
}
async function loadSponsors(){
  const grid=document.getElementById('sponsors-grid');
  grid.innerHTML='<div style="text-align:center;padding:2rem;"><div class="spinner" style="margin:0 auto;"></div></div>';
  try{
    const snap=await db.collection('sponsors').get();
    if(snap.empty){grid.innerHTML='<div style="text-align:center;padding:2rem;color:rgba(255,255,255,0.3);font-size:.82rem;grid-column:1/-1;">Sin patrocinadores registrados</div>';return;}
    
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
          const icon = createIcon('image'); icon.style.cssText = "width:24px;height:24px;";
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

    feather.replace();
  }catch(e){grid.innerHTML=`<div style="color:#f87171;font-size:.8rem;padding:1rem;grid-column:1/-1;">Error: ${e.message}</div>`;}
}
async function editSponsor(id){
  const doc=await db.collection('sponsors').doc(id).get();if(!doc.exists)return;const s=doc.data();
  document.getElementById('sponsor-edit-id').value=id;document.getElementById('sponsor-name').value=s.name||'';document.getElementById('sponsor-logo').value=s.logo||'';document.getElementById('sponsor-url').value=s.url||'';document.getElementById('sponsor-category').value=s.category||'principal';
  document.getElementById('sponsor-form-title').textContent='Editar patrocinador';
}
async function deleteSponsor(id){if(!confirm('Eliminar este patrocinador?'))return;await db.collection('sponsors').doc(id).delete();toast('Patrocinador eliminado','success');loadSponsors();loadDashboardStats();}
function clearSponsorForm(){['sponsor-edit-id','sponsor-name','sponsor-logo','sponsor-url','sponsor-logo-file'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});const lbl=document.getElementById('sponsor-logo-filename');if(lbl)lbl.textContent='';document.getElementById('sponsor-category').value='principal';document.getElementById('sponsor-form-title').textContent='Nuevo patrocinador';}

// ── IMÁGENES ──
let savedImages=JSON.parse(localStorage.getItem('admin-images')||'[]');
function addImageToGallery(){const url=document.getElementById('img-url-input').value.trim();if(!url)return;savedImages.push(url);localStorage.setItem('admin-images',JSON.stringify(savedImages));renderImageGallery();document.getElementById('img-url-input').value='';}
function renderImageGallery(){
  const grid=document.getElementById('image-gallery');if(!grid)return;
  if(!savedImages.length){grid.innerHTML='<div style="text-align:center;padding:2rem;color:rgba(255,255,255,0.2);font-size:.8rem;grid-column:1/-1;">Las URLs de imágenes guardadas aparecen aquí</div>';return;}
  grid.innerHTML=savedImages.map((url,i)=>`<div style="position:relative;border-radius:8px;overflow:hidden;aspect-ratio:1;"><img src="${url}" style="width:100%;height:100%;object-fit:cover;"><div style="position:absolute;inset:0;background:rgba(0,0,0,0.5);opacity:0;transition:opacity .2s;display:flex;align-items:center;justify-content:center;gap:.5rem;" onmouseenter="this.style.opacity=1" onmouseleave="this.style.opacity=0"><button onclick="copyImageUrl('${url}')" class="btn btn-ghost btn-sm"><i data-feather="copy"></i></button><button onclick="removeImage(${i})" class="btn btn-danger btn-sm"><i data-feather="trash-2"></i></button></div></div>`).join('');
  feather.replace();
}
function copyImageUrl(url){navigator.clipboard.writeText(url);toast('URL copiada','success');}
function removeImage(i){savedImages.splice(i,1);localStorage.setItem('admin-images',JSON.stringify(savedImages));renderImageGallery();}
// ── EDITAR PARTIDO MODAL ──
let editingMatchIndex = null;
function openEditMatchModal(idx) {
  if (!currentDBData) return;
  const matches = currentDBData.results || [];
  const m = matches[idx];
  if (!m) return;
  
  editingMatchIndex = idx;
  document.getElementById('edit-match-index').value = idx;
  document.getElementById('edit-match-journey').value = m.journey || 1;
  document.getElementById('edit-match-home').value = m.home || '';
  document.getElementById('edit-match-away').value = m.away || '';
  document.getElementById('edit-match-date').value = m.date || '';
  document.getElementById('edit-match-time').value = m.time || '';
  document.getElementById('edit-match-venue').value = m.venue || '';
  document.getElementById('edit-match-score').value = m.score || '';
  
  document.getElementById('edit-match-modal').style.display = 'flex';
  if (typeof feather !== 'undefined') feather.replace();
}

function closeEditMatchModal() {
  document.getElementById('edit-match-modal').style.display = 'none';
}

async function saveMatchChanges() {
  if (editingMatchIndex === null || !currentDBData) return;
  const idx = editingMatchIndex;
  const matches = currentDBData.results || [];
  const m = matches[idx];
  if (!m) return;
  
  const journey = parseInt(document.getElementById('edit-match-journey').value, 10) || 1;
  const date = document.getElementById('edit-match-date').value.trim() || 'Pendiente';
  const time = document.getElementById('edit-match-time').value.trim() || 'Pendiente';
  const venue = document.getElementById('edit-match-venue').value.trim() || 'Pabellon';
  const score = document.getElementById('edit-match-score').value.trim();
  
  m.journey = journey;
  m.date = date;
  m.time = time;
  m.venue = venue;
  m.score = score;
  m.status = (score && score.toLowerCase() !== 'vs' && score.trim() !== '') ? 'Finalizado' : 'Programado';
  
  // Recalcular clasificación
  const newStandings = AdminLogic.calculateStandings(matches, currentDBData.teams);
  const catId = document.getElementById('comp-category').value;
  
  try {
    const btn = document.querySelector('#edit-match-modal .btn-primary');
    const oldHTML = btn.innerHTML;
    btn.innerHTML = '<div class="spinner"></div>';
    btn.disabled = true;
    
    await db.collection('competitions').doc(catId).set(
      AdminLogic.generateCategoryData(currentDBData.name, currentDBData.competition, currentDBData.season, matches, newStandings, currentDBData.teams)
    );
    
    currentDBData.results = matches;
    currentDBData.standings = newStandings;
    
    toast('Partido actualizado con éxito.', 'success');
    closeEditMatchModal();
    renderResultsTable(matches);
    const filterJ = document.getElementById('filter-journey').value;
    if (filterJ) filterResults();
  } catch(e) {
    toast('Error al guardar: ' + e.message, 'error');
  } finally {
    const btn = document.querySelector('#edit-match-modal .btn-primary');
    btn.innerHTML = '<i data-feather="save"></i> Guardar cambios';
    btn.disabled = false;
    if (typeof feather !== 'undefined') feather.replace();
  }
}

async function updateCompMetadata() {
  if (!currentDBData) return;
  const catId = document.getElementById('comp-category').value;
  const competition = document.getElementById('comp-competition-name').value.trim() || 'Pendiente';
  const season = document.getElementById('comp-season-name').value.trim() || '2025/26';
  
  currentDBData.competition = competition;
  currentDBData.season = season;
  
  try {
    const btn = document.querySelector('[onclick="updateCompMetadata()"]');
    btn.innerHTML = '<div class="spinner"></div>';
    btn.disabled = true;
    
    await db.collection('competitions').doc(catId).set(
      AdminLogic.generateCategoryData(currentDBData.name, competition, season, currentDBData.results || [], currentDBData.standings || [], currentDBData.teams || [])
    );
    
    toast('¡Competición y temporada actualizadas!', 'success');
  } catch(e) {
    toast('Error: ' + e.message, 'error');
  } finally {
    const btn = document.querySelector('[onclick="updateCompMetadata()"]');
    btn.innerHTML = '<i data-feather="save"></i> Actualizar competición y temp.';
    btn.disabled = false;
    if (typeof feather !== 'undefined') feather.replace();
  }
}

function displayCalendarPreview(matches, teams){
  document.getElementById('preview-area').style.display='block';
  document.getElementById('match-count').textContent=`${matches.length} partidos`;
  document.getElementById('parsed-results').innerHTML=`
    <div style="margin-bottom:1rem;font-size:.82rem;color:rgba(255,255,255,0.6);">
      <strong>Equipos detectados (${teams.length}):</strong> ${teams.join(', ')}
    </div>
    <div style="font-size:.78rem;opacity:.5;margin-bottom:.5rem;">Vista previa de los primeros partidos:</div>
    ` + matches.slice(0, 8).map(m=>`
    <div style="background:rgba(255,255,255,0.04);padding:.65rem .875rem;border-radius:8px;border:1px solid rgba(255,255,255,0.06);margin-bottom:.5rem;display:flex;justify-content:space-between;align-items:center;font-size:.82rem;">
      <span style="color:rgba(255,255,255,0.5);">J${m.journey} (${m.date})</span>
      <span style="font-weight:600;color:white;">${m.home}</span>
      <span style="font-family:'Barlow Condensed',sans-serif;font-weight:900;color:var(--accent-bright);padding:.2rem .6rem;background:rgba(18,85,201,0.2);border-radius:4px;">${m.score}</span>
      <span style="font-weight:600;color:white;">${m.away}</span>
    </div>`).join('') + (matches.length > 8 ? `<div style="text-align:center;font-size:.75rem;opacity:.5;padding:.5rem;">... y ${matches.length - 8} partidos más</div>` : '');
  
  const initialStandings = AdminLogic.calculateStandings(matches, teams);
  document.getElementById('standings-summary').textContent=`El calendario completo sustituirá los resultados y registrará ${teams.length} equipos oficiales.`;
  window.finalData=AdminLogic.generateCategoryData(currentDBData.name, currentDBData.competition, currentDBData.season, matches, initialStandings, teams);
}