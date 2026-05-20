const ProcessingPage = ({ fileName, onBack }) => {
  const steps = [
    {
      id: 'upload',
      name: 'File Upload',
      icon: '📥',
      description: 'Processing file...'
    },
    {
      id: 'ocr',
      name: 'OCR Extraction',
      icon: '🔍',
      description: 'Extracting text from document...'
    },
    {
      id: 'preprocessing',
      name: 'Text Preprocessing',
      icon: '⚙️',
      description: 'Cleaning and normalizing text...'
    },
    {
      id: 'nlp',
      name: 'NLP Analysis',
      icon: '🧠',
      description: 'Analyzing medical entities...'
    },
    {
      id: 'classification',
      name: 'Classification',
      icon: '🎯',
      description: 'Classifying health status...'
    },
    {
      id: 'translation',
      name: 'Translation',
      icon: '🌐',
      description: 'Translating to multiple languages...'
    }
  ]

  return (
    <div className="processing-page">
      {/* Back Button */}
      {onBack && (
        <button className="back-btn" onClick={onBack} style={{ marginBottom: '24px' }}>
          ← Back
        </button>
      )}

      {/* Header */}
      <div className="processing-header">
        <h1>🔄 Analyzing Health Report</h1>
        <p>{fileName}</p>
      </div>

      {/* Processing Steps */}
      <div className="processing-container">
        <div className="processing-steps">
          {steps.map((step, index) => (
            <div key={step.id} className="processing-step">
              <div className="step-content">
                <div className="step-icon">{step.icon}</div>
                <div className="step-info">
                  <h3>{step.name}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
              <div className="step-status">
                <div className="step-dot animated-dot"></div>
              </div>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <p className="progress-text">Processing your medical report...</p>
        </div>

        {/* Processing Details */}
        <div className="processing-details">
          <h3>📋 Processing Details</h3>
          <div className="details-list">
            <div className="detail-item">
              <span className="detail-label">File Type:</span>
              <span className="detail-value">{fileName?.split('.').pop()?.toUpperCase() || 'PDF/TXT'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Processing Engine:</span>
              <span className="detail-value">PyMuPDF (fitz) + spaCy NLP</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Models Active:</span>
              <span className="detail-value">4 (NER, Classifier, Summarizer, Translator)</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Output Languages:</span>
              <span className="detail-value">English, Hindi, Kannada, Telugu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tip */}
      <div className="processing-tip">
        <p>💡 <strong>Tip:</strong> This analysis uses advanced NLP to extract medical entities, classify health status, and generate multi-language summaries.</p>
      </div>
    </div>
  )
}

export default ProcessingPage
