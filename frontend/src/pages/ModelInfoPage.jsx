import { useState } from 'react'

const ModelInfoPage = ({ onStartUpload, onBack }) => {
  const [activeTab, setActiveTab] = useState('models')

  const MODEL_INFO = [
    {
      id: 'ner',
      name: 'NER Model',
      implementation: 'spaCy en_core_web_sm',
      purpose: 'Named Entity Recognition',
      details: 'Extracts medical entities (conditions, medications, tests, procedures) from clinical reports',
      metrics: '5009+ medical entity patterns'
    },
    {
      id: 'classifier',
      name: 'Classification Model',
      implementation: 'scikit-learn Logistic Regression',
      purpose: 'Report Classification',
      details: 'Classifies health reports as critical, warning, or normal with confidence scoring',
      metrics: '89% accuracy on test set'
    },
    {
      id: 'summarizer',
      name: 'Summarization Model',
      implementation: 'spaCy Sentence Segmentation',
      purpose: 'Clinical Summary Generation',
      details: 'Segments and summarizes key findings from medical reports',
      metrics: 'Multi-sentence extraction'
    },
    {
      id: 'translator',
      name: 'Translation Model',
      implementation: 'Translators Library',
      purpose: 'Multi-Language Support',
      details: 'Converts English summaries to Hindi, Kannada, and Telugu',
      metrics: 'Supports 4 languages'
    }
  ]

  const DATASET_INFO = [
    {
      name: 'MedQuAD',
      records: '47,000+',
      description: 'Medical question-answer dataset with diverse clinical conditions and symptoms'
    },
    {
      name: 'Medical Transcriptions',
      records: '5,000+',
      description: 'Real clinical transcriptions and medical reports for training'
    },
    {
      name: 'Symptom to Disease',
      records: '5,000+',
      description: 'Curated medical datasets mapping symptoms to corresponding diseases'
    }
  ]

  return (
    <div className="model-info-page">
      {/* Back Button */}
      {onBack && (
        <button className="back-btn" onClick={onBack} style={{ marginBottom: '24px' }}>
          ← Back
        </button>
      )}

      {/* Hero Section */}
      <div className="info-hero">
        <h1>🏥 AI Health Report Monitoring System</h1>
        <p>Advanced NLP & ML-powered analysis of medical reports</p>
      </div>

      {/* Tab Navigation */}
      <div className="info-tabs">
        <button
          className={`tab-button ${activeTab === 'models' ? 'active' : ''}`}
          onClick={() => setActiveTab('models')}
        >
          📊 ML Models
        </button>
        <button
          className={`tab-button ${activeTab === 'datasets' ? 'active' : ''}`}
          onClick={() => setActiveTab('datasets')}
        >
          📚 Training Datasets
        </button>
        <button
          className={`tab-button ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          ⚡ Features
        </button>
      </div>

      {/* Content Sections */}
      <div className="info-content">
        {/* Models Section */}
        {activeTab === 'models' && (
          <div className="info-section animated-section">
            <h2>Machine Learning Models</h2>
            <div className="models-grid">
              {MODEL_INFO.map((model) => (
                <div key={model.id} className="model-card-large">
                  <div className="card-header">
                    <h3>{model.name}</h3>
                  </div>
                  <div className="card-body">
                    <p className="impl"><strong>Implementation:</strong> {model.implementation}</p>
                    <p className="purpose"><strong>Purpose:</strong> {model.purpose}</p>
                    <p className="details">{model.details}</p>
                    <p className="metrics"><strong>Metrics:</strong> {model.metrics}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Datasets Section */}
        {activeTab === 'datasets' && (
          <div className="info-section animated-section">
            <h2>Training Datasets</h2>
            <p className="section-subtitle">Models trained on 62,000+ curated medical records</p>
            <div className="datasets-grid-large">
              {DATASET_INFO.map((dataset, idx) => (
                <div key={idx} className="dataset-card-large">
                  <h3>{dataset.name}</h3>
                  <p className="record-count">{dataset.records} Records</p>
                  <p className="description">{dataset.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        {activeTab === 'features' && (
          <div className="info-section animated-section">
            <h2>Key Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📄</div>
                <h3>File Upload</h3>
                <p>Support for PDF and TXT medical reports with advanced OCR extraction</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3>NLP Analysis</h3>
                <p>Automatic entity extraction and clinical pattern recognition</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚠️</div>
                <h3>Alert Detection</h3>
                <p>Real-time health alerts for critical vital signs and conditions</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🌐</div>
                <h3>Multi-Language</h3>
                <p>Results available in English, Hindi, Kannada, and Telugu</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Health Dashboard</h3>
                <p>Comprehensive health metrics and monitoring with visual insights</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3>Classification</h3>
                <p>AI-powered report classification with confidence scoring</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="info-cta">
        <button className="primary-button" onClick={onStartUpload}>
          ➜ Start Upload & Analysis
        </button>
      </div>

      {/* Footer Info */}
      <div className="info-footer">
        <p>Built with Flask, spaCy, scikit-learn, and React</p>
      </div>
    </div>
  )
}

export default ModelInfoPage
