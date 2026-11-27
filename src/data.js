// ===== Base champions =====
// Nom;rôles (T J M A S, le 1er = principal);dégâts (AD AP MIX TK);early,scaling,teamfight,engage,peel,poke (0-3)
const CHAMP_RAW = `Aatrox;T;AD;3,1,2,1,0,1
Ahri;M;AP;2,2,2,1,0,1
Akali;M,T;AP;2,2,1,1,0,0
Akshan;M,A;AD;2,2,1,0,0,1
Alistar;S;TK;2,1,3,3,3,0
Ambessa;T,J,M;AD;3,1,2,2,0,0
Anivia;M;AP;1,3,3,1,2,2
Annie;M,S;AP;2,1,3,3,0,0
Aphelios;A;AD;1,3,3,0,0,1
Ashe;A,S;AD;2,2,3,2,1,2
Aurora;M,T;AP;2,2,2,1,0,1
Azir;M;AP;1,3,3,2,2,2
Bard;S;AP;2,2,2,2,2,1
Blitzcrank;S;TK;3,0,1,3,1,0
Braum;S;TK;2,1,2,1,3,0
Caitlyn;A;AD;3,1,1,0,0,3
Camille;T,S,J;AD;2,2,1,2,0,0
Cassiopeia;M,T;AP;2,3,3,1,1,1
Cho'Gath;T,J,M;TK;1,3,2,2,2,0
Corki;M,A;MIX;1,2,2,0,0,3
Darius;T,J;AD;3,1,2,1,0,0
Diana;J,M;AP;2,2,3,2,0,0
Dr. Mundo;T,J;TK;1,3,2,1,0,0
Draven;A;AD;3,1,1,0,0,0
Ekko;J,M;AP;2,2,2,1,0,0
Elise;J;AP;3,0,1,2,0,0
Ezreal;A;AD;2,2,1,0,0,3
Galio;M,S;AP;2,1,3,3,2,0
Gangplank;T;AD;1,3,2,0,0,2
Garen;T;AD;2,1,1,1,0,0
Gnar;T;AD;2,2,3,2,1,1
Gragas;T,J,S;AP;2,1,2,2,2,1
Graves;J;AD;3,1,1,0,0,0
Gwen;T,J;AP;1,3,2,1,0,0
Hwei;M,S;AP;1,2,3,1,1,3
Irelia;T,M;AD;3,2,2,2,0,0
Ivern;J;AP;1,2,2,1,3,0
Janna;S;AP;1,2,2,0,3,1
Jarvan IV;J;AD;3,1,3,3,0,0
Jax;T,J;MIX;2,3,2,2,0,0
Jayce;T,M;AD;3,1,1,0,0,3
Jhin;A;AD;2,1,2,1,0,2
Jinx;A;AD;1,3,3,0,0,1
K'Sante;T;TK;2,2,2,2,2,0
Kai'Sa;A;MIX;1,3,2,1,0,0
Kalista;A;AD;3,0,2,2,0,0
Karma;S,M;AP;3,1,2,0,2,2
Kassadin;M;AP;0,3,1,1,0,0
Kayle;T;AP;0,3,2,0,0,1
Kayn;J;AD;2,2,1,1,0,0
Kennen;T,M;AP;2,1,3,3,0,0
Kha'Zix;J;AD;2,2,1,0,0,0
Kindred;J;AD;2,3,1,0,0,0
Kled;T;AD;3,1,2,3,0,0
Kog'Maw;A,S;MIX;0,3,3,0,0,2
LeBlanc;M;AP;3,1,1,1,0,1
Lee Sin;J;AD;3,1,2,2,1,0
Leona;S;TK;3,1,3,3,1,0
Lillia;J;AP;1,2,3,2,0,0
Lissandra;M;AP;1,2,3,3,2,0
Lucian;A,M;AD;3,1,1,0,0,1
Lulu;S;AP;2,2,2,0,3,1
Lux;S,M;AP;1,2,2,1,2,3
Malphite;T,S,M;AP;1,2,3,3,1,0
Malzahar;M;AP;1,2,2,1,1,1
Maokai;J,S,T;TK;2,1,3,3,2,0
Mel;M,A;AP;2,2,2,0,1,2
Milio;S;AP;1,2,2,0,3,0
Miss Fortune;A;AD;2,1,3,0,0,2
Mordekaiser;T,J;AP;2,2,2,1,0,0
Morgana;S;AP;1,1,2,2,2,0
Naafiri;M;AD;3,1,1,1,0,0
Nami;S;AP;2,2,2,2,2,1
Nasus;T;AD;1,3,1,0,0,0
Nautilus;S;TK;3,1,3,3,1,0
Neeko;M,S;AP;2,2,3,3,0,1
Nidalee;J;AP;3,0,0,0,0,2
Nilah;A;AD;1,2,2,1,0,0
Nocturne;J;AD;2,2,2,3,0,0
Nunu;J;AP;2,1,2,2,1,0
Olaf;T,J;AD;3,1,2,1,0,0
Orianna;M;AP;1,2,3,2,2,1
Ornn;T;TK;1,3,3,3,1,0
Pantheon;J,T,S,M;AD;3,0,1,2,0,1
Poppy;S,T,J;TK;2,1,2,2,3,0
Pyke;S;AD;3,0,1,2,0,0
Qiyana;J,M;AD;3,1,3,2,0,0
Rakan;S;AP;2,1,3,3,1,0
Rammus;J;TK;2,1,2,3,1,0
Rek'Sai;J;AD;3,1,1,2,0,0
Rell;S;TK;2,1,3,3,1,0
Renata Glasc;S;AP;1,2,3,1,3,0
Renekton;T;AD;3,0,1,2,0,0
Rumble;T,M;AP;2,2,3,1,0,1
Ryze;M,T;AP;1,3,2,1,0,1
Samira;A;AD;2,2,2,1,0,0
Sejuani;J;TK;2,1,3,3,1,0
Senna;S,A;AD;1,3,1,0,1,2
Seraphine;S,M,A;AP;1,2,3,1,2,2
Sett;T,S;AD;3,1,2,2,0,0
Shaco;J,S;AD;3,0,0,0,0,0
Shen;T,S;TK;2,1,2,2,2,0
Shyvana;J;MIX;1,2,2,1,0,0
Sion;T;TK;1,2,2,3,1,0
Sivir;A;AD;1,2,2,1,0,1
Skarner;J,T;TK;2,1,2,3,1,0
Smolder;A,M;MIX;0,3,2,0,0,2
Sona;S;AP;1,3,3,1,2,1
Soraka;S;AP;1,2,1,0,3,1
Swain;S,M,T;AP;2,2,3,2,1,1
Sylas;M,J,T;AP;2,2,2,2,0,0
Syndra;M,A;AP;2,2,2,1,1,2
Tahm Kench;T,S;TK;2,1,1,1,3,0
Taliyah;M,J;AP;2,1,2,2,0,2
Talon;J,M;AD;3,1,1,0,0,0
Taric;S;AP;1,2,3,2,3,0
Thresh;S;AP;2,1,2,3,2,0
Tristana;A,M;AD;2,3,1,0,0,0
Trundle;J,T;AD;3,1,1,1,1,0
Tryndamere;T;AD;2,3,0,0,0,0
Twisted Fate;M;AP;1,2,2,2,0,0
Twitch;A;MIX;1,3,3,0,0,1
Udyr;J,T;MIX;2,2,1,1,0,0
Varus;A,M;MIX;2,2,2,2,0,3
Vayne;A,T;AD;0,3,1,0,0,0
Veigar;M,S;AP;0,3,2,2,1,1
Vex;M;AP;2,2,2,2,1,1
Vi;J;AD;3,1,2,3,0,0
Viego;J;AD;2,2,2,1,0,0
Viktor;M;AP;1,3,3,1,1,2
Vladimir;M,T;AP;0,3,3,1,0,0
Volibear;J,T;MIX;3,1,2,2,0,0
Wukong;J,T;AD;2,2,3,3,0,0
Xayah;A;AD;1,2,2,0,1,0
Xerath;S,M;AP;1,2,1,0,0,3
Xin Zhao;J;AD;3,1,2,2,0,0
Yasuo;M,T,A;AD;1,3,2,1,0,0
Yone;M,T;MIX;1,3,2,2,0,0
Yorick;T;AD;2,2,0,0,0,0
Yunara;A;AD;1,3,2,0,0,0
Yuumi;S;AP;0,3,2,0,3,0
Zaahen;T;AD;2,2,2,1,0,0
Zac;J,T;TK;2,1,3,3,1,0
Zed;M,J;AD;3,1,1,0,0,0
Zeri;A;AD;1,3,2,0,0,0
Ziggs;A,M;AP;1,2,2,0,0,3
Zilean;S,M;AP;1,2,2,0,3,1
Zyra;S;AP;2,1,2,1,1,2
Amumu;J,S;TK;1,2,3,3,1,0
Aurelion Sol;M,A;AP;0,3,2,1,0,2
Bel'Veth;J;AD;2,3,1,0,0,0
Brand;S,M,J;AP;2,1,3,0,0,2
Briar;J;AD;3,1,1,2,0,0
Evelynn;J;AP;2,2,1,0,0,0
Fiddlesticks;J,S;AP;1,2,3,3,0,0
Fiora;T;AD;2,3,0,0,0,0
Fizz;M;AP;2,2,1,1,0,0
Hecarim;J;AD;2,2,2,3,0,0
Heimerdinger;M,T,S;AP;2,1,2,0,1,2
Illaoi;T;AD;2,2,1,0,0,0
Karthus;J,M;AP;1,3,2,0,0,1
Katarina;M;AP;2,2,2,0,0,0
Locke;M;AD;2,2,1,1,0,0
Master Yi;J;AD;1,3,1,0,0,0
Quinn;T;AD;3,1,0,0,0,1
Rengar;J;AD;2,2,1,1,0,0
Riven;T;AD;2,2,1,1,0,0
Singed;T;AP;1,2,1,1,0,0
Teemo;T;AP;2,2,0,0,0,1
Urgot;T;AD;2,2,2,1,0,0
Vel'Koz;S,M;AP;1,2,2,0,0,3
Warwick;J,T;AD;3,1,1,2,0,0
Zoe;M;AP;2,2,1,0,0,3`;

