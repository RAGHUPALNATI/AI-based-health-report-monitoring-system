# AI-based health report monitoring system

AI-based health report monitoring system with a Flask backend and a React frontend.

## Project layout

- `app.py`: Flask API entry point
- `frontend/`: React + Vite dashboard
- `src/`: preprocessing, NER, classification, summarization, and alerting modules
- `train/`: training scripts for NER and classifier models

## Dataset sources

Good starting points for training data are:

- MIMIC-III / MIMIC-IV clinical notes, if you have access approval
- i2b2 challenge datasets for medical entity extraction and de-identification
- NCBI Disease corpus for disease NER
- BC5CDR for disease and chemical/medication entity recognition
- Kaggle, for quick experiments and prototyping datasets

Kaggle is useful for fast prototyping, but it is usually not the best final source for a serious medical NLP system because dataset quality, annotation consistency, and clinical realism vary widely. For production-grade work, prefer clinical corpora like MIMIC, i2b2, BC5CDR, or NCBI Disease, then use Kaggle only as a supplemental source.

## Run order

1. Run `./setup.sh`
2. Start the backend with `python app.py`
3. Start the React frontend inside `frontend/` with `npm run dev`
