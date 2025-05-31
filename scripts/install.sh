#!/bin/bash

# Exit on error
set -e

echo "Installing Orange Pi Zero 3 Application..."

# Update system
apt update
apt upgrade -y

# Install system dependencies
apt install -y python3-pip python3-venv git nodejs npm

# Create application directory
mkdir -p /opt/orangepi-app
cp -r ../backend /opt/orangepi-app/
cp -r ../frontend /opt/orangepi-app/

# Setup Python virtual environment
cd /opt/orangepi-app/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup frontend
cd /opt/orangepi-app/frontend
npm install
npm run build

# Setup systemd service
cp ../systemd/orangepi-app.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable orangepi-app
systemctl start orangepi-app

echo "Installation completed successfully!"
echo "The application is running at http://localhost:8000" 