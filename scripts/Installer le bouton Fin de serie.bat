@echo off
rem Enregistre le lien bbj-export:// pour ce compte Windows (pas besoin d'etre administrateur).
set "PS1=%~dp0bbj-export.ps1"
reg add "HKCU\Software\Classes\bbj-export" /ve /d "URL:BBJ Fin de serie" /f >nul
reg add "HKCU\Software\Classes\bbj-export" /v "URL Protocol" /d "" /f >nul
reg add "HKCU\Software\Classes\bbj-export\shell\open\command" /ve /d "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Minimized -File \"%PS1%\" \"%%1\"" /f >nul
echo Bouton "Fin de serie" installe : il lancera %PS1%
pause
