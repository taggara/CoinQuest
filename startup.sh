#!/bin/bash

# Directory where the app will be stored
APP_DIR="/appdata"

# GitHub repository URL
REPO_URL="https://github.com/taggara/CoinQuest"

# Branch to pull
BRANCH="quality"

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

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Set environment variables
export HOST=0.0.0.0
export PORT=8081

# Start the application
echo "Starting CoinQuest application on port 8081..."
npm start