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
const STATS_RAW = `Ambessa:12:50|Corki:11:64|Ornn:10:60|Syndra:9:33|Jinx:9:78|Tristana:9:78|Nautilus:9:78|Trundle:8:75|Lee Sin:8:75|Wukong:7:71|Anivia:7:71|Sion:7:43|Garen:7:71|Viktor:7:71|Sylas:6:83|Lulu:6:67|Blitzcrank:6:50|Kai'Sa:6:50|Olaf:6:67|Darius:6:50|Swain:5:80|Sivir:5:40|Vi:5:100|Skarner:5:60|Milio:5:80|Jhin:5:60|Annie:5:80|Orianna:5:80|K'Sante:4:50|Taliyah:4:50|Ryze:4:75|Xayah:4:50|Ahri:4:75|Akali:4:75|Seraphine:4:100|Xin Zhao:4:75|Jarvan IV:4:75|Ashe:3:67|Leona:3:100|Ezreal:3:67|Nunu:3:67|Kog'Maw:3:67|Dr. Mundo:3:33|Aurora:2:50|Zeri:2:100|Braum:2:50|Alistar:2:50|Kassadin:2:50|Galio:2:50|Zilean:2:0|Maokai:2:50|Nocturne:2:100|Pantheon:2:50|Mordekaiser:2:0|Vex:1:0|Cho'Gath:1:100|Sejuani:1:0|Yunara:1:0|Yuumi:1:100|Miss Fortune:1:100|Cassiopeia:1:0|Karma:1:100|Yone:1:0|Mel:1:100|Kalista:1:100|Taric:1:100|Sett:1:0|LeBlanc:1:100|Volibear:1:0|Soraka:1:0|Zaahen:1:0|Lucian:1:100|Renekton:1:0|Caitlyn:1:0|Sona:1:100|Malphite:1:0|Shyvana:1:0|Rek'Sai:1:0|Rakan:1:0|Poppy:1:0|Diana:1:0|Vayne:1:0|Elise:1:0|Viego:1:0|Azir:1:0|Morgana:1:0|Shaco:1:0`;

// Tier lists (confiance) — S > A > B > C > D
const TIERS_RAW = { // tier lists à jour du 17/11 (confiance actuelle des joueurs)
  T: {S:"Darius,Garen,Ornn", A:"Dr. Mundo,Malphite,Olaf,Sett,Sion,Trundle,Zaahen", B:"Aatrox,Ambessa,Cho'Gath,Gwen,Jax,K'Sante,Mordekaiser,Poppy,Renekton", C:"Nasus,Sylas,Tahm Kench,Tryndamere", D:"Gragas,Shen"},
  J: {S:"Jarvan IV,Nocturne,Pantheon,Shaco,Viego,Xin Zhao", A:"Dr. Mundo,Skarner,Volibear,Wukong", B:"Diana,Kha'Zix,Lee Sin,Nunu,Rammus,Sejuani,Sion,Sylas,Vi,Zac", C:"Aatrox,Ambessa,Kayn,Malphite,Maokai,Mordekaiser", D:"Elise,Qiyana,Rek'Sai,Shyvana,Talon,Udyr"},
  M: {S:"Ahri,Kassadin,Orianna,Ryze,Syndra,Viktor", A:"Akali,Anivia,Annie,Aurora,Galio,Sylas,Twisted Fate,Yone", B:"Azir,Cassiopeia,LeBlanc,Lissandra,Mel,Swain,Taliyah,Vladimir,Zed", C:"Ambessa,Diana,Naafiri,Renekton,Vex", D:""},
  A: {S:"Corki,Tristana", A:"Ashe,Ezreal,Jhin,Jinx,Kai'Sa,Sivir,Xayah", B:"Caitlyn,Kalista,Lucian,Miss Fortune,Smolder,Syndra,Vayne,Yunara,Zeri,Ziggs", C:"Kog'Maw,Mel,Samira,Senna,Seraphine,Twitch,Varus", D:"Aphelios,Draven,Nilah"},
  S: {S:"Lulu,Nautilus,Zilean", A:"Blitzcrank,Braum,Milio,Morgana,Nami,Seraphine,Soraka,Xerath,Yuumi", B:"Ashe,Galio,Karma,Kog'Maw,Leona,Poppy,Sona,Swain,Taric", C:"Alistar,Pyke,Rakan,Renata Glasc,Thresh", D:""},
  SUB: {S:"", A:"", B:"Aatrox,Ambessa,Darius,Jax,Mordekaiser,Yone,Zaahen", C:"", D:""},
};

// Joueurs : rôle principal + tier list (clé = rôle d'origine dans TIERS_RAW)
const PLAYERS = [
  {id:"Fayk", main:"T", tl:"T"}, {id:"Billy", main:"J", tl:"J"}, {id:"JH", main:"M", tl:"M"},
  {id:"Bastien", main:"A", tl:"A"}, {id:"Léo", main:"S", tl:"S"}, {id:"Yeyozz", main:"T", tl:"SUB"}
];
const ROLE_NAMES = {T:"Top", J:"Jungle", M:"Mid", A:"ADC", S:"Support"};

// ===== Patch à venir (26.23, preview du 11/11 : sortie ~18/11) — les données OP.GG couvrent déjà 26.21 et 26.22 =====
const PATCH_NEXT = {v:"26.23", buff:"Akshan,Annie,Azir,Bard,Ezreal,Galio,Gnar,K'Sante,Mel,Vel'Koz,Vi", nerf:"LeBlanc,Master Yi,Syndra"};
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
