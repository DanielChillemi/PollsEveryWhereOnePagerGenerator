import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def get_user_id():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.marketing_onepager
    user = await db.users.find_one({'email': 'josuev@ownitcoaching.com'})
    if user:
        print(f"User ID: {user['_id']}")
    else:
        print("User not found")
    client.close()

asyncio.run(get_user_id())
