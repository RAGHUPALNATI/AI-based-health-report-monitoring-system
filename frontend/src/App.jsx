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
      console.log('=== UPLOAD START ===')
      console.log('API Base URL:', API_BASE_URL)
      console.log('File:', file.name, file.type, file.size)
      
      // Simulate some processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000))

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const analyzeUrl = `${API_BASE_URL}/analyze`
      console.log('Fetching from:', analyzeUrl)
      
      const response = await fetch(analyzeUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      console.log('Response received:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Error response:', errorData)
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const result = await response.json()
      console.log('Analysis result received:', result)
      setAnalysisResult(result)
      setCurrentPage('summary')
    } catch (err) {
      console.error('=== ERROR CAUGHT ===')
      console.error('Error name:', err.name)
      console.error('Error message:', err.message)
      console.error('Error stack:', err.stack)
      console.error('Full error:', err)
      setError(err.message || 'Failed to fetch - please try again')
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
