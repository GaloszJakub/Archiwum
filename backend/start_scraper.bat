@echo off
title Archiwum Scraper + Tailscale Funnel
cd /d "%~dp0"

echo ============================================================
echo  ARCHIWUM SCRAPER API + TAILSCALE FUNNEL
echo ============================================================
echo.

echo [*] Starting Flask API server...
start "Scraper API" cmd /k "python app.py"

:: Wait for API to start
echo [*] Waiting for API to start...
timeout /t 5 /nobreak > nul

echo [*] Starting Tailscale Funnel on port 5001...
echo.
echo ============================================================
echo  Your permanent URL:
echo  https://desktop-posj0te.tail771563.ts.net/api
echo ============================================================
echo.

"C:\Program Files\Tailscale\tailscale.exe" funnel 5001

pause
