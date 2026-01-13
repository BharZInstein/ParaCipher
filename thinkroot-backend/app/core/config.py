import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "mock-secret-key")
    JWT_EXPIRY: int = int(os.getenv("JWT_EXPIRY", "24"))
    
    # API Settings
    API_TITLE: str = "ParaCipher MVP Backend"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "Mock backend for ParaCipher MVP - instant insurance for gig workers"
    
    # CORS
    ALLOWED_ORIGINS: list = ["*"]


settings = Settings()
