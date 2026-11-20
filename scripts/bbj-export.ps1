# BBJ - Fin de serie : exporte les parties personnalisees du client LoL et envoie leurs stats a BBJ Outil Draft.
# Lance par le bouton "Fin de serie" de l'outil (lien bbj-export://), ou a la main. Le client LoL doit etre ouvert.
param([string]$Lien = "")
$ErrorActionPreference = 'Stop'
$dir = $PSScriptRoot; $out = Join-Path $dir 'parties'; $log = Join-Path $dir 'log.txt'
New-Item -ItemType Directory -Force -Path $out | Out-Null
Start-Transcript -Path $log -Force | Out-Null
try {
  $n = 3; if ($Lien -match '[?&]n=(\d+)') { $n = [int]$Matches[1] }
  # 1) Connexion au client (ligne de commande du client, sinon lockfile)
  $port = $null; $token = $null
  $proc = Get-CimInstance Win32_Process -Filter "Name='LeagueClientUx.exe'" -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($proc -and $proc.CommandLine) {
    if ($proc.CommandLine -match '--app-port=(\d+)') { $port = $Matches[1] }
    if ($proc.CommandLine -match '--remoting-auth-token=([\w-]+)') { $token = $Matches[1] }
  }
  if (-not $port) { foreach ($lf in @('C:\Riot Games\League of Legends\lockfile','D:\Riot Games\League of Legends\lockfile')) { if (Test-Path $lf) { $p = (Get-Content $lf -Raw).Split(':'); $port = $p[2]; $token = $p[3]; break } } }
  if (-not $port) { throw "Client League of Legends introuvable : ouvre le client, puis reclique 'Fin de serie'." }
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
  $me = Get-Lcu "/lol-summoner/v1/current-summoner"
  $hist = Get-Lcu "/lol-match-history/v1/products/lol/current-summoner/matches?begIndex=0&endIndex=30"
  $since = [DateTimeOffset]::UtcNow.AddHours(-10).ToUnixTimeMilliseconds()
  $games = @($hist.games.games) | Where-Object { ($_.gameType -eq 'CUSTOM_GAME' -or $_.queueId -eq 0) -and $_.gameCreation -ge $since } | Sort-Object gameCreation
  $games = @($games | Select-Object -Last $n)
  if (-not $games.Count) { throw "Aucune partie personnalisee depuis 10 h dans l'historique du client." }

  $ordre = @('T','J','M','A','S')
  $res = @()
  foreach ($g in $games) {
    $id = $g.gameId; $d = Get-Lcu "/lol-match-history/v1/games/$id"
    $file = Join-Path $out "$id.json"
    if (-not (Test-Path $file)) { $tl = $null; try { $tl = Get-Lcu "/lol-match-history/v1/game-timelines/$id" } catch {}; ([ordered]@{ exportedAt = (Get-Date).ToString('s'); game = $d; timeline = $tl }) | ConvertTo-Json -Depth 100 -Compress | Out-File -FilePath $file -Encoding utf8 }
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
    $res += [ordered]@{ gameId = $id; at = $d.gameCreation; min = [math]::Round($d.gameDuration / 60); win = $win; us = $side[$ourTeam]; them = $side[$them]; objUs = $obj[$ourTeam]; objThem = $obj[$them] }
    Write-Host ("Partie {0} : {1} min, {2}" -f $id, [math]::Round($d.gameDuration / 60), $(if ($win) {'victoire'} else {'defaite'}))
  }
  # 3) Envoi a l'outil (les stats voyagent dans le lien, rien ne quitte ton PC ailleurs)
  $json = ([ordered]@{ v = 1; games = $res }) | ConvertTo-Json -Depth 10 -Compress
  $b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($json)).TrimEnd('=').Replace('+','-').Replace('/','_')
  Start-Process ("https://bastien-cpo.github.io/bbj-outil-draft/#import=" + $b64)
  Write-Host "Stats envoyees a l'outil." -ForegroundColor Green
} catch {
  Write-Host $_ -ForegroundColor Red
  Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show("$_", "BBJ - Fin de serie") | Out-Null
} finally { Stop-Transcript | Out-Null }
