(()=>{ if(window.__bbjRelay){ alert("Relais BBJ déjà actif sur cette page"); return; } window.__bbjRelay=1;
let target=window.opener||null, last="", lastSent=0;
addEventListener("message",e=>{ if(e.data&&e.data.type==="bbj-hello"){ target=e.source; } });
const ids={};
const badge=document.createElement("div"); badge.style.cssText="position:fixed;z-index:2147483647;left:12px;bottom:12px;padding:6px 10px;border-radius:8px;font:600 12px system-ui;color:#111;background:#d4ad52;box-shadow:0 2px 8px rgba(0,0,0,.4)"; document.body.appendChild(badge);
function scan(){
  document.querySelectorAll("img").forEach(i=>{ const m=(i.getAttribute("src")||"").match(/champions\/(\d+)-/); if(m&&i.alt&&i.alt!=="Ban"&&i.alt!=="Pick") ids[m[1]]=i.alt; });
  const W=innerWidth/2, P={B:[],R:[]}, Bn={B:[],R:[]};
  document.querySelectorAll('img[alt="Pick"],img[alt="Ban"]').forEach(i=>{ const s=i.getAttribute("src")||"", r=i.getBoundingClientRect(); if(!r.width) return;
    const side=(r.x+r.width/2)<W?"B":"R";
    if(i.alt==="Pick"){ const m=s.match(/splashes\/([a-z0-9]+)-/); if(m&&!P[side].some(x=>x[1]===m[1])) P[side].push([r.y,m[1]]); }
    else { const m=s.match(/champions\/(\d+)-/); if(m){ const n=ids[m[1]]||m[1]; if(!Bn[side].some(x=>x[1]===n)) Bn[side].push([r.x,n]); } } });
  const txt=document.body.innerText;
  const blue=(txt.match(/([^\n]+)\n\s*côté bleu/)||txt.match(/([^\n]+)\n\s*blue side/i)||[])[1]||"";
  const red=(txt.match(/([^\n]+)\n\s*(?:Prêt\s*)?côté rouge/)||txt.match(/([^\n]+)\n\s*(?:Ready\s*)?red side/i)||[])[1]||"";
  const phase=(txt.match(/(Pick|Ban) (bleu|rouge)/)||[""])[0];
  return {v:1, game:+(new URL(location.href).searchParams.get("game")||1), url:location.href, blue:blue.trim(), red:red.trim(), phase,
    bb:Bn.B.sort((a,b)=>a[0]-b[0]).map(x=>x[1]), rb:Bn.R.sort((a,b)=>b[0]-a[0]).map(x=>x[1]),
    bp:P.B.sort((a,b)=>a[0]-b[0]).map(x=>x[1]), rp:P.R.sort((a,b)=>a[0]-b[0]).map(x=>x[1])};
}
window.__bbjScan=scan;
setInterval(()=>{ let st; try{ st=scan(); }catch(e){ return; } const k=JSON.stringify(st); const now=Date.now();
  if(target&&(k!==last||now-lastSent>3000)){ try{ target.postMessage({type:"bbj-drafter",state:st},"*"); lastSent=now; last=k; }catch(e){} }
  badge.textContent=target?"BBJ Draft Lab : synchro active ✓":"BBJ Draft Lab : ouvre Drafter depuis l'outil";
  badge.style.background=target?"#4cc27f":"#d4ad52"; },500);
})();
