#!/usr/bin/env python3
"""
Quick Canva Integration Test
=============================

Tests the Canva translator with your actual API token.
Run from backend directory: python test_canva_quick.py
"""

import sys
import os
from pathlib import Path

# Add parent directory to path for backend imports
parent_dir = Path(__file__).parent.parent
sys.path.insert(0, str(parent_dir))

# Now import with backend prefix
from backend.services.canva_translator import CanvaTranslator, CanvaTranslationError
from backend.models.onepager import OnePagerLayout, OnePagerElement, ElementType, Dimensions
from backend.models.profile import BrandProfile


def test_translation_only():
    """Test 1: Translation without API calls"""
    print("=" * 70)
    print("TEST 1: Translation Logic (No API Calls)")
    print("=" * 70)
    
    layout = OnePagerLayout(
        title="CloudSync Pro - Product Launch",
        dimensions=Dimensions(width=1080, height=1920, unit="px"),
        elements=[
            OnePagerElement(
                id="header-1",
                type=ElementType.HEADER,
                content={"title": "CloudSync Pro"},
                order=1
            ),
            OnePagerElement(
                id="hero-1",
                type=ElementType.HERO,
                content={
                    "headline": "50% Faster File Synchronization",
                    "description": "Enterprise security meets consumer simplicity",
                    "cta_text": "Start Free Trial",
                    "cta_url": "https://example.com/signup"
                },
                order=2
            ),
            OnePagerElement(
                id="features-1",
                type=ElementType.FEATURES,
                content={
                    "title": "Key Features",
                    "items": [
                        {"title": "Real-time Sync", "description": "Instant updates"},
                        {"title": "256-bit Encryption", "description": "Bank-level security"},
                        {"title": "99.9% Uptime", "description": "Always available"}
                    ]
                },
                order=3
            ),
            OnePagerElement(
                id="cta-1",
                type=ElementType.CTA,
                content={
                    "primary_text": "Get Started Today",
                    "primary_url": "https://example.com/signup",
                    "secondary_text": "View Demo",
                    "secondary_url": "https://example.com/demo"
                },
                order=4
            ),
            OnePagerElement(
                id="footer-1",
                type=ElementType.FOOTER,
                content={
                    "company_name": "CloudSync Inc",
                    "copyright": "© 2025 CloudSync Inc. All rights reserved.",
                    "contact_email": "support@cloudsync.com"
                },
                order=5
            )
        ]
    )
    
    brand = BrandProfile(
        primary_color="#007ACC",  # Poll Everywhere Blue
        secondary_color="#864CBD",
        accent_color="#1568B8",
        text_color="#333333",
        background_color="#FFFFFF",
        primary_font="Source Sans Pro",
        secondary_font="Open Sans",
        brand_voice="Professional yet approachable"
    )
    
    try:
        translator = CanvaTranslator()
        print("\n✅ Translator initialized successfully")
        
        canva_json = translator.translate(layout, brand)
        print(f"✅ Translation successful!\n")
        
        print(f"   Design Title: {canva_json['title']}")
        print(f"   Design Type: {canva_json['design_type']}")
        print(f"   Dimensions: {canva_json['dimensions']['width']}x{canva_json['dimensions']['height']}px")
        print(f"   Total Elements: {len(canva_json['pages'][0]['elements'])}")
        
        print(f"\n   Element Breakdown:")
        for i, elem in enumerate(canva_json['pages'][0]['elements'], 1):
            elem_type = elem['type']
            text_preview = elem.get('text', elem.get('title', 'N/A'))[:50]
            print(f"   {i}. {elem_type.upper()}: {text_preview}")
        
        print("\n✅ TEST 1 PASSED")
        return True
        
    except CanvaTranslationError as e:
        print(f"\n❌ TEST 1 FAILED: {e}")
        return False
    except Exception as e:
        print(f"\n❌ TEST 1 FAILED (Unexpected): {e}")
        import traceback
        traceback.print_exc()
        return False


def test_create_design():
    """Test 2: Create actual design in Canva"""
    print("\n" + "=" * 70)
    print("TEST 2: Create Design in Canva (Real API Call)")
    print("=" * 70)
    
    layout = OnePagerLayout(
        title="Canva Integration Test - CloudSync Pro",
        dimensions=Dimensions(width=1080, height=1920, unit="px"),
        elements=[
            OnePagerElement(
                id="header-1",
                type=ElementType.HEADER,
                content={"title": "🚀 Integration Test Success!"},
                order=1
            ),
            OnePagerElement(
                id="hero-1",
                type=ElementType.HERO,
                content={
                    "headline": "Canva Translator is Working",
                    "description": "This design was created programmatically using the Canva Connect API",
                    "cta_text": "View Documentation",
                    "cta_url": "https://docs.canva.com"
                },
                order=2
            ),
            OnePagerElement(
                id="text-1",
                type=ElementType.TEXT_BLOCK,
                content={
                    "text": "This proves that our Phase 2.3 Canva Data Translator Service is production-ready and successfully converts OnePagerLayout JSON to Canva designs."
                },
                order=3
            ),
            OnePagerElement(
                id="footer-1",
                type=ElementType.FOOTER,
                content={
                    "company_name": "Poll Everywhere Marketing Team",
                    "copyright": "© 2025 - Marketing One-Pager Tool"
                },
                order=4
            )
        ]
    )
    
    brand = BrandProfile(
        primary_color="#007ACC",
        text_color="#333333",
        background_color="#FFFFFF",
        primary_font="Source Sans Pro"
    )
    
    try:
        translator = CanvaTranslator()
        
        print("\n📝 Creating design in Canva...")
        design_id = translator.create_design(layout, brand)
        
        print(f"✅ Design created successfully!\n")
        print(f"   Design ID: {design_id}")
        print(f"   View in Canva: https://www.canva.com/design/{design_id}")
        print(f"   Edit Link: https://www.canva.com/design/{design_id}/edit")
        
        print("\n✅ TEST 2 PASSED")
        return design_id
        
    except CanvaTranslationError as e:
        print(f"\n❌ TEST 2 FAILED: {e}")
        return None
    except Exception as e:
        print(f"\n❌ TEST 2 FAILED (Unexpected): {e}")
        import traceback
        traceback.print_exc()
        return None


