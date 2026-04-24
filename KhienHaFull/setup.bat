@echo off
setlocal

cd /d "%~dp0"
title Khien Ha Backend Setup

echo =====================================
echo Khien Ha Backend Setup
echo =====================================
echo.

if not exist ".env" (
    copy /Y ".env.quickstart.example" ".env" >nul
    echo Da tao file .env tu .env.quickstart.example
    echo Hay sua thong tin DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD trong .env roi chay lai setup.bat
    start notepad ".env"
    echo.
    pause
    exit /b 1
)

if not exist "vendor\autoload.php" (
    echo [1/5] Composer install...
    call composer install --no-interaction
    if errorlevel 1 goto :error
) else (
    echo [1/5] Vendor da co san, bo qua composer install.
)

echo [2/5] Kiem tra APP_KEY...
powershell -NoProfile -Command "$envText = Get-Content '.env' -Raw; if ($envText -match '(?m)^APP_KEY=\s*$') { exit 0 } else { exit 1 }"
if %errorlevel%==0 (
    call php artisan key:generate --force
    if errorlevel 1 goto :error
) else (
    echo APP_KEY da ton tai.
)

echo [3/5] Don cache...
call php artisan optimize:clear
if errorlevel 1 goto :error

echo [4/5] Tao storage link neu can...
if not exist "public\storage" (
    call php artisan storage:link
    if errorlevel 1 goto :error
) else (
    echo public\storage da ton tai.
)

echo [5/5] Dong bo migration va chay server...
call php artisan migrate --force
if errorlevel 1 goto :error

if /I "%SKIP_SERVE%"=="1" (
    echo.
    echo Setup xong. Bo qua chay server vi SKIP_SERVE=1.
    exit /b 0
)

echo.
echo Backend dang chay tai http://127.0.0.1:8000
if /I not "%AUTO_OPEN_BROWSER%"=="0" start "" http://127.0.0.1:8000
call php artisan serve --host=127.0.0.1 --port=8000
exit /b 0

:error
echo.
echo Setup that bai. Kiem tra lai file .env va dam bao MySQL dang chay.
pause
exit /b 1
