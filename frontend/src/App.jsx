import { useState } from 'react'
import './styles.css'
import UploadPage from './pages/UploadPage'
import DashboardPage from './pages/DashboardPage'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [currentPage, setCurrentPage] = useState('upload')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileUpload = async (file) => {
    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append('file', file)

    try {
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
      setCurrentPage('dashboard')
    } catch (err) {
      setError(err.message)
      console.error('Upload error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToUpload = () => {
    setCurrentPage('upload')
    setAnalysisResult(null)
    setError(null)
  }

  return (
    <div className="app-shell">
      {currentPage === 'upload' ? (
        <UploadPage onUpload={handleFileUpload} loading={loading} error={error} />
      ) : (
        <DashboardPage result={analysisResult} onBack={handleBackToUpload} />
      )}
    </div>
  )
}

export default App
