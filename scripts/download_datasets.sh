#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Installing Python dependencies needed for dataset downloads..."
python -m pip install -r requirements.txt

echo "Ensuring dataset directories exist..."
mkdir -p data/raw_reports/medquad
mkdir -p data/raw_reports/medical_transcriptions
mkdir -p data/raw_reports/symptom2disease
mkdir -p data/annotated/bc5cdr

echo "Downloading dataset 1/4: lavita/MedQuAD (Hugging Face)"
python - <<'PY'
from datasets import load_dataset

medquad = load_dataset("lavita/MedQuAD")
medquad.save_to_disk("data/raw_reports/medquad")
print({split: len(medquad[split]) for split in medquad.keys()})
PY

echo "Downloading dataset 2/4: Medical Transcriptions (Kaggle)"
kaggle datasets download -d tboyle10/medicaltranscriptions -p data/raw_reports/medical_transcriptions --unzip

echo "Downloading dataset 3/4: Symptom2Disease (Kaggle)"
kaggle datasets download -d niyarrbarman/symptom2disease -p data/raw_reports/symptom2disease --unzip

echo "Downloading dataset 4/4: BC5CDR (Hugging Face)"
python - <<'PY'
from datasets import load_dataset

bc5cdr = load_dataset("bigbio/bc5cdr", "bc5cdr_source")
bc5cdr.save_to_disk("data/annotated/bc5cdr")
print({split: len(bc5cdr[split]) for split in bc5cdr.keys()})
PY

echo "Done. All 4 datasets are placed under data/."
