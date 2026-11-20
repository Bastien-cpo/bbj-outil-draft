// ===== Interface v4 =====
const $=s=>document.querySelector(s);
const LS="bbj-draft-v3";
const DEF_LINEUP={T:"Fayk",J:"Billy",M:"JH",A:"Bastien",S:"Léo"};
let cfg=defaultConfig();
let prep={opponent:"", link:"", players:[], lineup:{...DEF_LINEUP}, updatedAt:null};
let live={series:{locked:[],games:[]}, draft:{side:"B",actions:Array(20).fill(null)}};
let history={series:[]}; // séries terminées (archivées par « Nouvelle série »)
let ui={tab:"draft", poolPlayer:"Fayk", hover:null, synQ:"", ctrQ:"", tierPop:null, manual:false, pending:null, edit:null, viewGame:null, gridQ:"", gridRole:"all"};
let sync={db:null, ok:false, readOnly:false, note:"Local"};

const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function av(n,cls=""){ const i=ICON_INDEX[n];
  if(i==null) return `<span class="av ${cls}">${esc(String(n).slice(0,2))}</span>`;
  return `<span class="av ${cls}" title="${esc(n)}" style="--c:${i%14};--r:${Math.floor(i/14)}"></span>`; }
const curStep=()=>live.draft.actions.findIndex(a=>!a);
const playerOpts=sel=>PLAYERS.map(p=>`<option ${p.id===sel?"selected":""}>${p.id}</option>`).join("");

// ---------- Stockage : base partagée (équipe) sinon navigateur ----------
function saveLocal(){ try{ localStorage.setItem(LS,JSON.stringify({cfg,prep,live,history,ui:{tab:ui.tab,poolPlayer:ui.poolPlayer}})); }catch(e){} }
function migrate(c){ if(!c.wv||c.wv<7){ c.weights={...defaultConfig().weights}; c.wv=7; } if(c.wv<8){ c.roleOrder=["J","A","S","M","T"]; c.wv=8; } return c; }
function loadLocal(){ try{ const d=JSON.parse(localStorage.getItem(LS)||"null"); if(d){ cfg=migrate(Object.assign(defaultConfig(),d.cfg||{})); prep=Object.assign(prep,d.prep||{}); live=Object.assign(live,d.live||{}); if(d.history) history=d.history; Object.assign(ui,d.ui||{}); } }catch(e){} }
const pending={}, writing={}, timers={};
function persist(key){ saveLocal(); if(!sync.db||sync.readOnly) return; clearTimeout(timers[key]); timers[key]=setTimeout(()=>flush(key),450); pending[key]=true; }
async function flush(key){
  if(writing[key]){ timers[key]=setTimeout(()=>flush(key),300); return; }
  writing[key]=true; pending[key]=false;
  const body={config:cfg,prep:prep,live:live,history:history}[key];
  try{ await sync.db.doc("team/"+key).set(JSON.parse(JSON.stringify({v:body,at:Date.now()}))); sync.ok=true; sync.note="Synchronisé avec l'équipe"; }
  catch(e){ if(e&&e.code==="invalid_argument"){ sync.readOnly=true; sync.note="Lecture seule : tu suis la draft en direct"; } else { sync.note="Hors ligne : enregistré sur cet appareil"; } }
  writing[key]=false; renderSync();
}
async function initDb(){
  if(!(window.claude&&window.claude.use)) return;
  let db=null; try{ db=await window.claude.use("db"); }catch(e){}
  if(!db) return;
  sync.db=db; sync.note="Connexion à la base de l'équipe…"; renderSync();
  const t=setTimeout(()=>{ sync.note="Base d'équipe injoignable : enregistré sur cet appareil"; renderSync(); },10000);
  const apply={config:v=>{cfg=migrate(Object.assign(defaultConfig(),v));}, prep:v=>{prep=Object.assign({opponent:"",link:"",players:[],lineup:{...DEF_LINEUP}},v);}, live:v=>{live=v;}, history:v=>{history=Object.assign({series:[]},v);}};
  ["config","prep","live","history"].forEach(key=>{
    db.doc("team/"+key).onSnapshot(snap=>{
      if(!snap.metadata.fromCache){ clearTimeout(t); sync.ok=true; if(!sync.readOnly) sync.note="Synchronisé avec l'équipe"; }
      if(snap.exists&&!pending[key]&&!snap.metadata.hasPendingWrites){ const d=snap.data(); if(d&&d.v){ apply[key](JSON.parse(JSON.stringify(d.v))); saveLocal(); render(); return; } }
      renderSync();
    }, ()=>{ sync.note="Synchro interrompue : enregistré sur cet appareil"; renderSync(); });
  });
}
function renderSync(){ const el=$("#sync"); if(el){ el.textContent=sync.note; el.className=sync.ok?(sync.readOnly?"ro":"ok"):""; } }

function render(){
  document.querySelectorAll(".tabs button").forEach(b=>b.classList.toggle("on",b.dataset.tab===ui.tab));
  const v={draft:viewDraft,prep:viewPrep,pools:viewPools,hist:viewHistory,settings:viewSettings}[ui.tab]||viewDraft;
  $("#view").innerHTML=v(); const tp=$("#tip"); if(tp) tp.classList.remove("on"); document.body.classList.toggle("drafting",ui.tab==="draft"); renderSync(); saveLocal(); fitRows();
}
// Chaque ligne de suggestions montre autant de bulles entières que la largeur le permet
function fitRows(){ document.querySelectorAll(".fit1").forEach(b=>{ const k=[...b.children]; k.forEach(c=>c.style.display=""); const W=b.clientWidth; k.forEach(c=>{ if(c.offsetLeft+c.offsetWidth>W+1) c.style.display="none"; }); });
  document.querySelectorAll(".bubs.fill").forEach(b=>{ const k=[...b.children]; k.forEach(c=>c.style.visibility="");
  const t=k.length?k[0].offsetTop:0; k.forEach(c=>{ if(c.offsetTop>t+4) c.style.visibility="hidden"; }); }); }
let _fitT=null; window.addEventListener("resize",()=>{ clearTimeout(_fitT); _fitT=setTimeout(fitRows,80); });

// ---------- Drafter en direct ----------
// Le relais tourne sur la page Drafter (favori) : il lit picks et bans affichés et les envoie ici toutes les 0,5 s.
const RELAY_CODE="(()=>{const U='https://bastien-cpo.github.io/bbj-outil-draft/';let w=window.__bbjW;if(!w||w.closed)w=window.__bbjW=open(U,'bbj_outil','popup,width=900,height=1000');if(w)w.focus();if(!window.__bbjRelay2){const s=document.createElement('script');s.src=U+'relay/overlay.js?'+Date.now();document.body.appendChild(s)}})()"; // le favori charge relay/overlay.js depuis GitHub Pages : il se met à jour tout seul
const RIOT_KEY={}; RIOT_KEYS_RAW.split("|").forEach(t=>{ const [k,n]=t.split(":"); RIOT_KEY[k]=findChamp(n)||n; });
const DRAFTER_ALIAS={monkeyking:"Wukong",nunu:"Nunu"};
let drafterLast=0, drafterState=null;
function drafterChamp(x){ if(x==null) return null; x=String(x); if(/^\d+$/.test(x)) return RIOT_KEY[x]||null; return DRAFTER_ALIAS[x.toLowerCase()]||findChamp(x); }
// Diagnostic (tests) : renvoie l'état de l'outil à la fenêtre qui le demande
window.addEventListener("message",e=>{ const m=e.data; if(!m||m.type!=="bbj-ping"||!e.source) return; let sug=[]; try{ sug=[...document.querySelectorAll(".center [data-n]")].slice(0,6).map(x=>x.dataset.n); }catch(err){}
  e.source.postMessage({type:"bbj-state", s:{side:live.draft.side, sideHow:live.sideHow, sideOk:sideOk(), game:curGameNo(), acts:live.draft.actions.map(a=>a?(a.miss?"∅":a.name+(a.role?"/"+a.role:"")):null), games:live.series.games.length, locked:live.series.locked, opp:prep.opponent, hist:(history.series||[]).length, sug, prompt:!!document.querySelector(".sidepick")}},"*"); });
window.addEventListener("message",e=>{ const m=e.data; if(!m||m.type!=="bbj-drafter"||!m.state) return; if(!drafterLast) flash("Drafter connecté ✓"); drafterLast=Date.now(); drafterState=m.state; applyDrafter(m.state); });
// rôle d'un pick : rôle libre que le champion joue, en privilégiant (chez nous) le joueur qui l'a dans son pool
function guessRole(c,side,taken){ const roles=CHAMPS[c]?CHAMPS[c].roles:ROLES; const open=roles.filter(r=>!taken.includes(r));
  if(side===live.draft.side){ const best=open.map(r=>({r,t:TIER_VAL[tierFor(cfg,prep.lineup[r],r,c)]||0})).sort((a,b)=>b.t-a.t)[0]; if(best&&best.t>0) return best.r; }
  return open[0]||roles[0]; }
