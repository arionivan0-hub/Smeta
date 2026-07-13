@echo off
cd /d "%~dp0"

:: ============================================
:: First-time setup
:: ============================================
if not exist "backend\venv\Scripts\python.exe" (
    echo [1/3] Installing Python packages...
    call backend\venv\Scripts\activate.bat
    pip install -r backend\requirements.txt

    echo [2/3] Seeding catalog...
    python backend\seed_catalog.py
    python backend\seed_templates.py

    echo [3/3] Installing and building frontend...
    cd /d "%~dp0frontend"
    call npm install
    call npm run build
    cd /d "%~dp0"

    :: Save timestamps
    copy /y backend\requirements.txt backend\.last_requirements >nul 2>&1
    copy /y frontend\package.json frontend\.last_package.json >nul 2>&1
    copy /y frontend\package-lock.json frontend\.last_package-lock.json >nul 2>&1

    echo Setup complete!
    echo.
)

:: ============================================
:: Check for dependency changes and auto-rebuild
:: ============================================
set NEED_REBUILD=0

:: Check backend requirements
fc /b backend\requirements.txt backend\.last_requirements >nul 2>&1
if errorlevel 1 (
    echo [Auto] Backend requirements changed, reinstalling...
    call backend\venv\Scripts\activate.bat
    pip install -r backend\requirements.txt
    copy /y backend\requirements.txt backend\.last_requirements >nul 2>&1
)

:: Check frontend package.json
fc /b frontend\package.json frontend\.last_package.json >nul 2>&1
if errorlevel 1 (
    echo [Auto] Frontend packages changed, reinstalling...
    cd /d "%~dp0frontend"
    call npm install
    copy /y package.json ..\..\frontend\.last_package.json >nul 2>&1
    copy /y package-lock.json ..\..\frontend\.last_package-lock.json >nul 2>&1
    cd /d "%~dp0"
    set NEED_REBUILD=1
)

:: Check frontend package-lock.json
fc /b frontend\package-lock.json frontend\.last_package-lock.json >nul 2>&1
if errorlevel 1 (
    if %NEED_REBUILD%==0 (
        echo [Auto] Frontend lock file changed, reinstalling...
        cd /d "%~dp0frontend"
        call npm install
        copy /y package-lock.json ..\..\frontend\.last_package-lock.json >nul 2>&1
        cd /d "%~dp0"
        set NEED_REBUILD=1
    )
)

:: Check if dist is missing
if not exist "frontend\dist\index.html" (
    set NEED_REBUILD=1
)

:: Check if source files are newer than dist
forfiles /P frontend\src /S /M "*.tsx" /D +0 2>nul && set NEED_REBUILD=1
forfiles /P frontend\src /S /M "*.ts" /D +0 2>nul && set NEED_REBUILD=1
forfiles /P frontend\src /S /M "*.css" /D +0 2>nul && set NEED_REBUILD=1

if %NEED_REBUILD%==1 (
    echo [Auto] Rebuilding frontend...
    cd /d "%~dp0frontend"
    call npm run build
    cd /d "%~dp0"
)

:: ============================================
:: Start production server
:: ============================================
echo.
echo Starting Smeta (production mode)...
echo Open http://localhost:8000 in your browser
echo.
call backend\venv\Scripts\activate.bat
cd /d "%~dp0backend"
python -m uvicorn main:app --host 0.0.0.0 --port 8000
