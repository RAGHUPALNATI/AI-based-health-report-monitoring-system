import { useState } from 'react'

const MODEL_INFO = {
  ner: {
    name: 'Named Entity Recognition',
    model: 'spaCy en_core_web_sm',
    purpose: 'Extracts medical entities like symptoms, diseases, and medications',
  },
  classifier: {
    name: 'Text Classifier',
    model: 'scikit-learn Logistic Regression',
    purpose: 'Classifies report severity (normal, warning, critical)',
    accuracy: '89%',
  },
  summarizer: {
    name: 'Extractive Summarizer',
    model: 'spaCy Sentence Segmentation',
    purpose: 'Extracts key sentences for quick summary',
  },
  translator: {
    name: 'Neural Machine Translator',
    model: 'Translators Library',
    purpose: 'Translates summaries to regional languages',
  },
}

const DATASET_INFO = {
  medquad: {
    name: 'MedQuAD',
    records: '47,000+',
    description: 'Medical QA pairs for training',
  },
  transcriptions: {
    name: 'Medical Transcriptions',
    records: '5,000+',
    description: 'Clinical transcription dataset',
  },
  symptom2disease: {
    name: 'Symptom to Disease',
    records: '5,000+',
    description: 'Symptom mapping dataset',
  },
}

export default function DashboardPage({ result, onBack }) {
  const [activeTab, setActiveTab] = useState('en')
  const [showModelInfo, setShowModelInfo] = useState(false)

  const languages = {
    en: { name: 'English', flag: '🇬🇧' },
    hi: { name: 'हिंदी', flag: '🇮🇳' },
    kn: { name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    te: { name: 'తెలుగు', flag: '🇮🇳' },
  }

  if (!result) return null

  return (
    <div className="dashboard-container">
      <div className="dashboard-top-bar">
        <button className="back-button" onClick={onBack}>
          ← Back to Upload
        </button>
        <button 
          className="info-button" 
          onClick={() => setShowModelInfo(!showModelInfo)}
          title="View models and datasets used"
        >
          ℹ️ Model & Data Info
        </button>
      </div>

      {showModelInfo && (
        <div className="info-panel">
          <div className="info-content">
            <div className="info-section">
              <h3>🤖 ML Models Used</h3>
              <div className="models-grid">
                {Object.entries(MODEL_INFO).map(([key, model]) => (
                  <div key={key} className="model-card">
                    <div className="model-title">{model.name}</div>
                    <div className="model-detail">
                      <strong>Model:</strong> {model.model}
                    </div>
                    <div className="model-detail">
                      <strong>Purpose:</strong> {model.purpose}
                    </div>
                    {model.accuracy && (
                      <div className="model-detail">
                        <strong>Accuracy:</strong> {model.accuracy}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="info-section">
              <h3>📊 Training Datasets</h3>
              <div className="datasets-grid">
                {Object.entries(DATASET_INFO).map(([key, dataset]) => (
                  <div key={key} className="dataset-card">
                    <div className="dataset-name">{dataset.name}</div>
                    <div className="dataset-count">{dataset.records} records</div>
                    <div className="dataset-desc">{dataset.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-header">
        <h1>📋 Analysis Results</h1>
        <p className="header-subtitle">AI-powered health report analysis and monitoring</p>
      </div>

      <div className="language-selector">
        <span className="language-label">View in:</span>
        {Object.entries(languages).map(([code, lang]) => (
          <button
            key={code}
            className={`lang-button ${activeTab === code ? 'active' : ''}`}
            onClick={() => setActiveTab(code)}
          >
            {lang.flag} {lang.name}
          </button>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Report Details */}
        <div className="section report-details">
          <h2>📑 Report Analysis</h2>
          <div className="detail-box">
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value {result.classification.prediction.toLowerCase()}">
                {result.classification.prediction.toUpperCase()}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Confidence:</span>
              <div className="confidence-bar">
                <div 
                  className="confidence-fill" 
                  style={{ width: `${result.classification.confidence * 100}%` }}
                ></div>
                <span className="confidence-text">
                  {(result.classification.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="detail-row">
              <span className="detail-label">Analysis Type:</span>
              <span className="detail-value">NLP-based Medical Report</span>
            </div>
          </div>
        </div>

        {/* Health Monitoring */}
        <div className="section health-monitoring">
          <h2>❤️ Health Monitoring</h2>
          {result.alert_flags && result.alert_flags.length > 0 ? (
            <div className="monitoring-list">
              {result.alert_flags.map((flag, idx) => (
                <div key={idx} className={`monitoring-item ${flag.triggered ? 'alert' : 'normal'}`}>
                  <div className="monitoring-status">
                    <span className="status-dot"></span>
                    <span className="monitoring-metric">{flag.metric}</span>
                  </div>
                  {flag.value !== undefined && (
                    <div className="monitoring-values">
                      <span className="value">{flag.value.toFixed(1)}</span>
                      <span className="divider">/</span>
                      <span className="threshold">{flag.threshold.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-alerts">✅ All values within normal range</p>
          )}
        </div>

        {/* Summary Section */}
        <div className="section summary-section">
          <h2>📝 Clinical Summary</h2>
          <div className="summary-content">
            <p>{result.summary[activeTab] || result.summary.en}</p>
          </div>
        </div>

        {/* Extracted Entities */}
        {result.entities && result.entities.length > 0 && (
          <div className="section entities-section">
            <h2>🏥 Medical Entities</h2>
            <div className="entities-cloud">
              {result.entities.slice(0, 15).map((entity, idx) => (
                <span key={idx} className={`entity-badge entity-${entity.label.toLowerCase()}`}>
                  {entity.text}
                  <small>{entity.label}</small>
                </span>
              ))}
              {result.entities.length > 15 && (
                <span className="entity-more">+{result.entities.length - 15} more</span>
              )}
            </div>
          </div>
        )}

        {/* Clinical Alerts */}
        {result.alerts && result.alerts.length > 0 && (
          <div className="section alerts-section">
            <h2>⚠️ Clinical Alerts</h2>
            <ul className="alerts-list">
              {result.alerts.map((alert, idx) => (
                <li key={idx}>{alert}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

