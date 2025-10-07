"""
Tests for Canva Translator Service
===================================

Unit and integration tests for OnePagerLayout → Canva translation.

Run unit tests:
    pytest backend/tests/services/test_canva_translator.py -v

Run integration tests (requires CANVA_ACCESS_TOKEN):
    pytest backend/tests/services/test_canva_translator.py -v -m integration
"""

import pytest
import os
from unittest.mock import Mock, patch

from backend.services.canva_translator import CanvaTranslator, CanvaTranslationError
from backend.models.onepager_canva import (
    OnePagerLayout,
    OnePagerElement,
    ElementType,
    Dimensions,
    Styling
)
from backend.models.profile import BrandProfile
from backend.integrations.canva.canva_client import CanvaClient, CanvaDesign


# ============================================================================
# Test Fixtures
# ============================================================================

@pytest.fixture
def simple_layout():
    """Create simple test layout."""
    return OnePagerLayout(
        title="Test One-Pager",
        description="Simple test layout",
        dimensions=Dimensions(width=1080, height=1920),
        elements=[
            OnePagerElement(
                id="header-1",
                type=ElementType.HEADER,
                content={
                    "title": "Welcome to Our Product",
                    "subtitle": "The best solution for your needs"
                },
                styling=Styling(
                    background_color="#007ACC",
                    text_color="#FFFFFF",
                    text_align="center"
                ),
                order=1
            ),
            OnePagerElement(
                id="cta-1",
                type=ElementType.CTA,
                content={
                    "primary_text": "Get Started",
                    "primary_url": "https://example.com/signup"
                },
                order=2
            )
        ]
    )


@pytest.fixture
def complex_layout():
    """Create complex test layout with all element types."""
    return OnePagerLayout(
        title="Complex One-Pager",
        description="Layout with all element types",
        dimensions=Dimensions(width=1080, height=1920),
        brand_colors={
            "primary": "#007ACC",
            "text": "#333333",
            "background": "#FFFFFF"
        },
        brand_fonts={
            "primary": "Source Sans Pro"
        },
        elements=[
            OnePagerElement(
                id="header-1",
                type=ElementType.HEADER,
                content={"title": "Header Title"},
                order=1
            ),
            OnePagerElement(
                id="hero-1",
                type=ElementType.HERO,
                content={
                    "headline": "Hero Headline",
                    "description": "Hero description text",
                    "cta_text": "Learn More",
                    "cta_url": "https://example.com"
                },
                order=2
            ),
            OnePagerElement(
                id="features-1",
                type=ElementType.FEATURES,
                content={"section_title": "Features"},
                order=3
            ),
            OnePagerElement(
                id="testimonials-1",
                type=ElementType.TESTIMONIALS,
                content={"section_title": "Testimonials"},
                order=4
            ),
            OnePagerElement(
                id="image-1",
                type=ElementType.IMAGE,
                content={
                    "image_url": "https://example.com/image.jpg",
                    "alt_text": "Sample image"
                },
                order=5
            ),
            OnePagerElement(
                id="text-1",
                type=ElementType.TEXT_BLOCK,
                content={"text": "Some body text"},
                order=6
            ),
            OnePagerElement(
                id="cta-1",
                type=ElementType.CTA,
                content={
                    "primary_text": "Get Started",
                    "primary_url": "https://example.com/signup"
                },
                order=7
            ),
            OnePagerElement(
                id="footer-1",
                type=ElementType.FOOTER,
                content={
                    "company_name": "Acme Corp",
                    "copyright_text": "© 2025 Acme Corp"
                },
                order=8
            )
        ]
    )


@pytest.fixture
def brand_profile():
    """Create test brand profile."""
    return BrandProfile(
        primary_color="#007ACC",
        secondary_color="#864CBD",
        text_color="#333333",
        background_color="#FFFFFF",
        primary_font="Source Sans Pro"
    )


@pytest.fixture
def mock_canva_client():
    """Create mock Canva client."""
    mock_client = Mock(spec=CanvaClient)
    mock_client.create_design.return_value = CanvaDesign(
        id="TEST123",
        title="Test Design",
        url="https://www.canva.com/design/TEST123"
    )
    return mock_client


