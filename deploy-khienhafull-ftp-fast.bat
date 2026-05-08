@echo off
setlocal

cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0scripts\deploy-khienhafull-ftp-fast.ps1" %*

exit /b %ERRORLEVEL%
