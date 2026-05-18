"""Text preprocessing utilities for health reports."""

from __future__ import annotations

import re
from typing import List


def clean_text(text: str) -> str:
    """Normalize whitespace and remove non-informative characters."""
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s\.\-/]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def tokenize_text(text: str) -> List[str]:
    """Split cleaned text into tokens."""
    return clean_text(text).split()
