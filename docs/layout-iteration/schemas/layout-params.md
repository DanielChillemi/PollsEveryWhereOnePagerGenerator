<!--
File: docs/layout-iteration/schemas/layout-params.md
Purpose: Complete schema documentation for LayoutParams data models
Created: 2025-01-18
Last Updated: 2025-01-18
-->

# LayoutParams Schema Documentation

## Overview

The LayoutParams system enables AI-driven customization of one-pager design beyond content. Instead of fixed templates, users can iteratively refine layout parameters (spacing, typography, colors, section layouts) with AI assistance.

**Key Design Principles**:
- ✅ All fields have sensible defaults
- ✅ All numeric fields have validation ranges
- ✅ Backward compatible (Optional fields in database)
- ✅ JSON serializable for API transport
- ✅ Pydantic validation ensures type safety

---

## Data Models Hierarchy

```
LayoutParams
├── ColorScheme
├── Typography
├── Spacing
└── SectionLayout (dict of section name → layout config)
```

---

## 1. ColorScheme

**Purpose**: Define color palette for one-pager design

### Fields

| Field | Type | Default | Validation | Description |
|-------|------|---------|------------|-------------|
| `primary` | `str` | `"#1568B8"` | Hex format `#RRGGBB` | Primary brand color |
| `secondary` | `str` | `"#864CBD"` | Hex format `#RRGGBB` | Secondary brand color |
| `accent` | `str` | `"#FF6B6B"` | Hex format `#RRGGBB` | Accent color for highlights |
| `text_primary` | `str` | `"#1A202C"` | Hex format `#RRGGBB` | Primary text color |
| `background` | `str` | `"#FFFFFF"` | Hex format `#RRGGBB` | Background color |

### Validation Rules

- **Hex Format**: All colors must be in `#RRGGBB` format (7 characters, starting with `#`)
- **Case Insensitive**: `#FF0000`, `#ff0000`, and `#Ff0000` are all valid
- **Invalid Examples**:
  - `"FF0000"` (missing `#`)
  - `"#FF00"` (wrong length)
  - `"#GGGGGG"` (invalid hex characters)

### JSON Example

```json
{
  "primary": "#1568B8",
  "secondary": "#864CBD",
  "accent": "#FF6B6B",
  "text_primary": "#1A202C",
  "background": "#FFFFFF"
}
```

### Python Usage

```python
from backend.models.onepager import ColorScheme

# Create with defaults
scheme = ColorScheme()

# Create with custom colors
scheme = ColorScheme(
    primary="#FF5733",
    secondary="#33FF57",
    accent="#3357FF"
)

# Validation error for invalid hex
scheme = ColorScheme(primary="invalid")  # Raises ValidationError
```

---

## 2. Typography

**Purpose**: Define typography scaling and font configuration

### Fields

| Field | Type | Default | Range | Description |
|-------|------|---------|-------|-------------|
| `heading_font` | `str` | `"Inter"` | Any string | Font family for headings |
| `body_font` | `str` | `"Inter"` | Any string | Font family for body text |
| `h1_scale` | `float` | `1.0` | `0.8` - `1.5` | H1 size multiplier |
| `h2_scale` | `float` | `1.0` | `0.8` - `1.5` | H2 size multiplier |
| `body_scale` | `float` | `1.0` | `0.8` - `1.3` | Body text size multiplier |
| `line_height_scale` | `float` | `1.0` | `0.8` - `1.4` | Line height multiplier |

### Validation Rules

- **Scale Ranges**: All scale values must be within their specified ranges
- **Fonts**: Any font family name is accepted (validation happens at PDF generation)
- **Multipliers**: Applied to base font sizes defined in PDF templates

### JSON Example

```json
{
  "heading_font": "Montserrat",
  "body_font": "Open Sans",
  "h1_scale": 1.2,
  "h2_scale": 1.0,
  "body_scale": 1.0,
  "line_height_scale": 1.1
}
```

### Python Usage

```python
from backend.models.onepager import Typography

# Create with defaults
typo = Typography()

# Create with larger headings
typo = Typography(
    h1_scale=1.3,
    h2_scale=1.1,
    heading_font="Montserrat"
)

# Validation error for out-of-range value
typo = Typography(h1_scale=2.0)  # Raises ValidationError (max is 1.5)
```

### Use Cases

- **Content-heavy one-pagers**: Use smaller scales (`h1_scale=0.9`) to fit more content
- **Bold designs**: Use larger scales (`h1_scale=1.4`) to emphasize headlines
- **Readability optimization**: Adjust `line_height_scale` for longer text blocks

---

## 3. Spacing

**Purpose**: Define spacing and padding configuration

### Fields

