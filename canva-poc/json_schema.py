"""
JSON Schema Definitions for Marketing One-Pager Layouts

This module defines the JSON structure that represents marketing one-pagers
in our system, and provides validation and conversion utilities.

The schema is designed to be:
1. Human-readable and editable
2. Mappable to Canva design elements
3. Brand Kit aware (supports style overrides)
4. Iteratively refineable (supports AI modifications)
"""

from typing import Dict, Any, List, Optional, Union
from pydantic import BaseModel, Field, validator
from enum import Enum


class ElementType(str, Enum):
    """Types of elements that can appear in a one-pager layout."""
    HEADER = "header"
    HERO = "hero" 
    FEATURES = "features"
    TESTIMONIALS = "testimonials"
    CTA = "cta"
    FOOTER = "footer"
    IMAGE = "image"
    TEXT_BLOCK = "text_block"


class AlignmentType(str, Enum):
    """Text and element alignment options."""
    LEFT = "left"
    CENTER = "center"
    RIGHT = "right"
    JUSTIFY = "justify"


class FontWeight(str, Enum):
    """Font weight options."""
    LIGHT = "light"
    NORMAL = "normal" 
    MEDIUM = "medium"
    BOLD = "bold"
    EXTRA_BOLD = "extra_bold"


class Dimensions(BaseModel):
    """Design dimensions in pixels."""
    width: int = Field(default=1080, description="Design width in pixels")
    height: int = Field(default=1920, description="Design height in pixels")
    
    @validator('width', 'height')
    def validate_dimensions(cls, v):
        if v <= 0:
            raise ValueError("Dimensions must be positive")
        if v > 5000:
            raise ValueError("Dimensions too large (max 5000px)")
        return v


class Position(BaseModel):
    """Element position within the design."""
    x: int = Field(description="X coordinate in pixels")
    y: int = Field(description="Y coordinate in pixels")
    width: int = Field(description="Element width in pixels")
    height: int = Field(description="Element height in pixels")


class Styling(BaseModel):
    """Visual styling properties for elements."""
    background_color: Optional[str] = Field(None, description="Hex color code (e.g., #0ea5e9)")
    text_color: Optional[str] = Field(None, description="Text color hex code")
    font_family: Optional[str] = Field(None, description="Font family name")
    font_size: Optional[int] = Field(None, description="Font size in pixels")
    font_weight: Optional[FontWeight] = Field(None, description="Font weight")
    text_align: Optional[AlignmentType] = Field(None, description="Text alignment")
    border_radius: Optional[int] = Field(None, description="Border radius in pixels")
    padding: Optional[int] = Field(None, description="Internal padding in pixels")
    margin: Optional[int] = Field(None, description="External margin in pixels")
    
    @validator('background_color', 'text_color')
    def validate_color_format(cls, v):
        if v and not (v.startswith('#') and len(v) == 7):
            raise ValueError("Colors must be hex format like #0ea5e9")
        return v


class HeaderContent(BaseModel):
    """Content for header elements."""
    title: str = Field(description="Main header title")
    subtitle: Optional[str] = Field(None, description="Header subtitle")
    logo_url: Optional[str] = Field(None, description="Company logo URL")


class HeroContent(BaseModel):
    """Content for hero section elements."""
    headline: str = Field(description="Primary hero headline")
    subheadline: Optional[str] = Field(None, description="Secondary headline")
    description: str = Field(description="Hero description text")
    image_url: Optional[str] = Field(None, description="Hero background/feature image")
    cta_text: Optional[str] = Field(None, description="Call-to-action button text")
    cta_url: Optional[str] = Field(None, description="Call-to-action button URL")


class Feature(BaseModel):
    """Individual feature item."""
    title: str = Field(description="Feature title")
    description: str = Field(description="Feature description")
    icon_url: Optional[str] = Field(None, description="Feature icon URL")
    image_url: Optional[str] = Field(None, description="Feature image URL")


