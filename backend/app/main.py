import asyncio
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from app.database import ping_database, database
from app.config import settings
from app.routers import auth, upload, analyze

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
    # Ensure upload directory exists
    os.makedirs(settings.upload_dir, exist_ok=True)
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
app.include_router(upload.router)
app.include_router(analyze.router)


# Mount the static uploads directory
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
    ],
    allow_origin_regex="https?://localhost(:\d+)?",
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
