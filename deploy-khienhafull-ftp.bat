@echo off
setlocal

cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0scripts\deploy-khienhafull-ftp.ps1" %*

exit /b %ERRORLEVEL%
