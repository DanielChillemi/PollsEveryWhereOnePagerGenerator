"""
One-Pager API Schemas
======================

Pydantic request/response models for one-pager endpoints.
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
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
    content: Dict[str, Any] = Field(default_factory=dict, description="Section content")
    order: int = Field(description="Display order")


class OnePagerContent(BaseModel):
    """One-pager content structure."""
    headline: str = Field(description="Main headline")
    subheadline: Optional[str] = Field(None, description="Supporting subheadline")
    sections: List[ContentSection] = Field(default_factory=list, description="Content sections")


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

class OnePagerCreate(BaseModel):
    """Request model for creating a new one-pager."""
    title: str = Field(..., min_length=1, max_length=200, description="One-pager title")
    input_prompt: str = Field(
        ..., 
        min_length=10, 
        max_length=2000,
        description="Description for AI generation"
    )
    brand_kit_id: Optional[str] = Field(None, description="Brand kit ID to use")
    target_audience: Optional[str] = Field(None, max_length=500, description="Target audience")
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Product Launch One-Pager",
                "input_prompt": "Create a one-pager for our new SaaS product targeting IT managers",
                "brand_kit_id": "507f1f77bcf86cd799439011",
                "target_audience": "IT decision makers in mid-size companies"
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
    "VersionSnapshot"
]
