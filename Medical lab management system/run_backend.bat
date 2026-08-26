@echo off
echo =========================================================
echo  Compiling Apex Clinical LIMS Java REST Backend Server...
echo =========================================================
if not exist "backend\bin" mkdir "backend\bin"

"C:\Program Files\Java\jdk-25\bin\javac.exe" -cp "backend/lib/sqlite-jdbc.jar" -d "backend/bin" backend/*.java

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java Compilation Failed!
    exit /b %ERRORLEVEL%
)

echo.
echo =========================================================
echo  Starting LIMS REST Server on http://localhost:8080
echo =========================================================
"C:\Program Files\Java\jdk-25\bin\java.exe" -cp "backend/bin;backend/lib/sqlite-jdbc.jar" backend.LimsServer
