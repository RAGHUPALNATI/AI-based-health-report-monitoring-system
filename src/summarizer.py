"""Extractive summarization for medical reports."""

from __future__ import annotations


def summarize_text(text: str, max_sentences: int = 3) -> str:
    """Return the first few sentences as a simple extractive summary."""
    sentences = [segment.strip() for segment in text.split(".") if segment.strip()]
    return ". ".join(sentences[:max_sentences]) + ("." if sentences[:max_sentences] else "")
