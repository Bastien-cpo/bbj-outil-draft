# Guide de l'outil draft BBJ

**Lien de l'outil :** https://bastien-cpo.github.io/bbj-outil-draft/

L'outil nous conseille pendant la draft : bans, picks, duos, prédiction des picks adverses, et une analyse quand la draft est terminée. Il est pensé pour notre format : **fearless, séries de 3 games**.

Les conseils sont des propositions, pas des ordres. La décision finale reste celle de l'équipe.

---

## En 30 secondes

1. Installe le **favori « BBJ ➜ Drafter »** une seule fois → [tutoriel du favori](FAVORI.md).
2. Le jour du match, ouvre la room **Drafter**, puis clique le favori : l'outil s'ouvre à côté et suit la draft tout seul.
3. À chaque game, choisis notre côté (Blue / Red). Ensuite, lis les suggestions au fil des étapes.
4. À la fin de la draft, entre le résultat, puis **Partie suivante** (ou **Fin de série**).

---

## Les 5 onglets

| Onglet | À quoi il sert |
|---|---|
| **Draft** | La draft en direct : suggestions de bans et de picks, prédiction adverse, analyse finale |
| **Préparation** | Notre lineup, l'adversaire, ses op.gg, les bans conseillés |
| **Pools** | Les tier lists de chaque joueur, avec nos stats en scrim |
| **Historique** | Nos séries passées : drafts, résultats, stats des games |
| **Réglages** | Poids du score, ordre des rôles, matchups et synergies, favori Drafter |

---

## 1. Onglet Draft

![Draft](img/tool_draft.png)

### En haut
- **Game 1 / 2 / 3** : la game en cours de la série.
- **Blue / Red** : notre côté. L'outil le demande à chaque game, car tout en dépend (ordre de la draft, suggestions).
- **Lineup** (Top Romain, Jungle Fabien…) : qui joue quel rôle. On la modifie dans Préparation.
- **Nouvelle série** : archive la série en cours dans l'Historique et repart à zéro.

### Les deux colonnes
- **À gauche, nous ; à droite, eux** (ou l'inverse selon le côté). On y voit les bans et les picks faits.
- Cliquer un champion déjà placé permet de **corriger** une erreur. La correction est gardée, même si Drafter renvoie autre chose.
- Le bouton **\*** à côté d'un pick = **flex** : le rôle de ce champion n'est pas encore sûr.
- Pendant les bans, notre premier emplacement de pick affiche des **idées de first pick** (côté bleu) ou des **idées de paires R1-R2** (côté rouge).

### La prédiction adverse (colonne adverse)
Pour chaque rôle adverse encore libre, l'outil montre les 5 champions qu'ils ont le plus de chances de jouer.
- Le calcul : **60 % leur pool** (op.gg) et **40 % le contexte** (counters de nos picks, synergies avec leurs picks, méta).
- **Leurs bans comptent aussi.** S'ils bannissent les counters d'un champion, ils le préparent sans doute. S'ils ont banni un champion à une game précédente et le laissent ouvert maintenant, ils comptent sans doute le jouer.
- Un **cercle rouge** autour d'un champion = pick dangereux pour nous (gros counter ou mécanique qui punit notre compo).
- Les **icônes de rôle** au-dessus ouvrent la **fiche du joueur adverse** : son pool, ses champions flex, et ce qu'on peut laisser passer.

### Au centre : les suggestions
Pendant **nos bans** :
- **Bans 1 à 3** : on vise le **confort de leurs joueurs** (volume de games, winrate, KDA). C'est notre façon de faire face à une équipe qu'on connaît peu. Si notre joueur a un vrai counter à un de leurs champions, celui-ci descend un peu, avec l'étiquette « Contrable par nous ».
- **Bans 4 et 5** : adaptés à la draft (leurs picks probables, les counters de nos picks, les champions encore blindables).

Pendant **nos picks**, une ligne par rôle encore libre, avec un **score sur 100** sur chaque champion :

![Picks](img/tool_pick.png)

| Critère | Poids | Ce qu'il mesure |
|---|---|---|
| **Affinité** | 25 | Expérience du joueur : games en scrim/compétition, solo Q, tier list |
| **Méta** | 25 | Force sur le patch (games pro + solo Q haut elo) |
| **Synergie** | 25 | Avec nos picks déjà faits, duos pro et duos qu'on joue déjà |
| **Matchup / Blind** | 25 | Contre son vis-à-vis s'il est connu ; sinon, capacité à être pické à l'aveugle |

- Le **top** compte un peu plus dans le matchup (×1,35) : à notre niveau, sa lane pèse beaucoup.
- Avec un **remplaçant** (Yeyozz, Bounty), son affinité compte 1,6× plus : on priorise son confort.
- La ligne **Duos** propose les paires qui marchent ensemble. Elle ne propose jamais deux champions qui perdent ensemble.
- Passer la souris sur un champion affiche le **détail du score**.
- En **fearless**, les champions déjà joués dans la série disparaissent des suggestions.

### Choisir un champion à la main
Clique le champion dans la grille, puis **Confirmer**. Un double-clic confirme directement. **Retour** annule la dernière action.

### L'analyse de fin de draft

![Analyse](img/tool_final.png)

- **% de victoire estimé** (expérience, matchups, cohérence de compo, méta).
- **Forces et faiblesses** de chaque compo, avec les synergies et anti-synergies.
- Les **4 matchups** : top, jungle, mid, botlane. Un « ≈ » signifie une estimation (pas de duel mesuré dans nos données).
- Le **plan de jeu** : il n'apparaît que quand quelque chose est vraiment marqué (lane très gagnante ou perdante, gros écart d'early ou de scaling…).
- **Résultat** : Victoire / Défaite, puis **Partie suivante** ou **Fin de série**.

