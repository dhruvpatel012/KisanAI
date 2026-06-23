# KisanAI (AI-powered crop disease detection & advisory platform)

## Project Overview
KisanAI is an AI-powered agricultural tool that detects crop diseases from uploaded photos and provides structured, localized treatment recommendations combined with real-time weather alerts.

## Project Structure
```text
Kisan_AI/
├── frontend/             # React application (Vite + TailwindCSS v4)
├── backend/              # FastAPI Python backend (endpoints and database schemas)
└── README.md             # Shared workspace README
```

## Getting Started

### Frontend (React + Vite)
1. Navigate to `/frontend`
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the local development server (default port `5173`)
4. Run `npm run build` to compile the optimized production bundle

### Backend (FastAPI)
1. Navigate to `/backend`
2. Create and activate a virtual environment:
   ```powershell
   # Windows PowerShell
   python -m venv venv
   venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
   *Make sure to configure your `MONGODB_URL` inside the newly created `.env` file.*
5. Start the API server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
6. Check endpoints:
   - Health check: `http://localhost:8000/health`
   - Swagger Docs: `http://localhost:8000/docs`
   - ReDoc Docs: `http://localhost:8000/redoc`

## Progress Log
- **Day 1**: Initialized monorepo workspace. Set up React + Vite frontend scaffold with TailwindCSS v4 integration. Verified successful production build.
- **Day 2**: Set up FastAPI backend, configured virtual environment, integrated async MongoDB Atlas connection with Motor, validated configurations using Pydantic Settings, and created the `/health` check and auto-documentation routes.
