@echo off
setlocal

set "PORT=8000"
set "URL=http://localhost:%PORT%/index.html"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$port=%PORT%; $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue; if (-not $conn) { Start-Process python -ArgumentList '-m','http.server',\"$port\" -WorkingDirectory '%~dp0' | Out-Null; Start-Sleep -Seconds 2 }; Start-Process '%URL%'"

endlocal
