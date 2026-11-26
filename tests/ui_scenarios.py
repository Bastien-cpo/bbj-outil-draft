"""Tests d'affichage (Playwright + Chrome) : à lancer depuis la racine du dépôt.
Sert index.html en local, joue des drafts complètes côté bleu et rouge, ouvre chaque fiche adverse
à chaque étape et vérifie : pas d'erreur JS, pas de texte « undefined/NaN », aucun champion indisponible dans une fiche, pas de débordement."""
import asyncio, json, sys, threading, http.server, socketserver, os, functools
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); PORT=8799
SEQ=["Ahri","Kassadin","Jhin","Viktor","Olaf","Corki","Jarvan IV","Diana","Graves","Ornn","Tristana","Ambessa","Rell","Lulu","Nautilus","Milio","Thresh","Leona","Orianna","Galio"]
ROLE={6:"J",7:"J",8:"A",9:"T",10:"A",11:"T",16:"S",17:"S",18:"M",19:"M"}
def serve():
  class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
  h=functools.partial(Q,directory=ROOT)
  socketserver.TCPServer.allow_reuse_address=True
  with socketserver.TCPServer(("",PORT),h) as s: s.serve_forever()
async def run():
  errs=[]
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path=os.environ.get("CHROME","/usr/bin/google-chrome"),args=['--no-sandbox'])
    for side in "BR":
      for W in (1280,390):
        pg=await b.new_page(viewport={'width':W,'height':900})
        pg.on('pageerror',lambda e,s=side,w=W:errs.append(f'{s}{w} pageerror {e}'))
        await pg.goto(f'http://localhost:{PORT}/index.html'); await pg.wait_for_timeout(1200)
        await pg.evaluate(f"localStorage.clear();live.series={{locked:[],games:[]}};live.draft={{side:'{side}',actions:Array(20).fill(null)}};live.sideManual=curGameNo();ui.tab='draft';render()")
        for i in range(21):
          txt=await pg.evaluate("document.querySelector('#view').innerText")
          for bad in ['undefined','NaN','[object']:
            if bad in txt: errs.append(f'{side}{W} étape {i}: "{bad}" affiché')
          ov=await pg.evaluate("document.documentElement.scrollWidth>document.documentElement.clientWidth+2")
          if ov: errs.append(f'{side}{W} étape {i}: débordement horizontal')
          sup=await pg.evaluate("""(()=>{const bad=[];document.querySelectorAll('.pk').forEach(pk=>{const f=pk.querySelector('.fams');if(!f)return;const a=f.getBoundingClientRect();for(const e of [pk.querySelector('select'),pk.querySelector('.nm'),pk.querySelector('.flex')]){if(!e)continue;const r=e.getBoundingClientRect();if(a.left<r.right-1&&a.right>r.left+1&&a.top<r.bottom-1&&a.bottom>r.top+1)bad.push(e.className||e.tagName);}});return bad;})()""")
          if sup: errs.append(f'{side}{W} étape {i}: icônes de famille superposées {sup}')
          if W==1280:
            for r in "TJMAS":
              res=await pg.evaluate(f"""(()=>{{ ui.scout='{r}'; render(); const m=document.querySelector('.scbox'); if(!m) return null;
                const un=unavailable(live.series,live.draft); const names=[...m.querySelectorAll('.scc b, .scduel span')].map(e=>e.innerText.trim());
                const atRole=live.draft.actions.filter((a,k)=>a&&a.name&&STEPS[k][0]==='pick'&&a.role==='{r}').map(a=>a.name); const bad=names.filter(n=>un.has(n)&&!atRole.includes(n)); const me=(m.querySelector('.schead b')||{{}}).innerText||''; if(me&&m.innerText.includes('et '+me+' aussi')) bad.push('flex avec lui-même'); ui.scout=null; render(); return bad.length?bad:null; }})()""")
              if res: errs.append(f'{side} étape {i} fiche {r}: indisponibles affichés {res}')
          if i==20: break
          a={'name':SEQ[i]}
          if i in ROLE: a.update(role=ROLE[i],flex=False)
          await pg.evaluate(f"live.draft.actions[{i}]={json.dumps(a)};render()")
        await pg.close()
    await b.close()
  return errs
if __name__=="__main__":
  threading.Thread(target=serve,daemon=True).start()
  e=asyncio.run(run()); print("\n".join(e) if e else "UI : OK"); sys.exit(1 if e else 0)
