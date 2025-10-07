import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def list_onepagers():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.marketing_onepager
    
    count = await db.onepagers.count_documents({})
    print(f'Total one-pagers in database: {count}')
    
    if count > 0:
        onepagers = await db.onepagers.find().limit(10).to_list(length=10)
        print(f'\nListing up to 10 one-pagers:')
        for op in onepagers:
            print(f"  - Title: {op['title']}")
            print(f"    ID: {op['_id']}")
            print(f"    Status: {op['status']}")
            print(f"    Sections: {len(op.get('content', {}).get('sections', []))}")
            print()
    
    client.close()

asyncio.run(list_onepagers())
