import motor.motor_asyncio
from app.config import settings

client = motor.motor_asyncio.AsyncIOMotorClient(
    settings.mongodb_url
)

database = client[settings.database_name]

async def ping_database():
    """Check if MongoDB connection is alive."""
    await client.admin.command("ping")
    return True
