"""spaCy-based named entity extraction for medical reports."""

from __future__ import annotations

from typing import Dict, List

import spacy


class NERExtractor:
    def __init__(self, model_name: str = "en_core_web_sm") -> None:
        self.nlp = spacy.load(model_name)

    def extract_entities(self, text: str) -> List[Dict[str, str]]:
        doc = self.nlp(text)
        return [{"text": ent.text, "label": ent.label_} for ent in doc.ents]
