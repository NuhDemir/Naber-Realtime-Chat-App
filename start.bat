@echo off
rem Start both frontend and backend dev servers in separate command windows
chcp 65001 >nul


 timeout /t 1 >nul


echo Starting backend and frontend using the root `dev` script (uses concurrently)... 
echo Installing root dev dependencies (if needed) and starting both services...
start "Dev" cmd /k "cd /d "%~dp0" && npm install && npm run dev"
echo Dev windows started. Close the window to stop both services.
exit /b 0
