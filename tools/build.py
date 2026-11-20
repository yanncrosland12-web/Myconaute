"""Construit Myconautes-<ver>.html = 0.9.37 + chars_px3.json (persos) + lot4/px.json (assets). Usage: python3 build.py 0.9.44"""
import json,re,sys,os
ver=sys.argv[1]
s=open('Myconautes-0.9.37.html').read()
d=json.load(open('chars_px3.json'))
if os.path.exists('chars_extra.json'):
    for n,v in json.load(open('chars_extra.json')).items(): d.setdefault(n,{}).update(v)
a='SPRB[k] = Object.assign(SPRB[k] || {}, v);\n'
i=s.find(a)+len(a)
s=s[:i]+'for (const [k, v] of Object.entries(%s)) SPRB[k] = Object.assign(SPRB[k] || {}, v);\n'%json.dumps(d,separators=(',',':'))+s[i:]
if os.path.exists('lot4/px.json'):
    px=json.load(open('lot4/px.json'))
    for T,v in px.items():
        k=s.find('const %s = '%T); nl=s.find('\n',k)+1
        s=s[:nl]+'Object.assign(%s, %s);\n'%(T,json.dumps(v,separators=(',',':')))+s[nl:]
    if os.path.exists('lot4/tex_px.json'):
        tv=json.load(open('lot4/tex_px.json')); k=s.find('const TEX = '); nl=s.find('\n',k)+1
        s=s[:nl]+'Object.assign(TEX, %s);\n'%json.dumps(tv,separators=(',',':'))+s[nl:]
    if os.path.exists('lot4/terrain.json'):
        tr=json.load(open('lot4/terrain.json'))
        def pat(i,b,sz=144): return '<pattern id="%s" width="%d" height="%d" patternUnits="userSpaceOnUse"><image width="%d" height="%d" style="image-rendering:pixelated" href="data:image/png;base64,%s"/></pattern>'%(i,sz,sz,sz,sz,b)
        i=s.find('<pattern id="pat-humus"'); j=s.find('</pattern>',s.find('<pattern id="pat-souche"'))+10
        s=s[:i]+pat('pat-humus',tr['humus'])+pat('pat-mousse',tr['mousse'])+pat('pat-souche',tr['souche'])+s[j:]
        for w in ['wallL','wallR']:
            i=s.find('<linearGradient id="%s"'%w); j=s.find('</linearGradient>',i)+17
            s=s[:i]+pat(w,tr[w])+s[j:]
        s=s.replace('<radialGradient id="pool">',pat('pxg-herbe',tr['grain_herbe'],120)+pat('pxg-pierre',tr['grain_pierre'],150)+'<radialGradient id="pool">',1)
        i=s.find('function forestSVG'); a="'\" fill=\"').concat(fill, '\"/>');"
        k=s.find(a,i); assert k>0
        s=s[:k]+"'\" fill=\"').concat(fill, '\"/><polygon points=\"').concat(P([I(c, r), I(c + 1, r), I(c + 1, r + 1), I(c, r + 1)]), '\" fill=\"url(#pxg-herbe)\" opacity=\".38\" style=\"mix-blend-mode:overlay\"/>');"+s[k+len(a):]
        i=s.find('function grotteSVG'); a="? pal[0] : pal[1], '\"/>');"
        k=s.find(a,i); assert k>0
        s=s[:k]+"? pal[0] : pal[1], '\"/><polygon points=\"').concat(P([I(c, r), I(c + 1, r), I(c + 1, r + 1), I(c, r + 1)]), '\" fill=\"url(#pxg-pierre)\" opacity=\".4\" style=\"mix-blend-mode:overlay\"/>');"+s[k+len(a):]
    # sprInit : PNG pixel -> bon type MIME + rendu net
    old='''preserveAspectRatio="none" href="data:image/webp;base64,').concat(q[0], '" xlink:href="data:image/webp;base64,').concat(q[0], '"/>');'''
    new='''preserveAspectRatio="none"'.concat(q[0].startsWith("iVBOR") ? ' style="image-rendering:pixelated"' : "", ' href="data:image/').concat(q[0].startsWith("iVBOR") ? "png" : "webp", ';base64,').concat(q[0], '" xlink:href="data:image/').concat(q[0].startsWith("iVBOR") ? "png" : "webp", ';base64,').concat(q[0], '"/>'));'''
    assert s.count(old)==1; s=s.replace(old,new)
    old2='im.src = "data:image/webp;base64," + SPR.amanite[0];'
    assert s.count(old2)==1; s=s.replace(old2,'im.src = "data:image/" + (SPR.amanite[0].startsWith("iVBOR") ? "png" : "webp") + ";base64," + SPR.amanite[0];')
if os.path.exists('lot4/pxui.js'):
    k=s.rfind('</body>'); s=s[:k]+'<script>'+open('lot4/pxui.js').read()+'</script>'+s[k:]
s,n=re.subn(r'GAME_VERSION = "0\.9\.\d+[^"]*"','GAME_VERSION = "%s test"'%ver,s); assert n==1
open('Myconautes-%s.html'%ver,'w').write(s); print('ok',ver,len(s))
