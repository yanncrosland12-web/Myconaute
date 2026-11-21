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
    late={}
    for T,v in px.items():
        if T=='SPRB_P': late=v; continue
        k=s.find('const %s = '%T); nl=s.find('\n',k)+1
        s=s[:nl]+'Object.assign(%s, %s);\n'%(T,json.dumps(v,separators=(',',':')))+s[nl:]
    if late:
        k=s.rfind('</body>'); s=s[:k]+'<script>(function(X){Object.assign(SPRB_P,X);for(const k in X){const q=X[k],el=document.getElementById("dp-"+k);if(!el)continue;const im=el.tagName.toLowerCase()==="image"?el:el.querySelector("image");if(!im)continue;const u="data:image/png;base64,"+q[0];im.setAttribute("x",q[1]);im.setAttribute("y",q[2]);im.setAttribute("width",q[3]);im.setAttribute("height",q[4]);im.setAttribute("href",u);im.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",u);im.style.imageRendering="pixelated";}})(%s);</script>'%json.dumps(late,separators=(',',':'))+s[k:]
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
        s=s.replace('function wallArt(style, right) {\n  const W = 200, H = RWH;\n  let s = "";','function wallArt(style, right) {\n  const W = 200, H = RWH;\n  let s = "";\n  if (style === "chaux") { s = texFill("mur_chaux", W, H, \'<rect width="200" height="\'+H+\'" fill="#e8dcc0"/>\'); if (right) s += \'<rect width="200" height="\'+H+\'" fill="#000" opacity=".18"/>\'; return s; }',1)
        k=s.find('const TEXSZ = '); nl=s.find('\n',k)+1
        s=s[:nl]+'TEX.mur_chaux="%s"; TEXSZ.mur_chaux=144;\n'%tr['mur_chaux']+s[nl:]
        # pièces "C" : murs chaulés à colombages
        s=s.replace('if (style === "pierre") return wallArt("pierre", right);','if (style === "pierre") return wallArt("chaux", right);',1)
        for room in ['decoSpr("l_carte"','banner(70, "#8e2b3a"','board + shelf']:
            i=s.find(room); a=s.rfind('wallArt("pierre", false)',0,i); s=s[:a]+'wallArt("chaux", false)'+s[a+len('wallArt("pierre", false)'):]
            b=s.find('wallArt("pierre", true)',a); s=s[:b]+'wallArt("chaux", true)'+s[b+len('wallArt("pierre", true)'):]
        s=s.replace('return floorArt("terre");\n}\nfunction kShelf','return texFill("sol_tomettes", 200, 200, floorArt("terre"));\n}\nfunction kShelf',1)
    # sprInit : PNG pixel -> bon type MIME + rendu net
    old='''preserveAspectRatio="none" href="data:image/webp;base64,').concat(q[0], '" xlink:href="data:image/webp;base64,').concat(q[0], '"/>');'''
    new='''preserveAspectRatio="none"'.concat(q[0].startsWith("iVBOR") ? ' style="image-rendering:pixelated"' : "", ' href="data:image/').concat(q[0].startsWith("iVBOR") ? "png" : "webp", ';base64,').concat(q[0], '" xlink:href="data:image/').concat(q[0].startsWith("iVBOR") ? "png" : "webp", ';base64,').concat(q[0], '"/>'));'''
    assert s.count(old)==1; s=s.replace(old,new)
    old2='im.src = "data:image/webp;base64," + SPR.amanite[0];'
    assert s.count(old2)==1; s=s.replace(old2,'im.src = "data:image/" + (SPR.amanite[0].startsWith("iVBOR") ? "png" : "webp") + ";base64," + SPR.amanite[0];')
if os.path.exists('lot5/theme2.css'):
    k=s.rfind('</head>'); s=s[:k]+'<style>'+open('lot5/theme2.css').read()+'</style>'+s[k:]
if os.path.exists('lot4/pxui.js'):
    k=s.rfind('</body>'); s=s[:k]+'<script>'+open('lot4/pxui.js').read()+'</script>'+s[k:]
    k=s.rfind('</body>'); s=s[:k]+'<script>'+open('lot5/save.js').read()+'</script>'+s[k:]
    k=s.rfind('</body>'); s=s[:k]+'<script>'+open('lot5/bgpx.js').read()+'</script>'+s[k:]
    # sprites à retourner (dos contre le mur) : miroir horizontal dans la même boîte
    FLIP=['l_biblio']
    # recalage de sprites : [dx, dy, échelle] (échelle ancrée en bas au centre)
    ADJ={'h_lit_baldaquin':[4,6,0.86]}
    k=s.rfind('</body>'); s=s[:k]+'<script>(function(A){for(const k in A){const im=document.getElementById("dp-"+k);if(!im)continue;const [dx,dy,sc]=A[k],x=+im.getAttribute("x"),y=+im.getAttribute("y"),w=+im.getAttribute("width"),h=+im.getAttribute("height"),cx=x+w/2,by=y+h;im.setAttribute("transform","translate("+(dx+cx)+" "+(dy+by)+") scale("+sc+") translate("+(-cx)+" "+(-by)+")");}})(%s);</script>'%json.dumps(ADJ)+s[k:]
    k=s.rfind('</body>'); s=s[:k]+'<script>(function(L){for(const k of L){const im=document.getElementById("dp-"+k);if(!im)continue;const x=+im.getAttribute("x"),w=+im.getAttribute("width");im.setAttribute("transform","translate("+(2*x+w)+" 0) scale(-1 1)");}})(%s);</script>'%json.dumps(FLIP)+s[k:]
s,n=re.subn(r'GAME_VERSION = "0\.9\.\d+[^"]*"','GAME_VERSION = "%s test"'%ver,s); assert n==1
open('Myconautes-%s.html'%ver,'w').write(s); print('ok',ver,len(s))
