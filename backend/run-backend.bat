@echo off
echo ===================================================
echo   SAHAYAK AI - Spring Boot Backend Launcher
echo ===================================================
echo.

set "MVN_CMD=mvn"
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    if exist "%~dp0.maven\bin\mvn.cmd" (
        set "MVN_CMD=%~dp0.maven\bin\mvn.cmd"
    ) else (
        echo [ERROR] Maven (mvn) command was not found in your PATH or local directory.
        echo Please install Apache Maven or add it to your PATH:
        echo   https://maven.apache.org/download.cgi
        pause
        exit /b 1
    )
)

echo Starting Spring Boot backend on port 8080...
echo MongoDB Target: mongodb://localhost:27017/sahayak_ai
echo Swagger UI: http://localhost:8080/swagger-ui.html
echo.

call "%MVN_CMD%" spring-boot:run

