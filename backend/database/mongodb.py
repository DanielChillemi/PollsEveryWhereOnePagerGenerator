"""
MongoDB Database Connection
============================

Motor async MongoDB client initialization and connection management.
Provides database access throughout the application.
"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
import logging

from backend.config import settings

logger = logging.getLogger(__name__)


class MongoDB:
    """
    MongoDB connection manager using Motor async driver.
    
    Provides singleton-like access to database connection
    throughout the application lifecycle.
    """
    
    client: Optional[AsyncIOMotorClient] = None
    database: Optional[AsyncIOMotorDatabase] = None
    
    @classmethod
    async def connect_to_database(cls) -> None:
        """
        Initialize MongoDB connection.
        
        Called during application startup to establish database connection.
        Creates indexes for optimal query performance.
        """
        try:
            logger.info(f"Connecting to MongoDB at {settings.mongodb_url}")
            cls.client = AsyncIOMotorClient(
                settings.mongodb_url,
                serverSelectionTimeoutMS=5000,  # 5 second timeout
                connectTimeoutMS=5000,
                maxPoolSize=10,
            )
            
            # Test connection
            await cls.client.admin.command('ping')
            
            cls.database = cls.client[settings.mongodb_db_name]
            logger.info(f"Successfully connected to MongoDB database: {settings.mongodb_db_name}")
            
            # Create indexes
            await cls._create_indexes()
            
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
    
    @classmethod
    async def _create_indexes(cls) -> None:
        """
        Create database indexes for optimal query performance.

        - Users: unique index on email
        - Brand Kits: indexes on user_id, is_active
        - One-Pagers: indexes on user_id, created_at, status
        """
        if cls.database is None:
            return

        try:
            # Users collection indexes
            users_collection = cls.database.users
            await users_collection.create_index("email", unique=True)
            logger.info("✅ Created unique index on users.email")

            # Brand Kits collection indexes
            brand_kits_collection = cls.database.brand_kits
            await brand_kits_collection.create_index("user_id")
            await brand_kits_collection.create_index("is_active")
            await brand_kits_collection.create_index([("user_id", 1), ("is_active", 1)])
            logger.info("✅ Created indexes on brand_kits (user_id, is_active)")

            # One-Pagers collection indexes
            onepagers_collection = cls.database.onepagers
            await onepagers_collection.create_index("user_id")
            await onepagers_collection.create_index([("created_at", -1)])  # Descending for recent-first
            await onepagers_collection.create_index("status")
            await onepagers_collection.create_index([("user_id", 1), ("status", 1)])
            await onepagers_collection.create_index([("user_id", 1), ("created_at", -1)])
            logger.info("✅ Created indexes on onepagers (user_id, created_at, status)")

        except Exception as e:
            logger.warning(f"⚠️ Error creating indexes: {e}")
    
    @classmethod
    async def close_database_connection(cls) -> None:
        """
        Close MongoDB connection.
        
        Called during application shutdown to gracefully close
        database connections.
        """
        if cls.client:
            logger.info("Closing MongoDB connection")
            cls.client.close()
            cls.client = None
            cls.database = None
    
    @classmethod
    def get_database(cls) -> AsyncIOMotorDatabase:
        """
        Get database instance.
        
        Returns:
            AsyncIOMotorDatabase: MongoDB database instance
            
        Raises:
            RuntimeError: If database is not connected
        """
        if cls.database is None:
            raise RuntimeError("Database is not connected. Call connect_to_database() first.")
        return cls.database


# Convenience function for dependency injection
def get_db() -> AsyncIOMotorDatabase:
    """
    FastAPI dependency for database access.
    
    Usage:
        @app.get("/users")
        async def get_users(db: AsyncIOMotorDatabase = Depends(get_db)):
            users = await db.users.find().to_list(100)
            return users
    
    Returns:
        AsyncIOMotorDatabase: MongoDB database instance
    """
    return MongoDB.get_database()
