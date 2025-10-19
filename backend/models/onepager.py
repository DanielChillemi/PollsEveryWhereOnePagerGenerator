"""
OnePager Data Models
====================

Pydantic models for one-pager layouts and elements.
Based on validated POC schema from canva-poc/json_schema.py
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any, Union, Literal
from enum import Enum
from datetime import datetime


class ElementType(str, Enum):
    """Types of elements in a one-pager."""
    HEADER = "header"
    HERO = "hero"
    FEATURES = "features"
    TESTIMONIALS = "testimonials"
    CTA = "cta"
    FOOTER = "footer"
    IMAGE = "image"
    TEXT_BLOCK = "text_block"
    # AI service-generated types
    HEADING = "heading"
    TEXT = "text"
    LIST = "list"
    BUTTON = "button"


class Dimensions(BaseModel):
    """Design dimensions in pixels."""
    width: int = Field(default=1080, ge=100, le=5000, description="Design width in pixels")
    height: int = Field(default=1920, ge=100, le=5000, description="Design height in pixels")


class Styling(BaseModel):
    """Element styling properties."""
    background_color: Optional[str] = Field(None, description="Hex color code (e.g., #0ea5e9)")
    text_color: Optional[str] = Field(None, description="Text color hex code")
    font_family: Optional[str] = Field(None, description="Font family name")
    font_size: Optional[int] = Field(None, ge=8, le=200, description="Font size in pixels")
    font_weight: Optional[str] = Field(None, description="Font weight (normal, bold, etc.)")
    text_align: Optional[str] = Field(None, description="Text alignment (left, center, right)")
    border_radius: Optional[int] = Field(None, description="Border radius in pixels")
    padding: Optional[int] = Field(None, description="Internal padding in pixels")
    
    @validator('background_color', 'text_color')
    def validate_color(cls, v):
        """Validate color format is hex."""
        if v and not (v.startswith('#') and len(v) == 7):
            raise ValueError("Color must be hex format: #RRGGBB")
        return v


class Position(BaseModel):
    """Element position in pixels."""
    x: int = Field(description="X coordinate in pixels")
    y: int = Field(description="Y coordinate in pixels")
    width: int = Field(description="Element width in pixels")
    height: int = Field(description="Element height in pixels")


# Element content models (flexible Dict for now, will expand later)
class HeaderContent(BaseModel):
    """Content for HEADER elements."""
    title: str
    subtitle: Optional[str] = None
    logo_url: Optional[str] = None


class HeroContent(BaseModel):
    """Content for HERO elements."""
    headline: str
    subheadline: Optional[str] = None
    description: str
    image_url: Optional[str] = None
    cta_text: Optional[str] = None
    cta_url: Optional[str] = None


class CTAContent(BaseModel):
    """Content for CTA elements."""
    primary_text: str
    primary_url: str
    secondary_text: Optional[str] = None
    secondary_url: Optional[str] = None
    supporting_text: Optional[str] = None


class FooterContent(BaseModel):
    """Content for FOOTER elements."""
    company_name: str
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    website_url: Optional[str] = None
    copyright_text: Optional[str] = None


class ImageContent(BaseModel):
    """Content for IMAGE elements."""
    image_url: str
    alt_text: Optional[str] = None
    caption: Optional[str] = None


class TextBlockContent(BaseModel):
    """Content for TEXT_BLOCK elements."""
    text: str
    heading_level: Optional[int] = Field(None, ge=1, le=6, description="Heading level (1-6)")


class OnePagerElement(BaseModel):
    """Single element in one-pager layout."""
    id: str = Field(description="Unique element identifier")
    type: ElementType = Field(description="Element type")
    title: Optional[str] = Field(None, description="Element title (for sections)")
    content: Union[str, List[str], Dict[str, Any]] = Field(
        description="Element content (text string, list of items, or structured dict)"
    )
    styling: Optional[Styling] = Field(None, description="Element styling overrides")
    position: Optional[Position] = Field(None, description="Element position (if absolute)")
    order: int = Field(description="Display order within the layout")
    visible: bool = Field(default=True, description="Whether element is visible")

    class Config:
        use_enum_values = True


class OnePagerLayout(BaseModel):
    """Complete one-pager layout specification."""
    title: str = Field(description="One-pager title/name")
    description: Optional[str] = Field(None, description="One-pager description")
    dimensions: Dimensions = Field(default_factory=Dimensions, description="Design dimensions")
    elements: List[OnePagerElement] = Field(description="List of design elements")
    version: int = Field(default=1, description="Layout version number")
    created_at: Optional[datetime] = Field(None, description="Creation timestamp")
    updated_at: Optional[datetime] = Field(None, description="Last update timestamp")
    
    # Brand profile reference (will connect to Profile model later in Phase 2)
    brand_colors: Optional[Dict[str, str]] = Field(None, description="Brand color overrides")
    brand_fonts: Optional[Dict[str, str]] = Field(None, description="Brand font overrides")
    brand_logo_url: Optional[str] = Field(None, description="Brand logo URL")
    
    @validator('elements')
    def validate_element_order(cls, v):
        """Ensure element order values are unique and sequential."""
        orders = [element.order for element in v]
        if len(orders) != len(set(orders)):
            raise ValueError("Element order values must be unique")
        return v
    
    def get_element_by_id(self, element_id: str) -> Optional[OnePagerElement]:
        """Get an element by its ID."""
        for element in self.elements:
            if element.id == element_id:
                return element
        return None
    
    def get_elements_by_type(self, element_type: ElementType) -> List[OnePagerElement]:
        """Get all elements of a specific type."""
        return [element for element in self.elements if element.type == element_type]


# Helper Functions for API Responses

def onepager_helper(onepager_doc: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transform MongoDB onepager document to API response format.

    Args:
        onepager_doc: Raw MongoDB document

    Returns:
        Dictionary ready for OnePagerResponse model
    """
    return {
        "id": str(onepager_doc["_id"]),
        "user_id": str(onepager_doc["user_id"]),
        "brand_kit_id": str(onepager_doc["brand_kit_id"]) if onepager_doc.get("brand_kit_id") else None,
        "title": onepager_doc["title"],
        "status": onepager_doc["status"],
        "content": onepager_doc.get("content", {}),
        "layout": onepager_doc.get("layout", []),
        "style_overrides": onepager_doc.get("style_overrides", {}),
        "generation_metadata": onepager_doc.get("generation_metadata", {}),
        "version_history": onepager_doc.get("version_history", []),
        "layout_params": onepager_doc.get("layout_params"),
        "design_rationale": onepager_doc.get("design_rationale"),
        "created_at": onepager_doc["created_at"],
        "updated_at": onepager_doc["updated_at"],
        "last_accessed": onepager_doc.get("last_accessed", onepager_doc["updated_at"])
    }


