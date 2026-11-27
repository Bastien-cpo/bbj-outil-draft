// ===== Moteur de draft v7 (logique pure, sans DOM) =====
const ROLES = ["T","J","M","A","S"];
const AXES = ["early","scaling","teamfight","engage","peel","poke"];
const AXIS_FR = {early:"Early",scaling:"Scaling",teamfight:"Teamfight",engage:"Engage",peel:"Réception",poke:"Poke"};
const normName = s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z]/g,"");

const CHAMPS = {};
CHAMP_RAW.trim().split("\n").forEach(l=>{
  const [n,r,d,a]=l.split(";"); const v=a.split(",").map(Number);
  const o={name:n,roles:r.split(","),dmg:d}; AXES.forEach((x,i)=>o[x]=v[i]); CHAMPS[n]=o;
});
const CHAMP_NAMES = Object.keys(CHAMPS).sort((a,b)=>a.localeCompare(b));
const NAME_BY_NORM = {}; CHAMP_NAMES.forEach(n=>NAME_BY_NORM[normName(n)]=n);
Object.assign(NAME_BY_NORM,{maitreyi:"Master Yi",monkeyking:"Wukong",renata:"Renata Glasc",nunuwillump:"Nunu",nunuetwillump:"Nunu",mundo:"Dr. Mundo",j4:"Jarvan IV",tf:"Twisted Fate",mf:"Miss Fortune",ksante:"K'Sante"});
function findChamp(s){ const k=normName(s); return NAME_BY_NORM[k]||CHAMP_NAMES.find(n=>normName(n).startsWith(k)&&k.length>=3)||null; }
// ---- Matchups lolalytics patch 16.22 : Maître+ et Émeraude+ (poids 0,35) croisés, les deux sens du matchup fusionnés, puis ramenés vers 50 % selon l'échantillon (n/(n+250)) ----
const LOLA_N=LOLA_NAMES.split("|").map(n=>findChamp(n)||n);
const NEXT_DELTA={}; PATCH_NEXT.buff.split(",").forEach(c=>NEXT_DELTA[c]=1); PATCH_NEXT.nerf.split(",").forEach(c=>NEXT_DELTA[c]=-1);
// Ajustement patch : buff = +0,07 de force méta et +0,6 % de WR (matchups compris), nerf = -0,09 et -0,8 %
const PATCH_V=c=>NEXT_DELTA[c]>0?0.07:NEXT_DELTA[c]<0?-0.09:0, PATCH_WR=c=>NEXT_DELTA[c]>0?0.6:NEXT_DELTA[c]<0?-0.8:0;
const BOTX={}; // ADC>support -> WR de l'ADC (matchups croisés en bot)
const CTR_ALL=(()=>{ const out=[], seen=new Set();
  for(const L in LOLA_RAW){ LOLA_RAW[L].split(";").forEach(t=>{ const [ia,ib,d,n]=t.split(".").map(Number); const a=LOLA_N[ia], b=LOLA_N[ib]; if(!a||!b) return;
    const dd=d+10*(PATCH_WR(a)-PATCH_WR(b));
    if(L==="AS"){ BOTX[a+">"+b]={wr:50+dd/10,n:n*100}; return; }
    const wr=Math.round((50+Math.abs(dd)/10)*10)/10; if(Math.abs(dd)<10) return; out.push(dd>0?[a,b,wr,n*100,L]:[b,a,wr,n*100,L]); seen.add([a,b].sort().join("+")+"|"+L); }); }
  // (anciennes données lolstats retirées : matchups recroisés lolalytics Maître+ et Émeraude+, petits échantillons ramenés vers 50 %)
  return out; })();
function botCross(adc,sup){ const x=BOTX[adc+">"+sup]; return x?x.wr:null; }
// ---- Drafts pro 2026 : position de pick par champion et par rôle, duos ----
const PRO_SLOT={}; PRO_SLOT_RAW.split(";").forEach(t=>{ const [cr,n,s]=t.split(":"); const [c,r]=cr.split("|"); const nm=findChamp(c); if(nm) PRO_SLOT[nm+"|"+r]={n:+n,s:+s}; });
const ROLE_SLOT_AVG={}; ["T","J","M","A","S"].forEach(r=>ROLE_SLOT_AVG[r]=(PRO_ROLE_SLOT_ALL.B[r]+PRO_ROLE_SLOT_ALL.R[r])/2);
const PRO_DUOS={}; PRO_DUO_RAW.split(";").forEach(t=>{ const [rr,pair,eff,raw,wr,lift,co,px]=t.split(":"); const [a,b]=pair.split("+").map(x=>findChamp(x)); if(!a||!b) return;
  const k=[a+"|"+rr[0],b+"|"+rr[1]].sort().join("+"); PRO_DUOS[k]={a,b,ra:rr[0],rb:rr[1],n:+eff,w:+eff*(+wr)/100,raw:+raw,lift:+lift,co:+co,px:+px}; });
// Duo pro avéré : assez de games récentes, jamais perdant ensemble, et soit choisi exprès ensemble (co-occurrence ≥ 2 et souvent pické dans la même rotation), soit nettement gagnant ensemble
// Duo nommé : choisi exprès ensemble (co-occurrence ≥ 2, même rotation ≥ 40 %), même s'il performe mal ; ou duo nettement gagnant (+4 pts sur ≥ 35 games)
const proDuoNamed=pd=>!!pd&&pd.n>=20&&pd.co>=2&&pd.px>=0.4;
function proDuoOK(pd){ return proDuoNamed(pd)||(!!pd&&pd.n>=35&&pd.lift>=4); }
// Bonus/malus d'un duo pro selon sa performance ensemble (gain vs attendu, en pts)
function duoAdj(pd){ if(!pd) return 3; return pd.lift>=0?Math.min(3,1+0.5*pd.lift):Math.max(-2.5,0.6*pd.lift); }
function proDuoInfo(a,ra,b,rb){ if(ra&&rb){ return PRO_DUOS[[a+"|"+ra,b+"|"+rb].sort().join("+")]||null; }
  for(const k in PRO_DUOS){ const d=PRO_DUOS[k]; if((d.a===a&&d.b===b)||(d.a===b&&d.b===a)) return d; } return null; }
// Icônes : index dans la planche (ordre des ids Data Dragon)
const ICON_INDEX = {}; ICON_KEYS.forEach((k,i)=>{ const n=NAME_BY_NORM[normName(k)]; if(n) ICON_INDEX[n]=i; });

// ---- Méta : patch actuel (OP.GG Maître+ / Émeraude+) + patch à venir ; les Worlds servent à l'ordre des picks ----
// Drafts pro 2026 (gol.gg, Worlds + ligues majeures été/Summer + EWC, 2 481 games) : picks, bans, ordre de pick moyen, tour de ban moyen
const PRO = {}; let PRO_MAX=1, PRO_BMAX=1;
PRO3_RAW.split("|").forEach(s=>{const [n,p,b,w,rp,bt]=s.split(":"); const c=findChamp(n); if(!c) return;
  PRO[c]={p:+p,b:+b,w:+w,rp:rp===""?null:+rp,bt:bt===""?null:+bt}; PRO_MAX=Math.max(PRO_MAX,+p+ +b); PRO_BMAX=Math.max(PRO_BMAX,+b);});
const RKEY={top:"T",jungle:"J",mid:"M",adc:"A",support:"S"};
const OPGG = {}; // OPGG[champ][role] = {m:[wr,pick,ban], e:[...]}
OPGG_META_RAW.trim().split("\n").forEach(line=>{ const [k,v]=line.split("="); const [lvl,rk]=k.split("|"); const r=RKEY[rk];
  v.split("|").forEach(x=>{ const [n,wr,pk,bn]=x.split(":"); const c=findChamp(n); if(!c) return; ((OPGG[c]=OPGG[c]||{})[r]=OPGG[c][r]||{})[lvl==="master"?"m":"e"]=[+wr,+pk,+bn]; }); });
const STATS = {};
STATS_RAW.split("|").forEach(s=>{const [n,g,w]=s.split(":"); STATS[n]={g:+g,wr:+w};});
// Games de l'équipe par joueur/rôle/champion et duos joués ensemble (Parthenon)
const TEAM_P = {}; TEAM_P_RAW.split(";").forEach(s=>{const [p,r,c,g,w]=s.split("|"); ((TEAM_P[p]=TEAM_P[p]||{})[r]=TEAM_P[p][r]||{})[c]={g:+g,w:+w};});
const TEAM_DUO = {}; TEAM_DUO_RAW.split(";").forEach(s=>{const [r,k,g,w]=s.split("|"); const [a,b]=k.split("+"); TEAM_DUO[r+"|"+a+"|"+b]={g:+g,w:+w};});
// Stats scrim/compétition : base Parthenon + chaque série exportée ensuite (Fin de série → historique, stats du client)
const _dmy=s=>{ const m=/(\d+)\/(\d+)\/(\d+)/.exec(s||""); return m?`${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`:""; };
function teamStats(hist){
  const T=JSON.parse(JSON.stringify(TEAM_STATS_BASE));
  ((hist&&hist.series)||[]).forEach(s=>{ if(!(_dmy(s.date)>TEAM_STATS_UNTIL)) return;
    (s.games||[]).forEach(g=>{ const st=g.stats; if(!st||!st.us||!g.result) return;
      const mine={}; (g.actions||[]).forEach((a,i)=>{ if(a&&a.name&&STEPS[i][0]==="pick"&&STEPS[i][1]===g.side&&a.role) mine[a.role]=a.name; });
      const tot=ROLES.reduce((x,r)=>x+(st.us[r]?st.us[r].dmg:0),0); // part des dégâts de notre équipe
      ROLES.forEach(r=>{ const u=st.us[r], c=mine[r], pid=(s.lineup||{})[r]; if(!u||!c||!pid) return;
        const x=((T[pid]=T[pid]||{})[r]=T[pid][r]||{})[c]=((T[pid][r]||{})[c])||[0,0,0,0,0,0,0,0,0,0];
        x[0]++; x[1]+=g.result==="W"?1:0; x[2]+=u.k; x[3]+=u.d; x[4]+=u.a; x[5]+=tot?u.dmg/tot:0;
        if(st.them&&st.them[r]){ x[8]=(x[8]||0)+u.cs-st.them[r].cs; x[9]=(x[9]||0)+1; } }); }); });
  return T;
}
// Score de performance /100 : le winrate (lissé) est le facteur majeur (50 %) ; puis, à parts égales (12,5 % chacun), les stats en partie
// comparées à la moyenne du joueur à ce rôle : KDA, part des dégâts, or à 15 min, écart de CS avec son vis-à-vis.
// Une stat absente (ex. or à 15 min dans les exports) est ignorée et son poids redistribué ; les petits échantillons sont ramenés vers 50.
function champPerf(T,pid,role,c){
  const C=(T[pid]||{})[role]||{}, x=C[c]; if(!x) return null;
  const t=Array(10).fill(0); Object.values(C).forEach(y=>y.forEach((v,i)=>t[i]+=v||0));
  const cl=v=>Math.max(-1,Math.min(1,v)), [g,w,k,d,a,sh,gd,gn,cs,cn]=x.concat([0,0]).slice(0,10);
  const parts=[[0.5,cl(((w+2)/(g+4)-0.5)/0.2)]];
  const bk=(t[2]+t[4])/Math.max(1,t[3]); parts.push([0.125,cl((((k+a)/Math.max(1,d))/bk-1)/0.4)]);
  parts.push([0.125,cl(((sh/g)/(t[5]/t[0])-1)/0.25)]);
  if(gn) parts.push([0.125,cl((gd/gn-(t[7]?t[6]/t[7]:0))/2000)]);
  if(cn) parts.push([0.125,cl((cs/cn-(t[9]?t[8]/t[9]:0))/30)]);
  const W=parts.reduce((s,p)=>s+p[0],0), v=parts.reduce((s,p)=>s+p[0]*p[1],0)/W;
  return Math.round(50+50*cl(v*1.5)*g/(g+2));
}
function teamDuoAdj(c,role,a,ra){ const x=TEAM_DUO[role+ra+"|"+c+"|"+a]||TEAM_DUO[ra+role+"|"+a+"|"+c]; if(!x||x.g<3) return 0;
  return Math.max(-2,Math.min(2,((x.w+1.5)/(x.g+3)-0.5)*8)); }
const clamp01=x=>Math.max(0,Math.min(1,x));
function metaInfo(c,role){
  const o=OPGG[c]||{}; let d=role?o[role]:null;
  if(!d){ // meilleur rôle connu, avec décote
    let best=null,bs=-1; for(const r in o){ const x=o[r].m||o[r].e; const sc=x[1]+x[2]; if(sc>bs){bs=sc;best=o[r];} } d=best; if(d) d={...d,off:true}; }
  if(!d) return {v:0.25+PATCH_V(c), wr:null, pres:null};
  const m=d.m, e=d.e;
  const wr = m&&e ? 0.5*m[0]+0.5*e[0] : (m||e)[0];
  const pres = m&&e ? 0.6*(m[1]+m[2])+0.4*(e[1]+e[2]) : ((m||e)[1]+(m||e)[2]);
  let v=0.6*clamp01((wr-47.5)/5)+0.4*clamp01(Math.sqrt(pres/35));
  if(d.off) v*=0.7;
  v=clamp01(v+PATCH_V(c)); const wrP=wr+PATCH_WR(c);
  return {v, wr:Math.round(wrP*10)/10, pres:Math.round(pres*10)/10, off:!!d.off};
}
const proPrio = c=>{ const p=PRO[c]; return p? clamp01(Math.sqrt((p.p+p.b)/PRO_MAX)) : 0; };
// Méta d'un pick : force du patch ; sur les 2 premiers picks, on ajoute la priorité vue en pro
// Méta = moitié games pro récentes (Worlds 2026 + ligues majeures été), moitié solo Q du patch actuel
function proScore(c){ const p=PRO[c]; if(!p) return 0.15; const pres=clamp01(Math.sqrt((p.p+p.b)/PRO_MAX)); const wr=p.p>=10?p.w/p.p:0.5; return clamp01(0.85*pres+0.15+0.5*(wr-0.5)); }
// Calibrage pro 2026 : la présence pro prédit la victoire, pas la force solo Q → 60 % pro / 40 % solo Q (on reste une équipe amateur : l'affinité garde son poids)
function force(cfg,c,role){ return clamp01(0.6*proScore(c)+0.4*metaInfo(c,role).v); }
// Premier pick bleu en pro 2026 (games, victoires) : léger bonus/malus, ramené vers 50 % selon l'échantillon
const B1_PRO={"Lee Sin":[58,30],"Camille":[18,7],"Bard":[25,8],"Varus":[41,22],"Jarvan IV":[131,57],"Ryze":[105,50],"Vi":[127,71],"Karma":[56,24],"Jayce":[46,18],"Rumble":[76,41],"Orianna":[127,69],"Nocturne":[83,38],"Ezreal":[95,55],"Naafiri":[22,11],"Viktor":[24,14],"Seraphine":[34,20],"Cassiopeia":[100,63],"Lulu":[18,11],"Lucian":[40,19],"Pantheon":[37,16],"Olaf":[23,13],"Syndra":[25,7],"Annie":[34,16],"Ashe":[21,13]};
function b1Adj(c){ const x=B1_PRO[c]; if(!x) return 0; return (x[1]/x[0]-0.5)*x[0]/(x[0]+60); }
const OUR_SQ = {}; for(const p in OUR_SOLOQ){ OUR_SQ[p]={}; OUR_SOLOQ[p].split("|").forEach(x=>{const [n,g,w]=x.split(":"); const c=findChamp(n); if(c) OUR_SQ[p][c]={g:+g,wr:+w};}); }

