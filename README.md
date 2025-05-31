# Orange Pi Zero 3 Monitoring Application

A comprehensive monitoring and control application for Orange Pi Zero 3, featuring:

## Features

### Backend (Python + FastAPI)
- WiFi manager for access point creation
- Bluetooth device scanner
- System updates via GitHub
- System monitoring (CPU, memory, disk, temperature)
- Security with JWT authentication
- Rotating file logging system
- RESTful API endpoints

### Frontend (React + Material-UI)
- Dark theme
- PWA support
- User authentication
- WiFi status monitoring
- Bluetooth scanning interface
- Update management
- System resource monitoring with graphs
- Log viewer by categories

### System Components
- Systemd service for auto-start
- Automatic hostapd and dnsmasq configuration
- Backup system
- Installation scripts

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Enarchik25/orangepi-zero3-app.git
cd orangepi-zero3-app
```

2. Run the installation script:
```bash
sudo ./scripts/install.sh
```

3. Access the web interface at http://192.168.4.1:8000

## Default Credentials
- Username: admin
- Password: admin

**Important:** Change the default password after first login!

## API Documentation

API documentation is available at http://192.168.4.1:8000/docs

## Development

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## License

MIT License 