# Historique des versions — BBJ Outil Draft

Chaque version résume ce qui a été ajouté ou changé concrètement. Les points marqués « à revoir » sont des choix discutables à rediscuter en équipe.

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