@pytest.fixture
def translator_with_mock(mock_canva_client):
    """Create translator with mocked Canva client."""
    return CanvaTranslator(canva_client=mock_canva_client)


# ============================================================================
# Unit Tests
# ============================================================================

def test_translator_initialization_without_token():
    """Test translator initialization fails without API token."""
    with patch('backend.services.canva_translator.settings') as mock_settings:
        mock_settings.canva_access_token = ""
        
        with pytest.raises(CanvaTranslationError, match="CANVA_ACCESS_TOKEN not configured"):
            CanvaTranslator()


def test_translator_initialization_with_mock(translator_with_mock):
    """Test translator initializes correctly with mock client."""
    assert translator_with_mock is not None
    assert translator_with_mock.canva_client is not None


def test_translate_simple_layout(translator_with_mock, simple_layout, brand_profile):
    """Test translation of simple layout."""
    canva_data = translator_with_mock.translate(simple_layout, brand_profile)
    
    assert canva_data["title"] == "Test One-Pager"
    assert "pages" in canva_data
    assert len(canva_data["pages"]) == 1
    assert "elements" in canva_data["pages"][0]
    assert len(canva_data["pages"][0]["elements"]) == 2  # 2 visible elements


def test_translate_complex_layout(translator_with_mock, complex_layout):
    """Test translation of complex layout with all element types."""
    canva_data = translator_with_mock.translate(complex_layout)
    
    assert canva_data["title"] == "Complex One-Pager"
    assert len(canva_data["pages"][0]["elements"]) == 8  # All 8 element types


def test_translate_with_brand_from_layout(translator_with_mock, complex_layout):
    """Test brand profile creation from layout data."""
    canva_data = translator_with_mock.translate(complex_layout)
    
    # Brand colors should be applied from layout
    canva_json = str(canva_data)
    assert "#007ACC" in canva_json  # Primary color from layout


def test_translate_header_element(translator_with_mock, simple_layout):
    """Test header element translation."""
    header_element = simple_layout.elements[0]
    canva_element = translator_with_mock._translate_header(header_element)
    
    assert canva_element["type"] == "text"
    assert "Welcome to Our Product" in canva_element["text"]
    assert canva_element["font_weight"] == "bold"
    assert canva_element["text_align"] == "center"


def test_translate_hero_element(translator_with_mock, complex_layout):
    """Test hero element translation creates group."""
    hero_element = complex_layout.get_elements_by_type(ElementType.HERO)[0]
    canva_element = translator_with_mock._translate_hero(hero_element)
    
    assert canva_element["type"] == "group"
    assert "elements" in canva_element
    assert len(canva_element["elements"]) == 3  # headline, description, cta


def test_translate_cta_element(translator_with_mock, simple_layout):
    """Test CTA element translation."""
    cta_element = simple_layout.elements[1]
    canva_element = translator_with_mock._translate_cta(cta_element)
    
    assert canva_element["type"] == "button"
    assert canva_element["text"] == "Get Started"
    assert canva_element["url"] == "https://example.com/signup"


def test_translate_footer_element(translator_with_mock, complex_layout):
    """Test footer element translation."""
    footer_element = complex_layout.get_elements_by_type(ElementType.FOOTER)[0]
    canva_element = translator_with_mock._translate_footer(footer_element)
    
    assert canva_element["type"] == "text"
    assert "Acme Corp" in canva_element["text"]
    assert canva_element["font_size"] == 14


def test_translate_image_element(translator_with_mock, complex_layout):
    """Test image element translation."""
    image_element = complex_layout.get_elements_by_type(ElementType.IMAGE)[0]
    canva_element = translator_with_mock._translate_image(image_element)
    
    assert canva_element["type"] == "image"
    assert canva_element["url"] == "https://example.com/image.jpg"


def test_translate_text_block_element(translator_with_mock, complex_layout):
    """Test text block element translation."""
    text_element = complex_layout.get_elements_by_type(ElementType.TEXT_BLOCK)[0]
    canva_element = translator_with_mock._translate_text_block(text_element)
    
    assert canva_element["type"] == "text"
    assert canva_element["text"] == "Some body text"


