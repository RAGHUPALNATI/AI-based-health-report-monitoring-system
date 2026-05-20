const SummaryDashboard = ({ result, onViewDetails, onBack }) => {
  if (!result) {
    return <div className="summary-dashboard">Loading...</div>
  }

  // Determine status based on classification
  const getStatusInfo = () => {
    const confidence = result.classification?.confidence || 0
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

  // Get key metrics
  const getKeyMetrics = () => {
    const metrics = []
    if (result.alert_flags && result.alert_flags.length > 0) {
      result.alert_flags.forEach((flag) => {
        metrics.push({
          metric: flag.metric,
          value: flag.value,
          threshold: flag.threshold,
          triggered: flag.triggered
        })
      })
    }
    return metrics
  }

  const keyMetrics = getKeyMetrics()

  return (
    <div className="summary-dashboard">
      {/* Back Button */}
      {onBack && (
        <button className="back-btn" onClick={onBack} style={{ marginBottom: '24px' }}>
          ← Back
        </button>
      )}

      {/* Header */}
      <div className="summary-header">
        <h1>📊 Health Summary</h1>
        <p>Analysis Complete - Overview of Your Medical Report</p>
      </div>

      {/* Status Card */}
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
          <div className="confidence-value">
            {(result.classification?.confidence * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
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

      {/* Key Health Metrics */}
      {keyMetrics.length > 0 && (
        <div className="metrics-summary">
          <h3>📋 Key Health Metrics</h3>
          <div className="metrics-list">
            {keyMetrics.map((metric, idx) => (
              <div key={idx} className={`metric-row ${metric.triggered ? 'alert' : ''}`}>
                <span className="metric-name">{metric.metric}</span>
                <span className="metric-details">
                  {metric.value} / {metric.threshold}
                </span>
                <span className="metric-status">
                  {metric.triggered ? '⚠️ Alert' : '✓ Normal'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Preview */}
      <div className="summary-preview">
        <h3>📝 Report Summary (English)</h3>
        <p className="preview-text">
          {result.summary?.en?.substring(0, 300)}...
        </p>
      </div>

      {/* CTA Button */}
      <div className="summary-cta">
        <button className="primary-button-large" onClick={onViewDetails}>
          ➜ View Detailed Insights & Language Options
        </button>
      </div>
    </div>
  )
}

export default SummaryDashboard
