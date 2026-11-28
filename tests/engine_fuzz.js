const fs=require('fs');const vm=require('vm');const ctx={console,module:{exports:{}}};vm.createContext(ctx);
for(const f of ['data','meta','gen','gen2','gen3','gen4','engine','builds']) vm.runInContext(fs.readFileSync(__dirname+'/../src/'+f+'.js','utf8'),ctx,{filename:f});
const E=ctx.module.exports, STEPS=vm.runInContext('STEPS',ctx), ROLES=['T','J','M','A','S'];
const team=JSON.parse(fs.readFileSync(__dirname+'/../team.json'));const cfg=E.defaultConfig();cfg.tiers=Object.assign(cfg.tiers,team.config.tiers);
const prep=team.prep, L={T:"Romain",J:"Fabien",M:"JH",A:"Bastien",S:"Bounty"};
const N=E.CHAMP_NAMES; const issues={}; const add=(k,v)=>{issues[k]=issues[k]||[];if(issues[k].length<3)issues[k].push(v)};
let seed=1;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
for(let it=0;it<300;it++){
  const side=rnd()<.5?'B':'R', locked=[]; const nl=Math.floor(rnd()*3)*8; while(locked.length<nl){const c=N[Math.floor(rnd()*N.length)];if(!locked.includes(c))locked.push(c)}
  const series={locked,games:[]}; const d={side,actions:Array(20).fill(null)}; const used=new Set(locked);
  const steps=Math.floor(rnd()*21); const roleUsed={B:new Set(),R:new Set()};
  for(let i=0;i<steps;i++){ let c; do{c=N[Math.floor(rnd()*N.length)]}while(used.has(c)); used.add(c);
    const a={name:c}; if(STEPS[i][0]==='pick'){ const s=STEPS[i][1]; const r=(E.CHAMPS[c].roles.find(r=>!roleUsed[s].has(r)))||ROLES.find(r=>!roleUsed[s].has(r)); roleUsed[s].add(r); a.role=r;a.flex=false;} d.actions[i]=a; }
  const un=new Set([...used]);
  const chk=(name,list,f)=>{ try{ const L2=list(); f(L2);}catch(e){add(name+' crash',e.message)} };
  chk('reco',()=>E.recommendPicks(cfg,series,d,L,24),r=>{ for(const k in r){ (r[k].list||[]).forEach(x=>{ if(un.has(x.name)) add('reco unavailable',x.name); if(!(x.score>=0&&x.score<=100)) add('reco score out',x.name+' '+x.score); }); } });
  chk('bans',()=>E.recommendBans(cfg,series,d,prep,L,12),r=>r.forEach(x=>{ if(un.has(x.name)) add('ban unavailable',x.name+' step'+steps); }));
  chk('pred',()=>E.predictEnemy(cfg,series,d,prep,L,5),r=>r.forEach(R=>R.list.forEach(x=>{ if(un.has(x.name)) add('pred unavailable',x.name); })));
  chk('duos',()=>E.recommendDuos(cfg,series,d,L,20),r=>r.forEach(x=>{ [x.a,x.b].forEach(y=>{ if(y&&un.has(y.name||y)) add('duo unavailable',JSON.stringify(y)); }); if(x.score>100) add('duo score>100',x.score);}));
  chk('ideas',()=>vm.runInContext('pickIdeas',ctx)(cfg,series,d,L,14),r=>{ (r&&(r.list||r.pairs||r)||[]).forEach?.(x=>{ const s=x.score??x.s; if(s>100) add('idea score>100',s); [x.name,x.a&&x.a.name,x.b&&x.b.name].filter(Boolean).forEach(n=>{ if(un.has(n)) add('idea unavailable',n); }); }); });
  if(steps===20) chk('final',()=>E.analyzeFinal(cfg,d,prep,L),r=>{ const s=JSON.stringify(r); if(/NaN|undefined/.test(s)) add('final NaN',s.slice(0,120)); });
}
{ const BI=ctx.module.exports; let seed2=7; const r2=()=>{seed2=(seed2*16807)%2147483647;return seed2/2147483647};
  for(let it=0;it<400;it++){ const pool=N.slice(); const pick=()=>pool.splice(Math.floor(r2()*pool.length),1)[0];
    const ours=ROLES.map(r=>({name:pick(),role:r})), theirs=ROLES.map(r=>({name:pick(),role:r}));
    try{ const R=BI.draftBuilds(ours,theirs); if(R.builds.length!==5) add('builds count',R.builds.length);
      R.builds.forEach(b=>{ if(b.items.length>6) add('builds >6',b.name); if(new Set(b.items).size!==b.items.length) add('builds dup',b.name+' '+b.items);
        const txt=JSON.stringify(b); if(/undefined|NaN|%P/.test(txt)) add('builds texte',b.name+' '+txt.slice(0,200)); if(b.base&&b.items.length<3) add('builds court',b.name); }); }
    catch(e){ add('builds crash',e.message); } } }

if(Object.keys(issues).length){console.log(JSON.stringify(issues,null,1));process.exitCode=1;} else console.log('Moteur : OK (300 drafts)');
{ const d={side:'B',actions:Array(20).fill(null)}; const seq=["Ahri","Kassadin","Jhin","Viktor","Olaf","Corki","Jarvan IV","Diana","Graves","Ornn","Tristana","Ambessa","Rell","Lulu","Nautilus","Milio","Rakan","Soraka","Orianna","Galio"];const R={6:"J",7:"J",8:"A",9:"T",10:"A",11:"T",16:"S",17:"S",18:"M",19:"M"};
seq.forEach((c,i)=>{d.actions[i]={name:c};if(R[i])Object.assign(d.actions[i],{role:R[i],flex:false})});
const s=JSON.stringify(E.analyzeFinal(cfg,d,prep,L));const m=[...s.matchAll(/.{80}(NaN|undefined).{40}/g)].map(x=>x[0]);if(m.length){console.log('Analyse finale :',m.slice(0,4));process.exitCode=1;}}
