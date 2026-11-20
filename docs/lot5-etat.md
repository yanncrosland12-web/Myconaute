# Lot 5 — refonte complète Stardew (demandé le 20/11 : « On refait tout, tu es libre de changer le design, fais-moi des propositions »)
## Étape 1 : propositions de direction artistique (1 génération Canva / 30 min)
- A « Chaumière forestière » (bois miel chaleureux, couette patchwork, lampe champignon) : FAIT MAHbcXmrfhM
- B « Cave enchantée » : FAIT MAHbcecHXX4 — prompt : isometric pixel art interior of an underground mushroom cave home, bioluminescent: glowing teal and violet mushrooms growing on walls, furniture carved from giant mushroom stems and caps (mushroom-cap bed, toadstool stools and table), crystal lanterns, moss carpet, roots on the ceiling, dark purple stone; Stardew-like 16-bit pixel art, crisp pixels, dark outlines, no text, plain dark background.
- C « Atelier d herboriste » : FAIT MAHbcpjvijc — prompt : isometric pixel art interior of a rustic herbalist alchemist cottage of a mushroom grower: drying racks with hanging mushrooms and herbs, wicker baskets, a big wooden workbench with mortar and jars, a cauldron, a bed in an alcove with curtain, terracotta tiles, whitewashed walls with timber beams, warm sunlight; Stardew-like 16-bit pixel art, crisp pixels, dark outlines, no text, plain dark background.
- Ensuite : export des 3 (board DAHZbAEO13g pages 1-3) → artefact Design « Propositions Myconautes » (3 directions mobilier/pièce + 3 thèmes d'interface : bois Stardew + police pixel / bois + police actuelle / pierre-cave) → envoyer à Yann, attendre son choix.
- 20/11 10:35 : A, B, C exportées ; artefact Design « Propositions Myconautes » (RSafnVFM5zi9yTQjmThjAX) envoyé. EN ATTENTE du choix de Yann (direction + interface). Pas de cycle programmé.

## CHOIX DE YANN (20/11) : B pour la maison, C pour tout le reste. Interface : non précisée → interface 2 (cadres bois, police d'origine) appliquée, réversible.
## Étape 2 : refonte (en cours)
- Interface 2 : lot5/theme2.css (injecté par build.py). FAIT.
- Murs chaulés à colombages (mur_chaux) pour cuisine (style pierre), labo, guilde, arène ; sol tomettes pour la cuisine par défaut. FAIT (build.py).
- Mobilier : 20 planches 2x2 (lot5/queue.json) — H4_* maison en style B (réf MAHbcecHXX4), R4_* cuisine/labo/arène en style C (réf MAHbcpjvijc). H4_1 (lits) FAIT MAHbeqDL9r4.
## Cycle mobilier (1 génération / 30 min)
1. `python3 lot5/next.py` → id, grille, réf de style, prompt.
2. create-upload-url → curl POST la grille → generate-image refs [upload, style_ref] SQUARE_1_1 → noter ref/gen dans lot5/queue.json (status gen).
3. Board DAHZbAEO13g page 1 (PBrD7Z5vP6cKfvPb-LBTFJdf3Dw9fkBqG) update_fill → commit → export png pro 1024 pages [1] → `python3 dl.py '{"1":"lot4_<id>"}' <tag>` → `QUEUE=lot5/queue.json python3 cut4.py <id>` (si la mise en page n'est pas respectée : adapter cutblob.py) → vérifier lot4/prev_<id>.png.
4. Les sprites SPRB_P sont injectés en fin de page (patch des symboles dp-*), build.py s'en occupe.
5. Paliers : fin des H4 (maison) puis fin des R4 → build.py 0.9.X → err.js/smoke.js → SendUserFile + changelog → artefact B75cgjd2BamMdnEhEqUDNq → GitHub → mémoire.
