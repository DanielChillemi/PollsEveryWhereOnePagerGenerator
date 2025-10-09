# check_brand_kit_audiences.py
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from bson import ObjectId

async def check_brand_kit():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["marketing_onepager"]
    
    # Find the PDF Test Company brand kit
    brand_kit = await db.brand_kits.find_one({"company_name": "PDF Test Company"})
    
    if brand_kit:
        print("Brand Kit Found!")
        print(f"ID: {brand_kit['_id']}")
        print(f"Company: {brand_kit['company_name']}")
        print(f"\nTarget Audiences:")
        print(f"  Type: {type(brand_kit.get('target_audiences'))}")
        print(f"  Value: {brand_kit.get('target_audiences')}")
        
        if brand_kit.get('target_audiences'):
            for i, ta in enumerate(brand_kit['target_audiences']):
                print(f"\n  Audience {i+1}:")
                print(f"    {ta}")
    else:
        print("Brand kit not found!")

asyncio.run(check_brand_kit())