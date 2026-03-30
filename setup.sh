#!/bin/bash

# Epidemic Spread Prediction - Linux/macOS Setup Script

set -e

echo ""
echo "========================================"
echo "Epidemic Spread Prediction Setup"
echo "========================================"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.10+ from https://www.python.org"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✓ Python found: $(python3 --version)"
echo "✓ Node.js found: $(node --version)"

echo ""
echo "========================================"
echo "Creating Python Virtual Environment"
echo "========================================"
echo ""

python3 -m venv venv
source venv/bin/activate

echo ""
echo "========================================"
echo "Installing Backend Dependencies"
echo "========================================"
echo ""

pip install --upgrade pip
pip install -r requirements.txt
pip install -r backend/requirements.txt

echo ""
echo "========================================"
echo "Installing Frontend Dependencies"
echo "========================================"
echo ""

cd frontend
npm install
cd ..

echo ""
echo "========================================"
echo "✓ Setup Complete!"
echo "========================================"
echo ""

echo "To run the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "  1. Activate venv: source venv/bin/activate"
echo "  2. Run: python backend/main.py"
echo ""
echo "Terminal 2 - Frontend:"
echo "  1. Navigate: cd frontend"
echo "  2. Run: npm run dev"
echo ""
