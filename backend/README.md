# Stream C — Backend Setup Guide

## Prerequisites
- Python 3.11+
- A [Supabase](https://supabase.com) project (free tier is fine)

---

## 1. Set up the Supabase database

1. Go to your Supabase project → **SQL Editor**
2. Copy and paste the contents of `backend/stream_c/schema.sql`
3. Click **Run** — this creates all 4 tables with proper types, constraints, RLS, and indexes

---

## 2. Configure environment variables

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in:
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

Get these from: **Supabase Dashboard → Project Settings → API**

> ⚠️ Use the **service role** key (not the anon key) — it bypasses RLS on the server side.

---

## 3. Install Python dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

## 4. Start the backend server

```bash
uvicorn stream_c.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`  
Interactive docs at `http://localhost:8000/docs`

---

## 5. Configure the frontend

Add to `frontend/.env` (create it if it doesn't exist):
```
VITE_API_BASE=http://localhost:8000
```

Then import from the bridge in any component:
```js
import { createSession, writeRecords, getQuarantine } from './api/backend';
```

---

## File Structure

```
backend/
├── requirements.txt
├── .env.example
└── stream_c/
    ├── __init__.py
    ├── main.py          ← FastAPI app entry point
    ├── config.py        ← Supabase client
    ├── models.py        ← Pydantic schemas
    ├── validation.py    ← 5-check validation gate
    ├── writer.py        ← Batch insert + quarantine + upsert
    ├── routes.py        ← API endpoints
    └── schema.sql       ← Run in Supabase SQL editor
```
