# Historique des versions — BBJ Outil Draft

Chaque version résume ce qui a été ajouté ou changé concrètement. Les points marqués « à revoir » sont des choix discutables à rediscuter en équipe.

## 1.8 — 26/11/2026
- Correctif : si les profils adverses ont disparu en local (série remise à zéro, nouveau navigateur…), l'outil recharge automatiquement la préparation publiée au prochain chargement (Ctrl+F5).
- Drafter : un champion survolé mais pas encore validé (ban ou pick, chez nous comme chez eux) s'affiche en transparence avec un contour en pointillés dans sa case (« survolé sur Drafter »). Il n'est jamais compté dans la draft ni dans les calculs tant qu'il n'est pas validé. Avant, il n'apparaissait pas du tout.

## 1.7 — 26/11/2026
- Nouvelle famille « Early game » ⚡ (Renekton, Lee Sin, Draven, LeBlanc, Elise, Lucian…).
- Tempo des compos (dès 3 picks), sous chaque équipe : « Leur compo mise tout sur l'early, sans scaling : même menés, chaque minute joue pour nous » (et l'inverse pour une compo de scaling, ou pour la nôtre). Une compo adverse sans scaling met en avant nos champions de scaling (« Exploite leur compo sans scaling »), une compo lente fait ressortir nos champions d'early.
- Hors pool : s'ils sont vraiment excellents dans la draft (à 8 points ou moins du 5e choix), ils passent en 6e-7e position. Sinon, ils restent rangés plus loin.

## 1.6 — 26/11/2026
- Champions « hors pool » : ils ne sont plus forcés en 4e-5e position. Ils se rangent selon leur score, après les champions habituels du joueur, au plus loin en 8e-9e position pour rester visibles sur PC. Le bandeau et l'anneau bleu suffisent à les repérer, et le choix revient au joueur.

## 1.5 — 26/11/2026
- Nos picks 4-5 : dès 3 picks chez nous, bandeau « Notre compo manque d'engage / de réception : les champions en bleu la combleraient » au-dessus des suggestions. Anneau bleu sur les 4 premiers champions de chaque rôle qui comblent ce manque, et 2 champions hors du pool du joueur mais forts dans la draft actuelle, placés en 4e-5e position avec l'étiquette « hors pool », pour en discuter avec le joueur.

## 1.4 — 26/11/2026
- Bans 4-5 : le poids des critères de famille (compléter / casser la synergie) dépend de la taille du pool du joueur adverse à ce rôle (champions à 10 games ou plus encore disponibles) : pool large → logique de compo à plein ; pool réduit (≤ 3) → effet réduit à 30 %, ses conforts et ses counters gardent la main (mention « Pool réduit » dans la raison).
- Texte de la stratégie : « aucun champion disponible chez nous pour punir leur compo » (au lieu de « outil »).
- Raisons des bans dédoublonnées.
- Préparation EQX : rang actuel et pic d'elo de chaque joueur dans les fiches.

## 1.3 — 26/11/2026 · stratégie des bans 4-5
- Bans 4-5 : l'outil choisit une stratégie selon nos propres outils. Si on a encore (S/A, disponibles, à nos rôles restants) de quoi punir leur compo et qu'ils peuvent combler leur trou → « Les priver d'engage / de réception » (bans des champions qui le combleraient). S'ils ne peuvent plus le combler, ou si on n'a pas de quoi les punir → « Casser leur synergie » (bans des champions qui renforcent leur famille dominante). La stratégie s'affiche au-dessus des bans ; les bans qui la servent ont un anneau bleu.
- Nos picks : critère « Exploite leur compo » (dès 3 picks adverses) pour les champions qui punissent leur trou ou leur famille dominante (dive/catch contre zéro réception, poke contre zéro engage, réception contre du tout-engage…). Anneau vert sur au plus 3 champions par ligne, parmi les mieux notés.

## 1.2 — 26/11/2026
- Icônes de famille : placées à côté du menu de rôle (qui passe en plus petit) et renvoyées à la ligne s'il manque de place ; plus aucune superposition, vérifié en 390, 768, 1024, 1280 et 1920 px (contrôle ajouté aux tests).
- Préparation : les profils adverses n'affichent plus que l'icône du champion, ses games et son winrate (le nom reste au survol).

