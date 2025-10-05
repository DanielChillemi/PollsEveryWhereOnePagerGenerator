"""
One-Pager Model
================

MongoDB document schema for marketing one-pager projects.
Stores content, layout, styling, and AI generation metadata.
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from bson import ObjectId
from enum import Enum


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


class OnePagerStatus(str, Enum):
    """One-pager workflow status."""
    DRAFT = "draft"
    WIREFRAME = "wireframe"
    STYLED = "styled"
    FINAL = "final"


class SectionType(str, Enum):
    """Content section types."""
    TEXT = "text"
    HEADING = "heading"
    IMAGE = "image"
    BUTTON = "button"
    LIST = "list"
    QUOTE = "quote"
    DIVIDER = "divider"


class ContentSection(BaseModel):
    """Individual content section within one-pager."""
    id: str = Field(..., description="Unique section identifier")
    type: SectionType
    content: Any = Field(..., description="Section content (varies by type)")
    order: int = Field(default=0, description="Display order")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")


class OnePagerContent(BaseModel):
    """One-pager content structure."""
    headline: str = Field(..., min_length=1, max_length=200, description="Main headline")
    subheadline: Optional[str] = Field(None, max_length=300, description="Subheadline")
    sections: List[ContentSection] = Field(default_factory=list, description="Content sections")


class LayoutBlock(BaseModel):
    """Layout block configuration."""
    block_id: str = Field(..., description="Unique block identifier")
    type: str = Field(..., description="Block type (header, section, footer, etc.)")
    position: Dict[str, int] = Field(default_factory=dict, description="Position {x, y}")
    size: Dict[str, str] = Field(default_factory=dict, description="Size {width, height}")
    order: int = Field(default=0, description="Display order")


class GenerationMetadata(BaseModel):
    """AI generation tracking metadata."""
    prompts: List[str] = Field(default_factory=list, description="User prompts history")
    iterations: int = Field(default=0, description="Number of refinement iterations")
    ai_model: str = Field(default="gpt-4-turbo-preview", description="AI model used")
    last_generated_at: Optional[datetime] = None


class VersionSnapshot(BaseModel):
    """Version history snapshot."""
    version: int = Field(..., description="Version number")
    snapshot: Dict[str, Any] = Field(..., description="Full state snapshot")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    description: str = Field(default="", max_length=200, description="Change description")


class OnePagerBase(BaseModel):
    """Base one-pager fields."""
    title: str = Field(..., min_length=1, max_length=200, description="One-pager title")
    status: OnePagerStatus = Field(default=OnePagerStatus.DRAFT)
    content: OnePagerContent
    layout: List[LayoutBlock] = Field(default_factory=list, description="Layout configuration")
    style_overrides: Dict[str, Dict[str, Any]] = Field(
        default_factory=dict,
        description="Manual style overrides by element ID"
    )


class OnePagerCreate(BaseModel):
    """One-pager creation request."""
    title: str = Field(..., min_length=1, max_length=200)
    input_prompt: str = Field(..., min_length=10, max_length=2000, description="AI generation prompt")
    brand_kit_id: Optional[str] = None
    target_audience: Optional[str] = Field(None, max_length=200)


class OnePagerUpdate(BaseModel):
    """One-pager update schema (all fields optional)."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    status: Optional[OnePagerStatus] = None
    content: Optional[OnePagerContent] = None
    layout: Optional[List[LayoutBlock]] = None
    style_overrides: Optional[Dict[str, Dict[str, Any]]] = None


class OnePagerIterate(BaseModel):
    """One-pager iteration request."""
    feedback: Optional[str] = Field(None, min_length=1, max_length=2000, description="User feedback for AI")
    layout_changes: Optional[List[LayoutBlock]] = Field(None, description="Direct layout modifications")
    style_overrides: Optional[Dict[str, Dict[str, Any]]] = Field(None, description="Style override updates")
    apply_brand_styles: bool = Field(default=False, description="Toggle styled mode")


class OnePagerInDB(OnePagerBase):
    """
    One-pager document as stored in MongoDB.

    Includes all fields stored in the database including
    metadata, user reference, and version history.
    """
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: PyObjectId = Field(..., description="Reference to user who owns this one-pager")
    brand_kit_id: Optional[PyObjectId] = Field(None, description="Reference to associated brand kit")
    generation_metadata: GenerationMetadata = Field(default_factory=GenerationMetadata)
    version_history: List[VersionSnapshot] = Field(default_factory=list, description="Version snapshots")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_accessed: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }
    )


class OnePagerResponse(BaseModel):
    """
    One-pager response schema for API responses.

    Full one-pager document formatted for client consumption.
    """
    id: str = Field(alias="_id")
    user_id: str
    brand_kit_id: Optional[str]
    title: str
    status: OnePagerStatus
    content: OnePagerContent
    layout: List[LayoutBlock]
    style_overrides: Dict[str, Dict[str, Any]]
    generation_metadata: GenerationMetadata
    version_history: List[VersionSnapshot]
    created_at: datetime
    updated_at: datetime
    last_accessed: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={
            datetime: lambda dt: dt.isoformat()
        }
    )


class OnePagerSummary(BaseModel):
    """
    One-pager summary for list views.

    Lightweight response excluding full content and layout.
    """
    id: str = Field(alias="_id")
    title: str
    status: OnePagerStatus
    created_at: datetime
    updated_at: datetime
    iterations: int = Field(default=0, description="Number of AI iterations")

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={
            datetime: lambda dt: dt.isoformat()
        }
    )


def onepager_helper(onepager: dict) -> dict:
    """
    Convert MongoDB one-pager document to API response format.

    Transforms ObjectIds to strings and formats nested data.

    Args:
        onepager: Raw one-pager document from MongoDB

    Returns:
        dict: Formatted one-pager data for API response
    """
    return {
        "_id": str(onepager["_id"]),
        "user_id": str(onepager["user_id"]),
        "brand_kit_id": str(onepager["brand_kit_id"]) if onepager.get("brand_kit_id") else None,
        "title": onepager["title"],
        "status": onepager["status"],
        "content": onepager["content"],
        "layout": onepager.get("layout", []),
        "style_overrides": onepager.get("style_overrides", {}),
        "generation_metadata": onepager.get("generation_metadata", {
            "prompts": [],
            "iterations": 0,
            "ai_model": "gpt-4-turbo-preview",
            "last_generated_at": None
        }),
        "version_history": onepager.get("version_history", []),
        "created_at": onepager["created_at"],
        "updated_at": onepager["updated_at"],
        "last_accessed": onepager.get("last_accessed", onepager["updated_at"])
    }


def onepager_summary_helper(onepager: dict) -> dict:
    """
    Convert MongoDB one-pager document to summary format.

    Args:
        onepager: Raw one-pager document from MongoDB

    Returns:
        dict: Formatted one-pager summary for list views
    """
    generation_meta = onepager.get("generation_metadata", {})
    return {
        "_id": str(onepager["_id"]),
        "title": onepager["title"],
        "status": onepager["status"],
        "created_at": onepager["created_at"],
        "updated_at": onepager["updated_at"],
        "iterations": generation_meta.get("iterations", 0)
    }
