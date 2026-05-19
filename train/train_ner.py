"""Build a deployable spaCy NER model using available medical dataset signals."""

from __future__ import annotations

import argparse
import os
from typing import Dict, List

import pandas as pd
import spacy
from datasets import load_from_disk


def _collect_medical_terms(max_terms: int = 5000) -> Dict[str, str]:
    """Extract entity terms from local datasets for EntityRuler patterns."""
    terms: Dict[str, str] = {
        "hemoglobin": "LAB_MARKER",
        "blood pressure": "VITAL_SIGN",
        "glucose": "LAB_MARKER",
    }

    medquad_path = "data/raw_reports/medquad"
    if os.path.exists(medquad_path):
        ds = load_from_disk(medquad_path)
        split = ds["train"] if "train" in ds else ds
        for item in split:
            focus = str(item.get("focus_entity", "") or item.get("question_focus", "")).strip()
            if focus and len(focus.split()) <= 4:
                terms[focus.lower()] = "MEDICAL_CONCEPT"
            if len(terms) >= max_terms:
                break

    mtsamples_path = "data/raw_reports/medical_transcriptions/mtsamples.csv"
    if os.path.exists(mtsamples_path):
        frame = pd.read_csv(mtsamples_path)
        if "keywords" in frame.columns:
            for raw in frame["keywords"].dropna().astype(str).tolist():
                for candidate in raw.split(","):
                    term = candidate.strip().lower()
                    if 2 <= len(term) <= 40:
                        terms[term] = "MEDICAL_KEYWORD"
                if len(terms) >= max_terms:
                    break

    return terms


def train(output_dir: str, max_terms: int = 5000) -> None:
    """Create a spaCy pipeline with sentence segmentation + EntityRuler patterns."""
    nlp = spacy.blank("en")
    nlp.add_pipe("sentencizer")
    ruler = nlp.add_pipe("entity_ruler")

    terms = _collect_medical_terms(max_terms=max_terms)
    patterns: List[Dict[str, object]] = [
        {"label": label, "pattern": term}
        for term, label in sorted(terms.items(), key=lambda item: len(item[0]), reverse=True)
    ]
    ruler.add_patterns(patterns)

    os.makedirs(output_dir, exist_ok=True)
    nlp.to_disk(output_dir)
    print(f"Saved NER model to: {output_dir}")
    print(f"EntityRuler patterns added: {len(patterns)}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build NER model from local datasets")
    parser.add_argument(
        "--output-dir",
        default="models/ner_model",
        help="Directory to save spaCy NER model",
    )
    parser.add_argument(
        "--max-terms",
        type=int,
        default=5000,
        help="Maximum number of dictionary terms to include",
    )
    args = parser.parse_args()
    train(args.output_dir, max_terms=args.max_terms)


if __name__ == "__main__":
    main()
