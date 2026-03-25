"""
stream_c/main.py

FastAPI application entry point for Stream C.

Run with:
    cd backend
    uvicorn stream_c.main:app --reload --port 8000
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .routes import router

load_dotenv()

app = FastAPI(
    title="ClearCash — Stream C: Database Layer",
    description="Validation gate, batch write, and quarantine management for financial records.",
    version="1.0.0",
)

# CORS — allow the Vite dev server to call this API
allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
allowed_origins = [o.strip() for o in allowed_origins_raw.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "stream_c"}
