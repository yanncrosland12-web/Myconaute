# Lot 13 — option 1 + finition B « lisse » (choix Yann 26/11 : pas de repixelisation, image Canva lissée, image-rendering:auto via window.SMOOTHPX)
# « meubles plus fins » (choix de Yann 26/11 : même taille de pixel que le perso, ≈1 unité/pixel)
- Constat : perso ≈1,04 u/px, meubles ≈1,7–2 u/px, murs non pixelisés.
- Test OK : h_lit_paille regénéré seul (ref = sprite actuel + héroïne à l'échelle) → 0,88 u/px, gen MAHcAfpCrGU. Fond blanc possible : cut13 le gère.
- Sol prototype : lot12/floorgen.py (N=200 pour 1 u/px), lot13/floor_fine.js (parquet fin, plinthes, lumière commune, sans ombres floues). À intégrer au palier.
## Cycle (1 meuble / 30 min)
1. `python3 lot13/next.py` → clé, réf (lot13/ref_<clé>.png), style_ref, prompt.
2. create-upload-url + curl POST la réf → generate-image refs [upload, style_ref] SQUARE_1_1.
3. Board DAHZbAEO13g p1 update_fill → commit → export png pro 1024 p1 → `python3 curl -sSf -o raw/lot13_<clé>.png "<URL export>" (dl.py rate parfois : transcript pas encore écrit)` → `python3 lot13/cut13.py <clé>` (finition lisse : 2,2 px/unité, 160 couleurs, liseré rongé 2 px ; vérifier lot13/prev_<clé>.png et le poids ≈ 40 Ko) → queue status done + gen.
4. Journal ici ; send_later +30 min.
Paliers : fin maison (20 objets) → 0.9.61 avec sol fin + plinthes + lumière + murs pixelisés ; puis cuisine/labo/salle d'armes (style C), boutique/guilde (lot 9), décors muraux.
## Journal
- 26/11 : Yann choisit la finition B (lisse). cut13 réécrit ; h_lit_paille recoupé (278x198, 38 Ko, liseré blanc supprimé). build.py injecte SMOOTHPX.
- 26/11 10:0x : h_lit_bois gen MAHcAv84COg → découpé (lisse), OK.
- 26/11 10:3x : h_lit_champi gen MAHcAuvM7h8 → découpé (lisse), OK.
- 26/11 11:0x : h_lit_baldaquin gen MAHcA3NGPMI → découpé (trous noirs entre les montants retirés : HOLES dans cut13).
  À vérifier au palier : ADJ h_lit_baldaquin [4,6,0.86] de build.py (réglé pour l'ancien sprite).
- 26/11 11:4x : h_lit_hamac gen MAHcAyaCNUQ → découpé (HOLES), OK.
- 26/11 12:1x : h_meuble_caisse gen MAHcBBmFSRo → découpé, OK.
- 26/11 12:4x : h_meuble_coffre gen MAHcBEOXVJw → découpé, OK.
- 26/11 13:2x : h_meuble_etabli gen MAHcBXzFz38 → découpé (HOLES entre les pieds).
- 26/11 13:5x : h_meuble_biblio gen MAHcBaNC6KU → découpé ; face vers l'avant-gauche (dos au mur droit) comme l'ancienne — vérifier au palier.
- 26/11 14:2x : h_meuble_armure gen MAHcBmf9SKg → découpé ; pied métallique sous le socle coupé (CLIPBOT).
- 26/11 14:5x : h_lumiere_bougie gen MAHcBjRTbAs (fond blanc) → découpé, OK.
- 26/11 15:2x : h_lumiere_lanterne gen MAHcB05Wtns → découpé, OK.
- 26/11 16:0x : h_compagnon_chat gen MAHcCGdlyz0 (demandé sur fond BLANC : chat noir) → cut13 gère le fond blanc par masque direct. Pour les objets sombres, demander fond blanc.
- 26/11 16:3x : h_compagnon_renard gen MAHcCEwXd8U → découpé, OK.
- 26/11 17:0x : h_compagnon_lapin gen MAHcCUY9yVo → découpé, OK.
- 26/11 17:3x : h_compagnon_crapaud gen MAHcCT2vuFg → découpé, OK.
- 26/11 18:1x : h_compagnon_escargot gen MAHcCiGf1Dg → découpé, OK.
- 26/11 18:4x : h_compagnon_hibou gen MAHcCofa5y4 (fond blanc) → découpé, OK.
- 26/11 19:2x : h_plante_fougere gen MAHcC52wsTY (fond blanc) → découpé, OK.
- 26/11 19:5x : h_plante_bonsai gen MAHcC5YfSmc → découpé. MAISON TERMINÉE → 0.9.61 (floor_fine intégré, ground.js retiré, decoShadow vide pour SMOOTHPX). Baldaquin et biblio OK ; lanterne = suspendue (comme avant).
- 27/11 : Yann valide la maison 0.9.61 (« C'est tout bon »). Lot 13 étendu : cuisine, labo, salle d'armes, coffre (style C). Palier suivant 0.9.62 à la fin de ces objets ; si un objet est sombre → fond BLANC.
- 27/11 10:4x : k_four_atre gen MAHcGmyGAZ0 (fond blanc) → découpé.
- 27/11 : Yann « rajoute le sol pour tout » → lot14/floors.js (remplace les motifs #tx-sol_* : cuisine tomettes/damier, labo carreaux gris, salle d'armes pierre, guilde dalles ; boutique et sols maison via floorArt). Rendu OK, sortira dans la 0.9.62.