// ---- Configuration ----
const TIER_VAL = {S:1, A:0.8, B:0.6, C:0.38, D:0.15};
const TIER_DOWN = {S:"A",A:"B",B:"C",C:"D",D:"D"};
function defaultConfig(){
  const tiers={};
  PLAYERS.forEach(p=>{ tiers[p.id]={}; const src=TIERS_RAW[p.tl]||{};
    for(const t in src) src[t].split(",").filter(Boolean).forEach(c=>{ if(CHAMPS[c]) tiers[p.id][c]=t; }); });
  return {
    tiers,
    weights:{affinite:25, force:25, synergie:25, matchup:25},
    excludeD:true, synManual:[], ctrManual:[], ctrOff:[], wv:8,
    roleOrder:["J","A","S","M","T"] // ordre habituel des rôles en draft (du plus tôt au plus tard)
  };
}
const playerMain = id=>(PLAYERS.find(p=>p.id===id)||{}).main;
// Stats Parthenon : rattachées au joueur titulaire du rôle où le champion a son meilleur tier
const STATS_OWNER = (()=>{ const cfg0=defaultConfig(), out={};
  for(const c in STATS){ let best=null,bv=-1;
    PLAYERS.forEach(p=>{ const x=((TEAM_P[p.id]||{})[p.main]||{})[c]; if(x&&x.g>bv){bv=x.g;best=p.id;} }); if(best){ out[c]=best; continue; } bv=-1;
    PLAYERS.filter(p=>!p.sub).forEach(p=>{ const t=cfg0.tiers[p.id][c]; if(t&&TIER_VAL[t]>bv){bv=TIER_VAL[t];best=p.id;} });
    if(!best&&CHAMPS[c]){ const r=CHAMPS[c].roles[0]; best=(PLAYERS.find(p=>p.main===r&&!p.sub)||{}).id; }
    out[c]=best; }
  return out; })();

// Les games de solo Q d'un joueur ne comptent à un rôle que si ce champion y est réellement joué (ex. Kog'Maw : ADC, jamais support)
function sqCounts(c,role){ const C=CHAMPS[c]; if(!C||!C.roles.includes(role)) return false; if(C.roles[0]===role) return true; const o=OPGG[c]; return !!(o&&o[role]); }
// Pool d'un joueur dans un rôle : ses champions jouables à ce rôle (hors rôle principal = un cran de confiance en moins)
function poolOf(cfg,pid,role){
  const t=cfg.tiers[pid]||{}; const main=playerMain(pid)===role;
  const set=new Set(Object.keys(t));
  // games en équipe : seulement celles du joueur lui-même à ce rôle (avant : stats de toute l'équipe → ex. Bard chez Léo sans aucune game)
  for(const c in ((TEAM_P[pid]||{})[role]||{})) set.add(c);
  for(const c in (OUR_SQ[pid]||{})) if(OUR_SQ[pid][c].g>=20&&sqCounts(c,role)) set.add(c);
  return [...set].filter(c=>CHAMPS[c]&&(main||CHAMPS[c].roles.includes(role)));
}
function tierFor(cfg,pid,role,c){
  const t=(cfg.tiers[pid]||{})[c]; if(!t) return null;
  return playerMain(pid)===role? t : TIER_DOWN[t];
}
// Affinité = expérience réelle : games en scrim/compétition (Parthenon, comptent 4×) + games en solo Q au bon rôle.
// La tier list ne sert que de repère quand il n'y a aucune game.
function affinity(cfg,pid,role,c){
  const t=tierFor(cfg,pid,role,c);
  const st=((TEAM_P[pid]||{})[role]||{})[c]||null; // ses games en équipe à ce rôle (Parthenon)
  const sq=sqCounts(c,role)?(OUR_SQ[pid]||{})[c]:null;
  const tg=st?st.g:0, sg=sq?sq.g:0, eff=tg*4+sg;
  let v=1-Math.exp(-eff/70);
  // léger ajustement par les résultats en solo Q (lissé)
  if(sg){ const wr=(sg*sq.wr/100+0.5*20)/(sg+20); v=clamp01(v+(wr-0.5)*0.6); }
  // la tier list = confiance actuelle du joueur : elle pèse 20 % (l'outil doit aussi proposer le champion le plus adapté), un champion absent de sa liste perd un peu
  if(!eff) v=t?TIER_VAL[t]*0.5:0.15;
  else if(t) v=clamp01(0.8*v+0.2*TIER_VAL[t]);
  else v*=0.9;
  // résultats en scrim : bonus/malus lissé, au plus ±15 % (peu de games → presque neutre)
  if(tg) v=clamp01(v*(1+Math.max(-0.15,Math.min(0.15,(st.w+3)/(tg+6)-0.5))));
  return {v, tier:t||"-", games:tg, wr:st?Math.round(100*st.w/tg):null, sq:sq||null};
}

// ---- Synergies & matchups ----
const BOT_SYN = BOT_SYN_RAW.split(";").map(s=>{const [a,b,g,v]=s.split("/"); return [a,b,parseFloat(v),+g];});
// Toutes les synergies : [A, rôleA|null, B, rôleB|null, écart %, source]
function synPairs(cfg){
  return BOT_SYN.map(x=>[x[0],"A",x[1],"S",x[2],"Maître+ "+x[3]+" g."])
    .concat(SYN_META.map(x=>[x[0],x[1],x[2],x[3],x[4],"Émeraude+ "+x[5]+" g."]))
    .concat(SYN_TOPMID.map(x=>[x[0],x[1],x[2],x[3],x[4],"Émeraude+ top-mid"]))
    .concat(Object.values(PRO_DUOS).filter(d=>d.n>=20).map(d=>[d.a,d.ra,d.b,d.rb,Math.round(d.lift*d.n/(d.n+20)*10)/10,"pro "+d.raw+" g."]))
    .concat(TEAM_SYN.map(x=>[x[0],null,x[1],null,x[2],"pro"]), cfg.synManual.map(x=>[x[0],null,x[1],null,x[2],"manuel"]));
}
let _synIdx=null,_synKey=null;
function synVal(cfg,a,ra,b,rb){
  cfg=cfg&&cfg.synManual?cfg:{synManual:[]}; const key=cfg.synManual.length; if(_synKey!==key){ _synIdx={}; synPairs(cfg).forEach(x=>{ [[x[0],x[1],x[2],x[3]],[x[2],x[3],x[0],x[1]]].forEach(([p,pr,q,qr])=>{ (_synIdx[p+"|"+q]=_synIdx[p+"|"+q]||[]).push({pr,qr,v:x[4],src:x[5]}); }); }); _synKey=key; }
  const L=(_synIdx[a+"|"+b]||[]).filter(x=>(!x.pr||!ra||x.pr===ra)&&(!x.qr||!rb||x.qr===rb));
  if(!L.length) return null;
  let v=L.reduce((s,x)=>s+x.v,0)/L.length;
  if(L.length>=2&&L.every(x=>Math.sign(x.v)===Math.sign(v))) v*=1+0.25*(L.length-1); // sources concordantes
  return {v:Math.round(v*10)/10, src:L.map(x=>x.src).join(" + "), n:L.length};
}
function synergy(cfg,c,role,allies){
  if(!allies.length) return {v:0.5,why:[],bad:[]};
  let s=0; const why=[],bad=[];
  const duos=[];
  allies.forEach(a=>{ const x=synVal(cfg,c,role,a.name,a.role);
    const d=provenDuo(cfg,c,role,a.name,a.role);
    const w=((role==="A"&&a.role==="S")||(role==="S"&&a.role==="A")||(role==="J"&&a.role==="S")||(role==="S"&&a.role==="J"))?1.5:1;
    if(d){ const pd=d==="pro"?proDuoInfo(c,role,a.name,a.role):null, adj=d==="pro"?duoAdj(pd):3; s+=adj*w; duos.push(a.name+" ("+d+(pd&&pd.lift<=-1?`, perd ${pd.lift} pts ensemble`:"")+")"); }
    s+=teamDuoAdj(c,role,a.name,a.role)*w; // duo déjà joué par l'équipe : compte dans le score, sans affichage
    if(!x) return;
    s+=x.v*w; if(Math.abs(x.v)>=1) (x.v>0?why:bad).push(a.name+" "+(x.v>0?"+":"")+x.v+"%"); });
  return {v:clamp01(0.5+s/10), why, bad, duos};
}
// Matchups par rôle : [fort, faible, WR, games, rôle] ; un ajout manuel (rôle null) vaut pour tous les rôles
const ctrKey=x=>x[0]+">"+x[1]+"|"+(x[4]||"*");
function ctrList(cfg){ const off=new Set(cfg.ctrOff); return CTR_ALL.filter(x=>!off.has(ctrKey(x))).concat(cfg.ctrManual.map(x=>[x[0],x[1],x[2],0,x[4]||null])); }
let _ctrCache=null,_ctrKey=null;
function ctrIndex(cfg){ const k=cfg.ctrOff.length+":"+cfg.ctrManual.length; if(_ctrKey!==k){ _ctrCache={}; ctrList(cfg).forEach(x=>{ _ctrCache[ctrKey(x)]=x; }); _ctrKey=k; } return _ctrCache; }
function ctrGet(I,a,b,r){ return I[a+">"+b+"|"+r]||I[a+">"+b+"|*"]||null; }
// Blind ou counter ? Un champion blindable est assez solide pour ne pas avoir de counter énorme parmi les picks courants ;
// un counter pick est une réponse très forte à certains champions, mais lui-même exposé.
// Matchups normalisés par le WR habituel du champion (sinon un champion faible en solo Q paraît « contré » partout),
// pondérés par la popularité de l'adversaire à ce rôle ; position de pick pro comparée à la moyenne du rôle.
const PRO_ROLE_RP=(()=>{ const o={}; ROLES.forEach(r=>{ let n=0,t=0; for(const c in PRO){ const p=PRO[c]; if(!CHAMPS[c]||CHAMPS[c].roles[0]!==r||!p.rp) continue; n+=p.p; t+=p.p*p.rp; } o[r]=n?t/n:2; }); return o; })();
let _ctrBy=null,_blindCache={};
function blindInfo(cfg,c,role){
  const k=c+"|"+role; if(_blindCache[k]) return _blindCache[k];
  if(!_ctrBy){ _ctrBy={vs:{},beats:{}}; CTR_ALL.forEach(x=>{ (_ctrBy.vs[x[1]+"|"+x[4]]=_ctrBy.vs[x[1]+"|"+x[4]]||[]).push(x); (_ctrBy.beats[x[0]+"|"+x[4]]=_ctrBy.beats[x[0]+"|"+x[4]]||[]).push(x); }); }
  const rel=n=>{ const m=metaInfo(n,role); return m.off||m.pres==null?0.05:clamp01(m.pres/20); };
  const mi=metaInfo(c,role), bw=mi.wr||50;
  const L=_ctrBy.vs[k]||[], B=_ctrBy.beats[k]||[];
  const hard=L.map(x=>({n:x[0],wr:x[2],d:rel(x[0])*Math.max(0,x[2]-(100-bw)-1.5)})).filter(x=>x.d>0).sort((a,b)=>b.d-a.d);
  const preys=B.map(x=>({n:x[1],d:rel(x[1])*Math.max(0,x[2]-bw-1.5)})).filter(x=>x.d>0).sort((a,b)=>b.d-a.d);
  const danger=hard.reduce((s,x)=>s+x.d,0), punish=preys.reduce((s,x)=>s+x.d,0);
  const hasData=L.length+B.length>0;
  const safety=hasData?1-clamp01(danger/35):0.5, counterness=clamp01(punish/25);
  const ps=PRO_SLOT[c+"|"+role]; let pos=0.5; if(ps&&ps.n>=5){ const w=Math.min(1,ps.n/40); pos=0.5+w*(clamp01(0.5+(ROLE_SLOT_AVG[role]-ps.s)/1.6)-0.5); } // position de pick pro du champion à ce rôle vs moyenne du rôle
  let v=0.4*safety+0.35*pos+0.25*mi.v-0.2*Math.max(0,counterness-safety);
  v=clamp01(v);
  const badge=v>=0.58&&safety>=0.55?"B":(v<=0.42||counterness>=safety+0.25)?"C":null;
  return _blindCache[k]={v,safety,counterness,pos,badge,hard:hard.slice(0,3).map(x=>x.n+" "+x.wr+"%"),preys:preys.slice(0,3).map(x=>x.n)};
}
function blindability(cfg,c,role){ return blindInfo(cfg,c,role).v; }
function pickBadge(c,role){ return blindInfo(null,c,role||(CHAMPS[c]?CHAMPS[c].roles[0]:"M")).badge; }
// matchup : si le laner adverse est connu => matchup de lane ; sinon => capacité à être pické à l'aveugle
function matchup(cfg,c,role,enemies){
  const I=ctrIndex(cfg); let s=0; const good=[],bad=[];
  const laner=enemies.find(e=>e.roles.length===1&&e.roles[0]===role);
  enemies.forEach(e=>{
    if(!e.roles.includes(role)) return;
    const same = e.roles.length>1?0.6:1;
    const g=ctrGet(I,c,e.name,role), b=ctrGet(I,e.name,c,role);
    if(g){ s+=same*(g[2]-50)/12; if(same>=0.6||g[2]>=55) good.push(e.name+" "+g[2]+"%"); }
    if(b){ s-=same*(b[2]-50)/12; if(same>=0.6||b[2]>=55) bad.push(e.name+" "+(100-b[2]).toFixed(1)+"%"); }
  });
  if(laner) return {v:clamp01(0.5+s), good, bad, mode:"lane", laner:laner.name};
  const bl=blindability(cfg,c,role);
  return {v:bl, good, bad, mode:"blind", blind:bl};
}
function compProfile(names){
  const p={}; AXES.forEach(a=>p[a]=0); let ad=0,ap=0;
  names.forEach(n=>{const c=CHAMPS[n]; if(!c) return; AXES.forEach(a=>p[a]+=c[a]);
    if(c.dmg==="AD") ad+=1; else if(c.dmg==="AP") ap+=1; else if(c.dmg==="MIX"){ad+=.5;ap+=.5;} });
  return {p,ad,ap};
}
const AXIS_AVG={}; AXES.forEach(a=>{ AXIS_AVG[a]=CHAMP_NAMES.reduce((s,n)=>s+CHAMPS[n][a],0)/CHAMP_NAMES.length; });
// Identité = axes nettement au-dessus de la moyenne dans les picks déjà faits
function identity(names){
  if(!names.length) return {axes:[],w:null};
  const p=compProfile(names).p, rel={};
  AXES.forEach(a=>rel[a]=p[a]/(AXIS_AVG[a]*names.length));
  const axes=AXES.slice().sort((a,b)=>rel[b]-rel[a]).filter(a=>rel[a]>=1.15).slice(0,2);
  const tot=AXES.reduce((s,a)=>s+Math.max(0,rel[a]-0.8),0)||1, w={};
  AXES.forEach(a=>w[a]=Math.max(0,rel[a]-0.8)/tot);
  return {axes,w};
}
function cohesion(c,allies){
  const ch=CHAMPS[c]; if(!allies.length) return {v:0.5,fills:[],dmgNote:null};
  const id=identity(allies); let align=0; AXES.forEach(a=>align+=id.w[a]*ch[a]/3);
  const fills=id.axes.filter(a=>ch[a]>=2).map(a=>AXIS_FR[a]);
  // besoins de base à partir de 2 picks : un peu d'engage et de réception
  const cur=compProfile(allies); let need=0.5;
  if(allies.length>=2){ need=0.4; if(cur.p.engage<3&&ch.engage>=2){need+=0.35; fills.push("Engage manquant");} if(cur.p.peel<2&&ch.peel>=2){need+=0.25; fills.push("Réception manquante");} }
  let v=0.65*clamp01(align*1.4)+0.35*clamp01(need);
  const ad=cur.ad+(ch.dmg==="AD"?1:ch.dmg==="MIX"?.5:0), ap=cur.ap+(ch.dmg==="AP"?1:ch.dmg==="MIX"?.5:0);
  let dmgNote=null;
  if(ad+ap>=3){ const r=ad/(ad+ap); if(r>0.8||r<0.2){ v-=0.25; dmgNote= r>0.8?"trop AD":"trop AP"; } }
  return {v:clamp01(v), fills:[...new Set(fills)], dmgNote};
}

