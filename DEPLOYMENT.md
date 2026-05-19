# Render + Vercel Deployment Guide

## Overview

This project deploys with zero infrastructure setup:
- **Backend**: Flask API → Render (free tier available)
- **Frontend**: React dashboard → Vercel (free tier available)

## Prerequisites

1. GitHub account with this repo
2. Render account (free): https://render.com
3. Vercel account (free): https://vercel.com

## Deploy Backend to Render

### Step 1: Connect Repository to Render

1. Go to https://render.com and sign up/login
2. Click **New** → **Web Service**
3. Connect your GitHub account and select `AI-based-health-report-monitoring-system`

### Step 2: Configure Backend Service

Fill in the form:

| Field | Value |
|-------|-------|
| **Name** | `health-report-backend` |
| **Runtime** | Python 3.11 |
| **Root Directory** | (leave empty) |
| **Build Command** | `pip install -r requirements.txt && python -m spacy download en_core_web_sm` |
| **Start Command** | `gunicorn --bind 0.0.0.0:10000 --workers 2 --timeout 120 app:app` |
| **Plan** | Free |
| **Region** | Oregon (or nearest) |

### Step 3: Deploy

Click **Deploy** and wait ~5 minutes. Copy the backend URL (e.g., `https://health-report-backend-xxxx.onrender.com`).

---

## Deploy Frontend to Vercel

### Step 1: Import Repository to Vercel

1. Go to https://vercel.com and sign up/login
2. Click **Add New** → **Project**
3. Select **Import Git Repository** and choose `AI-based-health-report-monitoring-system`

### Step 2: Configure Frontend

Set these values:

| Field | Value |
|-------|-------|
| **Framework** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Install Command** | `npm install` |
| **Output Directory** | `dist` |

### Step 3: Add Environment Variables

Click **Environment Variables** and add:

```
VITE_API_URL = https://health-report-backend-xxxx.onrender.com
```

(Replace `xxxx` with your actual Render backend domain)

### Step 4: Deploy

Click **Deploy** and wait ~2-3 minutes. Copy your Vercel frontend URL.

---

## After Deployment

### Your Live URLs

| Service | URL |
|---------|-----|
| Frontend | `https://your-project.vercel.app` |
| Backend API | `https://health-report-backend-xxxx.onrender.com` |
| Backend Health | `https://health-report-backend-xxxx.onrender.com/health` |

### Test the System

1. Open frontend URL in browser
2. Paste health report text in clinical text field
3. Click "Run analysis"
4. Verify results display (entities, classification, summary, alerts)

---

## Automatic Redeployment

Both Render and Vercel auto-redeploy on git push to `main`:

```bash
git commit -m "your changes"
git push origin main
```

Frontend deploys in ~2 min, backend in ~5 min.

---

## Troubleshooting

**Backend won't start:**
- Check Render build logs for spaCy download errors
- Ensure models folder exists locally
- Run `python -m spacy download en_core_web_sm` locally first

**Frontend can't reach backend:**
- Verify `VITE_API_URL` env variable in Vercel is correct
- Check Render backend is healthy: visit `/health` URL
- Check browser console for CORS errors

**Models not loading:**
- Ensure `models/report_classifier.joblib` exists in repo
- Ensure `models/ner_model/` exists in repo
- Commit models folder: `git add -f models/`

---

## Cost

| Service | Free Tier | Cost |
|---------|-----------|------|
| Render | 0.5 CPU, 512MB RAM, auto-sleep | $7+/month for always-on |
| Vercel | 100GB bandwidth, auto-scaling | $0 for hobby projects |

Free tier is perfect for development/demo. For production, consider paid plans.

---

## Next Steps

1. ✅ Push code: `git push origin main`
2. ✅ Deploy backend on Render
3. ✅ Deploy frontend on Vercel
4. ✅ Test at live URLs
5. Optional: Add custom domain, SSL, monitoring
