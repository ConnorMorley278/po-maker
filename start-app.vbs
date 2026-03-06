Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Start npm dev server in hidden window
strPath = "C:\Users\javan\po-maker"
objShell.Run "cmd /c cd /d " & strPath & " && npm run dev", 0, False

' Wait for server to start
WScript.Sleep(3000)

' Open Chrome
strURL = "http://localhost:3000"
objShell.Run "chrome.exe """ & strURL & """", 1, False
