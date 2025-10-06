"""
Quick Integration Test for Phase 2.4
=====================================

Simple test to validate render → upload → import → export workflow.

Run with: python backend/tests/test_phase_2_4_quick.py
"""

from datetime import datetime
from backend.services.canva_export_service import CanvaExportService
from backend.services.onepager_renderer import OnePagerRenderer, PageFormat
from backend.models.onepager import OnePagerLayout, OnePagerElement, ElementType, Dimensions, Styling
from backend.models.profile import BrandProfile


def create_test_onepager() -> OnePagerLayout:
    """Create simple test one-pager."""
    return OnePagerLayout(
        title="Phase 2.4 Integration Test",
        created_at=datetime.now(),
        version=1,
        dimensions=Dimensions(width=2550, height=3300),
        elements=[
            OnePagerElement(
                id="hero",
                type=ElementType.HERO,
                order=0,
                content={
                    "title": "Design Import Integration",
                    "description": "Testing Render → Upload → Import → Export workflow without Enterprise APIs"
                },
                styling=Styling(
                    background_color="#007ACC",
                    text_color="#FFFFFF"
                )
            ),
            OnePagerElement(
                id="features",
                type=ElementType.FEATURES,
                order=1,
                content={
                    "title": "Implementation Complete",
                    "description": "Successfully implemented all Phase 2.4 components",
                    "features": [
                        "✓ OnePagerRenderer (print-quality @ 300 DPI)",
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
                styling=Styling(
                    background_color="#F5F5F5",
                    text_color="#666666"
                )
            )
        ]
    )


def create_test_brand() -> BrandProfile:
    """Create simple test brand profile."""
    return BrandProfile(
        primary_color="#007ACC",
        secondary_color="#0056A3",
        text_color="#333333",
        primary_font="Arial",
        secondary_font="Arial",
        brand_voice="Professional and innovative"
    )


if __name__ == "__main__":
    print("=" * 60)
    print("Phase 2.4: Design Import Integration Test")
    print("=" * 60)
    
    # Create test data
    onepager = create_test_onepager()
    brand = create_test_brand()
    
    print(f"\n📋 Test Configuration:")
    print(f"  Title: {onepager.title}")
    print(f"  Elements: {len(onepager.elements)}")
    print(f"  Brand Colors: {brand.primary_color}, {brand.secondary_color}")
    print(f"  Page Format: US Letter (8.5×11\")")
    
    # Test 1: Render
    print("\n🎨 Test 1: Rendering to PNG...")
    try:
        renderer = OnePagerRenderer(page_format=PageFormat.US_LETTER)
        png_bytes = renderer.render(onepager, brand)
        print(f"  ✓ Rendered: {len(png_bytes)} bytes")
        assert png_bytes[:8] == b'\x89PNG\r\n\x1a\n', "Invalid PNG format"
        print(f"  ✓ Valid PNG format")
    except Exception as e:
        print(f"  ✗ FAILED: {e}")
        exit(1)
    
    # Test 2: Full Export Workflow
    print("\n🚀 Test 2: Full Export to Canva...")
    try:
        service = CanvaExportService()
        result = service.export_to_canva(
            onepager=onepager,
            brand_profile=brand,
            page_format="us_letter",
            wait_for_export=True
        )
        
        print(f"\n✅ SUCCESS!")
        print("=" * 60)
        print(f"Asset ID:     {result['asset_id']}")
        print(f"Design ID:    {result['design_id']}")
        print(f"Design URL:   {result['design_url']}")
        print(f"Edit URL:     {result['edit_url']}")
        print(f"PDF URL:      {result['pdf_url']}")
        print(f"Export Time:  {result['export_time_seconds']}s")
        print("=" * 60)
        
        # Validation
        assert result['asset_id'], "Missing asset_id"
        assert result['design_id'], "Missing design_id"
        assert result['pdf_url'], "Missing pdf_url"
        assert result['design_url'].startswith('https://'), "Invalid design URL"
        assert result['pdf_url'].startswith('https://'), "Invalid PDF URL"
        
        print("\n✅ All validations passed!")
        print("\n🎉 Phase 2.4 implementation is WORKING!")
        
    except Exception as e:
        print(f"\n✗ FAILED: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
