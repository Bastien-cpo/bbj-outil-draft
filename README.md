# BBJ Outil Draft

**Guides :** [Guide de l'outil](guides/GUIDE.md) · [Installer le favori Drafter](guides/FAVORI.md)

Outil d'aide à la draft League of Legends (fearless) pour l'équipe BBJ : suggestions de bans et de picks, préparation contre un adversaire (op.gg), analyse de fin de draft, historique des scrims, synchro en direct avec Drafter.

## Organisation
- `src/` — l'application (JavaScript, sans serveur)
  - `data.js` : champions, tier lists, stats d'équipe (Parthenon), duos
  - `meta.js` : méta solo Q (OP.GG) et solo Q de nos joueurs
  - `gen*.js` : données générées (matchups, synergies, drafts pro, clés Riot)
  - `engine.js` : tout le calcul (scores, bans, duos, analyse de fin de draft)
  - `ui.js` : interface ; `template.html` : page et styles
- `relay/relay.js` — le favori « BBJ ➜ Drafter » (lit la page Drafter et envoie la draft à l'outil)
- `assets/` — données brutes (exports lolalytics, drafts pro gol.gg, sprite des icônes)
- `build.py` — assemble tout en un seul fichier `dist/index.html`

## Construire
```
python3 build.py
```
puis ouvrir `dist/index.html` dans un navigateur.

## En ligne et dans Drafter
- Site : https://bastien-cpo.github.io/bbj-outil-draft/ (fichiers `index.html`, `champs.webp`, `team.json` à la racine, copiés depuis `dist/`).
- `team.json` : copie des données d'équipe (tier lists, line-up, préparation, historique) — la base partagée reste l'outil sur Claude.
- Favori « BBJ ➜ Drafter » (`relay/overlay.js`) : à cliquer sur une page drafter.lol, ouvre l’outil dans une fenêtre à part et lui envoie picks et bans toutes les 0,5 s.

## Versions
Voir [CHANGELOG.md](CHANGELOG.md).
