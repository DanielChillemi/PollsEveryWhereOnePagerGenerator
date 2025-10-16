"""
Application Configuration
=========================

Centralized configuration management using Pydantic BaseSettings.
Loads environment variables for JWT secrets, MongoDB connection,
CORS settings, and external API keys.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
from functools import lru_cache


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    
    Uses pydantic-settings to automatically load from .env file
    and validate configuration values.
    """
    
    # Server Configuration
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_env: str = "development"
    
    # Database Configuration
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "marketing_onepager"
    
    # JWT Authentication
    jwt_secret_key: str = "dev-secret-key-change-in-production"
    jwt_refresh_secret_key: str = "dev-refresh-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 480  # 8 hours
    refresh_token_expire_days: int = 7
    
    # CORS Configuration
    frontend_url: str = "http://localhost:5173"
    
    @property
    def cors_origins(self) -> List[str]:
        """Parse comma-separated CORS origins into list."""
        return [origin.strip() for origin in self.frontend_url.split(",")]
    
    # Canva Connect API
    canva_api_base_url: str = "https://api.canva.com/rest"
    canva_client_id: str = ""
    canva_client_secret: str = ""
    canva_redirect_uri: str = "http://localhost:8000/api/v1/canva/callback"
    canva_access_token: str = ""
    
    # AI Integration
    openai_api_key: str = ""  # OpenAI API key (required)
    ai_model_name: str = "gpt-4-turbo-preview"  # Options: gpt-4-turbo-preview, gpt-3.5-turbo, gpt-4

    # Alternative AI providers (future use)
    huggingface_api_token: str = ""  # Hugging Face API token
    gemini_api_key: str = ""  # Google Gemini API key
    
    # Logging
    log_level: str = "INFO"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )


@lru_cache()
def get_settings() -> Settings:
    """
    Cached settings instance.
    
    Uses lru_cache to ensure settings are only loaded once
    and reused throughout the application lifecycle.
    
    Returns:
        Settings: Application configuration instance
    """
    return Settings()


# Export settings instance for convenience
settings = get_settings()
