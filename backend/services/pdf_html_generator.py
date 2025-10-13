"""
PDF HTML Generator Service
===========================

Converts OnePagerLayout JSON + Brand Kit to styled HTML string.
Uses Jinja2 templates with inline CSS for print-quality PDF output.

Features:
- Brand Kit color/typography integration
- Google Fonts embedding
- Responsive section rendering
- Print-optimized CSS
- Support for all element types
"""

from jinja2 import Environment, FileSystemLoader, select_autoescape
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List
import logging
import re

from backend.models.onepager import OnePagerLayout
from backend.models.brand_kit import BrandKitInDB


logger = logging.getLogger(__name__)


def extract_key_stats(onepager: OnePagerLayout) -> List[Dict[str, str]]:
    """
    Extract key statistics from one-pager content for visual highlights.

    Looks for patterns like:
    - "50+ clients", "100+ customers"
    - "99% satisfaction", "95% rating"
    - "$1M revenue", "$500K sales"
    - "10 years", "15+ years experience"

    Args:
        onepager: OnePager layout data

    Returns:
        List of stat dicts with keys: number, label, icon
        Maximum 4 stats returned
    """
    stats = []

    # Combine all text content from elements
    all_text = f"{onepager.title} "
    for element in onepager.elements:
        if hasattr(element, 'content'):
            content = element.content
            if isinstance(content, str):
                all_text += content + " "
            elif isinstance(content, dict):
                for value in content.values():
                    if isinstance(value, str):
                        all_text += value + " "
            elif isinstance(content, list):
                for item in content:
                    if isinstance(item, str):
                        all_text += item + " "
        if hasattr(element, 'title') and element.title:
            all_text += element.title + " "

    # Pattern matching for common stat formats
    patterns = [
        # Number + unit patterns (50+, 100+, 1000+)
        (r'(\d+\+?)\s+(clients?|customers?|users?|businesses?|companies?)', '👥', 'clients'),
        (r'(\d+\+?)\s+(years?|decades?)', '⏰', 'years'),
        (r'(\d+\+?)\s+(locations?|stores?|branches?)', '📍', 'locations'),
        (r'(\d+\+?)\s+(products?|items?|dishes?|services?)', '📦', 'products'),
        (r'(\d+\+?)\s+(employees?|team members?|staff)', '👔', 'team'),
        # Percentage patterns
        (r'(\d+%)\s+(satisfaction|happy|rating|success)', '⭐', 'satisfaction'),
        (r'(\d+%)\s+(growth|increase)', '📈', 'growth'),
        # Money patterns
        (r'(\$[\d,]+[KMB]?)\s+(revenue|sales|saved|value)', '💰', 'value'),
    ]

    for pattern, icon, label_fallback in patterns:
        matches = re.finditer(pattern, all_text, re.IGNORECASE)
        for match in matches:
            number = match.group(1)
            label = match.group(2).capitalize()

            stats.append({
                'number': number,
                'label': label,
                'icon': icon
            })

            if len(stats) >= 4:
                break

        if len(stats) >= 4:
            break

    # If no stats found, generate defaults from content analysis
    if len(stats) == 0:
        # Count features
        feature_count = sum(1 for el in onepager.elements if 'feature' in str(el.title).lower() or el.type == 'list')
        if feature_count > 0:
            stats.append({
                'number': str(feature_count * 5) + '+',  # Estimate features
                'label': 'Features',
                'icon': '⚡'
            })

        # Count benefits
        benefit_count = sum(1 for el in onepager.elements if 'benefit' in str(el.title).lower())
        if benefit_count > 0:
            stats.append({
                'number': str(benefit_count * 3),
                'label': 'Benefits',
                'icon': '🎯'
            })

        # Default stats if still empty
        if len(stats) == 0:
            stats = [
                {'number': '100%', 'label': 'Quality', 'icon': '⭐'},
                {'number': '24/7', 'label': 'Support', 'icon': '💬'},
                {'number': 'Fast', 'label': 'Delivery', 'icon': '🚀'}
            ]

    logger.info(f"Extracted {len(stats)} key stats from onepager")
    return stats[:4]  # Max 4 stats


class PDFHTMLGeneratorError(Exception):
    """Raised when HTML generation fails."""
    pass


