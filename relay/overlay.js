// Favori « BBJ ➜ Drafter » : ouvre BBJ Outil Draft dans une fenêtre à part (déplaçable sur un 2e écran) et lui envoie la draft en direct.
(()=>{ const URL_OUTIL="https://bastien-cpo.github.io/bbj-outil-draft/";
const R=window.__bbjRelay2||(window.__bbjRelay2={win:null});
function openWin(){ if(!R.win&&window.__bbjW&&!window.__bbjW.closed) R.win=window.__bbjW; if(R.win&&!R.win.closed){ R.win.focus(); return; } R.win=window.__bbjW=window.open(URL_OUTIL,"bbj_outil","popup,width=900,height=1000"); if(!R.win) alert("Firefox a bloqué la fenêtre : autorise les pop-ups pour drafter.lol puis reclique le favori."); }
openWin(); if(R.started) return; R.started=true;
const bd=document.createElement("div"); bd.style.cssText="position:fixed;z-index:2147483647;left:8px;bottom:8px;padding:4px 9px;border-radius:12px;font:600 11px system-ui;background:#1d2a1d;color:#8fe08f;border:1px solid #3c6;cursor:pointer;opacity:.85";
bd.title="Clique pour rouvrir / afficher la fenêtre BBJ"; bd.onclick=openWin; document.body.appendChild(bd);
const ids={};
function scan(){
  document.querySelectorAll("img").forEach(i=>{ const m=(i.getAttribute("src")||"").match(/champions\/(\d+)-/); if(m&&i.alt&&i.alt!=="Ban"&&i.alt!=="Pick") ids[m[1]]=i.alt; });
  // emplacements fixes Drafter (#blue-ban-1…, #red-pick-5) : null si vide, pour repérer les bans ratés
  const slot=(k,n)=>{ const out=[]; for(let j=1;j<=5;j++){ const el=document.getElementById(k+"-"+j), im=el&&el.querySelector(n==="ban"?"img[alt=\"Ban\"]":"img[alt=\"Pick\"]"), s=im?im.getAttribute("src")||"":"";
      let v=null; if(n==="ban"){ const m=s.match(/champions\/(\d+)-/); if(m) v=ids[m[1]]||m[1]; } else { const m=s.match(/splashes\/([a-z0-9]+)-/); if(m) v=m[1]; } out.push(v); } return out; };
  const txt=document.body.innerText;
  const blue=(txt.match(/([^\n]+)\n\s*côté bleu/)||txt.match(/([^\n]+)\n\s*blue side/i)||[])[1]||"";
  const red=(txt.match(/([^\n]+)\n\s*(?:Prêt\s*)?côté rouge/)||txt.match(/([^\n]+)\n\s*(?:Ready\s*)?red side/i)||[])[1]||"";
  const phase=(txt.match(/(Pick|Ban) (bleu|rouge)/)||[""])[0];
  return {v:3, game:+(new URL(location.href).searchParams.get("game")||1), url:location.href, blue:blue.trim(), red:red.trim(), phase,
    bb:slot("blue-ban","ban"), rb:slot("red-ban","ban"), bp:slot("blue-pick","pick"), rp:slot("red-pick","pick")};
}
setInterval(()=>{ const ok=R.win&&!R.win.closed; bd.textContent=ok?"● BBJ synchro":"○ BBJ fenêtre fermée (clique)"; bd.style.color=ok?"#8fe08f":"#e0b05a";
  if(!ok) return; let st; try{ st=scan(); }catch(e){ return; } try{ R.win.postMessage({type:"bbj-drafter",state:st},"*"); }catch(e){} },500);
})();
