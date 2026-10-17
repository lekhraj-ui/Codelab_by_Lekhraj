@echo off
cd /d "%~dp0"
echo Starting Lekhraj CodeLab backend...
start "Lekhraj CodeLab Backend" cmd /k "cd /d "%~dp0backend" && npm install && npm start"
timeout /t 3 /nobreak >nul
echo Starting Lekhraj CodeLab frontend...
start "Lekhraj CodeLab Frontend" cmd /k "cd /d "%~dp0" && npm install && npm run dev"
