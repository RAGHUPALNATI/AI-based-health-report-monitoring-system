"""FastAPI entry point for the health report monitoring system."""

from __future__ import annotations

from typing import Dict, List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.pipeline import HealthReportPipeline


class ReportPayload(BaseModel):
    text: str = Field(default="")
    values: Dict[str, float] = Field(default_factory=dict)


class AnalyzeResponse(BaseModel):
    cleaned_text: str
    tokens: List[str]
    entities: List[Dict[str, str]]
    summary: str
    alerts: List[str]
    classification: Optional[str] = None


app = FastAPI(title="AI-Based Health Report Monitoring API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = HealthReportPipeline()


@app.get("/")
def health_check() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_report(payload: ReportPayload) -> AnalyzeResponse:
    result = pipeline.run(text=payload.text, values=payload.values)
    return AnalyzeResponse(**result.__dict__)
