from motor.motor_asyncio import AsyncIOMotorClient

from .config import get_settings

settings = get_settings()

client = AsyncIOMotorClient(settings.mongodb_uri) if settings.mongodb_uri else None
db = client["StudyBot"] if client is not None else None
notes_collection = db["notes"] if db is not None else None
