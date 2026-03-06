Set objShell = CreateObject("WScript.Shell")
objShell.Run "cmd /c cd /d C:\Users\javan\po-maker && start npm run dev && timeout /t 1 /nobreak && start http://localhost:3000", 0, False
WScript.Quit
