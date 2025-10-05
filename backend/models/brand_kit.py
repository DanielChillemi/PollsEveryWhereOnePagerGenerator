"""
Brand Kit Model
===============

MongoDB document schema for user brand profiles/kits.
Stores brand identity including colors, typography, assets, and voice.
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from bson import ObjectId


class PyObjectId(str):
    """Custom Pydantic type for MongoDB ObjectId."""

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


class ColorPalette(BaseModel):
    """Brand color palette configuration."""
    primary: str = Field(..., pattern=r'^#[0-9A-Fa-f]{6}$', description="Primary brand color (hex)")
    secondary: str = Field(..., pattern=r'^#[0-9A-Fa-f]{6}$', description="Secondary brand color (hex)")
    accent: str = Field(..., pattern=r'^#[0-9A-Fa-f]{6}$', description="Accent color (hex)")
    text: str = Field(default="#333333", pattern=r'^#[0-9A-Fa-f]{6}$', description="Text color (hex)")
    background: str = Field(default="#FFFFFF", pattern=r'^#[0-9A-Fa-f]{6}$', description="Background color (hex)")


class Typography(BaseModel):
    """Brand typography configuration."""
    heading_font: str = Field(default="Arial", description="Font family for headings")
    body_font: str = Field(default="Arial", description="Font family for body text")
    heading_size: str = Field(default="32px", description="Default heading font size")
    body_size: str = Field(default="16px", description="Default body font size")


class TargetAudience(BaseModel):
    """Target audience persona."""
    name: str = Field(..., min_length=1, max_length=100, description="Audience segment name")
    description: str = Field(..., min_length=1, max_length=500, description="Audience description")


class BrandAsset(BaseModel):
    """Brand asset (logo, image, etc.)."""
    url: str = Field(..., description="Asset URL (S3, CDN, etc.)")
    type: str = Field(..., description="Asset type (logo, image, icon)")
    name: str = Field(..., min_length=1, max_length=100, description="Asset name")


class BrandKitBase(BaseModel):
    """Base brand kit fields."""
    company_name: str = Field(..., min_length=1, max_length=200, description="Company name")
    brand_voice: Optional[str] = Field(None, max_length=1000, description="Brand voice and tone description")
    target_audiences: List[TargetAudience] = Field(default_factory=list, description="Target audience personas")
    color_palette: ColorPalette
    typography: Typography = Field(default_factory=Typography)
    logo_url: Optional[str] = None
    assets: List[BrandAsset] = Field(default_factory=list, description="Brand assets")


class BrandKitCreate(BrandKitBase):
    """Brand kit creation schema."""
    pass


class BrandKitUpdate(BaseModel):
    """Brand kit update schema (all fields optional)."""
    company_name: Optional[str] = Field(None, min_length=1, max_length=200)
    brand_voice: Optional[str] = Field(None, max_length=1000)
    target_audiences: Optional[List[TargetAudience]] = None
    color_palette: Optional[ColorPalette] = None
    typography: Optional[Typography] = None
    logo_url: Optional[str] = None
    assets: Optional[List[BrandAsset]] = None


class BrandKitInDB(BrandKitBase):
    """
    Brand kit document as stored in MongoDB.

    Includes all fields stored in the database including
    metadata and user reference.
    """
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: PyObjectId = Field(..., description="Reference to user who owns this brand kit")
    is_active: bool = Field(default=True, description="Soft delete flag")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }
    )


class BrandKitResponse(BaseModel):
    """
    Brand kit response schema for API responses.

    Excludes internal fields and formats for client consumption.
    """
    id: str = Field(alias="_id")
    user_id: str
    company_name: str
    brand_voice: Optional[str]
    target_audiences: List[TargetAudience]
    color_palette: ColorPalette
    typography: Typography
    logo_url: Optional[str]
    assets: List[BrandAsset]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={
            datetime: lambda dt: dt.isoformat()
        }
    )


def brand_kit_helper(brand_kit: dict) -> dict:
    """
    Convert MongoDB brand kit document to API response format.

    Transforms _id and user_id to strings.

    Args:
        brand_kit: Raw brand kit document from MongoDB

    Returns:
        dict: Formatted brand kit data for API response
    """
    return {
        "_id": str(brand_kit["_id"]),
        "user_id": str(brand_kit["user_id"]),
        "company_name": brand_kit["company_name"],
        "brand_voice": brand_kit.get("brand_voice"),
        "target_audiences": brand_kit.get("target_audiences", []),
        "color_palette": brand_kit["color_palette"],
        "typography": brand_kit.get("typography", {
            "heading_font": "Arial",
            "body_font": "Arial",
            "heading_size": "32px",
            "body_size": "16px"
        }),
        "logo_url": brand_kit.get("logo_url"),
        "assets": brand_kit.get("assets", []),
        "is_active": brand_kit.get("is_active", True),
        "created_at": brand_kit["created_at"],
        "updated_at": brand_kit["updated_at"]
    }
