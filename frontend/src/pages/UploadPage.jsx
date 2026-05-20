import { useState } from 'react'

export default function UploadPage({ onUpload, loading, error, onBack }) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (file.name.endsWith('.pdf') || file.name.endsWith('.txt')) {
        onUpload(file)
      } else {
        alert('Please upload a PDF or TXT file')
      }
    }
  }

  const handleChange = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      onUpload(files[0])
    }
  }

  return (
    <div className="upload-container">
      {/* Top Navigation */}
      <div className="upload-top-nav">
        {onBack && (
          <button className="back-nav-btn" onClick={onBack}>
            ← Back to Models
          </button>
        )}
      </div>

      <div className="upload-header">
        <h1>📄 Upload Health Report</h1>
        <p className="subtitle">Upload your patient medical report for AI-powered analysis</p>
      </div>

      <div
        className={`upload-box ${dragActive ? 'active' : ''} ${loading ? 'disabled' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Analyzing your report...</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">📥</div>
            <h2>Drag & Drop Your Report</h2>
            <p>or</p>
            <label htmlFor="file-input" className="file-label">
              Click to Browse
            </label>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.txt"
              onChange={handleChange}
              style={{ display: 'none' }}
              disabled={loading}
            />
            <p className="file-hint">Supported formats: PDF, TXT</p>
          </>
        )}
      </div>

      {error && (
        <div className="error-message">
          <span>❌ {error}</span>
        </div>
      )}

      <div className="features">
        <div className="feature-item">
          <span className="feature-icon">🔍</span>
          <p>Advanced NLP Analysis</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🌐</span>
          <p>Multi-Language Support</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">⚠️</span>
          <p>Clinical Alert Detection</p>
        </div>
      </div>
    </div>
  )
}