// ===== Worlds 2026 (sources : gamerant.com, lolworlds2026.com, nov. 2026) =====
// picks = picks connus ; bans = bans connus (seulement le top 5 publié)

// ===== Votre équipe (Parthenon, captures du 16/11/2026) =====
const TEAM_SUMMARY = {games:69, wr:60.9, blue:[24,19], red:[18,8], gd15:775, duree:"30m42s"};
// champion:games:winrate%
// Parthenon (scrims juin-nov 2026, 72 games) + Drafter 19/11 : par champion, toute l'équipe
const STATS_RAW = `Corki:14:64|Ambessa:14:57|Nautilus:14:57|Tristana:11:82|Trundle:11:73|Ornn:11:64|Lee Sin:10:70|Darius:10:60|Syndra:10:30|Jinx:9:78|Garen:8:75|Lulu:8:50|Viktor:8:75|Olaf:8:62|Leona:7:57|Wukong:7:71|Anivia:7:71|Sion:7:43|Milio:7:71|Orianna:6:67|Jarvan IV:6:83|Swain:6:83|Sylas:6:83|Sivir:6:33|Vi:6:83|Blitzcrank:6:50|Kai'Sa:6:50|K'Sante:5:60|Skarner:5:60|Akali:5:60|Jhin:5:60|Annie:5:80|Ashe:4:50|Taliyah:4:50|Dr. Mundo:4:25|Ryze:4:75|Xayah:4:50|Ahri:4:75|Seraphine:4:100|Xin Zhao:4:75|Renekton:4:50|Kassadin:3:67|Yunara:3:0|Miss Fortune:3:67|Zaahen:3:33|Ezreal:3:67|Nunu:3:67|Kog'Maw:3:67|Karma:3:67|Zilean:3:33|Taric:2:100|Cho'Gath:2:50|Aurora:2:50|Yone:2:50|Zeri:2:100|Braum:2:50|Alistar:2:50|Malphite:2:0|Aatrox:2:100|Rakan:2:50|Galio:2:50|Maokai:2:50|Nocturne:2:100|Pantheon:2:50|Mordekaiser:2:0|Vex:1:0|Sejuani:1:0|Yuumi:1:100|Jax:1:100|Cassiopeia:1:0|Bard:1:100|Thresh:1:0|Mel:1:100|Kalista:1:100|Sett:1:0|LeBlanc:1:100|Volibear:1:0|Soraka:1:0|Lucian:1:100|Caitlyn:1:0|Sona:1:100|Shyvana:1:0|Nami:1:100|Rek'Sai:1:0|Poppy:1:0|Diana:1:0|Vayne:1:0|Elise:1:0|Malzahar:1:0|Viego:1:0|Azir:1:0|Morgana:1:0|Shaco:1:0`;
// Par joueur et par rôle : joueur|rôle|champion|games|victoires
const TEAM_P_RAW = `Bastien|A|Ashe|3|2;Bastien|A|Caitlyn|1|0;Bastien|A|Corki|13|8;Bastien|A|Ezreal|3|2;Bastien|A|Jhin|5|3;Bastien|A|Jinx|9|7;Bastien|A|Kai'Sa|6|3;Bastien|A|Kalista|1|1;Bastien|A|Lucian|1|1;Bastien|A|Miss Fortune|1|1;Bastien|A|Sivir|5|2;Bastien|A|Syndra|2|1;Bastien|A|Tristana|10|8;Bastien|A|Vayne|1|0;Bastien|A|Xayah|4|2;Bastien|A|Yunara|3|0;Bastien|A|Zeri|2|2;Fabien|J|Ambessa|2|1;Fabien|J|Cho'Gath|2|1;Fabien|J|Diana|1|0;Fabien|J|Dr. Mundo|1|1;Fabien|J|Elise|1|0;Fabien|J|Jarvan IV|6|5;Fabien|J|Lee Sin|10|7;Fabien|J|Maokai|2|1;Fabien|J|Mordekaiser|1|0;Fabien|J|Nocturne|2|2;Fabien|J|Nunu|3|2;Fabien|J|Pantheon|2|1;Fabien|J|Rek'Sai|1|0;Fabien|J|Sejuani|1|0;Fabien|J|Shaco|1|0;Fabien|J|Shyvana|1|0;Fabien|J|Sion|5|2;Fabien|J|Skarner|5|3;Fabien|J|Sylas|2|1;Fabien|J|Trundle|1|1;Fabien|J|Vi|6|5;Fabien|J|Viego|1|0;Fabien|J|Volibear|1|0;Fabien|J|Wukong|7|5;Fabien|J|Xin Zhao|4|3;Fabien|S|Bard|1|1;Fabien|S|Rakan|1|1;Fabien|S|Thresh|1|0;Romain|J|Darius|2|2;Romain|J|Dr. Mundo|1|0;Romain|J|Malphite|1|0;Romain|J|Ornn|1|1;Romain|J|Trundle|1|1;Romain|T|Ambessa|8|5;Romain|T|Darius|8|4;Romain|T|Dr. Mundo|2|0;Romain|T|Garen|8|6;Romain|T|K'Sante|4|2;Romain|T|Malphite|1|0;Romain|T|Mordekaiser|1|0;Romain|T|Olaf|7|4;Romain|T|Ornn|10|6;Romain|T|Sett|1|0;Romain|T|Sion|2|1;Romain|T|Trundle|9|6;Romain|T|Zaahen|1|0;JH|M|Ahri|4|3;JH|M|Akali|5|3;JH|M|Ambessa|2|0;JH|M|Anivia|7|5;JH|M|Annie|5|4;JH|M|Aurora|2|1;JH|M|Azir|1|0;JH|M|Cassiopeia|1|0;JH|M|Galio|2|1;JH|M|Kassadin|3|2;JH|M|LeBlanc|1|1;JH|M|Malzahar|1|0;JH|M|Mel|1|1;JH|M|Orianna|6|4;JH|M|Renekton|1|0;JH|M|Ryze|4|3;JH|M|Swain|2|2;JH|M|Sylas|4|4;JH|M|Syndra|8|2;JH|M|Taliyah|4|2;JH|M|Tristana|1|1;JH|M|Vex|1|0;JH|M|Viktor|8|6;JH|M|Yone|1|0;Léo|S|Alistar|2|1;Léo|S|Blitzcrank|6|3;Léo|S|Braum|2|1;Léo|S|Karma|1|1;Léo|S|Kog'Maw|3|2;Léo|S|Leona|5|4;Léo|S|Lulu|8|4;Léo|S|Milio|5|4;Léo|S|Morgana|1|0;Léo|S|Nautilus|10|8;Léo|S|Poppy|1|0;Léo|S|Rakan|1|0;Léo|S|Seraphine|4|4;Léo|S|Sona|1|1;Léo|S|Soraka|1|0;Léo|S|Swain|4|3;Léo|S|Taric|2|2;Léo|S|Yuumi|1|1;Léo|S|Zilean|2|0;Yeyozz|T|Aatrox|1|1;Yeyozz|T|Ambessa|1|1;Yeyozz|T|Jax|1|1;Yeyozz|T|K'Sante|1|1;Yeyozz|T|Renekton|1|0;Yeyozz|T|Yone|1|1;Yeyozz|T|Zaahen|2|1`;
// Fiches scrim/compétition — base Parthenon (jusqu'au 17/11/2026) : joueur → rôle → champion : [games, victoires, K, D, A (totaux), somme des % dégâts, somme GD@15, games avec GD@15, somme écart de CS avec son vis-à-vis, games avec écart de CS]
// Les séries suivantes (historique de l'outil, bouton Fin de série) s'y ajoutent automatiquement.
const TEAM_STATS_BASE = {"Romain":{"T":{"Garen":[8,6,58,42,43,1.892,11194,8,71,8],"Trundle":[8,5,29,45,41,1.547,9326,8,46,8],"Darius":[7,4,37,36,36,1.253,2869,7,157,7],"Ornn":[10,6,15,35,102,1.868,-1907,10,-283,10],"K'Sante":[4,2,11,19,22,0.615,3288,4,37,4],"Sion":[2,1,2,4,8,0.301,-1391,2,-44,2],"Ambessa":[8,5,27,37,43,1.725,6686,8,-54,8],"Olaf":[6,4,24,24,31,1.204,11465,6,72,6],"Sett":[1,0,3,6,4,0.158,4013,1,-3,1],"Zaahen":[1,0,1,10,9,0.156,-3027,1,-13,1],"Malphite":[1,0,0,5,1,0.184,310,1,-70,1],"Dr. Mundo":[2,0,11,7,10,0.572,2870,2,-24,2],"Mordekaiser":[1,0,7,7,8,0.279,789,1,23,1]},"J":{"Darius":[2,2,20,8,19,0.366,6540,2,54,2],"Ornn":[1,1,2,2,18,0.084,177,1,-18,1],"Dr. Mundo":[1,0,4,10,9,0.215,-323,1,-54,1],"Trundle":[1,1,6,3,10,0.15,-1192,1,-24,1],"Malphite":[1,0,4,3,7,0.179,-3978,1,-35,1]}},"Fabien":{"J":{"Lee Sin":[9,7,41,44,88,1.403,16680,9,277,9],"Cho'Gath":[2,1,9,9,8,0.364,-4488,2,10,2],"Jarvan IV":[5,4,30,26,67,0.932,4181,5,49,5],"Wukong":[7,5,51,26,69,1.515,16572,7,107,7],"Sejuani":[1,0,6,4,3,0.191,-1578,1,-75,1],"Vi":[5,5,39,24,48,0.902,15993,5,155,5],"Skarner":[5,3,22,19,45,0.968,-2015,5,-92,5],"Sion":[5,2,27,24,42,1.044,-1251,5,30,5],"Nunu":[3,2,12,17,46,0.339,5328,3,1,3],"Xin Zhao":[4,3,21,24,43,0.791,774,4,-40,4],"Trundle":[1,1,4,7,17,0.153,82,1,53,1],"Ambessa":[2,1,11,11,16,0.353,8707,2,-16,2],"Volibear":[1,0,7,8,6,0.24,1377,1,-7,1],"Sylas":[2,1,14,9,14,0.364,-1151,2,29,2],"Maokai":[2,1,6,13,19,0.423,340,2,-59,2],"Dr. Mundo":[1,1,7,1,13,0.282,2522,1,41,1],"Shyvana":[1,0,3,11,11,0.157,966,1,28,1],"Nocturne":[2,2,12,7,17,0.363,3012,2,76,2],"Pantheon":[2,1,15,17,17,0.465,-3009,2,58,2],"Rek'Sai":[1,0,4,7,5,0.211,-880,1,-72,1],"Mordekaiser":[1,0,2,6,4,0.135,1265,1,59,1],"Diana":[1,0,1,10,11,0.152,-3525,1,68,1],"Elise":[1,0,12,9,8,0.221,789,1,18,1],"Viego":[1,0,7,8,4,0.22,-6814,1,-10,1],"Shaco":[1,0,15,6,14,0.278,1242,1,7,1]},"S":{"Bard":[1,1,2,6,14,0.122,-1192,1,-14,1],"Thresh":[1,0,0,10,10,0.082,-3978,1,6,1],"Rakan":[1,1,0,4,26,0.078,1925,1,-15,1]}},"JH":{"M":{"Kassadin":[3,2,20,12,25,0.808,7150,3,-29,3],"Orianna":[6,4,30,16,68,1.438,5923,6,-96,6],"Viktor":[8,6,54,17,56,2.311,12052,8,154,8],"Vex":[1,0,4,6,7,0.229,-67,1,-11,1],"Sylas":[4,4,31,4,35,0.849,11096,4,13,4],"Aurora":[2,1,10,3,17,0.626,-3448,2,-40,2],"Syndra":[7,2,35,32,46,1.713,11100,7,-10,7],"Taliyah":[4,2,21,24,56,1.108,-4643,4,-148,4],"Anivia":[7,5,29,22,62,1.263,11198,7,-82,7],"Ryze":[4,3,27,15,38,0.82,6844,4,42,4],"Ahri":[4,3,22,13,33,0.933,1442,4,-19,4],"Cassiopeia":[1,0,4,4,10,0.249,-1876,1,-36,1],"Akali":[4,3,21,11,26,0.802,3166,4,-57,4],"Yone":[1,0,3,7,6,0.21,-3978,1,-16,1],"Mel":[1,1,12,2,11,0.265,1925,1,2,1],"Annie":[5,4,23,18,60,1.082,-419,5,-80,5],"Swain":[1,1,9,0,10,0.234,1098,1,-37,1],"Galio":[2,1,3,7,18,0.356,2337,2,4,2],"LeBlanc":[1,1,1,1,10,0.184,3375,1,-15,1],"Renekton":[1,0,6,4,6,0.222,-3626,1,-20,1],"Tristana":[1,1,3,6,8,0.16,1570,1,-51,1],"Ambessa":[2,0,3,13,21,0.314,-2736,2,-106,2],"Malzahar":[1,0,4,8,13,0.195,1904,1,75,1],"Azir":[1,0,0,5,3,0.192,-5044,1,-67,1]}},"Bastien":{"A":{"Tristana":[9,7,86,45,75,2.812,14878,9,58,9],"Yunara":[2,0,2,11,6,0.537,-7945,2,-5,2],"Corki":[12,8,92,54,78,2.94,20110,12,78,12],"Ashe":[3,2,14,9,17,0.8,-690,3,-74,3],"Zeri":[2,2,17,10,17,0.501,3575,2,27,2],"Miss Fortune":[1,1,20,5,4,0.315,177,1,24,1],"Sivir":[5,2,30,22,29,1.366,6789,5,49,5],"Xayah":[4,2,40,22,33,1.327,-1886,4,84,4],"Ezreal":[3,2,18,9,22,0.913,1094,3,3,3],"Jinx":[9,7,78,30,61,2.978,3247,9,170,9],"Jhin":[5,3,34,19,49,1.213,6714,5,26,5],"Kai'Sa":[6,3,69,26,36,1.923,8018,6,212,6],"Kalista":[1,1,12,2,9,0.321,1098,1,-15,1],"Syndra":[2,1,8,7,11,0.357,4201,2,7,2],"Lucian":[1,1,5,3,8,0.16,-1870,1,-15,1],"Caitlyn":[1,0,9,6,6,0.281,-3626,1,38,1],"Vayne":[1,0,17,3,4,0.304,-3525,1,48,1]}},"Léo":{"S":{"Taric":[2,2,3,11,42,0.111,7837,2,-5,2],"Lulu":[7,4,5,32,102,0.544,-3014,7,-13,7],"Leona":[4,4,8,22,78,0.357,7367,4,33,4],"Swain":[4,3,5,18,63,0.61,11419,4,36,4],"Yuumi":[1,1,5,0,23,0.116,4615,1,-17,1],"Braum":[2,1,1,12,17,0.18,-2697,2,6,2],"Blitzcrank":[6,3,7,38,77,0.589,5795,6,14,6],"Milio":[5,4,2,13,73,0.256,3179,5,9,5],"Alistar":[2,1,1,11,30,0.117,646,2,6,2],"Seraphine":[4,4,8,11,80,0.492,8341,4,7,4],"Kog'Maw":[3,2,9,18,35,0.608,6004,3,36,3],"Karma":[1,1,4,3,23,0.105,3963,1,-1,1],"Nautilus":[9,7,20,61,144,0.831,16621,9,-50,9],"Zilean":[2,0,1,8,17,0.19,499,2,27,2],"Soraka":[1,0,1,7,9,0.06,1377,1,19,1],"Sona":[1,1,0,5,19,0.094,1570,1,-3,1],"Rakan":[1,0,0,7,4,0.059,-880,1,27,1],"Poppy":[1,0,0,9,4,0.092,-1230,1,1,1],"Morgana":[1,0,0,6,11,0.118,-1442,1,0,1]}},"Yeyozz":{"T":{"Yone":[1,1,7,6,2,0.186,4615,1,34,1],"Jax":[1,1,11,7,7,0.313,177,1,-16,1],"Zaahen":[2,1,14,11,9,0.508,1060,2,10,2],"Ambessa":[1,1,9,1,7,0.27,-1192,1,63,1],"Renekton":[1,0,3,5,2,0.2,-3978,1,-4,1],"Aatrox":[1,1,5,2,7,0.254,1925,1,89,1],"K'Sante":[1,1,1,5,6,0.174,-2374,1,22,1]}}};
const TEAM_STATS_UNTIL = "2026-11-17";
// Moyennes par rôle (toutes les games, les deux équipes) : [KDA, part des dégâts]
const ROLE_AVG = {"T": [3.09, 0.205], "J": [4.31, 0.187], "M": [6.43, 0.23], "A": [5.4, 0.282], "S": [5.19, 0.097]};
// Duos de l'équipe (≥ 3 games) : rôles|A+B|games|victoires
const TEAM_DUO_RAW = `AS|Corki+Leona|3|1;AS|Corki+Nautilus|3|2;AS|Corki+Swain|3|2;AS|Jinx+Lulu|3|2;AS|Jinx+Milio|4|3;AS|Kai'Sa+Nautilus|4|2;AS|Tristana+Nautilus|4|3;AS|Yunara+Lulu|3|0;JS|Jarvan IV+Nautilus|3|3;JS|Skarner+Milio|4|2;TJ|Darius+Sion|3|1`;

