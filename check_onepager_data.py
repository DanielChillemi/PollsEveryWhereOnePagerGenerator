import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

async def check_onepager():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["marketing_onepager"]
    
    # Get the most recent one-pager
    onepager = await db.onepagers.find_one(
        sort=[("_id", -1)]
    )
    
    if onepager:
        print(f"\nOne-Pager ID: {onepager['_id']}")
        print(f"Title: {onepager.get('title', 'N/A')}")
        print(f"\nContent structure:")
        if "content" in onepager:
            print(f"  - headline: {onepager['content'].get('headline', 'N/A')}")
            print(f"  - sections: {len(onepager['content'].get('sections', []))} sections")
            
            if "sections" in onepager["content"]:
                print("\n  Section details:")
                for idx, section in enumerate(onepager["content"]["sections"]):
                    print(f"    Section {idx}:")
                    print(f"      - id: {section.get('id', 'N/A')}")
                    print(f"      - type: {section.get('type', 'N/A')}")
                    print(f"      - order: {section.get('order', 'N/A')}")
                    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_onepager())
