# Lot 3 — état (reset de l'environnement le 15/11 ~16:50 UTC : scratchpad, scripts, sources, ids.json perdus)
Source de référence : /home/claude/backup/Myconautes-0.9.37.html (= artifact B75cgjd2BamMdnEhEqUDNq v56, copie aussi dans le projet claude/backup/).
32/36 persos intégrés.
Générés, non intégrés :
rosalie f MAHatPAPIWw b MAHa-8Gy06E w MAHa_OES0oU w2 MAHa_AWtwHI a MAHa_aYS1OU
ermite  f MAHatA1n-qA b MAHa_rlwbDE w MAHa_zOx5lA w2 MAHbAND2q5I a MAHbC2zVOFs
À faire : fee, humus (face pixel perdue → refaire depuis ancien sprite du jeu), pipeline léger (export DAHZbAEO13g → pixelisation → injection SPRB dans le HTML → test Playwright).
Marches à refaire : taureau.w2 ambroise.w2 ermite.w2 salamandre.w2 vesce.w2.

## Mise à jour 16/11 ~04:15 UTC
- 0.9.38 construite (rosalie + ermite, 34/36) : /home/claude/backup/Myconautes-0.9.38.html, livrée par SendUserFile. Artifact NON republié.
- Pipeline reconstruit dans /home/claude/backup : boxes.py (boîtes d'origine), dl.py (télécharge l'export DAHZbAEO13g d'après les URL du transcript : python3 dl.py '{"1":"nom.f",...}' <tag>), px2.py (python3 px2.py nom… → chars_px2.json cumulatif + prev/), smoke.js (test Playwright).
- Injection : ajouter une ligne `for (const [k, v] of Object.entries(<chars_px2>)) SPRB[k] = Object.assign(SPRB[k] || {}, v);` après l'ancre `SPRB[k] = Object.assign(SPRB[k] || {}, v);\n` de Myconautes-0.9.37.html + bump GAME_VERSION.
- Fée/Humus : jobs.json (face pixel fée = MAHbDO3NiRg ; anciens sprites uploadés = refs de pose). Humus : générer d'abord la face (oldf + style MAHatIQO9PI).
POSE : b="seen from behind, back view", w="walking, mid-stride, LEFT leg forward", w2="walking, RIGHT leg forward, opposite stride", a="attacking".

## 16/11 ~04:45 UTC — yeux
- Nouveau convertisseur px3.py (grille native, native.py) : yeux/bouche nets. 0.9.39 = 0.9.37 + chars_px3.json (rosalie, ermite, pervenche, dryade refaits). Livrée par SendUserFile.
- Odile et Vesce : yeux ratés mais sources perdues → à REGÉNÉRER entièrement (jobs.json : odile, vesce, comme Humus : face d'abord avec oldf + style MAHatIQO9PI, puis b/w/w2/a).
- Ordre des cycles : fee (b,w,w2,a) → humus (f,b,w,w2,a) → odile (f,…) → vesce (f,…). Conversion finale avec px3.py, injection dans Myconautes-0.9.39.html.
- Cycle 04:56 : fee.b OK (MAHbDNPlrSw).
- Cycle 05:43 : fee.w OK (MAHbDY0fiz8).
- Cycle 06:32 : fee.w2 OK (MAHbDjdsPSc).
- Cycle 07:20 : fee.a OK (MAHbD6IIvFE). Fee complète → intégration.
- 07:30 : 0.9.40 construite (fee intégrée, 35/36), smoke OK, livrée. Suite : humus f.
- Cycle 08:14 : humus.f OK (MAHbEPPDRUI).
- Cycle 09:02 : humus.b OK (MAHbEeEOx_Q).
- Cycle 09:49 : humus.w OK (MAHbEQKCeOE).
- Cycle 10:36 : humus.w2 OK (MAHbEv-mGYM).
- Cycle 11:23 : humus.a OK (MAHbE1_jrsA). Humus complet → intégration.
- 11:30 : 0.9.41 construite (humus intégré, 36/36 ; odile+vesce à refaire pour les yeux). Suite : odile f.
- Cycle 12:15 : odile.f OK (MAHbFPVc9pE).
- Cycle 13:03 : odile.b OK (MAHbFWqEskk) (1 erreur 503 puis OK).
- Cycle 13:52 : odile.w OK (MAHbFQl6Yb4).
- Cycle 14:39 : odile.w2 OK (MAHbFg0QkEY).
- Cycle 15:26 : odile.a OK (MAHbF6TsoC4). Odile complète → intégration.
- 15:30 : 0.9.42 construite (odile refaite, yeux OK). Suite : vesce f.
- Cycle 16:17 : vesce.f OK (MAHbGFwFG-o) (paraît assez jeune malgré cheveux blancs).
- Cycle 17:04 : vesce.b OK (MAHbGcBAPXk).
- Cycle 17:51 : vesce.w OK (MAHbGUH9TmQ).
- Cycle 18:38 : vesce.w2 OK (MAHbGmhias4).
- Cycle 19:25 : vesce.a OK (MAHbG3X2JSo). Vesce complète → intégration.
- 19:30 : 0.9.43 construite (vesce refaite, yeux OK). Lot 3 yeux TERMINÉ. Restent marches w2 : taureau ambroise ermite salamandre (vesce.w2 refaite). Cycles arrêtés.
