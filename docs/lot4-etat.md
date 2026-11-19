# Lot 4 + finitions — état (démarré 19/11/2026)
Demande de Yann (19/11) : « enchaîne tout » → marches w2 ambroise/ermite (taureau et salamandre jugées OK), puis lot 4 pixel art de tous les assets non-persos, artefact republié à chaque palier.
Artefact B75cgjd2BamMdnEhEqUDNq republié en 0.9.43 (v57) le 19/11.

## Méthode lot 4 (validée sur SPR_1 le 19/11)
Grilles 3x3 : 9 assets par génération Canva. Réfs = [grille lot4/g_<gid>.png uploadée, MAHatIQO9PI (style pixel)].
Inventaire : SPR 60 champignons (7 grilles), SPRB_I 36 objets (4), SPRB_P 92 décors/meubles (11). TEX (20 textures 96 px, déjà PNG pixelated) : non traité.
File : lot4/queue.json ; `python3 lot4/next.py` donne la prochaine tâche + prompt.

## Cycle (1 génération / 45 min)
1. `python3 lot4/next.py`.
2. grille : create-upload-url → curl POST lot4/g_<gid>.png → generate-image (refs [upload, MAHatIQO9PI], SQUARE_1_1) → noter ref/gen dans queue (status gen).
   Puis board DAHZbAEO13g page 1 (locator PBrD7Z5vP6cKfvPb-LBTFJdf3Dw9fkBqG) update_fill gen → commit → export png pro 1024 pages [1] → `python3 dl.py '{"1":"lot4_<gid>"}' <tag>` → `python3 cut4.py <gid>` (→ lot4/px.json, prev) → vérifier lot4/prev_<gid>.png.
3. w2_<nom> : sprites actuels cur/<nom>.w.png et .f.png (dump.js) agrandis ×6 sur fond noir → upload ×2 → generate (refs [w, f]) → board page 4 (PBwgXr9TtC9wW7yd-LB6d4wvK40q39Phq) → export page 4 → raw/<nom>.w2new.png → w2fix.py <nom> (→ chars_extra.json).
4. Build : `python3 build.py 0.9.X` (0.9.37 + chars_px3 + chars_extra + lot4/px.json, patch sprInit PNG) → smoke.js (chemin absolu) → err.js.
5. GitHub (yanncrosland12-web/Myconaute, clone /home/claude/myconaute) : à chaque build, copier le HTML en index.html + tools/ (scripts, chars_px3.json, chars_extra.json, lot4/queue.json, lot4/px.json) + docs/ (états, changelog) → commit → `git -c push.negotiate=true push`.
6. Livraison à chaque palier (fin des champignons, des objets, des décors) : SendUserFile + changelog + republier l'artefact + mémoire.

## Journal
- 19/11 21:05 UTC : SPR_1 généré (MAHbZWiMtDw), découpé, intégré → 0.9.44 test (9 champignons pixel).
- 19/11 21:09 : 0.9.44 livrée (aperçu). Prochain cycle 21:54 : w2_ambroise.
- 19/11 : dépôt GitHub en place (0.9.44 poussée, commit 4ac55cb).
