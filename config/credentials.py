import os
from typing import Optional
from pydantic import BaseSettings, validator
from dotenv import load_dotenv

load_dotenv()

class DatabaseConfig(BaseSettings):
    """Database configuration settings"""
    host: str = os.getenv("DB_HOST", "localhost")
    port: int = int(os.getenv("DB_PORT", "5432"))
    name: str = os.getenv("DB_NAME", "coinquest")
    user: str = os.getenv("DB_USER", "admin")
    password: str = os.getenv("DB_PASSWORD", "")
    
    @property
    def url(self) -> str:
        return f"postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.name}"

class RedisConfig(BaseSettings):
    """Redis configuration for caching and sessions"""
    host: str = os.getenv("REDIS_HOST", "localhost")
    port: int = int(os.getenv("REDIS_PORT", "6379"))
    password: Optional[str] = os.getenv("REDIS_PASSWORD")
    db: int = int(os.getenv("REDIS_DB", "0"))
    
    @property
    def url(self) -> str:
        if self.password:
            return f"redis://:{self.password}@{self.host}:{self.port}/{self.db}"
        return f"redis://{self.host}:{self.port}/{self.db}"

class SecurityConfig(BaseSettings):
    """Security and authentication settings"""
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    refresh_token_expire_days: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

class AppConfig(BaseSettings):
    """Main application configuration"""
    app_name: str = "CoinQuest Finance Tracker"
    version: str = "1.0.0"
    debug: bool = os.getenv("DEBUG", "False").lower() == "true"
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    
    # CORS settings
    cors_origins: list = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:8080").split(",")
    
    # File upload settings
    max_file_size: int = int(os.getenv("MAX_FILE_SIZE", "10485760"))  # 10MB
    upload_dir: str = os.getenv("UPLOAD_DIR", "uploads")

# Global configuration instances
db_config = DatabaseConfig()
redis_config = RedisConfig()
security_config = SecurityConfig()
app_config = AppConfig()

# Validation
def validate_config():
    """Validate that all required configuration is present"""
    required_vars = [
        ("DB_HOST", db_config.host),
        ("DB_NAME", db_config.name),
        ("DB_USER", db_config.user),
        ("SECRET_KEY", security_config.secret_key),
    ]
    
    missing_vars = []
    for var_name, var_value in required_vars:
        if not var_value or var_value == "your-secret-key-change-in-production":
            missing_vars.append(var_name)
    
    if missing_vars:
        raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

# Export all configs
__all__ = [
    "db_config",
    "redis_config", 
    "security_config",
    "app_config",
    "validate_config"
]