// ---- Déroulé de draft (20 étapes) ----
const STEPS = [
 ["ban","B"],["ban","R"],["ban","B"],["ban","R"],["ban","B"],["ban","R"],
 ["pick","B"],["pick","R"],["pick","R"],["pick","B"],["pick","B"],["pick","R"],
 ["ban","R"],["ban","B"],["ban","R"],["ban","B"],
 ["pick","R"],["pick","B"],["pick","B"],["pick","R"]
];
function stepLabel(i){ const [t,s]=STEPS[i]; let n=0; for(let k=0;k<=i;k++) if(STEPS[k][0]===t&&STEPS[k][1]===s) n++;
  return s+(t==="ban"?" ban ":" pick ")+n; }
function teamPicks(draft,team){ return draft.actions.map((a,i)=>({a,i})).filter(x=>x.a&&x.a.name&&STEPS[x.i][0]==="pick"&&STEPS[x.i][1]===team).map(x=>x.a); }
function unavailable(series,draft){ const s=new Set(series.locked); draft.actions.forEach(a=>{ if(a&&a.name) s.add(a.name); }); return s; }
function openRoles(picks){ const taken=new Set(picks.filter(p=>!p.flex&&p.role).map(p=>p.role)); return ROLES.filter(r=>!taken.has(r)); }
function enemyInfo(picks){ return picks.map(p=>({name:p.name, roles: p.flex? (p.fxr&&p.fxr.length?p.fxr:CHAMPS[p.name]?CHAMPS[p.name].roles:[p.role]) : [p.role||(CHAMPS[p.name]?CHAMPS[p.name].roles[0]:"M")]})); }

