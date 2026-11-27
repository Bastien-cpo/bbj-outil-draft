# BBJ - Fin de serie : exporte les parties personnalisees du client LoL et envoie leurs stats a BBJ Outil Draft.
# Lance par le bouton "Fin de serie" de l'outil (lien bbj-export://), ou a la main. Le client LoL doit etre ouvert.
param([string]$Lien = "")
$ErrorActionPreference = 'Stop'
$dir = $PSScriptRoot; $out = Join-Path $dir 'parties'; $log = Join-Path $dir 'log.txt'

# Timeline compacte (or et CS par minute, XP a 15 min, kills, objectifs, tours) pour l'analyse de la game dans l'outil
function Compact-Timeline($d, $tl, $ourTeam) {
  if (-not $tl -or -not $tl.frames) { return $null }
  $P = @($d.participants | Sort-Object participantId)
  $idx = @{}; $sd = @{}; $pl = @()
  for ($i = 0; $i -lt $P.Count; $i++) { $q = $P[$i]; $idx[[int]$q.participantId] = $i; $sd[[int]$q.participantId] = $(if ([int]$q.teamId -eq [int]$ourTeam) { 0 } else { 1 }); $pl += ,@($sd[[int]$q.participantId], [int]$q.championId) }
  $g = @(); $c = @(); for ($i = 0; $i -lt $P.Count; $i++) { $g += ,(New-Object System.Collections.ArrayList); $c += ,(New-Object System.Collections.ArrayList) }
  $x15 = @(0) * $P.Count; $ev = New-Object System.Collections.ArrayList
  $mon = @{ DRAGON = 'D'; RIFTHERALD = 'H'; BARON_NASHOR = 'B'; HORDE = 'V'; ATAKHAN = 'A' }
  $fi = 0
  foreach ($f in $tl.frames) {
    foreach ($q in $P) { $k = [int]$q.participantId; $pf = $f.participantFrames."$k"; $i = $idx[$k]
      [void]$g[$i].Add([int]$pf.totalGold); [void]$c[$i].Add([int]$pf.minionsKilled + [int]$pf.jungleMinionsKilled)
      if ($fi -eq 15) { $x15[$i] = [int]$pf.xp } }
    foreach ($e in $f.events) {
      $t = [int][math]::Floor($e.timestamp / 1000); $kid = [int]$e.killerId
      if ($e.type -eq 'CHAMPION_KILL' -and $idx.ContainsKey([int]$e.victimId)) { [void]$ev.Add(@($t, 'K', (1 - $sd[[int]$e.victimId]), $idx[[int]$e.victimId])) }
      elseif ($e.type -eq 'ELITE_MONSTER_KILL' -and $sd.ContainsKey($kid)) { $ty = $mon["$($e.monsterType)"]; if (-not $ty) { $ty = '?' }; [void]$ev.Add(@($t, $ty, $sd[$kid], ("$($e.monsterSubType)" -replace '_DRAGON',''))) }
      elseif ($e.type -eq 'BUILDING_KILL' -and ([int]$e.teamId -eq 100 -or [int]$e.teamId -eq 200)) { $lost = $(if ([int]$e.teamId -eq [int]$ourTeam) { 0 } else { 1 }); [void]$ev.Add(@($t, $(if ($e.buildingType -eq 'TOWER_BUILDING') { 'T' } else { 'I' }), (1 - $lost), (("$($e.laneType)" -replace '_LANE','') + ':' + ("$($e.towerType)" -replace '_TURRET','')))) }
    }
    $fi++
  }
  return [ordered]@{ v = 1; p = $pl; g = @($g | ForEach-Object { ,@($_.ToArray()) }); c = @($c | ForEach-Object { ,@($_.ToArray()) }); x15 = $x15; ev = @($ev.ToArray()) }
}
New-Item -ItemType Directory -Force -Path $out | Out-Null
Set-Content -Path $log -Value ("=== Fin de serie " + (Get-Date).ToString('s') + " ===") -Encoding UTF8
function Log($m) { Add-Content -Path $log -Value ((Get-Date).ToString('HH:mm:ss') + '  ' + $m) -Encoding UTF8; Write-Host $m }
try {
  Log "Recherche du client LoL..."
  $n = 3; if ($Lien -match '[?&]n=(\d+)') { $n = [int]$Matches[1] }
  $heures = 10; if ($Lien -match '[?&]h=(\d+)') { $heures = [int]$Matches[1] }
  # 1) Connexion au client (ligne de commande du client, sinon lockfile)
  $port = $null; $token = $null
  $proc = Get-CimInstance Win32_Process -Filter "Name='LeagueClientUx.exe'" -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($proc -and $proc.CommandLine) {
    if ($proc.CommandLine -match '--app-port=(\d+)') { $port = $Matches[1] }
    if ($proc.CommandLine -match '--remoting-auth-token=([\w-]+)') { $token = $Matches[1] }
  }
  if (-not $port) { foreach ($lf in @('C:\Riot Games\League of Legends\lockfile','D:\Riot Games\League of Legends\lockfile')) { if (Test-Path $lf) { $p = (Get-Content $lf -Raw).Split(':'); $port = $p[2]; $token = $p[3]; break } } }
  if (-not $port) { throw "Client League of Legends introuvable : ouvre le client, puis reclique 'Fin de serie'." }
  Log "Client LoL trouve (port $port)"
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  if ($PSVersionTable.PSVersion.Major -lt 6 -and -not ('BBJTrust' -as [type])) {
    Add-Type @"
using System.Net; using System.Security.Cryptography.X509Certificates;
public class BBJTrust : ICertificatePolicy { public bool CheckValidationResult(ServicePoint s, X509Certificate c, WebRequest r, int p) { return true; } }
"@
    [Net.ServicePointManager]::CertificatePolicy = New-Object BBJTrust
  }
  $auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("riot:$token"))
  function Get-Lcu($path) { $q = @{ Uri = "https://127.0.0.1:$port$path"; Headers = @{ Authorization = "Basic $auth" } }; if ($PSVersionTable.PSVersion.Major -ge 6) { $q.SkipCertificateCheck = $true }; Invoke-RestMethod @q }

  # 2) Nos parties personnalisees des 10 dernieres heures
  $me = Get-Lcu "/lol-summoner/v1/current-summoner"; Log "Connecte au client : $($me.gameName)"
  $hist = Get-Lcu "/lol-match-history/v1/products/lol/current-summoner/matches?begIndex=0&endIndex=30"
  $since = [DateTimeOffset]::UtcNow.AddHours(-$heures).ToUnixTimeMilliseconds()
  $games = @($hist.games.games) | Where-Object { ($_.gameType -eq 'CUSTOM_GAME' -or $_.queueId -eq 0) -and $_.gameCreation -ge $since } | Sort-Object gameCreation
  $games = @($games | Select-Object -Last $n)
  Log "$($games.Count) partie(s) personnalisee(s) retenue(s) sur $heures h"
  if (-not $games.Count) { throw "Aucune partie personnalisee depuis $heures h dans l'historique du client." }

  $ordre = @('T','J','M','A','S')
  $res = @()
  foreach ($g in $games) {
    $id = $g.gameId; $d = Get-Lcu "/lol-match-history/v1/games/$id"
    $file = Join-Path $out "$id.json"
    $tl = $null
    if (-not (Test-Path $file)) { try { $tl = Get-Lcu "/lol-match-history/v1/game-timelines/$id" } catch {}; ([ordered]@{ exportedAt = (Get-Date).ToString('s'); game = $d; timeline = $tl }) | ConvertTo-Json -Depth 100 -Compress | Out-File -FilePath $file -Encoding utf8 }
    else { try { $tl = (Get-Content $file -Raw -Encoding utf8 | ConvertFrom-Json).timeline } catch {} }
    $pid0 = ($d.participantIdentities | Where-Object { $_.player.puuid -eq $me.puuid } | Select-Object -First 1).participantId
    $ourTeam = ($d.participants | Where-Object { $_.participantId -eq $pid0 }).teamId
    if (-not $ourTeam) { $ourTeam = 100 }
    $side = @{}
    foreach ($t in 100, 200) {
      $ps = @($d.participants | Where-Object { $_.teamId -eq $t } | Sort-Object participantId)
      $m = [ordered]@{}; $i = 0
      foreach ($p in $ps) {
        $lane = "$($p.timeline.lane)"; $role = "$($p.timeline.role)"
        $r = switch -Regex ($lane) { 'TOP' {'T'} 'JUNGLE' {'J'} 'MID' {'M'} 'BOT' { if ($role -match 'SUPPORT') {'S'} else {'A'} } default {$null} }
        if (-not $r -or $m.Contains($r)) { $r = $ordre[$i] }
        $s = $p.stats
        $m[$r] = [ordered]@{ c = $p.championId; k = $s.kills; d = $s.deaths; a = $s.assists; gold = $s.goldEarned; cs = ($s.totalMinionsKilled + $s.neutralMinionsKilled); dmg = $s.totalDamageDealtToChampions; vis = $s.visionScore }
        $i++
      }
      # roles en double ou manquants : ordre du lobby
      if ($m.Count -ne 5) { $m = [ordered]@{}; $i = 0; foreach ($p in $ps) { $s = $p.stats; $m[$ordre[$i]] = [ordered]@{ c = $p.championId; k = $s.kills; d = $s.deaths; a = $s.assists; gold = $s.goldEarned; cs = ($s.totalMinionsKilled + $s.neutralMinionsKilled); dmg = $s.totalDamageDealtToChampions; vis = $s.visionScore }; $i++ } }
      $side[$t] = $m
    }
    $obj = @{}
    foreach ($tm in $d.teams) { $obj[[int]$tm.teamId] = [ordered]@{ towers = $tm.towerKills; drakes = $tm.dragonKills; barons = $tm.baronKills; herald = $tm.riftHeraldKills; grubs = $(if ($tm.hordeKills) { $tm.hordeKills } else { 0 }) }; if ([int]$tm.teamId -eq $ourTeam) { $win = ($tm.win -eq 'Win') } }
    $them = 300 - $ourTeam
    $tlc = $null; try { $tlc = Compact-Timeline $d $tl $ourTeam } catch { Log "Timeline non lue pour $id : $($_.Exception.Message)" }
    $res += [ordered]@{ gameId = $id; at = $d.gameCreation; min = [math]::Round($d.gameDuration / 60); win = $win; us = $side[$ourTeam]; them = $side[$them]; objUs = $obj[$ourTeam]; objThem = $obj[$them]; tl = $tlc }
    Log ("Partie {0} : {1} min, {2}" -f $id, [math]::Round($d.gameDuration / 60), $(if ($win) {'victoire'} else {'defaite'}))
  }
  # 3) Publication sur GitHub (toute l'equipe la recoit) : la serie envoyee par l'outil + les stats, ajoutee a team.json
  $pub = "non publiee (pas de cle GitHub)"
  $tokFile = Join-Path $dir 'github-token.txt'
  if ($Lien -match '[?&]s=([\w-]+)' -and (Test-Path $tokFile)) {
    $b = $Matches[1].Replace('-','+').Replace('_','/'); while ($b.Length % 4) { $b += '=' }
    $serie = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($b)) | ConvertFrom-Json
    $gs = @($serie.games)
    for ($i = 0; $i -lt $gs.Count; $i++) {
      $x = $res[$res.Count - $gs.Count + $i]; if (-not $x) { continue }
      $st = [ordered]@{ gameId = $x.gameId; min = $x.min; us = $x.us; them = $x.them; objUs = $x.objUs; objThem = $x.objThem }
      if ($x.tl) { $st.tl = $x.tl }
      $gs[$i] | Add-Member -NotePropertyName stats -NotePropertyValue $st -Force
      if (-not $gs[$i].result) { $gs[$i] | Add-Member -NotePropertyName result -NotePropertyValue $(if ($x.win) {'W'} else {'L'}) -Force }
    }
    $serieJson = $serie | ConvertTo-Json -Depth 30 -Compress
    $tok = (Get-Content $tokFile -Raw).Trim()
    $api = 'https://api.github.com/repos/Bastien-cpo/bbj-outil-draft/contents/team.json'
    $h = @{ Authorization = "Bearer $tok"; 'User-Agent' = 'bbj-export'; Accept = 'application/vnd.github+json' }
    Log "Publication GitHub..."
    $cur = Invoke-RestMethod -Uri $api -Headers $h
    $txt = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String(($cur.content -replace '\s','')))
    if ($serie.id -and $txt.Contains('"id":' + $serie.id + ',')) { $pub = "deja publiee" } else {
      $mark = '"history":{"series":['
      $k = $txt.IndexOf($mark); if ($k -lt 0) { throw "team.json : format inattendu, serie non publiee." }
      $k += $mark.Length; $sep = $(if ($txt.Substring($k, 1) -eq ']') { '' } else { ',' })
      $txt = $txt.Substring(0, $k) + $serieJson + $sep + $txt.Substring($k)
      $now = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
      $txt = [regex]::Replace($txt, '^\{"at":\d+', '{"at":' + $now)
      $body = @{ message = "Historique : serie vs $($serie.opponent) du $($serie.date) (stats du client)"; content = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($txt)); sha = $cur.sha } | ConvertTo-Json
      Invoke-RestMethod -Method Put -Uri $api -Headers $h -Body ([Text.Encoding]::UTF8.GetBytes($body)) -ContentType 'application/json; charset=utf-8' | Out-Null
      $pub = "publiee sur GitHub (visible par l'equipe d'ici 1 a 2 minutes)"
    }
  }
  Log "Serie $pub"
  # 4) Envoi a l'outil de ce navigateur
  # le lien #import reste court : la timeline passe uniquement par team.json (GitHub)
  $resImp = @($res | ForEach-Object { $o = [ordered]@{}; foreach ($k in $_.Keys) { if ($k -ne 'tl') { $o[$k] = $_[$k] } }; $o })
  $json = ([ordered]@{ v = 1; games = $resImp }) | ConvertTo-Json -Depth 10 -Compress
  $b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($json)).TrimEnd('=').Replace('+','-').Replace('/','_')
  Start-Process ("https://bastien-cpo.github.io/bbj-outil-draft/#import=" + $b64)
  Log "Stats envoyees a l'outil dans le navigateur. Termine."
} catch {
  Log ("ERREUR : " + $_ + "  (ligne " + $_.InvocationInfo.ScriptLineNumber + ")")
  Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show("$_", "BBJ - Fin de serie") | Out-Null
}
