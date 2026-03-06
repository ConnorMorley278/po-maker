@echo off
cd /d C:\Users\javan\po-maker
start /b npm run dev
timeout /t 1 /nobreak
start http://localhost:3000
exit
