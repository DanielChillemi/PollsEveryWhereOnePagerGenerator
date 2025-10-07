# PDF Export System - Quick Start Guide

## 🚀 What Was Built

We've successfully implemented an **in-house PDF export system** that eliminates the need for Canva Enterprise API ($150-200/month) while providing:

- ✅ **Full customization control** over layouts and styling
- ✅ **Automatic Brand Kit integration** (colors, fonts, logos)
- ✅ **Print-quality PDFs** with selectable text
- ✅ **Multiple formats**: US Letter, A4, Tabloid
- ✅ **Sub-2 second generation time**
- ✅ **Zero API costs**

## 📁 Files Created

### Core Services
- `backend/services/pdf_html_generator.py` - Converts OnePagerLayout + Brand Kit to styled HTML
- `backend/services/pdf_generator.py` - Converts HTML to PDF using Puppeteer

### Templates (Jinja2)
- `backend/templates/pdf/onepager_base.html` - Base template with Brand Kit CSS
- `backend/templates/pdf/sections/*.html` - 8 section templates (hero, features, CTA, etc.)

### Testing & Documentation
- `backend/scripts/test_pdf_generation.py` - POC validation script (✅ passed in 1.76s)
- `docs/PDF_EXPORT_PHASE_1_COMPLETE.md` - Comprehensive implementation summary

### API Changes
- Extended `backend/onepagers/routes.py` with `GET /onepagers/{id}/export/pdf` endpoint
- Updated `backend/main.py` with PDF export documentation

## 🎯 How to Use

### 1. Test the POC Script

```bash
python backend/scripts/test_pdf_generation.py
```

**Expected Output**:
```
✅ POC SUCCESSFUL - Completed in 1.76 seconds
📁 View your PDF: backend/output/poc-test.pdf
```

### 2. Use the API Endpoint

**Endpoint**: `GET /api/v1/onepagers/{id}/export/pdf?format=letter|a4|tabloid`

**Example with cURL**:
```bash
curl -X GET \
  'http://localhost:8000/api/v1/onepagers/YOUR_ONEPAGER_ID/export/pdf?format=letter' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  --output my_onepager.pdf
```

**Example with Python**:
```python
import requests

response = requests.get(
    f'http://localhost:8000/api/v1/onepagers/{onepager_id}/export/pdf',
    params={'format': 'a4'},
    headers={'Authorization': f'Bearer {access_token}'}
)

with open('onepager.pdf', 'wb') as f:
    f.write(response.content)
```

### 3. Start the Backend Server

```bash
# Activate virtual environment (if not already active)
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS/Linux

# Start FastAPI server
python -m backend.main
```

Server will be available at: http://localhost:8000

### 4. View API Documentation

Visit: http://localhost:8000/docs

Look for the new endpoint:
- `GET /api/v1/onepagers/{onepager_id}/export/pdf`

## 📊 Performance Benchmarks

| Metric | Value |
|--------|-------|
| POC Generation Time | 1.76s |
| POC File Size | 227.9 KB |
| Chromium Download (first run) | ~3 seconds |
| Font Loading Wait | 1 second |

## 🔧 Troubleshooting

### Issue: "Chromium not found"
**Solution**:
```bash
python -m pyppeteer install
```

### Issue: "Fonts not rendering"
**Solution**: Increase wait time in `backend/services/pdf_generator.py`:
```python
await asyncio.sleep(2)  # Changed from 1
```

### Issue: "Import errors"
**Solution**: Reinstall dependencies:
```bash
pip install -r requirements.txt
```

## 🎨 Customization

### Modify Templates

Edit Jinja2 templates in `backend/templates/pdf/`:
- Change layouts in `onepager_base.html`
- Customize sections in `sections/*.html`
- Adjust CSS variables for styling

### Add Custom Fonts

Update template to include additional Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;700&display=swap" rel="stylesheet">
```

### Change Default Brand Kit

Modify fallback in `backend/onepagers/routes.py`:
```python
brand_kit_doc = {
    "company_name": "Your Company",
    "color_palette": {
        "primary": "#YOUR_COLOR",
        # ...
    }
}
```

## 📈 Next Steps

### Phase 2: Visual Enhancements
- [ ] SVG logo embedding
- [ ] Image optimization
- [ ] Watermark support
- [ ] Advanced typography controls

### Phase 3: React-PDF Migration
- [ ] Create parallel React-PDF service
- [ ] 10x performance improvement
- [ ] Digital signatures
- [ ] Enterprise features

See `docs/PDF_EXPORT_PHASE_1_COMPLETE.md` for full roadmap.

## 🤝 Integration with Frontend

### React Component Example

```tsx
import { useState } from 'react';

export function PDFExportButton({ onepagerId }: { onepagerId: string }) {
  const [loading, setLoading] = useState(false);
  
  const handleExport = async (format: 'letter' | 'a4' | 'tabloid') => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/v1/onepagers/${onepagerId}/export/pdf?format=${format}`,
        {
          headers: {
            'Authorization': `Bearer ${getAccessToken()}`
          }
        }
      );
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `onepager-${format}.pdf`;
      a.click();
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Menu>
      <MenuButton as={Button} isLoading={loading}>
        Export PDF 📄
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => handleExport('letter')}>
          US Letter (8.5×11")
        </MenuItem>
        <MenuItem onClick={() => handleExport('a4')}>
          A4 (8.27×11.69")
        </MenuItem>
        <MenuItem onClick={() => handleExport('tabloid')}>
          Tabloid (11×17")
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
```

## 💡 Key Benefits

1. **Cost Savings**: $1,800-2,900/year eliminated
2. **Strategic Control**: No dependency on external APIs
3. **Customization**: Full control over rendering
4. **Performance**: <2 second generation time
5. **Quality**: Print-ready PDFs with selectable text
6. **Scalability**: Async/await for concurrent requests

## 📞 Support

For issues or questions:
1. Check `docs/PDF_EXPORT_PHASE_1_COMPLETE.md` for detailed documentation
2. Review POC script output for validation
3. Enable debug logging: `logging.basicConfig(level=logging.DEBUG)`
4. Test HTML generation separately before PDF conversion

## ✅ Status

- **Branch**: `feature/pdf-export-system`
- **Status**: ✅ Phase 1 Complete
- **Ready for**: Merge to `main` and deployment
- **Tests**: POC validation passed ✅

---

**Last Updated**: October 6, 2025  
**Version**: 1.0.0