function applyDrafter(st){
  const empty=![...(st.bb||[]),...(st.rb||[]),...(st.bp||[]),...(st.rp||[])].some(x=>x!=null);
  // Nouvelle room Drafter = nouvelle série : on repart de zéro (l'ancienne série reste archivable via « Nouvelle série »)
  const room=((st.url||"").match(/draft\/([^?#/]+)/)||[])[1]||null;
  if(room&&live.drafterRoom&&room!==live.drafterRoom){ archiveSeries(true); live={series:{locked:[],games:[]},draft:{side:live.draft.side,actions:Array(20).fill(null)}}; }
  if(room) live.drafterRoom=room;
  // Deux fenêtres Drafter ouvertes (ancienne game + nouvelle) : on ne revient jamais à une game précédente de la même room
  if(st.game&&live.drafterGame&&st.game<live.drafterGame&&room===live.drafterRoom) return;
  // Room vide alors que l'outil a une draft : on attend ~2 s (page Drafter en chargement) puis Drafter fait foi
  if(empty&&(!live.drafterGame||st.game===live.drafterGame)&&live.draft.actions.some(Boolean)){ ui.emptyScans=(ui.emptyScans||0)+1; if(ui.emptyScans<4) return; }
  if(!empty) ui.emptyScans=0;
  const me=(ourName()||"BBJ").toLowerCase().trim(), bl=(st.blue||"").toLowerCase(), rd=(st.red||"").toLowerCase();
  // côté : 1) choix manuel (boutons Blue/Red) pour cette game, 2) nom d'équipe sur Drafter, 3) les picks qui collent le plus à nos pools
  let side=live.draft.side;
  const prevHow=live.sideHow;
  const isUs=n=>!!n&&(/\bbbj\b|blocked\s*by\s*(the\s*)?jungle/i.test(n)||(me&&n.includes(me)));
  if(isUs(bl)&&!isUs(rd)){ side="B"; live.sideHow="nom"; } else if(isUs(rd)&&!isUs(bl)){ side="R"; live.sideHow="nom"; }
  else live.sideHow=live.sideManual===curGameNo()?"manuel":"?";
  // nouvelle game sur Drafter : la game précédente part dans la série (fearless) et on repart d'une draft vide
  if(live.drafterGame&&st.game&&st.game!==live.drafterGame){
    if(st.game>live.drafterGame&&live.draft.actions.some(Boolean)){ const names=live.draft.actions.filter((a,i)=>a&&a.name&&STEPS[i][0]==="pick").map(a=>a.name);
      live.series.locked.push(...names); live.series.games.push({side:live.draft.side,actions:live.draft.actions,result:live.draft.result||null}); }
    live.draft={side,actions:Array(20).fill(null)}; }
  live.drafterGame=st.game||1; if(opponentFromDrafter(st,side)) {}
  const src={ban:{B:st.bb||[],R:st.rb||[]},pick:{B:st.bp||[],R:st.rp||[]}}, cnt={ban:{B:0,R:0},pick:{B:0,R:0}};
  const old=live.draft.actions, acts=Array(20).fill(null), taken={B:[],R:[]};
  // Rôles confirmés sur Drafter : les cases sont rangées par lane → on garde l'ordre de pick connu et on prend les rôles exacts
  const laneOf={B:{},R:{}};
  // Bug G3 du 19/11 : dès la game 2-3, Drafter affiche déjà les icônes de lane des cases pendant la draft → on ne s'en sert
  // qu'une fois les 10 picks faits (phase « Confirmer les rôles »), sinon chaque champion héritait de la lane de sa case
  const allPicked=[...(st.bp||[]),...(st.rp||[])].filter(x=>x!=null).length>=10;
  ["B","R"].forEach(sd=>{ const L=sd==="B"?st.bpr:st.rpr, P=src.pick[sd]; if(!L||!allPicked) return;
    const names=P.map(x=>x==="none"?"none":drafterChamp(x)), known=STEPS.map((x,i)=>x[0]==="pick"&&x[1]===sd?i:-1).filter(i=>i>=0).map(i=>old[i]?(old[i].miss?"none":old[i].name):null);
    names.forEach((n,j)=>{ if(n&&n!=="none"&&L[j]) laneOf[sd][n]=L[j]; });
    const same=names.filter(n=>n&&n!=="none").sort().join("|")===known.filter(n=>n&&n!=="none").sort().join("|")&&known.every(Boolean);
    if(same) src.pick[sd]=known.map(n=>n==="none"?"none":n); });
  const slots=st.v>=3, raws=STEPS.map(([t,s])=>src[t][s][cnt[t][s]++]);
  const lastFilled=raws.reduce((m,r,i)=>r!=null&&(r==="none"||drafterChamp(r))?i:m,-1);
  STEPS.forEach(([t,s],i)=>{ const raw=raws[i]; const c=drafterChamp(raw);
    if(!c){ if(raw==="none"||(slots&&t==="ban"&&i<lastFilled)) acts[i]=t==="pick"?{name:"",miss:true,role:null}:{name:"",miss:true}; return; } // étape passée sans choix (temps écoulé) : remplacée dès que Drafter reçoit l'échange
    if(t==="ban"){ acts[i]={name:c}; return; }
    const o=old[i]&&old[i].name===c?old[i]:null; let role=o&&o.role&&!taken[s].includes(o.role)?o.role:guessRole(c,s,taken[s]); let flex=o?!!o.flex:false, fx=o?o.fx:undefined;
    if(!o&&s!==side){ const r=enemyRole(c,taken[s]); if(r) role=r; }
    if(laneOf[s][c]){ role=laneOf[s][c]; flex=false; fx=undefined; }
    taken[s].push(role); acts[i]=fx?{name:c,role,flex,fx}:{name:c,role,flex}; });
  // Corrections manuelles (champion raté, erreur) : elles priment sur ce que renvoie Drafter
  const man=live.draft.manual||{}; Object.keys(man).forEach(k=>{ if(man[k]) acts[+k]=man[k]; });
  const changed=JSON.stringify(acts)!==JSON.stringify(old)||side!==live.draft.side||prevHow!==live.sideHow;
  live.draft.side=side; live.draft.actions=acts;
  if(changed){ ui.pending=null; ui.edit=null; ui.viewGame=null; persist("live"); render(); } else renderSync();
}
// Nom de l'adversaire pris sur Drafter seulement si la préparation n'en a pas et que notre côté est confirmé
function opponentFromDrafter(st,side){ const n=(side==="B"?st.red:st.blue)||""; if(prep.opponent||!sideOk()) return false; if(n&&!/^(adversaires?|blue|red|bleu|rouge|team ?\d|équipe ?\d)$/i.test(n.trim())&&prep.opponent!==n){ prep.opponent=n; persist("prep"); return true; } return false; }
function bookmarkCard(){
  return `<section class="card"><h3>Favori Drafter</h3><p class="muted">À installer une fois par personne : glisse ce bouton dans la barre de favoris → <a class="btn sm bm" href="javascript:${encodeURIComponent(RELAY_CODE)}">BBJ ➜ Drafter</a>. Sur une page drafter.lol, clique-le : l'outil s'ouvre dans une fenêtre à part et se remplit tout seul.</p>
   <textarea class="relaycode" readonly>javascript:${esc(encodeURIComponent(RELAY_CODE))}</textarea></section>`;
}
setInterval(()=>{ const h=document.getElementById("drsync"); if(h){ const age=drafterLast?Math.round((Date.now()-drafterLast)/1000):null;
    if(age!=null&&age<5){ h.className="on"; h.textContent="Drafter connecté · draft remplie automatiquement"; }
    else if(age!=null){ h.className="off"; h.textContent="Drafter déconnecté (il y a "+age+" s) · saisie manuelle"; }
    // Bandeau bien visible : Drafter recharge sa page à chaque nouvelle game, il faut recliquer le favori
    let bn=document.getElementById("drlost"); const lost=age!=null&&age>=5&&age<3600;
    if(lost&&!bn){ bn=document.createElement("div"); bn.id="drlost"; document.body.appendChild(bn); }
    if(bn){ bn.style.display=lost?"block":"none"; if(lost) bn.innerHTML="⚠ Drafter n'envoie plus rien depuis "+age+" s (nouvelle game ou page rechargée) : <b>reclique le favori « BBJ ➜ Drafter » sur la page Drafter</b>"; }
    else { h.className=""; h.textContent=""; } }
  const el=document.querySelector(".drstat"); if(el){ const age=drafterLast?Math.round((Date.now()-drafterLast)/1000):null; el.className="drstat "+(age!=null&&age<5?"on":age!=null?"off":""); el.textContent=age!=null&&age<5?"Drafter ✓":"Drafter"; } },1000);

// ---------- Historique des séries ----------
function seriesScore(gs){ const w=gs.filter(g=>g.result==="W").length, l=gs.filter(g=>g.result==="L").length; return w+"-"+l; }
function archiveSeries(keepPrep){
  const games=live.series.games.slice(); if(live.draft.actions.every(Boolean)) games.push({side:live.draft.side,actions:live.draft.actions,result:live.draft.result||null});
  if(!games.length) return;
  const opp=prep.opponent||(prep.players||[]).map(p=>String(p.name||"").split("#")[0]).filter(Boolean).slice(0,3).join(", ")||"Adversaire";
  history.series.unshift({date:new Date().toLocaleDateString("fr-FR"), opponent:opp, type:"Scrim", lineup:{...prep.lineup}, games,
    scouting:{link:prep.link||"", players:prep.players||[]}}); // op.gg de l'adversaire gardé pour les futurs profils
  persist("history"); if(keepPrep){ flash("Série précédente enregistrée dans l'historique"); return; } clearPrep(); flash("Série enregistrée dans l'historique, préparation remise à zéro");
}
// Série terminée : la préparation de l'adversaire (op.gg, bans) est vidée, on garde notre nom et notre line-up
function clearPrep(){ prep.opponent=""; prep.link=""; prep.ids=[]; prep.players=[]; prep.request=null; prep.updatedAt=""; persist("prep"); }
// Stats de la game importées du client LoL (script d'export) : par rôle, nous contre eux
function statsHtml(st){ if(!st||!st.us) return "";
  const k=x=>`${x.k}/${x.d}/${x.a}`, g=x=>(x.gold/1000).toFixed(1)+"k", O=o=>`${o.towers} tours · ${o.drakes} drakes · ${o.barons} barons · ${o.herald} héraut · ${o.grubs} larves`;
  const tot=(t,f)=>ROLES.reduce((a,r)=>a+(t[r]?t[r][f]:0),0);
  return `<div class="gstats"><h4>Stats de la game · ${st.min} min</h4><table><tr><th></th><th>Nous</th><th>Or</th><th>CS</th><th>Dégâts</th><th>Vision</th><th></th><th>Eux</th><th>Or</th><th>CS</th></tr>
   ${ROLES.map(r=>{ const u=st.us[r], t=st.them[r]; if(!u||!t) return ""; const dg=u.gold-t.gold; return `<tr><td>${ROLE_NAMES[r]}</td><td>${k(u)}</td><td class="${dg>=1000?"w":dg<=-1000?"l":""}">${g(u)}</td><td>${u.cs}</td><td>${(u.dmg/1000).toFixed(1)}k</td><td>${u.vis}</td><td></td><td>${k(t)}</td><td>${g(t)}</td><td>${t.cs}</td></tr>`; }).join("")}
   <tr class="tot"><td>Total</td><td>${tot(st.us,"k")} kills</td><td>${(tot(st.us,"gold")/1000).toFixed(1)}k</td><td colspan="4"></td><td>${tot(st.them,"k")} kills</td><td>${(tot(st.them,"gold")/1000).toFixed(1)}k</td><td></td></tr></table>
   <p class="muted">Nous : ${O(st.objUs)}<br>Eux : ${O(st.objThem)}</p></div>`; }
function viewHistory(){
  const S=history.series||[];
  if(ui.hist&&S[ui.hist.s]&&S[ui.hist.s].games[ui.hist.g]){ const s=S[ui.hist.s], g=s.games[ui.hist.g];
    return `<div class="dtop"><button class="btn sm" data-act="hclose">← Historique</button><b>${esc(s.date)} · ${esc(s.type||"Scrim")} vs ${esc(s.opponent)} · Game ${ui.hist.g+1} ${g.result==="W"?"(victoire)":g.result==="L"?"(défaite)":""}</b></div>
      ${(()=>{ ui.histOpp=s.opponent||""; const h=`<section class="arena">${boardCol("B",g,true)}<div class="center">${finalHtml(g,"hist")}${statsHtml(g.stats)}</div>${boardCol("R",g,true)}</section>`; ui.histOpp=null; return h; })()}`; }
  if(!S.length) return `<section class="card"><h3>Historique</h3><p class="muted">Aucune série enregistrée. « Nouvelle série » archive la série en cours ici.</p></section>`;
  return S.map((s,si)=>`<section class="card hs"><h3>${esc(s.date)} · vs <input class="hopp" data-act="hopp" data-s="${si}" value="${esc(s.opponent)}"> <span class="tag ${seriesScore(s.games).split("-")[0]>seriesScore(s.games).split("-")[1]?"ok":"ko"}">${seriesScore(s.games)}</span>
    <button class="btn sm" data-act="htype" data-s="${si}" title="Changer le type">${esc(s.type||"Scrim")}${(s.type||"Scrim")==="Scrim"?` · ${s.games.length} games`:""}</button>${s.note?` <span class="muted">${esc(s.note)}</span>`:""}</h3>
    ${s.games.map((g,gi)=>{ const us=g.side, them=us==="B"?"R":"B", P=t=>g.actions.filter((a,i)=>a&&a.name&&STEPS[i][0]==="pick"&&STEPS[i][1]===t);
      return `<div class="hg" data-act="hview" data-s="${si}" data-g="${gi}"><b class="${g.result==="W"?"w":g.result==="L"?"l":""}">G${gi+1} ${g.result==="W"?"✓":g.result==="L"?"✗":"·"}</b><span class="muted">${us==="B"?"Blue":"Red"}</span>
        <span class="hp">${P(us).map(a=>av(a.name,"sm")).join("")}</span><span class="muted">vs</span><span class="hp">${P(them).map(a=>av(a.name,"sm")).join("")}</span>${g.note?`<span class="muted">${esc(g.note)}</span>`:""}</div>`; }).join("")}</section>`).join("");
}

// ---------- Draft ----------
function targetIndex(){ return ui.edit!=null? ui.edit : curStep(); }
const ourName=()=>prep.team||"BBJ", theirName=()=>(ui.histOpp!=null?ui.histOpp:prep.opponent)||"Adversaire";
// côté de BBJ : choisi d'un clic au début de chaque game, sauf si Drafter affiche BBJ / Blocked by Jungle
const curGameNo=()=>live.series.games.length+1;
const sideOk=()=>live.sideHow==="nom"||live.sideManual===curGameNo();
function sidePrompt(){ return `<div class="sidepick"><h2>Game ${curGameNo()} : de quel côté joue ${esc(ourName())} ?</h2><p class="muted">Tout l'outil (ordre, suggestions, bans) s'adapte à ce choix.</p>
  <div class="sidebtns"><button class="sbB" data-act="side" data-v="B">Blue</button><button class="sbR" data-act="side" data-v="R">Red</button></div></div>`; }
function viewDraft(){
  const d=live.draft, gameNo=live.series.games.length+1;
  const top=`<div class="dtop">
    <div class="gtabs">${live.series.games.map((g,k)=>`<button class="gtab ${ui.viewGame===k?"on":""} ${g.result==="W"?"w":g.result==="L"?"l":""}" data-act="viewgame" data-k="${k}">G${k+1}${g.result?(g.result==="W"?" ✓":" ✗"):""}</button>`).join("")}<button class="gtab ${ui.viewGame==null?"on":""}" data-act="viewgame" data-k="-1">Game ${gameNo}</button></div>
    ${ui.viewGame==null?`<div class="seg">${["B","R"].map(s=>`<button data-act="side" data-v="${s}" class="${d.side===s?"on "+s:""}">${s==="B"?"Blue":"Red"}</button>`).join("")}</div>`:""}
    <div class="sl2">${ROLES.map(r=>`<span class="lu"><em>${ROLE_NAMES[r]}</em>${esc(prep.lineup[r])}</span>`).join("")}<button class="lnk" data-act="goprep">modifier</button></div>
    <button class="btn sm" data-act="newseries">Nouvelle série</button></div>`;
  if(ui.viewGame!=null){ const g=live.series.games[ui.viewGame];
    return top+`<section class="arena">${boardCol("B",g,true)}<div class="center">${finalHtml(g,true)}</div>${boardCol("R",g,true)}</section>`; }
  return top+`<section class="arena">${boardCol("B",d)}<div class="center">${sideOk()?viewCenter():sidePrompt()}</div>${boardCol("R",d)}</section>`+(ui.scout?scoutModal():"");
}
function viewCenter(){
  const d=live.draft, i=targetIndex();
  const locked=live.series.locked.length?`<div class="locked"><span>Fearless</span>${live.series.locked.map(n=>`<span class="lk" title="${esc(n)}">${av(n,"sm")}</span>`).join("")}</div>`:"";
  if(i===-1) return locked+finalHtml(d,false);
  const [t,s]=STEPS[i], ours=s===d.side, editing=ui.edit!=null;
  const who=editing?"CORRECTION":(ours?ourName():theirName());
  let h=`<div class="turn ${s}${ours?" ours":""}${editing?" edit":""}"><span class="tw">${esc(who)}</span><span class="ta">${editing?(t==="ban"?"ban":"pick"):(t==="ban"?"BAN":"PICK")}</span></div>`+locked;

  if(ours&&!editing) h+=`<div class="sugg">${t==="ban"?banBubbles():duoRow()+pickBubbles()}</div>`;
  return h+grid();
}
let lastRecs={};
function bubble(x,role,dim){
  const hk=x.name+"|"+(role||""); lastRecs[hk]=x; const sel=ui.pending&&ui.pending.name===x.name;
  return `<button class="bub${dim?" dim":""}${x.prep?" prep":""}${sel?" sel":""}" data-act="choose" data-n="${esc(x.name)}" ${role?`data-r="${role}"`:""} data-h="${esc(hk)}">
    ${av(x.name,"lg")}${x.rank?`<span class="sc rank${x.rank<=3?" hi":""}">${x.rank}</span>`:`<span class="sc ${x.score>=85?"hi":x.score>=72?"md":""}">${x.score}</span>`}${x.duo?'<span class="duom" title="Duo avéré avec un de vos picks">duo</span>':""}<span class="bn">${esc(x.name)}</span></button>`;
}
function pickBubbles(){
  const r=recommendPicks(cfg,live.series,live.draft,prep.lineup,24); lastRecs={};
  return Object.keys(r).map(role=>`<div class="rrow"><div class="rl"><b>${ROLE_NAMES[role]}</b><span>${esc(prep.lineup[role])}</span></div>
    <div class="bubs fill">${r[role].list.map(x=>bubble(x,role,false)).join("")||'<span class="muted">Pool vide</span>'}</div></div>`).join("");
}
function duoRow(){
  const D=recommendDuos(cfg,live.series,live.draft,prep.lineup,20); if(!D.length) return "";
  return `<div class="rrow duo"><div class="rl"><b>Duos</b></div><div class="bubs fill duos">${D.map(x=>`<button class="duob${x.team?" team":""}" data-act="duo" data-a="${esc(x.a.name)}" data-ra="${x.roles[0]}" data-b="${esc(x.b.name)}" data-rb="${x.roles[1]}" title="${esc(x.a.name)} + ${esc(x.b.name)}${x.pro?` · ${x.pro.n} games ensemble en pro (${x.pro.wr} % de victoires)`:""}${x.team?" · déjà joués en équipe":""}${x.answer?" · répond à leurs picks":""}${x.edge&&x.edge.why.length?` · botlane estimée ${x.edge.v>0?"+":""}${x.edge.v} pts (${esc(x.edge.why.join(", "))})`:""}">
     ${av(x.a.name,"md")}${av(x.b.name,"md")}</button>`).join("")}</div></div>`;
}
function banBubbles(){
  const r=recommendBans(cfg,live.series,live.draft,prep,prep.lineup,24); lastRecs={};
  r.forEach((x,k)=>{ x.rank=k+1; lastRecs[x.name]=x; });
  const phase2=live.draft.actions.filter((a,i)=>a&&STEPS[i][0]==="pick").length>=6;
  return `<div class="rrow"><div class="rl"><b>Bans</b><span>${phase2?"picks 4-5":(prep.players||[]).length?"préparation":"pro / méta"}</span></div>
    <div class="bubs fill">${r.map(x=>bubble(x,null,false)).join("")}</div></div>`;
}
function grid(){
  const un=unavailable(live.series,live.draft); const q=normName(ui.gridQ); const p=ui.pending;
  let list=CHAMP_NAMES.filter(n=>(ui.gridRole==="all"||CHAMPS[n].roles.includes(ui.gridRole))&&(!q||normName(n).includes(q)));
  // Notre tour de pick : étoile sur nos champions S à B (tier du joueur du rôle filtré, sinon meilleur tier parmi nos rôles encore libres)
  const ti=targetIndex(), ourPick=ti>=0&&STEPS[ti][0]==="pick"&&STEPS[ti][1]===live.draft.side, TR={S:3,A:2,B:1};
  const freeR=ROLES.filter(r=>!teamPicks(live.draft,live.draft.side).some(a=>a.role===r&&!a.flex));
  const ourT=n=>{ if(!ourPick) return null; const rs=ui.gridRole==="all"?freeR.filter(r=>CHAMPS[n].roles.includes(r)):[ui.gridRole];
    let best=null; rs.forEach(r=>{ const t=tierFor(cfg,prep.lineup[r],r,n); if(TR[t]&&(!best||TR[t]>TR[best.t])) best={t,r}; }); return best; };
  const T={}; list.forEach(n=>T[n]=ourT(n));
  if(ourPick&&ui.gridRole!=="all") list=list.slice().sort((a,b)=>(un.has(a)-un.has(b))||((T[b]?TR[T[b].t]:0)-(T[a]?TR[T[a].t]:0))||a.localeCompare(b));
  return `<div class="gridbox"><div class="gtools"><input id="gq" data-act="gq" value="${esc(ui.gridQ)}" placeholder="Rechercher un champion…" autocomplete="off">
    ${[["all","Tous"],...ROLES.map(r=>[r,ROLE_NAMES[r]])].map(([k,l])=>`<button class="rf ${ui.gridRole===k?"on":""}" data-act="grole" data-v="${k}">${l}</button>`).join("")}</div>
    <div class="cgrid">${list.map(n=>{ const off=un.has(n)&&!(ui.edit!=null&&live.draft.actions[ui.edit]&&live.draft.actions[ui.edit].name===n);
      return `<button class="gc${off?" off":""}${p&&p.name===n?" sel":""}" ${off?"disabled":""} data-act="choose" data-n="${esc(n)}" title="${esc(n+(T[n]?` · tier ${T[n].t} de ${prep.lineup[T[n].r]} (${ROLE_NAMES[T[n].r]})`:""))}">${av(n,"md")}${T[n]?`<i class="star t${T[n].t}">★</i>`:""}<span>${esc(n)}</span></button>`; }).join("")}</div>
    <div class="cbar">${p?`${av(p.name,"md")}<b>${esc(p.name)}</b>`:`<span class="muted">Clique un champion puis confirme (double-clic = direct)</span>`}<span class="sp"></span>
      ${ui.edit!=null?`<button class="btn" data-act="clearslot">Vider</button><button class="btn" data-act="canceledit">Annuler</button>`:(curStep()!==0?`<button class="btn" data-act="undo" title="Annuler la dernière étape">↶ Retour</button>`:"")}
      <button class="btn pri confirm" data-act="confirm" ${p?"":"disabled"}>Confirmer</button></div></div>`;
}
function tipHtml(x){
  const parts=(x.parts||[]).filter(p=>!p[3]);
  return `<b>${esc(x.name)}</b> <span class="sc">${x.rank?"ban n°"+x.rank:x.score+"/100"}</span>${parts.length?`<div class="bars b${parts.length}">${parts.map(p=>`<span><i style="width:${Math.round(p[1]*100)}%"></i><em>${p[0]}</em></span>`).join("")}</div>`:""}<div class="why">${x.why.map(esc).join("<br>")}</div>`;
}
function finalHtml(d,ro){
  const A=analyzeFinal(cfg,d,prep,prep.lineup); const us=d.side;
  const card=(lbl,T)=>`<div class="acard"><em>${esc(lbl)}</em><div>${T.tags.strong.map(x=>`<span class="tag ok">${esc(x)}</span>`).join("")||'<span class="muted">—</span>'}</div>
    ${T.tags.weak.length?`<div>${T.tags.weak.map(x=>`<span class="tag ko">${esc(x)}</span>`).join("")}</div>`:""}
    ${T.synList.length?`<div class="muted">Synergies : ${T.synList.map(esc).join(" · ")}</div>`:""}</div>`;
  return `<div class="final"><div class="winbox"><div class="wl">${esc(us==="R"?theirName():ourName())}</div><div class="wbar${us==="R"?" rev":""}"><i style="width:${A.win}%"></i><b>${A.win} %</b></div><div class="wl r">${esc(us==="R"?ourName():theirName())}</div></div>
    ${A.plan.key&&A.plan.key.length?`<div class="row c">${A.plan.key.map(k=>`<span class="tag ok">${esc(k)}</span>`).join("")}</div>`:""}
    <div class="acards">${us==="R"?card(theirName(),A.them)+card(ourName(),A.us):card(ourName(),A.us)+card(theirName(),A.them)}</div>
    ${A.lanes.length?`<div class="lanes">${A.lanes.map(l=>`<span class="lane ${l.wr>=53?"w":l.wr<=47?"l":""}" ${l.detail?`title="${esc(l.detail)}"`:""}>${l.role==="B"?"Botlane":ROLE_NAMES[l.role]} : ${(()=>{ const o=av(l.ours,"xs")+(l.ours2?av(l.ours2,"xs"):""), t=av(l.theirs,"xs")+(l.theirs2?av(l.theirs2,"xs"):""); return us==="R"?t+" vs "+o:o+" vs "+t; })()} <b title="Notre winrate">${l.wr}%</b></span>`).join("")}</div>`:""}
    ${[["Early (0-14 min)",A.plan.early],["Mid game (14-25 min)",A.plan.mid],["Late game",A.plan.late]].filter(x=>x[1]&&x[1].length).map(x=>`<div class="ph"><em>${x[0]}</em><ul class="plan">${x[1].map(p=>`<li>${esc(p)}</li>`).join("")}</ul></div>`).join("")}
    ${d===live.draft||live.series.games.includes(d)?`<div class="row c res"><span class="muted">Résultat :</span><button class="btn sm ${d.result==="W"?"on w":""}" data-act="result" data-v="W">Victoire</button><button class="btn sm ${d.result==="L"?"on l":""}" data-act="result" data-v="L">Défaite</button></div>`:""}
    ${ro==="hist"?"":ro?`<div class="row c"><button class="btn" data-act="viewgame" data-k="-1">Retour à la draft en cours</button></div>`:`<div class="row c"><button class="btn pri big" data-act="nextgame">Partie suivante → game ${live.series.games.length+2}</button><button class="btn big" data-act="endseries" title="Archive la série et lance l'export des stats depuis le client LoL">Fin de série</button><span class="muted">Clique un champion du tableau pour le corriger</span></div>`}</div>`;
}
function boardCol(team,d,ro){
  const i=ro?-1:targetIndex(); const active=!ro&&i>=0&&STEPS[i][1]===team;
  const slots=STEPS.map((s,k)=>({s,k})).filter(x=>x.s[1]===team);
  const bans=slots.filter(x=>x.s[0]==="ban"), picks=slots.filter(x=>x.s[0]==="pick");
  const pv=k=>!ro&&k===i&&ui.pending?ui.pending.name:null;
  const ban=x=>{const a=d.actions[x.k], p=pv(x.k); return `<button class="ban ${x.k===i?"cur":""} ${p?"pv":""}" ${ro?"disabled":""} data-act="editslot" data-k="${x.k}">${p?av(p,"md"):a&&a.miss?`<span class="miss" title="Ban raté">∅</span>`:a?av(a.name,"md"):""}</button>`;};
  // Pool restant de l'adversaire : pour chaque rôle encore libre, ses champions les plus joués encore disponibles
  let pools=null, pi=0;
  if(!ro&&team!==d.side){ try{ pools=(prep.players||[]).length?predictEnemy(cfg,live.series,d,prep,prep.lineup,5).map(q=>({...q,list:q.list.map(c=>({name:c.name,why:c.why,danger:c.danger}))})):null; }catch(e){ pools=null; } }
  // Nos idées de picks pendant les bans 1 : bulles dans nos premières cases (bleu : first pick ; rouge : paires R1-R2)
  let ideas=null; const pk0=d.actions.findIndex(a=>!a);
  if(!ro&&team===d.side&&pk0>=0&&pk0<6&&sideOk()){ try{ ideas=pickIdeas(cfg,live.series,d,prep.lineup,14); }catch(e){ ideas=null; } }
  let ii=0;
  const pick=x=>{const a=d.actions[x.k], p=pv(x.k);
    if(ideas&&ideas.kind==="R"&&ii===1&&!a&&!p){ ii++; return ""; } // rouge : la case R2 est fusionnée avec R1
    if(!a&&!p&&ideas&&ideas.list.length&&ii<1){ ii++;
      return `<div class="pk empty pred ideas${ideas.kind==="R"?" tall":""}"><div class="prl">${ideas.kind==="B"?"Idées de first pick":"Idées de paires R1-R2"}</div><div class="prb fit1">${ideas.kind==="B"
        ?ideas.list.map(c=>`<span class="prc" title="${esc(c.name+" · "+ROLE_NAMES[c.role]+" · score "+c.score+" · "+c.why.slice(0,3).join(" · "))}">${av(c.name,"md")}<em>${c.score}</em></span>`).join("")
        :ideas.list.map(c=>`<span class="pair v" title="${esc(c.a.name+" + "+c.b.name+" · score "+c.score+" · "+c.why.join(" · "))}">${av(c.a.name,"sm")}${av(c.b.name,"sm")}<em>${c.score}</em></span>`).join("")}</div></div>`; }
    // un champion présélectionné (pas encore confirmé) occupe la case : il « consomme » la ligne de son rôle pour ne pas décaler les suivantes
    if(!a&&p&&pools&&pools.length>pi){ const rs=CHAMPS[p]?CHAMPS[p].roles:[]; let j=pools.findIndex((q,k)=>k>=pi&&rs[0]===q.role); if(j<0) j=pools.findIndex((q,k)=>k>=pi&&rs.includes(q.role)); if(j<0) j=pi; pools.splice(pi,0,pools.splice(j,1)[0]); pi++; }
    if(!a&&!p&&pools&&pools[pi]){ const q=pools[pi++];
      return `<div class="pk empty pred ${x.k===i?"cur":""}"><div class="prl">${ROLE_NAMES[q.role]}${q.player?` · ${esc(q.player)}`:""}</div><div class="prb">${q.list.length?q.list.map(c=>`<span class="prc${c.danger?" dgr":""}" title="${esc((c.danger?"⚠ Très dangereux pour votre compo · ":"")+c.name+" · "+(c.why||[]).slice(0,3).join(" · "))}">${av(c.name,"md")}</span>`).join(""):'<span class="muted">pool épuisé</span>'}</div></div>`; }
    if(!a&&!p) return `<div class="pk empty ${x.k===i?"cur":""}"></div>`;
    if(a&&a.miss&&!p) return `<div class="pk miss ${x.k===i?"cur":""}" ${ro?"":`data-act="editslot" data-k="${x.k}" title="Clique pour indiquer le champion"`}><span class="miss">∅</span><div class="pki"><span class="muted">Pick raté : clique pour corriger</span></div></div>`;
    if(p) return `<div class="pk cur pv">${av(p,"xl")}<div class="pki"><span class="nm">${esc(p)}</span><span class="muted">à confirmer</span></div></div>`;
    const roles=CHAMPS[a.name]?CHAMPS[a.name].roles:ROLES;
    return `<div class="pk ${x.k===i?"cur":""}"><button class="pkb" ${ro?"disabled":""} data-act="editslot" data-k="${x.k}" title="Corriger">${av(a.name,"xl")}</button><div class="pki"><span class="nm">${esc(a.name)}${a.fx&&a.flex?` <b class="fxq" title="${esc("Flex possible : "+a.fx)}">Flex ?</b>`:a.flex?" <b class='fx'>*</b>":""}</span>
      ${ro?`<span class="muted">${ROLE_NAMES[a.role]||""}</span>`:`<select data-act="role" data-k="${x.k}">${ROLES.map(r=>`<option value="${r}" ${a.role===r?"selected":""}>${ROLE_NAMES[r]}${roles.includes(r)?"":" ?"}</option>`).join("")}</select>`}</div>
      ${ro?"":`<button class="flex ${a.flex?"on":""}" data-act="flex" data-k="${x.k}" title="Flex pick : rôle incertain">*</button>`}</div>`;};
  const name=d.side===team?ourName():theirName();
  return `<div class="colw"><div class="tname ${team}">${esc(name)}</div><div class="col ${team}${d.side===team?" us":""}${active?" active":""}">
    <div class="bans">${bans.slice(0,3).map(ban).join("")}<i></i>${bans.slice(3).map(ban).join("")}</div>${scoutRow(team,d)}${picks.map(pick).join("")}</div></div>`;
}

// ---------- Fiches des joueurs adverses (icônes sous les bans adverses) ----------
const ROLE_SVG={
 T:'<path d="M3 3h13l-4 4H7v5l-4 4z" fill="currentColor"/><path d="M10 10h4v4h-4z M21 7v14H7l3-3h8V10z" fill="currentColor" opacity=".45"/>',
 J:'<path d="M3 21c1-5 0-9-2-13 3 2 5 6 5 13zM8.5 21c0-8 1.5-13 4.5-18-.5 6-1.5 12-1.5 18zM13.5 21c0-6 2-10.5 6.5-13.5-2.5 4-3.5 8.5-3.5 13.5zM18.5 21c.5-3 2-5.5 4.5-6.5-1.5 2-2 4-2 6.5z" fill="currentColor"/>',
 M:'<path d="M3 17l14-14h4v4L7 21H3z" fill="currentColor"/><path d="M3 3h8L3 11zM21 21h-8l8-8z" fill="currentColor" opacity=".45"/>',
 A:'<path d="M21 21H8l4-4h5v-5l4-4z" fill="currentColor"/><path d="M10 10h4v4h-4z M3 17V3h14l-3 3H6v8z" fill="currentColor" opacity=".45"/>',
 S:'<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" fill="currentColor"/><path d="M12 5.2l5 1.9V11c0 3.4-2.2 6.2-5 7.7z" fill="#11141b" opacity=".35"/>'};
const roleIcon=(r,s=18)=>`<svg class="ricon" viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true">${ROLE_SVG[r]}</svg>`;
function scoutRow(team,d){
  if(team===d.side) return ""; let P=[]; try{ P=prepPlayers(prep); }catch(e){} if(!P.length) return "";
  return `<div class="scout">${ROLES.map(r=>{ const p=P.find(x=>x.role===r); return p?`<button class="scb" data-act="scout" data-r="${r}" title="${ROLE_NAMES[r]} : ${esc(p.name.split("#")[0])} — voir sa fiche">${roleIcon(r,22)}</button>`:""; }).join("")}</div>`;
}
function scoutProfile(p,P){
  const L=p.list, tot=L.reduce((s,x)=>s+x.g,0)||1, w=x=>x.g/tot;
  const ax={}; AXES.forEach(a=>ax[a]=L.reduce((s,x)=>s+w(x)*((CHAMPS[x.c]||{})[a]||0),0));
  const top=AXES.slice().sort((a,b)=>ax[b]-ax[a]).filter(a=>ax[a]>=1.6).slice(0,3);
  const dm={}; L.forEach(x=>{ const k=(CHAMPS[x.c]||{}).dmg||"?"; dm[k]=(dm[k]||0)+w(x); }); const dmg=Object.keys(dm).sort((a,b)=>dm[b]-dm[a])[0];
  const s1=w(L[0]||{g:0}), s3=L.slice(0,3).reduce((s,x)=>s+w(x),0);
  const shape=s1>=0.45?`One-trick ${L[0].c} : ${Math.round(s1*100)} % de ses games`:s3>=0.7?`Pool resserré : ${L.slice(0,3).map(x=>x.c).join(", ")} font ${Math.round(s3*100)} % de ses games`:`Pool large : ${L.length} champions joués`;
  // champion qu'il joue souvent mais avec de mauvais résultats : il risque de le prendre, inutile de le bannir
  const trap=L.filter(x=>x.wr!=null&&x.g>=Math.max(20,tot*0.06)&&x.wr<=47).sort((a,b)=>a.wr-b.wr)[0];
  const early=ax.early-ax.scaling;
  // Flex : champions de son pool jouables à son rôle mais surtout joués ailleurs (ADC qui joue Syndra, top qui joue des mids…)
  // Flex = champion présent dans le pool affiché de deux de leurs joueurs (chacun à son rôle, ≥ 5 games)
  const shown=q=>q.list.slice(0,15).filter(y=>y.g>=5);
  const fx=shown(p).map(x=>({c:x.c, o:(P||[]).filter(q=>q!==p&&shown(q).some(y=>y.c===x.c))})).filter(x=>x.o.length).slice(0,4);
  const off={}; (p.all||[]).forEach(x=>{ const c=CHAMPS[x.c]; if(x.g>=10&&c&&!c.roles.includes(p.role)){ const r=c.roles[0]; (off[r]=off[r]||[]).push(x.c); } });
  const offR=Object.keys(off).sort((a,b)=>off[b].length-off[a].length)[0];
  const lines=[shape, top.length?`Style : ${top.map(a=>AXIS_FR[a]).join(", ")}${Math.abs(early)>=0.5?(early>0?" · cherche l'early":" · joue le scaling"):""}`:"", fx.length?`Flex : ${fx.map(x=>`${x.c} (aussi ${x.o.map(q=>`${q.name.split("#")[0]} en ${ROLE_NAMES[q.role].toLowerCase()}`).join(", ")})`).join(" · ")}`:"", trap?`À laisser : il joue souvent ${trap.c} (${trap.g} games) mais seulement ${trap.wr} % de victoires, pas besoin de le bannir`:""];
  const op=offPool(p); if(op.length) lines.push(`Hors de son op.gg, peut sortir : ${op.map(x=>`${x.c} (${x.why})`).join(" · ")}`);
  return lines.filter(Boolean);
}
// Champions absents de son op.gg mais crédibles à son rôle : très présents en pro ou très joués en solo Q, proches de son style
function offPool(p,k=3){
  const has=new Set(p.list.filter(x=>x.g>=5).map(x=>x.c)), L=p.list, tot=L.reduce((s,x)=>s+x.g,0)||1;
  const st={}; AXES.forEach(a=>st[a]=L.reduce((s,x)=>s+x.g/tot*((CHAMPS[x.c]||{})[a]||0),0));
  const nst=Math.sqrt(AXES.reduce((s,a)=>s+st[a]*st[a],0))||1; let un=new Set(); try{ un=unavailable(live.series,live.draft); }catch(e){}
  return CHAMP_NAMES.filter(c=>CHAMPS[c].roles.includes(p.role)&&!has.has(c)&&!un.has(c)).map(c=>{ const m=metaInfo(c,p.role); if(m.off) return null;
    const pr=PRO[c], pro=pr?clamp01((pr.p+pr.b)/400):0, sq=clamp01((m.pres||0)/25), pop=Math.max(pro,sq);
    const C=CHAMPS[c], nc=Math.sqrt(AXES.reduce((s,a)=>s+C[a]*C[a],0))||1, sim=AXES.reduce((s,a)=>s+C[a]*st[a],0)/(nc*nst);
    return {c, s:0.65*pop+0.35*sim, why:pro>=sq?`très présent en pro, ${pr.p+pr.b} drafts`:`très joué en solo Q, ${m.pres} %`};
  }).filter(x=>x&&x.s>=0.5).sort((a,b)=>b.s-a.s).slice(0,k);
}
function scoutModal(){
  const r=ui.scout; let P=[]; try{ P=prepPlayers(prep); }catch(e){} const p=P.find(x=>x.role===r); if(!p) return "";
  const un=unavailable(live.series,live.draft), I=ctrIndex(cfg), our=prep.lineup[r];
  const RK=rankPlayers(P), me=RK.find(x=>x.p===p), S=me.s;
  const ours=CHAMP_NAMES.filter(c=>{ const t=tierFor(cfg,our,r,c); if(!((t==="S"||t==="A")&&CHAMPS[c].roles.includes(r))) return false;
    if(un.has(c)) return false; const a=affinity(cfg,our,r,c); return a.games>=3||metaInfo(c,r).v>=0.75; }); // joué en scrim/compétition ou très méta, encore disponible
  const theirs=p.list.filter(x=>x.g>=5&&!un.has(x.c)).slice(0,12);
  const threats=[], answers=[];
  theirs.forEach(x=>ours.forEach(o=>{ const g=ctrGet(I,x.c,o,r); if(g&&g[2]>=51.5) threats.push({c:x.c,o,wr:g[2],g:x.g}); const h=ctrGet(I,o,x.c,r); if(h&&h[2]>=51.5) answers.push({c:o,vs:x.c,wr:h[2],g:x.g}); }));
  const rank=a=>a.sort((x,y)=>(y.wr-50)*Math.log(2+y.g)-(x.wr-50)*Math.log(2+x.g));
  const st=c=>un.has(c)?(live.series.locked.includes(c)?"fearless":"pris/banni"):"";
  const chip=(c,extra="")=>`<span class="scc ${st(c)?"off":""} ${st(c)==="fearless"?"fl":""}" title="${esc(c+(st(c)?" · "+st(c):""))}">${av(c,"md")}<b>${esc(c)}</b>${extra}</span>`;
  const duel=(o,t,wr,mine)=>mine
    ?`<div class="scduel mine"><span class="us">${av(o,"sm")} ${esc(o)}</span><i>contre</i><span class="${st(t)?"off":""}">${av(t,"sm")} ${esc(t)}</span><em title="Winrate de notre ${esc(o)}">${Math.round(wr*10)/10} %</em></div>`
    :`<div class="scduel"><span class="${st(t)?"off":""}">${av(t,"sm")} ${esc(t)}</span><i>contre</i><span class="us">${av(o,"sm")} ${esc(o)}</span><em title="Winrate de notre ${esc(o)}">${Math.round((100-wr)*10)/10} %</em></div>`;
  return `<div class="scmodal" data-act="scoutclose"><div class="scbox" data-act="none">
   <div class="schead"><span class="scno r${me.rank}" title="Place dans leur cinq (LP et pic, puis rendement, puis pool méta)">#${me.rank}</span>${roleIcon(r,26)}<div><b>${esc(p.name.split("#")[0])}</b><span class="muted"> · ${ROLE_NAMES[r]}</span></div><button class="btn sm" data-act="scoutclose">✕</button></div>
   <div class="scstats">${p.rank?`<span><em>Rang</em>${esc(p.rank)}</span>`:""}${p.peak?`<span><em>Pic</em>${esc(p.peak)}</span>`:""}${S.games?`<span><em>Games</em>${S.games}</span>`:""}${S.wr!=null?`<span><em>WR</em>${S.wr} %</span>`:""}</div>

   <h4>Profil</h4><ul>${p.note?`<li class="flx">${esc(p.note)}</li>`:""}${scoutProfile(p,P).map(l=>`<li>${esc(l)}</li>`).join("")}${(()=>{ if(!live.series.locked.length) return "";
      const top=p.list.slice(0,6), used=top.filter(x=>live.series.locked.includes(x.c)), left=top.filter(x=>!un.has(x.c)).slice(0,4);
      return `<li class="flx">Fearless : ${used.length?`déjà joués ${used.map(x=>x.c).join(", ")}`:"aucun de ses conforts joué"}${left.length?` · il lui reste ${left.map(x=>x.c).join(", ")}`:" · plus aucun confort disponible"}</li>`; })()}</ul>
   <h4>Champion pool</h4>
   <div class="scpool grid" style="--n:${(n=>n<=8?n:Math.ceil(n/2))(Math.min(15,p.list.length))}">${p.list.slice(0,15).slice().sort((a,b)=>(!!st(a.c))-(!!st(b.c))).map(x=>chip(x.c,`<em>${x.g} g${x.wr!=null?` · ${x.wr} %`:""}</em>`)).join("")}</div>
   <h4>Ses champions qui contrent nos meilleurs (${esc(our||"?")})</h4>
   ${threats.length?`<div class="scduels">${rank(threats).slice(0,6).map(t=>duel(t.o,t.c,t.wr,false)).join("")}</div>`:`<p class="muted">Aucun counter net dans les données de matchups.</p>`}
   <h4>Nos réponses à ses champions</h4>
   ${answers.length?`<div class="scduels">${rank(answers).slice(0,6).map(t=>duel(t.c,t.vs,t.wr,true)).join("")}</div>`:`<p class="muted">Pas de réponse nette dans nos tiers S/A.</p>`}
  </div></div>`;
}

// ---------- Préparation ----------
function viewPrep(){
  const plan=banPlan(cfg,prep,prep.lineup), P=prepPlayers(prep);
  return `<section class="card"><h3>Notre équipe pour ce match</h3>
    <div class="row"><input data-act="pteam2" value="${esc(prep.team||"BBJ")}" placeholder="Nom de notre équipe"></div>
    <div class="lineup">${ROLES.map(r=>`<label><em>${ROLE_NAMES[r]}</em><select data-act="lineup" data-r="${r}">${playerOpts(prep.lineup[r])}</select></label>`).join("")}</div>
    ${dupWarn()}</section>
  <section class="card"><h3>Adversaire</h3>
    <div class="row"><input data-act="popp" value="${esc(prep.opponent)}" placeholder="Nom de l'équipe adverse"></div>
    <div class="row"><input data-act="plink" value="${esc(prep.link||"")}" placeholder="Colle ici le lien multi-op.gg des adversaires"></div>
    <div class="ids5">${ROLES.map((r,k)=>`<label><em>Joueur ${k+1}</em><input data-act="pid" data-k="${k}" value="${esc((prep.ids||[])[k]||"")}" placeholder="Pseudo#TAG"></label>`).join("")}</div>
    <div class="row"><button class="btn pri" data-act="askprep">Demander l'analyse op.gg</button><button class="btn sm" data-act="clearprep" title="Série terminée : vide l'adversaire, son op.gg et les bans de préparation">Effacer la préparation</button>${multiLink()?`<a class="lnk" href="${esc(multiLink())}" target="_blank" rel="noopener">Ouvrir le multi-op.gg</a>`:""}</div>
    <p class="muted">${reqStatus()}${prep.updatedAt?` Dernière mise à jour des profils : ${esc(prep.updatedAt)}.`:""}</p></section>
  <section class="card"><h3>Bans conseillés</h3>
    ${plan.length?`<p class="muted">Par ordre de priorité : 1 = le plus important. Il y en a 7 car l'adversaire bannit souvent une partie de ceux que vous visiez.</p><div class="bplan">${plan.slice(0,7).map((x,k)=>`<div class="bpc"><span class="rk">${k+1}</span>${av(x.name,"lg")}<b>${esc(x.name)}</b><span class="muted">${esc(x.player.split("#")[0])} · ${ROLE_NAMES[x.role]}</span>
      <div class="btags">${x.tags.map(t=>`<span class="tag ${t==="Meilleur joueur"?"star":"ok"}">${esc(t)}</span>`).join("")}${x.counters.length?`<span class="tag warn cnt">Counter :${x.counters.map(o=>`<span title="${esc(o.player)} · ${esc(o.champ)} ${o.wr} %">${av(o.champ,"xs")}</span>`).join("")}</span>`:""}</div>
      <ul class="bwhy">${x.why.map(w=>`<li>${esc(w)}</li>`).join("")}</ul></div>`).join("")}</div>`
      :`<div class="muted">Pas encore de profils adverses.</div>`}</section>
  ${P.length?`<section class="card"><h3>Profils adverses (solo Q)</h3>${P.map((p,k)=>`<div class="opp"><div class="row"><b>${esc(p.name)}</b><span class="muted">${esc(p.rank||"")}</span>${(()=>{const v=P.map(q=>rankValue(q.rank)); const me=v[k], o=v.filter((x,j)=>j!==k&&x!=null); const g=me!=null&&o.length?me-o.reduce((a,b)=>a+b,0)/o.length:0; return g>=400?`<span class="tag star">Meilleur joueur (+${Math.round(g)} LP)</span>`:"";})()}
      <select data-act="prole" data-k="${k}">${ROLES.map(r=>`<option value="${r}" ${p.role===r?"selected":""}>${ROLE_NAMES[r]}</option>`).join("")}</select></div>
      <div class="chips">${p.list.map(x=>`<span class="chip">${av(x.c,"sm")} ${esc(x.c)} <b>${x.g}</b><span class="muted">${x.wr!=null?x.wr+"%":""}</span></span>`).join("")}</div></div>`).join("")}</section>`:""}
  <details class="card" ${ui.manual?"open":""}><summary><h3>Saisie manuelle</h3></summary>
    <p class="muted">Une ligne par joueur : <b>Pseudo : Champion games WR, …</b> (ex. <i>Adv : Ornn 182 53, Garen 60 59</i>).</p>
    <textarea id="manual" rows="5">${esc(P.map(p=>p.name+" : "+p.list.map(x=>`${x.c} ${x.g} ${x.wr??""}`.trim()).join(", ")).join("\n"))}</textarea>
    <div class="row"><button class="btn" data-act="applymanual">Appliquer</button><button class="btn" data-act="clearprep">Effacer l'adversaire</button></div></details>`;
}
// Lien multi-op.gg -> Riot IDs (le rôle de chaque adversaire est déduit de ses champions)
function idsFromLink(url){
  try{ const u=new URL(url.trim()); const q=u.searchParams.get("summoners")||u.searchParams.get("summonerName")||"";
    return q.split(",").map(x=>x.trim()).filter(Boolean).map(x=>x.includes("#")?x:x.replace(/-([^-]+)$/,"#$1")).slice(0,5); }catch(e){ return []; }
}
function nextRun(){ const n=new Date(), h=n.getHours()+n.getMinutes()/60; return h<17.78?"aujourd'hui vers 17 h 47":"demain vers 17 h 47"; }
function multiLink(){ const ids=(prep.ids||[]).filter(x=>x&&x.includes("#")); return ids.length?"https://op.gg/fr/lol/multisearch/euw?summoners="+encodeURIComponent(ids.join(",")):""; }
function reqStatus(){ const q=prep.request; if(!q) return "Entre les pseudos (avec le #TAG) puis demande l'analyse : les profils et les bans conseillés se remplissent automatiquement pour toute l'équipe.";
  return q.status==="done"?"Analyse terminée.":q.status==="error"?"L'analyse a échoué : "+esc(q.note||"")+".":`Analyse demandée le ${esc(q.at)} : elle sera faite automatiquement ${nextRun()}. Si c'est urgent, envoie le lien à Claude dans la conversation.`; }
function dupWarn(){ const v=ROLES.map(r=>prep.lineup[r]); const d=v.filter((p,k)=>v.indexOf(p)!==k); return d.length?`<div class="warn">⚠ ${esc(d.join(", "))} est placé sur deux rôles.</div>`:""; }

// ---------- Pools ----------
function viewPools(){
  const p=PLAYERS.find(x=>x.id===ui.poolPlayer)||PLAYERS[0], role=p.main;
  const names=poolOf(cfg,p.id,role); const rows={S:[],A:[],B:[],C:[],D:[],"?":[]};
  names.forEach(c=>{ const t=(cfg.tiers[p.id]||{})[c]; rows[t||"?"].push({c,a:affinity(cfg,p.id,role,c)}); });
  for(const k in rows) rows[k].sort((x,y)=>y.a.v-x.a.v);
  const cell=x=>`<button class="pc" data-act="tierpop" data-c="${esc(x.c)}">${av(x.c,"lg")}<span class="pn">${esc(x.c)}</span>
     <span class="pm">${x.a.games?`<b>${x.a.games}</b> g.`:""}${x.a.sq?` <i>SQ ${x.a.sq.g}</i>`:""}</span></button>`;
  return `<nav class="ptabs">${PLAYERS.map(x=>`<button data-act="pplayer" data-p="${esc(x.id)}" class="${x.id===p.id?"on":""}">${esc(x.id)}<em>${ROLE_NAMES[x.main]}</em></button>`).join("")}</nav>
  <section class="card"><p class="muted">Sous chaque champion : games en scrim/compétition (Parthenon) et games en solo Q (SQ). Clique un champion pour changer son tier.</p>
   ${["S","A","B","C","D","?"].map(t=>rows[t].length||t!=="?"?`<div class="trow"><div class="tl t${t==="?"?"Q":t}">${t==="?"?"SQ":t}</div><div class="tcs">${rows[t].map(cell).join("")||'<span class="muted">—</span>'}</div></div>`:"").join("")}
   ${ui.tierPop?`<div class="pop"><b>${esc(ui.tierPop)}</b>${["S","A","B","C","D"].map(t=>`<button data-act="settier" data-t="${t}">${t}</button>`).join("")}<button data-act="settier" data-t="-">Retirer</button><button data-act="settier" data-t="x">×</button></div>`:""}
   <div class="row"><input list="champs" id="addpool" placeholder="Ajouter un champion au pool de ${esc(p.id)}…"><button class="btn" data-act="addpool">Ajouter</button></div></section>`;
}

// ---------- Réglages ----------
function viewSettings(){
  const W=cfg.weights; for(const k of Object.keys(W)) if(!(k in {affinite:1,force:1,synergie:1,matchup:1})) delete W[k]; const lab={affinite:"Affinité : games en scrim/compétition + solo Q",force:"Méta : games pro récentes + solo Q du patch",synergie:"Synergie avec vos picks + cohérence de la compo (comble-t-il une faiblesse ?)",matchup:"Matchup contre leurs picks (ou capacité à être blind pick) ; compte 35 % de plus en top"};
  return `<section class="card"><h3>Poids du score sur 100</h3>${Object.keys(W).map(k=>`<label class="sl">${lab[k]} <b>${W[k]}</b><input type="range" min="0" max="50" value="${W[k]}" data-act="w" data-k="${k}"></label>`).join("")}
   <label class="chk"><input type="checkbox" data-act="exd" ${cfg.excludeD?"checked":""}> Ne jamais proposer un champion en tier D</label></section>
   <section class="card"><h3>Ordre des rôles en draft</h3><p class="muted">Du rôle pické le plus tôt au plus tard. Il ordonne les lignes de suggestions et pénalise, en début de draft seulement, un rôle pické trop tôt (critère Timing). Le support remonte dès que l'ADC est pris.</p>
   <div class="row">${roleOrderOf(cfg).map((r,k)=>`<span class="tag">${k+1}. ${ROLE_NAMES[r]}${k?` <button class="btn sm" data-act="rup" data-r="${r}" title="Monter">↑</button>`:""}</span>`).join("")}</div></section>
   <section class="card"><h3>Sources</h3><p class="muted">Force : OP.GG patch 26.22 ajusté avec les notes du patch 26.23 (buffs : Annie, Azir, Bard, Ezreal, Galio, Gnar, Mel, Vel'Koz, Vi ; nerfs : LeBlanc, Master Yi, Syndra), Maître+ et Émeraude+ (WR, pick et ban par rôle), plus le patch ${PATCH_NEXT.v} annoncé (▲ ${esc(PATCH_NEXT.buff.split(",").join(", "))} ▼ ${esc(PATCH_NEXT.nerf.split(",").join(", "))}). Drafts pro (gol.gg, 857 games : Worlds 2026, ligues majeures de l'été, EWC) : ordre de pick par rôle, position de pick de chaque champion, duos joués ensemble. Matchups par rôle et croisés en bot (ADC contre support) : lolalytics Maître+ patch 26.22, complétés par lolstats.gg Platine+ quand une paire manque. Synergies : lolstats.gg Maître+ (botlane), metabot.gg Émeraude+ (support-jungle, jungle-mid, jungle-top, top-mid) et synergies pro connues. Duos proposés uniquement s'ils ont été joués au moins 8 fois ensemble en pro en 2026 (Worlds et ligues d'été) ; un duo très joué ensemble en solo Q avec un gros gain de WR renforce seulement la synergie.</p></section>
   ${synEditor()}${ctrEditor()}${bookmarkCard()}
   <section class="card"><button class="btn" data-act="reset">Réinitialiser les réglages</button></section>`;
}
function synEditor(){
  const q=ui.synQ, n=findChamp(q);
  const list=synPairs(cfg).filter(x=>!q||(n&&(x[0]===n||x[2]===n))).sort((a,b)=>b[4]-a[4]);
  const rl=r=>r?` <span class="muted">${ROLE_NAMES[r]}</span>`:"";
  return `<details class="card" ${q?"open":""}><summary><h3>Synergies <span class="muted">(${synPairs(cfg).length})</span></h3></summary>
   <div class="row"><input list="champs" data-act="synq" value="${esc(q)}" placeholder="Filtrer par champion…"></div>
   <p class="muted">Écart de winrate du duo par rapport à ce qu'on attendrait des deux champions seuls. Support-ADC, support-jungle, jungle-mid et jungle-top : metabot.gg Émeraude+ 26.22 ; botlane aussi lolstats.gg Maître+.</p>
   <div class="plist">${list.slice(0,q?80:25).map(x=>`<div>${av(x[0],"xs")} ${esc(x[0])}${rl(x[1])} + ${av(x[2],"xs")} ${esc(x[2])}${rl(x[3])} <b class="${x[4]>=0?"up":"dn"}">${x[4]>0?"+":""}${x[4]} %</b> <span class="muted">${esc(x[5])}</span></div>`).join("")}</div>
   <div class="row"><input list="champs" id="syn-a" placeholder="Champion A"><input list="champs" id="syn-b" placeholder="Champion B"><input id="syn-v" type="number" value="3" style="width:64px"><button class="btn" data-act="addsyn">+</button></div></details>`;
}
function ctrEditor(){
  const q=ui.ctrQ, n=findChamp(q);
  let body=`<div class="muted">Choisis un champion pour voir ses matchups.</div>`;
  if(n){ const L=ctrList(cfg);
    const beats=L.filter(x=>x[0]===n).sort((a,b)=>b[2]-a[2]), loses=L.filter(x=>x[1]===n).sort((a,b)=>b[2]-a[2]);
    const line=(x,me)=>`<div>${av(me?x[1]:x[0],"xs")} ${esc(me?x[1]:x[0])} <b class="${me?"up":"dn"}">${me?x[2]:(100-x[2]).toFixed(1)} %</b> <span class="muted">${x[4]?ROLE_NAMES[x[4]]+" · ":""}${x[3]?x[3]+" g.":"manuel"}</span> <button class="x" data-act="ctroff" data-a="${esc(x[0])}" data-b="${esc(x[1])}" data-r="${x[4]||""}">×</button></div>`;
    body=`<div class="two"><div><div class="rh">${esc(n)} bat</div>${beats.slice(0,15).map(x=>line(x,true)).join("")||"<div class='muted'>—</div>"}</div>
      <div><div class="rh">${esc(n)} perd contre</div>${loses.slice(0,15).map(x=>line(x,false)).join("")||"<div class='muted'>—</div>"}</div></div>`; }
  return `<details class="card" ${q?"open":""}><summary><h3>Counters <span class="muted">(${ctrList(cfg).length})</span></h3></summary>
   <div class="row"><input list="champs" data-act="ctrq" value="${esc(q)}" placeholder="Champion…"></div>${body}
   <div class="row"><input list="champs" id="ctr-a" placeholder="Fort"><span class="muted">bat</span><input list="champs" id="ctr-b" placeholder="Faible"><input id="ctr-v" type="number" value="55" style="width:64px"><button class="btn" data-act="addctr">+</button></div>
   ${cfg.ctrOff.length?`<div class="row"><button class="btn" data-act="ctrrestore">Restaurer ${cfg.ctrOff.length} matchup(s) retiré(s)</button></div>`:""}</details>`;
}

// ---------- Actions ----------
function flash(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("on"); clearTimeout(flash.t); flash.t=setTimeout(()=>t.classList.remove("on"),2200); }
// Pick adverse : quel joueur de leur cinq le joue ? Plusieurs rôles possibles (ou rôle inhabituel) => « Flex ? »
// Pick adverse : rôle le plus probable du champion, départagé par le joueur adverse qui le joue le plus à son rôle
function enemyRole(c,taken){ const C=CHAMPS[c]; if(!C) return null; let P=[]; try{ P=prepPlayers(prep); }catch(e){}
  const prior=[1,0.55,0.3,0.2]; let best=null;
  C.roles.forEach((r,i)=>{ if(taken.includes(r)) return; const p=P.find(x=>x.role===r), x=p&&(p.all||p.list).find(y=>y.c===c);
    const s=(prior[i]||0.15)+(x?Math.min(0.6,x.g/100):0); if(!best||s>best.s) best={r,s}; });
  return best&&best.r; }
function addChamp(name,role){
  const i=targetIndex(); if(i<0) return false; const n=findChamp(name); if(!n){ flash("Champion inconnu"); return false; }
  const old=live.draft.actions[i];
  const un=unavailable(live.series,live.draft); if(un.has(n)&&!(old&&old.name===n)){ flash(n+" n'est plus disponible"); return false; }
  const [t,s]=STEPS[i]; const a={name:n};
  if(t==="pick"){ const taken=teamPicks(live.draft,s).filter(p=>!p.flex&&p!==old).map(p=>p.role);
    a.role=role||(old&&old.role&&CHAMPS[n].roles.includes(old.role)?old.role:null)||CHAMPS[n].roles.find(r=>!taken.includes(r))||CHAMPS[n].roles[0]; a.flex=old?!!old.flex:false;
    if(s!==live.draft.side&&!role&&!old){ const r=enemyRole(n,teamPicks(live.draft,s).filter(p=>!p.flex).map(p=>p.role)); if(r) a.role=r; } }
  live.draft.actions[i]=a; if(ui.edit!=null||(old&&old.miss)){ (live.draft.manual=live.draft.manual||{})[i]=a; } ui.hover=null; ui.pending=null; ui.edit=null; ui.gridQ=""; persist("live"); render(); return true;
}
function parseManual(txt){
  return txt.split("\n").map(l=>l.trim()).filter(Boolean).map(l=>{ const k=l.indexOf(":"); const name=k>0?l.slice(0,k).trim():""; const rest=k>0?l.slice(k+1):l;
    const champs=rest.split(",").map(s=>s.trim()).filter(Boolean).map(s=>{ const m=s.match(/^(.+?)\s+(\d+)(?:\s+(\d+(?:[.,]\d+)?))?\s*%?$/); const c=findChamp(m?m[1]:s); return c?[c,m?+m[2]:0,m&&m[3]?parseFloat(m[3].replace(",",".")):null]:null; }).filter(Boolean);
    return {name, champs}; }).filter(p=>p.champs.length);
}
document.addEventListener("click",e=>{
  const sc=e.target.closest("[data-act]"); if(sc&&sc.dataset.act==="none") return;
  if(sc&&sc.dataset.act==="scout"){ ui.scout=sc.dataset.r; render(); return; }
  if(sc&&sc.dataset.act==="scoutclose"){ ui.scout=null; render(); return; }
  const b=e.target.closest("[data-act]"); if(!b||["SELECT","INPUT","TEXTAREA"].includes(b.tagName)) return; const act=b.dataset.act;
  if(act==="side"){ live.draft.side=b.dataset.v; live.sideManual=curGameNo(); live.sideHow="manuel"; persist("live"); render(); }
  else if(act==="choose"){ const n=b.dataset.n, now=Date.now();
    // double-clic : le premier clic redessine la grille, donc on le détecte nous-mêmes (même champion cliqué deux fois en moins de 450 ms)
    if(ui._lastChoose&&ui._lastChoose.n===n&&now-ui._lastChoose.t<450){ ui._lastChoose=null; ui.duoNext=null; addChamp(n,b.dataset.r||null); return; }
    ui._lastChoose={n,t:now}; ui.pending={name:n,role:b.dataset.r||null}; ui.duoNext=null; render(); }
  else if(act==="rup"){ const o=roleOrderOf(cfg).slice(), k=o.indexOf(b.dataset.r); if(k>0){ [o[k-1],o[k]]=[o[k],o[k-1]]; cfg.roleOrder=o; persist("config"); render(); } }
  else if(act==="duo"){ ui.pending={name:b.dataset.a,role:b.dataset.ra}; ui.duoNext={name:b.dataset.b,role:b.dataset.rb}; render(); }
  else if(act==="confirm"){ if(ui.pending){ const dn=ui.duoNext&&ui.duoNext.name!==ui.pending.name?ui.duoNext:null; ui.duoNext=null;
      if(addChamp(ui.pending.name,ui.pending.role)&&dn){ const i=live.draft.actions.findIndex(a=>!a);
        if(i>=0&&STEPS[i][0]==="pick"&&STEPS[i][1]===live.draft.side&&!unavailable(live.series,live.draft).has(dn.name)){ ui.pending=dn; render(); } } } }
  else if(act==="editslot"){ const k=+b.dataset.k; if(!live.draft.actions[k]) return; ui.edit=k; ui.pending=null; render(); }
  else if(act==="canceledit"){ ui.edit=null; ui.pending=null; render(); }
  else if(act==="clearslot"){ live.draft.actions[ui.edit]=null; if(live.draft.manual) delete live.draft.manual[ui.edit]; ui.edit=null; ui.pending=null; persist("live"); render(); }
  else if(act==="grole"){ ui.gridRole=b.dataset.v; render(); }
  else if(act==="viewgame"){ const k=+b.dataset.k; ui.viewGame=k<0?null:k; render(); }
  else if(act==="undo"){ let i=curStep(); i=i<0?19:i-1; if(i>=0){ live.draft.actions[i]=null; if(live.draft.manual) delete live.draft.manual[i]; } ui.pending=null; persist("live"); render(); }
  else if(act==="flex"){ const a=live.draft.actions[+b.dataset.k]; a.flex=!a.flex; if(!a.flex) delete a.fx; persist("live"); render(); }
  else if(act==="nextgame"){ const names=live.draft.actions.filter((a,i)=>a&&a.name&&STEPS[i][0]==="pick").map(a=>a.name);
    live.series.locked.push(...names); live.series.games.push({side:live.draft.side,actions:live.draft.actions,result:live.draft.result||null});
    live.draft={side:live.draft.side,actions:Array(20).fill(null)}; ui.edit=null; ui.pending=null; ui.viewGame=null; persist("live"); flash(names.length+" champions verrouillés"); render(); }
  else if(act==="endseries"){ const n=live.series.games.length+(live.draft.actions.every(Boolean)?1:0); archiveSeries(true);
    const S0=history.series[0]; if(S0){ S0.id=S0.id||Date.now(); S0.pendingExport={n, at:Date.now()}; }
    // La série voyage avec le lien : le script du PC l'ajoute (avec les stats) à team.json sur GitHub pour toute l'équipe
    let sp=""; try{ const c=JSON.parse(JSON.stringify(S0||{})); delete c.pendingExport; if(c.scouting) c.scouting={link:c.scouting.link||""};
      sp="&s="+btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(c)))).replace(/=+$/,"").replace(/\+/g,"-").replace(/\//g,"_"); }catch(e){}
    ui.viewGame=null; ui.edit=null; ui.pending=null; live={series:{locked:[],games:[]},draft:{side:live.draft.side,actions:Array(20).fill(null)}}; persist("live"); persist("history");
    const a=document.createElement("a"); a.href="bbj-export://run?n="+n+sp; document.body.appendChild(a); a.click(); a.remove();
    flash("Série archivée · export des "+n+" games lancé sur ton PC"); ui.tab="hist"; render(); }
  else if(act==="newseries"){ archiveSeries(); ui.viewGame=null; ui.edit=null; ui.pending=null; live={series:{locked:[],games:[]},draft:{side:live.draft.side,actions:Array(20).fill(null)}}; persist("live"); render(); }
  else if(act==="clearprep"){ clearPrep(); flash("Préparation remise à zéro"); render(); }
  else if(act==="result"){ const g=ui.viewGame!=null?live.series.games[ui.viewGame]:live.draft; g.result=g.result===b.dataset.v?null:b.dataset.v; persist("live"); render(); }
  else if(act==="hview"){ ui.hist={s:+b.dataset.s,g:+b.dataset.g}; render(); }
  else if(act==="hclose"){ ui.hist=null; render(); }
  else if(act==="htype"){ const s=history.series[+b.dataset.s]; const T=["Scrim","Compétition"]; s.type=T[(T.indexOf(s.type||"Scrim")+1)%T.length]; persist("history"); render(); }
  else if(act==="goprep"){ ui.tab="prep"; render(); }
  else if(act==="pplayer"){ ui.poolPlayer=b.dataset.p; ui.tierPop=null; render(); }
  else if(act==="tierpop"){ ui.tierPop=b.dataset.c; render(); }
  else if(act==="settier"){ const t=b.dataset.t, c=ui.tierPop, T=cfg.tiers[ui.poolPlayer]=cfg.tiers[ui.poolPlayer]||{};
    if(t==="-") delete T[c]; else if(t!=="x") T[c]=t; ui.tierPop=null; if(t!=="x") persist("config"); render(); }
  else if(act==="addpool"){ const n=findChamp($("#addpool").value); if(!n) return flash("Champion inconnu"); (cfg.tiers[ui.poolPlayer]=cfg.tiers[ui.poolPlayer]||{})[n]="B"; persist("config"); render(); }
  else if(act==="askprep"){ const ids=(prep.ids||[]).map(x=>(x||"").trim()).filter(Boolean); if(!ids.length) return flash("Entre au moins un pseudo");
    if(ids.some(x=>!x.includes("#"))) return flash("Ajoute le #TAG à chaque pseudo"); prep.request={ids:(prep.ids||[]).map(x=>(x||"").trim()), link:prep.link||multiLink(), at:new Date().toLocaleString("fr-FR",{dateStyle:"short",timeStyle:"short"}), status:"pending"}; persist("prep"); render(); flash("Analyse demandée"); }
  else if(act==="applymanual"){ const pl=parseManual($("#manual").value); prep.players=pl.map(p=>({name:p.name,champs:p.champs})); prep.updatedAt=new Date().toLocaleString("fr-FR"); ui.manual=false; persist("prep"); render(); }
  else if(act==="clearprep"){ prep={...prep,opponent:"",link:"",players:[],updatedAt:null}; persist("prep"); render(); }
  else if(act==="addsyn"){ const x=findChamp($("#syn-a").value), y=findChamp($("#syn-b").value); if(!x||!y) return flash("Champion inconnu"); cfg.synManual.push([x,y,+$("#syn-v").value||3]); persist("config"); render(); }
  else if(act==="addctr"){ const x=findChamp($("#ctr-a").value), y=findChamp($("#ctr-b").value); if(!x||!y) return flash("Champion inconnu"); cfg.ctrManual.push([x,y,+$("#ctr-v").value||55,0]); persist("config"); render(); }
  else if(act==="ctroff"){ const k=b.dataset.a+">"+b.dataset.b+"|"+(b.dataset.r||"*"); cfg.ctrManual=cfg.ctrManual.filter(x=>x[0]+">"+x[1]+"|*"!==k); if(CTR_DATA.some(x=>ctrKey(x)===k)) cfg.ctrOff.push(k); persist("config"); render(); }
  else if(act==="ctrrestore"){ cfg.ctrOff=[]; persist("config"); render(); }
  else if(act==="reset"){ cfg=defaultConfig(); persist("config"); flash("Réglages réinitialisés"); render(); }
});
document.addEventListener("change",e=>{
  const b=e.target; const act=b.dataset&&b.dataset.act; if(!act) return;
  if(act==="lineup"){ prep.lineup[b.dataset.r]=b.value; persist("prep"); render(); }
  else if(act==="hopp"){ history.series[+b.dataset.s].opponent=b.value.trim()||"Adversaire"; persist("history"); render(); }
  else if(act==="role"){ live.draft.actions[+b.dataset.k].role=b.value; persist("live"); render(); }
  else if(act==="prole"){ const p=prep.players[+b.dataset.k]; if(p){ p.role=b.value; persist("prep"); render(); } }
  else if(act==="w"){ cfg.weights[b.dataset.k]=+b.value; persist("config"); render(); }
  else if(act==="exd"){ cfg.excludeD=b.checked; persist("config"); render(); }
  else if(act==="pteam2"){ prep.team=b.value.trim(); persist("prep"); }
  else if(act==="popp"){ prep.opponent=b.value; persist("prep"); }
  else if(act==="plink"){ prep.link=b.value.trim(); const ids=idsFromLink(prep.link); if(ids.length){ prep.ids=ROLES.map((r,k)=>ids[k]||""); flash(ids.length+" joueur(s) récupéré(s) du lien"); } else if(prep.link) flash("Lien multi-op.gg non reconnu"); persist("prep"); render(); }
  else if(act==="pid"){ prep.ids=prep.ids||["","","","",""]; prep.ids[+b.dataset.k]=b.value.trim(); persist("prep"); render(); }
  else if(act==="synq"){ ui.synQ=b.value; render(); }
  else if(act==="ctrq"){ ui.ctrQ=b.value; render(); }
});
document.addEventListener("mouseover",e=>{ const b=e.target.closest(".bub"); const tip=$("#tip"); if(!b){ if(!e.target.closest("#tip")) tip.classList.remove("on"); return; }
  const x=lastRecs[b.dataset.h]; if(!x) return; tip.innerHTML=tipHtml(x); const r=b.getBoundingClientRect();
  tip.classList.add("on"); const w=tip.offsetWidth; tip.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2))+"px"; tip.style.top=(r.bottom+6+scrollY)+"px"; });
