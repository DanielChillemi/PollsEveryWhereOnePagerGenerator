"""
OnePager Data Models
====================

Pydantic models for one-pager layouts and elements.
Based on validated POC schema from canva-poc/json_schema.py
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
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
    content: Dict[str, Any] = Field(description="Element content (flexible dict)")
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
