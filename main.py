from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.api import auth, system, logs, wifi_pentest, bluetooth_pentest, nrf24_pentest

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(system.router, prefix="/api/v1/system", tags=["system"])
app.include_router(logs.router, prefix="/api/v1/logs", tags=["logs"])
app.include_router(wifi_pentest.router, prefix="/api/v1/wifi/pentest", tags=["wifi_pentest"])
app.include_router(bluetooth_pentest.router, prefix="/api/v1/bluetooth/pentest", tags=["bluetooth_pentest"])
app.include_router(nrf24_pentest.router, prefix="/api/v1/nrf24/pentest", tags=["nrf24_pentest"])

# Mount static files
app.mount("/", StaticFiles(directory="frontend", html=True), name="static") 