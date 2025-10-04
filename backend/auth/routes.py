"""
Authentication Routes
=====================

API endpoints for user authentication:
- POST /auth/signup - User registration
- POST /auth/login - User login with credentials
- POST /auth/refresh - Refresh access token
- GET /auth/me - Get current user profile
"""

from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone, timedelta
from bson import ObjectId

from backend.auth.schemas import (
    UserSignupRequest,
    TokenResponse,
    RefreshTokenRequest,
    UserProfileResponse,
    ErrorResponse
)
from backend.auth.utils import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_refresh_token
)
from backend.auth.dependencies import get_current_active_user
from backend.database.mongodb import get_db
from backend.models.user import UserInDB, user_helper
from backend.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/signup",
    response_model=UserProfileResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        409: {"model": ErrorResponse, "description": "Email already registered"},
        400: {"model": ErrorResponse, "description": "Invalid request data"}
    }
)
async def signup(
    user_data: UserSignupRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Register a new user account.
    
    Creates a new user with hashed password and default settings.
    Email must be unique across all users.
    
    **Request Body:**
    - email: Valid email address
    - password: Minimum 8 characters
    - full_name: User's full name (1-100 characters)
    
    **Returns:**
    - User profile data (excludes password)
    
    **Errors:**
    - 409: Email already registered
    - 400: Invalid input data
    """
    # Check if email already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    
    # Create user document
    now = datetime.now(timezone.utc)
    user_doc = {
        "email": user_data.email,
        "hashed_password": hash_password(user_data.password),
        "full_name": user_data.full_name,
        "is_active": True,
        "created_at": now,
        "updated_at": now,
        "brand_kit_id": None
    }
    
    # Insert into database
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    
    # Return user profile (excluding password)
    return user_helper(user_doc)


@router.post(
    "/login",
    response_model=TokenResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Invalid credentials"},
        403: {"model": ErrorResponse, "description": "Inactive account"}
    }
)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Authenticate user and return JWT tokens.
    
    Uses OAuth2 password flow. The 'username' field should contain
    the user's email address.
    
    **Request Body (form-data):**
    - username: User's email address
    - password: User's password
    
    **Returns:**
    - access_token: Short-lived JWT for API access (30 minutes)
    - refresh_token: Long-lived JWT for obtaining new access tokens (7 days)
    - token_type: "bearer"
    - expires_in: Access token expiration in seconds
    
    **Errors:**
    - 401: Invalid email or password
    - 403: User account is inactive
    """
    # Find user by email (OAuth2 uses 'username' field)
    user = await db.users.find_one({"email": form_data.username})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account"
        )
    
    # Create tokens
    user_id = str(user["_id"])
    token_data = {"user_id": user_id, "email": user["email"]}
    
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token({"user_id": user_id})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60
    )


@router.post(
    "/refresh",
    response_model=TokenResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Invalid or expired refresh token"}
    }
)
async def refresh_access_token(
    request: RefreshTokenRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Obtain a new access token using a refresh token.
    
    Use this endpoint when the access token expires to get a new one
    without requiring the user to log in again.
    
    **Request Body:**
    - refresh_token: Valid JWT refresh token from login
    
    **Returns:**
    - New access_token and the same refresh_token
    - token_type: "bearer"
    - expires_in: Access token expiration in seconds
    
    **Errors:**
    - 401: Invalid, expired, or malformed refresh token
    """
    # Decode and verify refresh token
    payload = decode_refresh_token(request.refresh_token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token payload"
        )
    
    # Verify user still exists and is active
    if not ObjectId.is_valid(user_id):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID"
        )
    
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user or not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Create new access token
    token_data = {"user_id": user_id, "email": user["email"]}
    new_access_token = create_access_token(token_data)
    
    return TokenResponse(
        access_token=new_access_token,
        refresh_token=request.refresh_token,  # Return same refresh token
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60
    )


@router.get(
    "/me",
    response_model=UserProfileResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Not authenticated"}
    }
)
async def get_current_user_profile(
    current_user: UserInDB = Depends(get_current_active_user)
):
    """
    Get current authenticated user's profile.
    
    Protected endpoint that requires valid JWT access token in
    Authorization header: `Bearer <access_token>`
    
    **Returns:**
    - User profile data including:
      - id, email, full_name
      - is_active, created_at, updated_at
      - brand_kit_id (if configured)
    
    **Errors:**
    - 401: No token provided or invalid token
    - 403: User account is inactive
    """
    # Convert UserInDB to dict and format for response
    user_dict = {
        "_id": str(current_user.id) if current_user.id else "",
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at,
        "updated_at": current_user.updated_at,
        "brand_kit_id": current_user.brand_kit_id
    }
    
    return UserProfileResponse(**user_dict)
