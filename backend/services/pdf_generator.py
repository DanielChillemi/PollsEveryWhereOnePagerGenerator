"""
PDF Generator Service
=====================

Converts HTML to PDF using Playwright (modern browser automation).
Provides async PDF generation with format support and error handling.

Features:
- Async/await support for non-blocking generation
- Multiple page formats (Letter, A4, Tabloid)
- Custom margins and print settings
- Background color/image support
- Browser instance management
- Comprehensive error handling
- Actively maintained (Microsoft-backed)
"""

import asyncio
from playwright.async_api import async_playwright
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
    Generate PDFs from HTML using headless Chromium (Playwright).
    
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
        logger.info("PDFGenerator initialized (using Playwright)")
    
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
        
        try:
            # Workaround for Python 3.13 + Playwright compatibility issue on Windows
            # Use sync API with asyncio.to_thread() to avoid NotImplementedError
            import asyncio
            from playwright.sync_api import sync_playwright
            
            def _generate_pdf_sync():
                """Synchronous PDF generation using Playwright sync API."""
                with sync_playwright() as p:
                    logger.debug("Launching headless Chromium with Playwright (sync mode)...")
                    
                    # Launch browser
                    browser = p.chromium.launch(
                        headless=True,
                        args=[
                            '--no-sandbox',
                            '--disable-setuid-sandbox',
                            '--disable-dev-shm-usage',
                            '--disable-accelerated-2d-canvas',
                            '--disable-gpu'
                        ]
                    )
                    
                    try:
                        # Create new page
                        logger.debug("Creating new page...")
                        page = browser.new_page()
                        
                        # Set viewport for consistent rendering
                        page.set_viewport_size({'width': 1920, 'height': 1080})
                        
                        # Set HTML content
                        logger.debug("Setting HTML content...")
                        page.set_content(html_content)
                        
                        # Wait for fonts and resources to load
                        logger.debug("Waiting for resources to load...")
                        page.wait_for_timeout(1000)  # 1 second for Google Fonts
                        
                        # Generate PDF
                        logger.debug(f"Rendering PDF ({page_format})...")
                        pdf_bytes = page.pdf(
                            format=format_config['format'],
                            margin=margin,
                            print_background=print_background,
                            prefer_css_page_size=prefer_css_page_size,
                            landscape=landscape
                        )
                        
                        return pdf_bytes
                        
                    finally:
                        # Close browser
                        logger.debug("Closing browser...")
                        browser.close()
            
            # Run sync Playwright in thread pool to avoid blocking
            pdf_bytes = await asyncio.to_thread(_generate_pdf_sync)
            
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
            html_content: HTML string with inline CSS
            output_path: Path where PDF should be saved
            page_format: Page format ('letter', 'a4', 'tabloid')
            **kwargs: Additional arguments passed to generate_pdf()
        
        Example:
            ```python
            await generator.generate_pdf_to_file(
                html_content,
                Path('output.pdf'),
                page_format='letter'
            )
            ```
        """
        logger.info(f"Generating PDF to file: {output_path}")
        
        pdf_bytes = await self.generate_pdf(html_content, page_format, **kwargs)
        
        # Write to file
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_bytes(pdf_bytes)
        
        logger.info(f"✅ PDF saved to: {output_path}")


# Module-level convenience function
async def generate_pdf(
    html_content: str,
    page_format: PageFormat = 'letter',
    **kwargs
) -> bytes:
    """
    Convenience function for one-off PDF generation.
    
    Args:
        html_content: HTML string with inline CSS
        page_format: Page format ('letter', 'a4', 'tabloid')
        **kwargs: Additional arguments (margin, print_background, etc.)
    
    Returns:
        PDF file as bytes
    
    Example:
        ```python
        from backend.services.pdf_generator import generate_pdf
        
        html = "<html><body><h1>Hello</h1></body></html>"
        pdf = await generate_pdf(html, page_format='a4')
        ```
    """
    generator = PDFGenerator()
    return await generator.generate_pdf(html_content, page_format, **kwargs)