## 1.1 — 26/11/2026 · retours du coach
- Prédiction adverse : ce que leur joueur prend d'habitude en solo Q contre NOTRE champion de lane (détail « vs » d'op.gg) remonte dans ses picks probables et dans les bans 4-5 (ex. Thresh locké → Milio, Karma, Lulu, Rakan pour leur support).
- Fiches adverses vivantes : tout champion indisponible (pické, banni, déjà joué en fearless) disparaît de la fiche, counters compris ; quand notre rôle est locké, la fiche compare à notre pick et affiche « Ce qu'il joue d'habitude contre X ». Corrigé : la ligne Flex citait le joueur lui-même.
- Familles de jeu : icônes à côté de chaque pick (Engage ⚔, Pick/Catch 🎯, Réception 🛡, Poke ☄, Dive ⤵, Teamfight ✸, Split ↯, Scaling ⏳) et bilan sous chaque compo (familles présentes, engage ou réception manquants en rouge). Visuel provisoire.
- Bans 4-5 : priorité aux champions qui combleraient le trou de leur compo (« Compléterait leur compo : Réception qui leur manque »), puis à ceux qui renforceraient une famille déjà marquée.
- Tests : dossier tests/ (tests/run.sh) lancé avant chaque version — 300 drafts aléatoires sur le moteur, puis drafts complètes bleu/rouge sur ordinateur et mobile avec ouverture de chaque fiche adverse à chaque étape.

## 1.0 — 21/11/2026 · première version officielle partagée à l'équipe
- Numérotation remise à zéro : cette version (anciennement v12.26) devient la 1.0. Les entrées ci-dessous (v11 à v12.26) retracent le développement avant la sortie.
- Guide de l'outil réécrit pour les joueurs de l'équipe ; « Fin de série » et l'envoi des stats restent gérés par Bastien.
- Correctif (même version) : un champion S ou A de la tier list n'est plus enterré par le critère Timing (« rarement pické aussi tôt en pro ») ; il garde au moins 0,75 (S) ou 0,5 (A) sur ce critère. Ex. Corki revient dans le top 3 ADC en début de draft.

## v12.26
- L'outil s'ouvre toujours sur l'onglet Draft.
- Une draft en cours depuis plus de 6 h est effacée à l'ouverture (l'outil repart propre) ; un rechargement en pleine draft la garde.
- Guide de l'outil réécrit pour un nouvel utilisateur, avec une partie « Gérer l'outil pendant une série » (favori Drafter, Fin de série, préparation d'un PC).

## v12.25
- Analyse de draft : les 4 matchups (top, jungle, mid, botlane) toujours affichés, même proches de 50 % ; sans duel mesuré, estimation par l'écart de winrate des champions, marquée « ≈ » (et comptée moins fort dans l'estimation de victoire).
- Plan de jeu : uniquement les conseils marqués (lane à 55 % ou plus / 45 % ou moins, net écart de profil entre les compos) ; plus aucune phrase générique.
- Bans conseillés : seule l'étiquette « Contrable par nous » reste (nos counters au survol) ; icônes « Counter » et phrase « On peut le laisser » retirées.

## v12.24 — passe de test
- Scores des paires et duos plafonnés à 100 (on voyait 102-106).
- Analyse finale : « undefined 48.5 % » remplacé par « Botlane 48.5 % ».
- Analyse finale : les anti-synergies (valeurs négatives) ne sont plus listées comme « Synergies ».
- Bans : quand ils bannissent un de nos conforts S/A qui contre un de leurs champions, le signal « préparé par leurs bans » est affaibli (ils visent surtout notre joueur) ; il n'apparaît plus qu'au-delà d'un seuil.
- Sélecteur Blue/Red : plus de côté surligné tant que le côté n'a pas été choisi.
- Mobile : bulles de prédiction adverses qui dépassaient la colonne, page qui débordait à droite, onglets joueurs du Pool coupés (Yeyozz, Bounty) → corrigés.
- Réglages : texte « Sources » mis à jour (duos pro 2025-2026, Parthénon + Fin de série, solo Q multi-comptes).
- Icône d'onglet ajoutée (erreur 404 favicon).

