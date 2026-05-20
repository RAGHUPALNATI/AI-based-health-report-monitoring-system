import { useState } from 'react'
import './styles.css'
import ModelInfoPage from './pages/ModelInfoPage'
import UploadPage from './pages/UploadPage'
import ProcessingPage from './pages/ProcessingPage'
import SummaryDashboard from './pages/SummaryDashboard'
import DetailedInsightsPage from './pages/DetailedInsightsPage'
import DashboardPage from './pages/DashboardPage'

// Determine API base URL based on environment
let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// If running in GitHub Codespaces, construct the proper URL
if (typeof window !== 'undefined' && window.location.hostname.includes('.github.dev')) {
  const codespacesMatch = window.location.hostname.match(/^(.+?)-\d+\.app\.github\.dev$/)

  if (codespacesMatch) {
    const prefix = codespacesMatch[1]
    API_BASE_URL = `https://${prefix}-5000.app.github.dev`
    console.log('Codespaces environment detected. API URL:', API_BASE_URL)
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

    // Show processing page
    setCurrentPage('processing')

    try {
      console.log('=== MOCK AI ANALYSIS START ===')

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 4000))

      // MOCK RESULT BASED ON YOUR PDF REPORT
      const mockResult = {
        classification: {
          prediction: 'warning',
          confidence: 0.91
        },

        summary: {
          en: 'Patient shows high diabetes risk, mild hypertension, possible anemia, and elevated cholesterol levels. Blood pressure and glucose levels are above normal range.',

          hi: 'रोगी में मधुमेह का उच्च जोखिम, हल्का उच्च रक्तचाप, संभावित एनीमिया और उच्च कोलेस्ट्रॉल स्तर पाए गए हैं।',

          kn: 'ರೋಗಿಯಲ್ಲಿ ಹೆಚ್ಚಿನ ಮಧುಮೇಹ ಅಪಾಯ, ಸೌಮ್ಯ ರಕ್ತದೊತ್ತಡ ಮತ್ತು ಹೆಚ್ಚಿನ ಕೊಲೆಸ್ಟ್ರಾಲ್ ಮಟ್ಟಗಳು ಕಂಡುಬಂದಿವೆ.',

          te: 'రోగిలో అధిక మధుమేహ ప్రమాదం, తేలికపాటి రక్తపోటు మరియు అధిక కొలెస్ట్రాల్ స్థాయిలు గుర్తించబడ్డాయి.'
        },

        entities: [
          {
            text: 'Diabetes',
            label: 'CONDITION'
          },
          {
            text: 'Hypertension',
            label: 'CONDITION'
          },
          {
            text: 'Anemia',
            label: 'CONDITION'
          },
          {
            text: 'Cholesterol',
            label: 'METRIC'
          },
          {
            text: 'Glucose',
            label: 'METRIC'
          },
          {
            text: 'Hemoglobin',
            label: 'METRIC'
          }
        ],

        alerts: [
          {
            severity: 'high',
            message: 'Blood glucose level critically elevated'
          },
          {
            severity: 'medium',
            message: 'Blood pressure above normal range'
          },
          {
            severity: 'medium',
            message: 'Hemoglobin below normal level'
          }
        ],

        alert_flags: [
          {
            metric: 'systolic_bp',
            value: 150,
            threshold: 140,
            triggered: true
          },
          {
            metric: 'diastolic_bp',
            value: 95,
            threshold: 90,
            triggered: true
          },
          {
            metric: 'glucose',
            value: 238,
            threshold: 110,
            triggered: true
          },
          {
            metric: 'cholesterol',
            value: 245,
            threshold: 200,
            triggered: true
          },
          {
            metric: 'hemoglobin',
            value: 8.9,
            threshold: 13,
            triggered: true
          }
        ]
      }

      console.log('Mock analysis result:', mockResult)

      setAnalysisResult(mockResult)
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
        <ProcessingPage
          fileName={fileName}
          onBack={handleBackToUpload}
        />
      )}

      {currentPage === 'summary' && (
        <SummaryDashboard
          result={analysisResult}
          onViewDetails={handleViewDetails}
          onBack={handleBackToProcessing}
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
