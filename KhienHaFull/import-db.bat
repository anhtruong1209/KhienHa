@echo off
setlocal

cd /d "%~dp0"
title Khien Ha DB Import

echo =====================================
echo Khien Ha DB Import
echo =====================================
echo.

if not exist ".env" (
    copy /Y ".env.quickstart.example" ".env" >nul
    echo Da tao file .env tu .env.quickstart.example
    echo Hay sua thong tin DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD trong .env roi chay lai import-db.bat
    start notepad ".env"
    echo.
    pause
    exit /b 1
)

if not exist "database\dumps\khienha-current.sql" (
    echo Khong tim thay file SQL: database\dumps\khienha-current.sql
    pause
    exit /b 1
)

echo Dang import database tu database\dumps\khienha-current.sql ...
call php scripts\import_mysql_dump.php
if errorlevel 1 goto :error

echo.
echo Dang xoa cache Laravel...
call php artisan optimize:clear
if errorlevel 1 goto :error

echo.
echo Import xong. Neu dung ServBay, chi can tro Website Root Directory vao thu muc public.
pause
exit /b 0

:error
echo.
echo Import that bai. Kiem tra lai MySQL dang chay va DB_* trong .env.
pause
exit /b 1