## v12.23
- Fiches adverses recentrées sur le joueur : retirés « Hors de son op.gg », « Pool large » et « Style ». Gardé : one-trick, pool resserré, nouveau « Pool réduit » (4 champions ou moins à 10 games).
- Flex clarifié : « Viktor — il le joue, et Para aussi (mid) ».
- « À laisser » seulement en vraie sous-performance : ≥ 25 games, ≤ 43 % de victoires et KDA < 2,2.
- Prédiction : un champion hors de leur pool compte très peu en début de draft, un peu plus en fin de draft (picks 4-5), surtout s'il punit notre compo.
- Préparation EQX : notes raccourcies (picks récents sans stats, plus de titulaire/remplaçant).

## v12.22
- Préparation : raisons des bans conseillés resserrées, chacune appuyée par une stat (games, winrate, KDA, part de ses parties) ; plus de « joueur n°X sur 5 ».
- Bug visuel corrigé : le champ du joueur 5 ne dépasse plus du cadre.
- Textes d'aide superflus retirés (bans conseillés, analyse op.gg, Pool, choix du côté, historique vide) pour alléger l'outil.

## v12.21
- Solo Q à jour (op.gg du 21/11) pour Fabien (BBJ Billy), JH (BBJ Shadouxe) et Bastien (Shigeo) : tous les champions joués au moins 3 fois, plus seulement les 10 premiers.
- Pool : un champion n'apparaît plus « hors tier » à cause des games d'un autre joueur (ex. Bard chez Léo, joué une fois par Fabien au support). Seules ses propres games en équipe à ce rôle ou ≥ 20 games en solo Q l'y font entrer. Ligne renommée « Hors tier ».

## v12.20
- Fayk et Billy affichés sous leurs prénoms : Romain et Fabien (tiers, lineups, historique et préparation migrés automatiquement).
- Solo Q cumulée sur tous les comptes : Romain (BBJ Faykedit + la kipa a yahu + I must improve), Léo (BBJ Shogui + BlessedByVictini, qui manquait).
- Onglet Pool : cases équipe / solo Q plus petites, note de performance retirée des icônes (visible dans la fiche).

## v12.19
- Note de performance : le winrate (lissé) devient le facteur majeur (50 %) ; KDA, part des dégâts, or à 15 min et écart de CS avec le vis-à-vis comptent 12,5 % chacun (comparés à la moyenne du joueur à ce rôle). Écart de CS ajouté à la base Parthénon et lu dans les exports.
- Onglet Pool : chaque champion affiche le même format, games en équipe (scrims + compétition, mis en avant) et solo Q à côté, même à 0 ; pastille de note de performance en coin quand il y a des games en équipe.

