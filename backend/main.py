"""
Marketing One-Pager Co-Creation Tool - FastAPI Backend
=======================================================

Main application entry point.
Initializes FastAPI app, configures middleware, and mounts routes.
"""

import sys
import asyncio

# Fix for Python 3.13 + Playwright on Windows
# Python 3.13 changed subprocess handling, requiring ProactorEventLoop on Windows
if sys.platform == 'win32' and sys.version_info >= (3, 13):
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import time

from backend.config import settings
from backend.database.mongodb import MongoDB
from backend.auth.routes import router as auth_router
from backend.routes.export import router as export_router
from backend.brand_kits.routes import router as brand_kits_router
from backend.onepagers.routes import router as onepagers_router


# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    
    Handles startup and shutdown events:
    - Startup: Connect to MongoDB, create indexes
    - Shutdown: Close database connections gracefully
    """
    # Startup
    logger.info("🚀 Starting Marketing One-Pager Backend API")
    try:
        await MongoDB.connect_to_database()
        logger.info("✅ Database connected successfully")
    except Exception as e:
        logger.error(f"❌ Failed to connect to database: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down Marketing One-Pager Backend API")
    await MongoDB.close_database_connection()
    logger.info("✅ Database connection closed")


# Initialize FastAPI application
app = FastAPI(
    title="Marketing One-Pager Co-Creation API",
    description="""
    AI-powered marketing one-pager co-creation tool backend.
    
    ## Features
    - 🔐 JWT-based authentication
    - 👤 User management and profiles
    - 🎨 Brand Kit integration
    - 🤖 AI content generation
    - 📄 In-house PDF export with Brand Kit styling
    - �️ Print-quality PDFs (Letter, A4, Tabloid formats)
    
    ## Authentication
    Most endpoints require JWT authentication. Include the access token in requests:
    ```
    Authorization: Bearer <your_access_token>
    ```
    
    ## Getting Started
    1. Register a new account: `POST /api/v1/auth/signup`
    2. Login to get tokens: `POST /api/v1/auth/login`
    3. Use access token for protected endpoints
    4. Refresh token when expired: `POST /api/v1/auth/refresh`
    """,
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)


# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """
    Middleware to track request processing time.
    
    Adds X-Process-Time header to all responses showing
    how long the request took to process.
    """
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(round(process_time * 1000, 2)) + "ms"
    return response


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler for unhandled errors.
    
    Logs errors and returns consistent JSON error response.
    """
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "error_code": "INTERNAL_ERROR"
        }
    )


# Mount routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(brand_kits_router, prefix="/api/v1")
app.include_router(onepagers_router, prefix="/api/v1")
app.include_router(export_router)  # Export routes already include /api/export prefix


# Health check endpoint
@app.get("/health", tags=["System"])
async def health_check():
    """
    Health check endpoint.
    
    Returns API status and database connectivity.
    Useful for monitoring and deployment checks.
    """
    try:
        # Test database connection
        db = MongoDB.get_database()
        await db.command('ping')
        db_status = "connected"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        db_status = "disconnected"
    
    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "service": "Marketing One-Pager API",
        "version": "0.1.0",
        "database": db_status,
        "environment": settings.api_env
    }


# Root endpoint
@app.get("/", tags=["System"])
async def root():
    """
    Root endpoint with API information.
    
    Provides basic API details and links to documentation.
    """
    return {
        "message": "Marketing One-Pager Co-Creation API",
        "version": "0.2.0",
        "docs": "/docs",
        "health": "/health",
        "authentication": {
            "signup": "/api/v1/auth/signup",
            "login": "/api/v1/auth/login",
            "refresh": "/api/v1/auth/refresh",
            "profile": "/api/v1/auth/me"
        },
        "brand_kits": {
            "create": "/api/v1/brand-kits",
            "get_mine": "/api/v1/brand-kits/me",
            "get_by_id": "/api/v1/brand-kits/{id}",
            "update": "/api/v1/brand-kits/{id}",
            "delete": "/api/v1/brand-kits/{id}"
        },
        "onepagers": {
            "create": "/api/v1/onepagers",
            "list": "/api/v1/onepagers",
            "get": "/api/v1/onepagers/{id}",
            "iterate": "/api/v1/onepagers/{id}/iterate",
            "delete": "/api/v1/onepagers/{id}",
            "export_pdf": "/api/v1/onepagers/{id}/export/pdf?format=letter|a4|tabloid"
        },
        "features": {
            "pdf_export": "✅ In-house PDF generation with Brand Kit styling",
            "formats_supported": ["US Letter (8.5×11\")", "A4 (8.27×11.69\")", "Tabloid (11×17\")"],
            "pdf_features": ["Selectable text", "Google Fonts", "Brand colors", "Print-optimized"]
        }
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "backend.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=True,  # Auto-reload on code changes (development only)
        log_level=settings.log_level.lower()
    )