| Field | Type | Default | Options/Range | Description |
|-------|------|---------|---------------|-------------|
| `section_gap` | `Literal` | `"normal"` | `"tight"`, `"normal"`, `"loose"` | Vertical spacing between sections |
| `padding_scale` | `float` | `1.0` | `0.5` - `2.0` | Overall padding multiplier |

### Validation Rules

- **section_gap**: Must be one of the three literal values
- **padding_scale**: Must be within `0.5` to `2.0` range

### Spacing Values Mapping

| `section_gap` | Approximate Pixel Gap |
|---------------|----------------------|
| `"tight"` | 16-24px |
| `"normal"` | 32-48px |
| `"loose"` | 64-96px |

*Actual pixel values depend on base template spacing*

### JSON Example

```json
{
  "section_gap": "loose",
  "padding_scale": 1.2
}
```

### Python Usage

```python
from backend.models.onepager import Spacing

# Create with defaults
spacing = Spacing()

# Create with tighter spacing
spacing = Spacing(section_gap="tight", padding_scale=0.8)

# Validation error for invalid literal
spacing = Spacing(section_gap="very-tight")  # Raises ValidationError
```

### Use Cases

- **Content-dense layouts**: Use `section_gap="tight"` and `padding_scale=0.7`
- **Minimal/modern designs**: Use `section_gap="loose"` and `padding_scale=1.5`
- **Standard designs**: Keep defaults

---

## 4. SectionLayout

**Purpose**: Define layout configuration for individual sections

### Fields

| Field | Type | Default | Options | Description |
|-------|------|---------|---------|-------------|
| `columns` | `Literal` | `1` | `1`, `2`, `3` | Number of columns |
| `alignment` | `Literal` | `"left"` | `"left"`, `"center"`, `"right"` | Content alignment |
| `image_position` | `Optional[Literal]` | `"top"` | `"top"`, `"left"`, `"right"`, `"none"`, `None` | Image placement |

### Validation Rules

- **columns**: Must be `1`, `2`, or `3` (no 4+ column layouts)
- **alignment**: Must be one of the three alignment options
- **image_position**: Optional field, can be `None`

### JSON Example

```json
{
  "columns": 2,
  "alignment": "left",
  "image_position": "top"
}
```

### Python Usage

```python
from backend.models.onepager import SectionLayout

# Create with defaults
layout = SectionLayout()

# Create 3-column layout with center alignment
layout = SectionLayout(
    columns=3,
    alignment="center",
    image_position="none"
)

# Validation error for invalid columns
layout = SectionLayout(columns=4)  # Raises ValidationError
```

### Layout Examples

#### 1-Column Layout
```
┌──────────────────────────────┐
│ Feature 1                    │
│ Feature 2                    │
│ Feature 3                    │
└──────────────────────────────┘
```

#### 2-Column Layout
```
┌──────────────┬───────────────┐
│ Feature 1    │ Feature 2     │
├──────────────┼───────────────┤
│ Feature 3    │ Feature 4     │
└──────────────┴───────────────┘
```

#### 3-Column Layout
```
┌─────────┬─────────┬─────────┐
│Feature 1│Feature 2│Feature 3│
└─────────┴─────────┴─────────┘
```

---

## 5. LayoutParams

**Purpose**: Complete layout parameter configuration container

### Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `color_scheme` | `ColorScheme` | `ColorScheme()` | Color palette configuration |
| `typography` | `Typography` | `Typography()` | Typography scaling configuration |
| `spacing` | `Spacing` | `Spacing()` | Spacing and padding configuration |
| `section_layouts` | `Dict[str, SectionLayout]` | `{}` | Per-section layout configuration |

### JSON Example (Complete)

```json
{
  "color_scheme": {
    "primary": "#1568B8",
    "secondary": "#864CBD",
    "accent": "#FF6B6B",
    "text_primary": "#1A202C",
    "background": "#FFFFFF"
  },
  "typography": {
    "heading_font": "Inter",
    "body_font": "Inter",
    "h1_scale": 1.2,
    "h2_scale": 1.0,
    "body_scale": 1.0,
    "line_height_scale": 1.1
  },
  "spacing": {
    "section_gap": "normal",
    "padding_scale": 1.0
  },
  "section_layouts": {
    "features": {
      "columns": 2,
      "alignment": "left",
      "image_position": "top"
    },
    "benefits": {
      "columns": 1,
      "alignment": "center",
      "image_position": "none"
    }
  }
}
```

### Python Usage

```python
from backend.models.onepager import LayoutParams, get_default_layout_params

# Create with all defaults
params = LayoutParams()

# Get default params with preset section layouts
params = get_default_layout_params()

# Create custom params
params = LayoutParams(
    color_scheme=ColorScheme(primary="#FF5733"),
    typography=Typography(h1_scale=1.3),
    spacing=Spacing(section_gap="loose"),
    section_layouts={
        "hero": SectionLayout(columns=1, alignment="center"),
        "features": SectionLayout(columns=3, alignment="left")
    }
)
```

