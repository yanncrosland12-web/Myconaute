# Myconautes

Jeu de gestion : faire pousser des champignons, les revendre et payer la dîme.

- `index.html` : le jeu (fichier unique, à ouvrir dans un navigateur). Version actuelle : 0.9.47.
- `tools/` : pipeline des sprites pixel art (Canva → découpe → injection) et tests Playwright.
  - `build.py <version>` reconstruit le jeu depuis `base-0.9.37.html` + `chars_px3.json` + `lot4/px.json`.
- `docs/` : journaux des lots 3 et 4, changelogs.
