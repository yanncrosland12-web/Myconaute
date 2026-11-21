import json
from PIL import Image
G=[['s_comptoir','s_caisse','g_bureau','g_comptoir'],['s_tapis','s_trappe','g_tonneau','g_cheminee'],['s_ardoise','s_bocaux','s_ratelier','g_tableau'],
   ['s_enseigne','s_fenetre','s_porte_cuisine','s_porte_maison'],['s_pancarte_foret','s_pancarte_armes','s_pancarte_guilde','g_porte'],['g_biblio','g_banniere','g_embleme']]
Q=[]
for gi,keys in enumerate(G,1):
    gid='L9_%d'%gi; sh=Image.new('RGB',(1024,1024),(0,0,0))
    for i,k in enumerate(keys):
        im=Image.open('lot9/ref/%s.png'%k).convert('RGB'); s=400/max(im.size); im=im.resize((max(1,round(im.width*s)),max(1,round(im.height*s))),Image.LANCZOS)
        cx=(i%2)*512+256; cy=(i//2)*512+256; sh.paste(im,(cx-im.width//2,cy-im.height//2))
    sh.save('lot9/g_%s.png'%gid); Q.append({'id':gid,'n':2,'style':'C','keys':keys,'status':'todo'})
json.dump(Q,open('lot9/queue.json','w'),indent=1)