---

## Helper Functions

### 1. `get_default_layout_params()`

**Signature**: `() -> LayoutParams`

**Purpose**: Get default layout parameters with preset section layouts

**Returns**: LayoutParams instance with:
- Default color scheme
- Default typography
- Default spacing
- 3 preset section layouts: features (2 columns), benefits (1 column), integrations (3 columns)

**Usage**:
```python
params = get_default_layout_params()
# Use for new onepagers without custom layout
```

---

### 2. `validate_layout_params()`

**Signature**: `(data: Dict[str, Any]) -> Optional[LayoutParams]`

**Purpose**: Validate layout parameters data and return instance if valid

**Parameters**:
- `data`: Dictionary containing layout parameter data (from API request)

**Returns**:
- `LayoutParams` instance if validation succeeds
- `None` if validation fails (instead of raising exception)

**Usage**:
```python
# In API endpoint
user_data = request.json.get("layout_params", {})
validated_params = validate_layout_params(user_data)

if validated_params:
    # Use validated params
    onepager.layout_params = validated_params
else:
    # Return validation error to user
    return {"error": "Invalid layout parameters"}
```

---

### 3. `merge_layout_params()`

**Signature**: `(base: Optional[LayoutParams], updates: Optional[Dict[str, Any]]) -> LayoutParams`

**Purpose**: Merge user layout parameter updates with base parameters

**Parameters**:
- `base`: Base LayoutParams (defaults to `get_default_layout_params()` if None)
- `updates`: Dictionary of user updates to apply

**Returns**: New LayoutParams instance with merged values

**Merge Behavior**:
- **Nested dicts**: Deep merge (preserves sibling fields)
- **Scalar values**: Replace
- **Validation**: If merged params are invalid, returns base unchanged

**Usage**:
```python
# User wants to change only section_gap
base = onepager.layout_params or get_default_layout_params()
updates = {"spacing": {"section_gap": "loose"}}
merged = merge_layout_params(base, updates)

# Result: All fields from base preserved, except section_gap is now "loose"
```

**Example**:
```python
base = LayoutParams(
    spacing=Spacing(section_gap="tight", padding_scale=0.8),
    typography=Typography(h1_scale=1.2)
)

updates = {
    "spacing": {
        "section_gap": "loose"  # Only update this
    }
}

merged = merge_layout_params(base, updates)
# merged.spacing.section_gap == "loose"
# merged.spacing.padding_scale == 0.8  (preserved)
# merged.typography.h1_scale == 1.2    (preserved)
```

---

## Database Integration

### OnePager Document Schema (MongoDB)

```javascript
{
  "_id": ObjectId("..."),
  "user_id": ObjectId("..."),
  "title": "My One-Pager",
  "content": { /* existing content fields */ },

  // NEW FIELDS (Optional, backward compatible)
  "layout_params": {
    "color_scheme": { /* ColorScheme object */ },
    "typography": { /* Typography object */ },
    "spacing": { /* Spacing object */ },
    "section_layouts": { /* Dict of SectionLayout objects */ }
  },
  "design_rationale": "AI decided to use loose spacing because...",

  "created_at": ISODate("..."),
  "updated_at": ISODate("...")
}
```

### Migration

Run migration to add `layout_params` to existing OnePagers:

```bash
# Check migration status
python backend/scripts/migrate_layout_params.py status

# Run migration
python backend/scripts/migrate_layout_params.py

# Rollback (if needed)
python backend/scripts/migrate_layout_params.py rollback
```

---

## API Integration (Planned for Day 2-3)

### 1. Create OnePager with Layout Params

**POST** `/api/v1/onepagers`

Request body:
```json
{
  "title": "My One-Pager",
  "problem": "...",
  "solution": "...",
  "layout_params": {
    "spacing": {"section_gap": "loose"}
  }
}
```

Backend behavior:
```python
# Merge user params with defaults
user_params = request_data.get("layout_params", {})
layout_params = merge_layout_params(None, user_params)
```

---

### 2. Update Layout Params

**PATCH** `/api/v1/onepagers/{id}/layout`

Request body:
```json
{
  "layout_params": {
    "typography": {"h1_scale": 1.3}
  },
  "design_rationale": "User requested larger headings for emphasis"
}
```

Backend behavior:
```python
# Merge with existing params
current = onepager.layout_params or get_default_layout_params()
updated = merge_layout_params(current, request_data["layout_params"])
```

---

### 3. AI Layout Suggestion

**POST** `/api/v1/onepagers/{id}/suggest-layout`

