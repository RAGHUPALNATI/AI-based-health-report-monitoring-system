"""Central project configuration constants."""

from __future__ import annotations

from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent

DATA_DIR = BASE_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
ANNOTATED_DATA_DIR = DATA_DIR / "annotated"

MODELS_DIR = BASE_DIR / "models"
NER_MODEL_DIR = MODELS_DIR / "ner_model"
CLASSIFIER_MODEL_DIR = MODELS_DIR / "classifier"

OUTPUTS_DIR = BASE_DIR / "outputs"

SPACY_EN_MODEL = "en_core_web_sm"
SCISPACY_BC5CDR_MODEL = "en_ner_bc5cdr_md"

NER_LABELS = ["DISEASE", "MEDICATION", "LAB_VALUE", "SYMPTOM", "BODY_PART"]

LAB_THRESHOLDS = {
    "glucose": 140.0,
    "hemoglobin": 12.0,
    "wbc": 11000.0,
    "platelets": 150000.0,
    "creatinine": 1.3,
}
