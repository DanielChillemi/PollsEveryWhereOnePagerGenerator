# Quick Start Guide - Brand Kits & One-Pagers API

## 🚀 Getting Started

### 1. Set Up Environment

```bash
# Add to .env file
OPENAI_API_KEY=your_api_key_here
AI_MODEL_NAME=gpt-4-turbo-preview  # or gpt-3.5-turbo for faster/cheaper
```

Get API key at: https://platform.openai.com/api-keys

### 2. Start Server

```bash
# From project root
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
uvicorn backend.main:app --reload --port 8000
```

### 3. Run Tests

```bash
pip install colorama  # For colored output
python test_brand_kits_and_onepagers.py
```

---

## 📡 API Endpoints

**Base URL**: `http://localhost:8000/api/v1`

### Authentication (Already Implemented)

```bash
# Signup
POST /auth/signup
{
  "email": "user@example.com",
  "password": "Password123!",
  "full_name": "John Doe"
}

# Login
POST /auth/login
FormData: username=user@example.com&password=Password123!

# Get Profile
GET /auth/me
Headers: Authorization: Bearer <token>
```

### Brand Kits (NEW)

```bash
# Create Brand Kit
POST /brand-kits
Headers: Authorization: Bearer <token>
{
  "company_name": "My Company",
  "color_palette": {
    "primary": "#007ACC",
    "secondary": "#864CBD",
    "accent": "#FF6B6B"
  },
  "typography": {
    "heading_font": "Montserrat",
    "body_font": "Open Sans"
  }
}

# Get My Brand Kit
GET /brand-kits/me
Headers: Authorization: Bearer <token>

# Update Brand Kit
PUT /brand-kits/{id}
Headers: Authorization: Bearer <token>
{
  "company_name": "Updated Name"
}

# Delete Brand Kit
DELETE /brand-kits/{id}
Headers: Authorization: Bearer <token>
```

### One-Pagers (NEW)

```bash
# Create One-Pager (AI-Generated)
POST /onepagers
Headers: Authorization: Bearer <token>
{
  "title": "Product Launch",
  "input_prompt": "Create a one-pager for a new SaaS tool...",
  "brand_kit_id": "optional_id",
  "target_audience": "Small businesses"
}

# List One-Pagers
GET /onepagers?limit=20&status=wireframe
Headers: Authorization: Bearer <token>

# Get One-Pager
GET /onepagers/{id}
Headers: Authorization: Bearer <token>

# Iterate/Refine (AI-Powered)
PUT /onepagers/{id}/iterate
Headers: Authorization: Bearer <token>
{
  "feedback": "Make the headline shorter",
  "apply_brand_styles": false
}

# Delete One-Pager
DELETE /onepagers/{id}
Headers: Authorization: Bearer <token>
```

---

## 🔄 Typical Workflow

```bash
# 1. Create user account
POST /auth/signup

# 2. Login and get token
POST /auth/login

# 3. Create brand kit
POST /brand-kits

# 4. Create one-pager (AI generates wireframe)
POST /onepagers

# 5. Refine with feedback (AI improves layout)
PUT /onepagers/{id}/iterate

# 6. Apply brand styles
PUT /onepagers/{id}/iterate
{
  "apply_brand_styles": true
}

# 7. Export (coming soon)
```

---

## 📊 Interactive API Docs

**Swagger UI**: http://localhost:8000/docs
**ReDoc**: http://localhost:8000/redoc

---

## 🧪 Example cURL Commands

```bash
# 1. Signup
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","full_name":"Test User"}'

# 2. Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -d "username=test@example.com&password=Test123!"

# 3. Create Brand Kit (save the token from login)
curl -X POST http://localhost:8000/api/v1/brand-kits \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Test Company",
    "color_palette": {
      "primary": "#007ACC",
      "secondary": "#864CBD",
      "accent": "#FF6B6B"
    }
  }'

# 4. Create One-Pager with AI
curl -X POST http://localhost:8000/api/v1/onepagers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Product Launch",
    "input_prompt": "Create a marketing one-pager for a new project management SaaS"
  }'
```

---

## ⚡ Quick Tips

1. **Get Token**: Use `/auth/login` first, copy `access_token` from response
2. **AI Timeout**: One-pager creation takes 10-30 seconds (AI generation)
3. **Test Mode**: Use `test_brand_kits_and_onepagers.py` for automated testing
4. **Docs**: Visit `/docs` for interactive testing with built-in auth
5. **Fallback**: AI fails gracefully - you'll still get a basic wireframe

---

## 🐛 Troubleshooting

**"AI API error"**:
- Check `OPENAI_API_KEY` in `.env`
- Verify API key at https://platform.openai.com/api-keys
- Check OpenAI API status: https://status.openai.com
- Verify account has credits/billing enabled

**"Database not connected"**:
- Ensure MongoDB is running
- Check `MONGODB_URL` in `.env`

**"Unauthorized"**:
- Include `Authorization: Bearer <token>` header
- Token expires after 30 minutes - login again

---

## 📚 Documentation

- **Full Implementation Guide**: `DB_AND_API_IMPLEMENTATION.md`
- **Backend Guide**: `docs/BACKEND_IMPLEMENTATION.md`
- **Main README**: `README.md`

---

**Quick Start Complete!** 🎉

Visit http://localhost:8000/docs to explore the API interactively.
