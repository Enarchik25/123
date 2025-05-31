from pydantic import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Основные настройки
    APP_NAME: str = "OrangePi Security Tool"
    DEBUG: bool = False
    
    # Настройки API
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-here"  # Изменить при деплое
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 дней
    
    # База данных
    SQLITE_URL: str = "sqlite:///./security_tool.db"
    
    # WiFi настройки
    WIFI_AP_SSID: str = "OrangePi-Security"
    WIFI_AP_PASSWORD: Optional[str] = None
    
    # Настройки обновлений
    GITHUB_REPO: str = "your-repo/security-tool"
    CHECK_UPDATE_ON_START: bool = True
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings() 