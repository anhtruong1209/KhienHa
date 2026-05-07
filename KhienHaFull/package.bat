@echo off
setlocal

cd /d "%~dp0"
title Khien Ha - Dong goi ZIP

set ZIP_NAME=KhienHaFull-deploy-%DATE:~6,4%%DATE:~3,2%%DATE:~0,2%.zip
set ZIP_PATH=%~dp0..\%ZIP_NAME%

echo =====================================
echo Dong goi KhienHaFull
echo Output: %ZIP_PATH%
echo =====================================
echo.

REM Kiem tra 7z
where 7z >nul 2>&1
if errorlevel 1 (
    echo Khong tim thay 7-Zip. Cai dat tai: https://www.7-zip.org
    pause
    exit /b 1
)

if exist "%ZIP_PATH%" del /f /q "%ZIP_PATH%"

echo Dang nen...
7z a -tzip "%ZIP_PATH%" "." ^
  -xr!vendor ^
  -xr!node_modules ^
  -xr!.git ^
  -xr!storage\logs\*.log ^
  -xr!storage\framework\cache\* ^
  -xr!storage\framework\sessions\* ^
  -xr!storage\framework\views\* ^
  -x!.env ^
  -x!"database\dumps\khienha-current.sql" ^
  -x!"%~nx0"

if errorlevel 1 goto :error

echo.
echo Xong! File ZIP: %ZIP_PATH%
echo.
echo Nguoi nhan lam nhu sau:
echo   1. Giai nen ZIP
echo   2. Chay setup.bat  --^> tu dong composer install + migrate + seed
echo   3. Tro Website Root Directory vao thu muc: public
echo   4. Admin: admin@khienha.vn / KhienHa@123456
echo.
pause
exit /b 0

:error
echo.
echo Dong goi that bai.
pause
exit /b 1
