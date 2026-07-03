@echo off
setlocal

pushd "%~dp0"

set "ELECTRON_EXE=%~dp0node_modules\electron\dist\electron.exe"
set "NODEJS_DIR=C:\Program Files\nodejs"

if exist "%ELECTRON_EXE%" (
  start "NBA Manager" "%ELECTRON_EXE%" "."
  popd
  exit /b 0
)

if exist "%NODEJS_DIR%\npm.cmd" (
  set "PATH=%NODEJS_DIR%;%PATH%"
  call "%NODEJS_DIR%\npm.cmd" run electron
  popd
  exit /b %ERRORLEVEL%
)

echo NBA Manager could not find Electron or npm.
echo.
echo Expected Electron here:
echo %ELECTRON_EXE%
echo.
echo Expected npm here:
echo %NODEJS_DIR%\npm.cmd
echo.
pause
popd
exit /b 1
