@echo off
setlocal
cd /d "%~dp0"
echo Starting Discord Auto Translator...
echo Health check: http://127.0.0.1:32123/health
echo Press Ctrl+C to stop.
node translator-server.js
pause