class PDFHTMLGenerator:
    """
    Generate styled HTML for PDF conversion from OnePagerLayout + Brand Kit.
    
    Usage:
        generator = PDFHTMLGenerator()
        html = generator.generate_html(onepager_layout, brand_kit)
    """
    
    def __init__(self, template_dir: str = None):
        """
        Initialize the HTML generator.
        
        Args:
            template_dir: Path to Jinja2 templates directory.
                         Defaults to backend/templates/pdf/
        """
        if template_dir is None:
            # Default to backend/templates/pdf/
            backend_dir = Path(__file__).parent.parent
            template_dir = str(backend_dir / "templates" / "pdf")
        
        logger.info(f"Initializing PDFHTMLGenerator with template_dir: {template_dir}")
        
        # Initialize Jinja2 environment with 'do' extension for list manipulation
        self.env = Environment(
            loader=FileSystemLoader(template_dir),
            autoescape=select_autoescape(['html', 'xml']),
            trim_blocks=True,
            lstrip_blocks=True,
            extensions=['jinja2.ext.do']
        )
        
        # Add custom filters
        self.env.filters['replace'] = lambda s, old, new: s.replace(old, new)
        
        logger.info("✅ PDFHTMLGenerator initialized successfully")
    
    def generate_html(
        self,
        onepager: OnePagerLayout,
        brand_kit: BrandKitInDB
    ) -> str:
        """
        Generate complete HTML with Brand Kit styling.
        
        Args:
            onepager: OnePager layout data structure
            brand_kit: Brand Kit with colors, fonts, logo
        
        Returns:
            Complete HTML string ready for PDF conversion
        
        Raises:
            PDFHTMLGeneratorError: If HTML generation fails
        """
        try:
            logger.info(f"Generating HTML for onepager: {onepager.title}")
            
            # Load base template
            template = self.env.get_template('onepager_base.html')
            
            # Convert Pydantic models to dicts for Jinja2
            onepager_dict = self._prepare_onepager_data(onepager)
            brand_dict = self._prepare_brand_data(brand_kit)

            # Extract key statistics for visual highlights
            key_stats = extract_key_stats(onepager)

            # Render template
            html = template.render(
                onepager=onepager_dict,
                brand=brand_dict,
                key_stats=key_stats,
                now=datetime.now()
            )
            
            logger.info(f"✅ HTML generated successfully ({len(html)} characters)")
            return html
            
        except Exception as e:
            logger.error(f"Failed to generate HTML: {e}", exc_info=True)
            raise PDFHTMLGeneratorError(f"HTML generation failed: {e}")
    
    def _prepare_onepager_data(self, onepager: OnePagerLayout) -> Dict[str, Any]:
        """
        Convert OnePagerLayout to dict suitable for template rendering.
        
        Args:
            onepager: OnePagerLayout model
        
        Returns:
            Dictionary with template-friendly structure
        """
        # Convert to dict using Pydantic v2 model_dump()
        try:
            data = onepager.model_dump()
        except AttributeError:
            # Fallback for Pydantic v1
            data = onepager.dict()
        
        # Ensure elements is a proper list (not a method or other type)
        if 'elements' not in data or data['elements'] is None:
            data['elements'] = []
        elif not isinstance(data['elements'], list):
            logger.warning(f"elements is not a list, it's a {type(data['elements'])}")
            data['elements'] = []
        
        # Sort elements by order
        data['elements'] = sorted(data['elements'], key=lambda e: e.get('order', 0))
        
        logger.debug(f"Prepared onepager data with {len(data['elements'])} elements")
        return data
    
    def _prepare_brand_data(self, brand_kit: BrandKitInDB) -> Dict[str, Any]:
        """
        Convert BrandKitInDB to dict suitable for template rendering.
        
        Args:
            brand_kit: BrandKit model
        
        Returns:
            Dictionary with template-friendly structure
        """
        # Convert to dict using Pydantic v2 model_dump()
        try:
            data = brand_kit.model_dump()
        except AttributeError:
            # Fallback for Pydantic v1
            data = brand_kit.dict()
        
        # Ensure required fields exist with defaults
        if 'color_palette' not in data or data['color_palette'] is None:
            data['color_palette'] = {
                'primary': '#0ea5e9',
                'secondary': '#64748b',
                'accent': '#10b981',
                'text': '#1f2937',
                'background': '#ffffff'
            }
        
        if 'typography' not in data or data['typography'] is None:
            data['typography'] = {
                'heading_font': 'Montserrat',
                'body_font': 'Inter',
                'heading_size': '32px',
                'body_size': '16px'
            }
        
        logger.debug(f"Prepared brand data for: {data.get('company_name', 'Unknown')}")
        return data
    
    def generate_preview_html(
        self,
        onepager: OnePagerLayout,
        brand_kit: BrandKitInDB,
        watermark: str = None
    ) -> str:
        """
        Generate HTML with optional watermark for preview purposes.
        
        Args:
            onepager: OnePager layout
            brand_kit: Brand Kit
            watermark: Optional watermark text (e.g., "PREVIEW" or "DRAFT")
        
        Returns:
            HTML string with watermark overlay
        """
        html = self.generate_html(onepager, brand_kit)
        
        if watermark:
            # Add watermark overlay
            watermark_style = """
            <style>
                body::before {
                    content: '""" + watermark + """';
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 120px;
                    font-weight: 800;
                    color: rgba(0, 0, 0, 0.05);
                    z-index: 9999;
                    pointer-events: none;
                    font-family: var(--font-heading);
                }
            </style>
            """
            html = html.replace('</head>', watermark_style + '</head>')
        
        return html


# Convenience function for quick HTML generation
def generate_pdf_html(
    onepager: OnePagerLayout,
    brand_kit: BrandKitInDB
) -> str:
    """
    Convenience function to generate PDF HTML.
    
    Args:
        onepager: OnePager layout
        brand_kit: Brand Kit
    
    Returns:
        HTML string ready for PDF conversion
    """
    generator = PDFHTMLGenerator()
    return generator.generate_html(onepager, brand_kit)
