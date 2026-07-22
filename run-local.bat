@echo off
cd /d "%~dp0"
echo.
echo ========================================
echo   ACOPAY - Vite dev server
echo ========================================
echo.
echo This terminal stays open while the server runs.
echo Open: http://localhost:5173/
echo.
echo Press Ctrl+C to stop the server.
echo ========================================
echo.
start "" "http://localhost:5173/"
npm run dev