class FeaturesContent(BaseModel):
    """Content for features section."""
    section_title: str = Field(description="Features section title")
    section_subtitle: Optional[str] = Field(None, description="Features section subtitle")
    features: List[Feature] = Field(description="List of feature items")
    layout: str = Field(default="grid", description="Layout type: grid, list, carousel")


class Testimonial(BaseModel):
    """Individual testimonial item."""
    quote: str = Field(description="Testimonial quote text")
    author: str = Field(description="Testimonial author name")
    title: Optional[str] = Field(None, description="Author title/position")
    company: Optional[str] = Field(None, description="Author company")
    avatar_url: Optional[str] = Field(None, description="Author avatar image URL")


class TestimonialsContent(BaseModel):
    """Content for testimonials section."""
    section_title: str = Field(description="Testimonials section title")
    testimonials: List[Testimonial] = Field(description="List of testimonial items")
    layout: str = Field(default="carousel", description="Layout type: carousel, grid, single")


class CTAContent(BaseModel):
    """Content for call-to-action elements."""
    primary_text: str = Field(description="Primary CTA button text")
    primary_url: str = Field(description="Primary CTA button URL")
    secondary_text: Optional[str] = Field(None, description="Secondary CTA text")
    secondary_url: Optional[str] = Field(None, description="Secondary CTA URL")
    supporting_text: Optional[str] = Field(None, description="Supporting text around CTA")


class FooterContent(BaseModel):
    """Content for footer elements."""
    company_name: str = Field(description="Company name")
    contact_email: Optional[str] = Field(None, description="Contact email")
    contact_phone: Optional[str] = Field(None, description="Contact phone")
    website_url: Optional[str] = Field(None, description="Company website")
    social_links: Optional[Dict[str, str]] = Field(None, description="Social media links")
    copyright_text: Optional[str] = Field(None, description="Copyright notice")


class ImageContent(BaseModel):
    """Content for standalone image elements."""
    image_url: str = Field(description="Image URL")
    alt_text: Optional[str] = Field(None, description="Image alt text")
    caption: Optional[str] = Field(None, description="Image caption")


class TextBlockContent(BaseModel):
    """Content for generic text block elements."""
    text: str = Field(description="Text content")
    heading_level: Optional[int] = Field(None, description="Heading level (1-6)")


# Union type for all possible content types
ElementContent = Union[
    HeaderContent,
    HeroContent, 
    FeaturesContent,
    TestimonialsContent,
    CTAContent,
    FooterContent,
    ImageContent,
    TextBlockContent
]


class OnePagerElement(BaseModel):
    """Individual element within a one-pager design."""
    id: str = Field(description="Unique element identifier")
    type: ElementType = Field(description="Element type")
    content: ElementContent = Field(description="Element content data")
    styling: Optional[Styling] = Field(None, description="Element styling overrides")
    position: Optional[Position] = Field(None, description="Element position (if absolute)")
    order: int = Field(description="Display order within the layout")
    visible: bool = Field(default=True, description="Whether element is visible")
    
    class Config:
        use_enum_values = True


class BrandProfile(BaseModel):
    """Brand Kit profile information for styling."""
    primary_color: str = Field(description="Primary brand color")
    secondary_color: Optional[str] = Field(None, description="Secondary brand color")
    accent_color: Optional[str] = Field(None, description="Accent brand color")
    text_color: str = Field(default="#333333", description="Default text color")
    background_color: str = Field(default="#ffffff", description="Default background color")
    primary_font: str = Field(default="Inter", description="Primary font family")
    secondary_font: Optional[str] = Field(None, description="Secondary font family")
    logo_url: Optional[str] = Field(None, description="Brand logo URL")
    brand_voice: Optional[str] = Field(None, description="Brand voice description")