Request body:
```json
{
  "feedback": "Make it more compact"
}
```

Response:
```json
{
  "suggested_params": {
    "spacing": {"section_gap": "tight", "padding_scale": 0.8}
  },
  "rationale": "Based on your feedback for compactness, I recommend tight spacing and reduced padding."
}
```

AI does NOT auto-apply. User must explicitly accept.

---

## Testing

### Run Unit Tests

```bash
# Run all LayoutParams tests
pytest tests/models/test_layout_params.py -v

# Run specific test class
pytest tests/models/test_layout_params.py::TestColorScheme -v

# Run with coverage
pytest tests/models/test_layout_params.py --cov=backend.models.onepager
```

### Test Coverage

**Current**: 81 tests covering:
- ✅ All default values
- ✅ All validation ranges
- ✅ Invalid input rejection
- ✅ JSON serialization roundtrip
- ✅ Helper function behavior
- ✅ Edge cases (None, empty dict, invalid merge)

---

## Usage Examples

### Example 1: Content-Heavy One-Pager

```python
params = LayoutParams(
    typography=Typography(
        h1_scale=0.9,
        body_scale=0.85,
        line_height_scale=0.9
    ),
    spacing=Spacing(
        section_gap="tight",
        padding_scale=0.7
    ),
    section_layouts={
        "features": SectionLayout(columns=3, alignment="left"),
        "benefits": SectionLayout(columns=2, alignment="left")
    }
)
```

**Result**: Smaller text, tighter spacing, more columns → fits more content

---

### Example 2: Bold Marketing One-Pager

```python
params = LayoutParams(
    color_scheme=ColorScheme(
        primary="#FF5733",
        accent="#FFC300"
    ),
    typography=Typography(
        heading_font="Montserrat",
        h1_scale=1.4,
        h2_scale=1.2
    ),
    spacing=Spacing(
        section_gap="loose",
        padding_scale=1.5
    ),
    section_layouts={
        "hero": SectionLayout(columns=1, alignment="center"),
        "features": SectionLayout(columns=2, alignment="center")
    }
)
```

**Result**: Vibrant colors, large headings, generous spacing → bold visual impact

---

### Example 3: Minimal Professional One-Pager

```python
params = LayoutParams(
    color_scheme=ColorScheme(
        primary="#2C3E50",
        secondary="#34495E",
        background="#ECF0F1"
    ),
    typography=Typography(
        heading_font="Inter",
        body_font="Inter",
        line_height_scale=1.3
    ),
    spacing=Spacing(
        section_gap="normal",
        padding_scale=1.2
    ),
    section_layouts={
        "features": SectionLayout(columns=1, alignment="left")
    }
)
```

**Result**: Muted colors, clean typography, readable spacing → professional appearance

---

## AI Prompt Integration (Day 2)

### AI System Prompt (Excerpt)

```
You are a professional one-pager designer. When suggesting layout changes:

1. Analyze content characteristics:
   - Number of features/benefits (affects column count)
   - Text length (affects font size)
   - Visual density preference (affects spacing)

2. Suggest LayoutParams adjustments:
   - spacing.section_gap: "tight" for dense content, "loose" for minimal designs
   - typography.h1_scale: 1.2-1.4 for marketing, 0.9-1.0 for data-heavy
   - section_layouts.columns: 1 for long text, 2-3 for bullet points

3. Provide design_rationale explaining your decisions

4. NEVER auto-apply. Always return suggestions for user approval.
```

---

## Troubleshooting

### Issue: ValidationError on color scheme

**Cause**: Color not in `#RRGGBB` format

**Fix**:
```python
# Wrong
ColorScheme(primary="FF0000")

# Right
ColorScheme(primary="#FF0000")
```

---

### Issue: ValidationError on h1_scale

**Cause**: Value outside `0.8 - 1.5` range

**Fix**:
```python
# Wrong
Typography(h1_scale=2.0)

# Right
Typography(h1_scale=1.4)
```

---

### Issue: Merge not preserving sibling fields

**Cause**: Using dict assignment instead of `merge_layout_params()`

**Fix**:
```python
# Wrong (overwrites entire spacing object)
params.spacing = {"section_gap": "loose"}

# Right (preserves padding_scale)
merged = merge_layout_params(params, {
    "spacing": {"section_gap": "loose"}
})
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2025-01-18 | Initial schema documentation |

---

## Related Documentation

- **Development Plan**: `docs/layout-iteration/DEV_PLAN.md`
- **Migration Script**: `backend/scripts/migrate_layout_params.py`
- **Unit Tests**: `tests/models/test_layout_params.py`
- **Data Models**: `backend/models/onepager.py` (lines 215-503)

---

**Last Updated**: 2025-01-18
**Author**: Anthony + Claude AI
