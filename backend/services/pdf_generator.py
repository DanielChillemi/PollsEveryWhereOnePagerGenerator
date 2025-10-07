"""
PDF Generator Service
=====================

Converts HTML to PDF using pyppeteer (Puppeteer for Python).
Provides async PDF generation with format support and error handling.

Features:
- Async/await support for non-blocking generation
- Multiple page formats (Letter, A4, Tabloid)
- Custom margins and print settings
- Background color/image support
- Browser instance management
- Comprehensive error handling
"""

import asyncio
from pyppeteer import launch
from typing import Optional, Literal, Dict
from pathlib import Path
import logging
from datetime import datetime


logger = logging.getLogger(__name__)


# Page format dimensions (width x height in inches at 96 DPI)
PAGE_FORMATS = {
    'letter': {
        'format': 'Letter',  # 8.5 x 11 inches
        'width': '8.5in',
        'height': '11in'
    },
    'a4': {
        'format': 'A4',  # 8.27 x 11.69 inches
        'width': '8.27in',
        'height': '11.69in'
    },
    'tabloid': {
        'format': 'Tabloid',  # 11 x 17 inches
        'width': '11in',
        'height': '17in'
    }
}


PageFormat = Literal['letter', 'a4', 'tabloid']


class PDFGeneratorError(Exception):
    """Raised when PDF generation fails."""
    pass


class PDFGenerator:
    """
    Generate PDFs from HTML using headless Chromium (pyppeteer).
    
    Usage:
        generator = PDFGenerator()
        pdf_bytes = await generator.generate_pdf(html_content)
        
        # Custom format
        pdf_bytes = await generator.generate_pdf(
            html_content,
            page_format='a4',
            margin={'top': '0.5in', 'right': '0.5in', 'bottom': '0.5in', 'left': '0.5in'}
        )
    """
    
    def __init__(self):
        """Initialize PDF generator."""
        logger.info("PDFGenerator initialized")
    
    async def generate_pdf(
        self,
        html_content: str,
        page_format: PageFormat = 'letter',
        margin: Optional[Dict[str, str]] = None,
        print_background: bool = True,
        prefer_css_page_size: bool = False,
        landscape: bool = False
    ) -> bytes:
        """
        Generate PDF from HTML string.
        
        Args:
            html_content: HTML string with inline CSS
            page_format: Page format ('letter', 'a4', 'tabloid')
            margin: Page margins dict with 'top', 'right', 'bottom', 'left' keys
            print_background: Include background colors/images
            prefer_css_page_size: Use CSS @page size instead of format parameter
            landscape: Render in landscape orientation
        
        Returns:
            PDF file as bytes
        
        Raises:
            PDFGeneratorError: If PDF generation fails
        
        Example:
            ```python
            html = "<html><body><h1>Hello World</h1></body></html>"
            pdf_bytes = await generator.generate_pdf(html, page_format='a4')
            
            with open('output.pdf', 'wb') as f:
                f.write(pdf_bytes)
            ```
        """
        start_time = datetime.now()
        
        # Validate page format
        if page_format not in PAGE_FORMATS:
            raise PDFGeneratorError(
                f"Invalid page format: {page_format}. "
                f"Must be one of: {list(PAGE_FORMATS.keys())}"
            )
        
        # Default margins (no margins for full-bleed designs)
        if margin is None:
            margin = {
                'top': '0in',
                'right': '0in',
                'bottom': '0in',
                'left': '0in'
            }
        
        format_config = PAGE_FORMATS[page_format]
        
        logger.info(
            f"Generating PDF: format={page_format}, "
            f"landscape={landscape}, "
            f"printBackground={print_background}"
        )
        
        browser = None
        try:
            # Launch headless browser
            logger.debug("Launching headless Chromium...")
            browser = await launch(
                headless=True,
                args=[
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',  # Overcome limited resource problems
                    '--disable-accelerated-2d-canvas',
                    '--disable-gpu'
                ]
            )
            
            # Create new page
            logger.debug("Creating new page...")
            page = await browser.newPage()
            
            # Set viewport for consistent rendering
            await page.setViewport({
                'width': 1920,
                'height': 1080,
                'deviceScaleFactor': 2  # Higher DPI for better quality
            })
            
            # Set HTML content
            logger.debug("Setting HTML content...")
            await page.setContent(html_content)
            
            # Wait for fonts and resources to load
            logger.debug("Waiting for resources to load...")
            await asyncio.sleep(1)  # Give time for Google Fonts to load
            
            # Generate PDF
            logger.debug(f"Rendering PDF ({page_format})...")
            pdf_options = {
                'format': format_config['format'],
                'margin': margin,
                'printBackground': print_background,
                'preferCSSPageSize': prefer_css_page_size,
                'landscape': landscape
            }
            
            pdf_bytes = await page.pdf(pdf_options)
            
            elapsed = (datetime.now() - start_time).total_seconds()
            file_size_kb = len(pdf_bytes) / 1024
            
            logger.info(
                f"✅ PDF generated successfully: "
                f"{file_size_kb:.1f} KB in {elapsed:.2f}s"
            )
            
            return pdf_bytes
            
        except Exception as e:
            elapsed = (datetime.now() - start_time).total_seconds()
            logger.error(
                f"❌ PDF generation failed after {elapsed:.2f}s: {e}",
                exc_info=True
            )
            raise PDFGeneratorError(f"Failed to generate PDF: {e}")
        
        finally:
            # Always close browser
            if browser:
                logger.debug("Closing browser...")
                await browser.close()
    
    async def generate_pdf_to_file(
        self,
        html_content: str,
        output_path: Path,
        page_format: PageFormat = 'letter',
        **kwargs
    ):
        """
        Generate PDF and save directly to file.
        
        Args:
            html_content: HTML string
            output_path: Path to save PDF
            page_format: Page format
            **kwargs: Additional arguments passed to generate_pdf()
        
        Raises:
            PDFGeneratorError: If generation or file write fails
        """
        try:
            pdf_bytes = await self.generate_pdf(
                html_content,
                page_format=page_format,
                **kwargs
            )
            
            # Ensure parent directory exists
            output_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Write to file
            with open(output_path, 'wb') as f:
                f.write(pdf_bytes)
            
            logger.info(f"✅ PDF saved to: {output_path}")
            
        except Exception as e:
            logger.error(f"Failed to save PDF to file: {e}")
            raise PDFGeneratorError(f"Failed to save PDF: {e}")


# Convenience function for one-off PDF generation
async def generate_pdf_from_html(
    html_content: str,
    page_format: PageFormat = 'letter',
    **kwargs
) -> bytes:
    """
    Convenience function for quick PDF generation.
    
    Args:
        html_content: HTML string
        page_format: Page format ('letter', 'a4', 'tabloid')
        **kwargs: Additional options passed to PDFGenerator.generate_pdf()
    
    Returns:
        PDF bytes
    
    Example:
        ```python
        html = "<html><body><h1>Test</h1></body></html>"
        pdf = await generate_pdf_from_html(html, page_format='a4')
        ```
    """
    generator = PDFGenerator()
    return await generator.generate_pdf(html_content, page_format=page_format, **kwargs)
