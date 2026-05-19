"""Flask API for AI-based health report monitoring."""

from __future__ import annotations

import os
import re
from typing import Any, Dict, List, Tuple

import joblib
from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.exceptions import NotFittedError

from src.alert_engine import AlertEngine
from src.classifier import ReportClassifier
from src.ner_extractor import NERExtractor
from src.preprocessor import preprocess_text
from src.summarizer import summarize_text

app = Flask(__name__)
CORS(
	app,
	resources={
		r"/analyze": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]},
		r"/health": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]},
	},
)

ALERT_THRESHOLDS: Dict[str, float] = {
	"systolic_bp": 140.0,
	"diastolic_bp": 90.0,
	"glucose": 200.0,
}


def _load_ner_extractor() -> NERExtractor:
	"""Load a spaCy NER model with fallback for environments missing model files."""
	local_model_path = os.path.join("models", "ner_model")
	if os.path.exists(local_model_path):
		return NERExtractor(model_name=local_model_path)

	try:
		return NERExtractor(model_name="en_ner_bc5cdr_md")
	except OSError:
		try:
			return NERExtractor(model_name="en_core_web_sm")
		except OSError:
			class _EmptyNERExtractor:
				def extract_entities(self, text: str) -> List[Dict[str, str]]:
					return []

			return _EmptyNERExtractor()


def _load_classifier() -> ReportClassifier:
	"""Load trained classifier from disk when available, otherwise return fresh instance."""
	classifier = ReportClassifier()
	model_path = os.path.join("models", "report_classifier.joblib")
	if os.path.exists(model_path):
		classifier.model = joblib.load(model_path)
	return classifier


NER_EXTRACTOR = _load_ner_extractor()
CLASSIFIER = _load_classifier()
ALERT_ENGINE = AlertEngine(thresholds=ALERT_THRESHOLDS)


def _extract_metric_values(text: str) -> Dict[str, float]:
	"""Extract numeric clinical values needed by the alert engine."""
	metrics: Dict[str, float] = {}

	bp_match = re.search(r"blood pressure\s*(\d{2,3})\s*/\s*(\d{2,3})", text, flags=re.IGNORECASE)
	if bp_match:
		metrics["systolic_bp"] = float(bp_match.group(1))
		metrics["diastolic_bp"] = float(bp_match.group(2))

	glucose_match = re.search(r"glucose\s*(?:is|:)?\s*(\d+(?:\.\d+)?)", text, flags=re.IGNORECASE)
	if glucose_match:
		metrics["glucose"] = float(glucose_match.group(1))

	return metrics


def _coerce_numeric_values(values: Any) -> Dict[str, float]:
	"""Normalize user-provided metrics into float values."""
	if not isinstance(values, dict):
		return {}

	parsed: Dict[str, float] = {}
	for key, value in values.items():
		try:
			parsed[str(key)] = float(value)
		except (TypeError, ValueError):
			continue
	return parsed


def _classification_from_model(text: str) -> Tuple[str, float]:
	"""Return model prediction and confidence with fallback when model is not yet trained."""
	try:
		prediction = CLASSIFIER.model.predict([text])[0]

		if hasattr(CLASSIFIER.model, "predict_proba"):
			probabilities = CLASSIFIER.model.predict_proba([text])[0]
			confidence = float(max(probabilities))
		else:
			confidence = 0.5

		return str(prediction), confidence
	except NotFittedError:
		text_lower = text.lower()
		high_risk_terms = ("critical", "severe", "emergency", "abnormal", "high")
		if any(term in text_lower for term in high_risk_terms):
			return "critical", 0.55
		return "normal", 0.51


def _build_alert_flags(values: Dict[str, float], messages: List[str]) -> List[Dict[str, Any]]:
	"""Convert alert messages into structured alert flags."""
	triggered_metrics = {metric for metric in values if ALERT_THRESHOLDS.get(metric) is not None and values[metric] >= ALERT_THRESHOLDS[metric]}

	flags: List[Dict[str, Any]] = []
	for metric, value in values.items():
		threshold = ALERT_THRESHOLDS.get(metric)
		if threshold is None:
			continue
		flags.append(
			{
				"metric": metric,
				"value": value,
				"threshold": threshold,
				"triggered": metric in triggered_metrics,
			}
		)

	# Include message-only flags when values are unavailable.
	if not flags and messages:
		flags = [{"metric": "clinical_alert", "triggered": True, "message": message} for message in messages]

	return flags


@app.get("/health")
def health() -> Any:
	return jsonify({"status": "ok", "service": "medical-nlp-monitoring"}), 200


@app.post("/analyze")
def analyze() -> Any:
	if not request.is_json:
		return jsonify({"error": "Request must be JSON."}), 400

	payload = request.get_json(silent=True)
	if not isinstance(payload, dict):
		return jsonify({"error": "Invalid JSON body."}), 400

	report_text = payload.get("report_text") or payload.get("text")
	if not isinstance(report_text, str) or not report_text.strip():
		return jsonify({"error": "Field 'report_text' is required and must be a non-empty string."}), 400

	try:
		preprocessed = preprocess_text(report_text)
		normalized_text = str(preprocessed["normalized_text"])

		entities = NER_EXTRACTOR.extract_entities(normalized_text)
		classification_label, confidence = _classification_from_model(normalized_text)
		summary = summarize_text(normalized_text)

		metric_values = _extract_metric_values(normalized_text)
		metric_values.update(_coerce_numeric_values(payload.get("values")))
		alert_messages = ALERT_ENGINE.generate_alerts(metric_values)
		alert_flags = _build_alert_flags(metric_values, alert_messages)

		response = {
			"entities": entities,
			"classification": {
				"label": classification_label,
				"confidence": round(confidence, 4),
			},
			"summary": summary,
			"alerts": alert_messages,
			"alert_flags": alert_flags,
		}
		return jsonify(response), 200
	except Exception as exc:
		app.logger.exception("Failed to analyze report")
		return jsonify({"error": "Failed to analyze report.", "details": str(exc)}), 500


if __name__ == "__main__":
	app.run(host="0.0.0.0", port=5000, debug=True)

