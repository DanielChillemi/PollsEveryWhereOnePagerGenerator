"""
Brand Profile/Kit Models
========================

Pydantic models for user brand kits.
TODO: Expand in Phase 2 when building Brand Hub CRUD APIs.
"""

from pydantic import BaseModel, Field
from typing import Optional


class BrandProfile(BaseModel):
    """
    Brand Kit information (simplified for translator service).
    
    This is a placeholder model for the translator service.
    Will be expanded with MongoDB integration in Phase 2.2.
    """
    primary_color: str = Field(
        default="#007ACC",
        description="Primary brand color (Poll Everywhere Blue)"
    )
    secondary_color: Optional[str] = Field(
        None,
        description="Secondary brand color"
    )
    accent_color: Optional[str] = Field(
        None,
        description="Accent brand color"
    )
    text_color: str = Field(
        default="#333333",
        description="Default text color"
    )
    background_color: str = Field(
        default="#FFFFFF",
        description="Default background color"
    )
    primary_font: str = Field(
        default="Source Sans Pro",
        description="Primary font family (Poll Everywhere brand)"
    )
    secondary_font: Optional[str] = Field(
        None,
        description="Secondary font family"
    )
    logo_url: Optional[str] = Field(
        None,
        description="Brand logo URL"
    )
    brand_voice: Optional[str] = Field(
        None,
        description="Brand voice description for AI generation"
    )
