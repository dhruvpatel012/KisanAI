import os
import json
import logging
from bson import ObjectId
import motor.motor_asyncio
from app.config import settings

logger = logging.getLogger("uvicorn.error")

class JSONCollection:
    def __init__(self, filename):
        self.filename = filename
        self._load()

    def _load(self):
        if os.path.exists(self.filename):
            try:
                with open(self.filename, 'r', encoding='utf-8') as f:
                    self.data = json.load(f)
            except Exception:
                self.data = []
        else:
            self.data = []

    def _save(self):
        with open(self.filename, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=4, default=str)

    async def find_one(self, filter_query):
        self._load()
        for doc in self.data:
            match = True
            for k, v in filter_query.items():
                if k == "_id" or k == "id":
                    if str(doc.get("_id")) != str(v):
                        match = False
                        break
                elif doc.get(k) != v:
                    match = False
                    break
            if match:
                return dict(doc)
        return None

    async def insert_one(self, document):
        self._load()
        doc = dict(document)
        if "_id" not in doc:
            doc["_id"] = str(ObjectId())
        self.data.append(doc)
        self._save()
        
        class InsertResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return InsertResult(doc["_id"])

class DatabaseProxy:
    def __init__(self):
        self._client = None
        self._db = None
        self._use_fallback = False
        self._fallback_dir = "local_db"

    def _init_atlas(self):
        if self._client is None:
            self._client = motor.motor_asyncio.AsyncIOMotorClient(
                settings.mongodb_url,
                serverSelectionTimeoutMS=10000
            )
            self._db = self._client[settings.database_name]

    async def ping(self):
        try:
            self._init_atlas()
            # Try to ping Atlas
            await self._client.admin.command("ping")
            self._use_fallback = False
            logger.info("Connected to MongoDB Atlas successfully.")
            return True
        except Exception as e:
            logger.warning(f"MongoDB connection failed: {e}")
            logger.warning("Falling back to local JSON file-based database.")
            self._use_fallback = True
            os.makedirs(self._fallback_dir, exist_ok=True)
            return True

    def get_status(self):
        if self._use_fallback:
            return "Local JSON Fallback"
        elif self._client is not None:
            return "Atlas MongoDB"
        else:
            return "Not Initialized"

    def __getitem__(self, collection_name):
        if self._use_fallback:
            filename = os.path.join(self._fallback_dir, f"{collection_name}.json")
            return JSONCollection(filename)
        else:
            self._init_atlas()
            return self._db[collection_name]

# Create the proxy database instance
database = DatabaseProxy()

async def ping_database():
    """Verify database status and set up fallback if needed."""
    return await database.ping()

