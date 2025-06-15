#!/bin/bash

# Directory where the app will be stored
APP_DIR="/mnt/user/appdata/coinquest"

# GitHub repository URL
REPO_URL="https://github.com/taggara/CoinQuest"

# Branch to pull
BRANCH="quality"

# Check if the directory exists, if not clone the repository
if [ ! -d "$APP_DIR" ]; then
    git clone -b $BRANCH $REPO_URL $APP_DIR
else
    cd $APP_DIR
    git pull origin $BRANCH
fi

# Install dependencies and build the app
cd $APP_DIR
npm install
npm run dev

# Start the app
#npm start