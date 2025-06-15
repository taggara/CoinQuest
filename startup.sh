#!/bin/bash

# Set error handling
set -e

# Directory where the app will be stored
APP_DIR="/appdata"

# GitHub repository URL
REPO_URL="https://github.com/taggara/CoinQuest"

# Branch to pull
BRANCH="quality"

echo "=== CoinQuest Startup Script ==="
echo "Working directory: $(pwd)"
echo "App directory: $APP_DIR"

# Check if the directory exists, if not clone the repository
if [ ! -d "$APP_DIR/.git" ]; then
    echo "Cloning repository..."
    git clone -b $BRANCH $REPO_URL $APP_DIR
else
    echo "Repository exists, pulling latest changes..."
    cd $APP_DIR
    git pull origin $BRANCH
fi

# Navigate to app directory
cd $APP_DIR
echo "Current directory: $(pwd)"

# Check if required files exist
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found!"
    exit 1
fi

if [ ! -f "requirements.txt" ]; then
    echo "ERROR: requirements.txt not found!"
    exit 1
fi

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Set environment variables
export HOST=0.0.0.0
export PORT=8081
export NODE_ENV=development

# Create data directory if it doesn't exist
mkdir -p /appdata/data

# Start the backend first
echo "Starting FastAPI backend..."
cd backend
python main.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 5

# Go back to root directory
cd /appdata

# Start the frontend
echo "Starting React frontend on port 8081..."
npm run dev &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo "Shutting down services..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

# Set trap for cleanup
trap cleanup SIGTERM SIGINT

# Wait for processes
wait