@echo off
title PO Maker
color 0A
cls
echo ========================================
echo       PO MAKER - LOCAL APPLICATION
echo ========================================
echo.
echo Starting application...
echo Go to: http://localhost:3000
echo.
echo Close this window to stop the app.
echo ========================================
echo.
cd /d C:\Users\javan\po-maker
timeout /t 3 /nobreak
start http://localhost:3000
npm run dev
pause
