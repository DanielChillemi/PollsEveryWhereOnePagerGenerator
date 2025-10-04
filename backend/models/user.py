"""
User Model
==========

MongoDB user document schema with email, password, profile data,
and Brand Kit reference.
"""

from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, Any
from datetime import datetime, timezone
from bson import ObjectId


class PyObjectId(str):
    """
    Custom Pydantic type for MongoDB ObjectId.
    
    Allows Pydantic models to work with MongoDB's _id field.
    """
    
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type: Any, handler):
        from pydantic_core import core_schema
        return core_schema.union_schema([
            core_schema.is_instance_schema(ObjectId),
            core_schema.chain_schema([
                core_schema.str_schema(),
                core_schema.no_info_plain_validator_function(cls.validate),
            ])
        ])
    
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)


class UserBase(BaseModel):
    """Base user fields shared across schemas."""
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=100)


class UserCreate(UserBase):
    """User creation schema with password."""
    password: str = Field(..., min_length=8, max_length=100)


class UserInDB(UserBase):
    """
    User document as stored in MongoDB.
    
    Includes all fields stored in the database including
    hashed password and metadata.
    """
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    hashed_password: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    brand_kit_id: Optional[str] = None
    
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }
    )


class UserResponse(UserBase):
    """
    User response schema for API responses.
    
    Excludes sensitive information like hashed_password.
    """
    id: str = Field(alias="_id")
    is_active: bool
    created_at: datetime
    updated_at: datetime
    brand_kit_id: Optional[str] = None
    
    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={
            datetime: lambda dt: dt.isoformat()
        }
    )


class UserUpdate(BaseModel):
    """User update schema for profile modifications."""
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    brand_kit_id: Optional[str] = None


def user_helper(user: dict) -> dict:
    """
    Convert MongoDB user document to API response format.
    
    Transforms _id to string and removes sensitive fields.
    
    Args:
        user: Raw user document from MongoDB
        
    Returns:
        dict: Formatted user data for API response
    """
    return {
        "_id": str(user["_id"]),
        "email": user["email"],
        "full_name": user["full_name"],
        "is_active": user.get("is_active", True),
        "created_at": user["created_at"],
        "updated_at": user["updated_at"],
        "brand_kit_id": user.get("brand_kit_id"),
    }
