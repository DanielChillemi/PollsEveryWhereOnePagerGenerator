import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import json

async def check_full_onepager():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["marketing_onepager"]
    
    # Get the most recent one-pager
    onepager = await db.onepagers.find_one(
        sort=[("_id", -1)]
    )
    
    if onepager:
        # Convert ObjectId to string for JSON serialization
        onepager["_id"] = str(onepager["_id"])
        onepager["user_id"] = str(onepager["user_id"])
        if "brand_kit_id" in onepager and onepager["brand_kit_id"]:
            onepager["brand_kit_id"] = str(onepager["brand_kit_id"])
        
        print(json.dumps(onepager, indent=2, default=str))
                    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_full_onepager())
