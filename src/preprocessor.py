"""spaCy-based text preprocessing utilities for health reports."""

from __future__ import annotations

import re
from typing import Dict, List

import spacy
from spacy.language import Language

MEDICAL_ABBREVIATIONS: Dict[str, str] = {
    "hb": "hemoglobin",
    "bp": "blood pressure",
}

_NLP: Language | None = None


def _get_nlp() -> Language:
    """Load a lightweight English spaCy pipeline with sentence segmentation."""
    global _NLP
    if _NLP is not None:
        return _NLP

    try:
        _NLP = spacy.load("en_core_web_sm", disable=["ner", "parser", "lemmatizer"])
        if "sentencizer" not in _NLP.pipe_names:
            _NLP.add_pipe("sentencizer")
    except OSError:
        _NLP = spacy.blank("en")
        _NLP.add_pipe("sentencizer")

    return _NLP


def clean_text(text: str) -> str:
    """Lowercase and remove special characters while keeping sentence punctuation."""
    lowered = text.lower()
    cleaned = re.sub(r"[^a-z0-9\s\.]", " ", lowered)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def normalize_medical_abbreviations(text: str) -> str:
    """Expand common medical abbreviations in text."""
    normalized = text
    for abbr, expanded in MEDICAL_ABBREVIATIONS.items():
        normalized = re.sub(rf"\b{re.escape(abbr)}\b", expanded, normalized, flags=re.IGNORECASE)
    normalized = re.sub(r"\s+", " ", normalized).strip()
    return normalized


def tokenize_text(text: str) -> List[str]:
    """Tokenize text using spaCy and remove stopwords/punctuation/space tokens."""
    nlp = _get_nlp()
    doc = nlp(text)
    return [token.text for token in doc if not token.is_stop and not token.is_punct and not token.is_space]


def split_sentences(text: str) -> List[str]:
    """Split text into sentences using spaCy sentence boundaries."""
    nlp = _get_nlp()
    doc = nlp(text)
    return [sentence.text.strip() for sentence in doc.sents if sentence.text.strip()]


def preprocess_text(text: str) -> Dict[str, List[str] | str]:
    """Run full preprocessing and return clean text, tokens, sentences, and normalized text."""
    cleaned = clean_text(text)
    normalized = normalize_medical_abbreviations(cleaned)
    tokens = tokenize_text(normalized)
    sentences = split_sentences(normalized)
    return {
        "clean_text": cleaned,
        "tokens": tokens,
        "sentences": sentences,
        "normalized_text": normalized,
    }
