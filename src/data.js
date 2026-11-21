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
const TEAM_P_RAW = `Bastien|A|Ashe|3|2;Bastien|A|Caitlyn|1|0;Bastien|A|Corki|13|8;Bastien|A|Ezreal|3|2;Bastien|A|Jhin|5|3;Bastien|A|Jinx|9|7;Bastien|A|Kai'Sa|6|3;Bastien|A|Kalista|1|1;Bastien|A|Lucian|1|1;Bastien|A|Miss Fortune|1|1;Bastien|A|Sivir|5|2;Bastien|A|Syndra|2|1;Bastien|A|Tristana|10|8;Bastien|A|Vayne|1|0;Bastien|A|Xayah|4|2;Bastien|A|Yunara|3|0;Bastien|A|Zeri|2|2;Billy|J|Ambessa|2|1;Billy|J|Cho'Gath|2|1;Billy|J|Diana|1|0;Billy|J|Dr. Mundo|1|1;Billy|J|Elise|1|0;Billy|J|Jarvan IV|6|5;Billy|J|Lee Sin|10|7;Billy|J|Maokai|2|1;Billy|J|Mordekaiser|1|0;Billy|J|Nocturne|2|2;Billy|J|Nunu|3|2;Billy|J|Pantheon|2|1;Billy|J|Rek'Sai|1|0;Billy|J|Sejuani|1|0;Billy|J|Shaco|1|0;Billy|J|Shyvana|1|0;Billy|J|Sion|5|2;Billy|J|Skarner|5|3;Billy|J|Sylas|2|1;Billy|J|Trundle|1|1;Billy|J|Vi|6|5;Billy|J|Viego|1|0;Billy|J|Volibear|1|0;Billy|J|Wukong|7|5;Billy|J|Xin Zhao|4|3;Billy|S|Bard|1|1;Billy|S|Rakan|1|1;Billy|S|Thresh|1|0;Fayk|J|Darius|2|2;Fayk|J|Dr. Mundo|1|0;Fayk|J|Malphite|1|0;Fayk|J|Ornn|1|1;Fayk|J|Trundle|1|1;Fayk|T|Ambessa|8|5;Fayk|T|Darius|8|4;Fayk|T|Dr. Mundo|2|0;Fayk|T|Garen|8|6;Fayk|T|K'Sante|4|2;Fayk|T|Malphite|1|0;Fayk|T|Mordekaiser|1|0;Fayk|T|Olaf|7|4;Fayk|T|Ornn|10|6;Fayk|T|Sett|1|0;Fayk|T|Sion|2|1;Fayk|T|Trundle|9|6;Fayk|T|Zaahen|1|0;JH|M|Ahri|4|3;JH|M|Akali|5|3;JH|M|Ambessa|2|0;JH|M|Anivia|7|5;JH|M|Annie|5|4;JH|M|Aurora|2|1;JH|M|Azir|1|0;JH|M|Cassiopeia|1|0;JH|M|Galio|2|1;JH|M|Kassadin|3|2;JH|M|LeBlanc|1|1;JH|M|Malzahar|1|0;JH|M|Mel|1|1;JH|M|Orianna|6|4;JH|M|Renekton|1|0;JH|M|Ryze|4|3;JH|M|Swain|2|2;JH|M|Sylas|4|4;JH|M|Syndra|8|2;JH|M|Taliyah|4|2;JH|M|Tristana|1|1;JH|M|Vex|1|0;JH|M|Viktor|8|6;JH|M|Yone|1|0;Léo|S|Alistar|2|1;Léo|S|Blitzcrank|6|3;Léo|S|Braum|2|1;Léo|S|Karma|1|1;Léo|S|Kog'Maw|3|2;Léo|S|Leona|5|4;Léo|S|Lulu|8|4;Léo|S|Milio|5|4;Léo|S|Morgana|1|0;Léo|S|Nautilus|10|8;Léo|S|Poppy|1|0;Léo|S|Rakan|1|0;Léo|S|Seraphine|4|4;Léo|S|Sona|1|1;Léo|S|Soraka|1|0;Léo|S|Swain|4|3;Léo|S|Taric|2|2;Léo|S|Yuumi|1|1;Léo|S|Zilean|2|0;Yeyozz|T|Aatrox|1|1;Yeyozz|T|Ambessa|1|1;Yeyozz|T|Jax|1|1;Yeyozz|T|K'Sante|1|1;Yeyozz|T|Renekton|1|0;Yeyozz|T|Yone|1|1;Yeyozz|T|Zaahen|2|1`;
// Fiches scrim/compétition — base Parthenon (jusqu'au 17/11/2026) : joueur → rôle → champion : [games, victoires, K, D, A (totaux), somme des % dégâts, somme GD@15, games avec GD@15]
// Les séries suivantes (historique de l'outil, bouton Fin de série) s'y ajoutent automatiquement.
const TEAM_STATS_BASE = {"Fayk":{"T":{"Garen":[8,6,58,42,43,1.892,11194,8],"Trundle":[8,5,29,45,41,1.547,9326,8],"Darius":[7,4,37,36,36,1.253,2869,7],"Ornn":[10,6,15,35,102,1.868,-1907,10],"K'Sante":[4,2,11,19,22,0.615,3288,4],"Sion":[2,1,2,4,8,0.301,-1391,2],"Ambessa":[8,5,27,37,43,1.725,6686,8],"Olaf":[6,4,24,24,31,1.204,11465,6],"Sett":[1,0,3,6,4,0.158,4013,1],"Zaahen":[1,0,1,10,9,0.156,-3027,1],"Malphite":[1,0,0,5,1,0.184,310,1],"Dr. Mundo":[2,0,11,7,10,0.572,2870,2],"Mordekaiser":[1,0,7,7,8,0.279,789,1]},"J":{"Darius":[2,2,20,8,19,0.366,6540,2],"Ornn":[1,1,2,2,18,0.084,177,1],"Dr. Mundo":[1,0,4,10,9,0.215,-323,1],"Trundle":[1,1,6,3,10,0.15,-1192,1],"Malphite":[1,0,4,3,7,0.179,-3978,1]}},"Billy":{"J":{"Lee Sin":[9,7,41,44,88,1.403,16680,9],"Cho'Gath":[2,1,9,9,8,0.364,-4488,2],"Jarvan IV":[5,4,30,26,67,0.932,4181,5],"Wukong":[7,5,51,26,69,1.515,16572,7],"Sejuani":[1,0,6,4,3,0.191,-1578,1],"Vi":[5,5,39,24,48,0.902,15993,5],"Skarner":[5,3,22,19,45,0.968,-2015,5],"Sion":[5,2,27,24,42,1.044,-1251,5],"Nunu":[3,2,12,17,46,0.339,5328,3],"Xin Zhao":[4,3,21,24,43,0.791,774,4],"Trundle":[1,1,4,7,17,0.153,82,1],"Ambessa":[2,1,11,11,16,0.353,8707,2],"Volibear":[1,0,7,8,6,0.24,1377,1],"Sylas":[2,1,14,9,14,0.364,-1151,2],"Maokai":[2,1,6,13,19,0.423,340,2],"Dr. Mundo":[1,1,7,1,13,0.282,2522,1],"Shyvana":[1,0,3,11,11,0.157,966,1],"Nocturne":[2,2,12,7,17,0.363,3012,2],"Pantheon":[2,1,15,17,17,0.465,-3009,2],"Rek'Sai":[1,0,4,7,5,0.211,-880,1],"Mordekaiser":[1,0,2,6,4,0.135,1265,1],"Diana":[1,0,1,10,11,0.152,-3525,1],"Elise":[1,0,12,9,8,0.221,789,1],"Viego":[1,0,7,8,4,0.22,-6814,1],"Shaco":[1,0,15,6,14,0.278,1242,1]},"S":{"Bard":[1,1,2,6,14,0.122,-1192,1],"Thresh":[1,0,0,10,10,0.082,-3978,1],"Rakan":[1,1,0,4,26,0.078,1925,1]}},"JH":{"M":{"Kassadin":[3,2,20,12,25,0.808,7150,3],"Orianna":[6,4,30,16,68,1.438,5923,6],"Viktor":[8,6,54,17,56,2.311,12052,8],"Vex":[1,0,4,6,7,0.229,-67,1],"Sylas":[4,4,31,4,35,0.849,11096,4],"Aurora":[2,1,10,3,17,0.626,-3448,2],"Syndra":[7,2,35,32,46,1.713,11100,7],"Taliyah":[4,2,21,24,56,1.108,-4643,4],"Anivia":[7,5,29,22,62,1.263,11198,7],"Ryze":[4,3,27,15,38,0.82,6844,4],"Ahri":[4,3,22,13,33,0.933,1442,4],"Cassiopeia":[1,0,4,4,10,0.249,-1876,1],"Akali":[4,3,21,11,26,0.802,3166,4],"Yone":[1,0,3,7,6,0.21,-3978,1],"Mel":[1,1,12,2,11,0.265,1925,1],"Annie":[5,4,23,18,60,1.082,-419,5],"Swain":[1,1,9,0,10,0.234,1098,1],"Galio":[2,1,3,7,18,0.356,2337,2],"LeBlanc":[1,1,1,1,10,0.184,3375,1],"Renekton":[1,0,6,4,6,0.222,-3626,1],"Tristana":[1,1,3,6,8,0.16,1570,1],"Ambessa":[2,0,3,13,21,0.314,-2736,2],"Malzahar":[1,0,4,8,13,0.195,1904,1],"Azir":[1,0,0,5,3,0.192,-5044,1]}},"Bastien":{"A":{"Tristana":[9,7,86,45,75,2.812,14878,9],"Yunara":[2,0,2,11,6,0.537,-7945,2],"Corki":[12,8,92,54,78,2.94,20110,12],"Ashe":[3,2,14,9,17,0.8,-690,3],"Zeri":[2,2,17,10,17,0.501,3575,2],"Miss Fortune":[1,1,20,5,4,0.315,177,1],"Sivir":[5,2,30,22,29,1.366,6789,5],"Xayah":[4,2,40,22,33,1.327,-1886,4],"Ezreal":[3,2,18,9,22,0.913,1094,3],"Jinx":[9,7,78,30,61,2.978,3247,9],"Jhin":[5,3,34,19,49,1.213,6714,5],"Kai'Sa":[6,3,69,26,36,1.923,8018,6],"Kalista":[1,1,12,2,9,0.321,1098,1],"Syndra":[2,1,8,7,11,0.357,4201,2],"Lucian":[1,1,5,3,8,0.16,-1870,1],"Caitlyn":[1,0,9,6,6,0.281,-3626,1],"Vayne":[1,0,17,3,4,0.304,-3525,1]}},"Léo":{"S":{"Taric":[2,2,3,11,42,0.111,7837,2],"Lulu":[7,4,5,32,102,0.544,-3014,7],"Leona":[4,4,8,22,78,0.357,7367,4],"Swain":[4,3,5,18,63,0.61,11419,4],"Yuumi":[1,1,5,0,23,0.116,4615,1],"Braum":[2,1,1,12,17,0.18,-2697,2],"Blitzcrank":[6,3,7,38,77,0.589,5795,6],"Milio":[5,4,2,13,73,0.256,3179,5],"Alistar":[2,1,1,11,30,0.117,646,2],"Seraphine":[4,4,8,11,80,0.492,8341,4],"Kog'Maw":[3,2,9,18,35,0.608,6004,3],"Karma":[1,1,4,3,23,0.105,3963,1],"Nautilus":[9,7,20,61,144,0.831,16621,9],"Zilean":[2,0,1,8,17,0.19,499,2],"Soraka":[1,0,1,7,9,0.06,1377,1],"Sona":[1,1,0,5,19,0.094,1570,1],"Rakan":[1,0,0,7,4,0.059,-880,1],"Poppy":[1,0,0,9,4,0.092,-1230,1],"Morgana":[1,0,0,6,11,0.118,-1442,1]}},"Yeyozz":{"T":{"Yone":[1,1,7,6,2,0.186,4615,1],"Jax":[1,1,11,7,7,0.313,177,1],"Zaahen":[2,1,14,11,9,0.508,1060,2],"Ambessa":[1,1,9,1,7,0.27,-1192,1],"Renekton":[1,0,3,5,2,0.2,-3978,1],"Aatrox":[1,1,5,2,7,0.254,1925,1],"K'Sante":[1,1,1,5,6,0.174,-2374,1]}}};
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
  {id:"Fayk", main:"T", tl:"T"}, {id:"Billy", main:"J", tl:"J"}, {id:"JH", main:"M", tl:"M"},
  {id:"Bastien", main:"A", tl:"A"}, {id:"Léo", main:"S", tl:"S"}, {id:"Yeyozz", main:"T", tl:"SUB", sub:true},
  {id:"Bounty", main:"S", tl:"SUB_S", sub:true}
];
const ROLE_NAMES = {T:"Top", J:"Jungle", M:"Mid", A:"ADC", S:"Support"};

// ===== Patch à venir (26.23, preview du 11/11 : sortie ~18/11) — les données OP.GG couvrent déjà 26.21 et 26.22 =====
// Patch 26.23 (sorti le 18/11) : notes officielles. Données de jeu encore en 26.22 (trop peu de games sur 26.23) → léger ajustement des champions modifiés
const PATCH_NEXT = {v:"26.23", buff:"Annie,Azir,Bard,Ezreal,Galio,Gnar,Mel,Vel'Koz,Vi", nerf:"LeBlanc,Master Yi,Syndra"};
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
