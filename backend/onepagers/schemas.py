"""
One-Pager API Schemas
======================

Pydantic request/response models for one-pager endpoints.
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum


class OnePagerStatus(str, Enum):
    """One-pager status values."""
    WIREFRAME = "wireframe"
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class ContentSection(BaseModel):
    """Content section within a one-pager."""
    id: str = Field(description="Section identifier")
    type: str = Field(description="Section type (hero, features, testimonials, etc.)")
    title: Optional[str] = Field(None, description="Section title")
    content: Union[str, List[str], Dict[str, Any]] = Field(
        default_factory=dict, 
        description="Section content (text string, list of items, or structured dict)"
    )
    order: int = Field(description="Display order")


class OnePagerContent(BaseModel):
    """One-pager content structure."""
    headline: str = Field(description="Main headline")
    subheadline: Optional[str] = Field(None, description="Supporting subheadline")
    sections: List[ContentSection] = Field(default_factory=list, description="Content sections")

    # New structured fields from user journey
    problem: Optional[str] = Field(None, description="Problem statement")
    solution: Optional[str] = Field(None, description="Solution statement")
    features: List[str] = Field(default_factory=list, description="Product features")
    benefits: List[str] = Field(default_factory=list, description="Product benefits")
    integrations: List[str] = Field(default_factory=list, description="Integration names")
    social_proof: Optional[str] = Field(None, description="Testimonials or social proof")
    cta: Optional[Dict[str, str]] = Field(None, description="Call-to-action data")
    visuals: List[Dict[str, str]] = Field(default_factory=list, description="Images and visuals")


class LayoutBlock(BaseModel):
    """Layout block positioning."""
    block_id: str = Field(description="Block identifier")
    type: str = Field(description="Block type")
    position: Dict[str, Any] = Field(description="Position coordinates")
    size: Dict[str, Any] = Field(description="Block dimensions")
    order: int = Field(description="Display order")


class GenerationMetadata(BaseModel):
    """AI generation metadata."""
    prompts: List[str] = Field(default_factory=list, description="User prompts")
    iterations: int = Field(default=0, description="Number of iterations")
    ai_model: str = Field(description="AI model used")
    last_generated_at: datetime = Field(description="Last generation timestamp")


class VersionSnapshot(BaseModel):
    """Version history snapshot."""
    version: int = Field(description="Version number")
    content: OnePagerContent = Field(description="Content at this version")
    layout: List[LayoutBlock] = Field(description="Layout at this version")
    created_at: datetime = Field(description="When this version was created")
    change_description: Optional[str] = Field(None, description="What changed")


# Request Models

class CTAData(BaseModel):
    """Call-to-action data."""
    text: str = Field(..., description="CTA button text")
    url: str = Field(..., description="CTA URL")


class VisualData(BaseModel):
    """Visual/image data."""
    url: str = Field(..., description="Image URL")
    type: str = Field(default="image", description="Visual type")
    alt_text: Optional[str] = Field(None, description="Alt text for accessibility")


class OnePagerCreate(BaseModel):
    """Request model for creating a new one-pager."""
    title: str = Field(..., min_length=1, max_length=200, description="One-pager title")

    # Product selection (optional - will preload fields if provided)
    product_id: Optional[str] = Field(None, description="Product ID from Brand Kit")

    # Core content fields (can be preloaded from product or entered manually)
    problem: str = Field(..., min_length=10, max_length=2000, description="Problem statement")
    solution: str = Field(..., min_length=10, max_length=2000, description="Solution statement")
    features: List[str] = Field(default_factory=list, description="Product features")
    benefits: List[str] = Field(default_factory=list, description="Product benefits")

    # Optional fields
    integrations: Optional[List[str]] = Field(None, description="Integration names")
    social_proof: Optional[str] = Field(None, max_length=1000, description="Testimonials or social proof")
    cta: CTAData = Field(..., description="Call-to-action")
    visuals: List[VisualData] = Field(default_factory=list, description="Images and visuals")

    # Brand and audience
    brand_kit_id: Optional[str] = Field(None, description="Brand kit ID to use")
    target_audience: Optional[str] = Field(None, max_length=500, description="Target audience")

    # AI generation (optional - for custom AI prompts)
    input_prompt: Optional[str] = Field(
        None,
        max_length=2000,
        description="Additional AI generation prompt"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Product Launch One-Pager",
                "product_id": "abc123",
                "problem": "Marketing teams struggle to create professional collateral quickly",
                "solution": "Our AI-powered tool generates marketing one-pagers in minutes",
                "features": ["AI content generation", "Brand kit integration", "PDF export"],
                "benefits": ["Save 10 hours per week", "Consistent branding", "Professional results"],
                "integrations": ["Canva", "Google Drive", "Slack"],
                "social_proof": "\"This tool saved us countless hours!\" - John Doe, CMO",
                "cta": {"text": "Start Free Trial", "url": "https://example.com/signup"},
                "visuals": [{"url": "https://example.com/hero.jpg", "type": "hero"}],
                "brand_kit_id": "507f1f77bcf86cd799439011",
                "target_audience": "Marketing managers in SMBs"
            }
        }


class OnePagerUpdate(BaseModel):
    """Request model for updating one-pager metadata."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    status: Optional[OnePagerStatus] = None
    style_overrides: Optional[Dict[str, Any]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Updated Title",
                "status": "draft",
                "style_overrides": {"primary_color": "#0ea5e9"}
            }
        }


