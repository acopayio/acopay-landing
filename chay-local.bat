@echo off
cd /d "%~dp0"
echo.
echo ========================================
echo   ACOPAY - Vite dev server
echo ========================================
echo.
echo Terminal nay KHONG bi treo - server dang chay.
echo Mo trinh duyet: http://localhost:5173/
echo.
echo Nhan Ctrl+C de tat server.
echo ========================================
echo.
start "" "http://localhost:5173/"
npm run dev
