"""
Export API Routes
=================

FastAPI routes for exporting one-pagers to various formats (Canva, PDF, etc.).
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks, status
from typing import Optional, Literal
from pydantic import BaseModel, Field
import logging

from backend.services.canva_export_service import CanvaExportService, CanvaExportError
from backend.models.onepager import OnePagerLayout
from backend.models.profile import BrandProfile


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/export", tags=["export"])


class CanvaExportRequest(BaseModel):
    """Request model for Canva export."""
    onepager: OnePagerLayout
    brand_profile: BrandProfile
    page_format: Literal["us_letter", "a4", "tabloid"] = Field(
        default="us_letter",
        description="Page format: us_letter (8.5×11\"), a4 (8.27×11.69\"), or tabloid (11×17\")"
    )
    wait_for_pdf: bool = Field(
        default=True,
        description="Wait for PDF export to complete before returning"
    )


class CanvaExportResponse(BaseModel):
    """Response model for Canva export."""
    asset_id: str
    design_id: str
    design_url: str
    edit_url: str
    thumbnail_url: Optional[str] = None
    pdf_url: Optional[str] = None
    export_time_seconds: float
    created_at: Optional[int] = None
    updated_at: Optional[int] = None


class CanvaAsyncExportResponse(BaseModel):
    """Response model for async Canva export."""
    status: str
    message: str
    design_id: Optional[str] = None
    design_url: Optional[str] = None


class PageFormatsResponse(BaseModel):
    """Response model for available page formats."""
    formats: dict


@router.post(
    "/canva",
    response_model=CanvaExportResponse,
    status_code=status.HTTP_200_OK,
    summary="Export one-pager to Canva",
    description="""
    Export a one-pager layout to Canva as an editable design.
    
    **Workflow:**
    1. Renders OnePagerLayout to print-quality PNG (300 DPI)
    2. Uploads PNG to Canva as an asset
    3. Creates a new Canva design containing the image
    4. Optionally exports the design as PDF
    
    **Page Formats:**
    - `us_letter`: 8.5" × 11" (2550 × 3300 px @ 300 DPI) - North American standard
    - `a4`: 8.27" × 11.69" (2480 × 3508 px @ 300 DPI) - International standard
    - `tabloid`: 11" × 17" (3300 × 5100 px @ 300 DPI) - Large format
    
    **Response:**
    Returns design URLs for viewing/editing in Canva, plus optional PDF download URL.
    """
)
async def export_to_canva(request: CanvaExportRequest):
    """
    Export one-pager to Canva design.
    
    **Example Request:**
    ```json
    {
      "onepager": { ... },
      "brand_profile": { ... },
      "page_format": "us_letter",
      "wait_for_pdf": true
    }
    ```
    
    **Example Response:**
    ```json
    {
      "asset_id": "uuid-here",
      "design_id": "DAF...",
      "design_url": "https://canva.com/design/.../view",
      "edit_url": "https://canva.com/design/.../edit",
      "pdf_url": "https://export.canva.com/...",
      "thumbnail_url": "https://...",
      "export_time_seconds": 12.5
    }
    ```
    """
    try:
        logger.info(f"Received Canva export request for '{request.onepager.metadata.title}'")
        
        service = CanvaExportService()
        result = service.export_to_canva(
            onepager=request.onepager,
            brand_profile=request.brand_profile,
            page_format=request.page_format,
            wait_for_export=request.wait_for_pdf
        )
        
        logger.info(f"✓ Export successful: {result['design_id']}")
        return result
        
    except CanvaExportError as e:
        logger.error(f"Export failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Canva export failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.post(
    "/canva/async",
    response_model=CanvaAsyncExportResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Export one-pager to Canva (async)",
    description="""
    Export one-pager to Canva asynchronously (returns immediately).
    
    Creates the design but does not wait for PDF export. Use this for faster
    response times when you don't need the PDF immediately.
    
    The design is created and accessible via the returned URL, but PDF export
    can be triggered separately if needed.
    """
)
async def export_to_canva_async(
    request: CanvaExportRequest,
    background_tasks: BackgroundTasks
):
    """
    Export one-pager to Canva (async - returns immediately).
    
    **Example Response:**
    ```json
    {
      "status": "processing",
      "message": "Design created successfully",
      "design_id": "DAF...",
      "design_url": "https://canva.com/design/..."
    }
    ```
    """
    try:
        logger.info(f"Received async Canva export request for '{request.onepager.metadata.title}'")
        
        service = CanvaExportService()
        result = service.export_to_canva_async(
            onepager=request.onepager,
            brand_profile=request.brand_profile,
            page_format=request.page_format
        )
        
        return CanvaAsyncExportResponse(
            status="created",
            message="Design created successfully. PDF export can be triggered separately.",
            design_id=result.get("design_id"),
            design_url=result.get("design_url")
        )
        
    except CanvaExportError as e:
        logger.error(f"Async export failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Canva export failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.get(
    "/canva/formats",
    response_model=PageFormatsResponse,
    summary="Get available page formats",
    description="Returns specifications for all supported page formats."
)
async def get_page_formats():
    """
    Get available page format specifications.
    
    **Example Response:**
    ```json
    {
      "formats": {
        "us_letter": {
          "width": 2550,
          "height": 3300,
          "inches": "8.5×11\"",
          "description": "North American standard letter"
        },
        "a4": { ... },
        "tabloid": { ... }
      }
    }
    ```
    """
    try:
        service = CanvaExportService()
        formats = service.get_page_formats()
        return {"formats": formats}
    except Exception as e:
        logger.error(f"Error getting formats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
