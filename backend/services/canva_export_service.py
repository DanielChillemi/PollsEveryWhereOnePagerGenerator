"""
Canva Export Service
====================

Orchestrates the full export workflow:
1. Render OnePagerLayout to image
2. Upload to Canva as asset
3.             # Step 4: Export to PDF (if requested)
            if wait_for_export:
                logger.info("Step 4/4: Exporting to PDF...")
                export_result = self.canva_client.export_design(
                    design_id=design_id,
                    format_type="pdf"
                )design from asset
4. Export as PDF

This service provides the high-level workflow for exporting one-pagers
to Canva without requiring Enterprise-level autofill APIs.
"""

from typing import Dict, Any, Optional
import logging
import time

from backend.integrations.canva.canva_client import CanvaClient, CanvaAPIError
from backend.services.onepager_renderer import OnePagerRenderer, PageFormat
from backend.models.onepager import OnePagerLayout
from backend.models.profile import BrandProfile
from backend.config import settings


logger = logging.getLogger(__name__)


class CanvaExportError(Exception):
    """Raised when Canva export fails."""
    pass


class CanvaExportService:
    """
    High-level service for exporting one-pagers to Canva.
    
    Workflow:
        1. Render OnePagerLayout to print-quality image (300 DPI)
        2. Upload image to Canva as asset
        3. Create Canva design containing the image
        4. Export design as PDF
        5. Return PDF download URL
    
    Usage:
        service = CanvaExportService()
        result = service.export_to_canva(onepager, brand_profile)
        print(f"Design URL: {result['design_url']}")
        print(f"PDF URL: {result['pdf_url']}")
    """
    
    def __init__(self, access_token: Optional[str] = None):
        """
        Initialize with Canva client and renderer.
        
        Args:
            access_token: Canva API token (defaults to settings.canva_access_token)
        """
        token = access_token or settings.canva_access_token
        if not token:
            raise ValueError("canva_access_token is required")
        
        self.canva_client = CanvaClient(api_token=token)
        
        # Default to US Letter format
        self.renderer = OnePagerRenderer(
            page_format=PageFormat.US_LETTER,
            dpi=300
        )
        
        logger.info("CanvaExportService initialized")
    
    def export_to_canva(
        self,
        onepager: OnePagerLayout,
        brand_profile: BrandProfile,
        page_format: str = "us_letter",
        wait_for_export: bool = True,
        export_timeout: int = 300
    ) -> Dict[str, Any]:
        """
        Export one-pager to Canva design with PDF.
        
        Args:
            onepager: Layout data structure
            brand_profile: Brand styling configuration
            page_format: "us_letter" (8.5×11"), "a4" (8.27×11.69"), or "tabloid" (11×17")
            wait_for_export: If True, poll until PDF export completes
            export_timeout: Maximum seconds to wait for PDF export
            
        Returns:
            {
                "asset_id": "uuid",
                "design_id": "DAF...",
                "design_url": "https://canva.com/design/...",
                "edit_url": "https://canva.com/design/.../edit",
                "pdf_url": "https://...",  # If wait_for_export=True
                "thumbnail_url": "https://...",
                "export_time_seconds": 12.5
            }
            
        Raises:
            CanvaExportError: If export fails
            CanvaAPIError: If API request fails
        """
        start_time = time.time()
        
        try:
            logger.info(f"Starting Canva export for '{onepager.title}'")
            logger.info(f"Page format: {page_format}, Wait for PDF: {wait_for_export}")
            
            # Step 1: Render to image
            logger.info("Step 1/4: Rendering to image...")
            self._configure_renderer(page_format)
            image_bytes = self.renderer.render(onepager, brand_profile)
            logger.info(f"✓ Rendered image: {len(image_bytes)} bytes")
            
            # Step 2: Upload to Canva (async job)
            logger.info("Step 2/4: Uploading to Canva...")
            upload_result = self.canva_client.upload_asset(
                file_data=image_bytes,
                file_name=f"{self._sanitize_filename(onepager.title)}.png"
            )
            job_id = upload_result["job"]["id"]
            logger.info(f"✓ Asset upload job created: {job_id}")
            
            # Wait for upload to complete (pass initial response to check for immediate success)
            logger.info("Step 2b/4: Waiting for asset upload to complete...")
            asset_id = self.canva_client.wait_for_asset_upload(
                job_id,
                initial_response=upload_result,
                timeout=60
            )
            logger.info(f"✓ Asset uploaded: {asset_id}")
            
            # Step 3: Create design
            logger.info("Step 3/4: Creating Canva design...")
            design_result = self.canva_client.create_design_from_asset(
                asset_id=asset_id,
                title=onepager.title,
                design_type="presentation"
            )
            design_id = design_result["design"]["id"]
            # Construct design URL from design ID
            design_url = f"https://www.canva.com/design/{design_id}/view"
            logger.info(f"✓ Design created: {design_id}")
            logger.info(f"✓ Design URL: {design_url}")
            
            result = {
                "asset_id": asset_id,
                "design_id": design_id,
                "design_url": design_url,
                "edit_url": design_result["design"].get("url", "").replace("/view", "/edit") if "/view" in design_result["design"].get("url", "") else design_url,
                "thumbnail_url": design_result["design"].get("thumbnail", {}).get("url"),
                "created_at": design_result["design"].get("created_at"),
                "updated_at": design_result["design"].get("updated_at")
            }
            
            # Step 4: Export to PDF (optional)
            if wait_for_export:
                logger.info("Step 4/4: Exporting to PDF...")
                export_result = self.canva_client.export_design(
                    design_id=design_id,
                    format_type="pdf"
                )
                
                # Wait for export completion
                export_job = self.canva_client.wait_for_export(
                    export_result.job_id,
                    timeout=export_timeout
                )
                
                result["pdf_url"] = export_job.url
                logger.info(f"✓ PDF exported: {export_job.url}")
            else:
                logger.info("Step 4/4: Skipped (wait_for_export=False)")
            
            export_time = time.time() - start_time
            result["export_time_seconds"] = round(export_time, 2)
            
            logger.info(f"🎉 Canva export complete in {export_time:.2f}s!")
            return result
            
        except CanvaAPIError as e:
            logger.error(f"Canva API error: {e.message}")
            raise CanvaExportError(f"Canva API failed: {e.message}") from e
        except Exception as e:
            logger.error(f"Unexpected error during export: {e}", exc_info=True)
            raise CanvaExportError(f"Export failed: {e}") from e
    
    def export_to_canva_async(
        self,
        onepager: OnePagerLayout,
        brand_profile: BrandProfile,
        page_format: str = "us_letter"
    ) -> Dict[str, Any]:
        """
        Export one-pager to Canva (async - returns immediately without PDF).
        
        Design creation happens synchronously, but PDF export is skipped.
        Use this for faster response times when PDF is not immediately needed.
        
        Args:
            onepager: Layout data structure
            brand_profile: Brand styling configuration
            page_format: "us_letter", "a4", or "tabloid"
            
        Returns:
            {
                "asset_id": "uuid",
                "design_id": "DAF...",
                "design_url": "https://canva.com/design/...",
                "status": "created"
            }
        """
        logger.info("Starting async Canva export (no PDF)")
        
        result = self.export_to_canva(
            onepager=onepager,
            brand_profile=brand_profile,
            page_format=page_format,
            wait_for_export=False
        )
        
        result["status"] = "created"
        return result
    
    def _configure_renderer(self, page_format: str) -> None:
        """Configure renderer with specified page format."""
        format_map = {
            "us_letter": PageFormat.US_LETTER,
            "a4": PageFormat.A4,
            "tabloid": PageFormat.TABLOID
        }
        
        if page_format.lower() not in format_map:
            logger.warning(f"Unknown page format '{page_format}', using US Letter")
            page_format = "us_letter"
        
        self.renderer = OnePagerRenderer(
            page_format=format_map[page_format.lower()],
            dpi=300
        )
        logger.debug(f"Renderer configured for {page_format}")
    
    def _sanitize_filename(self, filename: str) -> str:
        """Sanitize filename for safe upload."""
        # Replace spaces and special characters
        safe_name = filename.replace(' ', '_')
        # Remove any characters that aren't alphanumeric, underscore, or hyphen
        safe_name = ''.join(c for c in safe_name if c.isalnum() or c in ('_', '-'))
        # Limit length
        return safe_name[:100]
    
    def get_page_formats(self) -> Dict[str, Dict[str, Any]]:
        """
        Get available page format specifications.
        
        Returns:
            {
                "us_letter": {"width": 2550, "height": 3300, "inches": "8.5×11\""},
                "a4": {"width": 2480, "height": 3508, "inches": "8.27×11.69\""},
                "tabloid": {"width": 3300, "height": 5100, "inches": "11×17\""}
            }
        """
        return {
            "us_letter": {
                "width": 2550,
                "height": 3300,
                "inches": "8.5×11\"",
                "description": "North American standard letter"
            },
            "a4": {
                "width": 2480,
                "height": 3508,
                "inches": "8.27×11.69\"",
                "description": "International standard"
            },
            "tabloid": {
                "width": 3300,
                "height": 5100,
                "inches": "11×17\"",
                "description": "Large format presentation"
            }
        }
