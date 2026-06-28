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
- **Day 3**: Setup FastAPI password hashing with bcrypt, JSON Web Token (JWT) encoding/decoding utilities, Pydantic schemas, and MongoDB models. Built registration, login, and bearer auth endpoints, validating database creation and security protocols.
- **Day 4**: Built the frontend authentication client. Integrated Axios with JWT request/response interceptors, created useAuth hook, and built Zod-validated Login and Registration forms with loading states and alert components. Verified redirect flows, validation, and JWT local storage.
- **Day 5**: Standardized the KisanAI design system in `index.css` (Google Inter font, anti-glare cream background, agricultural green palettes). Created modular `Button`, `Card`, `Badge`, `BottomNav`, and `PageLayout` layout shells. Built the dynamic Dashboard, Scan upload page, and bilingual Profile pages with full mobile responsiveness (360px).
- **Day 6**: Built the backend image upload endpoint (`POST /upload`) supporting JWT verification, file size (5MB) and extension validation, UUID-renamed disk storage, and database metadata logging in MongoDB Atlas. Created the corresponding frontend `useImageUpload` hook with local preview creation and cleanup utilities.
- **Day 7**: Developed `ImagePicker` and `ImagePreview` frontend components with conditional rendering, and built a dedicated `HistoryPage` displaying bilingual empty states. Integrated a `ProtectedRoute` component to secure all dashboard and profile pages. Completed end-to-end flow verification tests, cleaned up files, and updated `.env.example`.

## Quick Start (Run Project Every Time)

Open **two separate terminal windows** from the `Kisan_AI/` root directory:

### Terminal 1: Start Backend API
```powershell
cd backend
# Activate virtual environment:
# (CMD): .\venv\Scripts\activate.bat
# (PowerShell): .\venv\Scripts\Activate.ps1
.\venv\Scripts\Activate.ps1

# Run the server:
uvicorn app.main:app --reload --port 8000
```

### Terminal 2: Start Frontend App
```powershell
cd frontend
# Run the development server:
npm run dev
```
