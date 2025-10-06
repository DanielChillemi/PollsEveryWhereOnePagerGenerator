"""
OnePager Image Renderer
========================

Converts OnePagerLayout JSON to print-quality images.
Supports US Letter, A4, and custom dimensions at 300 DPI.

Features:
- Print-quality rendering (300 DPI)
- Brand Kit color/font application
- Section-based layout system
- Image asset loading from URLs
- Text wrapping and formatting
- Support for hero, content sections, and footer
"""

from PIL import Image, ImageDraw, ImageFont, ImageColor
from typing import Dict, Any, List, Optional, Tuple
import io
import requests
from pathlib import Path
import logging

from backend.models.onepager import OnePagerLayout, OnePagerElement, ElementType
from backend.models.profile import BrandProfile


logger = logging.getLogger(__name__)


class PageFormat:
    """Standard print formats at 300 DPI."""
    US_LETTER = (2550, 3300)  # 8.5" × 11"
    A4 = (2480, 3508)          # 8.27" × 11.69"
    TABLOID = (3300, 5100)     # 11" × 17"


class OnePagerRendererError(Exception):
    """Raised when rendering fails."""
    pass


class OnePagerRenderer:
    """
    Render OnePagerLayout to publication-ready images.
    
    Usage:
        renderer = OnePagerRenderer()
        png_bytes = renderer.render(onepager_layout, brand_profile)
        
        # Custom format
        renderer = OnePagerRenderer(page_format=PageFormat.A4)
        png_bytes = renderer.render(onepager_layout, brand_profile)
    """
    
    def __init__(
        self,
        page_format: Tuple[int, int] = PageFormat.US_LETTER,
        dpi: int = 300,
        background_color: str = "#FFFFFF"
    ):
        """
        Initialize renderer with page specifications.
        
        Args:
            page_format: (width, height) in pixels
            dpi: Dots per inch for print quality
            background_color: Default background hex color
        """
        self.width, self.height = page_format
        self.dpi = dpi
        self.background_color = background_color
        self.margin = int(self.width * 0.05)  # 5% margins
        self.content_width = self.width - (2 * self.margin)
        
        # Font cache
        self._font_cache: Dict[Tuple[str, int], ImageFont.FreeTypeFont] = {}
        
        logger.info(f"Renderer initialized: {self.width}×{self.height}px @ {self.dpi} DPI")
        
    def render(
        self,
        onepager: OnePagerLayout,
        brand_profile: BrandProfile
    ) -> bytes:
        """
        Render one-pager to PNG bytes.
        
        Args:
            onepager: Layout data structure
            brand_profile: Brand styling configuration
            
        Returns:
            PNG image as bytes
            
        Raises:
            OnePagerRendererError: If rendering fails
        """
        try:
            logger.info(f"Starting render for '{onepager.title}'")
            
            # Create canvas with brand background
            bg_color = brand_profile.primary_color or self.background_color
            img = Image.new('RGB', (self.width, self.height), color=bg_color)
            draw = ImageDraw.Draw(img)
            
            # Track vertical position
            y_offset = self.margin
            
            # Sort elements by order
            sorted_elements = sorted(onepager.elements, key=lambda e: e.order)
            
            # Render elements in order
            logger.debug(f"Rendering {len(sorted_elements)} elements...")
            for element in sorted_elements:
                if element.type == ElementType.HERO:
                    logger.debug(f"Rendering HERO element: {element.id}")
                    y_offset = self._render_hero_section(
                        draw, img, element, brand_profile, y_offset
                    )
                elif element.type == ElementType.FOOTER:
                    logger.debug(f"Rendering FOOTER element: {element.id}")
                    self._render_footer(draw, img, element, brand_profile)
                else:
                    logger.debug(f"Rendering {element.type} element: {element.id}")
                    y_offset = self._render_section(
                        draw, img, element, brand_profile, y_offset
                    )
                    y_offset += self.margin // 2  # Section spacing
            
            # Convert to bytes
            buffer = io.BytesIO()
            img.save(buffer, format='PNG', dpi=(self.dpi, self.dpi))
            buffer.seek(0)
            
            png_bytes = buffer.getvalue()
            logger.info(f"✓ Render complete: {len(png_bytes)} bytes")
            
            return png_bytes
            
        except Exception as e:
            logger.error(f"Render failed: {e}")
            raise OnePagerRendererError(f"Failed to render one-pager: {e}")
    
    def _render_hero_section(
        self,
        draw: ImageDraw.ImageDraw,
        img: Image.Image,
        hero: OnePagerElement,
        brand: BrandProfile,
        y_start: int
    ) -> int:
        """
        Render hero/header section.
        
        Returns new y_offset after rendering.
        """
        x = self.margin
        y = y_start
        
        # Hero background (if different from page)
        hero_height = int(self.height * 0.25)  # 25% of page height
        if hero.styling and hero.styling.background_color:
            draw.rectangle(
                [0, y, self.width, y + hero_height],
                fill=hero.styling.background_color
            )
        
        # Load and render logo (if present)
        if brand.logo_url:
            try:
                logo_img = self._load_image(brand.logo_url)
                logo_size = (int(self.content_width * 0.15), int(hero_height * 0.4))
                logo_img.thumbnail(logo_size, Image.Resampling.LANCZOS)
                
                # Center logo horizontally
                logo_x = x + (self.content_width - logo_img.width) // 2
                img.paste(logo_img, (logo_x, y + 40), logo_img if logo_img.mode == 'RGBA' else None)
                y += logo_img.height + 60
            except Exception as e:
                logger.warning(f"Could not load logo: {e}")
        
        # Hero title
        if hero.content and hero.content.get('title'):
            title_font = self._get_font(brand.primary_font or 'Arial', size=96)
            title_color = hero.styling.text_color if hero.styling else brand.secondary_color or "#000000"
            
            title_lines = self._wrap_text(
                hero.content['title'],
                title_font,
                self.content_width
            )
            for line in title_lines:
                bbox = draw.textbbox((0, 0), line, font=title_font)
                text_width = bbox[2] - bbox[0]
                text_x = x + (self.content_width - text_width) // 2  # Center
                draw.text((text_x, y), line, fill=title_color, font=title_font)
                y += bbox[3] - bbox[1] + 20
        
        # Hero subtitle/description
        if hero.content and hero.content.get('description'):
            desc_font = self._get_font(brand.secondary_font or 'Arial', size=48)
            desc_color = hero.styling.text_color if hero.styling else brand.text_color or "#333333"
            
            desc_lines = self._wrap_text(
                hero.content['description'],
                desc_font,
                int(self.content_width * 0.8)  # 80% width for readability
            )
            for line in desc_lines:
                bbox = draw.textbbox((0, 0), line, font=desc_font)
                text_width = bbox[2] - bbox[0]
                text_x = x + (self.content_width - text_width) // 2
                draw.text((text_x, y), line, fill=desc_color, font=desc_font)
                y += bbox[3] - bbox[1] + 15
        
        return max(y, y_start + hero_height) + self.margin
    
    def _render_section(
        self,
        draw: ImageDraw.ImageDraw,
        img: Image.Image,
        section: OnePagerElement,
        brand: BrandProfile,
        y_start: int
    ) -> int:
        """
        Render content section (features, testimonials, etc.).
        
        Returns new y_offset after rendering.
        """
        x = self.margin
        y = y_start
        
        # Section title
        if section.content and section.content.get('title'):
            title_font = self._get_font(brand.primary_font or 'Arial', size=72)
            title_color = section.styling.text_color if section.styling else brand.secondary_color or "#000000"
            draw.text((x, y), section.content['title'], fill=title_color, font=title_font)
            bbox = draw.textbbox((x, y), section.content['title'], font=title_font)
            y += (bbox[3] - bbox[1]) + 30
        
        # Section body text
        if section.content and section.content.get('description'):
            body_font = self._get_font(brand.secondary_font or 'Arial', size=42)
            body_color = section.styling.text_color if section.styling else brand.text_color or "#333333"
            
            body_lines = self._wrap_text(
                section.content['description'],
                body_font,
                self.content_width
            )
            for line in body_lines:
                draw.text((x, y), line, fill=body_color, font=body_font)
                bbox = draw.textbbox((x, y), line, font=body_font)
                y += (bbox[3] - bbox[1]) + 12
        
        # Section image (if present)
        if section.content and section.content.get('image_url'):
            try:
                section_img = self._load_image(section.content['image_url'])
                img_width = int(self.content_width * 0.6)  # 60% of content width
                aspect_ratio = section_img.height / section_img.width
                img_height = int(img_width * aspect_ratio)
                section_img = section_img.resize((img_width, img_height), Image.Resampling.LANCZOS)
                
                # Center image
                img_x = x + (self.content_width - img_width) // 2
                img.paste(section_img, (img_x, y))
                y += img_height + 30
            except Exception as e:
                logger.warning(f"Could not load section image: {e}")
        
        # Features list (if present)
        if section.content and section.content.get('features'):
            features = section.content['features']
            if isinstance(features, list):
                feature_font = self._get_font(brand.secondary_font or 'Arial', size=38)
                feature_color = brand.text_color or "#333333"
                
                for feature in features:
                    feature_text = f"• {feature}" if isinstance(feature, str) else f"• {feature.get('text', '')}"
                    feature_lines = self._wrap_text(feature_text, feature_font, self.content_width - 50)
                    
                    for line in feature_lines:
                        draw.text((x + 30, y), line, fill=feature_color, font=feature_font)
                        bbox = draw.textbbox((x + 30, y), line, font=feature_font)
                        y += (bbox[3] - bbox[1]) + 10
                    y += 15  # Space between features
        
        return y
    
    def _render_footer(
        self,
        draw: ImageDraw.ImageDraw,
        img: Image.Image,
        footer: OnePagerElement,
        brand: BrandProfile
    ) -> None:
        """Render footer at bottom of page."""
        footer_height = 150
        y = self.height - footer_height - self.margin
        x = self.margin
        
        # Footer background
        if footer.styling and footer.styling.background_color:
            draw.rectangle(
                [0, y, self.width, self.height],
                fill=footer.styling.background_color
            )
        
        # Footer text (centered)
        if footer.content and footer.content.get('text'):
            footer_font = self._get_font(brand.secondary_font or 'Arial', size=36)
            footer_color = footer.styling.text_color if footer.styling else brand.text_color or "#666666"
            
            text = footer.content['text']
            bbox = draw.textbbox((0, 0), text, font=footer_font)
            text_width = bbox[2] - bbox[0]
            text_x = (self.width - text_width) // 2
            text_y = y + (footer_height - (bbox[3] - bbox[1])) // 2
            
            draw.text((text_x, text_y), text, fill=footer_color, font=footer_font)
    
    def _wrap_text(
        self,
        text: str,
        font: ImageFont.FreeTypeFont,
        max_width: int
    ) -> List[str]:
        """
        Wrap text to fit within max_width.
        
        Returns list of lines.
        """
        words = text.split()
        lines = []
        current_line = []
        
        for word in words:
            test_line = ' '.join(current_line + [word])
            bbox = font.getbbox(test_line)
            width = bbox[2] - bbox[0]
            
            if width <= max_width:
                current_line.append(word)
            else:
                if current_line:
                    lines.append(' '.join(current_line))
                current_line = [word]
        
        if current_line:
            lines.append(' '.join(current_line))
        
        return lines if lines else ['']
    
    def _get_font(self, font_name: str, size: int) -> ImageFont.FreeTypeFont:
        """
        Load font with caching.
        Falls back to default if font not found.
        """
        cache_key = (font_name, size)
        
        if cache_key in self._font_cache:
            return self._font_cache[cache_key]
        
        try:
            # Try to load brand font
            font = ImageFont.truetype(font_name, size)
        except Exception:
            # Fall back to system default
            try:
                font = ImageFont.truetype("arial.ttf", size)
            except Exception:
                try:
                    # Try common Windows font path
                    font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", size)
                except Exception:
                    # Last resort: PIL default
                    logger.warning(f"Could not load font '{font_name}', using default")
                    font = ImageFont.load_default()
        
        self._font_cache[cache_key] = font
        return font
    
    def _load_image(self, url: str) -> Image.Image:
        """Load image from URL with error handling."""
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return Image.open(io.BytesIO(response.content)).convert('RGBA')
        except Exception as e:
            logger.error(f"Failed to load image from {url}: {e}")
            raise
