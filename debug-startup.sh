#!/bin/bash

# Debug startup script for troubleshooting
set -x  # Enable debug mode

echo "=== CoinQuest Debug Startup ==="
echo "Date: $(date)"
echo "User: $(whoami)"
echo "Working directory: $(pwd)"
echo "Environment variables:"
env | grep -E "(NODE|HOST|PORT|DATABASE)" | sort

# Check if required commands exist
echo "=== Checking required commands ==="
which node || echo "ERROR: node not found"
which npm || echo "ERROR: npm not found"
which python3 || echo "ERROR: python3 not found"
which pip3 || echo "ERROR: pip3 not found"

# Check versions
echo "=== Versions ==="
node --version || echo "Node version check failed"
npm --version || echo "NPM version check failed"
python3 --version || echo "Python version check failed"

# Check if files exist
echo "=== Checking files ==="
ls -la /appdata/ || echo "ERROR: /appdata directory not accessible"
ls -la /appdata/package.json || echo "ERROR: package.json not found"
ls -la /appdata/requirements.txt || echo "ERROR: requirements.txt not found"

# Check network connectivity
echo "=== Network check ==="
ping -c 1 8.8.8.8 || echo "No internet connectivity"

# Check if port 8081 is available
echo "=== Port check ==="
netstat -tuln | grep 8081 || echo "Port 8081 is available"

echo "=== Debug complete ==="