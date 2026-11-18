// Favori « BBJ ➜ Drafter » : ouvre BBJ Outil Draft en panneau sur la page Drafter et lui envoie la draft en direct.
(()=>{ const URL_OUTIL="https://bastien-cpo.github.io/bbj-outil-draft/?embed=1";
if(window.__bbjPanel){ const p=window.__bbjPanel; p.style.display=p.style.display==="none"?"block":"none"; return; }
const W=Math.min(620,Math.round(innerWidth*0.42));
const box=document.createElement("div"); box.style.cssText="position:fixed;z-index:2147483647;top:0;right:0;height:100vh;width:"+W+"px;background:#0b0d12;box-shadow:-4px 0 18px rgba(0,0,0,.55);border-left:2px solid #d4ad52";
const fr=document.createElement("iframe"); fr.src=URL_OUTIL; fr.style.cssText="border:0;width:100%;height:100%";
const bt=document.createElement("button"); bt.textContent="⇔"; bt.title="Réduire / agrandir le panneau BBJ"; bt.style.cssText="position:absolute;left:-30px;top:70px;width:28px;height:44px;border:0;border-radius:6px 0 0 6px;background:#d4ad52;color:#111;font:700 14px system-ui;cursor:pointer";
let small=false; bt.onclick=()=>{ small=!small; box.style.width=(small?40:W)+"px"; fr.style.visibility=small?"hidden":"visible"; };
box.appendChild(fr); box.appendChild(bt); document.body.appendChild(box); window.__bbjPanel=box;
const ids={};
function scan(){
  document.querySelectorAll("img").forEach(i=>{ const m=(i.getAttribute("src")||"").match(/champions\/(\d+)-/); if(m&&i.alt&&i.alt!=="Ban"&&i.alt!=="Pick") ids[m[1]]=i.alt; });
  const vis=box.getBoundingClientRect().left, Wd=(vis>0?vis:innerWidth)/2, P={B:[],R:[]}, Bn={B:[],R:[]};
  document.querySelectorAll('img[alt="Pick"],img[alt="Ban"]').forEach(i=>{ if(box.contains(i)) return; const s=i.getAttribute("src")||"", r=i.getBoundingClientRect(); if(!r.width) return;
    const side=(r.x+r.width/2)<innerWidth/2?"B":"R";
    if(i.alt==="Pick"){ const m=s.match(/splashes\/([a-z0-9]+)-/); if(m&&!P[side].some(x=>x[1]===m[1])) P[side].push([r.y,m[1]]); }
    else { const m=s.match(/champions\/(\d+)-/); if(m){ const n=ids[m[1]]||m[1]; if(!Bn[side].some(x=>x[1]===n)) Bn[side].push([r.x,n]); } } });
  const txt=document.body.innerText;
  const blue=(txt.match(/([^\n]+)\n\s*côté bleu/)||txt.match(/([^\n]+)\n\s*blue side/i)||[])[1]||"";
  const red=(txt.match(/([^\n]+)\n\s*(?:Prêt\s*)?côté rouge/)||txt.match(/([^\n]+)\n\s*(?:Ready\s*)?red side/i)||[])[1]||"";
  const phase=(txt.match(/(Pick|Ban) (bleu|rouge)/)||[""])[0];
  return {v:2, game:+(new URL(location.href).searchParams.get("game")||1), url:location.href, blue:blue.trim(), red:red.trim(), phase,
    bb:Bn.B.sort((a,b)=>a[0]-b[0]).map(x=>x[1]), rb:Bn.R.sort((a,b)=>b[0]-a[0]).map(x=>x[1]),
    bp:P.B.sort((a,b)=>a[0]-b[0]).map(x=>x[1]), rp:P.R.sort((a,b)=>a[0]-b[0]).map(x=>x[1])};
}
setInterval(()=>{ let st; try{ st=scan(); }catch(e){ return; } try{ fr.contentWindow.postMessage({type:"bbj-drafter",state:st},"*"); }catch(e){} },500);
})();