// 4 critères : affinité, méta, synergie (avec nos picks), matchup (contre leurs picks).
// Sans pick allié, la synergie est ignorée ; sans laner adverse connu, le matchup devient la capacité à être blind pick.
function scorePick(cfg,c,role,ctx){
  const W=cfg.weights, pid=ctx.lineup[role];
  const af=affinity(cfg,pid,role,c), fo=force(cfg,c,role), sy=synergy(cfg,c,role,ctx.alliesObj), mu=matchup(cfg,c,role,ctx.enemies);
  const duo=(role==="A"||role==="S")&&ctx.alliesRoles.includes(role==="A"?"S":"A");
  // Poids ajustés selon le côté et le moment de la draft
  const n=ctx.pickNo, side=ctx.side||"B";
  const mMeta=ctx.firstPick?1.5:(n<=2?1.25:(ctx.lastPick?0.8:1));
  // Remplaçant : on priorise son confort → son affinité pèse 1,6×
  const isSub=(PLAYERS.find(p=>p.id===pid)||{}).sub;
  const parts=[["Affinité",af.v,W.affinite*(isSub?1.6:1)],["Méta",fo,W.force*mMeta]];
  if(ctx.allies.length) parts.push(["Synergie",sy.v,W.synergie*(duo?1.6:1)*(n<=3?1.2:1)]);
  const tW=[1,0.7,0.4,0.15,0][Math.min(4,n-1)]*(ctx.firstPick?1.2:1);
  let tim=null; if(tW>0){ tim=timingScore(cfg,c,role,ctx); /* un confort S/A du joueur peut sortir tôt : le timing pro ne doit pas l'enterrer */ const tt=af.tier; if(tt==="S") tim=Math.max(tim,0.75); else if(tt==="A") tim=Math.max(tim,0.5); parts.push(["Timing",tim,W.force*tW]); }
  let duoPart=null;
  if(ctx.redDuo&&!ctx.allies.length){ // rouge : duo enchaîné en picks 1-2
    for(const r2 of (ctx.open||[])){ if(r2===role) continue; const pid2=ctx.lineup[r2]; if(!pid2) continue;
      const pt=poolOf(ctx.cfg||{tiers:{}},pid2,r2).find(b=>!ctx.un.has(b)&&b!==c&&provenDuo(cfg,c,role,b,r2)); if(pt){ duoPart=pt; break; } }
    if(duoPart) parts.push(["Duo",1,W.synergie*0.6]);
  }
  // Cohérence de compo (calibrage pro : une compo sans faiblesse est le meilleur prédicteur de victoire)
  let coh=null; if(ctx.allies.length>=2){ const names=ctx.allies.map(a=>a.name||a), before=compTags(names), after=compTags(names.concat([c]));
    coh=clamp01(0.55-0.2*after.weak.length+0.05*after.strong.length-(after.weak.length>before.weak.length?0.1:0));
    parts.push(["Compo",coh,W.synergie*(ctx.allies.length>=3?1:0.7)]); }
  // Premier pick bleu : léger ajustement d'après les B1 pro 2026
  let b1=0; if(ctx.firstPick&&side==="B"){ b1=b1Adj(c); if(b1) parts.push(["1er pick pro",clamp01(0.5+b1*4),W.force*0.35]); }
  let expo=0; const topK=role==="T"?1.35:1; // le matchup top compte plus (calibrage pro + habitudes de l'équipe)
  // Une seule unité « Matchup / Blind » (poids 25) : son laner adverse est connu → 100 % counter ; pas encore connu → 100 % blindabilité
  if(mu.mode==="lane") parts.push(["Matchup",mu.v,W.matchup*topK]);
  else {
    const open=ctx.theirOpen||ROLES; expo=open.includes(role)?Math.min(1,(ctx.enemyAfter||0)/Math.max(1,open.length)):0;
    if(expo>0) parts.push(["Blind",mu.v,W.matchup*topK]);
  }
  // Nos picks : bonus si le champion punit la compo adverse (dès 3 picks en face)
  const exploit=(ctx.enemies||[]).length>=3?exploitOf(c,ctx.enemies.map(x=>x.name)):null;
  if(exploit) parts.push(["Exploite leur compo",1,W.synergie*0.45]);
  const tw=parts.reduce((s,p)=>s+p[2],0)||1;
  const raw=parts.reduce((s,p)=>s+p[1]*p[2],0)/tw;
  // Échelle d'affichage : 90+ = pick excellent, 75-90 = très bon, 60-75 = correct, < 60 = à éviter
  // Échelle : ≤ 92 = score normal (90+ = très bon pick) ; 93–98 = les 3 critères (gros counter de sa lane, synergie/compo, confiance du joueur),
  // d'autant plus haut qu'ils sont maximisés ; 98–100 = 3 critères + pick qui casse la compo adverse (exploite une faiblesse ou écrase sa lane)
  const synBest=!ctx.allies.length?0:(coh==null?sy.v:(sy.v+coh)/2);
  const strong=af.v>=0.75&&mu.mode==="lane"&&mu.v>=0.84&&synBest>=0.7; // gros counter ≈ 54 %+ de WR en lane
  let breaker=null;
  if(strong&&(ctx.enemies||[]).length>=3){ const C=CHAMPS[c]||{}, ew=compTags(ctx.enemies.map(x=>x.name)).weak;
    if(ew.includes("Peu de réception")&&(C.engage||0)>=3) breaker="punit leur manque de réception";
    else if(ew.includes("Peu d'engage")&&(C.poke||0)>=2) breaker="les poke sans qu'ils puissent engager";
    else if(ew.includes("Teamfight faible")&&(C.teamfight||0)>=3) breaker="gagne les teamfights contre une compo qui n'en veut pas";
    else if(ew.includes("Early faible")&&(C.early||0)>=3) breaker="punit leur early faible";
    else if(mu.v>=0.99) breaker="écrase sa lane"; }
  const q=strong?(clamp01((af.v-0.75)/0.25)+clamp01((mu.v-0.84)/0.16)+clamp01((synBest-0.7)/0.3))/3:0;
  const score=strong?(breaker?Math.round(98+2*q):Math.round(93+5*q)):Math.max(1,Math.min(92,Math.round(45+(raw-0.35)*100)));
  const genius=!!breaker;
  const why=[];
  const ex=[]; if(af.games) ex.push(`${af.games} g. en équipe`); if(af.sq) ex.push(`${af.sq.g} g. en solo Q`);
  why.push(ex.length?"Expérience : "+ex.join(" + "):"Peu joué"+(af.tier!=="-"?` (tier ${af.tier})`:""));
  const m=metaInfo(c,role), p=PRO[c];
  why.push(`Méta : ${p?`${p.p} picks / ${p.b} bans en pro`:"absent en pro"}${m.wr?` · ${m.wr} % WR solo Q`:""}`);
  if(sy.duos&&sy.duos.length) why.push("Duo avéré avec "+sy.duos.join(", "));
  if(sy.why.length) why.push("Synergie "+sy.why.join(", "));
  if(sy.bad.length) why.push("⚠ Anti-synergie "+sy.bad.join(", "));
  if(mu.mode==="lane"){ if(mu.good.length) why.push("Bat "+mu.good.join(", ")); if(mu.bad.length) why.push("⚠ Perd vs "+mu.bad.join(", ")); if(!mu.good.length&&!mu.bad.length) why.push("Matchup équilibré ou sans données"); }
  else { const bi=blindInfo(cfg,c,role);
    why.push(bi.badge==="B"?"Blindable : pas de gros counter courant":bi.badge==="C"?"⚠ Plutôt en réponse"+(bi.preys.length?" (punit "+bi.preys.join(", ")+")":""):"Blind : moyen");
    if(bi.hard.length&&bi.badge!=="B") why.push("Craint "+bi.hard.join(", ")); }
  if(duoPart) why.push("Duo avéré possible avec "+duoPart+" au pick suivant");
  if(mu.mode!=="lane"&&expo>0&&side==="B"&&n>=4) why.push("⚠ Exposé au dernier pick adverse");
  if(mu.mode==="lane"&&ctx.enemyAfter===0) why.push("Dernier pick : le matchup compte double");
  if(breaker) why.unshift("★ Pick de génie : "+breaker+" (gros counter, synergie, confiance du joueur)");
  else if(strong) why.unshift("Les 3 critères réunis : gros counter, synergie/compo, confiance du joueur");
  if(ctx.firstPick) why.push("First pick : force et blind prioritaires");
  if(b1>=0.03) why.push(`Premier pick qui gagne en pro (${B1_PRO[c][1]}/${B1_PRO[c][0]})`); else if(b1<=-0.03) why.push(`⚠ Premier pick qui perd souvent en pro (${B1_PRO[c][1]}/${B1_PRO[c][0]})`);
  if(coh!=null&&coh>=0.6) why.push("Compo cohérente avec ce pick"); else if(coh!=null&&coh<=0.3) why.push("⚠ Laisse la compo avec des faiblesses");
  if(tim!=null&&tim<0.5) why.push("Rôle/champion rarement pické aussi tôt");
  if(NEXT_DELTA[c]) why.push((NEXT_DELTA[c]>0?"buff ":"nerf ")+PATCH_NEXT.v);
  if(exploit) why.unshift(`Exploite ${exploit.why} (${FAMS[exploit.fam].fr})`);
  return {name:c, role, score, raw, parts, why, tier:af.tier, badge:pickBadge(c,role), duo:!!(sy.duos&&sy.duos.length), exploit:!!exploit};
}
// Habitudes de l'équipe : jungle/mid/ADC en premier, top en pick 4-5, support après l'ADC
function roleOrderOf(cfg){ const o=(cfg&&cfg.roleOrder&&cfg.roleOrder.length===5)?cfg.roleOrder:["J","A","S","M","T"]; return o; }
// Priorité d'un rôle à ce moment : rôles habituellement pickés tôt d'abord ; le support remonte une fois l'ADC pris
function rolePriority(pickNo,alliesRoles,cfg,enemyRoles){
  const o=roleOrderOf(cfg), out={};
  ROLES.forEach(r=>{ let slot=o.indexOf(r)+1; if(r==="S"&&alliesRoles.includes("A")) slot=Math.min(slot,pickNo); out[r]=1-0.15*Math.max(0,slot-1);
    if((enemyRoles||[]).includes(r)) out[r]+=1; }); // rôle déjà pické en face : on connaît leur champion, on répond en priorité
  return out;
}
// Timing : un rôle (et un champion) rarement pickés à ce moment de la draft sont pénalisés au début, puis plus du tout
function timingScore(cfg,c,role,ctx){
  if(ctx.enemies&&ctx.enemies.some(x=>x.roles.length===1&&x.roles[0]===role)) return 1; // répondre à un rôle déjà pické en face : le bon moment
  if(role==="S"&&ctx.alliesRoles.includes("A")) return 1; // le support suit l'ADC
  const side=ctx.side||"B", n=ctx.pickNo; let v;
  if(side==="B"&&n===1){ const f=PRO_FIRST.B; v=f[role]/Math.max(...Object.values(f)); }          // qui part en B1 aux Worlds
  else if(side==="R"&&n<=2){ const f=PRO_FIRST.R; v=f[role]/Math.max(...Object.values(f)); }     // qui part en R1-R2
  else v=clamp01(1-(PRO_ROLE_SLOT[side][role]-n-0.5)/2);                                          // position moyenne du rôle aux Worlds
  // le champion lui-même : un mid pické très tôt en pro (Orianna, Cassiopeia…) n'est pas pénalisé parce que les mids partent tard en moyenne
  const ps=PRO_SLOT[c+"|"+role]; if(ps&&ps.n>=15){ const vc=clamp01(1-(ps.s-n-1)/2), w=Math.min(1,ps.n/60); v=w*vc+(1-w)*v; }
  return v;
}
function pickContext(draft,lineup,series){
  const us=draft.side, them=us==="B"?"R":"B";
  const allies=teamPicks(draft,us), enemiesRaw=teamPicks(draft,them), enemies=enemyInfo(enemiesRaw);
  const i=draft.actions.findIndex(a=>!a);
  let enemyAfter=0; if(i>=0) for(let k=i;k<20;k++) if(STEPS[k][0]==="pick"&&STEPS[k][1]===them&&!draft.actions[k]) enemyAfter++;
  const theirOpen=openRoles(enemiesRaw.map(p=>({...p,role:p.role||(CHAMPS[p.name]?CHAMPS[p.name].roles[0]:null)})));
  const pickNo=allies.length+1;
  return {allies:allies.map(a=>a.name), alliesObj:allies.map(a=>({name:a.name,role:a.flex?null:a.role})), alliesRoles:allies.filter(a=>!a.flex).map(a=>a.role), enemies, lineup, pickNo, open:openRoles(allies),
    side:us, enemyAfter, theirOpen, firstPick:us==="B"&&pickNo===1, lastPick:us==="R"&&pickNo===5, redDuo:us==="R"&&pickNo<=2,
    un:series?unavailable(series,draft):new Set()};
}
// Moment de la draft : ce que le côté et l'ordre des picks changent
function draftMoment(draft){
  const ctx=pickContext(draft,{}); const s=ctx.side, n=ctx.pickNo;
  if(ctx.firstPick) return "First pick : sécuriser un pick très fort et blindable, base de la compo";
  if(ctx.redDuo) return "Picks 1-2 enchaînés : prendre un duo avéré sans interruption";
  if(ctx.lastPick) return "Dernier pick : counter-pick d'une lane adverse";
  if(s==="B"&&n>=4) return "Le dernier pick adverse peut counter : rester blindable sur la lane encore ouverte";
  return n<=3?"Construire autour des premiers picks":"Compléter la compo";
}
function recommendPicks(cfg,series,draft,lineup,per=5){
  const un=unavailable(series,draft); const ctx=pickContext(draft,lineup,series); ctx.cfg=cfg; const out={};
  const prio=rolePriority(ctx.pickNo,ctx.alliesRoles,cfg,(ctx.enemies||[]).filter(x=>x.roles.length===1).map(x=>x.roles[0]));
  ctx.open.slice().sort((a,b)=>prio[b]-prio[a]||roleOrderOf(cfg).indexOf(a)-roleOrderOf(cfg).indexOf(b)).forEach(role=>{
    const pid=lineup[role];
    const list=poolOf(cfg,pid,role).filter(c=>!un.has(c)).filter(c=>!(cfg.excludeD&&tierFor(cfg,pid,role,c)==="D"))
      .map(c=>scorePick(cfg,c,role,ctx)).sort((a,b)=>b.score-a.score).slice(0,per);
    // Picks 4-5 : ce qui comblerait les faiblesses de NOTRE compo (anneau bleu), y compris 2 champions hors de son pool mais très bons dans la draft actuelle
    const gaps=ctx.allies.length>=3?familyGaps(ctx.allies.map(a=>a.name||a)).filter(g=>g!=="catch"):[];
    if(gaps.length){ list.forEach(x=>{ const f=familiesOf(x.name).find(k=>gaps.includes(k)); if(f) x.fill=f; });
      const inList=new Set(list.map(x=>x.name)), pool=new Set(poolOf(cfg,pid,role));
      const extra=CHAMP_NAMES.filter(c=>!un.has(c)&&!inList.has(c)&&!pool.has(c)&&CHAMPS[c].roles.includes(role)&&familiesOf(c).some(k=>gaps.includes(k))&&(metaInfo(c,role).v>=0.55||metaInfo(c,role).pres>=8))
        .map(c=>{ const x=scorePick(cfg,c,role,ctx); x.fill=familiesOf(c).find(k=>gaps.includes(k)); x.offpool=true; x.why.unshift(`Hors de son pool, mais comble notre manque de ${FAMS[x.fill].fr.toLowerCase()}`); return x; })
        .sort((a,b)=>b.score-a.score).slice(0,2);
      const ref=list[4]?list[4].score:0; extra.forEach((x,k)=>{ let i=list.findIndex(y=>!y.offpool&&y.score<x.score); if(i<0) i=list.length; list.splice(x.score>=ref-8?Math.max(Math.min(i,5+k),Math.min(5+k,list.length)):Math.min(i,7+k),0,x); }); list.forEach(x=>{ if(x.fill&&!x.offpool) x.why.unshift(`Comble notre manque de ${FAMS[x.fill].fr.toLowerCase()}`); }); }
    // Nos flex (discret) : champion aussi joué par un autre de nos joueurs (tier S/A/B) à un autre rôle encore ouvert
    // (les deux joueurs au moins en B, et l'un des deux en S/A : ex. Viktor JH S / Bastien B, Dr. Mundo top/jungle)
    list.forEach(x=>{ const t0=tierFor(cfg,pid,role,x.name), OK=["S","A","B"], HI=["S","A"]; if(!OK.includes(t0)) return;
      const o=ctx.open.filter(r=>{ if(r===role||!lineup[r]) return false; const t1=tierFor(cfg,lineup[r],r,x.name); return OK.includes(t1)&&(HI.includes(t0)||HI.includes(t1)); }); if(o.length) x.ourFlex=o; });
    out[role]={list, prio:prio[role]};
  });
  return out;
}
// Duos avérés : très joués ensemble en pro et/ou en solo Q (pas seulement une bonne stat)
// Duo pro « actuel » : les deux champions sont vraiment joués en pro récemment
function isProDuo(a,b){ return (PRO[a]?PRO[a].p:0)>=PRO_DUO_MIN&&(PRO[b]?PRO[b].p:0)>=PRO_DUO_MIN; }
// Duo déjà joué par l'équipe (Parthenon) : les deux champions ont des games en équipe
function teamDuo(a,b){ return (STATS[a]&&STATS[a].g>=3)&&(STATS[b]&&STATS[b].g>=3); }
function provenDuo(cfg,a,ra,b,rb){
  const k=[a,b].sort().join("+");
  // Un duo, c'est une vraie complémentarité : jamais avec une anti-synergie mesurée, et jouer souvent ensemble en pro ne suffit pas
  const pd=proDuoInfo(a,ra,b,rb); if(proDuoNamed(pd)) return "pro"; // duo nommé : l'étiquette reste, le score suit sa performance
  const q=synVal(cfg,a,ra,b,rb); if(q&&q.v<0.5) return null;
  if(proDuoOK(pd)) return "pro";
  // solo Q : seulement si le duo gagne nettement plus ensemble (≥ +2,5 % de WR) sur un gros volume
  if((ra==="A"&&rb==="S")||(ra==="S"&&rb==="A")){ const ad=ra==="A"?a:b, su=ra==="A"?b:a;
    const x=BOT_SYN.find(z=>z[0]===ad&&z[1]===su); if(x&&x[3]>=450&&x[2]>=2.5) return "solo Q"; }
  const y=SYN_META.find(z=>((z[0]===a&&z[2]===b&&(!ra||z[1]===ra)&&(!rb||z[3]===rb))||(z[0]===b&&z[2]===a&&(!rb||z[1]===rb)&&(!ra||z[3]===ra)))&&z[5]>=600&&z[4]>=2.5);
  return y?"solo Q":null;
}
// ---- Botlane croisée : la lane se joue à deux ----
function laneWR(I,a,b,role){ const g=ctrGet(I,a,b,role); if(g) return g[2]; const l=ctrGet(I,b,a,role); return l?100-l[2]:null; }
// Avantage estimé d'un duo bot sur le duo adverse : ADC vs ADC + support vs support + écart de synergie des deux duos
function botEdge(cfg,oA,oS,tA,tS){
  const I=ctrIndex(cfg); let v=0; const why=[];
  if(oA&&tA){ const w=laneWR(I,oA,tA,"A"); if(w!=null){ v+=w-50; why.push(`${oA} vs ${tA} ${w} %`); } }
  if(oS&&tS){ const w=laneWR(I,oS,tS,"S"); if(w!=null){ v+=w-50; why.push(`${oS} vs ${tS} ${w} %`); } }
  // croisés : notre ADC contre leur support, notre support contre leur ADC (poids 1/2)
  if(oA&&tS){ const w=botCross(oA,tS); if(w!=null){ v+=0.5*(w-50); why.push(`${oA} vs ${tS} ${Math.round(w*10)/10} %`); } }
  if(oS&&tA){ const w=botCross(tA,oS); if(w!=null){ v-=0.5*(w-50); why.push(`${oS} vs ${tA} ${Math.round((100-w)*10)/10} %`); } }
  const so=oA&&oS?synVal(cfg,oA,"A",oS,"S"):null, st=tA&&tS?synVal(cfg,tA,"A",tS,"S"):null;
  if(so||st){ const d=((so?so.v:0)-(st?st.v:0))*0.5; v+=d; if(Math.abs(d)>=0.5) why.push(`synergie ${d>0?"meilleure":"moins bonne"} que la leur`); }
  return {v:Math.round(v*10)/10, why};
}
// ---- Pool restant de l'adversaire (op.gg de la préparation), rôle par rôle ----
function enemyPoolLeft(cfg,series,draft,prep,k=5){
  const P=prepPlayers(prep); if(!P.length) return null;
  const us=draft.side, them=us==="B"?"R":"B", theirs=teamPicks(draft,them), un=unavailable(series,draft);
  const open=openRoles(theirs.map(p=>({...p,role:p.role||(CHAMPS[p.name]?CHAMPS[p.name].roles[0]:null)}))), order=roleOrderOf(cfg);
  return open.slice().sort((a,b)=>order.indexOf(a)-order.indexOf(b)).map(role=>{ const pl=P.find(p=>p.role===role);
    const list=pl?pl.list.filter(x=>!un.has(x.c)&&x.g>=5).slice(0,k).map(x=>({name:x.c,g:x.g,wr:x.wr})):[];
    return {role, player:pl?pl.name.split("#")[0]:null, list}; });
}
// ---- Prédiction des picks adverses restants ----
function predictEnemy(cfg,series,draft,prep,lineup,k=4){ return enemyCandidates(cfg,series,draft,prep,lineup).map(x=>({...x,list:x.list.slice(0,k)})); }
// First pick adverse (on est rouge) : leur pool × champion blindable fort en méta × rôle habituellement pické en premier
function firstPickGuess(cfg,series,draft,prep,lineup,k=5){
  const fmax=Math.max(...Object.values(PRO_FIRST.B)), out=[];
  enemyCandidates(cfg,series,draft,prep,lineup).forEach(R=>{ R.list.slice(0,12).forEach(x=>{
    const bi=blindInfo(cfg,x.name,R.role), m=metaInfo(x.name,R.role), pr=PRO[x.name], pp=pr?clamp01((pr.p+pr.b)/400):0;
    const appeal=0.5*bi.v+0.3*m.v+0.2*pp;
    const why=[...x.why.filter(w=>w!=="Blindable")]; if(bi.badge==="B") why.push("Blindable"); if(pp>=0.5) why.push("Très présent en pro");
    out.push({name:x.name, role:R.role, s:x.s*(0.5+0.5*appeal)*(0.35+0.65*PRO_FIRST.B[R.role]/fmax)*(1+1.5*(x.intent||0)), why:[ROLE_NAMES[R.role]+(R.player?" · "+R.player:""), ...why]}); }); });
  const seen={}, per={}; return out.sort((a,b)=>b.s-a.s).filter(x=>{ if(seen[x.name]||(per[x.role]||0)>=2) return false; seen[x.name]=1; per[x.role]=(per[x.role]||0)+1; return true; }).slice(0,k); // 2 par rôle max
}
function enemyCandidates(cfg,series,draft,prep,lineup){
  const us=draft.side, them=us==="B"?"R":"B";
  const ours=teamPicks(draft,us), theirs=teamPicks(draft,them);
  const open=openRoles(theirs.map(p=>({...p,role:p.role||(CHAMPS[p.name]?CHAMPS[p.name].roles[0]:null)})));
  const un=unavailable(series,draft), I=ctrIndex(cfg), P=prepPlayers(prep);
  const order=roleOrderOf(cfg);
  return open.slice().sort((a,b)=>order.indexOf(a)-order.indexOf(b)).map(role=>{
    const pl=P.find(p=>p.role===role); const mine=ours.find(p=>!p.flex&&p.role===role);
    const pool={}; if(pl){ const mx=Math.max(1,...pl.list.map(x=>x.g)); pl.list.forEach(x=>{ if(x.g>=5) pool[x.c]={com:Math.log(1+x.g)/Math.log(1+mx), g:x.g, wr:x.wr}; }); }
    const cands=new Set(Object.keys(pool));
    CHAMP_NAMES.forEach(c=>{ const m=metaInfo(c,role), pr=PRO[c]; if(!m.off&&(m.pres>=8||(pr&&pr.p+pr.b>=150&&m.pres>=3))) cands.add(c); });
    if(mine) CHAMP_NAMES.forEach(c=>{ if(CHAMPS[c].roles.includes(role)){ const w=laneWR(I,c,mine.name,role); if(w!=null&&w>=54) cands.add(c); } });
    if(mine&&pl) vsAgainst(pl,mine.name).forEach(x=>{ if(x.g>=2) cands.add(x.c); });
    (series&&series.games||[]).forEach(g=>(g.actions||[]).forEach((a,k)=>{ if(a&&a.name&&STEPS[k][0]==="ban"&&STEPS[k][1]!==g.side&&CHAMPS[a.name]&&CHAMPS[a.name].roles.includes(role)) cands.add(a.name); }));
    draft.actions.forEach((a,k)=>{ if(a&&a.name&&STEPS[k][0]==="ban"&&STEPS[k][1]===them) CHAMP_NAMES.forEach(c=>{ if(CHAMPS[c].roles.includes(role)){ const w=laneWR(I,a.name,c,role); if(w!=null&&w>=52) cands.add(c); } }); });
    // Lecture de leurs bans : bannir les counters d'un champion = le préparer ; un champion qu'ils bannissaient dans une game précédente et qu'ils laissent ouvert = pick prévu
    const myBans=draft.actions.map((a,k)=>a&&a.name&&STEPS[k][0]==="ban"&&STEPS[k][1]===them?{name:a.name,k}:null).filter(Boolean);
    const past=[]; (series&&series.games||[]).forEach((g,gi)=>(g.actions||[]).forEach((a,k)=>{ if(a&&a.name&&STEPS[k][0]==="ban"&&STEPS[k][1]!==g.side) past.push({name:a.name,g:gi+1,side:g.side==="B"?"R":"B"}); }));
    // un ban sur un de NOS conforts (tiers S/A) vise surtout nos joueurs : il compte peu comme signal de leur plan
    const ourSA=n=>ROLES.some(r=>{ const t=tierFor(cfg,lineup[r],r,n); return (t==="S"||t==="A")&&CHAMPS[n]&&CHAMPS[n].roles.includes(r); });
    const intentOf=c=>{ let v=0; const why=[]; const ctr=myBans.filter(b=>{ if(ourSA(b.name)) return false; const w=laneWR(I,b.name,c,role); return w!=null&&w>=52; });
      if(ctr.length){ v+=ctr.reduce((t,b)=>t+(b.k>=12?0.45:0.3),0); why.push(`Ils ont banni ${ctr.length>1?"ses counters":"son counter"} ${ctr.map(b=>b.name).join(", ")} : ils le préparent`); }
      const sa=ourSA(c), pc=pool[c]?pool[c].com:0; const pb=sa&&!pc?[]:past.filter(x=>x.name===c);
      if(pb.length&&!myBans.some(b=>b.name===c)){ const flip=pb.some(x=>x.side!==them)&&them==="B"; v+=flip?0.7:0.4;
        why.push(flip?`Banni par eux en G${pb.map(x=>x.g).join(", G")} (côté rouge), laissé ouvert côté bleu : first pick prévu`:`Banni par eux en G${pb.map(x=>x.g).join(", G")}, laissé ouvert cette fois : ils comptent le jouer`); }
      if(sa&&pb.length) v*=pc; // aussi un de nos conforts : signal pondéré par son attachement au champion
      return {v:Math.min(1,v), why}; };
    // Score = 60 % pool (son op.gg solo Q) + 40 % réflexion : counter de nos picks, synergie avec les leurs, méta, mécaniques qui nous punissent
    const ourObjs=ours.map(o=>({name:o.name,role:o.flex?null:o.role}));
    const list=[...cands].filter(c=>!un.has(c)&&CHAMPS[c]&&CHAMPS[c].roles.includes(role)).map(c=>{
      const m=metaInfo(c,role), why=[]; let ctxv, cw=null;
      if(mine){ cw=laneWR(I,c,mine.name,role); ctxv=cw==null?0.5:clamp01(0.5+(cw-50)/12); if(cw!=null&&cw>=53) why.push(`Counter de votre ${mine.name} (${cw} %)`); }
      else { const bi=blindInfo(cfg,c,role); ctxv=bi.v; if(bi.badge==="B") why.push("Blindable"); }
      let syn=0, synW=null; theirs.forEach(t=>{ const q=synVal(cfg,c,role,t.name,t.flex?null:t.role); if(q&&q.v>syn){ syn=q.v; synW=t.name; } });
      if(syn>=2) why.push(`Synergie avec leur ${synW} (+${syn} %)`);
      const td=traitDanger(c,ourObjs); why.push(...td.why);
      const reason=clamp01(0.35*ctxv+0.2*clamp01(0.5+syn/8)+0.2*m.v+0.25*td.v);
      const p=pool[c]; let poolV;
      if(p){ poolV=p.com; why.unshift(`${pl.name.split("#")[0]} : ${p.g} g.${p.wr!=null?` (${p.wr} %)`:""}`); }
      else { const pr=PRO[c], pop=Math.max(clamp01((m.pres||0)/25), pr?clamp01((pr.p+pr.b)/400):0); // populaire en solo Q ou en pro
        // hors de son pool : pris en compte légèrement, surtout en fin de draft (picks 4-5) et s'il casse notre compo
        const late=theirs.length>=3, tdv=traitDanger(c,ourObjs).v;
        poolV=pl?(late?0.15+0.25*tdv:0.05)*pop:0.5*m.v;
        if(pl&&late&&tdv>=0.4&&pop>=0.3) why.push("Hors de son pool, mais punit votre compo"); else if(pl&&pop>=0.5) why.push("Hors de son pool"); }
      const it=intentOf(c); if(it.why.length) why.unshift(...it.why);
      // Ce qu'il joue d'habitude contre notre laner (solo Q) : un pick qu'il connaît dans ce matchup remonte
      let hab=0; const hv=mine?vsHabit(pl,c,mine.name):null;
      if(hv&&hv.g>=2){ hab=Math.min(1,hv.g/6)*(0.6+0.4*clamp01((hv.wr-35)/30)); why.unshift(`Contre votre ${mine.name} en solo Q : ${hv.g} games (${hv.wr} %)`); }
      const s=0.6*poolV+0.4*reason+0.45*it.v+0.4*hab;
      // Très dangereux pour notre compo : gros counter de notre lane, ou mécanique qui nous punit fort
      const danger=(cw!=null&&cw>=54)||td.v>=0.4;
      return {name:c, s, why, cw, mine:mine?mine.name:null, inPool:!!p, intent:it.v, habit:hab, danger:danger||hab>=0.6};
    }).sort((a,b)=>b.s-a.s);
    return {role, player:pl?pl.name.split("#")[0]:null, list};
  });
}
function recommendDuos(cfg,series,draft,lineup,n=20){
  const r=recommendPicks(cfg,series,draft,lineup,40); const out=[];
  const ctx=pickContext(draft,lineup,series); const er=(ctx.enemies||[]).filter(x=>x.roles.length===1).map(x=>x.roles[0]);
  const eb=r=>{ const x=(ctx.enemies||[]).find(z=>z.roles.length===1&&z.roles[0]===r); return x?x.name:null; }, tA=eb("A"), tS=eb("S");
  const pairs=[["A","S"],["M","J"],["J","S"],["M","T"],["T","J"],["M","S"]];
  pairs.forEach(([x,y])=>{ if(!r[x]||!r[y]) return;
    r[x].list.forEach(a=>r[y].list.forEach(b=>{ if(a.name===b.name) return;
      if(provenDuo(cfg,a.name,x,b.name,y)!=="pro") return;
      const p=synVal(cfg,a.name,x,b.name,y), team=teamDuo(a.name,b.name);
      const ans=(er.includes(x)?1:0)+(er.includes(y)?1:0); // le duo répond à des lanes déjà connues
      let edge=null;
      if(x==="A"&&y==="S"&&(tA||tS)){ edge=botEdge(cfg,a.name,b.name,tA,tS); }
      const pd=proDuoInfo(a.name,x,b.name,y), pw=pd?pd.w/pd.n:0.5;
      const sc=Math.round((a.score+b.score)/2+(p?Math.max(0,p.v):0)+(team?5:0)+ans*4+(edge?edge.v*1.5:0)+(pd?2*duoAdj(pd):0));
      out.push({a,b,score:Math.min(100,sc),raw:sc,syn:p?p.v:null,roles:[x,y],team,answer:ans>0,edge,pro:pd?{n:pd.raw||pd.n,wr:Math.round(pw*100)}:null}); })); });
  out.sort((p,q)=>(q.raw??q.score)-(p.raw??p.score));
  const used={}, res=[]; // variété : un champion apparaît au plus 2 fois
  for(const x of out){ if(res.length>=n) break; if((used[x.a.name]||0)>=2||(used[x.b.name]||0)>=2) continue; used[x.a.name]=(used[x.a.name]||0)+1; used[x.b.name]=(used[x.b.name]||0)+1; res.push(x); }
  return res;
}
// ---- Idées de picks pendant la phase de bans 1 : first pick (bleu) ou duo R1-R2 (rouge) ----
function pickIdeas(cfg,series,draft,lineup,n=6){
  const r=recommendPicks(cfg,series,draft,lineup,5), flat=[];
  Object.keys(r).forEach(role=>r[role].list.forEach(x=>flat.push(x)));
  if(draft.side!=="R"){ const seen={}; return {kind:"B", list:flat.sort((a,b)=>b.score-a.score).filter(x=>!seen[x.name]&&(seen[x.name]=1)).slice(0,n)}; } // ordre strict du score
  const roles=Object.keys(r), out=[];
  roles.forEach((x,i)=>roles.slice(i+1).forEach(y=>r[x].list.slice(0,5).forEach(a=>r[y].list.slice(0,5).forEach(b=>{ if(a.name===b.name) return;
    const q=synVal(cfg,a.name,x,b.name,y), pd=provenDuo(cfg,a.name,x,b.name,y)?proDuoInfo(a.name,x,b.name,y):null, team=teamDuo(a.name,b.name);
    const sc=(a.score+b.score)/2+(q?Math.max(-3,Math.min(6,q.v)):0)+(pd?duoAdj(pd):0)+(team?3:0);
    const why=[`${a.name} ${a.score} + ${b.name} ${b.score}`]; if(q&&q.v>=1) why.push(`synergie +${q.v} %`); if(pd) why.push(`duo pro, ${pd.raw} games ensemble (${pd.lift>=0?"+":""}${pd.lift} pts vs attendu)`); if(team) why.push("déjà joués en équipe");
    out.push({a,b,roles:[x,y],score:Math.min(100,Math.round(sc)),raw:sc,why}); }))));
  const used={}, res=[]; out.sort((p,q)=>q.raw-p.raw);
  for(const x of out){ if(res.length>=n) break; if((used[x.a.name]||0)>=2||(used[x.b.name]||0)>=2) continue; used[x.a.name]=(used[x.a.name]||0)+1; used[x.b.name]=(used[x.b.name]||0)+1; res.push(x); }
  return {kind:"R", list:res};
}
function nextIsDouble(draft){ const i=draft.actions.findIndex(a=>!a); if(i<0||i>=19) return false;
  return STEPS[i][0]==="pick"&&STEPS[i+1][0]==="pick"&&STEPS[i][1]===draft.side&&STEPS[i+1][1]===draft.side; }

