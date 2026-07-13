@echo off
cd /d "%~dp0"

:: ============================================
:: First-time setup
:: ============================================
if not exist "backend\venv\Scripts\python.exe" (
    echo [1/4] Creating virtual environment...
    python -m venv backend\venv
    if errorlevel 1 (
        echo ERROR: Python not found. Install Python 3.10+ from python.org
        pause
        exit /b 1
    )

    echo [2/4] Installing Python packages...
    call backend\venv\Scripts\activate.bat
    pip install -r backend\requirements.txt
    if errorlevel 1 (
        echo ERROR: pip install failed
        pause
        exit /b 1
    )

    echo [3/4] Seeding catalog...
    python backend\seed_catalog.py
    python backend\seed_templates.py

    echo [4/4] Installing and building frontend...
    cd /d "%~dp0frontend"
    call npm install
    call npm run build
    cd /d "%~dp0"

    :: Save timestamps for change detection
    copy /y backend\requirements.txt backend\.last_requirements >nul 2>&1
    copy /y frontend\package.json frontend\.last_package.json >nul 2>&1
    copy /y frontend\package-lock.json frontend\.last_package-lock.json >nul 2>&1

    echo.
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
    set NEED_REBUILD=1
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

:: Check if source files changed (rebuild if dist is missing or older than src)
if not exist "frontend\dist\index.html" (
    set NEED_REBUILD=1
)

:: Check if any .tsx/.ts/.css file is newer than dist
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
:: Start server
:: ============================================
echo.
echo Starting Smeta...
echo Open http://localhost:5173 in your browser
echo.
call backend\venv\Scripts\activate.bat
start "" cmd /k "cd /d "%~dp0backend" && ..\backend\venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"
timeout /t 2 /nobreak >nul
start "" cmd /k "cd /d "%~dp0frontend" && npm run dev"
timeout /t 3 /nobreak >nul
start http://localhost:5173