class OnePagerLayout(BaseModel):
    """Complete one-pager layout specification."""
    title: str = Field(description="One-pager title/name")
    description: Optional[str] = Field(None, description="One-pager description")
    dimensions: Dimensions = Field(default_factory=Dimensions, description="Design dimensions")
    brand_profile: Optional[BrandProfile] = Field(None, description="Brand styling information")
    elements: List[OnePagerElement] = Field(description="List of design elements")
    version: int = Field(default=1, description="Layout version number")
    created_at: Optional[str] = Field(None, description="Creation timestamp")
    updated_at: Optional[str] = Field(None, description="Last update timestamp")
    
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


# Test data for our proof-of-concept
def create_simple_layout() -> OnePagerLayout:
    """Create a simple test layout for basic validation."""
    return OnePagerLayout(
        title="Simple Product Launch",
        description="Basic one-pager layout for testing",
        brand_profile=BrandProfile(
            primary_color="#0ea5e9",
            secondary_color="#64748b", 
            text_color="#1f2937",
            primary_font="Inter"
        ),
        elements=[
            OnePagerElement(
                id="header-1",
                type=ElementType.HEADER,
                content=HeaderContent(
                    title="Revolutionary Product Launch",
                    subtitle="Transform your workflow today"
                ),
                styling=Styling(
                    background_color="#0ea5e9",
                    text_color="#ffffff",
                    text_align=AlignmentType.CENTER,
                    padding=40
                ),
                order=1
            ),
            OnePagerElement(
                id="hero-1", 
                type=ElementType.HERO,
                content=HeroContent(
                    headline="Meet the Future",
                    description="Our innovative solution solves your biggest challenges with cutting-edge technology and intuitive design.",
                    cta_text="Start Free Trial",
                    cta_url="https://example.com/signup"
                ),
                styling=Styling(
                    text_align=AlignmentType.CENTER,
                    padding=60
                ),
                order=2
            ),
            OnePagerElement(
                id="cta-1",
                type=ElementType.CTA,
                content=CTAContent(
                    primary_text="Get Started Today",
                    primary_url="https://example.com/signup",
                    supporting_text="Join thousands of satisfied customers"
                ),
                styling=Styling(
                    background_color="#10b981", 
                    text_color="#ffffff",
                    text_align=AlignmentType.CENTER,
                    border_radius=8,
                    padding=30
                ),
                order=3
            ),
            OnePagerElement(
                id="footer-1",
                type=ElementType.FOOTER,
                content=FooterContent(
                    company_name="Acme Corp",
                    contact_email="hello@acme.com",
                    website_url="https://acme.com",
                    copyright_text="© 2025 Acme Corp. All rights reserved."
                ),
                styling=Styling(
                    background_color="#f8fafc",
                    text_color="#64748b",
                    text_align=AlignmentType.CENTER,
                    padding=20
                ),
                order=4
            )
        ]
    )


