import { useState } from 'react'

const DetailedInsightsPage = ({ result, onBack }) => {
  const [activeLanguage, setActiveLanguage] = useState('en')

  if (!result) {
    return <div className="detailed-insights">Loading...</div>
  }

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' }
  ]

  const getStatusInfo = () => {
    const prediction = result.classification?.prediction || 'unknown'

    if (prediction === 'critical') {
      return { status: 'Critical', color: 'critical', icon: '🚨' }
    } else if (prediction === 'warning') {
      return { status: 'Warning', color: 'warning', icon: '⚠️' }
    } else {
      return { status: 'Normal', color: 'normal', icon: '✅' }
    }
  }

  const statusInfo = getStatusInfo()

  const MODEL_INFO = [
    {
      name: 'NER Model',
      implementation: 'spaCy en_core_web_sm',
      purpose: 'Medical entity extraction',
      metrics: '5009+ patterns'
    },
    {
      name: 'Classifier',
      implementation: 'scikit-learn LR',
      purpose: 'Report classification',
      metrics: '89% accuracy'
    },
    {
      name: 'Summarizer',
      implementation: 'spaCy Segmentation',
      purpose: 'Summary generation',
      metrics: 'Multi-sentence'
    },
    {
      name: 'Translator',
      implementation: 'Translators Library',
      purpose: 'Multi-language support',
      metrics: '4 languages'
    }
  ]

  return (
    <div className="detailed-insights">
      {/* Navigation Bar */}
      <div className="insights-navbar">
        <button className="back-btn" onClick={onBack}>
          ← Back to Summary
        </button>
        <h1>🔬 Detailed Insights & Analysis</h1>
        <div className="spacer"></div>
      </div>

      {/* Language Switcher */}
      <div className="language-switcher">
        <span className="lang-label">View Report In:</span>
        <div className="lang-buttons">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`lang-btn ${activeLanguage === lang.code ? 'active' : ''}`}
              onClick={() => setActiveLanguage(lang.code)}
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="insights-grid">
        {/* Left Column */}
        <div className="insights-left">
          {/* Report Status */}
          <div className="insight-card">
            <h2>📊 Report Status</h2>
            <div className={`status-display ${statusInfo.color}`}>
              <div className="status-icon">{statusInfo.icon}</div>
              <div className="status-details">
                <p className="status-title">{statusInfo.status}</p>
                <p className="status-confidence">
                  Confidence: {(result.classification?.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Clinical Summary */}
          <div className="insight-card">
            <h2>📝 Clinical Summary ({languages.find(l => l.code === activeLanguage)?.name})</h2>
            <div className="summary-box">
              {result.summary?.[activeLanguage] || result.summary?.en || 'Summary not available'}
            </div>
          </div>

          {/* Health Metrics */}
          <div className="insight-card">
            <h2>📈 Health Metrics</h2>
            <div className="metrics-detailed">
              {result.alert_flags && result.alert_flags.length > 0 ? (
                result.alert_flags.map((flag, idx) => (
                  <div key={idx} className={`metric-detail ${flag.triggered ? 'alert' : ''}`}>
                    <div className="metric-header">
                      <span className="metric-name">{flag.metric}</span>
                      <span className="metric-status">{flag.triggered ? '⚠️' : '✓'}</span>
                    </div>
                    <div className="metric-bar">
                      <div
                        className="metric-fill"
                        style={{
                          width: `${Math.min(
                            (flag.value / flag.threshold) * 100,
                            100
                          )}%`
                        }}
                      ></div>
                    </div>
                    <div className="metric-values">
                      <span>Value: {flag.value}</span>
                      <span>Threshold: {flag.threshold}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No metrics available</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="insights-right">
          {/* Medical Entities */}
          <div className="insight-card">
            <h2>🏥 Medical Entities</h2>
            <div className="entities-cloud">
              {result.entities && result.entities.length > 0 ? (
                result.entities.map((entity, idx) => (
                  <div key={idx} className="entity-tag">
                    <span className="entity-text">{entity.text}</span>
                    <span className="entity-type">{entity.label}</span>
                  </div>
                ))
              ) : (
                <p>No entities extracted</p>
              )}
            </div>
          </div>

          {/* Clinical Alerts */}
          <div className="insight-card">
            <h2>⚠️ Clinical Alerts</h2>
            {result.alerts && result.alerts.length > 0 ? (
              <ul className="alerts-detailed">
                {result.alerts.map((alert, idx) => (
                  <li key={idx} className="alert-item">
                    <span className="alert-icon">🔔</span>
                    <span className="alert-text">{alert}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-alerts">✓ No critical alerts detected</p>
            )}
          </div>

          {/* Model Information */}
          <div className="insight-card">
            <h2>🤖 Models Used</h2>
            <div className="models-info">
              {MODEL_INFO.map((model, idx) => (
                <div key={idx} className="model-info-item">
                  <p className="model-name">{model.name}</p>
                  <p className="model-impl">{model.implementation}</p>
                  <p className="model-purpose">{model.purpose}</p>
                  <p className="model-metric">📊 {model.metrics}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="insights-footer">
        <button className="primary-button-large" onClick={onBack}>
          ← Back to Summary
        </button>
      </div>
    </div>
  )
}

export default DetailedInsightsPage
