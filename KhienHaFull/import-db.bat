@echo off
setlocal

cd /d "%~dp0"
title Khien Ha DB Import (Seed)

echo =====================================
echo Khien Ha DB Import via Seeder
echo =====================================
echo.
echo Cach nay dung Laravel seeder de tao DB -- khong can file SQL.
echo De setup day du tu dau, hay chay setup.bat thay the.
echo.

if not exist ".env" (
    copy /Y ".env.quickstart.example" ".env" >nul
    echo Da tao file .env tu .env.quickstart.example
    echo Hay sua thong tin DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD trong .env roi chay lai.
    start notepad ".env"
    echo.
    pause
    exit /b 1
)

if not exist "vendor\autoload.php" (
    echo Chua co vendor. Chay 'composer install' truoc.
    pause
    exit /b 1
)

echo [1/3] Migrate + seed du lieu mac dinh (site_contents, news, admin user)...
call php artisan migrate --seed --force
if errorlevel 1 goto :error

echo [2/3] Xoa cache Laravel...
call php artisan optimize:clear
if errorlevel 1 goto :error

echo [3/3] Tao storage link neu can...
if not exist "public\storage" (
    call php artisan storage:link
)

echo.
echo Xong! DB da duoc tao va seed day du.
echo - Admin: admin@khienha.vn / KhienHa@123456  (hoac theo ADMIN_PASSWORD trong .env)
echo - Tro Website Root Directory vao thu muc: public
echo.
pause
exit /b 0

:error
echo.
echo That bai. Kiem tra lai MySQL dang chay va DB_* trong .env.
pause
exit /b 1
