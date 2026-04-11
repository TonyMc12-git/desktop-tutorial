Set shell = CreateObject("WScript.Shell")
shell.Run Chr(34) & Replace(WScript.ScriptFullName, "play-game.vbs", "Play Nine Letters.bat") & Chr(34), 0, False
