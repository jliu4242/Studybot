# StudyBot
AI-powered question generator from notes and past exams.

## Overview
StudyBot turns your notes and past exams into relevant, exam-style practice questions. Notes mode grounds questions strictly in uploaded notes, and exam mode mimics the style and difficulty of prior exams.

## Project Structure
- `frontend/` – Next.js app (UI, components, styling, Auth0 middleware, env config).
- `backend/` – FastAPI service (LLM utilities, parsing helpers, model assets, env config).
- `node_modules/` and `.next/` at the repo root are legacy artifacts; rebuild inside `frontend/` after installs.

## Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
Add frontend secrets to `frontend/.env.local`.

## Running the Backend
```bash
cd backend
python -m venv .venv
.\\.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.generate:app --reload --host 0.0.0.0 --port 8000
```
Backend secrets live in `backend/app/.env`. The frontend continues calling `http://127.0.0.1:8000` for APIs, so keep the backend listening on that port.

## Features
- Concept-preserving question generation grounded in uploaded content.
- Exam-style mimicry for practice tests.
- File uploads for notes, PDFs, and exams.
- Modern UI built with Next.js.
- FastAPI backend orchestrating parsing, LLM calls, and persistence.

## Tech Stack
- **Frontend:** Next.js, React, TailwindCSS (optional)
- **Backend:** FastAPI (Python), document parsing, LLM-based generation
- **Database:** MongoDB
