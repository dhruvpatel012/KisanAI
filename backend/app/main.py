import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import ping_database, database
from app.config import settings
from app.routers import auth

async def monitor_database_connection():
    try:
        while True:
            await asyncio.sleep(30)
            if database._use_fallback:
                print("Attempting to reconnect to MongoDB Atlas in the background...")
                await ping_database()
    except asyncio.CancelledError:
        pass

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting KisanAI API...")
    print("Connecting to MongoDB...")
    await ping_database()
    print("MongoDB connected successfully!")
    print(f"Environment: {settings.environment}")
    
    # Start background task to monitor connection and reconnect if fallback is active
    monitor_task = asyncio.create_task(monitor_database_connection())
    
    yield
    
    # Clean up the background task on shutdown
    monitor_task.cancel()
    try:
        await monitor_task
    except asyncio.CancelledError:
        pass
    print("Shutting down KisanAI API...")

app = FastAPI(
    title="KisanAI API",
    description="AI-powered crop disease detection backend",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(auth.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    await ping_database()
    return {
        "status": "ok",
        "environment": settings.environment,
        "database": database.get_status(),
        "model_version": "v0.0.1"
    }
