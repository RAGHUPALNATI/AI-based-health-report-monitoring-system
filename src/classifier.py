"""scikit-learn report classification utilities."""

from __future__ import annotations

from typing import Iterable, Sequence

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline


class ReportClassifier:
    def __init__(self) -> None:
        self.model = Pipeline(
            [
                ("vectorizer", TfidfVectorizer()),
                ("classifier", LogisticRegression(max_iter=1000)),
            ]
        )

    def train(self, texts: Sequence[str], labels: Sequence[str]) -> None:
        self.model.fit(texts, labels)

    def predict(self, texts: Iterable[str]):
        return self.model.predict(list(texts))
