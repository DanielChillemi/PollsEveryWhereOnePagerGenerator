"""
Test PDF Visual Enhancements - Phase 1
=======================================

Tests all 4 enhancements:
1. Brand Logo Integration
2. Statistical Highlights
3. Decorative Geometric Shapes
4. Enhanced Gradients

Generates HTML directly without database dependency.
"""

from backend.services.pdf_html_generator import PDFHTMLGenerator
from backend.models.onepager import OnePagerLayout
from backend.models.brand_kit import BrandKitInDB
from bson import ObjectId
from datetime import datetime, timezone

def create_test_data():
    """Create test onepager and brand kit data"""

    # Test OnePager - Vietspot Restaurant
    onepager_data = {
        "title": "Vietspot Restaurant - Authentic Vietnamese Cuisine 2025",
        "elements": [
            {
                "id": "hero-1",
                "type": "hero",
                "content": {
                    "headline": "Taste the Tradition: Family-Owned Vietspot's Authentic Vietnamese Delights",
                    "subheadline": "Experience authentic Vietnamese cuisine in a modern setting",
                    "description": "Fresh ingredients sourced daily, traditional family recipes passed down through generations"
                },
                "order": 0
            },
            {
                "id": "section-1",
                "type": "text",
                "title": "Our Story",
                "content": "Vietspot Restaurant brings authentic Vietnamese flavors to your neighborhood with a modern twist. Founded over 15 years ago, we serve 500+ customers daily with traditional family recipes passed down through generations. 99% satisfaction rating from our loyal customers.",
                "order": 1
            },
            {
                "id": "section-2",
                "type": "list",
                "title": "⚡ What We Offer",
                "content": [
                    "Traditional pho with 12-hour bone broth",
                    "House-made banh mi on fresh-baked baguettes",
                    "Fresh spring rolls and crispy egg rolls",
                    "Vermicelli bowls with grilled proteins",
                    "Vegetarian and vegan options",
                    "Online ordering and delivery",
                    "Catering for events and parties",
                    "Weekly specials featuring regional dishes"
                ],
                "order": 2
            },
            {
                "id": "section-3",
                "type": "list",
                "title": "🎯 Why Choose Us",
                "content": [
                    "Authentic Vietnamese flavors from family recipes",
                    "Fresh ingredients sourced daily from local farms",
                    "Quick service under 15 minutes",
                    "Healthy options with fresh herbs and vegetables",
                    "Affordable prices for families and students",
                    "Generous portion sizes that satisfy",
                    "Warm and welcoming atmosphere",
                    "Loyalty rewards program for regulars"
                ],
                "order": 3
            },
            {
                "id": "section-4",
                "type": "text",
                "title": "💰 Special Lunch Deal",
                "content": "Dive into our irresistible lunch combo for just $8.99! Enjoy a fulfilling bowl of pho, a fresh spring roll, and your choice of drink. Available exclusively from Monday to Friday, 11am-2pm. Don't miss out on this perfect midday treat!",
                "order": 4
            },
            {
                "id": "section-5",
                "type": "button",
                "title": "Ready to Order?",
                "content": {
                    "text": "Order Online Now",
                    "url": "https://www.vietspotnyc.com/order"
                },
                "order": 5
            }
        ],
        "version": 1,
        "dimensions": {"width": 1080, "height": 1920, "unit": "px"}
    }

    # Test Brand Kit
    brand_kit_data = {
        "_id": ObjectId(),
        "user_id": ObjectId(),
        "company_name": "Vietspot Restaurant",
        "brand_voice": "Authentic, welcoming, and passionate about Vietnamese culture",
        "color_palette": {
            "primary": "#f01616",      # Vietnamese red
            "secondary": "#864CBD",    # Purple accent
            "accent": "#1568B8",       # Blue
            "text": "#333333",
            "background": "#FFFFFF"
        },
        "typography": {
            "heading_font": "Source Sans Pro",
            "body_font": "Source Sans Pro",
            "heading_size": "36px",
            "body_size": "16px"
        },
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }

    onepager = OnePagerLayout(**onepager_data)
    brand_kit = BrandKitInDB(**brand_kit_data)

    return onepager, brand_kit


def test_html_generation():
    """Test HTML generation with all enhancements"""

    print("🎨 Testing PDF Visual Enhancements - Phase 1")
    print("=" * 60)

    # Create test data
    onepager, brand_kit = create_test_data()

    print(f"\n✅ Created test data:")
    print(f"   OnePager: {onepager.title}")
    print(f"   Elements: {len(onepager.elements)}")
    print(f"   Brand Kit: {brand_kit.company_name}")
    print(f"   Primary Color: {brand_kit.color_palette.primary}")

    # Generate HTML
    print(f"\n🔨 Generating HTML with enhancements...")
    generator = PDFHTMLGenerator()
    html = generator.generate_html(onepager, brand_kit)

    print(f"✅ HTML generated: {len(html):,} characters")

    # Check for enhancements
    print(f"\n📊 Checking Enhancement Integration:")

    # 1. Brand Logo
    has_logo = 'class="brand-logo"' in html or 'class="brand-name"' in html
    print(f"   {'✅' if has_logo else '❌'} Task 1: Brand Logo/Name")

    # 2. Stats Bar
    has_stats = 'stats-bar' in html and 'stat-number' in html
    print(f"   {'✅' if has_stats else '❌'} Task 2: Statistical Highlights")

    # 3. Decorative Shapes
    has_shapes = '::before' in html or '::after' in html or 'decorative' in html.lower()
    print(f"   {'✅' if has_shapes else '❌'} Task 3: Decorative Shapes (CSS)")

    # 4. Enhanced Gradients
    has_gradients = 'color-mix' in html and 'linear-gradient' in html
    print(f"   {'✅' if has_gradients else '❌'} Task 4: Multi-Color Gradients")

    # Save HTML for inspection
    output_file = "test_enhanced_output.html"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"\n✅ HTML saved to: {output_file}")
    print(f"   Open in browser to preview enhancements")

    # Show snippet
    print(f"\n📝 HTML Preview (first 800 chars):")
    print("-" * 60)
    print(html[:800])
    print("-" * 60)

    print(f"\n🎉 Test Complete!")
    print(f"\nNext Steps:")
    print(f"   1. Open {output_file} in a browser")
    print(f"   2. Verify logo/brand name in hero section")
    print(f"   3. Check stats bar below hero")
    print(f"   4. Look for background decorative shapes")
    print(f"   5. Confirm rich multi-color gradients")

    return html


if __name__ == "__main__":
    test_html_generation()
