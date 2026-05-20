import hardcodedResult from '../data/hardcodedResult'

const SummaryDashboard = ({ onViewDetails, onBack }) => {
  const result = hardcodedResult

  if (!result) return <div className="summary-dashboard">Loading...</div>

  const getStatusInfo = () => {
    const confidence = result.classification?.confidence || 0
    const prediction = result.classification?.prediction || 'unknown'

    if (prediction === 'critical') return { status: 'Critical', color: 'critical', icon: '🚨' }
    if (prediction === 'warning') return { status: 'Warning', color: 'warning', icon: '⚠️' }
    return { status: 'Normal', color: 'normal', icon: '✅' }
  }

  const statusInfo = getStatusInfo()

  const keyMetrics = (result.alert_flags || []).map((flag) => ({
    metric: flag.metric,
    value: flag.value,
    threshold: flag.threshold,
    triggered: flag.triggered
  }))

  const summaryText = typeof result.summary === 'string' ? result.summary : result.summary?.en || ''

  return (
    <div className="summary-dashboard">
      {onBack && (
        <button className="back-btn" onClick={onBack} style={{ marginBottom: '24px' }}>
          ← Back
        </button>
      )}

      <div className="summary-header">
        <h1>📊 Health Summary</h1>
        <p>Analysis Complete - Overview of Your Medical Report</p>
      </div>

      <div className="status-card-large">
        <div className={`status-badge-large ${statusInfo.color}`}>
          {statusInfo.icon} {statusInfo.status}
        </div>
        <div className="status-info">
          <h2>Report Classification</h2>
          <p>Your health report has been classified with high confidence</p>
        </div>
        <div className="confidence-display">
          <div className="confidence-label">Confidence Score</div>
          <div className="confidence-value">{(result.classification?.confidence * 100).toFixed(1)}%</div>
        </div>
      </div>

      <div className="quick-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔎</div>
          <div className="stat-content">
            <p className="stat-label">Entities Found</p>
            <p className="stat-number">{result.entities?.length || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <p className="stat-label">Alerts Triggered</p>
            <p className="stat-number">{result.alerts?.length || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <p className="stat-label">Key Metrics</p>
            <p className="stat-number">{keyMetrics.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌐</div>
          <div className="stat-content">
            <p className="stat-label">Languages</p>
            <p className="stat-number">4</p>
          </div>
        </div>
      </div>

      {keyMetrics.length > 0 && (
        <div className="metrics-summary">
          <h3>📋 Key Health Metrics</h3>
          <div className="metrics-list">
            {keyMetrics.map((metric, idx) => (
              <div key={idx} className={`metric-row ${metric.triggered ? 'alert' : ''}`}>
                <span className="metric-name">{metric.metric}</span>
                <span className="metric-details">{metric.value} / {metric.threshold}</span>
                <span className="metric-status">{metric.triggered ? '⚠️ Alert' : '✓ Normal'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="summary-preview">
        <h3>📝 Report Summary (English)</h3>
        <p className="preview-text">{summaryText.substring(0, 300)}{summaryText.length > 300 ? '...' : ''}</p>
      </div>

      <div className="summary-cta">
        <button className="primary-button-large" onClick={onViewDetails}>➜ View Detailed Insights & Language Options</button>
      </div>
    </div>
  )
}

export default SummaryDashboard
