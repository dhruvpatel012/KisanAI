import os
import json
import logging
from bson import ObjectId
import motor.motor_asyncio
from app.config import settings

logger = logging.getLogger("uvicorn.error")

class JSONCursor:
    def __init__(self, docs):
        self.docs = list(docs)
        self.index = 0

    def sort(self, key, direction=-1):
        reverse = direction == -1
        def sort_key(doc):
            val = doc.get(key)
            if val is None:
                return ""
            return str(val)
        self.docs.sort(key=sort_key, reverse=reverse)
        return self

    def limit(self, count):
        self.docs = self.docs[:count]
        return self

    def __aiter__(self):
        self.index = 0
        return self

    async def __anext__(self):
        if self.index >= len(self.docs):
            raise StopAsyncIteration
        doc = self.docs[self.index]
        self.index += 1
        return doc

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

    def _matches(self, doc, filter_query):
        for k, v in filter_query.items():
            if k == "_id" or k == "id":
                if str(doc.get("_id")) != str(v):
                    return False
            elif k == "_id" and isinstance(v, dict) and "$in" in v:
                allowed = [str(x) for x in v["$in"]]
                if str(doc.get("_id")) not in allowed:
                    return False
            elif k == "user_id":
                if str(doc.get("user_id")) != str(v):
                    return False
            elif doc.get(k) != v:
                return False
        return True

    async def find_one(self, filter_query):
        self._load()
        for doc in self.data:
            if self._matches(doc, filter_query):
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

    async def insert_many(self, documents):
        self._load()
        inserted_ids = []
        for document in documents:
            doc = dict(document)
            if "_id" not in doc:
                doc["_id"] = str(ObjectId())
            self.data.append(doc)
            inserted_ids.append(doc["_id"])
        self._save()
        
        class InsertManyResult:
            def __init__(self, ids):
                self.inserted_ids = ids
        return InsertManyResult(inserted_ids)

    def find(self, filter_query=None, projection=None):
        self._load()
        if filter_query is None:
            filter_query = {}
        matched = []
        for doc in self.data:
            if self._matches(doc, filter_query):
                matched.append(dict(doc))
        return JSONCursor(matched)

    async def count_documents(self, filter_query):
        self._load()
        count = 0
        for doc in self.data:
            if self._matches(doc, filter_query):
                count += 1
        return count

    async def update_one(self, filter_query, update_query):
        self._load()
        for doc in self.data:
            if self._matches(doc, filter_query):
                if "$set" in update_query:
                    for k, v in update_query["$set"].items():
                        doc[k] = v
                self._save()
                
                class UpdateResult:
                    def __init__(self):
                        self.matched_count = 1
                        self.modified_count = 1
                return UpdateResult()
        
        class UpdateResultZero:
            def __init__(self):
                self.matched_count = 0
                self.modified_count = 0
        return UpdateResultZero()

    async def delete_one(self, filter_query):
        self._load()
        for i, doc in enumerate(self.data):
            if self._matches(doc, filter_query):
                self.data.pop(i)
                self._save()
                
                class DeleteResult:
                    def __init__(self):
                        self.deleted_count = 1
                return DeleteResult()
        
        class DeleteResultZero:
            def __init__(self):
                self.deleted_count = 0
        return DeleteResultZero()

    async def delete_many(self, filter_query):
        self._load()
        initial_len = len(self.data)
        self.data = [doc for doc in self.data if not self._matches(doc, filter_query)]
        deleted_count = initial_len - len(self.data)
        if deleted_count > 0:
            self._save()
            
        class DeleteResult:
            def __init__(self, count):
                self.deleted_count = count
        return DeleteResult(deleted_count)

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
                serverSelectionTimeoutMS=3000,
                connectTimeoutMS=3000,
                maxPoolSize=20,
                minPoolSize=5
            )
            self._db = self._client[settings.database_name]

    async def ping(self):
        try:
            self._init_atlas()
            # Try to ping Atlas
            await self._client.admin.command("ping")
            self._use_fallback = False
            logger.info("Connected to MongoDB Atlas successfully.")
            
            # Ensure indexes in MongoDB Atlas
            try:
                await self._db["users"].create_index("email", unique=True)
                await self._db["scans"].create_index([("user_id", 1), ("created_at", -1)])
                logger.info("Database indexes checked/created successfully.")
            except Exception as ie:
                logger.warning(f"Failed to create indexes (non-fatal): {ie}")
                
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