def create_feature_rich_layout() -> OnePagerLayout:
    """Create a feature-rich test layout for comprehensive validation."""
    return OnePagerLayout(
        title="Feature-Rich Marketing Page",
        description="Comprehensive one-pager with multiple content types",
        brand_profile=BrandProfile(
            primary_color="#7c3aed",
            secondary_color="#06b6d4",
            accent_color="#f59e0b",
            text_color="#1f2937",
            primary_font="Montserrat",
            secondary_font="Inter"
        ),
        elements=[
            OnePagerElement(
                id="header-1",
                type=ElementType.HEADER,
                content=HeaderContent(
                    title="Enterprise Solution Suite",
                    subtitle="Everything your business needs to scale",
                    logo_url="https://example.com/logo.png"
                ),
                styling=Styling(
                    background_color="#7c3aed",
                    text_color="#ffffff",
                    font_weight=FontWeight.BOLD,
                    text_align=AlignmentType.CENTER,
                    padding=50
                ),
                order=1
            ),
            OnePagerElement(
                id="hero-1",
                type=ElementType.HERO,
                content=HeroContent(
                    headline="Supercharge Your Business Growth",
                    subheadline="The all-in-one platform that scales with you",
                    description="From startups to enterprise, our comprehensive suite of tools helps you manage customers, automate workflows, and drive revenue growth.",
                    image_url="https://example.com/hero-bg.jpg",
                    cta_text="Start 14-Day Free Trial",
                    cta_url="https://example.com/trial"
                ),
                styling=Styling(
                    background_color="#f8fafc",
                    text_align=AlignmentType.CENTER,
                    padding=80
                ),
                order=2
            ),
            OnePagerElement(
                id="features-1",
                type=ElementType.FEATURES,
                content=FeaturesContent(
                    section_title="Powerful Features Built for Growth",
                    section_subtitle="Everything you need in one integrated platform",
                    layout="grid",
                    features=[
                        Feature(
                            title="Advanced Analytics",
                            description="Real-time insights and reporting to drive data-informed decisions.",
                            icon_url="https://example.com/analytics-icon.png"
                        ),
                        Feature(
                            title="Workflow Automation",
                            description="Automate repetitive tasks and focus on what matters most.",
                            icon_url="https://example.com/automation-icon.png" 
                        ),
                        Feature(
                            title="Team Collaboration",
                            description="Work together seamlessly with built-in collaboration tools.",
                            icon_url="https://example.com/collaboration-icon.png"
                        )
                    ]
                ),
                styling=Styling(
                    padding=60,
                    text_align=AlignmentType.CENTER
                ),
                order=3
            ),
            OnePagerElement(
                id="testimonials-1",
                type=ElementType.TESTIMONIALS,
                content=TestimonialsContent(
                    section_title="Trusted by Industry Leaders",
                    layout="carousel",
                    testimonials=[
                        Testimonial(
                            quote="This platform transformed how we operate. Our productivity increased by 300% in the first quarter.",
                            author="Sarah Chen",
                            title="VP of Operations",
                            company="TechCorp Inc.",
                            avatar_url="https://example.com/sarah-avatar.jpg"
                        ),
                        Testimonial(
                            quote="The automation features saved us countless hours. We can now focus on strategic initiatives instead of manual tasks.",
                            author="Michael Rodriguez",
                            title="COO",
                            company="Growth Dynamics",
                            avatar_url="https://example.com/michael-avatar.jpg"
                        )
                    ]
                ),
                styling=Styling(
                    background_color="#f1f5f9",
                    padding=60,
                    text_align=AlignmentType.CENTER
                ),
                order=4
            ),
            OnePagerElement(
                id="cta-1",
                type=ElementType.CTA,
                content=CTAContent(
                    primary_text="Start Your Free Trial",
                    primary_url="https://example.com/signup",
                    secondary_text="Schedule a Demo",
                    secondary_url="https://example.com/demo",
                    supporting_text="No credit card required • 14-day free trial • Cancel anytime"
                ),
                styling=Styling(
                    background_color="#06b6d4",
                    text_color="#ffffff",
                    text_align=AlignmentType.CENTER,
                    border_radius=12,
                    padding=50
                ),
                order=5
            ),
            OnePagerElement(
                id="footer-1",
                type=ElementType.FOOTER,
                content=FooterContent(
                    company_name="GrowthSuite",
                    contact_email="support@growthsuite.com",
                    contact_phone="+1 (555) 123-4567",
                    website_url="https://growthsuite.com",
                    social_links={
                        "twitter": "https://twitter.com/growthsuite",
                        "linkedin": "https://linkedin.com/company/growthsuite",
                        "facebook": "https://facebook.com/growthsuite"
                    },
                    copyright_text="© 2025 GrowthSuite. All rights reserved."
                ),
                styling=Styling(
                    background_color="#1f2937",
                    text_color="#d1d5db",
                    text_align=AlignmentType.CENTER,
                    padding=40
                ),
                order=6
            )
        ]
    )


