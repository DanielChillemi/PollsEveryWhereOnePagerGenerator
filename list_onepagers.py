"""List all OnePagers in database"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")

async def list_onepagers():
    """List all OnePagers"""
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client.onepager_db

    try:
        onepagers = await db.onepagers.find().to_list(length=100)

        print(f"📊 Total OnePagers: {len(onepagers)}\n")

        for onepager in onepagers:
            print(f"ID: {onepager['_id']}")
            print(f"Title: {onepager['title']}")
            print(f"Sections: {len(onepager['content']['sections'])}")
            print(f"Version History: {len(onepager.get('version_history', []))}")
            print(f"Updated: {onepager['updated_at']}")
            print("-" * 60)

    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(list_onepagers())
