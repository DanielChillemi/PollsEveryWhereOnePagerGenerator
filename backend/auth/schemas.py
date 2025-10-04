"""
Authentication Schemas
======================

Pydantic models for request/response validation in authentication endpoints.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserSignupRequest(BaseModel):
    """
    User registration request schema.
    
    Used for POST /auth/signup endpoint.
    """
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    full_name: str = Field(..., min_length=1, max_length=100)
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "email": "sarah@example.com",
                    "password": "SecurePass123!",
                    "full_name": "Sarah Marketing"
                }
            ]
        }
    }


class UserLoginRequest(BaseModel):
    """
    User login request schema.
    
    Used for POST /auth/login endpoint.
    Follows OAuth2 password flow conventions.
    """
    username: EmailStr  # OAuth2 uses 'username' field (maps to email)
    password: str
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "username": "sarah@example.com",
                    "password": "SecurePass123!"
                }
            ]
        }
    }


class TokenResponse(BaseModel):
    """
    JWT token response schema.
    
    Returned from /auth/login and /auth/refresh endpoints.
    """
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # Seconds until access token expiration
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    "token_type": "bearer",
                    "expires_in": 1800
                }
            ]
        }
    }


class RefreshTokenRequest(BaseModel):
    """
    Refresh token request schema.
    
    Used for POST /auth/refresh endpoint to obtain new access token.
    """
    refresh_token: str
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                }
            ]
        }
    }


class UserProfileResponse(BaseModel):
    """
    User profile response schema.
    
    Returned from /auth/me endpoint.
    Excludes sensitive information.
    """
    id: str = Field(alias="_id")
    email: EmailStr
    full_name: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    brand_kit_id: Optional[str] = None
    
    model_config = {
        "populate_by_name": True,
        "json_schema_extra": {
            "examples": [
                {
                    "_id": "507f1f77bcf86cd799439011",
                    "email": "sarah@example.com",
                    "full_name": "Sarah Marketing",
                    "is_active": True,
                    "created_at": "2025-10-04T12:00:00Z",
                    "updated_at": "2025-10-04T12:00:00Z",
                    "brand_kit_id": None
                }
            ]
        }
    }


class TokenData(BaseModel):
    """
    Decoded JWT token data.
    
    Internal schema for token payload validation.
    """
    user_id: str
    email: Optional[EmailStr] = None
    type: str  # 'access' or 'refresh'


class ErrorResponse(BaseModel):
    """
    Standard error response schema.
    
    Used consistently across all error responses.
    """
    detail: str
    error_code: Optional[str] = None
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "detail": "Invalid credentials",
                    "error_code": "AUTH_001"
                }
            ]
        }
    }
