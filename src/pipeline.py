"""Orchestrates preprocessing, extraction, classification, summarization, and alerts."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional

from src.alert_engine import AlertEngine
from src.classifier import ReportClassifier
from src.ner_extractor import NERExtractor
from src.preprocessor import clean_text, tokenize_text
from src.summarizer import summarize_text


@dataclass
class PipelineResult:
    cleaned_text: str
    tokens: List[str]
    entities: List[Dict[str, str]]
    summary: str
    alerts: List[str]
    classification: Optional[str] = None


class HealthReportPipeline:
    def __init__(self) -> None:
        self.ner = NERExtractor()
        self.classifier = ReportClassifier()
        self.alert_engine = AlertEngine()

    def run(self, text: str, values: Dict[str, float] | None = None) -> PipelineResult:
        cleaned_text = clean_text(text)
        tokens = tokenize_text(text)
        entities = self.ner.extract_entities(text)
        summary = summarize_text(text)
        alerts = self.alert_engine.generate_alerts(values or {})
        return PipelineResult(
            cleaned_text=cleaned_text,
            tokens=tokens,
            entities=entities,
            summary=summary,
            alerts=alerts,
        )