document.addEventListener("input",e=>{ if(e.target.id==="gq"){ ui.gridQ=e.target.value; const pos=e.target.selectionStart; const box=$(".cgrid"); render(); const g=$("#gq"); if(g){ g.focus(); g.setSelectionRange(pos,pos); } } });
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"&&ui.scout){ ui.scout=null; render(); return; }
  if(ui.tab!=="draft") return;
  if(e.key==="Enter"){ if(ui.pending){ addChamp(ui.pending.name,ui.pending.role); e.preventDefault(); }
    else if(e.target.id==="gq"){ const n=CHAMP_NAMES.filter(x=>(ui.gridRole==="all"||CHAMPS[x].roles.includes(ui.gridRole))&&normName(x).includes(normName(ui.gridQ)))[0]; if(n){ ui.pending={name:n,role:null}; render(); } } }
  if(e.key==="Escape"){ ui.pending=null; ui.edit=null; render(); } });
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{ ui.tab=b.dataset.tab; ui.tierPop=null; render(); });
$("#champs").innerHTML=CHAMP_NAMES.map(n=>`<option value="${esc(n)}">`).join("");
// Hors de Claude (GitHub Pages) : pas de base d'équipe, on charge la copie team.json publiée avec le site
async function initSnapshot(){
  if(window.claude&&window.claude.use) return;
  try{ const r=await fetch("team.json",{cache:"no-store"}); if(!r.ok) return; const s=await r.json(); if(!s||!s.at) return;
    let seen=0; try{ seen=+localStorage.getItem(LS+"-snap")||0; }catch(e){}
    if(s.at<=seen) return;
    if(s.config) cfg=migrate(Object.assign(defaultConfig(),s.config)); if(s.prep) prep=Object.assign({opponent:"",link:"",players:[],lineup:{...DEF_LINEUP}},s.prep); if(s.history) history=Object.assign({series:[]},s.history);
    try{ localStorage.setItem(LS+"-snap",String(s.at)); }catch(e){}
    sync.note="Données de l'équipe du "+new Date(s.at).toLocaleDateString("fr-FR"); saveLocal(); render(); renderSync();
  }catch(e){}
}
if(new URLSearchParams(location.search).get("embed")) document.body.classList.add("embed");
// Stats envoyées par le script « Fin de série » du PC (lien #import=...) : rattachées à la série archivée qui les attend
const bbjBC=("BroadcastChannel" in window)?new BroadcastChannel("bbj-outil"):null;
if(bbjBC) bbjBC.onmessage=e=>{ if(e.data==="reload"){ loadLocal(); render(); flash("Stats de la série importées"); } };
function importFromHash(){ const m=location.hash.match(/^#import=([\w-]+)/); if(!m) return;
  window.history.replaceState(null,"",location.pathname+location.search);
  let data; try{ const b=m[1].replace(/-/g,"+").replace(/_/g,"/"), bin=atob(b+"===".slice((b.length+3)%4)); data=JSON.parse(new TextDecoder().decode(Uint8Array.from(bin,c=>c.charCodeAt(0)))); }catch(e){ flash("Import illisible"); return; }
  const G=(data.games||[]).slice().sort((a,b)=>a.at-b.at); if(!G.length) return;
  const S=history.series||[]; let s=S.find(x=>x.pendingExport)||S.find(x=>x.games.length===G.length&&!x.games.some(g=>g.stats))||S[0]; if(!s) return;
  const games=s.games, off=Math.max(0,G.length-games.length), list=G.slice(off);
  games.forEach((g,i)=>{ const x=list[i]; if(!x) return; g.stats={gameId:x.gameId,min:x.min,us:x.us,them:x.them,objUs:x.objUs,objThem:x.objThem}; if(!g.result&&x.win!=null) g.result=x.win?"W":"L"; });
  delete s.pendingExport; persist("history"); saveLocal(); if(bbjBC) bbjBC.postMessage("reload");
  ui.tab="hist"; flash(`Stats de ${Math.min(list.length,games.length)} games ajoutées à la série vs ${s.opponent}`); render(); }
loadLocal(); render(); initDb(); initSnapshot(); setTimeout(importFromHash,300);
