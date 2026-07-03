@echo off
cd /d "%~dp0"
echo Updating NBA teams and 2025-26 player stats...
"%~dp0.python\python.exe" "%~dp0scripts\import_nba_data.py"
if errorlevel 1 (
  echo.
  echo Import failed. Review the error above.
  pause
  exit /b 1
)
echo.
echo NBA data updated successfully.
pause