// ---- Préparation des bans (solo Q adverse, multi-op.gg) ----
// prep.players = [{name, rank, role?, champs:[[champion, games, wr], ...]}]
function inferRole(champs){
  const sc={}; champs.forEach(([c,g])=>{ const ch=CHAMPS[findChamp(c)]; if(ch) sc[ch.roles[0]]=(sc[ch.roles[0]]||0)+g; });
  return Object.keys(sc).sort((a,b)=>sc[b]-sc[a])[0]||"M";
}
function roleShares(champs){ const sc={}; let t=0; champs.forEach(([c,g])=>{ const ch=CHAMPS[findChamp(c)]; if(ch){ sc[ch.roles[0]]=(sc[ch.roles[0]]||0)+g; t+=g; } }); ROLES.forEach(r=>sc[r]=t?(sc[r]||0)/t:0); return sc; }
function permutations(a){ if(a.length<=1) return [a]; const o=[]; a.forEach((x,i)=>permutations(a.slice(0,i).concat(a.slice(i+1))).forEach(p=>o.push([x,...p]))); return o; }
// Habitudes en solo Q contre un champion précis (détail « vs » d'op.gg : leur champion → [adversaire de lane, games, WR])
function vsHabit(pl,c,opp){ if(!pl||!pl.vs) return null; let best=null;
  for(const k in pl.vs){ if(findChamp(k)!==c) continue; (pl.vs[k]||[]).forEach(([o,g,wr])=>{ if(findChamp(o)===opp&&(!best||g>best.g)) best={g:+g,wr:+wr}; }); }
  return best; }
function vsAgainst(pl,opp){ const out=[]; if(!pl||!pl.vs) return out;
  for(const k in pl.vs){ const c=findChamp(k); (pl.vs[k]||[]).forEach(([o,g,wr])=>{ if(c&&findChamp(o)===opp) out.push({c,g:+g,wr:+wr}); }); }
  return out.sort((a,b)=>b.g-a.g); }
