# Phase 2.4 Implementation Plan: Canva Autofill API Integration

**Date**: October 5, 2025  
**Status**: 📋 **PLANNING**  
**Goal**: Enable automated content population in Canva designs via Brand Templates + Autofill API

---

## 🎯 Objective

Implement the missing piece from Phase 2.3: **Content Population**

Transform the workflow from:
```
❌ CURRENT: Blank Design → Manual Editing → PDF
```

To:
```
✅ TARGET: OnePagerLayout JSON → Brand Template → Autofill → Styled Design → PDF
```

---

## 📊 Phase Overview

### Dependencies
- ✅ Phase 2.3 Complete (Translator service ready)
- ✅ Canva API access validated (design creation + PDF export working)
- ⏳ Brand Templates need to be created in Canva UI
- ⏳ Autofill API scopes need to be verified

### Deliverables
1. Brand Template creation in Canva (3-5 templates)
2. Template field mapping system
3. Autofill API integration in CanvaClient
4. Enhanced CanvaTranslator with autofill support
5. End-to-end automated workflow
6. Comprehensive testing

### Estimated Timeline
- **Research & Setup**: 2-4 hours
- **Template Creation**: 4-6 hours (Canva UI work)
- **API Integration**: 6-10 hours
- **Testing & Refinement**: 4-6 hours
- **Documentation**: 2-3 hours
- **Total**: 18-29 hours (~3-4 days)

---

## 🔍 Technical Research Needed

### 1. Canva Autofill API Documentation

**Required Reading:**
- Canva Connect API: Brand Templates
- Autofill endpoint: `POST /rest/v1/brand_templates/{template_id}/autofill`
- Field types and data binding
- Supported element types

**Questions to Answer:**
- [ ] What scopes are required? (`brand_template:read`, `brand_template:write`?)
- [ ] How do template placeholders work?
- [ ] What field types are supported? (text, image, color, etc.)
- [ ] Can we create templates programmatically or only via UI?
- [ ] What's the response format?
- [ ] Are there rate limits specific to autofill?

### 2. OAuth Scope Verification

**Current Token Scopes** (from .env):
- `profile:read` ✓
- `design:content:read` ✓
- `design:content:write` ✓
- `asset:write` ✓

**Potentially Needed:**
- `brand_template:read` ?
- `brand_template:write` ?
- `folder:read` ?
- `folder:write` ?

**Action**: Check if current token has brand_template access or if we need to regenerate with additional scopes.

### 3. Template Field Mapping Strategy

**Design Question**: How do we map OnePagerLayout elements to template fields?

**Option A: Static Mapping** (Simple)
```python
TEMPLATE_FIELDS = {
    "header_title": "{{title}}",
    "hero_headline": "{{headline}}",
    "hero_description": "{{description}}",
    "cta_text": "{{cta_button}}",
    # ... fixed field names
}
```

**Option B: Dynamic Mapping** (Flexible)
```python
# Template metadata stored in database
{
    "template_id": "ABC123",
    "field_mapping": {
        "header.title": "{{main_title}}",
        "hero.headline": "{{hero_text}}",
        # ... configurable per template
    }
}
```

**Recommendation**: Start with Option A for MVP, migrate to Option B for production.

---

## 🏗️ Implementation Steps

### Step 1: Research & Documentation (2-4 hours)

**Tasks:**
- [ ] Read Canva Autofill API documentation thoroughly
- [ ] Explore Canva Developer Portal for Brand Template examples
- [ ] Document API endpoint format, request/response schemas
- [ ] Identify required OAuth scopes
- [ ] Create API request/response examples

**Deliverable**: `docs/CANVA_AUTOFILL_API.md` with complete API reference

---

### Step 2: Brand Template Creation (4-6 hours)

**Approach**: Create templates manually in Canva UI for Phase 2.4, explore programmatic creation in Phase 3.

#### Template 1: Basic One-Pager
**Layout:**
- Header section with {{title}} placeholder
- Hero section with {{headline}}, {{description}}, {{cta_button}}
- Footer with {{company_name}}, {{copyright}}

**Dimensions**: 1080x1920px (mobile-optimized)

