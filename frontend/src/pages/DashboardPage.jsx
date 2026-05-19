import { useState } from 'react'

export default function DashboardPage({ result, onBack }) {
  const [activeTab, setActiveTab] = useState('en')

  const languages = {
    en: { name: 'English', flag: '🇬🇧' },
    hi: { name: 'Hindi', flag: '🇮🇳' },
    kn: { name: 'Kannada', flag: '🇮🇳' },
    te: { name: 'Telugu', flag: '🇮🇳' },
  }

  if (!result) return null

  return (
    <div className="dashboard-container">
      <button className="back-button" onClick={onBack}>
        ← Back to Upload
      </button>

      <div className="dashboard-header">
        <h1>Analysis Results</h1>
      </div>

      <div className="dashboard-grid">
        {/* Summary Section */}
        <div className="section summary-section">
          <h2>📋 Report Summary</h2>
          <div className="language-tabs">
            {Object.entries(languages).map(([code, lang]) => (
              <button
                key={code}
                className={`tab ${activeTab === code ? 'active' : ''}`}
                onClick={() => setActiveTab(code)}
              >
                {lang.flag} {lang.name}
              </button>
            ))}
          </div>
          <div className="summary-content">
            <p>{result.summary[activeTab] || result.summary.en}</p>
          </div>
        </div>

        {/* Classification */}
        <div className="section">
          <h2>🏷️ Classification</h2>
          <div className="classification-box">
            <div className="classification-label">{result.classification.prediction}</div>
            <div className="confidence">
              Confidence: {(result.classification.confidence * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Alert Flags */}
        {result.alert_flags && result.alert_flags.length > 0 && (
          <div className="section alerts-section">
            <h2>⚠️ Clinical Alerts</h2>
            <div className="alerts-list">
              {result.alert_flags.map((flag, idx) => (
                <div key={idx} className={`alert-item ${flag.triggered ? 'triggered' : ''}`}>
                  <span className="alert-metric">{flag.metric}</span>
                  {flag.value !== undefined && (
                    <span className="alert-value">
                      {flag.value.toFixed(1)} / {flag.threshold.toFixed(1)}
                    </span>
                  )}
                  {flag.triggered && <span className="alert-badge">ALERT</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Entities */}
        {result.entities && result.entities.length > 0 && (
          <div className="section entities-section">
            <h2>🏥 Extracted Entities</h2>
            <div className="entities-list">
              {result.entities.slice(0, 10).map((entity, idx) => (
                <div key={idx} className="entity-item">
                  <span className="entity-text">{entity.text}</span>
                  <span className="entity-label">{entity.label}</span>
                </div>
              ))}
              {result.entities.length > 10 && (
                <p className="text-muted">+{result.entities.length - 10} more</p>
              )}
            </div>
          </div>
        )}

        {/* Alerts Messages */}
        {result.alerts && result.alerts.length > 0 && (
          <div className="section alerts-messages">
            <h2>💬 Alert Messages</h2>
            <ul>
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
