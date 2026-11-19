# Historique des versions — BBJ Outil Draft

Chaque version résume ce qui a été ajouté ou changé concrètement. Les points marqués « à revoir » sont des choix discutables à rediscuter en équipe.

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
