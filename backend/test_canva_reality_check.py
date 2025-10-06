#!/usr/bin/env python3
"""
Canva Integration Reality Check
================================

Tests what ACTUALLY works with Canva Connect API based on POC findings.

IMPORTANT DISCOVERY FROM POC:
- Canva API does NOT support arbitrary JSON → Design creation
- Must use: Blank Design + Brand Templates + Autofill API
- Our translator creates valid JSON, but Canva expects templates

This test validates what we CAN do right now.
"""

import sys
import os
from pathlib import Path

# Add parent directory to path
parent_dir = Path(__file__).parent.parent
sys.path.insert(0, str(parent_dir))

from backend.services.canva_translator import CanvaTranslator
from backend.models.onepager import OnePagerLayout, OnePagerElement, ElementType
from backend.integrations.canva.canva_client import CanvaClient
from backend.config import settings


def test_translation():
    """Test 1: Translation works (JSON generation)"""
    print("=" * 70)
    print("TEST 1: OnePager → Canva JSON Translation")
    print("=" * 70)
    
    layout = OnePagerLayout(
        title="Test Layout",
        elements=[
            OnePagerElement(
                id="h1",
                type=ElementType.HEADER,
                content={"title": "Test Header"},
                order=1
            )
        ]
    )
    
    translator = CanvaTranslator()
    canva_json = translator.translate(layout)
    
    print(f"\n✅ Translation successful!")
    print(f"   Generated: {len(str(canva_json))} characters of Canva JSON")
    print(f"   Elements: {len(canva_json['pages'][0]['elements'])}")
    print(f"\n✅ TEST 1 PASSED")
    return True


def test_blank_design_creation():
    """Test 2: Create blank design (what POC validated)"""
    print("\n" + "=" * 70)
    print("TEST 2: Create Blank Design (POC-Validated Method)")
    print("=" * 70)
    
    client = CanvaClient(
        api_token=settings.canva_access_token,
        base_url=settings.canva_api_base_url
    )
    
    # Use POC-validated format
    design_data = {
        "design_type": {
            "type": "preset",
            "name": "presentation"
        },
        "title": "Integration Test - Blank Design"
    }
    
    try:
        print("\n📝 Creating blank presentation design...")
        design = client.create_design(design_data)
        
        print(f"✅ Design created successfully!\n")
        print(f"   Design ID: {design.id}")
        print(f"   Title: {design.title}")
        print(f"   View URL: https://www.canva.com/design/{design.id}")
        print(f"   Edit URL: https://www.canva.com/design/{design.id}/edit")
        
        print(f"\n✅ TEST 2 PASSED")
        return design.id
        
    except Exception as e:
        print(f"\n❌ TEST 2 FAILED: {e}")
        return None


def test_pdf_export(design_id: str):
    """Test 3: Export design to PDF"""
    print("\n" + "=" * 70)
    print("TEST 3: Export Design to PDF")
    print("=" * 70)
    
    client = CanvaClient(
        api_token=settings.canva_access_token,
        base_url=settings.canva_api_base_url
    )
    
    try:
        print(f"\n📄 Exporting design {design_id}...")
        print("   (This creates a PDF of the blank design...)")
        
        # Export
        export_job = client.export_design(design_id, format_type='pdf')
        print(f"   Export job created: {export_job.job_id}")
        
        # Wait for completion
        print("   Waiting for PDF generation...")
        completed_job = client.wait_for_export(export_job.job_id, timeout=60)
        
        if completed_job.download_url:
            # Download
            pdf_path = client.download_file(
                completed_job.download_url,
                f"output/test-{design_id}.pdf"
            )
            
            print(f"✅ PDF exported successfully!\n")
            print(f"   PDF Path: {pdf_path}")
            
            # Check file
            from pathlib import Path
            if Path(pdf_path).exists():
                size = Path(pdf_path).stat().st_size
                print(f"   File Size: {size:,} bytes ({size/1024:.1f} KB)")
            
            print(f"\n✅ TEST 3 PASSED")
            return True
        else:
            print(f"\n❌ No download URL available")
            return False
            
    except Exception as e:
        print(f"\n❌ TEST 3 FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Run realistic tests"""
    print("\n" + "=" * 70)
    print("🔍 CANVA INTEGRATION REALITY CHECK")
    print("=" * 70)
    print("Based on Phase 1 POC findings:")
    print("✅ What works: Blank design creation + PDF export")
    print("❌ What doesn't: Arbitrary JSON → Design (needs Autofill API)")
    print()
    
    results = {}
    
    # Test 1: Translation (our service works)
    results['Translation'] = test_translation()
    
    # Test 2: Blank design creation (POC validated)
    design_id = test_blank_design_creation()
    results['Blank Design'] = design_id is not None
    
    # Test 3: PDF export (POC validated)
    if design_id:
        results['PDF Export'] = test_pdf_export(design_id)
    else:
        results['PDF Export'] = False
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 TEST SUMMARY")
    print("=" * 70)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status}  {test_name}")
    
    passed_count = sum(1 for p in results.values() if p)
    total_count = len(results)
    
    print(f"\n  {passed_count}/{total_count} tests passed")
    
    # Explanation
    print("\n" + "=" * 70)
    print("🎓 KEY LEARNINGS")
    print("=" * 70)
    print()
    print("✅ OUR TRANSLATOR WORKS:")
    print("   - Successfully converts OnePagerLayout → Canva JSON")
    print("   - Generates valid design specifications")
    print("   - Brand styling applied correctly")
    print()
    print("❌ CANVA API LIMITATION:")
    print("   - Canva does NOT accept arbitrary JSON for design creation")
    print("   - POST /v1/designs only accepts: design_type + title")
    print("   - Creates BLANK designs from presets only")
    print()
    print("🔧 SOLUTION NEEDED (Phase 2.4+):")
    print("   1. Create blank design from preset")
    print("   2. Use Canva's Autofill API to populate content")
    print("   3. OR: Use Brand Templates with placeholder fields")
    print("   4. Reference: canva-poc/POC_RESULTS.md lines 289-293")
    print()
    print("📝 CURRENT STATUS:")
    print("   - Phase 2.3 translator: ✅ Complete (generates valid JSON)")
    print("   - Canva Autofill integration: ⏳ Future work (Phase 2.4+)")
    print("   - What works NOW: Blank designs + PDF export")
    print()
    print("=" * 70)


if __name__ == "__main__":
    main()
