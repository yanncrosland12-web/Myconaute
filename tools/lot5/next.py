import json
Q=json.load(open('/home/claude/backup/lot5/queue.json'))
ST={'B':("MAHbcecHXX4","the enchanted mushroom cave home shown in the second reference image: furniture and objects carved from giant mushroom stems and caps, moss, soft glowing teal and violet mushrooms, roots, crystals, dark purple tones with warm accents"),
    'C':("MAHbcpjvijc","the rustic herbalist cottage shown in the second reference image: honey wood, wicker, copper, terracotta, hanging dried mushrooms and herbs, warm sunlit colours")}
it=next((x for x in Q if x['status'] in('todo','gen')),None)
if not it: print('DONE ALL')
else:
    ref,desc=ST[it['style']]
    names=', '.join(k.split(':')[1] for k in it['keys'])
    p=(f"Pixel art furniture sheet: redesign each of the four objects from the first reference image ({names}) in the visual style of {desc}. "
       "Keep EXACTLY the same 2x2 grid layout and order, the same kind of object for each one (same function, same size class), the same isometric angle and footprint as in the first image, one object centered in each cell with empty black space between them. "
       "Stardew Valley-like 16-bit cozy farming pixel art: crisp hard square pixels, dark 1-pixel outlines, limited palette, 2-3 tone flat shading, no anti-aliasing, no text. Plain pure black background, no room, no floor, no grid lines.")
    print(json.dumps({'id':it['id'],'status':it['status'],'gen':it.get('gen'),'style_ref':ref,'grid':'/home/claude/backup/lot5/g_%s.png'%it['id'],'prompt':p},ensure_ascii=False,indent=1))
