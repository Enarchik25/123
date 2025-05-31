from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.api import auth, system, logs

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

# Mount static files
app.mount("/", StaticFiles(directory="frontend", html=True), name="static") 