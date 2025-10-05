"""
Brand Kit API Schemas
======================

Pydantic request/response models for brand kit endpoints.
"""

from pydantic import BaseModel
from typing import List
from backend.models.brand_kit import (
    BrandKitCreate,
    BrandKitUpdate,
    BrandKitResponse,
    ColorPalette,
    Typography,
    TargetAudience,
    BrandAsset
)

# Re-export models for convenience
__all__ = [
    "BrandKitCreate",
    "BrandKitUpdate",
    "BrandKitResponse",
    "ColorPalette",
    "Typography",
    "TargetAudience",
    "BrandAsset"
]