## v12.18
- Fiches du Pool : les séries exportées avec « Fin de série » (historique de l'outil, stats du client) s'ajoutent automatiquement à la base Parthénon (jusqu'au 17/11). Plus besoin de repasser par le Parthénon.
- Score de performance revu : 50 = niveau habituel du joueur à ce rôle (comparé à sa propre moyenne, plus à toute la partie). 45 % winrate lissé, 20 % KDA, 15 % part des dégâts, 20 % or à 15 min (remplacé par le winrate quand l'export n'a pas l'or à 15 min). Les petits échantillons sont ramenés vers 50.

## v12.17
- Yeyozz (remplaçant top) : tier list tirée de son op.gg 2026 + 2025 (S : Jax, Darius, Aatrox ; A : Zaahen, Ambessa, K'Sante, Olaf ; B : Mordekaiser, Renekton, Yone, Dr. Mundo ; C : Sett, Urgot, Nasus, Camille).
- Onglet Pool : cliquer un champion ouvre une mini fiche sur nos parties en scrim/compétition uniquement (games, V-D, winrate, KDA, part des dégâts, or à 15 min, score de performance /100). Les boutons de tier restent dans la fiche.
- Score de performance : 35 % winrate lissé, 25 % KDA et 20 % part des dégâts (comparés à la moyenne du rôle), 20 % écart d'or à 15 min.

## v12.16
- Bans : la préparation suit leurs bans. S'ils bannissent l'un de nos counters d'un de leurs conforts (ex. Kassadin de JH → Cassiopeia de Para), ce confort remonte avec « ⚠ Ils ont banni X, notre counter : pick probable ».

## v12.15
- Bans 1-3 : notre équipe compte aussi. Si le joueur concerné a un counter qu'il maîtrise (et encore disponible en fearless), le confort adverse descend (jusqu'à −30 %, moins si c'est leur meilleur joueur) et reste affiché avec « On peut le laisser : … le contre ».

## v12.14
- Bans 1 à 3 : uniquement l'affinité des adversaires (volume, part de leurs games, winrate, KDA), sans méta ; les suggestions pro/méta passent après. En fearless, les champions déjà joués sortent et les conforts restants prennent le relais à chaque game.
- Bans 4 et 5 : inchangés (adaptés aux picks, counters, blindables).

## v12.13
- Plan de bans : réflexion globale, plus de quota d'un ban par joueur (un joueur au-dessus du lot avec deux gros conforts peut prendre deux bans).
- Score de ban centré sur le confort du compte : volume de games, part de ses parties, winrate et KDA ; la force sur le patch ne compte que s'il joue le champion (ex. EQX : Ahri, Jhin, Olaf, Rell devant ; Leona, 4e champion de Sakuya, redescend).

## v12.12
- Nouveau joueur remplaçant : Bounty (coach, support). Tier list tirée de son op.gg 2026 (S : Soraka, Leona, Taric, Milio).
- Remplaçant dans la lineup (Bounty ou Yeyozz) : son affinité pèse 1,6× dans le score, pour prioriser son confort.
- Préparation : EQX (Azzgard, FKR1, Para, Maliketh, Sakuya), lineup avec Bounty au support.

## v12.11
- Affinité : les 72 scrims du Parthénon (+ 19/11) sont comptés par joueur et par rôle ; leurs résultats donnent un bonus/malus lissé d'au plus ±15 % (ex. Syndra chez JH, 2 V sur 7, baisse ; peu de games = presque neutre). Les tier lists de l'outil restent la référence, pas celles du Parthénon.
- Synergie : les duos déjà joués par l'équipe (≥ 3 games) comptent dans le score, sans affichage (Yunara + Lulu 0/3 en malus ; Jinx + Milio, Tristana + Nautilus en bonus).

## v12.10
- Tuto : titre « Bienvenue dans l'outil draft de BBJ », phrase d'intro retirée ; il ne s'ouvre plus tout seul, seulement avec le bouton Tuto.

## v12.9
- Bouton « Tuto » (icône livre) en haut de l'outil : le tuto intégré, ouvert automatiquement à la première ouverture.

## v12.8
- Poids du score de pick : affinité 25, méta 25, synergie 25, matchup/blind 25 (le top garde +35 %).
- Matchup/blind = une seule unité : laner adverse connu → 100 % counter ; pas encore connu → 100 % blindabilité (first pick bleu = blind pur).

## v12.7
- « Fin de série » envoie aussi la série au script du PC, qui l'ajoute avec les stats du client à team.json sur GitHub : toute l'équipe la voit sans passer par Claude (clé GitHub à poser une fois dans Documents\BBJ\github-token.txt).

## v12.6
- Fin de draft : boutons « Partie suivante » et « Fin de série ».
- « Fin de série » archive la série et lance le script du PC (lien bbj-export://, à installer une fois) : il exporte les parties du client LoL et renvoie leurs stats à l'outil, qui les range dans la série (résultats compris).

## v12.5
- Relais Drafter : quand Drafter ouvre la game suivante dans une nouvelle fenêtre (lien « Partie N »), le relais l'ouvre lui-même, s'y réinstalle et garde la même fenêtre d'outil : plus besoin de recliquer le favori. L'ancienne fenêtre se tait.
- L'outil ignore une game précédente de la même room (deux fenêtres Drafter ouvertes).

## v12.4
- Historique : la vue d'une game affiche ses stats importées du client (KDA, or, CS, dégâts, vision par rôle, objectifs, durée) et le vrai nom de l'adversaire de la série.
- « Retour » disponible aussi une fois la draft finie ; il efface aussi une correction manuelle.
- Revue de bugs : 550 drafts aléatoires sur le moteur + parcours complet de l'interface et du relais Drafter, sans erreur.

## v12.3
- Duos nommés : une paire choisie exprès ensemble en pro (co-occurrence ≥ 2, même rotation) garde l'étiquette « duo » même si elle performe mal (Yunara + Lulu, Lucian + Milio…). 28 duos.
- Le bonus de duo suit sa performance : bonus jusqu'à +3 pour un duo gagnant, malus jusqu'à −2,5 pour un duo perdant ensemble.

## v12.2
- Duos pro recalculés sur 12 746 games 2025-2026 (ligues majeures + LCK CL, EMEA Masters, LFL…), récentes pondérées plus fort, refontes exclues (Mel avant 26.22, Nami avant 26.11, Shyvana, Gwen, Bel'Veth…).
- Un duo pro = ≥ 20 games effectives, jamais perdant ensemble, et soit choisi exprès ensemble (co-occurrence ≥ 2, même rotation de draft), soit nettement gagnant (+4 pts sur ≥ 35 games). 19 duos retenus.
- Le gain de victoire pro ensemble devient une source de synergie (positive ou négative).

## v12.1
- Correctif urgent : la v12.0 bloquait les suggestions côté rouge en picks 1-2 (erreur dans le calcul des duos).

## v12.0
- Duos : jamais avec une anti-synergie mesurée ; jouer souvent ensemble en pro ne suffit plus (il faut une synergie mesurée ou un bon winrate ensemble). Fini Lulu + Lee Sin, Olaf + Lee Sin, Lulu + Ahri.
- Alerte « support exposé » retirée (affichage épuré).
- Picks adverses prédits : cercle rouge autour de ceux qui sont très dangereux pour notre compo (gros counter de notre lane, ou grappin/anti-dash qui punit notre compo).

## v11.9
- Correctif : un champion présélectionné pour l'adversaire ne décale plus les prédictions des cases suivantes (plus de rôle en double).

## v11.8
- Côté rouge : les cases R1 et R2 fusionnent pendant les bans 1 ; paires verticales (un champion au-dessus de l'autre), au moins 5 affichées.

## v11.7
- Idées de picks sur une seule ligne, dans l'ordre strict du score (plus de limite de 2 par rôle).
- Côté rouge : paires R1-R2 en bulles partagées (deux champions + score commun), autant que la largeur le permet.

## v11.6
- Idées de first pick (bleu) / paires R1-R2 (rouge) affichées en bulles dans nos premières cases, par score.
- Lecture des bans adverses : bannir les counters d'un champion = ils le préparent ; un champion qu'ils bannissaient dans une game précédente et laissent ouvert = pick prévu (first pick s'ils passent bleus). Les bans visant nos conforts comptent peu.
- Bans de phase 2 : « Pick préparé par leurs bans » remonte en priorité.

## v11.5
- Phase de bans 1 : idées de first pick (bleu) ou de duo R1-R2 (rouge), selon le score de l'outil, mises à jour à chaque ban.
- Picks adverses prédits : 60 % leur pool solo Q, 40 % réflexion (counter de nos picks, synergie avec leurs picks, méta, mécaniques qui nous punissent). Recalculés à chaque pick et ban, des deux côtés.

## v11.4
- Drafter : un champion montré mais pas encore confirmé n'est plus compté (l'outil attend la confirmation).
- Corrections manuelles d'un pick/ban (raté ou erroné) gardées : Drafter ne les écrase plus, et elles partent dans l'historique.
- Pick raté cliquable pour le corriger.

## v11.3
- Analyse de fin de draft : côté rouge, BBJ et notre % de victoire passent à droite, l'adversaire à gauche (cartes et lanes aussi).

## v11.2
- Alerte « support exposé au contre » (et « bot exposé » tant que leur support n'est pas choisi), avec les contres probables.
- Grappins contre bot peu mobile, anti-dash contre compo à dashs : pris en compte dans les alertes et les bans de phase 2.
- Fiches : « Hors de son op.gg, peut sortir » (champions très présents en pro ou en solo Q).
- Historique : stats des parties importées du client LoL.

## v11.1 — 20/11/2026
- Bug G3 du 19/11 corrigé : Drafter affiche les icônes de lane dès la G2/G3 ; l'outil ne les lit plus qu'une fois les 10 picks faits (sinon chaque champion prenait la lane de sa case et les rôles devenaient « ? »).
- Historique : scrim contre Funky (19/11) ajouté depuis Drafter (L, L, W).

## v11.0 — 19/11/2026 — version semi-finale (partage à l'équipe)
- Draft automatisée avec Drafter (favori « BBJ ➜ Drafter » en fenêtre à part), fiches adverses, bans/picks calibrés sur les games pro 2026, patch 26.23.
- Préparation du soir : Funkγ Swanny confirmé top, pool top complété avec ses saisons 2024-2025 (main top avant).

## v10.22 — 19/11/2026
- Fiches : « Flex » seulement si le champion est dans le pool affiché de deux de leurs joueurs, chacun à son rôle (ex. « Karma (aussi ChromosomeXX en support) »).

## v10.21 — 19/11/2026
- Échelle finale : ≤ 92 score normal (90+ = très bon pick) ; 93–98 = les 3 critères réunis (counter de lane ≥ ~54 %, synergie + cohérence de compo, confiance du joueur), plus haut quand ils sont maximisés ; 98–100 = « pick de génie » : 3 critères + casse la compo adverse (exploite leur faiblesse : réception, engage, teamfight, early ; ou écrase sa lane).
- Unslott (mid adverse) : vrai niveau Master (compte perdu, Diamant 3 affiché) → Master estimé, remonte dans le classement et les bans ; note dans sa fiche.

## v10.20 — 19/11/2026
- Échelle des scores élargie : 90+ = très bon pick ; 94+ seulement avec gros counter + synergie/compo + confiance du joueur ; 98–100 = « pick de génie » (tous les critères au maximum).
- Préparation de l'adversaire du 19/11 (Bibbyy, BDG Invisi, Unslott, Funky Reky, Funkγ Swanny) dans l'outil et la fenêtre Drafter.

## v10.19 — 19/11/2026 — calibrage pro 2026
- Calibrage sur 1 498 games pro 2026 (détail : projet « calibrage-pro-2026 ») : % de victoire resserré (×0,6, 35–65 %) ; matchup top +35 % (score de pick et analyse finale) ; nouvelle part « Compo » (cohérence / faiblesses) à partir du 3e pick ; méta = 60 % pro / 40 % solo Q ; léger ajustement du premier pick bleu selon les B1 pro (Cassiopeia, Vi, Ezreal, Orianna + ; Jarvan IV, Jayce, Karma, Syndra, Bard −).

## v10.18 — 19/11/2026 — patch 26.23
- Notes officielles 26.23 : buffs Annie, Azir, Bard, Ezreal, Galio, Gnar, Mel, Vel'Koz, Vi (+0,07 force méta, +0,6 % WR dans les matchups) ; nerfs LeBlanc, Master Yi, Syndra (-0,09, -0,8 %). Données de jeu encore en 26.22 (patch sorti la veille), à remplacer quand il y aura assez de games.

## v10.17 — 19/11/2026
- Répétition générale sur une vraie room Drafter (2 games, fearless) : côté choisi d'un clic, ban et pick ratés, échange, bans phase 2, confirmation des rôles, passage en G2 avec fearless et bans recalculés : OK.
- Drafter recharge sa page à chaque nouvelle game : bandeau « reclique le favori » dans l'outil ; une nouvelle room enregistre la série précédente dans l'Historique (préparation gardée).

## v10.16 — 19/11/2026
- Drafter « Confirmer les rôles » : l'outil lit la lane de chaque case, garde l'ordre de pick et prend les rôles exacts des deux équipes.
- Nom de l'adversaire de la préparation jamais écrasé par Drafter ; diagnostic `bbj-ping` pour les tests.

## v10.15 — 19/11/2026
- Drafter : une nouvelle room repart d'une série vide ; une room vide efface la draft restée en mémoire après ~2 s.
- Fearless G2/G3 : bans de préparation recalculés sur les pools adverses sans les champions déjà joués (conforts restants en cible) ; fiche : ligne « Fearless : déjà joués … · il lui reste … », champions brûlés barrés et en fin de pool, counters/réponses limités aux champions encore disponibles.

## v10.14 — 19/11/2026
- Bans « pro / méta » (seuls sans préparation, 2 sur 10 avec) : 45 % présence pro (picks + bans, sans racine), 25 % force solo Q, 30 % danger pour nos S/A (counters) ; malus si le champion est dans nos tiers S/A ; côté rouge +25 % blindable.

## v10.13 — 19/11/2026
- Pick adverse : rôle le plus probable du champion, départagé par le joueur adverse qui le joue le plus à son rôle ; badge « Flex ? » retiré de la draft.
- Fiches : « contre » simplifié, ligne « Joue aussi » retirée.

## v10.12 — 19/11/2026
- Matchups refaits et recroisés : lolalytics patch 16.22 Maître+ et Émeraude+, les deux sens de chaque matchup fusionnés, petits échantillons ramenés vers 50 % ; 3 240 matchups de lane + 561 croisés bot. Anciennes données lolstats retirées. Vérifs ponctuelles op.gg / u.gg.
- Fiches : leurs counters affichés « leur champion contre notre champion » ; icône support = bouclier.

## v10.11 — 19/11/2026
- Fiches : « Pool large : N champions joués », ligne dégâts retirée, mentions « notre winrate » retirées ; nouvelles lignes « Flex ? » (champions de son pool surtout joués à un autre rôle) et « Joue aussi <rôle> ».
- Draft : un pick adverse joué par plusieurs de leurs joueurs à des rôles différents (ou à un rôle inhabituel) reçoit le rôle du joueur le plus probable et un badge « Flex ? » (détail au survol).
- Icônes : herbe haute pour la jungle, ward pour le support.

## v10.10 — 19/11/2026
- Bans : classement 1 à 5 des joueurs adverses pris en compte (bonus dégressif du n°1 au n°4, malus au n°5).
- Fiches : place #1–#5 en haut à gauche, sans #tag ni KDA ni ligne de classement ; pool réparti sur 1 ou 2 lignes équilibrées ; winrates toujours du point de vue de notre champion ; phrase de pool clarifiée ; « À laisser » = champion souvent joué mais perdant ; nos champions proposés seulement si joués en scrim/compétition ou très méta.
- Pools : score d'affinité masqué.

## v10.9 — 19/11/2026
- Joueur le plus fort en face (fiche + bans) : 1) LP actuels et pic (> 100 pts d'écart), 2) sinon WR élevé en peu de games, 3) sinon pool le plus méta + KDA. Fiche : rang, pic, games, WR, KDA, classement des 5.
- Étoile de la grille plus petite, sans lettre (couleur = tier).

## v10.8 — 19/11/2026
- Grille des champions, à notre tour de pick : étoile S/A/B sur nos champions des tier lists ; avec un filtre de rôle, nos S puis A puis B en tête (indisponibles en fin de liste).

## v10.7 — 19/11/2026
- Fiches des joueurs adverses : 5 icônes de rôle sous les bans adverses → profil (forme du pool, style, dégâts, champion fiable), champion pool (grisé si indisponible), ses counters à nos S/A et nos réponses.
- Bouton « Drafter » et ouverture par lien retirés (le favori fait tout) ; le favori s'installe depuis Réglages.

## v10.6 — 19/11/2026
- Au début de chaque game, l'outil demande d'un clic si BBJ est Blue ou Red (tout s'adapte à ce choix). Automatique si Drafter affiche BBJ / Blocked by Jungle. Devinette par les pools retirée.

## v10.5 — 19/11/2026
- Bans et picks ratés détectés automatiquement (ban barré vide / pick « None » sur Drafter) : case ∅, l'outil passe tout de suite à l'étape suivante, et la case se remplit dès que l'échange est accepté sur Drafter. Bouton « Ban raté » retiré.

## v10.4 — 18/11/2026
- Bans ratés : le favori lit les emplacements fixes de Drafter ; un ban vide alors que la draft a continué devient « ∅ » et l'outil passe à l'étape suivante. Bouton « ∅ Ban raté » en saisie manuelle.

## v10.3 — 18/11/2026
- Le favori ouvre l'outil dans **une fenêtre à part** (2e écran) au lieu d'un panneau qui cachait un côté de Drafter ; petit badge de statut en bas à gauche de Drafter.
- Notre côté : choix manuel Blue/Red gardé pour la game > nom d'équipe > picks qui collent à nos pools (S/A) ; alerte « Quel est notre côté ? » si doute.

## v10.2 — 18/11/2026
- La synchro par onglets ne passe pas depuis claude.ai (lien entre fenêtres coupé). Nouveau favori : **l'outil s'ouvre en panneau dans la page Drafter** (`relay/overlay.js`), hébergé sur GitHub Pages, et reçoit la draft en direct.
- Version GitHub Pages : lit `team.json` (copie des tier lists, line-up, préparation, historique) mise à jour par Claude ; mode `?embed=1` compact.

## v10.1 — 18/11/2026
- Fin de série : « Nouvelle série » vide la préparation de l'adversaire (op.gg, bans de préparation) ; son op.gg est gardé dans l'Historique. Bouton « Effacer la préparation » dans Préparation.
- Statut Drafter en haut de l'outil : « Drafter connecté · draft remplie automatiquement » (vert) ou « déconnecté · saisie manuelle ».

## v10 — 18/11/2026
- **Drafter en direct** : favori « BBJ ➜ Drafter » (relais, `relay/relay.js`) qui lit picks et bans sur la page Drafter toutes les 0,5 s et les envoie à l'outil ouvert dans le même navigateur. Côté Blue/Red détecté via le nom d'équipe, adversaire repris, rôles devinés (tier lists), passage auto à la game suivante avec le fearless.
- Table des clés numériques Riot (bans Drafter).
- Outil renommé « BBJ Outil Draft » (ex-BBJ Draft Lab).

## v9.5
- Tier list ramenée à 20 % de l'affinité (était 35 % en v9.4, 15 % avant) ; champion absent de la tier list : −10 %.
- Critère Timing basé d'abord sur la position de pick du champion lui-même en pro (Orianna 78 → 92 au first pick Blue).
- Cases vides adverses : pool restant du joueur (op.gg) au lieu des prédictions de picks (jugées incorrectes en scrim).

## v9.4
- Tier lists du 17/11 de tous les joueurs comme référence ; Darius de Billy (joué top) et Malzahar de JH retirés.

## v9.3
- Historique : Blue/Red, type de série Scrim/Compétition, nom d'adversaire modifiable.

## v9.2
- Onglet **Historique** (séries archivées par « Nouvelle série »), boutons Victoire/Défaite par game. Première série : Scrim vs PickUp 2-1 (17/11).

## v9.1
- Double-clic qui confirme un champion (bug corrigé) ; tier lists Fayk et Léo à jour.

## v9 — données réelles
- Matchups solo Q **lolalytics Maître+ patch 26.22**, tous rôles (~3 700) + 861 matchups croisés bot (ADC vs support) ; anciennes données lolstats seulement en complément.
- **857 drafts pro 2026** (gol.gg : Worlds, ligues d'été, EWC) : ordre de pick par rôle (J → ADC → Sup → Mid → Top aux Worlds), position de pick par champion, 421 duos pro réels (≥ 8 games).

## v8.x
- Lignes de suggestions remplies sur toute la largeur, top à taille normale, survol limité à la bulle.
- Duos pro à confirmer pick par pick ; bonus de synergie quand un partenaire de duo est pické.
- Blind/counter recalculé : solidité face aux counters courants + position de pick pro relative au rôle + force méta.
- Notes selon le côté et le moment de la draft (first pick, picks 1-2 Red, exposition au dernier pick, dernier pick = counter) ; nouvelle échelle d'affichage (90+ = excellent).
- Rôle déjà pické en face = prioritaire ; botlane croisée ; prévisualisation de leurs picks (retirée en v9.5) ; bans de phase 2 = probabilité × danger, alertes « casserait votre compo ».
- Kog'Maw : les games solo Q ne comptent qu'au rôle réellement joué.

## v7
- 4 critères : affinité (games solo Q + scrims), méta (pro + solo Q), synergie, matchup/blind.
- Écran de draft sur une page : indicateur de tour, suggestions seulement à notre tour, Confirmer sous la grille.
- Analyse de fin de draft (chances de victoire, forces/faiblesses, plan de jeu) ; duos avérés ; synergies top-mid.

## v1 à v6
- Base de l'outil : règles de draft fearless BO3, line-up modifiable, pools et tier lists, préparation via multi-op.gg (analyse quotidienne planifiée), 7 bans prioritaires argumentés, counters par rôle, icônes des champions, base de données partagée de l'équipe.