def create_complex_layout() -> OnePagerLayout:
    """Create a complex test layout for advanced validation."""
    return OnePagerLayout(
        title="Complex Marketing Showcase",
        description="Advanced layout testing all element types and styling options",
        brand_profile=BrandProfile(
            primary_color="#dc2626",
            secondary_color="#0891b2",
            accent_color="#ca8a04",
            text_color="#111827",
            background_color="#fefefe",
            primary_font="Poppins",
            secondary_font="Open Sans",
            logo_url="https://example.com/brand-logo.svg",
            brand_voice="Bold, innovative, and customer-focused"
        ),
        elements=[
            OnePagerElement(
                id="header-1",
                type=ElementType.HEADER,
                content=HeaderContent(
                    title="Innovation Unleashed",
                    subtitle="Redefining what's possible in modern business",
                    logo_url="https://example.com/logo-white.svg"
                ),
                styling=Styling(
                    background_color="#dc2626",
                    text_color="#ffffff",
                    font_weight=FontWeight.EXTRA_BOLD,
                    text_align=AlignmentType.CENTER,
                    padding=60
                ),
                order=1
            ),
            OnePagerElement(
                id="hero-1",
                type=ElementType.HERO,
                content=HeroContent(
                    headline="The Future of Business Intelligence",
                    subheadline="AI-Powered Insights for Tomorrow's Leaders",
                    description="Harness the power of artificial intelligence to make smarter decisions, predict market trends, and stay ahead of the competition with our revolutionary platform.",
                    image_url="https://example.com/ai-dashboard.jpg",
                    cta_text="Explore the Platform",
                    cta_url="https://example.com/platform"
                ),
                styling=Styling(
                    background_color="#fef7f0",
                    padding=100,
                    text_align=AlignmentType.LEFT
                ),
                order=2
            ),
            OnePagerElement(
                id="image-1",
                type=ElementType.IMAGE,
                content=ImageContent(
                    image_url="https://example.com/product-showcase.jpg",
                    alt_text="Product interface showcase",
                    caption="Our intuitive dashboard puts powerful analytics at your fingertips"
                ),
                styling=Styling(
                    padding=20,
                    text_align=AlignmentType.CENTER
                ),
                order=3
            ),
            OnePagerElement(
                id="features-1",
                type=ElementType.FEATURES,
                content=FeaturesContent(
                    section_title="Comprehensive Business Intelligence Suite",
                    section_subtitle="Every tool you need to drive growth and innovation",
                    layout="grid",
                    features=[
                        Feature(
                            title="Predictive Analytics",
                            description="AI-driven forecasting helps you anticipate market changes and customer behavior patterns.",
                            icon_url="https://example.com/predictive-icon.svg",
                            image_url="https://example.com/analytics-demo.jpg"
                        ),
                        Feature(
                            title="Real-Time Dashboards", 
                            description="Monitor KPIs and business metrics with customizable, interactive dashboards.",
                            icon_url="https://example.com/dashboard-icon.svg",
                            image_url="https://example.com/dashboard-demo.jpg"
                        ),
                        Feature(
                            title="Advanced Reporting",
                            description="Generate comprehensive reports with automated insights and actionable recommendations.",
                            icon_url="https://example.com/reporting-icon.svg", 
                            image_url="https://example.com/reports-demo.jpg"
                        ),
                        Feature(
                            title="Data Integration",
                            description="Connect all your data sources for a unified view of your business operations.",
                            icon_url="https://example.com/integration-icon.svg",
                            image_url="https://example.com/integration-demo.jpg"
                        ),
                        Feature(
                            title="Machine Learning",
                            description="Leverage ML algorithms to discover hidden patterns and optimize performance.",
                            icon_url="https://example.com/ml-icon.svg",
                            image_url="https://example.com/ml-demo.jpg"
                        ),
                        Feature(
                            title="Security & Compliance",
                            description="Enterprise-grade security with SOC 2, GDPR, and HIPAA compliance built-in.",
                            icon_url="https://example.com/security-icon.svg",
                            image_url="https://example.com/security-demo.jpg"
                        )
                    ]
                ),
                styling=Styling(
                    padding=80,
                    background_color="#ffffff"
                ),
                order=4
            ),
            OnePagerElement(
                id="text-block-1",
                type=ElementType.TEXT_BLOCK,
                content=TextBlockContent(
                    text="Trusted by over 10,000 businesses worldwide, our platform has processed more than 1 billion data points and generated insights that have driven over $500M in business value.",
                    heading_level=3
                ),
                styling=Styling(
                    background_color="#0891b2",
                    text_color="#ffffff",
                    text_align=AlignmentType.CENTER,
                    font_weight=FontWeight.MEDIUM,
                    padding=50
                ),
                order=5
            ),
            OnePagerElement(
                id="testimonials-1", 
                type=ElementType.TESTIMONIALS,
                content=TestimonialsContent(
                    section_title="What Our Customers Say",
                    layout="grid",
                    testimonials=[
                        Testimonial(
                            quote="The predictive analytics capabilities have revolutionized our inventory management. We've reduced stockouts by 85% and improved cash flow significantly.",
                            author="Emily Watson",
                            title="Chief Operating Officer",
                            company="RetailMax Solutions",
                            avatar_url="https://example.com/emily-avatar.jpg"
                        ),
                        Testimonial(
                            quote="Implementation was seamless and the ROI was immediate. Our data-driven decisions have increased revenue by 40% in just six months.",
                            author="David Park",
                            title="VP of Strategy",
                            company="InnovateTech Corp",
                            avatar_url="https://example.com/david-avatar.jpg"
                        ),
                        Testimonial(
                            quote="The real-time dashboards give us visibility we never had before. We can now respond to market changes within hours instead of weeks.",
                            author="Maria Gonzalez",
                            title="Director of Analytics",
                            company="Global Dynamics Inc",
                            avatar_url="https://example.com/maria-avatar.jpg"
                        )
                    ]
                ),
                styling=Styling(
                    background_color="#f9fafb",
                    padding=70
                ),
                order=6
            ),
            OnePagerElement(
                id="cta-1",
                type=ElementType.CTA,
                content=CTAContent(
                    primary_text="Start Your Transformation",
                    primary_url="https://example.com/get-started",
                    secondary_text="Book a Demo",
                    secondary_url="https://example.com/demo",
                    supporting_text="Join 10,000+ businesses using our platform • 30-day money-back guarantee"
                ),
                styling=Styling(
                    background_color="#ca8a04",
                    text_color="#ffffff",
                    text_align=AlignmentType.CENTER,
                    border_radius=16,
                    padding=60
                ),
                order=7
            ),
            OnePagerElement(
                id="footer-1",
                type=ElementType.FOOTER, 
                content=FooterContent(
                    company_name="IntelliBI Pro",
                    contact_email="hello@intellibi.pro",
                    contact_phone="+1 (555) 987-6543",
                    website_url="https://intellibi.pro",
                    social_links={
                        "twitter": "https://twitter.com/intellibipro",
                        "linkedin": "https://linkedin.com/company/intellibipro",
                        "github": "https://github.com/intellibipro",
                        "youtube": "https://youtube.com/intellibipro"
                    },
                    copyright_text="© 2025 IntelliBI Pro. All rights reserved. • Privacy Policy • Terms of Service"
                ),
                styling=Styling(
                    background_color="#111827",
                    text_color="#e5e7eb",
                    text_align=AlignmentType.CENTER,
                    padding=50
                ),
                order=8
            )
        ]
    )


# Export test layouts for use in our proof-of-concept
TEST_LAYOUTS = {
    "simple": create_simple_layout(),
    "feature_rich": create_feature_rich_layout(), 
    "complex": create_complex_layout()
}