# Myconautes 0.9.62 — 27/11/2026

## Décors : finition lisse B, suite et fin (lot 13)
- 19 objets redessinés en pixels fins (même finesse que le personnage), sans repixelisation :
  - Cuisine : 4 fours (âtre, fonte, champignon, dragon), 4 plans de travail (table, billot, marbre, étal), 4 aides (lutin, hibou, chat, golem).
  - Labo : chaudron, établi d'alchimie, bibliothèque.
  - Coffre.
  - Salle d'armes : mannequin, rochers, présentoir.
- Tous les objets ont des pieds ou un socle visibles avec un trait de contact au sol (fin de l'effet « flottant »).
- Avec la maison (0.9.61), les 39 objets du lot 13 sont terminés.

## Sols fins partout (lot 14)
- Nouvelles textures de sol 200×200, même finesse que les meubles : tomettes (cuisine), dalles bleutées (labo), pierre (salle d'armes), dalles (guilde), parquet clair (boutique), damier.
- Les motifs `#tx-sol_*` sont remplacés à la volée. `floorArt` est enveloppé pour la maison et la boutique.

## Outils
- `lot13/cut13.py` : nouveau réglage `WHOLES={clé:(taille,yfrac)}`. Pour les fonds blancs, il vide les trous blancs fermés situés sous `yfrac` (par exemple entre les bottes d'herbes de l'établi) sans toucher aux reflets du verre.
- `audit/sp/rooms62.js` : captures de la cuisine en 4 variantes, du labo, de la salle d'armes, de la boutique et de la guilde, avec la bulle Pipo masquée.

## Tests
- `err.js` : aucune erreur. `smoke.js` : 36/36, aucune erreur.
