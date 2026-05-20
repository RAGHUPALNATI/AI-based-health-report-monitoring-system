import { useState } from 'react'
import './styles.css'
import ModelInfoPage from './pages/ModelInfoPage'
import UploadPage from './pages/UploadPage'
import ProcessingPage from './pages/ProcessingPage'
import SummaryDashboard from './pages/SummaryDashboard'
import DetailedInsightsPage from './pages/DetailedInsightsPage'

let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

if (typeof window !== 'undefined' && window.location.hostname.includes('.github.dev')) {
  const codespacesMatch = window.location.hostname.match(/^(.+?)-\d+\.app\.github\.dev$/)

  if (codespacesMatch) {
    const prefix = codespacesMatch[1]
    API_BASE_URL = `https://${prefix}-5000.app.github.dev`
    console.log('Codespaces environment detected. API URL:', API_BASE_URL)
  }
}

const normalizeAnalysisResult = (data) => {
  const summary = typeof data?.summary === 'string' ? { en: data.summary } : data?.summary || {}

  const classification =
    data?.classification && typeof data.classification === 'object'
      ? data.classification
      : {
          prediction: data?.classification || 'unknown',
          confidence: data?.confidence ?? 0
        }

  return {
    ...data,
    summary,
    classification,
    entities: Array.isArray(data?.entities) ? data.entities : [],
    alerts: Array.isArray(data?.alerts) ? data.alerts : [],
    alert_flags: Array.isArray(data?.alert_flags) ? data.alert_flags : []
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState('modelInfo')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fileName, setFileName] = useState('')

  const handleStartUpload = () => {
    setCurrentPage('upload')
    setAnalysisResult(null)
    setError(null)
  }

  const handleFileUpload = async (file) => {
    setFileName(file.name)
    setLoading(true)
    setError(null)
    setCurrentPage('processing')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(errorBody || `Analysis request failed with status ${response.status}`)
      }

      const data = await response.json()
      setAnalysisResult(normalizeAnalysisResult(data))
      setCurrentPage('summary')
    } catch (err) {
      console.error('=== ERROR ===')
      console.error(err)
      setError('Failed to process report')
      setCurrentPage('upload')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = () => {
    setCurrentPage('detailedInsights')
  }

  const handleBackToSummary = () => {
    setCurrentPage('summary')
  }

  const handleBackToModelInfo = () => {
    setCurrentPage('modelInfo')
    setAnalysisResult(null)
    setError(null)
    setFileName('')
  }

  const handleBackToUpload = () => {
    setCurrentPage('upload')
    setAnalysisResult(null)
    setError(null)
  }

  const handleBackToProcessing = () => {
    setCurrentPage('processing')
  }

  return (
    <div className="app-shell">
      {currentPage === 'modelInfo' && <ModelInfoPage onStartUpload={handleStartUpload} />}

      {currentPage === 'upload' && (
        <UploadPage
          onUpload={handleFileUpload}
          loading={loading}
          error={error}
          onBack={handleBackToModelInfo}
        />
      )}

      {currentPage === 'processing' && <ProcessingPage fileName={fileName} onBack={handleBackToUpload} />}

      {currentPage === 'summary' && (
        <SummaryDashboard
          onViewDetails={handleViewDetails}
          onBack={handleBackToProcessing}
        />
      )}

      {currentPage === 'detailedInsights' && (
        <DetailedInsightsPage onBack={handleBackToSummary} />
      )}
    </div>
  )
}

export default App