function prepPlayers(prep){
  const L=(prep&&prep.players||[]).map(p=>{ const champs=(p.champs||[]).map(([c,g,wr,kda])=>({c:findChamp(c),g:+g,wr:wr==null?null:+wr,kda:kda==null?null:+kda})).filter(x=>x.c).sort((a,b)=>b.g-a.g);
    return {...p, role:p.role||inferRole(champs.map(x=>[x.c,x.g])), list:champs, _sh:roleShares(champs.map(x=>[x.c,x.g]))}; });
  // 5 joueurs sans rôle imposé : un rôle chacun, la répartition qui colle le mieux à leurs champions
  if(L.length===5&&!L.some(p=>p.role&&(prep.players.find(q=>q.name===p.name)||{}).role)){
    let best=null,bv=-1; permutations(ROLES).forEach(perm=>{ const v=perm.reduce((s,r,i)=>s+L[i]._sh[r],0); if(v>bv){ bv=v; best=perm; } });
    if(best) L.forEach((p,i)=>p.role=best[i]);
  }
  // On ne garde que les champions jouables au rôle du joueur (ex. les supports d'un mid qui joue aussi support)
  L.forEach(p=>{ p.all=p.list; const f=p.list.filter(x=>CHAMPS[x.c]&&CHAMPS[x.c].roles.includes(p.role)); if(f.length>=3) p.list=f; });
  return L;
}
// Rang op.gg -> valeur numérique (Diamant 4 0 LP = 2400, Maître 0 LP = 2800)
function rankValue(r){
  const t=normName(r||""); const lp=+((String(r||"").replace(/(\d)[,.\u202f ](\d{3})/g,"$1$2").match(/(\d+)\s*LP/i)||[])[1]||0);
  if(/challenger|grandmaitre|grandmaster|maitre|master/.test(t)) return 2800+lp;
  const tiers=[["fer",0],["iron",0],["bronze",400],["argent",800],["silver",800],["or",1200],["gold",1200],["platine",1600],["platinum",1600],["emeraude",2000],["emerald",2000],["diamant",2400],["diamond",2400]];
  const f=tiers.find(([k])=>t.startsWith(k)); if(!f) return null;
  const div=+((String(r).match(/\b([1-4])\b/)||[])[1]||4); return f[1]+(4-div)*100+lp;
}
// Joueur le plus fort en face, dans l'ordre demandé :
// 1) LP actuels et pic nettement au-dessus (> 100 LP d'écart) ; 2) sinon efficacité : WR élevé en peu de games ;
// 3) sinon pool le plus méta + KDA moyen.
function playerStrength(p){
  const cur=rankValue(p.rank), pk=rankValue(p.peak)||cur, lp=cur==null?null:Math.round(0.7*cur+0.3*Math.max(cur,pk||0));
  const g=(p.w||0)+(p.l||0), wr=g?100*p.w/g:(p.wr||null);
  const eff=g&&wr!=null?((wr*g+50*30)/(g+30)-50)+10*Math.log2(300/Math.max(40,g)):0;
  const L=(p.list||[]).slice(0,8), tot=L.reduce((s,x)=>s+x.g,0)||1;
  const meta=L.reduce((s,x)=>s+x.g/tot*metaInfo(x.c,p.role).v,0);
  const kL=L.filter(x=>x.kda!=null), kda=p.kda||(kL.length?kL.reduce((s,x)=>s+x.kda*x.g,0)/kL.reduce((s,x)=>s+x.g,0):null);
  return {lp, cur, peak:pk, games:g||null, wr:wr==null?null:Math.round(wr), eff, meta, kda, s3:meta*10+(kda||2.5)*3};
}
function rankPlayers(P){
  const S=P.map(p=>({p,s:playerStrength(p)}));
  const why=(a,b)=>{ if(a.s.lp!=null&&b.s.lp!=null&&Math.abs(a.s.lp-b.s.lp)>100) return {k:1,d:a.s.lp-b.s.lp};
    if(Math.abs(a.s.eff-b.s.eff)>=5) return {k:2,d:a.s.eff-b.s.eff}; return {k:3,d:a.s.s3-b.s.s3}; };
  S.sort((a,b)=>-why(a,b).d);
  S.forEach((x,i)=>{ x.rank=i+1; const o=S[i===0?1:0]; if(!o){ x.reason=""; return; } const w=why(x,o), n=o.p.name.split("#")[0];
    x.reason=w.k===1?(i===0?`LP et pic nettement au-dessus (${Math.round(x.s.lp-o.s.lp)} pts de plus que ${n})`:"")
      :w.k===2?(i===0?`LP proches de ${n} : meilleur rendement (${x.s.wr} % en ${x.s.games} games contre ${o.s.wr} % en ${o.s.games})`:"")
      :(i===0?`LP et rendement proches de ${n} : pool plus méta${x.s.kda?` et KDA ${x.s.kda.toFixed(2)}`:""}`:""); });
  return S;
}
// Nos counters possibles : un joueur de notre line-up à ce rôle joue un champion qui bat c
// Nos counters possibles : champions du pool de notre joueur à ce rôle qui battent c sur ce rôle
function ourCounters(cfg,c,role,lineup){
  if(!lineup||!lineup[role]) return []; const pid=lineup[role], I=ctrIndex(cfg); const out=[];
  poolOf(cfg,pid,role).forEach(x=>{ const t=tierFor(cfg,pid,role,x); const sq=(OUR_SQ[pid]||{})[x]; if(!(t==="S"||t==="A"||(sq&&sq.g>=30))) return;
    const m=ctrGet(I,x,c,role); if(m&&m[2]>=52) out.push({player:pid,champ:x,wr:m[2]}); });
  return out.sort((a,b)=>b.wr-a.wr).slice(0,4);
}
function banPlan(cfg,prep,lineup,un,tb){
  const out=[]; const PP=prepPlayers(prep);
  const vals=PP.map(p=>rankValue(p.rank)); const R={}; rankPlayers(PP).forEach(x=>R[x.p.name]=x);
  PP.forEach((pl,pi)=>{
    const list=pl.list; if(!list.length) return;
    const total=list.reduce((s,x)=>s+x.g,0)||1, second=list[1];
    const others=vals.filter((v,k)=>k!==pi&&v!=null); const me=vals[pi];
    const gap= me!=null&&others.length? me-others.reduce((s,v)=>s+v,0)/others.length : 0;
    list.forEach((x,i)=>{
      const why=[], tags=[]; const share=x.g/total;
      const m=metaInfo(x.c,pl.role), meta=m.v;
      const wrS=x.wr==null?0.5:((x.wr/100)*x.g+0.5*20)/(x.g+20);
      const perf=clamp01((wrS-0.45)/0.12), kd=x.kda==null?0.5:clamp01((x.kda-1.8)/2.2);
      // Un ban vise d'abord un vrai confort du compte (volume + rendement) ; la force sur le patch ne compte que s'il sait le jouer
      const vol=Math.min(1,Math.log1p(x.g)/Math.log1p(120));
      const comfort=vol*(0.55+0.3*perf+0.15*kd)*(0.6+0.4*Math.min(1,share/0.2)); // part de ses games : un 4e champion pèse moins qu'un main
      // Bans 1-3 : on tâte le terrain → uniquement l'affinité du compte avec le champion (pas la méta)
      let s=comfort;
      // Raisons courtes, chacune appuyée par une stat
      const st=`${x.g} games${x.wr!=null?` · ${x.wr} % de victoires`:""}${x.kda?` · KDA ${x.kda}`:""} · ${Math.round(share*100)} % de ses parties`;
      if(i===0 && x.g>=25 && second && x.g>=2.5*Math.max(1,second.g)){ s+=0.25; tags.push("One-trick"); why.push(`One-trick : ${st} (2e champion : ${second.c}, ${second.g} g.)`); }
      else if(i===0){ tags.push("Main"); why.push(`Son champion le plus joué : ${st}`); }
      else why.push(`Confort n°${i+1} : ${st}`);
      if(x.g>=20&&x.wr!=null&&x.wr<48) why.push(`Beaucoup joué mais seulement ${x.wr} % de victoires`);
      if(PRO[x.c]&&PRO[x.c].b>=100) why.push(`Très banni en pro (${PRO[x.c].b} bans)`);
      const rk=R[pl.name]?R[pl.name].rank:3; s+=[0.12,0.06,0.02,0,-0.04][rk-1]*vol;
      if(rk===1) tags.push("Meilleur joueur");
      // Notre équipe compte aussi : si notre joueur a un vrai counter qu'il maîtrise (et encore dispo), ce confort adverse est moins prioritaire
      const ocAll=ourCounters(cfg,x.c,pl.role,lineup), oc=ocAll.filter(o=>!(un&&un.has(o.champ)));
      // Lecture de leurs bans : s'ils bannissent notre counter de ce champion, ils préparent sans doute ce pick → il remonte
      const hit=tb?ocAll.filter(o=>tb.has(o.champ)):[];
      if(hit.length){ /* s'ils bannissent un de nos conforts S/A, c'est surtout pour nous gêner : signal faible */
        const k=Math.max(...hit.map(o=>{ const t=tierFor(cfg,o.player,pl.role,o.champ); return clamp01((o.wr-51)/5)*affinity(cfg,o.player,pl.role,o.champ).v*(t==="S"||t==="A"?0.35:1); }));
        if(k>=0.12){ s=s*(1+0.5*k)+0.12*k; why.unshift(`⚠ Ils ont banni ${hit.map(o=>o.champ).join(", ")}, notre counter : pick probable`); tags.unshift("Préparé par leurs bans"); } }
      if(oc.length){ const k=Math.max(...oc.map(o=>clamp01((o.wr-51)/5)*affinity(cfg,o.player,pl.role,o.champ).v));
        if(k>0.05){ s*=1-0.3*k*[0.4,0.7,1,1,1][rk-1]; /* le meilleur joueur adverse joue mieux autour d’un counter */ tags.push("Contrable par nous"); } }
      out.push({name:x.c, player:pl.name||"", role:pl.role, score:Math.round(100*clamp01(s)), why, tags, counters:oc});
    });
  });
  const best={}; out.forEach(x=>{ if(!best[x.name]||best[x.name].score<x.score) best[x.name]=x; });
  // Réflexion globale : pas de quota par joueur ; si un joueur domine avec deux gros conforts, ses deux champions passent devant
  const sorted=Object.values(best).sort((a,b)=>b.score-a.score); sorted.forEach(x=>x.prio=x.score);
  return sorted;
}
// Bans : phase 1 = préparation + bans des pros ; phase 2 = counters encore pickables, faiblesses de notre compo, conforts adverses
function weaknesses(names){
  if(!names.length) return [];
  const p=compProfile(names).p, n=names.length, out=[];
  if(p.peel<0.8*n) out.push("peel"); if(p.engage<0.9*n) out.push("engage"); if(p.early<1.2*n) out.push("early"); if(p.scaling<1.2*n) out.push("scaling");
  return out;
}
function recommendBans(cfg,series,draft,prep,lineup,n=10){
  const us=draft.side, them=us==="B"?"R":"B";
  const ours=teamPicks(draft,us), theirs=teamPicks(draft,them);
  const phase2=draft.actions.filter((a,i)=>a&&STEPS[i][0]==="pick").length>=6;
  const un=unavailable(series,draft); const I=ctrIndex(cfg);
  // Fearless : les champions déjà joués dans la série sortent des pools adverses, leurs conforts restants deviennent les cibles
  const lockedS=new Set(series.locked||[]);
  const prepF=lockedS.size?Object.assign({},prep,{players:(prep.players||[]).map(p=>Object.assign({},p,{champs:(p.champs||[]).filter(x=>!lockedS.has(findChamp(x[0])))}))}):prep;
  const tb=new Set(draft.actions.map((a,i)=>a&&a.name&&STEPS[i][0]==="ban"&&STEPS[i][1]===them?a.name:null).filter(Boolean));
  const planAll=banPlan(cfg,prepF,lineup,un,tb); const P=prepPlayers(prep);
  const played={}; P.forEach(pl=>pl.list.forEach(x=>{ if(x.g>=5&&(!played[x.c]||played[x.c].g<x.g)) played[x.c]={g:x.g,name:pl.name.split("#")[0]}; }));
  const short=w=>w.length>70?w.slice(0,68)+"…":w;
  if(!phase2){
    // Phase 1 : ~80 % préparation (dans l'ordre de priorité), ~20 % bans pro / méta joués un peu par l'adversaire
    const plan=planAll.filter(x=>!un.has(x.name)).map((x,k)=>({name:x.name, prep:true,
      why:[`Préparation n°${planAll.indexOf(x)+1} · ${x.player.split("#")[0]} (${ROLE_NAMES[x.role]})`, ...(lockedS.size?["Fearless : un de ses conforts encore disponibles"]:[]), ...x.tags, ...x.why.slice(0,2).map(short)]}));
    const inPlan=new Set(plan.map(x=>x.name));
    // Bans « pro / méta » : 45 % présence pro (picks + bans), 25 % force solo Q, 30 % danger pour nos champions S/A ; côté rouge +25 % blindable
    const PMAX=Math.max(...CHAMP_NAMES.map(c=>PRO[c]?PRO[c].p+PRO[c].b:0))||1;
    const oursSA={}; ROLES.forEach(r=>{ oursSA[r]=CHAMP_NAMES.filter(o=>{ const t=tierFor(cfg,lineup[r],r,o); return (t==="S"||t==="A")&&CHAMPS[o].roles.includes(r); }); });
    const dangerFor=c=>{ let s=0, hits=[]; CHAMPS[c].roles.forEach(r=>(oursSA[r]||[]).forEach(o=>{ const g=ctrGet(I,c,o,r); if(g&&g[2]>=51.5){ s+=clamp01((g[2]-50)/8); hits.push([o,g[2]]); } }));
      hits.sort((a,b)=>b[1]-a[1]); return {v:clamp01(s/3), hits}; };
    const ourT=c=>ROLES.map(r=>tierFor(cfg,lineup[r],r,c)).find(t=>t==="S"||t==="A");
    const pro=CHAMP_NAMES.filter(c=>!un.has(c)&&!inPlan.has(c)).map(c=>{ const p=PRO[c], pres=p?(p.p+p.b)/PMAX:0, m=metaInfo(c,null), dg=dangerFor(c);
      const pl=played[c], mine=ourT(c); let s=0.45*pres+0.25*m.v+0.3*dg.v+(pl?0.25:0)-(mine?0.15:0);
      const why=["Suggestion pro / méta"]; if(mine) why.push(`Dans nos tiers ${mine} : on préfère le garder pour nous`);
      if(us==="R"){ const bi=blindInfo(cfg,c,CHAMPS[c].roles[0]); s+=0.25*bi.v; if(bi.badge==="B") why.push("Blindable : un first pick de moins pour le côté bleu"); }
      if(p&&p.p+p.b>=150) why.push(`Présent dans ${p.p+p.b} drafts pro (${p.b} bans, ${p.p} picks)`);
      if(dg.hits.length) why.push(`Contre nos ${dg.hits.slice(0,3).map(h=>`${h[0]} (${Math.round((100-h[1])*10)/10} % pour nous)`).join(", ")}`);
      if(m.v>=0.6&&m.wr) why.push(`Fort en solo Q Master+ (${m.wr} %)`);
      if(pl) why.push(`Joué par ${pl.name} (${pl.g} games)`);
      return {name:c, s, why, prep:false}; }).sort((a,b)=>b.s-a.s);
    if(!plan.length) return pro.slice(0,n);
    // Bans 1-3 (phase 1) : uniquement les conforts adverses ; les suggestions pro/méta ne viennent qu'après, en complément
    return plan.concat(pro).slice(0,n);
  }
  // Phase 2 : un seul calcul avec la prédiction — score = probabilité qu'ils le pickent × danger pour vous
  const weak=weaknesses(ours.map(p=>p.name)); const out=[]; const theirNames=theirs.map(t=>t.name); const strat=banStrategy(cfg,series,draft,lineup,prep);
  const depthOf={}; try{ prepPlayers(prep).forEach(p=>{ depthOf[p.role]=p.list.filter(x=>x.g>=10&&!un.has(x.c)).length; }); }catch(e){}
  enemyCandidates(cfg,series,draft,prep,lineup).forEach(R=>{ R.list.forEach(x=>{
    const c=x.name, ch=CHAMPS[c], why=[...x.why]; let danger=0;
    if(x.mine&&x.cw!=null&&x.cw>50){ danger+=clamp01((x.cw-50)/8)*(us==="B"?1.2:1); if(!why.some(w=>w.startsWith("Counter"))) why.push(`Counter de votre ${x.mine} (${x.cw} %)`); }
    else if(!x.mine){ const bi=blindInfo(cfg,c,R.role); danger+=(us==="R"?0.6:0.3)*bi.v; if(us==="R"&&bi.badge==="B"&&!why.includes("Blindable")) why.push("Blindable : les forcer sur un pick contrable"); }
    if(weak.includes("peel")&&ch.engage>=3&&ch.early>=2){ danger+=0.3; why.push("Punit votre manque de réception"); }
    if(weak.includes("engage")&&ch.poke>=2){ danger+=0.2; why.push("Poke dangereux face à votre manque d'engage"); }
    if(weak.includes("early")&&ch.early>=3){ danger+=0.15; why.push("Fort en early contre vous"); }
    { const td=traitDanger(c,ours.map(o=>({name:o.name,role:o.flex?null:o.role}))); if(td.v){ danger+=td.v; why.push(...td.why); } }
    theirs.forEach(t=>{ const q=synVal(cfg,c,R.role,t.name,t.flex?null:t.role); if(q&&q.v>=2.5){ danger+=0.15; why.push(`Synergie avec leur ${t.name} (+${q.v} %)`); } });
    if(x.intent>=0.4){ danger+=0.5*x.intent; why.unshift("⚠ Pick préparé par leurs bans"); }
    // Familles : leur compo a un trou (pas d'engage / pas de réception) → bannir ce qui le comblerait ; une famille déjà marquée → bannir ce qui la renforce
    if(theirNames.length>=2){ const fc=familiesOf(c), gaps=familyGaps(theirNames), cnt=familyCount(theirNames), mode=strat?strat.mode:"deny";
      // Taille du pool du joueur à ce rôle : un pool large suit la logique de compo ; un pool réduit reste sur ses conforts et ses counters
      const depth=depthOf[R.role]??5, kd=0.3+0.7*clamp01((depth-3)/5);
      const fill=fc.filter(f=>gaps.includes(f)), dom=fc.filter(f=>cnt[f]>=2);
      if(fill.length){ danger+=(mode==="deny"?0.4:0.15)*kd; why.unshift(`Compléterait leur compo : ${fill.map(f=>FAMS[f].fr).join(", ")} qui leur manque`); x.fam="deny"; }
      else if(dom.length){ danger+=(mode==="synergy"?0.35:0.05)*kd; if(mode==="synergy"){ why.unshift(`Renforcerait leur ${FAMS[dom[0]].fr} (déjà ${cnt[dom[0]]} champions) : synergie à casser`); x.fam="synergy"; } }
      if(x.fam&&depth<=3) why.push(`Pool réduit (${depth} champions à 10 games ou plus) : il restera plutôt sur ses conforts`); }
    out.push({name:c, s:x.s*(0.4+danger), p:x.s, danger, why:[...new Set(why)], prep:x.inPool, role:R.role, fam:x.fam||null});
  }); });
  const best={}; out.forEach(x=>{ if(!best[x.name]||best[x.name].s<x.s) best[x.name]=x; });
  const list=Object.values(best).sort((a,b)=>b.s-a.s);
  // Alerte : un pick peu probable mais qui casserait votre compo reste visible
  const top=list.slice(0,n), alerts=list.slice(n).filter(x=>x.danger>=0.9).sort((a,b)=>b.danger-a.danger).slice(0,2);
  alerts.forEach((a,k)=>{ a.why.unshift("⚠ Peu probable, mais casserait votre compo"); top.splice(Math.min(top.length,3+k*3),0,a); });
  return top.slice(0,n);
}
// ---- Familles de jeu (philosophie de chaque champion) : 1 à 2 familles par champion ----
const FAMS={engage:{fr:"Engage",ic:"⚔"},catch:{fr:"Pick / Catch",ic:"🎯"},peel:{fr:"Réception",ic:"🛡"},poke:{fr:"Poke",ic:"☄"},dive:{fr:"Dive",ic:"⤵"},teamfight:{fr:"Teamfight",ic:"✸"},split:{fr:"Split",ic:"↯"},scaling:{fr:"Scaling",ic:"⏳"},early:{fr:"Early game",ic:"⚡"}};
const CATCH=new Set("Thresh,Blitzcrank,Pyke,Nautilus,Morgana,Bard,Ahri,Lux,Zoe,Elise,LeBlanc,Twisted Fate,Rengar,Kha'Zix,Nidalee,Evelynn,Lee Sin,Pantheon,Qiyana,Neeko,Ashe,Jhin,Varus,Caitlyn,Zyra,Tristana,Kalista,Shaco,Talon,Fiddlesticks,Nocturne,Draven,Ezreal,Syndra,Vex,Rek'Sai,Naafiri,Ambessa".split(","));
const DIVE=new Set("Diana,Vi,Jarvan IV,Xin Zhao,Wukong,Camille,Irelia,Akali,Kai'Sa,Zed,Talon,Rek'Sai,Nocturne,Hecarim,Kayn,Viego,Yone,Yasuo,Samira,Ambessa,Naafiri,Fizz,Katarina,Sylas,Renekton,Tristana,Kha'Zix,Rengar,Lee Sin,Qiyana,Briar,Bel'Veth,Olaf,Darius,Volibear,Zac".split(","));
const SPLIT=new Set("Fiora,Jax,Camille,Tryndamere,Yorick,Gwen,Nasus,Riven,Kayle,Trundle,Shen,Garen,Aatrox,Sion,Udyr,Gangplank,Quinn,Irelia".split(","));
function familiesOf(c){ const ch=CHAMPS[c]; if(!ch) return []; const sc={};
  if(ch.engage>=3) sc.engage=3+ch.engage/10; if(ch.peel>=3||(ch.peel>=2&&ch.engage<2&&ch.roles.includes("S"))) sc.peel=2.9+ch.peel/10;
  if(CATCH.has(c)) sc.catch=2.8; if(ch.poke>=2) sc.poke=ch.poke>=3?3.1:2.4; if(DIVE.has(c)) sc.dive=2.7;
  if(ch.teamfight>=3&&!sc.engage) sc.teamfight=2.5; if(SPLIT.has(c)) sc.split=2.6; if(ch.scaling>=3&&ch.early<=1) sc.scaling=2.3; if(ch.early>=3&&ch.scaling<=1) sc.early=2.35;
  return Object.keys(sc).sort((a,b)=>sc[b]-sc[a]).slice(0,2); }
// Bilan d'une compo : familles présentes (nombre) et manques importants (engage, réception)
function familyCount(names){ const n={}; Object.keys(FAMS).forEach(f=>n[f]=0); names.forEach(c=>familiesOf(c).forEach(f=>n[f]++)); return n; }
function familyGaps(names){ if(names.length<2) return []; const n=familyCount(names), g=[];
  if(!n.engage) g.push("engage"); if(!n.peel) g.push("peel"); if(!n.engage&&!n.catch&&!n.dive) g.push("catch"); return g; }
// Tempo d'une compo : "early" = tout sur l'early sans scaling, "late" = scaling sans early
function compTempo(names){ if(names.length<3) return null; const n=familyCount(names), ch=names.map(c=>CHAMPS[c]).filter(Boolean); if(!ch.length) return null;
  const aE=ch.reduce((s,x)=>s+x.early,0)/ch.length, aS=ch.reduce((s,x)=>s+x.scaling,0)/ch.length;
  if(n.early>=2&&!n.scaling&&aS<=1.6&&aE-aS>=0.8) return "early";
  if(n.scaling>=2&&!n.early&&aE<=1.4&&aS-aE>=0.8) return "late"; return null; }
// Ce qui punit la compo adverse : leurs trous (pas de réception, pas d'engage) et leur famille dominante
function punishers(names){ const out={}; if(names.length<3) return out; const n=familyCount(names), gaps=familyGaps(names);
  if(gaps.includes("peel")) ["dive","catch","engage"].forEach(f=>out[f]=out[f]||"leur manque de réception");
  if(gaps.includes("engage")) ["poke","scaling"].forEach(f=>out[f]=out[f]||"leur manque d'engage");
  if(n.engage+n.dive>=3) out.peel=out.peel||"leur compo tout-engage (réception/désengage)";
  if(n.poke>=2) ["engage","dive"].forEach(f=>out[f]=out[f]||"leur compo poke");
  const tp=compTempo(names); if(tp==="early") out.scaling=out.scaling||"leur compo sans scaling"; if(tp==="late") out.early=out.early||"leur compo lente en early";
  return out; }
