import json,subprocess
Q=json.load(open('/home/claude/backup/lot13/queue.json'))
it=next((x for x in Q if x['status'] in('todo','gen')),None)
if not it: print('DONE ALL')
else:
    k=it['key']; subprocess.run(['python3','lot13/mkref.py',k],check=True,cwd='/home/claude/backup')
    ST={'B':'MAHbcecHXX4','C':'MAHbcpjvijc'}[it.get('style','B')]
    p=(f"Pixel art sprite: redraw ONLY {it['desc']} from the first reference image (the object on the left), alone, centered and filling most of the image, on a plain pure black background. "
       "Same design, colours and the same isometric angle as in the reference. IMPORTANT: draw it with the same FINE pixel size and level of detail as the girl character on the right of the reference "
       "(her pixels are about half the size of the object's pixels) — so the object must have twice the resolution: small crisp pixels, more detail. It stands on the ground: visible feet or base and a thin dark contact line under it. "
       "Stardew Valley-like 16-bit pixel art, crisp hard square pixels, dark brown outlines (not black), limited palette, flat 2-3 tone shading, no anti-aliasing, no text, no floor, no room, no character.")
    print(json.dumps({'key':k,'ref':'/home/claude/backup/lot13/ref_%s.png'%k,'style_ref':ST,'prompt':p},indent=1))
