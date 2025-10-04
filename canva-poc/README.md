# Canva API Proof-of-Concept

This directory contains a standalone proof-of-concept for integrating with Canva's Connect APIs to create and export marketing one-pagers programmatically. This is a critical validation step for our AI-powered marketing one-pager co-creation tool.

## 🎯 Objective

Prove that we can:
1. **Create designs programmatically** using Canva's Connect API from JSON layout specifications
2. **Export high-quality PDFs** suitable for professional marketing materials
3. **Handle API limitations** including rate limits, error handling, and performance constraints
4. **Validate technical feasibility** for our production architecture

## 🏗️ Architecture

```
canva-poc/
├── canva_client.py      # Core Canva API client with authentication & error handling
├── json_schema.py       # JSON schema definitions for one-pager layouts  
├── design_converter.py  # Converts our JSON format to Canva design specs
├── test_canva_api.py    # End-to-end test script
├── setup.py            # Environment setup and connection testing
├── requirements.txt    # Python dependencies
├── .env               # Environment variables (create from .env.example)
└── outputs/           # Generated PDFs and test results
```

## 🚀 Quick Start

### Prerequisites

1. **Canva Developer Account**: Create an app at [Canva Developers](https://www.canva.com/developers/apps)
2. **Python 3.8+**: Ensure Python is installed on your system
3. **API Access Token**: Get your Canva Connect API token from your app dashboard

### Setup Process

1. **Install Dependencies**:
   ```bash
   cd canva-poc
   pip install -r requirements.txt
   ```

2. **Configure Environment**:
   ```bash
   python setup.py
   ```
   This interactive script will:
   - Install required Python packages
   - Prompt for your Canva API token
   - Create the `.env` configuration file
   - Test your API connection

3. **Run the Proof-of-Concept**:
   ```bash
   python test_canva_api.py
   ```

## 📋 Test Scenarios

Our proof-of-concept validates three key marketing one-pager layouts:

### 1. Simple Layout (Minimal Viable Product)
- Header with company logo and tagline
- Hero section with primary message
- Single call-to-action button
- Footer with contact information

### 2. Feature-Rich Layout (Standard Marketing Page)
- Hero section with background image
- Features grid (3-column layout)
- Customer testimonials section
- Multiple CTAs (primary and secondary)
- Social proof elements

### 3. Complex Layout (Advanced Marketing Collateral)
- Multi-section design with varied layouts
- Image galleries and carousels
- Interactive elements (buttons, forms)
- Brand-consistent styling throughout
- Professional typography and spacing

## 🔧 Configuration

### Environment Variables

```bash
# Required
CANVA_API_TOKEN=your_access_token_here

# Optional (with defaults)
CANVA_API_BASE_URL=https://api.canva.com/rest/v1
CANVA_RATE_LIMIT_REQUESTS=100
CANVA_RATE_LIMIT_PERIOD=3600
LOG_LEVEL=INFO
LOG_FILE=canva_poc.log
```

### API Rate Limits

The Canva API has rate limits that we respect:
- **Default**: 100 requests per hour
- **Burst**: Short bursts of higher activity allowed
- **Export Jobs**: Async operations don't count against rate limits
- **Retry Logic**: Automatic exponential backoff for rate limit errors

## 📊 Success Metrics

### Technical Validation ✅
- [ ] Authentication successful with provided API token
- [ ] Design creation from JSON input (all 3 test cases)
- [ ] PDF export completes without errors
- [ ] Export quality meets professional standards (300+ DPI)
- [ ] End-to-end workflow under 30 seconds per design

### Quality Validation ✅
- [ ] Text rendering: Clear, properly formatted typography
- [ ] Image handling: Placeholders and uploaded images display correctly
- [ ] Layout accuracy: JSON positioning translates to visual design
- [ ] Brand consistency: Colors, fonts, and styling applied correctly
- [ ] Export fidelity: PDF matches design preview quality

### Performance Validation ✅
- [ ] API response times under 3 seconds per request
- [ ] Export generation completes within 15 seconds
- [ ] File sizes appropriate for web sharing (under 5MB)
- [ ] Error handling gracefully manages API failures
- [ ] Rate limiting doesn't block normal usage patterns

## 🛠️ API Integration Details

### Core Client Features

```python
from canva_client import CanvaClient

# Initialize client
client = CanvaClient(api_token="your_token")

# Create design from our JSON schema
design = client.create_design(design_data)

# Export to PDF
export_job = client.export_design(design.id, format_type='pdf')

# Wait for completion and download
completed_export = client.wait_for_export(export_job.job_id)
pdf_path = client.download_file(completed_export.download_url, 'output.pdf')
```

### Error Handling Strategy

```python
try:
    # API operations
    design = client.create_design(design_data)
except CanvaAuthError:
    # Handle authentication issues
    print("Check your API token")
except CanvaRateLimitError:
    # Handle rate limiting
    print("Waiting for rate limit reset...")
    time.sleep(60)
except CanvaAPIError as e:
    # Handle other API errors
    print(f"API error: {e.message}")
```

## 📝 JSON Schema Design

Our JSON schema maps marketing one-pager concepts to Canva design elements:

```json
{
  "title": "Product Launch One-Pager",
  "type": "presentation",
  "dimensions": {
    "width": 1080,
    "height": 1920
  },
  "elements": [
    {
      "type": "header",
      "content": {
        "title": "Revolutionary Product Launch",
        "subtitle": "Transform your workflow today"
      },
      "styling": {
        "backgroundColor": "#0ea5e9",
        "textColor": "#ffffff",
        "font": "Montserrat"
      }
    },
    {
      "type": "hero",
      "content": {
        "headline": "Meet the Future",
        "description": "Our innovative solution solves your biggest challenges",
        "image": "placeholder-hero.jpg"
      }
    },
    {
      "type": "cta",
      "content": {
        "text": "Start Free Trial",
        "url": "https://example.com/signup"
      },
      "styling": {
        "buttonColor": "#10b981",
        "textColor": "#ffffff"
      }
    }
  ]
}
```

## 🔍 Testing & Validation

### Manual Testing Checklist

1. **Authentication**:
   - [ ] Valid token authenticates successfully
   - [ ] Invalid token returns appropriate error
   - [ ] Token expiration handled gracefully

2. **Design Creation**:
   - [ ] Simple JSON creates basic design
   - [ ] Complex JSON handles multiple elements
   - [ ] Invalid JSON returns validation errors
   - [ ] Design preview URL accessible

3. **PDF Export**:
   - [ ] Export job initiates successfully  
   - [ ] Status polling works correctly
   - [ ] Download URL becomes available
   - [ ] PDF file downloads completely
   - [ ] PDF quality meets requirements

4. **Error Scenarios**:
   - [ ] Network failures handled with retries
   - [ ] Rate limits trigger appropriate delays
   - [ ] Malformed requests return clear errors
   - [ ] Timeouts handled gracefully

### Automated Tests

Run the comprehensive test suite:

```bash
python -m pytest tests/ -v
```

## 📈 Performance Benchmarks

Expected performance characteristics:

| Operation | Target Time | Acceptable Range |
|-----------|-------------|------------------|
| Authentication | < 1s | 0.5-2s |
| Design Creation | < 3s | 1-5s |
| Export Initiation | < 2s | 1-4s |
| PDF Generation | < 15s | 5-30s |
| File Download | < 5s | 2-10s |
| **Total Workflow** | **< 25s** | **10-45s** |

## 🔄 Iteration & Feedback

### Success Criteria for Production Go-Ahead

✅ **GO Decision**: All core functionality works, quality acceptable, costs reasonable  
❌ **NO-GO Decision**: Critical limitations require architectural changes

### Alternative Approaches (If Needed)

1. **HTML/CSS to PDF**: Use Puppeteer or similar for custom rendering
2. **Figma API**: Alternative design tool integration
3. **Template-Based**: Pre-built templates with parameter substitution
4. **Hybrid Approach**: Canva for design, custom export pipeline

## 📞 Support & Troubleshooting

### Common Issues

**Authentication Fails**:
- Verify API token is correct and not expired
- Check that your Canva app has appropriate permissions
- Ensure you're using the production API endpoint

**Export Quality Poor**:
- Try different export settings (quality, format)
- Verify design elements are high-resolution
- Check Canva's export limitations for your plan type

**Rate Limits Hit**:
- Reduce request frequency
- Implement proper retry logic with exponential backoff
- Consider Canva Enterprise plan for higher limits

### Useful Resources

- [Canva Connect API Documentation](https://www.canva.dev/docs/connect/)
- [Canva API Reference](https://www.canva.dev/docs/connect/api-reference/)
- [Developer Community](https://community.canva.dev/)
- [Rate Limiting Guide](https://www.canva.dev/docs/connect/rate-limiting/)

## 🚀 Next Steps

After successful proof-of-concept validation:

1. **Integration Planning**: Design backend API architecture incorporating Canva
2. **Frontend Interface**: Build UI components for design preview and export
3. **Brand Kit Integration**: Map user brand profiles to Canva design elements
4. **Production Deployment**: Scale-ready error handling and monitoring
5. **User Testing**: Validate workflow with actual marketing professionals

---

**Last Updated**: October 4, 2025  
**Status**: Ready for testing  
**Contact**: Development Team