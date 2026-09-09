@echo off
echo ===================================================
echo   SAHAYAK AI - MongoDB Status & Setup Checker
echo ===================================================
echo.

:: 1. Check if mongod is in PATH
where mongod >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] mongod is installed and available in PATH:
    mongod --version | findstr "db version"
) else (
    echo [WARNING] mongod command not found in PATH.
    echo Checking standard installation directory C:\Program Files\MongoDB\Server...
    if exist "C:\Program Files\MongoDB\Server" (
        echo [OK] MongoDB found in Program Files directory.
    ) else (
        echo [NOT FOUND] MongoDB Community Server is not installed in standard directory.
    )
)

echo.
:: 2. Check if mongosh is available
where mongosh >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] mongosh (MongoDB Shell) is available in PATH:
    mongosh --version
) else (
    echo [NOTICE] mongosh command not found in PATH.
)

echo.
:: 3. Check Windows Service status
echo Checking Windows Service "MongoDB"...
sc query MongoDB | findstr "STATE"
if %errorlevel% equ 0 (
    echo [OK] MongoDB service is configured.
) else (
    echo [NOTICE] MongoDB Windows service not found or requires elevation.
    echo To install or start manually:
    echo   net start MongoDB
)

echo.
echo ===================================================
echo   OFFICIAL MONGODB INSTALLATION INSTRUCTIONS
echo ===================================================
echo If MongoDB is not yet installed on this computer:
echo.
echo Option A: Using Windows Package Manager (winget) in Admin PowerShell/CMD:
echo   winget install MongoDB.Server
echo   winget install MongoDB.Compass
echo   winget install MongoDB.Shell
echo.
echo Option B: Official Manual Download:
echo   1. Download MongoDB Community Server (.msi) for Windows:
echo      https://www.mongodb.com/try/download/community
echo   2. Run installer -> Select "Complete" -> Check "Install MongoDB as a Service"
echo   3. Download MongoDB Compass for visual exploration:
echo      https://www.mongodb.com/try/download/compass
echo.
echo Once running, the database URL is:
echo   mongodb://localhost:27017/sahayak_ai
echo.
pause
