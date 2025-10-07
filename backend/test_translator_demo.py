"""
Demo Script: Test Canva Translator Service
===========================================

Tests the Canva translator with a simple one-pager layout.
Shows the translation output without requiring Canva API token.
"""

from models.onepager import OnePagerLayout, OnePagerElement, ElementType, Dimensions, Styling
from models.profile import BrandProfile
from services.canva_translator import CanvaTranslator
from unittest.mock import Mock
import json


def main():
    print("=" * 70)
    print("CANVA TRANSLATOR SERVICE - DEMO TEST")
    print("=" * 70)
    print()

    # Step 1: Create a simple one-pager layout
    print("📝 Step 1: Creating a simple one-pager layout...")
    layout = OnePagerLayout(
        title="Product Launch One-Pager",
        description="Demo layout for testing",
        dimensions=Dimensions(width=1080, height=1920),
        elements=[
            OnePagerElement(
                id="header-1",
                type=ElementType.HEADER,
                content={
                    "title": "Welcome to CloudSync Pro",
                    "subtitle": "The Future of File Synchronization"
                },
                styling=Styling(
                    background_color="#007ACC",
                    text_color="#FFFFFF",
                    text_align="center"
                ),
                order=1
            ),
            OnePagerElement(
                id="hero-1",
                type=ElementType.HERO,
                content={
                    "headline": "50% Faster File Synchronization",
                    "description": "Enterprise security meets consumer simplicity. Sync files across all devices instantly.",
                    "cta_text": "Start Free Trial",
                    "cta_url": "https://example.com/signup"
                },
                order=2
            ),
            OnePagerElement(
                id="cta-1",
                type=ElementType.CTA,
                content={
                    "primary_text": "Get Started Today",
                    "primary_url": "https://example.com/signup"
                },
                order=3
            ),
            OnePagerElement(
                id="footer-1",
                type=ElementType.FOOTER,
                content={
                    "company_name": "CloudSync Inc.",
                    "copyright_text": "© 2025 CloudSync Inc. All rights reserved."
                },
                order=4
            )
        ]
    )
    print(f"   ✅ Created layout: '{layout.title}' with {len(layout.elements)} elements")
    print()

    # Step 2: Create brand profile
    print("🎨 Step 2: Creating brand profile...")
    brand = BrandProfile(
        primary_color="#007ACC",
        text_color="#333333",
        background_color="#FFFFFF",
        primary_font="Source Sans Pro"
    )
    print(f"   ✅ Brand profile: {brand.primary_color} primary, {brand.primary_font} font")
    print()

    # Step 3: Initialize translator with mock client
    print("🔧 Step 3: Initializing translator (mock mode - no API needed)...")
    mock_client = Mock()
    translator = CanvaTranslator(canva_client=mock_client)
    print("   ✅ Translator initialized")
    print()

    # Step 4: Translate layout to Canva format
    print("🔄 Step 4: Translating layout to Canva format...")
    canva_design = translator.translate(layout, brand)
    print("   ✅ Translation complete!")
    print()

    # Step 5: Display results
    print("=" * 70)
    print("TRANSLATION RESULTS")
    print("=" * 70)
    print()
    print(f"Design Type: {canva_design['design_type']}")
    print(f"Title: {canva_design['title']}")
    print(f"Dimensions: {canva_design['dimensions']['width']}x{canva_design['dimensions']['height']}px")
    print(f"Pages: {len(canva_design['pages'])}")
    print(f"Elements on page 1: {len(canva_design['pages'][0]['elements'])}")
    print()

    print("Elements:")
    for i, element in enumerate(canva_design['pages'][0]['elements'], 1):
        elem_type = element.get('type', 'unknown')
        text = element.get('text', element.get('title', 'N/A'))
        print(f"  {i}. {elem_type:15s} - {text[:50]}")
    print()

    # Step 6: Show full JSON
    print("=" * 70)
    print("FULL CANVA API FORMAT (JSON)")
    print("=" * 70)
    print()
    print(json.dumps(canva_design, indent=2))
    print()

    # Summary
    print("=" * 70)
    print("✅ DEMO TEST COMPLETE")
    print("=" * 70)
    print()
    print("Summary:")
    print(f"  - Input: {len(layout.elements)} OnePagerElements")
    print(f"  - Output: {len(canva_design['pages'][0]['elements'])} Canva elements")
    print(f"  - Brand styling: Applied")
    print(f"  - Translation: Success ✅")
    print()
    print("Note: This demo uses a mock Canva client.")
    print("To create real designs, set CANVA_ACCESS_TOKEN in .env file.")
    print()


if __name__ == "__main__":
    main()
