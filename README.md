# CEO AI - Quick Deploy Instructions

This repo contains the backend (FastAPI) and frontend (React) for the CEO autonomous AI system.

Quick steps to prepare and deploy locally or to cloud hosts (Render backend, Vercel frontend):

1) Local (development)

```bash
# Backend
cd backend
python -m venv .venv
.venv\Scripts\activate    # Windows
pip install -r requirements.txt
uvicorn server:app --reload --port 8000

# Frontend
cd ../frontend
npm install
npm start
```

2) Deploy

- Backend: push to GitHub; Render will build using `Dockerfile` and `render.yaml`.
- Frontend: Vercel build uses `vercel.json`. Ensure `REACT_APP_BACKEND_URL` is set in Vercel project settings or in `vercel.json`.

3) Important files

- `render.yaml` — Render service configuration
- `vercel.json` — Vercel build and env configuration
- `.env.example` — example environment variables (create `.env` for local runs)

If you want, I can add CI, health-checks, or a deployment script wrapper next.