function exploitOf(c,names){ const P=punishers(names); const f=familiesOf(c).find(x=>P[x]); return f?{fam:f,why:P[f]}:null; }
// Stratégie des bans 4-5 : si on a encore de quoi punir leur compo → les priver de la pièce manquante ; sinon → casser leur synergie
function banStrategy(cfg,series,draft,lineup,prep){ const us=draft.side, them=us==="B"?"R":"B";
  const theirN=teamPicks(draft,them).map(p=>p.name); if(theirN.length<3) return null;
  const un=unavailable(series,draft), open=openRoles(teamPicks(draft,us)), tools=[];
  open.forEach(r=>CHAMP_NAMES.forEach(c=>{ if(un.has(c)||!CHAMPS[c].roles.includes(r)) return; const t=tierFor(cfg,lineup[r],r,c); if(t!=="S"&&t!=="A") return; const x=exploitOf(c,theirN); if(x) tools.push({c,r,...x}); }));
  const gaps=familyGaps(theirN).filter(g=>g!=="catch"), n=familyCount(theirN), dom=Object.keys(n).sort((a,b)=>n[b]-n[a])[0];
  // Peuvent-ils encore combler leur trou ? (champions de leur pool, à leurs rôles restants, encore disponibles)
  let fillers=[]; try{ const P=prepPlayers(prep||{}), tOpen=openRoles(teamPicks(draft,them));
    tOpen.forEach(r=>{ const pl=P.find(q=>q.role===r); const pool=pl?pl.list.filter(x=>x.g>=5).map(x=>x.c):CHAMP_NAMES.filter(c=>CHAMPS[c].roles.includes(r)&&metaInfo(c,r).pres>=8);
      pool.forEach(c=>{ if(!un.has(c)&&CHAMPS[c].roles.includes(r)&&familiesOf(c).some(f=>gaps.includes(f))) fillers.push(c); }); }); }catch(e){}
  if(gaps.length&&!fillers.length) return {mode:"synergy",dom,gaps,tools,label:`Ils ne peuvent plus combler leur manque ${gaps.map(g=>g==="engage"?"d'engage":"de réception").join(" et ")} : casser leur synergie (${FAMS[dom].fr})`};
  return tools.length>=2&&gaps.length?{mode:"deny",gaps,tools:tools.slice(0,4),label:`Les priver ${gaps.map(g=>g==="engage"?"d'engage":"de réception").join(" et ")} : vous avez de quoi punir (${tools.slice(0,3).map(t=>t.c).join(", ")})`}
    :{mode:"synergy",dom,gaps,tools,label:`Casser leur synergie (${FAMS[dom].fr}) : ${tools.length?"trop peu de champions chez nous pour punir leur compo":"aucun champion disponible chez nous pour punir leur compo"}`}; }
// ---- Mécaniques qui contrent : grappins contre bot peu mobile, anti-dash contre compo à dashs ----
const HOOKS=new Set(["Pyke","Blitzcrank","Thresh","Nautilus"]), ANTIDASH=new Set(["Poppy","Janna"]);
const DASHERS=new Set("Leona,Vi,Akali,Corki,Rakan,Alistar,Rell,Jarvan IV,Lee Sin,Yone,Yasuo,Irelia,Kai'Sa,Camille,Hecarim,Sejuani,Wukong,Xin Zhao,Pantheon,Gragas,Lucian,Tristana,Kalista,Ambessa,Gwen,Riven,Fiora,Jax,Renekton,Zac,Diana,Kha'Zix,Rengar,Qiyana,Sylas,LeBlanc,Ahri,Galio,Maokai,Vayne,Graves,Kindred,Lillia,Viego,Aatrox".split(","));
const IMMOBILE=new Set("Jinx,Ashe,Varus,Jhin,Miss Fortune,Senna,Smolder,Twitch,Sivir,Aphelios,Kog'Maw,Ziggs,Lulu,Soraka,Sona,Yuumi,Nami,Karma,Milio,Seraphine,Zilean,Janna,Zyra,Xerath,Lux,Morgana,Brand,Vel'Koz,Swain".split(","));
function traitDanger(c,ours){ // ours = [{name,role}]
  let v=0; const why=[]; const bot=ours.filter(o=>o.role==="A"||o.role==="S").map(o=>o.name);
  if(HOOKS.has(c)){ const im=bot.filter(n=>IMMOBILE.has(n)); if(im.length){ v+=0.35*im.length; why.push(`Grappin : punit votre ${im.join(" + ")}, peu mobile${im.length>1?"s":""}`); } }
  if(ANTIDASH.has(c)){ const ds=ours.map(o=>o.name).filter(n=>DASHERS.has(n)); if(ds.length>=2){ v+=0.2*ds.length; why.push(`Bloque les dashs de ${ds.join(", ")}`); } }
  return {v:Math.min(1,v), why};
}
// ---- Support exposé : leur support n'est pas choisi et ils piquent encore après vous ----
function botExposure(cfg,series,draft,prep,lineup){
  const i=draft.actions.findIndex(a=>!a); if(i<0) return null;
  const us=draft.side, them=us==="B"?"R":"B";
  const ours=teamPicks(draft,us).map(a=>({name:a.name,role:a.flex?null:a.role})), theirs=teamPicks(draft,them);
  if(theirs.some(p=>p.role==="S")) return null;
  let after=0; for(let k=i;k<20;k++) if(STEPS[k][0]==="pick"&&STEPS[k][1]===them&&!draft.actions[k]) after++;
  if(!after) return null;
  const ourS=ours.find(o=>o.role==="S"), ourTurn=STEPS[i][1]===us;
  if(!ourS&&!(ourTurn&&STEPS[i][0]==="pick")) return null;
  let R=null; try{ R=enemyCandidates(cfg,series,draft,prep,lineup).find(x=>x.role==="S"); }catch(e){}
  const threats=(R?R.list.slice(0,10):[]).map(x=>{ const t=traitDanger(x.name,ours); return {name:x.name, s:x.s*(0.5+t.v)+0.2*t.v, why:[...t.why, ...x.why.slice(0,1)]}; })
    .sort((a,b)=>b.s-a.s).slice(0,3);
  const phase2=draft.actions.filter((a,k)=>a&&STEPS[k][0]==="pick").length>=6;
  if(ourS) return {kind:"post", after, threats, msg:`Votre bot est exposé : leur support n'est pas encore choisi (il leur reste ${after} pick${after>1?"s":""}).`+(phase2&&STEPS[i][0]==="ban"&&ourTurn?" Bannissez en priorité ce qui le contre.":"")};
  return {kind:"pre", after, threats, msg:`Support exposé au contre : si vous prenez votre support maintenant, ils choisiront le leur après vous.`+(us==="B"?" Côté bleu, prenez un support difficile à contrer et gardez vos 2 bans de phase 2 pour ses contres.":" Gardez-le pour votre dernier pick si possible.")};
}
// ---- Analyse des compos : forces, faiblesses, lanes, plan de jeu ----
function compTags(names){
  if(!names.length) return {strong:[],weak:[]};
  const p=compProfile(names).p, n=names.length, rel={}; AXES.forEach(a=>rel[a]=p[a]/(AXIS_AVG[a]*n));
  const strong=[], weak=[];
  if(rel.engage>=1.25&&rel.teamfight>=1.1) strong.push("Engage / teamfight"); else if(rel.engage>=1.25) strong.push("Engage");
  if(rel.poke>=1.4) strong.push(rel.peel>=1.1?"Poke / siège":"Poke");
  if(rel.engage>=1.15&&rel.early>=1.15) strong.push("Pick / dive");
  if(rel.teamfight>=1.25&&!strong.some(x=>x.includes("teamfight"))) strong.push("Teamfight");
  if(rel.early>=1.25) strong.push("Early game"); if(rel.scaling>=1.25) strong.push("Scaling");
  if(rel.peel>=1.3) strong.push("Réception / protection");
  if(n>=3){ if(rel.peel<0.7) weak.push("Peu de réception"); if(rel.engage<0.7) weak.push("Peu d'engage"); if(rel.early<0.8) weak.push("Early faible"); if(rel.scaling<0.8) weak.push("Scaling limité"); if(rel.teamfight<0.8) weak.push("Teamfight faible");
    const c=compProfile(names); const t=c.ad+c.ap; if(t>=4&&c.ad/t>0.8) weak.push("Dégâts presque tous physiques"); if(t>=4&&c.ap/t>0.8) weak.push("Dégâts presque tous magiques"); }
  return {strong,weak};
}
function analyzeDraft(cfg,draft){
  const us=draft.side, them=us==="B"?"R":"B"; const I=ctrIndex(cfg);
  const ours=teamPicks(draft,us), theirs=teamPicks(draft,them);
  const lanes=[];
  // Les 4 lanes sont toujours affichées (top, jungle, mid, botlane), même proches de 50 % ; sans duel mesuré, estimation par l'écart de winrate des deux champions (marquée ≈)
  const pick=(L,r)=>(L.find(p=>p.role===r&&!p.flex)||L.find(p=>p.role===r)||{}).name;
  const est=(a,b,r)=>{ const x=metaInfo(a,r).wr, y=metaInfo(b,r).wr; return x&&y?Math.round((50+(x-y)/2)*10)/10:50; };
  ["T","J","M"].forEach(r=>{ const a=pick(ours,r), b=pick(theirs,r); if(!a||!b) return;
    const g=ctrGet(I,a,b,r), l=ctrGet(I,b,a,r); const wr=g?g[2]:l?100-l[2]:null;
    lanes.push({role:r,ours:a,theirs:b,wr:wr!=null?Math.round(wr*10)/10:est(a,b,r),est:wr==null}); });
  { const A={o:pick(ours,"A"),t:pick(theirs,"A")}, S={o:pick(ours,"S"),t:pick(theirs,"S")};
    if(A.o&&S.o&&A.t&&S.t){ const b=botEdge(cfg,A.o,S.o,A.t,S.t);
      lanes.push(b.why.length?{role:"B",ours:A.o,ours2:S.o,theirs:A.t,theirs2:S.t,wr:Math.round((50+b.v/2)*10)/10,detail:b.why.join(" · ")}
        :{role:"B",ours:A.o,ours2:S.o,theirs:A.t,theirs2:S.t,wr:Math.round(((est(A.o,A.t,"A")+est(S.o,S.t,"S"))/2)*10)/10,est:true}); } }
  const plan=gamePlan(ours.map(p=>p.name),theirs.map(p=>p.name),lanes);
  return {us:compTags(ours.map(p=>p.name)), them:compTags(theirs.map(p=>p.name)), lanes, plan};
}
// Plan de jeu par phase, à partir du profil des deux compos et des lanes
function gamePlan(us,them,lanes){
  // Seulement des conseils marqués : une vraie dominance de lane ou un net écart de profil entre les compos. Rien de générique.
  const early=[], mid=[], late=[];
  if(us.length<4||them.length<4) return {early,mid,late,key:[]};
  const pu=compProfile(us).p, pt=compProfile(them).p, d=a=>pu[a]-pt[a], T=3;
  const real=lanes.filter(l=>!l.est), win=real.filter(l=>l.wr>=55).sort((a,b)=>b.wr-a.wr), lose=real.filter(l=>l.wr<=45).sort((a,b)=>a.wr-b.wr);
  const has=r=>win.find(l=>l.role===r), hurt=r=>lose.find(l=>l.role===r), nm=l=>l.ours+(l.ours2?" + "+l.ours2:"");
  const earlyUs=d("early")>=T, earlyThem=d("early")<=-T, scaleUs=d("scaling")>=T, scaleThem=d("scaling")<=-T;
  if(has("T")) early.push(`Top gagnant (${nm(has("T"))}, ${has("T").wr} %) : prio top pour les larves du néant.`);
  if(has("B")) early.push(`Botlane gagnante (${nm(has("B"))}, ${has("B").wr} %) : premier dragon et plaques bot.`);
  if(hurt("T")) early.push(`Top en difficulté (${nm(hurt("T"))}, ${hurt("T").wr} %) : pas de larves sans prio top.`);
  if(hurt("B")) early.push(`Botlane difficile (${nm(hurt("B"))}, ${hurt("B").wr} %) : céder le premier dragon, prendre les larves en échange.`);
  if(hurt("M")) early.push(`Mid difficile (${nm(hurt("M"))}, ${hurt("M").wr} %) : le jungler couvre le mid.`);
  if(earlyUs) early.push("Compo nettement plus forte en early : envahir et forcer les objectifs avant 14 min.");
  if(earlyThem) early.push("Ils sont nettement plus forts en early : warder sa jungle, échanger côté opposé.");
  if(d("teamfight")>=T) mid.push("Teamfight nettement supérieur : forcer les fights à 5 sur chaque dragon.");
  else if(d("teamfight")<=-T) mid.push("Leur teamfight est nettement meilleur : éviter les fights à 5, jouer les side lanes et les picks.");
  if(d("poke")>=T) mid.push("Gros avantage de poke : user avant chaque objectif, siège des tours.");
  else if(d("poke")<=-T) mid.push("Ils ont beaucoup plus de poke : engager vite ou contourner, ne pas rester en siège.");
  if(d("peel")<=-T) mid.push("Très peu de réception : vos carries restent derrière, attention aux plongeurs.");
  if(scaleUs) late.push("Vous scalez nettement mieux : pas de coin-flip, viser l'âme et le Baron.");
  if(scaleThem) late.push("Ils scalent nettement mieux : finir avant 30 min, Baron dès qu'un fight est gagné.");
  const key=[]; if(earlyUs) key.push("Jouer l'avance early"); if(earlyThem) key.push("Survivre à leur early");
  if(scaleUs) key.push("Scaling"); if(scaleThem) key.push("Finir vite"); if(d("teamfight")>=T) key.push("Stacker les drakes"); if(d("poke")>=T) key.push("Siège");
  return {early,mid,late,key};
}
// ---- Analyse de fin de draft : forces, faiblesses et estimation des chances de victoire ----
function teamEval(cfg,picks,lineup,prepPl){
  const roles=picks.map(p=>({name:p.name, role:p.flex?(CHAMPS[p.name]||{roles:["M"]}).roles[0]:p.role}));
  const meta=roles.reduce((s,p)=>s+force(cfg,p.name,p.role),0)/Math.max(1,roles.length);
  let syn=0; const synList=[];
  for(let a=0;a<roles.length;a++) for(let b=a+1;b<roles.length;b++){ const x=synVal(cfg,roles[a].name,roles[a].role,roles[b].name,roles[b].role); if(x){ syn+=x.v; if(Math.abs(x.v)>=2) synList.push(`${roles[a].name} + ${roles[b].name} (${x.v>0?"+":""}${x.v} %)`); } }
  // expérience des joueurs sur leurs champions
  let aff=0;
  roles.forEach(p=>{ if(lineup) aff+=affinity(cfg,lineup[p.role],p.role,p.name).v;
    else { const pl=(prepPl||[]).find(q=>q.role===p.role); const x=pl&&pl.list.find(z=>z.c===p.name); aff+= x? clamp01(1-Math.exp(-x.g/70)) : 0.35; } });
  aff/=Math.max(1,roles.length);
  if(!lineup&&!(prepPl||[]).length) aff=null;
  return {meta, syn, synList, aff, tags:compTags(roles.map(p=>p.name)), prof:compProfile(roles.map(p=>p.name))};
}
function analyzeFinal(cfg,draft,prep,lineup){
  const us=draft.side, them=us==="B"?"R":"B";
  const ours=teamPicks(draft,us), theirs=teamPicks(draft,them);
  const A=analyzeDraft(cfg,draft); const P=prepPlayers(prep);
  const U=teamEval(cfg,ours,lineup,null), T=teamEval(cfg,theirs,null,P);
  const factors=[];
  const add=(label,pts,detail)=>factors.push({label,pts:Math.round(pts*10)/10,detail});
  if(T.aff!=null) add("Expérience des joueurs",(U.aff-T.aff)*14, `Vous ${Math.round(U.aff*100)} · eux ${Math.round(T.aff*100)} (sur 100 : vos games vs leur solo Q préparée)`);
  else add("Expérience des joueurs",0, "Pas de préparation adverse : facteur non comparé");
  add("Méta / force des picks",(U.meta-T.meta)*20, `Vous ${Math.round(U.meta*100)} · eux ${Math.round(T.meta*100)}`);
  add("Synergies",Math.max(-6,Math.min(6,(U.syn-T.syn)*0.6)), `Vous ${U.syn>0?"+":""}${Math.round(U.syn*10)/10} % · eux ${T.syn>0?"+":""}${Math.round(T.syn*10)/10} %`);
  const lanePts=A.lanes.reduce((s,l)=>s+(l.wr-50)*(l.role==="T"?0.9:0.6)*(l.est?0.4:1),0);
  add("Matchups de lane",Math.max(-8,Math.min(8,lanePts)), A.lanes.length?A.lanes.map(l=>`${l.role==="B"?"Botlane":ROLE_NAMES[l.role]} ${l.est?"≈":""}${l.wr} %`).join(" · "):"Pas de donnée de matchup sur ces lanes");
  add("Cohérence de compo",(T.tags.weak.length-U.tags.weak.length)*1.5+(U.tags.strong.length-T.tags.strong.length)*0.5, `${U.tags.weak.length} faiblesse(s) chez vous · ${T.tags.weak.length} chez eux`);
  const total=factors.reduce((s,f)=>s+f.pts,0);
  // Calibrage pro 2026 : l'écart prédit était trop large (40 % annoncé → 46 % réel) → resserré, borné 35–65 %
  const win=Math.round(Math.max(35,Math.min(65,50+0.6*total)));
  return {win, factors, us:U, them:T, lanes:A.lanes, plan:A.plan};
}

