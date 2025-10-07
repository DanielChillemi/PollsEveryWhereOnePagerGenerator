"""
Quick AI Service Validation Test
=================================

Tests that the ContentSection schema fix works with AI-generated content.
"""

import asyncio
from backend.services.ai_service import ai_service
from backend.onepagers.schemas import ContentSection, OnePagerContent


def test_content_section_validation():
    """Test ContentSection accepts string, list, and dict content."""
    
    print("\n" + "="*60)
    print("Testing ContentSection Schema Validation")
    print("="*60 + "\n")
    
    # Test 1: String content
    print("✓ Test 1: String content")
    try:
        section1 = ContentSection(
            id="section-1",
            type="heading",
            content="About Our Solution",  # STRING
            order=1
        )
        print(f"  ✅ String content validated: '{section1.content}'")
    except Exception as e:
        print(f"  ❌ String content failed: {e}")
        return False
    
    # Test 2: List content
    print("\n✓ Test 2: List content")
    try:
        section2 = ContentSection(
            id="section-2",
            type="list",
            content=["Feature 1", "Feature 2", "Feature 3"],  # LIST
            order=2
        )
        print(f"  ✅ List content validated: {section2.content}")
    except Exception as e:
        print(f"  ❌ List content failed: {e}")
        return False
    
    # Test 3: Dict content
    print("\n✓ Test 3: Dict content")
    try:
        section3 = ContentSection(
            id="section-3",
            type="hero",
            content={"headline": "Main Title", "description": "Supporting text"},  # DICT
            order=3
        )
        print(f"  ✅ Dict content validated: {section3.content}")
    except Exception as e:
        print(f"  ❌ Dict content failed: {e}")
        return False
    
    # Test 4: Full OnePagerContent with mixed types
    print("\n✓ Test 4: OnePagerContent with mixed content types")
    try:
        content = OnePagerContent(
            headline="Test One-Pager",
            subheadline="Testing mixed content types",
            sections=[section1, section2, section3]
        )
        print(f"  ✅ OnePagerContent validated with {len(content.sections)} sections")
        print(f"     - Section 1 (heading): {type(content.sections[0].content).__name__}")
        print(f"     - Section 2 (list): {type(content.sections[1].content).__name__}")
        print(f"     - Section 3 (hero): {type(content.sections[2].content).__name__}")
    except Exception as e:
        print(f"  ❌ OnePagerContent failed: {e}")
        return False
    
    print("\n" + "="*60)
    print("✅ ALL VALIDATION TESTS PASSED!")
    print("="*60 + "\n")
    
    return True


async def test_ai_service_fallback():
    """Test that AI service fallback generates valid content."""
    
    print("\n" + "="*60)
    print("Testing AI Service Fallback Wireframe")
    print("="*60 + "\n")
    
    # Get fallback wireframe (doesn't call real AI)
    wireframe = ai_service._get_fallback_wireframe("Test prompt for project management tool")
    
    print("📋 Fallback Wireframe Generated:")
    print(f"  Headline: {wireframe['headline']}")
    print(f"  Subheadline: {wireframe['subheadline']}")
    print(f"  Sections: {len(wireframe['sections'])}")
    
    # Validate each section
    print("\n🔍 Validating Section Content Types:")
    try:
        for section_data in wireframe['sections']:
            section = ContentSection(**section_data)
            content_type = type(section.content).__name__
            print(f"  ✅ Section {section.id} ({section.type}): content is {content_type}")
        
        print("\n" + "="*60)
        print("✅ AI SERVICE FALLBACK VALIDATION PASSED!")
        print("="*60 + "\n")
        return True
        
    except Exception as e:
        print(f"\n❌ Validation failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("""
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║         AI SERVICE VALIDATION TEST                           ║
║         ContentSection Union Type Fix                        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
""")
    
    # Test 1: Schema validation
    test1_passed = test_content_section_validation()
    
    # Test 2: AI service fallback
    test2_passed = asyncio.run(test_ai_service_fallback())
    
    # Final result
    if test1_passed and test2_passed:
        print("\n🎉 SUCCESS: All validation tests passed!")
        print("   The ContentSection Union type fix is working correctly.")
        print("   Ready to test full AI service with OpenAI API.\n")
        exit(0)
    else:
        print("\n❌ FAILURE: Some tests failed")
        exit(1)
