# Lot 9 — meubles vectoriels restants en pixel art (demande Yann 21/11 : « rajouter tous les meubles en régénération comme la caisse de gros, la table de la boutique etc »)
Boutique : comptoir, caisse GROS, tapis, trappe, ardoise « Cours du jour », étagères à bocaux, râtelier, 3 pancartes, enseigne, fenêtre, 2 portes.
Guilde : bureau, comptoir, tonneau, cheminée, tableau des contrats, bibliothèque, bannière, emblème, porte.
Textes, pièces, champignons des bocaux et flamme restent dynamiques (vectoriels) par-dessus.

## Outils
- lot9/capture.js <html abs> : repère les éléments (signatures), boîtes viewBox → lot9/boxes.json, rendus isolés → lot9/ref/*.png
- lot9/mkq.py : 6 planches 2x2 lot9/g_L9_*.png + lot9/queue.json
- lot9/furn.js : à l'exécution, enveloppe shopSVG/guildeSVG, remplace les éléments repérés par <image> pixel (window.FURNPX, matrice inverse du mur). Injecté par build.py si lot9/px.json existe.
- Test d'alignement fait avec les rendus teintés : OK (boutique 14, guilde 9).

## Cycle (1 génération Canva / 30 min)
1. `python3 lot9/next.py` → id, grille, prompt (réf style C MAHbcpjvijc).
2. create-upload-url → curl POST la grille → generate-image refs [upload, MAHbcpjvijc] SQUARE_1_1 → noter ref/gen dans lot9/queue.json (status gen).
3. Board DAHZbAEO13g page 1 : read-design open_transaction → update_fill locator PBrD7Z5vP6cKfvPb-LBTFJdf3Dw9fkBqG → commit → export png pro 1024 pages [1] → `python3 dl.py '{"1":"lot9_<id>"}' <tag>` → `python3 lot9/cut9.py <id>` → vérifier lot9/prev_<id>.png.
4. Noter ici ; copier lot9/ + lot9-etat.md dans /home/claude/myconaute/tools/ ; send_later 30 min sauf DONE ALL.
Palier (DONE ALL) : build.py version suivante (0.9.60 : la 0.9.59 est sortie avec les ombres de contact ; build test = 0.9.60t) → err/smoke + capture boutique/guilde (scratchpad/rooms9.js <html> <prefix>) → Pages (index.html), artefact B75cgjd2BamMdnEhEqUDNq, mémoire, message à Yann.

## Journal
- 21/11 18:2x : pipeline prêt (capture, planches, furn.js, build.py). 6 cycles à partir de 19:11 UTC (après la grotte du lot 6 à 18:41).
- 21/11 22:2x : cycle de 19:11 parti tard (session inactive) ; ce cycle a servi à la grotte (lot 6). L9_1 au prochain cycle (~22:52).
- 21/11 22:5x : L9_1 (comptoir, caisse, bureau, comptoir guilde) ref MAHblmkhzls gen MAHbltyIMPw → découpé ; cut9 garde désormais tous les pixels sombres intérieurs (planches ajourées sinon), taille de pixel 5–11 sinon forcée à 8 ; pièces du comptoir incluses dans le sprite ; « GROS » éclairci (build.py). Rendu boutique/guilde OK.
- 21/11 23:2x : L9_2 (tapis, trappe, tonneau, cheminée) ref MAHblzgEp3A gen MAHbl8v2QJo → découpé. Cheminée dessinée de face → furn.js LOC : posée dans le repère du mur (146,54,54,96), rendu OK.
- 22/11 23:4x : demande Yann « les décors flottent » → lot 10 (lot10/ground.js) : ombres de contact sous tous les objets au sol (y compris meubles lot 9 via furn.js SHD). 0.9.59 publiée. PALIER DU LOT 9 = 0.9.60 (pas 0.9.59).
- 22/11 00:0x : L9_3 (ardoise, bocaux, râtelier, tableau des contrats) ref MAHbl5KUf7k gen MAHbl9asAW0 → découpé, rendu OK. À vérifier au palier : texte CONTRATS sur la plaque, champignons dans les bocaux (sac non vide).
- 22/11 00:3x : L9_4 (enseigne, fenêtre, portes cuisine/maison) ref MAHbmPegu2w gen MAHbmK9bN8M → découpé, rendu OK (porte cuisine peu contrastée sur le mur bois, acceptable).
- 22/11 01:0x : L9_5 (pancartes forêt/armes/guilde, porte guilde) ref MAHbmSeHJ2Q gen MAHbmf0YU8Y → découpé ; ombres au pied des poteaux (SHD px). Rendu OK.
- 22/11 01:4x : L9_6 (biblio, bannière [LOC mur], emblème) ref MAHbmaapOVs gen MAHbmRNTXzA → découpé. LOT 9 TERMINÉ → 0.9.60 (CONTRATS, bannière, bocaux vérifiés).
