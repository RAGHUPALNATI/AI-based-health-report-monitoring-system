"""Train and save a text classifier for health report categorization."""

from __future__ import annotations

import argparse
import os
from collections import Counter
from typing import List, Tuple

import joblib
import pandas as pd
from datasets import load_from_disk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


def _load_medical_transcriptions(path: str) -> List[Tuple[str, str]]:
    if not os.path.exists(path):
        return []

    frame = pd.read_csv(path)
    required_cols = {"transcription", "medical_specialty"}
    if not required_cols.issubset(set(frame.columns)):
        return []

    frame = frame.dropna(subset=["transcription", "medical_specialty"])
    records: List[Tuple[str, str]] = []
    for _, row in frame.iterrows():
        text = str(row["transcription"]).strip()
        label = str(row["medical_specialty"]).strip()
        if text and label:
            records.append((text, f"mtsamples::{label}"))
    return records


def _load_medquad(path: str) -> List[Tuple[str, str]]:
    if not os.path.exists(path):
        return []

    ds = load_from_disk(path)
    split = ds["train"] if "train" in ds else ds
    records: List[Tuple[str, str]] = []
    for item in split:
        text = str(item.get("question", "")).strip()
        label = str(item.get("qtype", "") or item.get("category", "")).strip()
        if text and label and label != "None":
            records.append((text, f"medquad::{label}"))
    return records


def _filter_rare_labels(data: List[Tuple[str, str]], min_samples: int) -> List[Tuple[str, str]]:
    counts = Counter(label for _, label in data)
    return [(text, label) for text, label in data if counts[label] >= min_samples]


def train(output_path: str, min_samples_per_label: int = 5) -> None:
    medquad_records = _load_medquad("data/raw_reports/medquad")
    mtsample_records = _load_medical_transcriptions("data/raw_reports/medical_transcriptions/mtsamples.csv")
    all_records = medquad_records + mtsample_records

    if not all_records:
        raise RuntimeError("No classifier training data found in data/raw_reports.")

    all_records = _filter_rare_labels(all_records, min_samples=min_samples_per_label)
    if len(all_records) < 50:
        raise RuntimeError("Not enough labeled training rows after filtering rare labels.")

    texts = [text for text, _ in all_records]
    labels = [label for _, label in all_records]

    x_train, x_test, y_train, y_test = train_test_split(
        texts,
        labels,
        test_size=0.2,
        random_state=42,
        stratify=labels,
    )

    model = Pipeline(
        [
            (
                "vectorizer",
                TfidfVectorizer(
                    ngram_range=(1, 2),
                    min_df=2,
                    max_features=120000,
                    sublinear_tf=True,
                ),
            ),
            (
                "classifier",
                LogisticRegression(
                    max_iter=2000,
                    n_jobs=-1,
                    class_weight="balanced",
                ),
            ),
        ]
    )

    model.fit(x_train, y_train)
    predictions = model.predict(x_test)
    report = classification_report(y_test, predictions, zero_division=0)
    print("Classifier evaluation:\n")
    print(report)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    joblib.dump(model, output_path)
    print(f"Saved classifier model to: {output_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Train report classifier")
    parser.add_argument(
        "--output",
        default="models/report_classifier.joblib",
        help="Path to save trained classifier model",
    )
    parser.add_argument(
        "--min-samples-per-label",
        type=int,
        default=5,
        help="Drop labels with fewer than this number of examples",
    )
    args = parser.parse_args()
    train(args.output, min_samples_per_label=args.min_samples_per_label)


if __name__ == "__main__":
    main()