class OnePagerIterate(BaseModel):
    """Request model for iterative refinement with AI."""
    feedback: str = Field(
        ..., 
        min_length=5, 
        max_length=1000,
        description="User feedback for refinement"
    )
    iteration_type: str = Field(
        default="content",
        description="What to iterate: content, layout, or both"
    )
    preserve_elements: Optional[List[str]] = Field(
        None,
        description="Element IDs to preserve unchanged"
    )
    
    @validator('iteration_type')
    def validate_iteration_type(cls, v):
        """Validate iteration type."""
        allowed = ["content", "layout", "both"]
        if v not in allowed:
            raise ValueError(f"iteration_type must be one of: {', '.join(allowed)}")
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "feedback": "Make the headline more attention-grabbing and add pricing section",
                "iteration_type": "content",
                "preserve_elements": ["header-1", "footer-1"]
            }
        }


# Response Models

class OnePagerSummary(BaseModel):
    """Summary view for list endpoints."""
    id: str = Field(description="One-pager ID")
    title: str = Field(description="One-pager title")
    status: str = Field(description="Current status")
    created_at: datetime = Field(description="Creation timestamp")
    updated_at: datetime = Field(description="Last update timestamp")
    has_brand_kit: bool = Field(description="Whether linked to a brand kit")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "title": "Product Launch One-Pager",
                "status": "draft",
                "created_at": "2024-01-15T10:30:00Z",
                "updated_at": "2024-01-15T14:20:00Z",
                "has_brand_kit": True
            }
        }


class OnePagerResponse(BaseModel):
    """Full response model for one-pager endpoints."""
    id: str = Field(description="One-pager ID")
    user_id: str = Field(description="Owner user ID")
    brand_kit_id: Optional[str] = Field(None, description="Linked brand kit ID")
    title: str = Field(description="One-pager title")
    status: str = Field(description="Current status")
    content: OnePagerContent = Field(description="One-pager content")
    layout: List[LayoutBlock] = Field(description="Layout blocks")
    style_overrides: Dict[str, Any] = Field(default_factory=dict, description="Style overrides")
    generation_metadata: GenerationMetadata = Field(description="AI generation metadata")
    version_history: List[VersionSnapshot] = Field(default_factory=list, description="Version history")
    created_at: datetime = Field(description="Creation timestamp")
    updated_at: datetime = Field(description="Last update timestamp")
    last_accessed: datetime = Field(description="Last access timestamp")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "user_id": "507f191e810c19729de860ea",
                "brand_kit_id": "507f1f77bcf86cd799439012",
                "title": "Product Launch One-Pager",
                "status": "draft",
                "content": {
                    "headline": "Revolutionize Your Workflow",
                    "subheadline": "The all-in-one solution for modern teams",
                    "sections": []
                },
                "layout": [],
                "style_overrides": {},
                "generation_metadata": {
                    "prompts": ["Create a product launch one-pager"],
                    "iterations": 2,
                    "ai_model": "gpt-4",
                    "last_generated_at": "2024-01-15T14:20:00Z"
                },
                "version_history": [],
                "created_at": "2024-01-15T10:30:00Z",
                "updated_at": "2024-01-15T14:20:00Z",
                "last_accessed": "2024-01-15T15:00:00Z"
            }
        }


# Re-export models for convenience
__all__ = [
    "OnePagerCreate",
    "OnePagerUpdate",
    "OnePagerIterate",
    "OnePagerResponse",
    "OnePagerSummary",
    "OnePagerStatus",
    "ContentSection",
    "OnePagerContent",
    "LayoutBlock",
    "GenerationMetadata",
    "VersionSnapshot",
    "CTAData",
    "VisualData"
]