// Tier lists (confiance) — S > A > B > C > D
const TIERS_RAW = { // tier lists à jour du 17/11 (confiance actuelle des joueurs)
  T: {S:"Darius,Garen,Ornn", A:"Dr. Mundo,Malphite,Olaf,Sett,Sion,Trundle,Zaahen", B:"Aatrox,Ambessa,Cho'Gath,Gwen,Jax,K'Sante,Mordekaiser,Poppy,Renekton", C:"Nasus,Sylas,Tahm Kench,Tryndamere", D:"Gragas,Shen"},
  J: {S:"Jarvan IV,Nocturne,Pantheon,Shaco,Viego,Xin Zhao", A:"Dr. Mundo,Skarner,Volibear,Wukong", B:"Diana,Kha'Zix,Lee Sin,Nunu,Rammus,Sejuani,Sion,Sylas,Vi,Zac", C:"Aatrox,Ambessa,Kayn,Malphite,Maokai,Mordekaiser", D:"Elise,Qiyana,Rek'Sai,Shyvana,Talon,Udyr"},
  M: {S:"Ahri,Kassadin,Orianna,Ryze,Syndra,Viktor", A:"Akali,Anivia,Annie,Aurora,Galio,Sylas,Twisted Fate,Yone", B:"Azir,Cassiopeia,LeBlanc,Lissandra,Mel,Swain,Taliyah,Vladimir,Zed", C:"Ambessa,Diana,Naafiri,Renekton,Vex", D:""},
  A: {S:"Corki,Tristana", A:"Ashe,Ezreal,Jhin,Jinx,Kai'Sa,Sivir,Xayah", B:"Caitlyn,Kalista,Lucian,Miss Fortune,Smolder,Syndra,Vayne,Yunara,Zeri,Ziggs", C:"Kog'Maw,Mel,Samira,Senna,Seraphine,Twitch,Varus", D:"Aphelios,Draven,Nilah"},
  S: {S:"Lulu,Nautilus,Zilean", A:"Blitzcrank,Braum,Milio,Morgana,Nami,Seraphine,Soraka,Xerath,Yuumi", B:"Ashe,Galio,Karma,Kog'Maw,Leona,Poppy,Sona,Swain,Taric", C:"Alistar,Pyke,Rakan,Renata Glasc,Thresh", D:""},
  // Bounty (coach, remplaçant support) : tier list tirée de son op.gg (saison 2026, volume + winrate au support)
  SUB_S: {S:"Soraka,Leona,Taric,Milio", A:"Sona,Thresh,Braum,Karma,Renata Glasc,Rakan,Swain", B:"Morgana,Yuumi,Seraphine,Blitzcrank,Nami,Lulu,Vel'Koz", C:"Alistar,Zilean,Pyke,Nautilus,Senna", D:""},
  // Yeyozz (remplaçant top) : tier list tirée de son op.gg (2026 + 2025)
  SUB: {S:"Jax,Darius,Aatrox", A:"Zaahen,Ambessa,K'Sante,Olaf", B:"Mordekaiser,Renekton,Yone,Dr. Mundo", C:"Sett,Urgot,Nasus,Camille", D:""},
};