def test_brand_styling_application(translator_with_mock, simple_layout, brand_profile):
    """Test that brand styling is properly applied."""
    canva_data = translator_with_mock.translate(simple_layout, brand_profile)
    
    # Verify brand values appear in output
    canva_json = str(canva_data)
    assert brand_profile.primary_color in canva_json or brand_profile.text_color in canva_json
    assert brand_profile.primary_font in canva_json


def test_element_ordering(translator_with_mock, complex_layout):
    """Test elements maintain correct order."""
    canva_data = translator_with_mock.translate(complex_layout)
    elements = canva_data["pages"][0]["elements"]
    
    # Should have all 8 elements
    assert len(elements) == 8


def test_invisible_elements_filtered(translator_with_mock, simple_layout):
    """Test that invisible elements are not translated."""
    # Make second element invisible
    simple_layout.elements[1].visible = False
    
    canva_data = translator_with_mock.translate(simple_layout)
    elements = canva_data["pages"][0]["elements"]
    
    # Should only have 1 element now
    assert len(elements) == 1


def test_auto_positioning(translator_with_mock, simple_layout):
    """Test auto-positioning logic for elements without explicit position."""
    header_element = simple_layout.elements[0]
    position = translator_with_mock._auto_position(header_element)
    
    assert "x" in position
    assert "y" in position
    assert "width" in position
    assert "height" in position
    assert position["y"] == 200  # order=1 * 200px


def test_auto_positioning_footer(translator_with_mock, simple_layout):
    """Test auto-positioning for footer elements."""
    footer_element = simple_layout.elements[1]
    position = translator_with_mock._auto_position(footer_element, bottom=True)
    
    assert position["y"] == 1800  # Bottom position


# ============================================================================
# Integration Tests (require Canva API token)
# ============================================================================

@pytest.mark.integration
@pytest.mark.skipif(
    not os.getenv("CANVA_ACCESS_TOKEN"),
    reason="CANVA_ACCESS_TOKEN not set - skipping integration tests"
)
def test_create_design_integration(simple_layout, brand_profile):
    """Test actual design creation via Canva API."""
    translator = CanvaTranslator()
    
    design_id = translator.create_design(simple_layout, brand_profile)
    
    assert design_id is not None
    assert len(design_id) > 0
    print(f"\n✅ Design created: https://www.canva.com/design/{design_id}")


@pytest.mark.integration
@pytest.mark.skipif(
    not os.getenv("CANVA_ACCESS_TOKEN"),
    reason="CANVA_ACCESS_TOKEN not set - skipping integration tests"
)
def test_full_workflow_integration(simple_layout, brand_profile):
    """Test complete create and export workflow."""
    translator = CanvaTranslator()
    
    design_id, pdf_path = translator.create_and_export(
        simple_layout,
        brand_profile,
        output_path="backend/output/test_simple.pdf"
    )
    
    assert design_id is not None
    assert os.path.exists(pdf_path)
    assert pdf_path.endswith(".pdf")
    
    print(f"\n✅ Design ID: {design_id}")
    print(f"✅ PDF Path: {pdf_path}")
    
    # Cleanup
    if os.path.exists(pdf_path):
        os.remove(pdf_path)


# ============================================================================
# Error Handling Tests
# ============================================================================

def test_translation_error_handling(translator_with_mock):
    """Test error handling for invalid layouts."""
    invalid_layout = OnePagerLayout(
        title="Invalid Layout",
        elements=[]  # No elements
    )
    
    # Should not raise error, just create empty design
    canva_data = translator_with_mock.translate(invalid_layout)
    assert canva_data is not None
    assert len(canva_data["pages"][0]["elements"]) == 0


def test_element_translation_error_logged(translator_with_mock, simple_layout):
    """Test that element translation errors are logged but don't fail entire translation."""
    # Mock a translator method to raise error
    translator_with_mock._translate_header = Mock(side_effect=Exception("Test error"))
    
    # Translation should continue despite error
    canva_data = translator_with_mock.translate(simple_layout)
    
    # Header failed, but CTA should still be translated
    assert canva_data is not None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
