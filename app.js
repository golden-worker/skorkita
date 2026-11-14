'use strict';
// ESPN site API bersifat tidak resmi. Endpoint/coverage dapat berubah kapan saja.
const LEAGUES=[['eng.1','Premier League'],['esp.1','La Liga'],['ita.1','Serie A'],['ger.1','Bundesliga'],['fra.1','Ligue 1'],['uefa.champions','Champions League'],['uefa.europa','Europa League'],['eng.2','Championship'],['usa.1','MLS'],['idn.1','Liga Indonesia']];
const $=s=>document.querySelector(s);
const state={offset:0,query:'',matches:[],lastLoaded:null,loading:false};
function dateOffset(delta){const d=new Date();d.setDate(d.getDate()+delta);return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;}
function safe(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function time(v){if(!v)return '-';const d=new Date(v);return isNaN(d)?'-':new Intl.DateTimeFormat('id-ID',{hour:'2-digit',minute:'2-digit'}).format(d);}
function statusOf(e){const c=e.competitions?.[0];const t=c?.status?.type||e.status?.type||{};return {live:t.state==='in',done:t.completed||t.state==='post',label:t.shortDetail||t.detail||'Jadwal'};}
function parseEvent(ev,league){const c=ev.competitions?.[0];if(!c)return null;const comp=c.competitors||[];const h=comp.find(x=>x.homeAway==='home')||comp[0];const a=comp.find(x=>x.homeAway==='away')||comp[1];if(!h||!a)return null;return {id:String(ev.id),league,home:h.team?.displayName||h.team?.name||'Home',away:a.team?.displayName||a.team?.name||'Away',homeLogo:h.team?.logo||'',awayLogo:a.team?.logo||'',homeScore:h.score,awayScore:a.score,date:ev.date,status:statusOf(ev),venue:c.venue?.fullName||'',note:ev.name||''};}
async function requestScoreboard(id,label,date){
  const url=`https://site.api.espn.com/apis/site/v2/sports/soccer/${encodeURIComponent(id)}/scoreboard?dates=${date}&limit=150`;
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),14000);
  try {
    const response=await fetch(url,{cache:'no-store',signal:controller.signal});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const data=await response.json();
    if(!Array.isArray(data.events))throw new Error('Respons tidak berisi events[]');
    const matches=data.events.map(ev=>parseEvent(ev,{id,label})).filter(Boolean);
    return {matches,league:label,date,count:data.events.length,error:null};
  }catch(error){return {matches:[],league:label,date,count:0,error:String(error.message||error)};}
  finally{clearTimeout(timer);}
}
let loadNumber=0;
async function load(){
  const thisLoad=++loadNumber;
  state.loading=true;$('#refresh').disabled=true;$('#status').textContent='Mengambil jadwal dari ESPN…';
  const days=state.offset===3?[-1,0,1]:[state.offset];
  const jobs=LEAGUES.flatMap(([id,label])=>days.map(delta=>({id,label,date:dateOffset(delta)})));
  // Batasi jumlah koneksi paralel agar lebih ramah terhadap sumber data.
  let cursor=0;const results=[];
  async function worker(){while(cursor<jobs.length){if(thisLoad!==loadNumber)return;const job=jobs[cursor++];results.push(await requestScoreboard(job.id,job.label,job.date));}}
  await Promise.all(Array.from({length:Math.min(4,jobs.length)},()=>worker()));
  if(thisLoad!==loadNumber)return;
  const dedup=new Map();for(const result of results)for(const m of result.matches)dedup.set(`${m.league.id}:${m.id}`,m);
  state.matches=[...dedup.values()].sort((a,b)=>new Date(a.date)-new Date(b.date));
  state.lastLoaded=new Date();state.loading=false;$('#refresh').disabled=false;
  const failures=results.filter(x=>x.error);const successful=results.length-failures.length;
  $('#status').textContent=`${state.matches.length} pertandingan · diperbarui ${time(state.lastLoaded)} · ${successful}/${results.length} permintaan berhasil${failures.length?' · '+failures.length+' gagal':''}`;
  const content=$('#diagnostic-content');content.replaceChildren();
  const info=document.createElement('p');info.textContent=`Tanggal diminta: ${days.map(dateOffset).join(', ')}. Data diterima: ${successful} respons berhasil, ${failures.length} gagal.`;content.append(info);
  const list=document.createElement('ul');for(const result of results){const item=document.createElement('li');item.textContent=`${result.league} (${result.date}): ${result.error?'GAGAL — '+result.error:result.count+' laga'}`;list.append(item);}content.append(list);
  render();
}
function render(){const q=state.query.trim().toLowerCase();const all=state.matches.filter(x=>!q||[x.home,x.away,x.league.label].some(s=>s.toLowerCase().includes(q)));const groups=new Map();for(const x of all){const key=x.league.id;if(!groups.has(key))groups.set(key,{name:x.league.label,rows:[]});groups.get(key).rows.push(x);}const list=$('#matches');list.replaceChildren();if(!all.length){list.innerHTML='<div class="status">Tidak ada pertandingan untuk tanggal/filter ini dari respons ESPN. Coba <strong>Hari ini</strong> atau <strong>3 Hari</strong>. Bila tetap kosong, buka <strong>Diagnostik koneksi ESPN</strong> di bawah.</div>';return;}for(const group of groups.values()){const block=document.createElement('div');block.className='leagueblock';const title=document.createElement('div');title.className='league-title';title.innerHTML=`<span>${safe(group.name)}</span><span>${group.rows.length} laga</span>`;block.append(title);for(const m of group.rows){const row=document.createElement('div');row.className='match';row.tabIndex=0;row.setAttribute('role','button');row.setAttribute('aria-label',`Detail ${m.home} melawan ${m.away}`);const score=m.status.live||m.status.done?`${safe(m.homeScore??'-')} : ${safe(m.awayScore??'-')}`:time(m.date);row.innerHTML=`<span class="status-pill ${m.status.live?'live':''}">${safe(m.status.live?'● LIVE':m.status.done?'FT':'Jadwal')}</span><span class="team home"><span>${safe(m.home)}</span>${m.homeLogo?`<img loading="lazy" referrerpolicy="no-referrer" src="${safe(m.homeLogo)}" alt="">`:''}</span><span class="score">${score}</span><span class="team away">${m.awayLogo?`<img loading="lazy" referrerpolicy="no-referrer" src="${safe(m.awayLogo)}" alt="">`:''}<span>${safe(m.away)}</span></span>`;const open=()=>detail(m);row.addEventListener('click',open);row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});block.append(row);}list.append(block);}}
async function detail(m){$('#detail-body').innerHTML=`<h2>${safe(m.home)} vs ${safe(m.away)}</h2><p>${safe(m.league.label)} · ${safe(m.status.label)}</p><p>${safe(m.venue||'Stadion belum tersedia')}</p><div class="status">Memuat detail pertandingan…</div>`;$('#detail').showModal();try{const r=await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${encodeURIComponent(m.league.id)}/summary?event=${encodeURIComponent(m.id)}`);if(!r.ok)throw Error('Detail tidak tersedia');const d=await r.json();const comp=d.header?.competitions?.[0];const detailStatus=comp?.status?.type?.detail||m.status.label;const teams=comp?.competitors||[];const desc=d.details||[];$('#detail-body').innerHTML=`<h2>${safe(m.home)} vs ${safe(m.away)}</h2><p>${safe(m.league.label)} · ${safe(detailStatus)}</p><h2>${safe(m.homeScore??'-')} : ${safe(m.awayScore??'-')}</h2><div class="d-row">Kick-off: ${safe(new Date(m.date).toLocaleString('id-ID'))}</div><div class="d-row">Stadion: ${safe(m.venue||'Belum tersedia')}</div><div class="d-row">Susunan pemain/statistik: ${teams.length?'Sebagian data pertandingan tersedia':'Belum tersedia dari ESPN'}</div><div class="d-row">Event yang tercatat: ${desc.length}</div>`;}catch(e){$('#detail-body').insertAdjacentHTML('beforeend','<p class="error">Detail ESPN saat ini tidak tersedia.</p>');}}
$('#refresh').addEventListener('click',load);$('#search').addEventListener('input',e=>{state.query=e.target.value;render();});document.querySelectorAll('[data-day]').forEach(b=>b.addEventListener('click',()=>{state.offset=Number(b.dataset.day);document.querySelectorAll('[data-day]').forEach(x=>x.classList.toggle('selected',x===b));load();}));$('#league-list').innerHTML=LEAGUES.map(x=>`<span>${safe(x[1])}</span>`).join('');document.addEventListener('visibilitychange',()=>{if(!document.hidden&&state.lastLoaded&&Date.now()-state.lastLoaded.getTime()>60000)load();});setInterval(()=>{if(!document.hidden)load()},60000);load();
