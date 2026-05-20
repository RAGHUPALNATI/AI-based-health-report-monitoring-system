import { useState } from 'react'
import './styles.css'
import ModelInfoPage from './pages/ModelInfoPage'
import UploadPage from './pages/UploadPage'
import ProcessingPage from './pages/ProcessingPage'
import SummaryDashboard from './pages/SummaryDashboard'
import DetailedInsightsPage from './pages/DetailedInsightsPage'
import DashboardPage from './pages/DashboardPage'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

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
    
    // Show processing page
    setCurrentPage('processing')

    const formData = new FormData()
    formData.append('file', file)

    try {
      // Simulate some processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000))

      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Analysis failed')
      }

      const result = await response.json()
      setAnalysisResult(result)
      setCurrentPage('summary')
    } catch (err) {
      setError(err.message)
      console.error('Upload error:', err)
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

  return (
    <div className="app-shell">
      {currentPage === 'modelInfo' && (
        <ModelInfoPage onStartUpload={handleStartUpload} />
      )}
      {currentPage === 'upload' && (
        <UploadPage 
          onUpload={handleFileUpload} 
          loading={loading} 
          error={error}
          onBack={handleBackToModelInfo}
        />
      )}
      {currentPage === 'processing' && (
        <ProcessingPage fileName={fileName} />
      )}
      {currentPage === 'summary' && (
        <SummaryDashboard 
          result={analysisResult} 
          onViewDetails={handleViewDetails}
        />
      )}
      {currentPage === 'detailedInsights' && (
        <DetailedInsightsPage 
          result={analysisResult} 
          onBack={handleBackToSummary}
        />
      )}
    </div>
  )
}

export default App
