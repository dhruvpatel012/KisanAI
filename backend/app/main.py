from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import ping_database
from app.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting KisanAI API...")
    print("Connecting to MongoDB...")
    await ping_database()
    print("MongoDB connected successfully!")
    print(f"Environment: {settings.environment}")
    yield
    print("Shutting down KisanAI API...")

app = FastAPI(
    title="KisanAI API",
    description="AI-powered crop disease detection backend",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    db_status = await ping_database()
    return {
        "status": "ok",
        "environment": settings.environment,
        "database": "connected" if db_status else "disconnected",
        "model_version": "v0.0.1"
    }
