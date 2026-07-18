@echo off
cd /d "C:\Users\LAWYER\OneDrive\Documents\projek contoh\Manajemen Kantor Hukum"
echo ==========================================
echo   AUTO DEPLOY - Manajemen Kantor Hukum
echo ==========================================
echo.

:: Cek apakah ada perubahan
git status --porcelain >nul 2>&1
if %errorlevel%==0 (
    echo Tidak ada perubahan. Situs sudah update.
    pause
    exit /b
)

echo Upload perubahan ke GitHub...
echo.
git add -A
git commit -m "Update %date% %time%"
git push
echo.
echo ==========================================
echo   SELESAI! Situs otomatis update.
echo   URL: https://jacksparrows0701-maker.github.io/manajemen-kantor-hukum/
echo ==========================================
pause