// Joueurs : rôle principal + tier list (clé = rôle d'origine dans TIERS_RAW)
const PLAYERS = [
  {id:"Romain", main:"T", tl:"T"}, {id:"Fabien", main:"J", tl:"J"}, {id:"JH", main:"M", tl:"M"},
  {id:"Bastien", main:"A", tl:"A"}, {id:"Léo", main:"S", tl:"S"}, {id:"Yeyozz", main:"T", tl:"SUB", sub:true},
  {id:"Bounty", main:"S", tl:"SUB_S", sub:true}
];
const ROLE_NAMES = {T:"Top", J:"Jungle", M:"Mid", A:"ADC", S:"Support"};

// ===== Patch à venir (26.23, preview du 11/11 : sortie ~18/11) — les données OP.GG couvrent déjà 26.21 et 26.22 =====
// Patch 26.23 (sorti le 18/11) : notes officielles. Données de jeu encore en 26.22 (trop peu de games sur 26.23) → léger ajustement des champions modifiés
// Patchs sortis depuis les dernières games pro (Worlds 2026 = patch 26.20) : buffs / nerfs à appliquer au score pro
const PATCHES_SINCE_PRO = [
  {v:"26.21", buff:"Azir,Darius,Miss Fortune,Nunu & Willump,Orianna,Ryze,Sion,Taliyah,Vel'Koz,Xin Zhao,Zyra", nerf:"Caitlyn,Jinx,Lee Sin,Nidalee,Qiyana,Rammus,Tristana,Viktor,Wukong,Yone"},
  {v:"26.22", buff:"Aurelion Sol,Corki,Kayle,Maokai,Naafiri,Rumble,Shen,Smolder,Viktor,Zaahen", nerf:"Locke,Thresh,Yasuo"},
  {v:"26.23", buff:"Annie,Azir,Bard,Ezreal,Galio,Gnar,K'Sante,Mel,Vi", nerf:"LeBlanc,Master Yi,Syndra"}
];
// Évolution réelle en solo Q depuis les Worlds : LoLalytics Maître+, écart au winrate moyen, patch 26.20 → 26.23 (relevé du 27/11/2026)
// rôle|champion:Δ points de winrate:games au 26.23 — mesure ce que les buffs/nerfs ont vraiment changé (ex. Viktor mid : nerf puis buff, encore -0.9)
const SINCE_PRO_WR_RAW="T|Darius:1.2:19377;T|Gangplank:0.6:15722;T|Fiora:0.2:16221;T|Camille:0.8:20174;T|Galio:1.8:1947;T|Akali:0.5:12339;T|Yone:-0.0:22999;T|Cho'Gath:0.3:8609;T|Zed:-0.5:3176;T|Quinn:-0.3:3385;T|Singed:0.3:8305;T|Tryndamere:-0.3:8810;T|Pantheon:-0.5:12821;T|Jayce:0.9:24460;T|Riven:0.3:8320;T|Irelia:0.0:16516;T|Aurora:0.1:3213;T|Ekko:-0.8:1515;T|Gwen:0.3:10506;T|Poppy:0.4:3614;T|Gragas:-0.3:9340;T|Kayle:0.7:7622;T|Kennen:0.9:7771;T|Wukong:1.6:2866;T|Shen:0.2:11918;T|Urgot:1.4:7113;T|Zaahen:-0.8:12226;T|Cassiopeia:0.6:2268;T|Warwick:0.7:4359;T|Garen:-0.5:14764;T|Aatrox:0.2:20432;T|Olaf:-1.1:14192;T|Jax:0.4:22799;T|Ornn:-0.2:14444;T|Kled:0.8:6607;T|Mordekaiser:-0.1:10981;T|Ambessa:-0.2:18943;T|Swain:1.1:1807;T|Renekton:0.8:21126;T|Zac:-0.9:1980;T|Sylas:0.2:4463;T|Vladimir:-0.5:4663;T|Yasuo:-2.4:9640;T|Teemo:-0.4:7204;T|Lissandra:-0.4:2264;T|Dr. Mundo:-0.7:11362;T|Sion:0.0:13019;T|Anivia:-2.0:3549;T|Volibear:1.5:8674;T|Malphite:-0.7:21605;T|Nasus:-0.6:7684;T|Udyr:1.1:2218;T|Trundle:0.6:3573;T|Illaoi:-0.3:5957;T|Sett:0.4:10726;T|Tahm Kench:-1.7:3346;T|Gnar:0.0:16764;T|Ryze:2.2:1995;T|Heimerdinger:-1.1:2902;T|Vayne:0.6:6188;T|Maokai:-1.7:1657;T|K'Sante:-0.5:19326;T|Corki:-0.3:1536;T|Rumble:-2.7:6614;T|Yorick:-0.8:5768;T|Varus:-2.2:1619;J|Hecarim:1.0:22466;J|Ekko:1.0:14247;J|Kindred:0.6:10535;J|Darius:1.9:2966;J|Zyra:0.4:8309;J|Nidalee:-0.4:13405;J|Kha'Zix:0.3:20808;J|Talon:0.1:21667;J|Zac:0.6:8797;J|Shaco:0.5:11386;J|Taliyah:-0.9:15194;J|Lillia:1.1:13557;J|Viego:1.5:23866;J|Elise:1.6:11500;J|Cho'Gath:1.0:13470;J|Nunu & Willump:0.5:7335;J|Graves:0.7:27057;J|Jarvan IV:1.0:29233;J|Rek'Sai:-0.6:7137;J|Wukong:-0.7:19612;J|Lee Sin:-0.4:48542;J|Zaahen:1.5:4121;J|Shyvana:2.4:8450;J|Bel'Veth:0.6:8802;J|Ivern:-0.8:4664;J|Master Yi:-1.4:13075;J|Udyr:0.9:5227;J|Rengar:0.2:14423;J|Gragas:-1.3:2851;J|Kayn:-0.1:15157;J|Sylas:0.3:20255;J|Skarner:-0.7:4757;J|Qiyana:-2.3:23854;J|Briar:0.7:8080;J|Fizz:1.5:1810;J|Quinn:0.7:2461;J|Aatrox:0.4:4041;J|Maokai:2.9:1652;J|Diana:0.1:9628;J|Xin Zhao:1.8:9610;J|Jax:2.6:1584;J|Karthus:-0.0:5902;J|Naafiri:0.3:16908;J|Amumu:0.0:2875;J|Gwen:0.4:3939;J|Vi:0.6:16507;J|Dr. Mundo:2.3:4373;J|Rammus:-0.9:2833;J|Evelynn:-0.9:8451;J|Fiddlesticks:-0.7:5469;J|Sejuani:-0.9:5433;J|Locke:-0.0:2963;J|Zed:-0.4:7476;J|Jayce:-1.5:17688;J|Warwick:-0.2:4164;J|Trundle:-4.4:1943;J|Pantheon:1.9:3498;J|Ambessa:-0.3:4136;J|Nocturne:-0.7:10145;M|Ekko:0.5:18676;M|Ahri:-0.1:34402;M|Katarina:0.2:19738;M|Hwei:0.4:12343;M|Vladimir:0.5:11763;M|Twisted Fate:-0.4:27168;M|Locke:-0.7:20341;M|Galio:1.0:20058;M|Taliyah:1.7:12427;M|Yone:-0.7:23018;M|Vel'Koz:1.4:4275;M|Zoe:-0.2:11822;M|Aurora:0.3:10725;M|Talon:0.8:6450;M|Riven:3.1:3060;M|Aurelion Sol:1.2:5749;M|Annie:2.4:9372;M|Qiyana:-2.0:7788;M|Akali:0.3:24233;M|Zed:-0.4:23792;M|LeBlanc:-0.9:16151;M|Jayce:0.8:3412;M|Kassadin:0.2:13870;M|Yasuo:-0.6:21810;M|Akshan:0.3:9864;M|Gragas:-0.9:1816;M|Xerath:-0.4:12417;M|Fizz:0.2:11091;M|Garen:3.1:1815;M|Viktor:-0.9:26247;M|Pantheon:-0.7:3242;M|Sylas:1.0:23138;M|Syndra:-1.8:27312;M|Lissandra:-0.2:17292;M|Kog'Maw:2.4:2071;M|Gwen:-1.2:1700;M|Ambessa:1.9:1601;M|Lux:-1.5:10180;M|Swain:0.7:2679;M|Vex:-0.8:7263;M|Irelia:1.1:7750;M|Diana:-1.0:9328;M|Veigar:0.7:6780;M|Orianna:1.7:18863;M|Neeko:0.2:1802;M|Anivia:-0.1:8045;M|Tristana:0.9:2632;M|Kayle:0.9:2477;M|Sion:1.4:2280;M|Malzahar:-0.7:9682;M|Cassiopeia:-1.8:6185;M|Nasus:-1.4:1812;M|Ziggs:0.0:1811;M|Cho'Gath:-2.1:1551;M|Ryze:1.6:6541;M|Malphite:-1.4:1702;A|Zeri:0.5:20815;A|Katarina:1.8:3257;A|Hwei:0.3:4480;A|Vel'Koz:2.2:5626;A|Aurelion Sol:2.5:3606;A|Jinx:-1.5:25579;A|Xayah:-0.3:30389;A|Twitch:0.5:14404;A|Yasuo:-0.2:6743;A|Yunara:0.1:40491;A|Kai'Sa:-0.3:72231;A|Corki:1.3:27987;A|Aphelios:0.3:21319;A|Viktor:-0.4:5911;A|Kalista:0.3:17460;A|Karthus:-0.7:3841;A|Samira:1.1:8255;A|Veigar:1.0:3311;A|Jhin:-0.2:66100;A|Draven:0.5:13619;A|Tristana:-1.4:15605;A|Kog'Maw:0.1:7875;A|Sivir:0.3:14848;A|Swain:-0.8:4400;A|Syndra:-1.1:3910;A|Brand:-0.6:1529;A|Nilah:0.1:2798;A|Vladimir:-0.7:2362;A|Lux:0.4:3824;A|Xerath:-0.6:2928;A|Ezreal:1.2:69933;A|Lucian:-0.1:25935;A|Cassiopeia:-0.5:1777;A|Ashe:1.0:14274;A|Seraphine:0.7:2745;A|Caitlyn:-0.6:24702;A|Ziggs:-1.3:8721;A|Varus:2.5:10094;A|Mel:3.6:5328;A|Miss Fortune:1.3:15700;A|Smolder:2.3:11767;A|Vayne:1.1:7300;S|Rell:-0.3:18687;S|Thresh:-0.8:41112;S|Galio:1.3:4351;S|Alistar:-0.6:31291;S|Zilean:0.1:10635;S|Janna:-0.2:18777;S|Blitzcrank:-0.6:25993;S|Lulu:0.3:44183;S|Nami:0.1:35891;S|Senna:-0.0:18094;S|Pyke:0.7:18624;S|Sona:0.4:19698;S|Taric:0.3:4228;S|LeBlanc:0.6:2083;S|Zyra:1.8:5204;S|Hwei:-2.0:1718;S|Vel'Koz:-0.4:8760;S|Maokai:1.0:5603;S|Rakan:-0.6:20825;S|Soraka:0.5:14518;S|Nautilus:-0.1:42339;S|Leona:-0.7:26080;S|Bard:0.4:20535;S|Seraphine:0.5:18555;S|Poppy:-0.5:6303;S|Karma:-0.1:32831;S|Braum:0.3:17245;S|Elise:-0.7:4171;S|Amumu:-0.1:2176;S|Swain:-0.0:6013;S|Milio:0.0:17029;S|Lux:-0.6:10605;S|Pantheon:-0.1:9694;S|Neeko:1.0:7738;S|Morgana:0.8:7622;S|Renata Glasc:-0.2:7844;S|Brand:0.3:3049;S|Anivia:1.4:1563;S|Zoe:-0.1:3610;S|Tahm Kench:-0.4:4268;S|Sylas:-0.4:3878;S|Shen:3.6:1864;S|Camille:1.6:5458;S|Yuumi:1.2:15763;S|Xerath:-1.0:4944;S|Shaco:-0.4:2561";
// Patch suivant (anticipation) : 26.24 le 09/12/2026, d'après le PBE (rien de définitif). Les changements du 26.23 sont déjà dans les stats OP.GG.
const PATCH_NEXT = {v:"26.24", buff:"Akshan", nerf:""};
// ===== Synergies botlane (Master+, patch 26.21, lolstats.gg) : ADC/Support/games/synergie % =====
const BOT_SYN_RAW = `Yunara/Lulu/1506/+1.8;Kai'Sa/Nautilus/1256/-1.7;Ezreal/Karma/1029/-2.5;Lucian/Milio/866/+0.1;Ezreal/Bard/678/+1.5;Jhin/Bard/663/+1.6;Kai'Sa/Rell/605/+2.8;Caitlyn/Bard/587/+1.1;Ashe/Seraphine/524/+1.1;Zeri/Lulu/498/+6.6;Kai'Sa/Pyke/494/-2.4;Kai'Sa/Alistar/477/+2.2;Kalista/Renata Glasc/471/+1.4;Jinx/Thresh/468/+2.0;Kai'Sa/Camille/448/+2.6;Jhin/Nautilus/446/-0.4;Kai'Sa/Thresh/444/-0.3;Jinx/Lulu/443/-3.3;Jhin/Karma/439/+4.2;Xayah/Rakan/426/+6.1;Tristana/Nautilus/419/+1.1;Lucian/Nami/407/+0.5;Ezreal/Leona/404/+1.1;Kai'Sa/Leona/393/+2.2;Caitlyn/Lux/392/-0.1;Aphelios/Thresh/387/-0.7;Ezreal/Camille/365/+0.2;Ziggs/Camille/361/+3.8;Caitlyn/Karma/348/-2.6;Kai'Sa/Blitzcrank/347/+4.0;Ezreal/Nautilus/345/-2.5;Tristana/Lulu/343/-0.6;Yunara/Nautilus/338/+0.1;Jhin/Camille/332/+2.2;Zeri/Yuumi/327/+0.2;Jhin/Alistar/322/+2.7;Syndra/Camille/313/+5.9;Viktor/Bard/299/-2.3;Viktor/Camille/295/+1.7;Jhin/Leona/293/-0.6;Kai'Sa/Rakan/286/-6.9;Ezreal/Rell/284/-7.4;Viktor/Nautilus/280/-6.2;Syndra/Nautilus/274/-4.0;Ezreal/Alistar/273/-2.8;Kai'Sa/Bard/271/-2.3;Kai'Sa/Shen/266/-1.3;Jhin/Rell/266/-4.1;Ezreal/Janna/263/-1.0;Samira/Nautilus/262/+2.2;Jhin/Thresh/261/-0.3;Tristana/Thresh/258/+4.0;Caitlyn/Thresh/251/+3.2;Twitch/Lulu/251/-6.2;Ezreal/Pyke/250/+3.6;Kai'Sa/Pantheon/243/-4.4;Yunara/Braum/242/+1.5;Jhin/Janna/241/-0.4;Jhin/Shen/240/-7.4;Draven/Nautilus/238/+4.5;Kai'Sa/Neeko/235/+4.3;Tristana/Leona/233/-4.3;Ezreal/Thresh/233/-0.3;Kog'Maw/Lulu/231/+2.4;Tristana/Rell/225/-0.4;Yunara/Rell/224/+5.8;Lucian/Braum/223/+2.7;Yunara/Thresh/218/-0.8;Viktor/Rell/217/-1.9;Kai'Sa/Poppy/216/-1.3;Ezreal/Seraphine/216/+4.1;Yunara/Alistar/215/+0.4;Jinx/Milio/214/-2.4;Jhin/Pyke/211/-6.7;Kalista/Nautilus/210/+0.4;Ezreal/Nami/203/-5.2;Tristana/Pyke/203/+6.6;Jinx/Nautilus/202/+2.5;Jhin/Senna/200/+5.9;Syndra/Bard/199/+3.4;Kai'Sa/Janna/197/-2.5;Viktor/Nami/196/+3.6;Ezreal/Senna/195/+3.0;Syndra/Pyke/194/-0.3;Caitlyn/Nautilus/192/+1.2;Tristana/Alistar/191/+3.8;Draven/Thresh/191/-1.0;Ezreal/Shen/190/+0.2;Viktor/Alistar/189/+3.4;Syndra/Rell/188/+5.3;Ezreal/Rakan/186/+0.1;Kai'Sa/Braum/184/-2.5;Miss Fortune/Rell/184/+0.4;Tristana/Camille/184/-2.7;Kalista/Thresh/183/+4.6;Zeri/Nautilus/182/+8.1;Aphelios/Lulu/182/-0.7;Syndra/Alistar/181/+4.9;Viktor/Pyke/181/+4.8;Xerath/Camille/179/-0.2`;
// Synergies d'équipe vues en pro / connues (hors botlane), valeur en % équivalent
// Duos avérés vus en pro depuis plusieurs mois (à compléter)
// Duos joués en pro. Un duo n'est proposé que si ses deux champions sont réellement présents dans les games pro récentes (≥ 40 picks, voir PRO_DUO_MIN).
const PROVEN_DUOS = [["Kalista","Renata Glasc"],["Yunara","Lulu"],["Orianna","Nocturne"],["Ezreal","Karma"],["Xayah","Rakan"],["Orianna","Jarvan IV"],["Orianna","Vi"],["Lucian","Milio"],["Kalista","Alistar"],["Galio","Camille"],["Lucian","Nami"],["Zeri","Lulu"],["Kog'Maw","Lulu"],["Yasuo","Malphite"]];
const PRO_DUO_MIN = 40;
const TEAM_SYN = [
 ["Galio","Camille",3],["Yasuo","Gragas",2],["Yasuo","Diana",2],["Kalista","Renata Glasc",3],["Ezreal","Karma",2],["Yunara","Lulu",2],
 ["Orianna","Nocturne",3],["Orianna","Jarvan IV",3],["Orianna","Wukong",3],["Orianna","Vi",3],["Orianna","Malphite",3],
 ["Jarvan IV","Galio",2],["Wukong","Kennen",2],["Yasuo","Malphite",3],["Yasuo","Gragas",2],["Yone","Diana",2],
 ["Lulu","Kog'Maw",2],["Lulu","Twitch",2],["Milio","Kog'Maw",2],["Yuumi","Kog'Maw",2],["Taric","Master Yi",3]
];
