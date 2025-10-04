"""
Authentication Dependencies
===========================

FastAPI dependency injection for protected routes.
Validates JWT tokens and retrieves current user from database.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from typing import Optional

from backend.auth.utils import decode_access_token
from backend.database.mongodb import get_db
from backend.models.user import UserInDB


# OAuth2 password bearer scheme
# Points to the login endpoint where users obtain tokens
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> UserInDB:
    """
    Dependency to get current authenticated user.
    
    Validates JWT access token and retrieves user from database.
    Use this dependency in protected route handlers.
    
    Usage:
        @router.get("/protected")
        async def protected_route(current_user: UserInDB = Depends(get_current_user)):
            return {"message": f"Hello {current_user.full_name}"}
    
    Args:
        token: JWT access token from Authorization header
        db: MongoDB database instance
        
    Returns:
        UserInDB: Authenticated user object
        
    Raises:
        HTTPException: 401 if token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Decode and verify JWT token
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    # Extract user_id from token payload
    user_id: Optional[str] = payload.get("user_id")
    if user_id is None:
        raise credentials_exception
    
    # Validate ObjectId format
    if not ObjectId.is_valid(user_id):
        raise credentials_exception
    
    # Retrieve user from database
    user_doc = await db.users.find_one({"_id": ObjectId(user_id)})
    if user_doc is None:
        raise credentials_exception
    
    # Convert to UserInDB model
    user_doc["_id"] = str(user_doc["_id"])
    user = UserInDB(**user_doc)
    
    return user


async def get_current_active_user(
    current_user: UserInDB = Depends(get_current_user)
) -> UserInDB:
    """
    Dependency to get current active user.
    
    Additional check to ensure user account is active.
    Use this for routes that require active user status.
    
    Args:
        current_user: Authenticated user from get_current_user
        
    Returns:
        UserInDB: Active authenticated user
        
    Raises:
        HTTPException: 403 if user account is inactive
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account"
        )
    return current_user


async def get_optional_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> Optional[UserInDB]:
    """
    Dependency to optionally get current user.
    
    Returns user if valid token provided, None otherwise.
    Use for routes that work both authenticated and unauthenticated.
    
    Args:
        token: Optional JWT access token
        db: MongoDB database instance
        
    Returns:
        Optional[UserInDB]: User if authenticated, None otherwise
    """
    if not token:
        return None
    
    try:
        return await get_current_user(token, db)
    except HTTPException:
        return None
