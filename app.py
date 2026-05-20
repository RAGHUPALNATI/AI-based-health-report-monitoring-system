"""Flask API for AI-based health report monitoring with file upload and translation."""

from __future__ import annotations

import os
import re
from typing import Any, Dict, List, Tuple

import fitz
import joblib
import translators as ts
from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.exceptions import NotFittedError

from src.alert_engine import AlertEngine
from src.classifier import ReportClassifier
from src.ner_extractor import NERExtractor
from src.preprocessor import preprocess_text
from src.summarizer import summarize_text

app = Flask(__name__)
CORS(app, 
     resources={r"/*": {"origins": "*"}},
     supports_credentials=True,
     allow_headers=["Content-Type"],
     methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"])

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

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

    if not flags and messages:
        flags = [{"metric": "clinical_alert", "triggered": True, "message": message} for message in messages]

    return flags


def _translate_text(text: str, lang: str) -> str:
    """Translate text to specified language using translators library."""
    try:
        if lang == "hi":
            return ts.translate_text(text, from_language="en", to_language="hi")
        elif lang == "kn":
            return ts.translate_text(text, from_language="en", to_language="kn")
        elif lang == "te":
            return ts.translate_text(text, from_language="en", to_language="te")
    except Exception as e:
        app.logger.warning(f"Translation to {lang} failed: {str(e)}")
    return text


def _extract_text_from_file(file) -> str:
    """Extract text from uploaded file (PDF or TXT)."""
    filename = file.filename.lower()
    
    if filename.endswith('.pdf'):
        try:
            pdf_data = file.read()
            doc = fitz.open(stream=pdf_data, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text()
            return text
        except Exception as e:
            raise ValueError(f"Failed to extract text from PDF: {str(e)}")
    else:
        try:
            return file.read().decode('utf-8')
        except Exception as e:
            raise ValueError(f"Failed to read text file: {str(e)}")


@app.get("/health")
def health() -> Any:
    return jsonify({"status": "ok", "service": "medical-nlp-monitoring"}), 200


@app.post("/analyze")
def analyze() -> Any:
    """Analyze a health report from text or uploaded file."""
    # --- DEBUGGING: Temporarily bypass the full pipeline to test the connection ---
    app.logger.info("--- DEBUG MODE: Bypassing NLP pipeline and returning dummy data. ---")
    
    # Ensure a file was actually uploaded to simulate a real request
    if 'file' not in request.files:
        return jsonify({"error": "File upload is required for this test."}), 400

    dummy_summary = "This is a test summary. The patient's condition appears stable. Blood pressure is within normal limits. No acute distress noted."
    
    dummy_data = {
        "entities": [
            {"text": "Blood pressure", "label": "METRIC"},
            {"text": "stable", "label": "CONDITION"}
        ],
        "summary": {
            "en": dummy_summary,
            "hi": "यह एक परीक्षण सारांश है।",
            "kn": "ಇದು ಪರೀಕ್ಷಾ ಸಾರಾಂಶವಾಗಿದೆ.",
            "te": "ఇది పరీక్ష సారాంశం."
        },
        "classification": {"prediction": "normal", "confidence": 0.99},
        "alerts": [],
        "alert_flags": [
            {"metric": "systolic_bp", "value": 120, "threshold": 140, "triggered": False},
            {"metric": "diastolic_bp", "value": 80, "threshold": 90, "triggered": False}
        ]
    }
    import time
    time.sleep(2) # Simulate processing time
    return jsonify(dummy_data), 200

    # --- ORIGINAL CODE DISABLED FOR DEBUGGING ---
    """
    report_text = ""
    values = {}

    try:
        app.logger.info("Received request to /analyze")

        # Handle file upload
        if 'file' in request.files:
            file = request.files['file']
            if file and file.filename:
                app.logger.info(f"Processing uploaded file: {file.filename}")
                report_text = _extract_text_from_file(file)
                app.logger.info("Successfully extracted text from file.")
        else:
            # Handle JSON payload
            data = request.get_json()
            if data:
                app.logger.info("Processing JSON payload.")
                report_text = data.get("report_text") or data.get("text", "")
                values = _coerce_numeric_values(data.get("values", {}))

        if not report_text or not report_text.strip():
            app.logger.warning("Report text is missing from the request.")
            return jsonify({"error": "Report text is missing"}), 400

        # Run NLP pipeline
        app.logger.info("Starting NLP pipeline...")
        processed_data = preprocess_text(report_text)
        cleaned_text = processed_data["normalized_text"]
        app.logger.info("Text preprocessing complete.")
        
        entities = NER_EXTRACTOR.extract_entities(cleaned_text)
        app.logger.info("NER extraction complete.")
        summary_en = summarize_text(cleaned_text, max_sentences=5)
        app.logger.info("Summarization complete.")
        
        # Translate summary with improved error handling
        app.logger.info("Starting translation...")
        summaries = {"en": summary_en}
        try:
            summaries["hi"] = _translate_text(summary_en, "hi")
            summaries["kn"] = _translate_text(summary_en, "kn")
            summaries["te"] = _translate_text(summary_en, "te")
            app.logger.info("Translation successful.")
        except Exception as e:
            app.logger.error(f"Translation failed: {str(e)}", exc_info=True)
            # Fallback to English for all languages if translation fails
            summaries["hi"] = summary_en
            summaries["kn"] = summary_en
            summaries["te"] = summary_en
            app.logger.warning("Fell back to English for all summaries due to translation error.")

        # Extract metrics and generate alerts
        app.logger.info("Extracting metrics and generating alerts...")
        extracted_metrics = _extract_metric_values(cleaned_text)
        combined_metrics = {**extracted_metrics, **values}
        alert_messages = ALERT_ENGINE.generate_alerts(combined_metrics)
        alert_flags = _build_alert_flags(combined_metrics, alert_messages)
        app.logger.info("Alert generation complete.")

        # Get classification
        app.logger.info("Performing classification...")
        prediction, confidence = _classification_from_model(cleaned_text)
        app.logger.info("Classification complete.")

        app.logger.info("Analysis complete, returning response.")
        return jsonify(
            {
                "entities": entities,
                "summary": summaries,
                "classification": {"prediction": prediction, "confidence": round(confidence, 4)},
                "alerts": alert_messages,
                "alert_flags": alert_flags,
            }
        ), 200

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        app.logger.exception("Failed to analyze report")
        return jsonify({"error": "Failed to analyze report", "details": str(e)}), 500
    """


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
