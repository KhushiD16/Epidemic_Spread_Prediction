@echo off
REM Epidemic Spread Prediction - Windows Setup Script

echo.
echo ========================================
echo Epidemic Spread Prediction Setup
echo ========================================
echo.

REM Check Python
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.10+ from https://www.python.org
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo ✓ Python found: 
python --version

echo ✓ Node.js found:
node --version

echo.
echo ========================================
echo Creating Python Virtual Environment
echo ========================================
echo.

python -m venv venv
call venv\Scripts\activate.bat

echo.
echo ========================================
echo Installing Backend Dependencies
echo ========================================
echo.

pip install --upgrade pip
pip install -r requirements.txt
pip install -r backend\requirements.txt

echo.
echo ========================================
echo Installing Frontend Dependencies
echo ========================================
echo.

cd frontend
call npm install
cd ..

echo.
echo ========================================
echo ✓ Setup Complete!
echo ========================================
echo.

echo To run the application:
echo.
echo Terminal 1 - Backend:
echo   1. Activate venv: venv\Scripts\activate.bat
echo   2. Run: python backend\main.py
echo.
echo Terminal 2 - Frontend:
echo   1. Navigate: cd frontend
echo   2. Run: npm run dev
echo.

pause