def onepager_summary_helper(onepager_doc: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transform MongoDB onepager document to summary format for list views.

    Args:
        onepager_doc: Raw MongoDB document

    Returns:
        Dictionary ready for OnePagerSummary model
    """
    return {
        "id": str(onepager_doc["_id"]),
        "title": onepager_doc["title"],
        "status": onepager_doc["status"],
        "created_at": onepager_doc["created_at"],
        "updated_at": onepager_doc["updated_at"],
        "has_brand_kit": bool(onepager_doc.get("brand_kit_id"))
    }


# ==========================================
# Layout Parameters Models
# ==========================================
# New data models for AI-driven layout customization
# Enables iterative design refinement beyond content


class ColorScheme(BaseModel):
    """
    Color scheme configuration for one-pager design.

    All colors must be in hex format (#RRGGBB).
    Used for dynamic PDF template styling.
    """
    primary: str = Field(
        default="#1568B8",
        description="Primary brand color (hex format)"
    )
    secondary: str = Field(
        default="#864CBD",
        description="Secondary brand color (hex format)"
    )
    accent: str = Field(
        default="#FF6B6B",
        description="Accent color for highlights (hex format)"
    )
    text_primary: str = Field(
        default="#1A202C",
        description="Primary text color (hex format)"
    )
    background: str = Field(
        default="#FFFFFF",
        description="Background color (hex format)"
    )

    @validator('primary', 'secondary', 'accent', 'text_primary', 'background')
    def validate_hex_color(cls, v):
        """Validate color format is hex (#RRGGBB)."""
        if not (v.startswith('#') and len(v) == 7):
            raise ValueError("Color must be in hex format: #RRGGBB")
        try:
            int(v[1:], 16)  # Validate hex characters
        except ValueError:
            raise ValueError("Invalid hex color code")
        return v


class Typography(BaseModel):
    """
    Typography parameters for scaling and font configuration.

    Scale values allow AI to adjust text sizes based on content characteristics.
    """
    heading_font: str = Field(
        default="Inter",
        description="Font family for headings"
    )
    body_font: str = Field(
        default="Inter",
        description="Font family for body text"
    )
    h1_scale: float = Field(
        default=1.0,
        ge=0.8,
        le=1.5,
        description="H1 size multiplier (0.8-1.5)"
    )
    h2_scale: float = Field(
        default=1.0,
        ge=0.8,
        le=1.5,
        description="H2 size multiplier (0.8-1.5)"
    )
    body_scale: float = Field(
        default=1.0,
        ge=0.8,
        le=1.3,
        description="Body text size multiplier (0.8-1.3)"
    )
    line_height_scale: float = Field(
        default=1.0,
        ge=0.8,
        le=1.4,
        description="Line height multiplier (0.8-1.4)"
    )


class Spacing(BaseModel):
    """
    Spacing configuration for section gaps and padding.

    Controls vertical spacing between sections and overall padding density.
    """
    section_gap: Literal["tight", "normal", "loose"] = Field(
        default="normal",
        description="Vertical spacing between sections"
    )
    padding_scale: float = Field(
        default=1.0,
        ge=0.5,
        le=2.0,
        description="Overall padding multiplier (0.5-2.0)"
    )


class SectionLayout(BaseModel):
    """
    Layout configuration for an individual section.

    Defines grid structure and alignment for section content.
    """
    columns: Literal[1, 2, 3] = Field(
        default=1,
        description="Number of columns (1-3)"
    )
    alignment: Literal["left", "center", "right"] = Field(
        default="left",
        description="Content alignment"
    )
    image_position: Optional[Literal["top", "left", "right", "none"]] = Field(
        default="top",
        description="Image placement relative to content"
    )


class LayoutParams(BaseModel):
    """
    Complete layout parameter configuration for one-pager.

    Enables AI-driven design customization beyond content.
    All parameters have sensible defaults and validation ranges.
    """
    color_scheme: ColorScheme = Field(
        default_factory=ColorScheme,
        description="Color palette configuration"
    )
    typography: Typography = Field(
        default_factory=Typography,
        description="Typography scaling configuration"
    )
    spacing: Spacing = Field(
        default_factory=Spacing,
        description="Spacing and padding configuration"
    )
    section_layouts: Dict[str, SectionLayout] = Field(
        default_factory=dict,
        description="Per-section layout configuration (key: section name)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "color_scheme": {
                    "primary": "#1568B8",
                    "secondary": "#864CBD",
                    "accent": "#FF6B6B",
                    "text_primary": "#1A202C",
                    "background": "#FFFFFF"
                },
                "typography": {
                    "heading_font": "Inter",
                    "body_font": "Inter",
                    "h1_scale": 1.2,
                    "h2_scale": 1.0,
                    "body_scale": 1.0,
                    "line_height_scale": 1.1
                },
                "spacing": {
                    "section_gap": "normal",
                    "padding_scale": 1.0
                },
                "section_layouts": {
                    "features": {
                        "columns": 2,
                        "alignment": "left"
                    },
                    "benefits": {
                        "columns": 1,
                        "alignment": "center"
                    }
                }
            }
        }


def get_default_layout_params() -> LayoutParams:
    """
    Get default layout parameters with sensible styling.

    Returns:
        LayoutParams instance with all default values

    Usage:
        Used for onepagers without custom layout configuration.
        Provides baseline styling that works for most content.
    """
    return LayoutParams(
        color_scheme=ColorScheme(),
        typography=Typography(),
        spacing=Spacing(),
        section_layouts={
            "features": SectionLayout(columns=2, alignment="left"),
            "benefits": SectionLayout(columns=1, alignment="center"),
            "integrations": SectionLayout(columns=3, alignment="left")
        }
    )


def validate_layout_params(data: Dict[str, Any]) -> Optional[LayoutParams]:
    """
    Validate layout parameters data and return LayoutParams instance if valid.

    Args:
        data: Dictionary containing layout parameter data

    Returns:
        LayoutParams instance if validation succeeds, None if validation fails

    Usage:
        Used by API endpoints to validate user-submitted layout parameters.
        Returns None on validation errors instead of raising exceptions.

    Example:
        >>> params_dict = {"color_scheme": {"primary": "#FF0000"}}
        >>> validated = validate_layout_params(params_dict)
        >>> if validated:
        ...     # Use validated params
        ...     pass
    """
    try:
        return LayoutParams(**data)
    except Exception:
        return None


def merge_layout_params(
    base: Optional[LayoutParams] = None,
    updates: Optional[Dict[str, Any]] = None
) -> LayoutParams:
    """
    Merge user layout parameter updates with base parameters.

    Args:
        base: Base LayoutParams (defaults to get_default_layout_params() if None)
        updates: Dictionary of user updates to apply

    Returns:
        New LayoutParams instance with merged values

    Usage:
        Used when user modifies specific layout parameters while keeping others default.
        Enables incremental customization without requiring full parameter specification.

    Example:
        >>> base = get_default_layout_params()
        >>> updates = {"spacing": {"section_gap": "loose"}}
        >>> merged = merge_layout_params(base, updates)
        >>> # Result: All defaults except section_gap is now "loose"
    """
    # Get base params (use defaults if not provided)
    if base is None:
        base = get_default_layout_params()

    # If no updates, return base as-is
    if not updates:
        return base

    # Convert base to dict for merging
    base_dict = base.dict()

    # Deep merge updates into base
    for key, value in updates.items():
        if key in base_dict:
            # If both are dicts, merge recursively
            if isinstance(value, dict) and isinstance(base_dict[key], dict):
                base_dict[key] = {**base_dict[key], **value}
            else:
                # Otherwise, replace value
                base_dict[key] = value
        else:
            # New key, add directly
            base_dict[key] = value

    # Validate and return merged params
    try:
        return LayoutParams(**base_dict)
    except Exception:
        # If merged params are invalid, return base unchanged
        return base
