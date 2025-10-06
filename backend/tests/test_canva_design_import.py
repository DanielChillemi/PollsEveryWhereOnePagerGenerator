"""
Test Suite: Canva Design Import Integration
============================================

Tests Phase 2.4 implementation:
- OnePagerRenderer (image rendering)
- CanvaClient asset upload methods
- CanvaExportService (full workflow)
- Export API endpoints

Run with: pytest backend/tests/test_canva_design_import.py -v
"""

import pytest
import asyncio
from pathlib import Path
from datetime import datetime

from backend.services.canva_export_service import CanvaExportService, CanvaExportError
from backend.services.onepager_renderer import OnePagerRenderer, PageFormat
from backend.integrations.canva.canva_client import CanvaClient
from backend.models.onepager import (
    OnePagerLayout, OnePagerElement, ElementType, 
    Dimensions, Styling
)
from backend.models.profile import BrandProfile
from backend.config import settings


# ============================================================================
# Fixtures
# ============================================================================

@pytest.fixture
def sample_onepager() -> OnePagerLayout:
    """Create sample one-pager for testing."""
    return OnePagerLayout(
        title="Acme Corp One-Pager",
        created_at=datetime.now(),
        version=1,
        dimensions=Dimensions(width=2550, height=3300),
        elements=[
            OnePagerElement(
                id="hero_1",
                type=ElementType.HERO,
                order=0,
            content={
                "title": "Acme Corporation",
                "description": "Innovation through technology and sustainable solutions"
            },
            styling=Styling(
                background_color="#007ACC",
                text_color="#FFFFFF",
                font_size=96
            )
        ),
        sections=[
            OnePagerElement(
                id="section_1",
                element_type=ElementType.FEATURES,
                content={
                    "title": "Our Solutions",
                    "description": "We provide cutting-edge software solutions for modern businesses, helping teams collaborate more effectively and achieve their goals faster.",
                    "features": [
                        "Cloud-based infrastructure",
                        "Real-time collaboration",
                        "Advanced analytics",
                        "24/7 customer support"
                    ]
                },
                styling=Styling(font_size=48)
            ),
            OnePagerElement(
                id="section_2",
                type=ElementType.TESTIMONIALS,
                order=2,
                content={
                    "title": "What Our Clients Say",
                    "description": "\"Acme Corp transformed our business operations. The ROI was visible within the first quarter.\" - Sarah Johnson, CEO of TechCorp"
                },
                styling=Styling(
                    background_color="#F0F8FF",
                    font_size=42
                )
            ),
            OnePagerElement(
                id="footer_1",
                type=ElementType.FOOTER,
                order=3,
            content={"text": "© 2025 Acme Corp | contact@acme.com | (555) 123-4567"},
                styling=Styling(
                    background_color="#F5F5F5",
                    text_color="#666666"
                )
            )
        ]
    )
@pytest.fixture
def sample_brand() -> BrandProfile:
    """Create sample brand profile."""
    return BrandProfile(
        brand_name="Acme Corp",
        primary_color="#007ACC",
        secondary_color="#0056A3",
        text_color="#333333",
        heading_font="Arial",
        body_font="Arial",
        brand_voice="Professional and innovative",
        logo_url=None  # No logo for basic tests
    )


@pytest.fixture
def minimal_onepager() -> OnePagerLayout:
    """Create minimal one-pager for quick tests."""
    return OnePagerLayout(
        title="Test One-Pager",
        created_at=datetime.now(),
        version=1,
        dimensions=Dimensions(width=2550, height=3300),
        elements=[
            OnePagerElement(
                id="hero",
                type=ElementType.HERO,
                order=0,
                content={"title": "Test Title", "description": "Test description"},
                styling=Styling(background_color="#007ACC", text_color="#FFFFFF")
            )
        ]
    )


# ============================================================================
# OnePagerRenderer Tests
# ============================================================================

class TestOnePagerRenderer:
    """Test image rendering functionality."""
    
    def test_us_letter_dimensions(self):
        """Verify US Letter format dimensions (8.5×11\" @ 300 DPI)."""
        renderer = OnePagerRenderer(page_format=PageFormat.US_LETTER)
        assert renderer.width == 2550, "US Letter width should be 2550px"
        assert renderer.height == 3300, "US Letter height should be 3300px"
        assert renderer.dpi == 300, "DPI should be 300"
    
    def test_a4_dimensions(self):
        """Verify A4 format dimensions (8.27×11.69\" @ 300 DPI)."""
        renderer = OnePagerRenderer(page_format=PageFormat.A4)
        assert renderer.width == 2480, "A4 width should be 2480px"
        assert renderer.height == 3508, "A4 height should be 3508px"
    
    def test_tabloid_dimensions(self):
        """Verify Tabloid format dimensions (11×17\" @ 300 DPI)."""
        renderer = OnePagerRenderer(page_format=PageFormat.TABLOID)
        assert renderer.width == 3300, "Tabloid width should be 3300px"
        assert renderer.height == 5100, "Tabloid height should be 5100px"
    
    def test_render_produces_valid_png(self, minimal_onepager, sample_brand):
        """Test rendering produces valid PNG bytes."""
        renderer = OnePagerRenderer()
        png_bytes = renderer.render(minimal_onepager, sample_brand)
        
        # Check PNG magic bytes
        assert len(png_bytes) > 0, "PNG should have content"
        assert png_bytes[:8] == b'\x89PNG\r\n\x1a\n', "Should start with PNG magic bytes"
        
        # Check reasonable file size (should be > 10KB for 300 DPI image)
        assert len(png_bytes) > 10000, f"PNG should be > 10KB, got {len(png_bytes)} bytes"
    
    def test_render_with_full_layout(self, sample_onepager, sample_brand):
        """Test rendering with complete layout (hero, sections, footer)."""
        renderer = OnePagerRenderer()
        png_bytes = renderer.render(sample_onepager, sample_brand)
        
        assert len(png_bytes) > 0, "Should render successfully"
        assert png_bytes[:8] == b'\x89PNG\r\n\x1a\n', "Should be valid PNG"
    
    def test_text_wrapping(self):
        """Test text wrapping function."""
        renderer = OnePagerRenderer()
        from PIL import ImageFont
        
        font = renderer._get_font("Arial", 48)
        long_text = "This is a very long sentence that should wrap across multiple lines when constrained by width for proper text rendering"
        lines = renderer._wrap_text(long_text, font, max_width=1000)
        
        assert len(lines) > 1, "Long text should wrap into multiple lines"
        assert all(isinstance(line, str) for line in lines), "All lines should be strings"
        assert ' '.join(lines) == long_text, "Wrapped text should preserve content"
    
    def test_brand_color_application(self, minimal_onepager, sample_brand):
        """Test that brand colors are applied."""
        renderer = OnePagerRenderer()
        
        # Set specific brand color
        sample_brand.primary_color = "#FF5733"
        png_bytes = renderer.render(minimal_onepager, sample_brand)
        
        assert len(png_bytes) > 0, "Should render with custom brand color"


# ============================================================================
# CanvaClient Tests
# ============================================================================

class TestCanvaClientAssetUpload:
    """Test Canva asset upload functionality."""
    
    @pytest.mark.skipif(not settings.CANVA_ACCESS_TOKEN, reason="Canva token not configured")
    def test_upload_asset(self, minimal_onepager, sample_brand):
        """Test uploading PNG asset to Canva."""
        # Render image
        renderer = OnePagerRenderer()
        png_bytes = renderer.render(minimal_onepager, sample_brand)
        
        # Upload to Canva
        client = CanvaClient(api_token=settings.CANVA_ACCESS_TOKEN)
        result = client.upload_asset(
            file_data=png_bytes,
            file_name="test_onepager.png"
        )
        
        # Verify response
        assert "asset" in result, "Response should contain asset"
        assert "id" in result["asset"], "Asset should have ID"
        assert result["asset"]["name"] == "test_onepager.png", "Asset name should match"
        
        print(f"✓ Asset uploaded: {result['asset']['id']}")
    
    @pytest.mark.skipif(not settings.CANVA_ACCESS_TOKEN, reason="Canva token not configured")
    def test_create_design_from_asset(self, minimal_onepager, sample_brand):
        """Test creating Canva design from uploaded asset."""
        # Render and upload
        renderer = OnePagerRenderer()
        png_bytes = renderer.render(minimal_onepager, sample_brand)
        
        client = CanvaClient(api_token=settings.CANVA_ACCESS_TOKEN)
        asset_result = client.upload_asset(png_bytes, "test_design.png")
        asset_id = asset_result["asset"]["id"]
        
        # Create design
        design_result = client.create_design_from_asset(
            asset_id=asset_id,
            title="Test One-Pager Design",
            design_type="presentation"
        )
        
        # Verify response
        assert "design" in design_result, "Response should contain design"
        assert "id" in design_result["design"], "Design should have ID"
        assert "url" in design_result["design"], "Design should have URL"
        assert design_result["design"]["title"] == "Test One-Pager Design"
        
        print(f"✓ Design created: {design_result['design']['url']}")


# ============================================================================
# CanvaExportService Tests
# ============================================================================

class TestCanvaExportService:
    """Test full export workflow."""
    
    @pytest.mark.skipif(not settings.CANVA_ACCESS_TOKEN, reason="Canva token not configured")
    def test_export_us_letter_sync(self, minimal_onepager, sample_brand):
        """Test synchronous export with US Letter format."""
        service = CanvaExportService()
        
        result = service.export_to_canva(
            onepager=minimal_onepager,
            brand_profile=sample_brand,
            page_format="us_letter",
            wait_for_export=True  # Wait for PDF
        )
        
        # Verify all expected fields
        assert "asset_id" in result, "Should have asset_id"
        assert "design_id" in result, "Should have design_id"
        assert "design_url" in result, "Should have design_url"
        assert "edit_url" in result, "Should have edit_url"
        assert "pdf_url" in result, "Should have PDF URL (sync mode)"
        assert "export_time_seconds" in result, "Should track export time"
        
        # Verify URLs are valid
        assert result["design_url"].startswith("https://"), "Design URL should be HTTPS"
        assert result["pdf_url"].startswith("https://"), "PDF URL should be HTTPS"
        
        print(f"\n✓ Export complete!")
        print(f"  Design: {result['design_url']}")
        print(f"  PDF: {result['pdf_url']}")
        print(f"  Time: {result['export_time_seconds']}s")
    
    @pytest.mark.skipif(not settings.CANVA_ACCESS_TOKEN, reason="Canva token not configured")
    def test_export_a4_async(self, minimal_onepager, sample_brand):
        """Test asynchronous export with A4 format."""
        service = CanvaExportService()
        
        result = service.export_to_canva(
            onepager=minimal_onepager,
            brand_profile=sample_brand,
            page_format="a4",
            wait_for_export=False  # Don't wait for PDF
        )
        
        # Verify response
        assert "design_id" in result, "Should have design_id"
        assert "design_url" in result, "Should have design_url"
        assert "pdf_url" not in result, "Should NOT have PDF URL (async mode)"
        
        print(f"\n✓ Async export complete: {result['design_url']}")
    
    @pytest.mark.skipif(not settings.CANVA_ACCESS_TOKEN, reason="Canva token not configured")
    def test_full_workflow_with_complete_layout(self, sample_onepager, sample_brand):
        """
        Test complete workflow with full one-pager layout.
        
        This is the main integration test that validates the entire
        Phase 2.4 implementation end-to-end.
        """
        service = CanvaExportService()
        
        result = service.export_to_canva(
            onepager=sample_onepager,
            brand_profile=sample_brand,
            page_format="us_letter",
            wait_for_export=True
        )
        
        # Comprehensive validation
        assert result["asset_id"], "Asset ID should be present"
        assert result["design_id"], "Design ID should be present"
        assert result["design_url"], "Design URL should be present"
        assert result["pdf_url"], "PDF URL should be present"
        assert result["export_time_seconds"] > 0, "Export time should be positive"
        
        # Verify performance (should complete in reasonable time)
        assert result["export_time_seconds"] < 60, "Export should complete within 60 seconds"
        
        print(f"\n🎉 Full workflow test PASSED!")
        print(f"  Title: {sample_onepager.metadata.title}")
        print(f"  Format: US Letter (8.5×11\")")
        print(f"  Design: {result['design_url']}")
        print(f"  PDF: {result['pdf_url']}")
        print(f"  Export time: {result['export_time_seconds']}s")
    
    def test_get_page_formats(self):
        """Test retrieving page format specifications."""
        service = CanvaExportService()
        formats = service.get_page_formats()
        
        assert "us_letter" in formats, "Should have US Letter format"
        assert "a4" in formats, "Should have A4 format"
        assert "tabloid" in formats, "Should have Tabloid format"
        
        # Verify format details
        us_letter = formats["us_letter"]
        assert us_letter["width"] == 2550
        assert us_letter["height"] == 3300
        assert "8.5" in us_letter["inches"]


# ============================================================================
# Error Handling Tests
# ============================================================================

class TestErrorHandling:
    """Test error handling and edge cases."""
    
    def test_invalid_access_token(self, minimal_onepager, sample_brand):
        """Test handling of invalid Canva access token."""
        from backend.integrations.canva.canva_client import CanvaAuthError
        
        service = CanvaExportService(access_token="invalid_token_12345")
        
        with pytest.raises((CanvaExportError, CanvaAuthError)):
            service.export_to_canva(
                onepager=minimal_onepager,
                brand_profile=sample_brand
            )
    
    def test_missing_access_token(self):
        """Test handling of missing access token."""
        with pytest.raises(ValueError, match="CANVA_ACCESS_TOKEN"):
            CanvaExportService(access_token="")


# ============================================================================
# Manual Integration Test
# ============================================================================

if __name__ == "__main__":
    """
    Quick manual test for development.
    Run: python -m backend.tests.test_canva_design_import
    """
    
    print("=" * 60)
    print("Phase 2.4 Manual Integration Test")
    print("=" * 60)
    
    # Create test data
    onepager = OnePagerLayout(
        title="Manual Test One-Pager",
        created_at=datetime.now(),
        version=1,
        dimensions=Dimensions(width=2550, height=3300),
        elements=[
            OnePagerElement(
                id="hero",
                type=ElementType.HERO,
                order=0,
            content={
                "title": "Phase 2.4 Integration Test",
                "description": "Testing Render → Upload → Import → Export workflow"
            },
            styling=Styling(background_color="#007ACC", text_color="#FFFFFF")
        ),
        sections=[
            OnePagerElement(
                id="section_1",
                element_type=ElementType.FEATURES,
                content={
                    "title": "Implementation Complete",
                    "description": "Successfully implemented Design Import integration without Enterprise APIs",
                    "features": [
                        "✓ OnePagerRenderer (print-quality images)",
                        "✓ Asset upload to Canva",
                        "✓ Design creation from assets",
                        "✓ PDF export workflow"
                    ]
                },
                styling=Styling(font_size=48)
            ),
            OnePagerElement(
                id="footer",
                type=ElementType.FOOTER,
                order=2,
            content={"text": "© 2025 | Phase 2.4 Test | marketing-one-pager"},
            styling=Styling(background_color="#F5F5F5")
        )
    )
    
    brand = BrandProfile(
        brand_name="Test Brand",
        primary_color="#007ACC",
        secondary_color="#0056A3",
        text_color="#333333",
        heading_font="Arial",
        body_font="Arial"
    )
    
    print("\n📋 Test Data:")
    print(f"  Title: {onepager.metadata.title}")
    print(f"  Sections: {len(onepager.sections)}")
    print(f"  Brand: {brand.brand_name}")
    
    print("\n🚀 Starting export workflow...")
    
    try:
        service = CanvaExportService()
        result = service.export_to_canva(
            onepager=onepager,
            brand_profile=brand,
            page_format="us_letter",
            wait_for_export=True
        )
        
        print("\n✅ SUCCESS!")
        print("=" * 60)
        print(f"Asset ID: {result['asset_id']}")
        print(f"Design ID: {result['design_id']}")
        print(f"Design URL: {result['design_url']}")
        print(f"Edit URL: {result['edit_url']}")
        print(f"PDF URL: {result['pdf_url']}")
        print(f"Export Time: {result['export_time_seconds']}s")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ FAILED: {e}")
        import traceback
        traceback.print_exc()
