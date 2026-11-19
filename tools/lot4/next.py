import json,sys
Q=json.load(open('/home/claude/backup/lot4/queue.json'))
SUBJ={'SPR':'mushrooms','SPRB_I':'game items (potions, crafting materials and dishes)','SPRB_P':'game objects (trees, rocks, furniture, decorations)'}
def prompt(it):
    if it['kind']=='w2':
        return ("Pixel art character sprite: the exact same character as the first reference image, same pixel-art design, outfit, colours, proportions and size, "
                "but walking towards the viewer with the OPPOSITE stride: the leg that is forward in the first image is now back, and the leg that is back is now clearly forward and lifted, arms swinging the opposite way. "
                "The face, props and the hand holding them stay the same as in the second reference image. Authentic 16-bit pixel art for a cozy farming life-sim RPG: crisp hard square pixels, dark brown 1-pixel outline, limited palette, 2-3 tone flat shading, no anti-aliasing, no blur. Full body, centered, isolated on a plain pure black background, no text.")
    s=SUBJ[it['keys'][0].split(':')[0]] if it['n']==3 else 'small game sprites (mushrooms, potions, crafting materials, dishes)'
    N=it['n']; G='3x3' if N==3 else '4x4'; C='nine' if N==3 else 'sixteen'
    return (f"Pixel art icon sheet: redraw each of the {C} {s} from the first reference image as a pixel-art game sprite, keeping EXACTLY the same {G} grid layout, the same order, the same shapes, proportions and colours, "
            "one object centered in each cell with empty black space between cells. Match the pixel-art style, pixel size and level of detail of the second reference image. "
            "Authentic 16-bit pixel art for a cozy farming life-sim RPG: crisp hard square pixels, dark brown 1-pixel outline, limited palette, 2-3 tone flat shading, no anti-aliasing, no blur. Plain pure black background, no text, no grid lines.")
if sys.argv[1:]==['set']: pass
it=next((x for x in Q if x['status'] in('todo','gen')),None)
if not it: print('DONE ALL')
else: print(json.dumps({'id':it['id'],'kind':it['kind'],'status':it['status'],'gen':it.get('gen'),'prompt':prompt(it)},ensure_ascii=False,indent=1))