---

## 2. Onglet Préparation

![Préparation](img/tool_prep.png)

- **Notre équipe** : qui joue quel rôle. Si un remplaçant joue, change-le ici. Tout l'outil s'adapte.
- **Adversaire** : nom, lien multi-op.gg, pseudos (avec le #TAG).
- **Demander l'analyse op.gg** : prépare les profils et les bans conseillés. Sur le lien public, ce bouton ne transmet rien : envoie plutôt le lien multi-op.gg à Bastien sur Discord.
- **Bans conseillés** : par ordre de priorité, chacun avec sa raison chiffrée (games, winrate, KDA, part de ses parties).
- **Profils adverses** : les champions de chaque joueur, avec ses games et son winrate.
- **Saisie manuelle** : pour entrer un pool à la main si besoin.

---

## 3. Onglet Pools

![Pools](img/tool_pool.png)

- Une tier list par joueur (S, A, B, C, D, puis « Hors tier »).
- Sous chaque champion : **à gauche, les games en équipe** (scrims + compétition), **à droite, la solo Q** (tous nos comptes).
- **Clique un champion** pour ouvrir sa fiche : games, victoires/défaites, winrate, KDA, part des dégâts, or à 15 min et **note de performance /100**. Les boutons pour **changer son tier** sont dans la même fiche.
- La note de performance : **50 = ton niveau habituel à ce rôle**. Le winrate compte pour moitié, puis KDA, dégâts, or à 15 min et écart de CS.
- Le champ en bas sert à ajouter un champion à un pool.

Les tier lists comptent beaucoup dans les suggestions : **tenez-les à jour**.

---

## 4. Onglet Historique

Chaque série jouée : date, adversaire, score, et pour chaque game notre côté, les deux compos et une note. On peut ouvrir une game pour revoir la draft et les stats (KDA, or, CS, dégâts, objectifs).

---

## 5. Onglet Réglages

- **Poids du score** (25 / 25 / 25 / 25 par défaut).
- **Ordre des rôles en draft** : le rôle qu'on pick le plus tôt, jusqu'au plus tard.
- **Synergies** et **Counters** : on peut ajouter les nôtres à la main (par exemple un matchup qu'on connaît bien en équipe).
- **Favori Drafter** : le bouton à glisser dans la barre de favoris.

---

## Remplacer Bastien pendant une série

1. Ouvre l'outil depuis le favori sur la page Drafter, comme d'habitude.
2. Vérifie la lineup et l'adversaire dans **Préparation**.
3. Choisis le côté à chaque game, entre le résultat à la fin de chaque draft, puis **Partie suivante**.
4. **Fin de série** : sur ton PC, ça archive la série dans ton historique. L'export automatique des stats du client et l'envoi pour toute l'équipe ne marchent que sur le PC de Bastien. Préviens-le pour qu'il fasse l'export.

**Bon à savoir :** sur le lien public, ce que tu modifies (tiers, préparation, historique) reste **dans ton navigateur**. Quand Bastien publie une mise à jour, l'outil la récupère à la prochaine ouverture et elle remplace tes données locales. Pour changer une tier list pour toute l'équipe, envoie-la à Bastien.

---

## D'où viennent les données
- **Méta** : OP.GG Maître+ et Émeraude+, patch 26.22 ajusté avec le patch 26.23.
- **Pro** : 12 746 games pro 2025-2026 (ordre de pick, duos joués ensemble).
- **Matchups** : lolalytics Maître+, complétés par lolstats.gg. **Synergies** : lolstats.gg et metabot.gg.
- **Nos games** : Parthénon (72 scrims jusqu'au 17/11), puis chaque série exportée avec « Fin de série ».
- **Solo Q** : op.gg, tous les comptes de chaque joueur.
