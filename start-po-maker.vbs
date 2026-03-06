Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

projectPath = "C:\Users\javan\po-maker"

' Start the npm dev server silently in background
objShell.Run "cmd /c cd /d " & projectPath & " && npm run dev", 0, False

' Wait for server to start
WScript.Sleep(7000)

' Open browser
objShell.Run "start http://localhost:3000", 1, False

WScript.Quit