// Bans probables contre nous : ce que nos adversaires ont banni contre nous dans l'historique (même adversaire = poids double)
function bansAgainstUs(S,opp){ const cnt={}; let games=0;
  (S||[]).forEach(s=>{ const same=opp&&s.opponent&&String(s.opponent).toLowerCase()===String(opp).toLowerCase();
    (s.games||[]).forEach(g=>{ if(!(g.actions||[]).some(Boolean)) return; games++; (g.actions||[]).forEach((a,i)=>{ if(!a||!a.name||a.miss||STEPS[i][0]!=="ban"||STEPS[i][1]===g.side) return;
      const c=cnt[a.name]||(cnt[a.name]={name:a.name,n:0,same:0,p1:0}); c.n++; if(same) c.same++; if(i<6) c.p1++; }); }); });
  return {games,list:Object.values(cnt).map(c=>({...c,w:c.n+c.same})).sort((a,b)=>b.w-a.w||b.p1-a.p1)}; }

// ---- Analyse de la game (timeline exportée du client) : phases, lanes à 10/15 min, objectifs, lecture draft / gameplay ----
const _RK={}; try{ RIOT_KEYS_RAW.split("|").forEach(t=>{ const [k,n]=t.split(":"); _RK[k]=findChamp(n)||n; }); }catch(err){}
function gameAnalysis(cfg,s,gi,pp){
  const g=s.games[gi], st=g.stats, T=st&&st.tl; if(!T||!T.g||!T.p) return null;
  const side=g.side, roleOf={};
  (g.actions||[]).forEach((a,i)=>{ if(a&&a.name&&STEPS[i][0]==="pick") roleOf[(STEPS[i][1]===side?"u":"t")+a.name]=a.role; });
  const P=T.p.map(([sd,c],i)=>{ const n=_RK[String(c)]||String(c); return {i,sd,name:n,role:roleOf[(sd===0?"u":"t")+n]||null}; });
  const n=Math.max(...T.g.map(a=>a.length)), at=(arr,m)=>arr[Math.min(m,arr.length-1)]||0;
  const team=(sd,m,k)=>P.filter(p=>p.sd===sd).reduce((a,p)=>a+at(T[k][p.i],m),0);
  const gdc=[]; for(let m=0;m<n;m++) gdc.push(team(0,m,"g")-team(1,m,"g"));
  const min=n-1, GD=m=>m<=min?gdc[m]:null;
  const by=(sd,r)=>P.find(p=>p.sd===sd&&p.role===r);
  const lane=(rs,m,k)=>{ const u=rs.map(r=>by(0,r)), t=rs.map(r=>by(1,r)); if(u.some(x=>!x)||t.some(x=>!x)||m>min) return null; return u.reduce((a,p)=>a+at(T[k][p.i],m),0)-t.reduce((a,p)=>a+at(T[k][p.i],m),0); };
  const LR=[["T",["T"]],["J",["J"]],["M",["M"]],["A",["A"]],["S",["S"]],["B",["A","S"]]];
  const lanes=LR.map(([r,rs])=>{ const u=rs.map(x=>by(0,x)), t=rs.map(x=>by(1,x)); const xp=(rs.length===1&&u[0]&&t[0]&&T.x15)?(T.x15[u[0].i]-T.x15[t[0].i]):null;
    return {role:r,ours:u.map(x=>x&&x.name).join(" + "),theirs:t.map(x=>x&&x.name).join(" + "),gd10:lane(rs,10,"g"),gd15:lane(rs,15,"g"),cs15:lane(rs,15,"c"),xp15:min>=15?xp:null}; });
  const ev=(T.ev||[]).map(([t,ty,sd,x])=>({t,ty,sd,x}));
  const kills=ph=>[0,1].map(sd=>ev.filter(e=>e.ty==="K"&&e.sd===sd&&e.t>=ph[0]*60&&e.t<ph[1]*60).length);
  const phases=[["Early","0-15",0,15],["Mid","15-25",15,25],["Late","25+",25,999]].filter(p=>p[2]<min).map(([nm,lb,a,b])=>{ const e=Math.min(b,min); return {name:nm,label:lb,delta:gdc[e]-gdc[a],kills:kills([a,b]),obj:[0,1].map(sd=>ev.filter(x=>x.sd===sd&&"DHBVA".includes(x.ty)&&x.t>=a*60&&x.t<b*60).length)}; });
  const fb=ev.find(e=>e.ty==="K"), ft=ev.find(e=>e.ty==="T");
  const deaths15=P.filter(p=>p.sd===0).map(p=>({name:p.name,role:p.role,d:ev.filter(e=>e.ty==="K"&&e.sd===1&&e.x===p.i&&e.t<900).length})).filter(x=>x.d>=2);
  // lecture : plan de draft vs déroulé
  let f=null; try{ f=analyzeFinal(cfg,{side,actions:g.actions},pp||{players:[]},s.lineup||{}); }catch(err){}
  const notes=[], ue=f&&f.us&&f.us.prof?f.us.prof.p:null, te=f&&f.them&&f.them.prof?f.them.prof.p:null;
  const g15=GD(15), win=g.result==="W";
  if(ue&&te&&g15!=null){ const eu=ue.early-ue.scaling, et=te.early-te.scaling;
    if(eu>et+2) notes.push(g15>=1000?`Plan early respecté : notre compo plus forte tôt a pris ${Math.round(g15/100)/10}k d'avance à 15 min.`:`Plan early raté : notre compo devait prendre l'avantage tôt, mais ${g15>=0?"+":""}${Math.round(g15/100)/10}k à 15 min.`);
    else if(et>eu+2) notes.push(g15>=-1500?`Early tenu face à une compo plus forte tôt (${g15>=0?"+":""}${Math.round(g15/100)/10}k à 15 min) : le scaling devait jouer pour nous.`:`Early perdu nettement face à leur compo early (${Math.round(g15/100)/10}k à 15 min).`); }
  if(f&&f.lanes) f.lanes.forEach(l=>{ const L=lanes.find(x=>x.role===l.role); if(!L||L.gd15==null) return;
    if(l.wr>=52&&L.gd15<=-500) notes.push(`${l.role==="B"?"Botlane":ROLE_NAMES[l.role]} prévue gagnante (${l.wr} %) mais ${Math.round(L.gd15/100)/10}k à 15 min : exécution à revoir.`);
    if(l.wr<=48&&L.gd15<=-500) notes.push(`${l.role==="B"?"Botlane":ROLE_NAMES[l.role]} prévue perdante (${l.wr} %) et perdue (${Math.round(L.gd15/100)/10}k à 15 min) : la draft a pesé.`);
    if(l.wr<=48&&L.gd15>=500) notes.push(`${l.role==="B"?"Botlane":ROLE_NAMES[l.role]} prévue perdante (${l.wr} %) mais gagnée (+${Math.round(L.gd15/100)/10}k à 15 min).`); });
  const lead=Math.max(...gdc), deficit=Math.min(...gdc);
  if(!win&&lead>=2500) notes.push(`Avance de ${Math.round(lead/100)/10}k à ${gdc.indexOf(lead)} min non convertie.`);
  if(win&&deficit<=-2500) notes.push(`Retour après ${Math.round(-deficit/100)/10}k de retard (${gdc.indexOf(deficit)} min).`);
  deaths15.forEach(x=>notes.push(`${x.name} (${ROLE_NAMES[x.role]||"?"}) : ${x.d} morts avant 15 min.`));
  let verdict=null; if(f){ const fav=f.win>=52, unf=f.win<=48;
    verdict=win?(unf?"Victoire malgré une draft défavorable : le gameplay a compensé.":fav?"Victoire avec une draft favorable : plan exécuté.":"Victoire, draft équilibrée."):(fav?"Défaite malgré une draft favorable : regarder l'exécution d'abord.":unf?"Défaite avec une draft défavorable : la draft a pesé.":"Défaite, draft équilibrée : le gameplay a fait la différence."); }
  return {min,gdc,gd10:GD(10),gd15:g15,gd20:GD(20),gd25:GD(25),gdEnd:gdc[min],lanes,phases,fb:fb?{t:fb.t,sd:fb.sd}:null,ft:ft?{t:ft.t,sd:ft.sd,x:ft.x}:null,
    obj:ev.filter(e=>"DHBVA".includes(e.ty)).map(e=>({t:e.t,ty:e.ty,sd:e.sd,x:e.x})),notes,verdict,draftWin:f?f.win:null}; }

// ---- Revue de draft (après coup) : nos picks face aux conseils de l'outil, lanes prévues face à l'or réel ----
function draftReview(cfg,s,gi,pp){
  const g=s.games[gi], side=g.side, them=side==="B"?"R":"B", lineup=s.lineup||{};
  const locked=[]; s.games.slice(0,gi).forEach(x=>(x.actions||[]).forEach((a,i)=>{ if(a&&a.name&&STEPS[i][0]==="pick") locked.push(a.name); }));
  const ser={locked,games:s.games.slice(0,gi)}, idx={};
  (g.actions||[]).forEach((a,i)=>{ if(a&&a.name&&STEPS[i][0]==="pick") idx[a.name]=i; });
  const picks=[];
  (g.actions||[]).forEach((a,i)=>{ if(!a||!a.name||STEPS[i][0]!=="pick"||STEPS[i][1]!==side||!a.role) return;
    const d={side,actions:g.actions.map((x,j)=>j<i?x:null)}; let R; try{ R=recommendPicks(cfg,ser,d,lineup,40); }catch(err){ return; }
    const L=(R[a.role]&&R[a.role].list||[]).filter(x=>!x.offpool), k=L.findIndex(x=>x.name===a.name);
    let sc=k>=0?L[k].score:null; if(sc==null){ try{ const c=pickContext(d,lineup,ser); c.cfg=cfg; sc=scorePick(cfg,a.name,a.role,c).score; }catch(err){} }
    let best=null; for(const r in R){ const y=(R[r].list||[]).find(x=>!x.offpool); if(y&&(!best||y.score>best.score)) best={name:y.name,role:r,score:y.score}; }
    picks.push({i,name:a.name,role:a.role,rank:k>=0?k+1:null,score:sc,top:L[0]?{name:L[0].name,score:L[0].score}:null,best}); });
  let f=null; try{ f=analyzeFinal(cfg,{side,actions:g.actions},pp||{players:[]},lineup); }catch(err){}
  const st=g.stats, gold=(t,r)=>st&&st[t]&&st[t][r]?st[t][r].gold:null;
  let GA=null; try{ GA=gameAnalysis(cfg,s,gi,pp); }catch(err){}
  const lanes=(f&&f.lanes||[]).map(l=>{ const rs=l.role==="B"?["A","S"]:[l.role]; let gd=null, at15=false;
    const L=GA&&GA.lanes.find(x=>x.role===l.role); if(L&&L.gd15!=null){ gd=L.gd15; at15=true; }
    else if(st&&rs.every(r=>gold("us",r)!=null&&gold("them",r)!=null)) gd=rs.reduce((a,r)=>a+gold("us",r)-gold("them",r),0);
    const first=idx[l.ours]!=null&&idx[l.theirs]!=null&&idx[l.ours]<idx[l.theirs];
    return {role:l.role,ours:l.ours,theirs:l.theirs,ours2:l.ours2,theirs2:l.theirs2,wr:l.wr,gd,at15,counterpicked:first&&l.wr<=47.5}; });
  const notes=[];
  lanes.filter(l=>l.counterpicked).forEach(l=>notes.push(`${l.ours} pické avant ${l.theirs} : lane contrée (${l.wr} %)`));
  (g.actions||[]).forEach((a,i)=>{ if(a&&a.name&&STEPS[i][0]==="pick"&&STEPS[i][1]===them&&i<=8){ const C=CHAMPS[a.name]; const l=lanes.find(x=>x.theirs===a.name||x.theirs2===a.name);
    if(C&&l&&!C.roles.includes(l.role==="B"?(l.theirs===a.name?"A":"S"):l.role)) notes.push(`${a.name} pické tôt puis joué hors de son rôle habituel : flex`); } });
  return {win:f?f.win:null,result:g.result||null,picks,lanes,notes}; }
// Bilan sur tout l'historique : l'outil a-t-il raison, et le suivons-nous ?
function reviewSummary(cfg,S,prepFor){
  const rows=[]; (S||[]).forEach((s,si)=>(s.games||[]).forEach((g,gi)=>{ if(!g.result||!(g.actions||[]).some(Boolean)) return;
    let r; try{ r=draftReview(cfg,s,gi,prepFor(s)); }catch(err){ return; } rows.push({si,gi,date:s.date,opp:s.opponent,r}); }));
  const W=a=>a.filter(x=>x.r.result==="W").length, grp=f=>{ const a=rows.filter(f); return {n:a.length,w:W(a)}; };
  const P=rows.flatMap(x=>x.r.picks), top3=P.filter(p=>p.rank&&p.rank<=3).length;
  const follow=x=>x.r.picks.length&&x.r.picks.filter(p=>p.rank&&p.rank<=3).length>=Math.ceil(x.r.picks.length*0.6);
  const L=rows.flatMap(x=>x.r.lanes).filter(l=>l.gd!=null);
  const lf=L.filter(l=>l.wr>=52), lu=L.filter(l=>l.wr<=48);
  const series=[]; rows.forEach(x=>{ let s=series.find(y=>y.si===x.si); if(!s) series.push(s={si:x.si,date:x.date,opp:x.opp,n:0,w:0,win:0,p:0,t3:0});
    s.n++; if(x.r.result==="W") s.w++; s.win+=x.r.win||50; s.p+=x.r.picks.length; s.t3+=x.r.picks.filter(p=>p.rank&&p.rank<=3).length; });
  return {games:rows.length, fav:grp(x=>x.r.win>=53), neu:grp(x=>x.r.win>47&&x.r.win<53), unf:grp(x=>x.r.win<=47),
    picks:P.length, top3, followed:grp(follow), notFollowed:grp(x=>!follow(x)),
    laneFav:{n:lf.length,ok:lf.filter(l=>l.gd>0).length}, laneUnf:{n:lu.length,ok:lu.filter(l=>l.gd<0).length},
    series:series.map(s=>({date:s.date,opp:s.opp,n:s.n,w:s.w,win:Math.round(s.win/s.n),t3:s.p?Math.round(100*s.t3/s.p):null})).reverse()}; }

if(typeof module!=="undefined"&&module.exports) module.exports={gameAnalysis,bansAgainstUs,draftReview,reviewSummary,compTempo,banStrategy,punishers,exploitOf,familiesOf,familyCount,familyGaps,FAMS,vsHabit,vsAgainst,teamStats,champPerf,firstPickGuess,predictEnemy,botEdge,draftMoment,pickContext,scorePick,blindInfo,analyzeFinal,provenDuo,ourCounters,rankValue,pickBadge,synVal,CHAMPS,CHAMP_NAMES,STEPS,defaultConfig,recommendPicks,recommendDuos,recommendBans,banPlan,prepPlayers,stepLabel,poolOf,affinity,compProfile,identity,teamPicks,openRoles,findChamp,ICON_INDEX,force,metaInfo,matchup,ctrList,blindability,analyzeDraft,nextIsDouble};
