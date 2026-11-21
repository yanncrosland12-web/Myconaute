# Lot 6 — fonds d'arène de combat peints (pixel art)
Demande Yann 21/11 : « Oui » → un vrai fond par lieu (6 biomes + grotte), 1 génération Canva / cycle de 30 min.

## Cycle fond
1. `python3 lot6/next.py` → id + prompt (status todo) ; si DONE → palier.
2. generate-image (prompt, imageReferences=[MAHatIQO9PI], SQUARE_1_1), poll → gen id ; noter dans lot6/queue.json (status gen).
3. Board DAHZbAEO13g page 1 : update_fill locator PBrD7Z5vP6cKfvPb-LBTFJdf3Dw9fkBqG → commit → export png pro 1024 page 1.
4. `python3 dl.py '{"1":"lot6_<id>"}' <tag>` puis `python3 lot6/prep.py <id>` (recadre 4:5, natif, écrit lot6/bg/<id>.png + aperçu) → vérifier ; status done.
5. Noter ici, copier lot6/ dans /home/claude/myconaute/tools/lot6 et pousser.
6. send_later 30 min sauf DONE.
Palier (tout done) : build.py (injecte lot6/bg via bgpx.js) → err/smoke + capture combats → livraison 0.9.55, artefact, GitHub, mémoire.

## Journal
- 21/11 : b0 (clairière dorée) gen MAHbi0KywaM → OK, intégré (bgpx.js lit window.BGPX, repli canvas). Les 2 « taches » au sol ne tombent pas pile sous les persos → prompts suivants : sol uniforme sans taches. b0 à refaire en fin de lot si temps.
- 21/11 13:0x : retour Yann « persos pas sur leurs emplacements » → b0 refait (MAHbixvJzD0) sol uniforme, bande de décor réduite au 20 % du haut ; prompts du lot mis à jour pareil. Capture OK : persos posés au sol.
- 21/11 12:3x : b1 (sous-bois sombre) gen MAHbjDLyV-g → OK.
- 21/11 13:0x : b2 (bois de bouleaux) gen MAHbjJ4nRnE → OK.
- 21/11 17:0x : b3 (marais brumeux) gen MAHbkSfnYRE → OK.
- 21/11 17:4x : retour Yann → bâton vectoriel (TOOLS) affiché par-dessus l'attaque pixel en combat : supprimé (index.html en ligne + build.py).
- 21/11 17:3x : b4 (repaire des brigands) gen MAHbkRH_NJY → OK.
- 21/11 18:0x : 0.9.55 publiée en avance (événements nuit/réveil/jour + fonds b0–b4). Le palier de fin de lot 6 (b5 + grotte) sera la 0.9.56.
- 21/11 18:xx : 0.9.56 publiée (pack profondeur). Fin du lot 6 (b5 + grotte) → version suivante disponible (0.9.57+).
