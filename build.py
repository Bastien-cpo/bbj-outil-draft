import shutil,os
t=open('src/template.html').read()
for k,f in [('DATA','data.js'),('META','meta.js'),('GEN','gen.js'),('GEN2','gen2.js'),('GEN3','gen3.js'),('GEN4','gen4.js'),('ENGINE','engine.js'),('BUILDS','builds.js'),('UI','ui.js')]:
    t=t.replace('/*'+k+'*/',open('src/'+f).read())
os.makedirs('dist',exist_ok=True); open('dist/index.html','w').write(t)
shutil.copy('assets/bbj-sprite56.webp','dist/champs.webp'); print(len(t))
