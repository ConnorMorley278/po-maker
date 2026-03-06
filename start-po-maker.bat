@echo off
cd /d C:\Users\javan\po-maker
timeout /t 2 /nobreak
start "" "http://localhost:3000"
npm run dev
