# Brian the Barbarian — weboldal (GitHub Pages)

## Telepítés
1. Másold a fájlokat a GitHub repo gyökerébe (index.html legyen a root-ban).
2. Állítsd be a linkeket: `assets/js/config.js`
3. GitHub → Settings → Pages:
   - Source: Deploy from a branch
   - Branch: main (vagy master)
   - Folder: /(root)

## Adatok
A parancsok + eventek a `assets/data/bot-data.json` fájlból jönnek (automatikusan generált).

## Fejlesztés
Nyisd meg egy helyi szerveren (pl. VS Code Live Server), mert a `fetch()` helyi fájlról nem mindig működik.
