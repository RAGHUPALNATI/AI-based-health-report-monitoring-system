#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="${ROOT_DIR}/.venv"

python3 -m venv "${VENV_DIR}"
source "${VENV_DIR}/bin/activate"

python -m pip install --upgrade pip
python -m pip install -r "${ROOT_DIR}/requirements.txt"
python -m spacy download en_core_web_sm
python -m pip install https://s3-us-west-2.amazonaws.com/ai2-s2-scispacy/models/en_ner_bc5cdr_md-0.5.4.tar.gz

if command -v npm >/dev/null 2>&1; then
  (cd "${ROOT_DIR}/frontend" && npm install)
else
  echo "npm not found; skip frontend dependency installation."
fi

mkdir -p \
  "${ROOT_DIR}/data/raw" \
  "${ROOT_DIR}/data/annotated" \
  "${ROOT_DIR}/models/ner_model" \
  "${ROOT_DIR}/models/classifier" \
  "${ROOT_DIR}/outputs"
