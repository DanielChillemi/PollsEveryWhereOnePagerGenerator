"""
Canva Data Translator Service
==============================

Converts OnePagerLayout JSON to Canva Connect API format.

This service provides translation between our internal one-pager representation
and the format required by Canva's Connect API for design creation.
"""

from typing import Dict, Any, List, Optional
import logging
import os

from backend.models.onepager_canva import OnePagerLayout, OnePagerElement, ElementType
from backend.models.profile import BrandProfile
from backend.integrations.canva.canva_client import CanvaClient
from backend.config import settings


logger = logging.getLogger(__name__)


class CanvaTranslationError(Exception):
    """Raised when translation to Canva format fails."""
    pass


class CanvaTranslator:
    """
    Translates internal OnePagerLayout to Canva API format.
    
    Usage:
        translator = CanvaTranslator()
        canva_design = translator.translate(layout)
        design_id = translator.create_design(layout)
        pdf_path = translator.export_to_pdf(design_id)
    
    Example:
        ```python
        from backend.services.canva_translator import CanvaTranslator
        from backend.models.onepager import OnePagerLayout
        from backend.models.profile import BrandProfile
        
        # Create translator
        translator = CanvaTranslator()
        
        # Translate and create design
        layout = OnePagerLayout(...)
        brand = BrandProfile(primary_color="#007ACC")
        
        design_id, pdf_path = translator.create_and_export(layout, brand)
        ```
    """
    
    # Canva design type mapping
    DESIGN_TYPES = {
        "one-pager": "presentation",
        "social": "social_media_post",
        "document": "document"
    }
    
    def __init__(self, canva_client: Optional[CanvaClient] = None):
        """
        Initialize translator.
        
        Args:
            canva_client: Optional CanvaClient (auto-creates if not provided)
        """
        self.canva_client = canva_client or self._create_canva_client()
        self.logger = logging.getLogger(__name__)
    
    def _create_canva_client(self) -> CanvaClient:
        """Create CanvaClient from environment settings."""
        if not settings.canva_access_token:
            raise CanvaTranslationError(
                "CANVA_ACCESS_TOKEN not configured. "
                "Please set it in .env file before using the translator."
            )
        
        return CanvaClient(
            api_token=settings.canva_access_token,
            base_url=settings.canva_api_base_url
        )
    
    def translate(
        self, 
        layout: OnePagerLayout,
        brand_profile: Optional[BrandProfile] = None
    ) -> Dict[str, Any]:
        """
        Translate OnePagerLayout to Canva design format.
        
        Args:
            layout: OnePagerLayout to translate
            brand_profile: Optional BrandProfile for styling
            
        Returns:
            Dict in Canva API design creation format
            
        Raises:
            CanvaTranslationError: If translation fails
        """
        try:
            self.logger.info(f"Translating layout: {layout.title}")
            
            # Merge brand profile from layout if not provided
            if not brand_profile and layout.brand_colors:
                brand_profile = self._create_brand_from_layout(layout)
            
            # Build Canva design specification
            canva_design = {
                "design_type": self.DESIGN_TYPES.get("one-pager", "presentation"),
                "title": layout.title,
                "dimensions": {
                    "width": layout.dimensions.width,
                    "height": layout.dimensions.height,
                    "unit": "px"
                },
                "pages": [
                    {
                        "elements": self._translate_elements(
                            layout.elements, 
                            brand_profile
                        )
                    }
                ]
            }
            
            self.logger.info(
                f"Translation complete: {len(layout.elements)} elements → "
                f"{len(canva_design['pages'][0]['elements'])} Canva elements"
            )
            
            return canva_design
            
        except Exception as e:
            self.logger.error(f"Translation failed: {str(e)}", exc_info=True)
            raise CanvaTranslationError(f"Failed to translate layout: {str(e)}")
    
    def _create_brand_from_layout(self, layout: OnePagerLayout) -> BrandProfile:
        """Create BrandProfile from layout brand data."""
        return BrandProfile(
            primary_color=layout.brand_colors.get("primary", "#007ACC"),
            text_color=layout.brand_colors.get("text", "#333333"),
            background_color=layout.brand_colors.get("background", "#FFFFFF"),
            primary_font=layout.brand_fonts.get("primary", "Source Sans Pro") if layout.brand_fonts else "Source Sans Pro",
            logo_url=layout.brand_logo_url
        )
    
    def _translate_elements(
        self,
        elements: List[OnePagerElement],
        brand_profile: Optional[BrandProfile]
    ) -> List[Dict[str, Any]]:
        """Translate all elements with brand styling."""
        canva_elements = []
        
        # Sort by order and filter visible elements
        visible_elements = [e for e in elements if e.visible]
        sorted_elements = sorted(visible_elements, key=lambda e: e.order)
        
        for element in sorted_elements:
            try:
                canva_element = self._translate_element(element, brand_profile)
                if canva_element:
                    canva_elements.append(canva_element)
            except Exception as e:
                self.logger.warning(
                    f"Failed to translate element {element.id} ({element.type}): {str(e)}"
                )
        
        return canva_elements
    
    def _translate_element(
        self,
        element: OnePagerElement,
        brand_profile: Optional[BrandProfile]
    ) -> Optional[Dict[str, Any]]:
        """
        Translate single element based on type.
        
        Routes to element-specific translator methods.
        """
        # Element translator dispatch
        translators = {
            ElementType.HEADER: self._translate_header,
            ElementType.HERO: self._translate_hero,
            ElementType.FEATURES: self._translate_features,
            ElementType.TESTIMONIALS: self._translate_testimonials,
            ElementType.CTA: self._translate_cta,
            ElementType.FOOTER: self._translate_footer,
            ElementType.IMAGE: self._translate_image,
            ElementType.TEXT_BLOCK: self._translate_text_block,
        }
        
        translator_func = translators.get(element.type)
        if not translator_func:
            self.logger.warning(f"No translator for element type: {element.type}")
            return None
        
        # Translate element
        canva_element = translator_func(element)
        
        # Apply brand styling
        if brand_profile and canva_element:
            canva_element = self._apply_brand_styling(
                canva_element, 
                element, 
                brand_profile
            )
        
        return canva_element
    
    # =========================================================================
    # Element-Specific Translators
    # =========================================================================
    
    def _translate_header(self, element: OnePagerElement) -> Dict[str, Any]:
        """Translate HEADER element to Canva format."""
        content = element.content
        
        return {
            "type": "text",
            "text": content.get("title", ""),
            "font_size": element.styling.font_size or 48 if element.styling else 48,
            "font_weight": "bold",
            "text_align": element.styling.text_align or "center" if element.styling else "center",
            "position": element.position.dict() if element.position else self._auto_position(element),
            "styling": {
                "background_color": element.styling.background_color if element.styling else None,
                "text_color": element.styling.text_color if element.styling else None,
                "padding": element.styling.padding if element.styling else 40
            }
        }
    
    def _translate_hero(self, element: OnePagerElement) -> Dict[str, Any]:
        """Translate HERO element to Canva format."""
        content = element.content
        
        # Hero is complex - contains multiple sub-elements
        hero_elements = []
        
        # Headline
        if content.get("headline"):
            hero_elements.append({
                "type": "text",
                "text": content["headline"],
                "font_size": 48,
                "font_weight": "bold",
                "text_align": "center"
            })
        
        # Description
        if content.get("description"):
            hero_elements.append({
                "type": "text",
                "text": content["description"],
                "font_size": 18,
                "text_align": "center"
            })
        
        # CTA Button
        if content.get("cta_text"):
            hero_elements.append({
                "type": "button",
                "text": content["cta_text"],
                "url": content.get("cta_url", "#"),
                "style": "primary"
            })
        
        # Return as group
        return {
            "type": "group",
            "elements": hero_elements,
            "position": element.position.dict() if element.position else self._auto_position(element)
        }
    
    def _translate_cta(self, element: OnePagerElement) -> Dict[str, Any]:
        """Translate CTA element to Canva format."""
        content = element.content
        
        return {
            "type": "button",
            "text": content.get("primary_text", "Get Started"),
            "url": content.get("primary_url", "#"),
            "style": "primary",
            "position": element.position.dict() if element.position else self._auto_position(element),
            "styling": {
                "background_color": element.styling.background_color if element.styling else None,
                "text_color": element.styling.text_color if element.styling else "#ffffff",
                "border_radius": element.styling.border_radius if element.styling else 50,
                "padding": element.styling.padding if element.styling else 30
            }
        }
    
    def _translate_footer(self, element: OnePagerElement) -> Dict[str, Any]:
        """Translate FOOTER element to Canva format."""
        content = element.content
        
        footer_text = content.get("company_name", "")
        if content.get("copyright_text"):
            footer_text += f" | {content['copyright_text']}"
        
        return {
            "type": "text",
            "text": footer_text,
            "font_size": 14,
            "text_align": "center",
            "position": element.position.dict() if element.position else self._auto_position(element, bottom=True)
        }
    
    def _translate_image(self, element: OnePagerElement) -> Dict[str, Any]:
        """Translate IMAGE element to Canva format."""
        content = element.content
        
        return {
            "type": "image",
            "url": content.get("image_url", ""),
            "alt_text": content.get("alt_text", ""),
            "position": element.position.dict() if element.position else self._auto_position(element)
        }
    
    def _translate_text_block(self, element: OnePagerElement) -> Dict[str, Any]:
        """Translate TEXT_BLOCK element to Canva format."""
        content = element.content
        
        return {
            "type": "text",
            "text": content.get("text", ""),
            "font_size": element.styling.font_size or 18 if element.styling else 18,
            "position": element.position.dict() if element.position else self._auto_position(element)
        }
    
    def _translate_features(self, element: OnePagerElement) -> Dict[str, Any]:
        """Translate FEATURES element to Canva format."""
        content = element.content
        
        # Simplified - would expand based on Canva's capabilities
        return {
            "type": "group",
            "title": content.get("section_title", "Features"),
            "elements": [],  # TODO: Map individual features in future iteration
            "position": element.position.dict() if element.position else self._auto_position(element)
        }
    
    def _translate_testimonials(self, element: OnePagerElement) -> Dict[str, Any]:
        """Translate TESTIMONIALS element to Canva format."""
        content = element.content
        
        # Simplified - would expand based on Canva's capabilities
        return {
            "type": "group",
            "title": content.get("section_title", "Testimonials"),
            "elements": [],  # TODO: Map individual testimonials in future iteration
            "position": element.position.dict() if element.position else self._auto_position(element)
        }
    
    # =========================================================================
    # Helper Methods
    # =========================================================================
    
    def _apply_brand_styling(
        self,
        canva_element: Dict[str, Any],
        element: OnePagerElement,
        brand_profile: BrandProfile
    ) -> Dict[str, Any]:
        """Apply brand styling to element (brand defaults + overrides)."""
        
        # Apply brand colors if not set
        if "styling" not in canva_element:
            canva_element["styling"] = {}
        
        styling = canva_element["styling"]
        
        # Background color
        if not styling.get("background_color"):
            styling["background_color"] = brand_profile.background_color
        
        # Text color
        if not styling.get("text_color"):
            styling["text_color"] = brand_profile.text_color
        
        # Font family
        if not canva_element.get("font_family"):
            canva_element["font_family"] = brand_profile.primary_font
        
        return canva_element
    
    def _auto_position(
        self, 
        element: OnePagerElement,
        bottom: bool = False
    ) -> Dict[str, int]:
        """
        Auto-calculate element position (simple stacking).
        
        TODO: Implement smarter layout algorithm in future iterations.
        """
        # Simple vertical stacking based on order
        y_offset = element.order * 200  # 200px per element
        
        if bottom:
            y_offset = 1800  # Near bottom for footers
        
        return {
            "x": 0,
            "y": y_offset,
            "width": 1080,
            "height": 180
        }
    
    # =========================================================================
    # High-Level Workflow Methods
    # =========================================================================
    
    def create_design(
        self, 
        layout: OnePagerLayout,
        brand_profile: Optional[BrandProfile] = None
    ) -> str:
        """
        Create Canva design from OnePagerLayout.
        
        Args:
            layout: OnePagerLayout to create
            brand_profile: Optional BrandProfile for styling
            
        Returns:
            design_id (str)
            
        Raises:
            CanvaTranslationError: If creation fails
        """
        try:
            # Translate to Canva format
            canva_data = self.translate(layout, brand_profile)
            
            # Create design via Canva API
            self.logger.info(f"Creating Canva design: {layout.title}")
            design = self.canva_client.create_design(canva_data)
            
            self.logger.info(f"Design created successfully: {design.id}")
            return design.id
            
        except Exception as e:
            self.logger.error(f"Failed to create design: {str(e)}")
            raise CanvaTranslationError(f"Design creation failed: {str(e)}")
    
    def export_to_pdf(
        self, 
        design_id: str, 
        output_path: Optional[str] = None
    ) -> str:
        """
        Export Canva design to PDF.
        
        Args:
            design_id: Canva design ID
            output_path: Optional output file path
            
        Returns:
            Path to downloaded PDF file
            
        Raises:
            CanvaTranslationError: If export fails
        """
        try:
            # Start export job
            self.logger.info(f"Starting PDF export for design: {design_id}")
            export_job = self.canva_client.export_design(design_id, format_type='pdf')
            
            # Wait for completion
            self.logger.info(f"Waiting for export job: {export_job.job_id}")
            completed_export = self.canva_client.wait_for_export(
                export_job.job_id,
                timeout=120  # 2 minute timeout
            )
            
            # Generate output path if not provided
            if not output_path:
                os.makedirs("backend/output", exist_ok=True)
                output_path = f"backend/output/{design_id}.pdf"
            
            # Download PDF
            self.logger.info(f"Downloading PDF to: {output_path}")
            pdf_path = self.canva_client.download_file(
                completed_export.download_url,
                output_path
            )
            
            self.logger.info(f"PDF exported successfully: {pdf_path}")
            return pdf_path
            
        except Exception as e:
            self.logger.error(f"Failed to export PDF: {str(e)}")
            raise CanvaTranslationError(f"PDF export failed: {str(e)}")
    
    def create_and_export(
        self,
        layout: OnePagerLayout,
        brand_profile: Optional[BrandProfile] = None,
        output_path: Optional[str] = None
    ) -> tuple:
        """
        Full workflow: Create design and export to PDF.
        
        Args:
            layout: OnePagerLayout to create
            brand_profile: Optional BrandProfile for styling
            output_path: Optional PDF output path
            
        Returns:
            Tuple of (design_id, pdf_path)
            
        Raises:
            CanvaTranslationError: If workflow fails
        """
        # Create design
        design_id = self.create_design(layout, brand_profile)
        
        # Export to PDF
        pdf_path = self.export_to_pdf(design_id, output_path)
        
        return design_id, pdf_path