**Brand Elements:**
- Poll Everywhere colors (#007ACC, #864CBD, #1568B8)
- Source Sans Pro font
- Logo placeholder

#### Template 2: Feature-Rich One-Pager
**Additional Sections:**
- {{feature_1_title}}, {{feature_1_desc}}, {{feature_1_icon}}
- {{feature_2_title}}, {{feature_2_desc}}, {{feature_2_icon}}
- {{feature_3_title}}, {{feature_3_desc}}, {{feature_3_icon}}
- Testimonial section with {{quote}}, {{author}}, {{company}}

#### Template 3: Product Launch
**Specialized Fields:**
- {{product_name}}, {{product_tagline}}
- {{key_benefit_1}}, {{key_benefit_2}}, {{key_benefit_3}}
- {{pricing_info}}, {{availability}}
- {{product_image}} (image placeholder)

**Deliverables:**
- 3 published brand templates in Canva
- Template IDs documented
- Field mapping spreadsheet for each template
- Screenshots of each template

---

### Step 3: CanvaClient Autofill Extension (4-6 hours)

**File**: `backend/integrations/canva/canva_client.py`

#### Add Autofill Methods

```python
def get_brand_templates(self, query: str = None) -> List[Dict]:
    """
    List available brand templates.
    
    Args:
        query: Optional search query to filter templates
        
    Returns:
        List of template objects with id, title, thumbnail
    """
    endpoint = '/v1/brand_templates'
    params = {'query': query} if query else {}
    return self._make_request('GET', endpoint, params=params)

def get_template_fields(self, template_id: str) -> Dict:
    """
    Get field definitions for a brand template.
    
    Args:
        template_id: Brand template ID
        
    Returns:
        Dict with field names, types, and constraints
    """
    endpoint = f'/v1/brand_templates/{template_id}'
    return self._make_request('GET', endpoint)

def autofill_template(
    self, 
    template_id: str, 
    data: Dict[str, Any],
    title: str = "Autofilled Design"
) -> CanvaDesign:
    """
    Create a design from brand template with autofilled data.
    
    Args:
        template_id: Brand template ID
        data: Field values to populate (field_name: value)
        title: Title for the created design
        
    Returns:
        CanvaDesign object
        
    Example:
        data = {
            "title": "Product Launch",
            "headline": "Revolutionary New Feature",
            "description": "Transform your workflow",
            "cta_button": "Get Started"
        }
        design = client.autofill_template("TPL123", data)
    """
    endpoint = f'/v1/brand_templates/{template_id}/autofill'
    payload = {
        "brand_template_id": template_id,
        "title": title,
        "data": data
    }
    
    self.logger.info(f"Autofilling template {template_id} with {len(data)} fields")
    response = self._make_request('POST', endpoint, json=payload)
    
    return CanvaDesign(
        id=response['design']['id'],
        title=response['design']['title'],
        url=response['design'].get('urls', {}).get('view_url', ''),
        thumbnail_url=response['design'].get('thumbnail', {}).get('url')
    )
```

**Testing**:
```python
# Test script: backend/test_autofill.py
client = CanvaClient(token, base_url)

# List templates
templates = client.get_brand_templates()
print(f"Found {len(templates)} templates")

# Get field definitions
template_id = templates[0]['id']
fields = client.get_template_fields(template_id)
print(f"Template fields: {fields}")

# Autofill
data = {"title": "Test", "headline": "Hello World"}
design = client.autofill_template(template_id, data)
print(f"Created design: {design.id}")
```

---

### Step 4: Template Field Mapper (2-3 hours)

**File**: `backend/services/template_mapper.py`

```python
"""
Template Field Mapper
=====================

Maps OnePagerLayout elements to Canva brand template fields.
"""

from typing import Dict, Any, Optional
from backend.models.onepager import OnePagerLayout, ElementType
from backend.models.profile import BrandProfile


class TemplateFieldMapper:
    """Maps internal data to template fields."""
    
    # Static field mapping (MVP approach)
    BASIC_TEMPLATE_MAPPING = {
        ElementType.HEADER: {
            "title": "{{title}}",
            "subtitle": "{{subtitle}}",
            "logo_url": "{{logo}}"
        },
        ElementType.HERO: {
            "headline": "{{headline}}",
            "subheadline": "{{subheadline}}",
            "description": "{{description}}",
            "cta_text": "{{cta_button}}",
            "cta_url": "{{cta_url}}"
        },
        ElementType.FEATURES: {
            "title": "{{features_title}}",
            "feature_1_title": "{{feature_1}}",
            "feature_1_desc": "{{feature_1_desc}}",
            "feature_2_title": "{{feature_2}}",
            "feature_2_desc": "{{feature_2_desc}}",
            "feature_3_title": "{{feature_3}}",
            "feature_3_desc": "{{feature_3_desc}}"
        },
        ElementType.CTA: {
            "primary_text": "{{cta_primary}}",
            "secondary_text": "{{cta_secondary}}"
        },
        ElementType.FOOTER: {
            "company_name": "{{company}}",
            "copyright": "{{copyright}}",
            "contact_email": "{{email}}"
        }
    }
    
    def __init__(self, template_id: str, template_type: str = "basic"):
        self.template_id = template_id
        self.template_type = template_type
    
    def map_layout_to_fields(
        self,
        layout: OnePagerLayout,
        brand_profile: Optional[BrandProfile] = None
    ) -> Dict[str, Any]:
        """
        Convert OnePagerLayout to template field values.
        
        Args:
            layout: OnePagerLayout to convert
            brand_profile: Optional brand profile for brand-specific fields
            
        Returns:
            Dict of field_name: value for autofill API
        """
        fields = {}
        
        # Map each element
        for element in layout.elements:
            if not element.visible:
                continue
                
            element_mapping = self.BASIC_TEMPLATE_MAPPING.get(element.type, {})
            
            # Extract field values from element content
            for content_key, template_field in element_mapping.items():
                value = element.content.get(content_key)
                if value:
                    # Remove {{}} from template_field to get actual field name
                    field_name = template_field.strip('{}')
                    fields[field_name] = value
        
        # Add brand-specific fields
        if brand_profile:
            fields['brand_primary_color'] = brand_profile.primary_color
            fields['brand_logo'] = brand_profile.logo_url
            fields['brand_font'] = brand_profile.primary_font
        
        return fields
    
    def validate_fields(self, fields: Dict[str, Any], required_fields: List[str]) -> bool:
        """Check if all required fields are present."""
        missing = [f for f in required_fields if f not in fields]
        if missing:
            raise ValueError(f"Missing required fields: {missing}")
        return True
```

---

### Step 5: Enhanced Canva Translator (3-4 hours)

**File**: `backend/services/canva_translator.py`

**Add autofill workflow methods:**

```python
def create_from_template(
    self,
    layout: OnePagerLayout,
    template_id: str,
    brand_profile: Optional[BrandProfile] = None
) -> str:
    """
    Create design using brand template + autofill.
    
    Args:
        layout: OnePagerLayout to convert
        template_id: Canva brand template ID
        brand_profile: Optional brand profile
        
    Returns:
        Design ID of created design
    """
    from backend.services.template_mapper import TemplateFieldMapper
    
    # Map layout to template fields
    mapper = TemplateFieldMapper(template_id)
    field_data = mapper.map_layout_to_fields(layout, brand_profile)
    
    self.logger.info(f"Mapped {len(field_data)} fields for template {template_id}")
    
    # Autofill template
    try:
        design = self.canva_client.autofill_template(
            template_id=template_id,
            data=field_data,
            title=layout.title
        )
        
        self.logger.info(f"Created design from template: {design.id}")
        return design.id
        
    except Exception as e:
        self.logger.error(f"Autofill failed: {e}")
        raise CanvaTranslationError(f"Template autofill failed: {e}")

def create_and_export_from_template(
    self,
    layout: OnePagerLayout,
    template_id: str,
    brand_profile: Optional[BrandProfile] = None,
    output_path: Optional[str] = None
) -> tuple[str, str]:
    """
    Complete workflow: template autofill → export PDF.
    
    Returns:
        Tuple of (design_id, pdf_path)
    """
    # Create from template
    design_id = self.create_from_template(layout, template_id, brand_profile)
    
    # Export to PDF
    pdf_path = self.export_to_pdf(design_id, output_path)
    
    return design_id, pdf_path
```

---

### Step 6: Integration Testing (3-4 hours)

**Test File**: `backend/test_autofill_workflow.py`

```python
def test_list_templates():
    """Test: List available brand templates"""
    client = CanvaClient(...)
    templates = client.get_brand_templates()
    assert len(templates) > 0
    print(f"✅ Found {len(templates)} templates")

def test_template_fields():
    """Test: Get field definitions"""
    client = CanvaClient(...)
    fields = client.get_template_fields(TEMPLATE_ID)
    assert 'title' in fields
    print(f"✅ Template has {len(fields)} fields")

def test_field_mapping():
    """Test: Map OnePager to template fields"""
    layout = OnePagerLayout(...)
    mapper = TemplateFieldMapper(TEMPLATE_ID)
    fields = mapper.map_layout_to_fields(layout)
    assert fields['title'] == layout.title
    print(f"✅ Mapped {len(fields)} fields")

def test_autofill_simple():
    """Test: Create design via autofill"""
    client = CanvaClient(...)
    data = {"title": "Test", "headline": "Hello"}
    design = client.autofill_template(TEMPLATE_ID, data)
    assert design.id
    print(f"✅ Created design: {design.id}")

def test_full_workflow():
    """Test: Complete autofill → export workflow"""
    layout = create_test_layout()
    translator = CanvaTranslator()
    
    design_id, pdf_path = translator.create_and_export_from_template(
        layout,
        TEMPLATE_ID
    )
    
    assert Path(pdf_path).exists()
    print(f"✅ Workflow complete: {pdf_path}")
```

---

### Step 7: Documentation (2-3 hours)

**Files to Create/Update:**
1. `docs/CANVA_AUTOFILL_API.md` - API reference
2. `backend/services/README.md` - Update with autofill examples
3. `docs/BRAND_TEMPLATE_GUIDE.md` - Template creation guide
4. `IMPLEMENTATION_SUMMARY.md` - Add Phase 2.4 section

**Example Usage Documentation:**

```markdown
## Using Brand Templates

### Quick Start

```python
from backend.services.canva_translator import CanvaTranslator

# Create layout
layout = OnePagerLayout(
    title="Product Launch",
    elements=[...]
)

# Use template (no manual JSON translation needed!)
translator = CanvaTranslator()
design_id, pdf = translator.create_and_export_from_template(
    layout,
    template_id="TPL_BASIC_ONEPAGER",  # From Canva UI
    output_path="output/launch.pdf"
)

print(f"✅ PDF ready: {pdf}")
```

### Available Templates

| Template ID | Name | Use Case | Fields |
|-------------|------|----------|--------|
| TPL_BASIC | Basic One-Pager | Simple layouts | 8 fields |
| TPL_FEATURES | Feature-Rich | Product showcases | 15 fields |
| TPL_LAUNCH | Product Launch | New releases | 12 fields |
```

---

## 🎯 Success Criteria

### Functional Requirements
- [ ] Can list available brand templates via API
- [ ] Can retrieve template field definitions
- [ ] Can autofill template with OnePagerLayout data
- [ ] Can export autofilled design to PDF
- [ ] Field mapping covers all 8 OnePager element types
- [ ] Brand profile data applies to templates

### Quality Requirements
- [ ] Autofill success rate > 95%
- [ ] End-to-end workflow completes in < 10 seconds
- [ ] Comprehensive error handling for missing fields
- [ ] Logging for all autofill operations
- [ ] 100% test coverage for autofill methods

### Documentation Requirements
- [ ] API endpoint documentation complete
- [ ] Template creation guide for designers
- [ ] Field mapping reference
- [ ] Usage examples for developers
- [ ] Troubleshooting guide

---

## 🚧 Potential Challenges

### Challenge 1: OAuth Scope Access
**Issue**: Current token may not have `brand_template:*` scopes  
**Solution**: Regenerate token with correct scopes or implement full OAuth flow

**Steps**:
1. Check Canva Developer Portal app settings
2. Enable Brand Template scopes
3. Regenerate access token
4. Update `.env` file

### Challenge 2: Template Creation Learning Curve
**Issue**: Creating templates in Canva UI may take time to learn  
**Solution**: Start with 1 simple template, iterate based on learnings

**Mitigation**:
- Watch Canva tutorials on brand templates
- Use existing templates as references
- Keep first template very simple (5-6 fields max)

### Challenge 3: Field Mapping Complexity
**Issue**: OnePager elements may not map 1:1 to template fields  
**Solution**: Use flexible mapping with defaults for missing fields

**Approach**:
```python
# Use safe get with defaults
fields = {
    'title': element.content.get('title', 'Untitled'),
    'headline': element.content.get('headline', ''),
    # ... graceful degradation
}
```

### Challenge 4: API Rate Limits
**Issue**: Autofill + Export may hit rate limits  
**Solution**: Implement retry logic with exponential backoff

**Already have**: Rate limit tracking in CanvaClient  
**Need to add**: Retry decorator for autofill methods

---

## 📊 Progress Tracking

### Phase 2.4 Checklist

**Step 1: Research (2-4 hours)**
- [ ] Read Canva Autofill API docs
- [ ] Document API endpoints
- [ ] Verify OAuth scopes
- [ ] Create API examples

**Step 2: Templates (4-6 hours)**
- [ ] Create Template 1: Basic One-Pager
- [ ] Create Template 2: Feature-Rich
- [ ] Create Template 3: Product Launch
- [ ] Document template IDs and fields
- [ ] Test templates manually in Canva

**Step 3: CanvaClient Extension (4-6 hours)**
- [ ] Add `get_brand_templates()` method
- [ ] Add `get_template_fields()` method
- [ ] Add `autofill_template()` method
- [ ] Add error handling
- [ ] Write unit tests

**Step 4: Field Mapper (2-3 hours)**
- [ ] Create TemplateFieldMapper class
- [ ] Implement element → field mapping
- [ ] Add brand profile integration
- [ ] Add field validation
- [ ] Write unit tests

**Step 5: Translator Enhancement (3-4 hours)**
- [ ] Add `create_from_template()` method
- [ ] Add `create_and_export_from_template()` method
- [ ] Update existing methods to support templates
- [ ] Add logging
- [ ] Write unit tests

**Step 6: Testing (3-4 hours)**
- [ ] Test template listing
- [ ] Test field retrieval
- [ ] Test field mapping
- [ ] Test autofill creation
- [ ] Test full workflow (autofill → export)
- [ ] Test error scenarios

**Step 7: Documentation (2-3 hours)**
- [ ] Write autofill API reference
- [ ] Update service README
- [ ] Create template creation guide
- [ ] Add usage examples
- [ ] Update implementation summary

---

## 🎉 Expected Outcome

### Before Phase 2.4
```python
# Manual workflow
translator = CanvaTranslator()

# 1. Translate to JSON (works)
canva_json = translator.translate(layout)

# 2. Create design (only creates blank)
design_id = translator.create_design(layout)  
# ❌ Design is empty!

# 3. Manual editing required
print("Please edit design in Canva UI...")

# 4. Export
pdf = translator.export_to_pdf(design_id)
```

### After Phase 2.4
```python
# Automated workflow
translator = CanvaTranslator()

# One call does everything!
design_id, pdf_path = translator.create_and_export_from_template(
    layout,
    template_id="TPL_BASIC",
    brand_profile=brand,
    output_path="output/product-launch.pdf"
)

# ✅ Fully populated design
# ✅ Brand styled
# ✅ Ready to download
print(f"PDF ready: {pdf_path}")
```

---

## 📅 Proposed Timeline

### Week 1: Research & Templates
- **Day 1-2**: Research Canva Autofill API, verify scopes
- **Day 3-4**: Create 3 brand templates in Canva UI
- **Day 5**: Document templates and field mappings

### Week 2: Implementation
- **Day 1-2**: Extend CanvaClient with autofill methods
- **Day 3**: Build TemplateFieldMapper
- **Day 4**: Enhance CanvaTranslator
- **Day 5**: Integration testing

### Week 3: Testing & Documentation
- **Day 1-2**: Comprehensive testing and bug fixes
- **Day 3-4**: Write documentation
- **Day 5**: Final validation and deployment prep

**Total**: 3 weeks part-time or 1.5 weeks full-time

---

## 🔗 Dependencies & Prerequisites

### Technical Dependencies
- ✅ Phase 2.3 complete (CanvaTranslator ready)
- ✅ Canva API access validated
- ⏳ Brand template scopes enabled
- ⏳ Fresh OAuth token with correct permissions

### External Dependencies
- Canva Developer Account (have)
- Canva Pro subscription (have - PROS bundle)
- Brand template access in Canva UI
- Autofill API documentation access

### Team Dependencies
- Designer time for template creation (4-6 hours)
- Developer time for implementation (12-18 hours)
- QA time for testing (3-4 hours)

---

## 📚 References

- **Canva API Docs**: https://www.canva.com/developers/docs/connect-api/
- **Phase 1 POC Results**: `canva-poc/POC_RESULTS.md`
- **Phase 2.3 Summary**: `backend/CANVA_TESTING_RESULTS.md`
- **Current Translator**: `backend/services/canva_translator.py`
- **CanvaClient**: `backend/integrations/canva/canva_client.py`

---

**Next Action**: Review this plan and decide:
1. Approve as-is and start Step 1 (Research)
2. Adjust timeline/scope
3. Prioritize specific templates
4. Begin with OAuth scope verification

---

**Plan Created**: October 5, 2025  
**Estimated Duration**: 18-29 hours (~3 weeks part-time)  
**Complexity**: Medium  
**Risk Level**: Low (POC validated approach)
