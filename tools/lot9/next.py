import json
Q=json.load(open('/home/claude/backup/lot9/queue.json'))
ST=("MAHbcpjvijc","the rustic herbalist cottage shown in the second reference image: honey wood, wicker, copper, terracotta, warm sunlit colours")
D={'s_comptoir':'a long wooden shop counter with a small brass scale','s_caisse':'a big wooden wholesale crate (no letters)','g_bureau':'a wooden clerk desk with a paper and an inkwell','g_comptoir':'a tall wooden tavern bar counter with a beer mug',
 's_tapis':'a red runner rug with golden stitched border lying flat on the floor','s_trappe':'an open cellar trapdoor in the floor showing a ladder going down, wooden lid beside it','g_tonneau':'an upright wooden barrel with iron hoops','g_cheminee':'a stone fireplace with an empty dark hearth (no fire)',
 's_ardoise':'an empty blackboard with a wooden frame hanging on the wall (no writing)','s_bocaux':'two long wall shelves holding rows of empty glass jars with cork lids','s_ratelier':'a wall-mounted wooden weapon rack holding three swords and a steel shield','g_tableau':'a cork notice board with pinned parchment notes and a blank wooden title plate',
 's_enseigne':'a long blank dark wooden plank sign hanging on the wall (no letters)','s_fenetre':'a wooden-framed window showing blue sky, sun and green hills','s_porte_cuisine':'an arched plank wooden door with brass knob and a small blank plate above it','s_porte_maison':'an arched plank wooden door with brass knob',
 's_pancarte_foret':'a signpost with a blank green arrow-shaped board pointing left','s_pancarte_armes':'a signpost with a blank red arrow-shaped board pointing right, two crossed swords on top','s_pancarte_guilde':'a signpost with a blank dark green rectangular board with golden frame','g_porte':'an arched plank wooden door with brass knob',
 'g_biblio':'a tall narrow bookcase full of colourful books','g_banniere':'a hanging blue banner with a golden sun emblem','g_embleme':'a framed dark green guild heraldic panel with a golden mushroom emblem and a red sash'}
it=next((x for x in Q if x['status'] in('todo','gen')),None)
if not it: print('DONE ALL')
else:
    ref,desc=ST
    names='; '.join('%d) %s'%(i+1,D[k]) for i,k in enumerate(it['keys']))
    p=(f"Pixel art furniture sheet: redraw each of the {len(it['keys'])} objects from the first reference image ({names}) as detailed pixel art in the visual style of {desc}. "
       "Keep EXACTLY the same 2x2 grid layout and order, the same kind of object for each one, the same isometric angle, perspective skew, proportions and silhouette as in the first image, one object centered in each cell with empty black space between them. "
       "Stardew Valley-like 16-bit cozy farming pixel art: crisp hard square pixels, dark 1-pixel outlines, limited palette, 2-3 tone flat shading, wood grain and texture details, no anti-aliasing, no text, no letters. Plain pure black background, no room, no floor, no grid lines.")
    print(json.dumps({'id':it['id'],'status':it['status'],'gen':it.get('gen'),'style_ref':ref,'grid':'/home/claude/backup/lot9/g_%s.png'%it['id'],'prompt':p},ensure_ascii=False,indent=1))
