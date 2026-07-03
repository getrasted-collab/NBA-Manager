@echo off
setlocal
pushd "%~dp0"
set "NODE_EXE=C:\Program Files\nodejs\node.exe"

if not exist "%NODE_EXE%" (
  echo Node.js was not found at:
  echo %NODE_EXE%
  pause
  exit /b 1
)

start "NBA Manager Browser Server" /min "%NODE_EXE%" scripts\dev_server.cjs
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:4173"
popd