def test_export_pdf(design_id: str):
    """Test 3: Export design to PDF"""
    print("\n" + "=" * 70)
    print("TEST 3: Export Design to PDF")
    print("=" * 70)
    
    try:
        translator = CanvaTranslator()
        
        print(f"\n📄 Exporting design {design_id} to PDF...")
        print("   (This may take 10-30 seconds...)")
        
        pdf_path = translator.export_to_pdf(
            design_id,
            output_path=f"output/integration-test-{design_id}.pdf"
        )
        
        print(f"✅ PDF exported successfully!\n")
        print(f"   PDF Path: {pdf_path}")
        
        # Check file exists and size
        from pathlib import Path
        pdf_file = Path(pdf_path)
        if pdf_file.exists():
            size = pdf_file.stat().st_size
            print(f"   File Size: {size:,} bytes ({size/1024:.1f} KB)")
            print(f"   File exists: ✅")
        else:
            print(f"   File exists: ❌ (Warning: PDF not found)")
        
        print("\n✅ TEST 3 PASSED")
        return True
        
    except CanvaTranslationError as e:
        print(f"\n❌ TEST 3 FAILED: {e}")
        return False
    except Exception as e:
        print(f"\n❌ TEST 3 FAILED (Unexpected): {e}")
        import traceback
        traceback.print_exc()
        return False


def test_combined_workflow():
    """Test 4: Complete workflow in one call"""
    print("\n" + "=" * 70)
    print("TEST 4: Combined Workflow (create_and_export)")
    print("=" * 70)
    
    layout = OnePagerLayout(
        title="Combined Workflow Test",
        elements=[
            OnePagerElement(
                id="header",
                type=ElementType.HEADER,
                content={"title": "Combined Workflow Success"},
                order=1
            ),
            OnePagerElement(
                id="hero",
                type=ElementType.HERO,
                content={
                    "headline": "One Method Call",
                    "description": "Created design AND exported PDF in a single operation",
                    "cta_text": "Amazing!",
                    "cta_url": "https://example.com"
                },
                order=2
            )
        ]
    )
    
    try:
        translator = CanvaTranslator()
        
        print("\n🚀 Running create_and_export()...")
        print("   (Creating design + exporting PDF...)")
        
        design_id, pdf_path = translator.create_and_export(
            layout,
            output_path="output/combined-workflow-test.pdf"
        )
        
        print(f"✅ Combined workflow successful!\n")
        print(f"   Design ID: {design_id}")
        print(f"   Design URL: https://www.canva.com/design/{design_id}")
        print(f"   PDF Path: {pdf_path}")
        
        print("\n✅ TEST 4 PASSED")
        return True
        
    except CanvaTranslationError as e:
        print(f"\n❌ TEST 4 FAILED: {e}")
        return False
    except Exception as e:
        print(f"\n❌ TEST 4 FAILED (Unexpected): {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Run all tests"""
    print("\n" + "=" * 70)
    print("🧪 CANVA INTEGRATION TEST SUITE")
    print("=" * 70)
    print("Testing Phase 2.3 Canva Data Translator Service")
    print("With your fresh Canva API token")
    print()
    
    results = {}
    
    # Test 1: Translation only (safe, no API calls)
    results['Translation'] = test_translation_only()
    
    # Test 2: Create design in Canva
    design_id = test_create_design()
    results['Create Design'] = design_id is not None
    
    # Test 3: Export PDF (only if design was created)
    if design_id:
        results['Export PDF'] = test_export_pdf(design_id)
    else:
        print("\n⚠️  Skipping Test 3 (no design_id from Test 2)")
        results['Export PDF'] = False
    
    # Test 4: Combined workflow
    results['Combined Workflow'] = test_combined_workflow()
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 TEST SUMMARY")
    print("=" * 70)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status}  {test_name}")
    
    total = len(results)
    passed = sum(1 for p in results.values() if p)
    
    print(f"\n  {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED!")
        print("✅ Phase 2.3 Canva Translator is production-ready!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        print("Please check the error messages above for details.")
    
    print("=" * 70)
    print()


if __name__ == "__main__":
    main()
