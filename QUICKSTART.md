# Quick Start Guide - Authentication Backend

## Prerequisites

### 1. Install MongoDB

You have two options:

#### Option A: Local MongoDB (Recommended for Development)
```powershell
# Download MongoDB Community Server from:
# https://www.mongodb.com/try/download/community

# Or use Chocolatey:
choco install mongodb

# Start MongoDB service:
net start MongoDB

# MongoDB will run on: mongodb://localhost:27017
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a free cluster
4. Get connection string
5. Update `.env` with your Atlas connection string:
   ```
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

## Setup Steps

### 1. Verify Python Environment
```powershell
# Activate virtual environment (if not already activated)
.\.venv\Scripts\Activate.ps1

# Verify dependencies installed
python -m pip list | Select-String "fastapi|motor|passlib"
```

### 2. Configure Environment Variables
```powershell
# Edit .env file with your settings
notepad .env
```

**Important:** Update these values in `.env`:
```env
# Generate secure secrets using:
# python -c "import secrets; print(secrets.token_urlsafe(32))"

JWT_SECRET_KEY=<generate-new-secret-here>
JWT_REFRESH_SECRET_KEY=<generate-new-secret-here>

# MongoDB connection (local or Atlas)
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=marketing_onepager
```

### 3. Start the Server
```powershell
# From project root directory
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Server will start at: http://localhost:8000

### 4. Test the API

#### Option A: Using the Interactive Docs
Open in browser: http://localhost:8000/docs

#### Option B: Using PowerShell (curl)
```powershell
# 1. Health check
curl http://localhost:8000/health

# 2. Register new user
curl -X POST http://localhost:8000/api/v1/auth/signup `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"SecurePass123!\",\"full_name\":\"Test User\"}'

# 3. Login
curl -X POST http://localhost:8000/api/v1/auth/login `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "username=test@example.com&password=SecurePass123!"

# 4. Get profile (replace TOKEN with access_token from login response)
curl http://localhost:8000/api/v1/auth/me `
  -H "Authorization: Bearer TOKEN"
```

#### Option C: Using Python Test Script
```powershell
python test_auth_flow.py
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login and get tokens
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user profile

### System
- `GET /` - API information
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation
- `GET /redoc` - Alternative API documentation

## Project Structure

```
backend/
├── __init__.py
├── main.py                 # FastAPI application entry point
├── config.py              # Environment configuration
├── auth/
│   ├── __init__.py
│   ├── routes.py          # Authentication endpoints
│   ├── schemas.py         # Request/response models
│   ├── dependencies.py    # JWT validation dependencies
│   └── utils.py           # Password hashing, JWT utils
├── models/
│   ├── __init__.py
│   └── user.py            # User data models
├── database/
│   ├── __init__.py
│   └── mongodb.py         # MongoDB connection manager
└── integrations/
    ├── __init__.py
    └── canva/
        ├── __init__.py
        └── canva_client.py  # Canva API client (from POC)
```

## Troubleshooting

### MongoDB Connection Issues
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# Start MongoDB service if stopped
net start MongoDB

# Check MongoDB logs
Get-Content "C:\Program Files\MongoDB\Server\7.0\log\mongod.log" -Tail 50
```

### Port Already in Use
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use different port
python -m uvicorn backend.main:app --reload --port 8001
```

### Import Errors
```powershell
# Ensure you're running from project root
cd C:\Users\josue\Documents\Builds\marketing-one-pager

# Reinstall dependencies if needed
pip install -r requirements.txt
```

## Next Steps

1. ✅ **Authentication Working** - You can now signup, login, and access protected routes
2. 🎨 **Brand Kit Module** - Next phase: implement Brand Kit CRUD operations
3. 🤖 **AI Integration** - Integrate Google Gemini for content generation
4. 🖼️ **Canva Export** - Connect authenticated users with Canva API
5. 🎯 **One-Pager Workflow** - Build iterative co-creation workflow

## Development Tips

### Auto-reload on Code Changes
The `--reload` flag automatically restarts the server when code changes.

### Debug Mode
Set `LOG_LEVEL=DEBUG` in `.env` for detailed logging.

### Database GUI
Use MongoDB Compass to view database: https://www.mongodb.com/products/compass

### API Testing Tools
- **Swagger UI**: http://localhost:8000/docs (built-in)
- **Postman**: Import OpenAPI schema from /openapi.json
- **Thunder Client**: VS Code extension
- **HTTPie**: `pip install httpie` then `http :8000/health`

## Security Notes

⚠️ **Important for Production:**
- Change JWT secrets to strong random values
- Use HTTPS only (never HTTP in production)
- Set `API_ENV=production` in production
- Use strong passwords (enforce in frontend)
- Enable rate limiting
- Monitor for suspicious activity
- Keep dependencies updated

## Support

- **Backend Code**: `backend/` directory
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **MongoDB Logs**: Check server logs for database issues
