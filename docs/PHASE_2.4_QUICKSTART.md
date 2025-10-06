# Phase 2.4 Quick Start Guide

**Goal**: Implement Canva Autofill API for automated one-pager creation

---

## 🚀 Getting Started

### Option 1: Start with Research (Recommended)
```bash
# Read complete plan
code docs/PHASE_2.4_PLAN.md

# Start Step 1: Research Canva Autofill API
# Timeline: 2-4 hours
# Deliverable: docs/CANVA_AUTOFILL_API.md
```

**What to research:**
1. Visit https://www.canva.com/developers/docs/connect-api/
2. Find Brand Templates documentation
3. Locate `/v1/brand_templates` and `/v1/autofills` endpoints
4. Document request/response formats
5. Verify required OAuth scopes

---

### Option 2: Verify OAuth Scopes First
```bash
# Check if your current token has brand_template access
cd backend
python -c "
from config import settings
from integrations.canva.canva_client import CanvaClient

client = CanvaClient(settings.canva_access_token)
try:
    templates = client.get_brand_templates()  # This will fail if scope missing
    print(f'✅ Access granted: {len(templates)} templates')
except Exception as e:
    print(f'❌ Need brand_template scope: {e}')
"
```

**If scope missing:**
1. Go to https://www.canva.com/developers/
2. Select your app
3. Enable "Brand Templates" scopes
4. Regenerate OAuth token
5. Update `.env` file

---

### Option 3: Create First Template (Designer Task)
```
1. Open Canva (https://www.canva.com)
2. Create New Design → Custom Size → 1080x1920px
3. Add elements with placeholder text:
   - Header: {{title}}
   - Headline: {{headline}}
   - Description: {{description}}
   - CTA Button: {{cta_button}}
   - Footer: {{company_name}}
4. Apply Poll Everywhere brand colors:
   - Primary: #007ACC
   - Purple: #864CBD
   - Deep Blue: #1568B8
5. Save as Brand Template
6. Note the Template ID
7. Document field names in spreadsheet
```

---

## 📋 Decision Points

### Decision 1: Timeline
**Question**: How much time can you allocate?

- **Option A**: Full-time (1.5 weeks) - Complete all steps sequentially
- **Option B**: Part-time (3 weeks) - Do Step 1-2 this week, Step 3-5 next week
- **Option C**: Staged (flexible) - Do research now, implement when ready

**Recommendation**: Option B (part-time, 3 weeks)

---

### Decision 2: Template Scope
**Question**: How many templates to start with?

- **Option A**: 1 simple template (MVP) - Fastest to market
- **Option B**: 3 templates (recommended) - Covers main use cases
- **Option C**: 5+ templates (comprehensive) - Full coverage, longer timeline

**Recommendation**: Option A for Phase 2.4, expand in Phase 2.5

---

### Decision 3: Implementation Order
**Question**: What to build first?

**Recommended Order:**
1. ✅ Verify OAuth scopes (30 min)
2. ✅ Create 1 simple template in Canva UI (2 hours)
3. ✅ Add `get_brand_templates()` to CanvaClient (1 hour)
4. ✅ Test template listing (30 min)
5. ✅ Add `autofill_template()` method (2 hours)
6. ✅ Test autofill creation (1 hour)
7. ✅ Build TemplateFieldMapper (2 hours)
8. ✅ Test full workflow (1 hour)
9. ✅ Documentation (2 hours)

**Total MVP Timeline**: ~12 hours

---

## 🎯 MVP Scope (Minimal Viable Product)

### What to Include
- ✅ 1 simple brand template (5-6 fields)
- ✅ Basic field mapping (header, hero, CTA, footer)
- ✅ Autofill API integration
- ✅ End-to-end test workflow
- ✅ Basic documentation

### What to Defer
- ⏳ Multiple templates (Phase 2.5)
- ⏳ Dynamic field mapping (Phase 2.5)
- ⏳ Template selection logic (Phase 2.5)
- ⏳ Image upload support (Phase 2.6)
- ⏳ Advanced styling options (Phase 2.6)

---

## 🚦 Next Actions

### Immediate (Today)
1. **Review the plan**: Read `docs/PHASE_2.4_PLAN.md` thoroughly
2. **Check scope access**: Test if your token has brand_template permissions
3. **Make decision**: Choose timeline option (A, B, or C)

### This Week
1. **Research** (if needed): Read Canva Autofill API docs
2. **Create template**: Build first simple template in Canva
3. **OAuth check**: Verify or regenerate token with correct scopes

### Next Week
1. **Implement CanvaClient methods**: Add autofill support
2. **Build field mapper**: Create TemplateFieldMapper class
3. **Test workflow**: Validate end-to-end autofill → PDF

### Week 3
1. **Refine & test**: Fix bugs, handle edge cases
2. **Document**: Write usage guides
3. **Deploy**: Merge to main, mark Phase 2.4 complete

---

## 📞 Questions to Answer

Before starting, clarify:

1. **Do you have Canva Pro?** (Required for Brand Templates)
   - Check: Your token shows `"bundles":["PROS"]` ✓

2. **Can you create templates in Canva?** (Requires UI work)
   - Time needed: 2-4 hours for first template
   - Alternative: Use existing Canva templates

3. **What's your priority?** 
   - Speed to market? → 1 template MVP
   - Feature completeness? → 3 templates, full coverage
   - Learning? → Start slow with research phase

4. **Who will create templates?**
   - Designer on team? → Best approach
   - You? → Allow extra time for learning Canva
   - Pre-made? → Check Canva template marketplace

---

## 💡 Tips for Success

### Template Creation Tips
- Start VERY simple (5 fields max)
- Use clear field names ({{headline}}, not {{h1}})
- Test template manually before coding
- Take screenshots of each field location
- Document field types (text, image, color)

### Code Implementation Tips
- Test each method independently first
- Use print/log statements liberally
- Start with hardcoded values, then generalize
- Write tests as you go (not at end)
- Keep commits small and focused

### Testing Tips
- Test with real OnePagerLayout data
- Try edge cases (missing fields, empty values)
- Verify PDFs actually look correct
- Check performance (should be < 10 sec)
- Test with different templates

---

## 🎉 Success Looks Like

### End of Phase 2.4
```python
# This should work:
layout = OnePagerLayout(
    title="Product Launch",
    elements=[
        OnePagerElement(type=ElementType.HEADER, content={"title": "CloudSync Pro"}),
        OnePagerElement(type=ElementType.HERO, content={
            "headline": "50% Faster",
            "description": "Enterprise security",
            "cta_text": "Get Started"
        })
    ]
)

translator = CanvaTranslator()
design_id, pdf = translator.create_and_export_from_template(
    layout,
    template_id="YOUR_TEMPLATE_ID"
)

print(f"✅ PDF ready: {pdf}")
# Opens fully populated, brand-styled PDF!
```

---

## 📚 Resources

- **Full Plan**: `docs/PHASE_2.4_PLAN.md`
- **Phase 2.3 Results**: `backend/CANVA_TESTING_RESULTS.md`
- **POC Findings**: `canva-poc/POC_RESULTS.md`
- **Canva Docs**: https://www.canva.com/developers/
- **Current Code**: `backend/services/canva_translator.py`

---

**Ready to start?** Pick an option above and let's build! 🚀
