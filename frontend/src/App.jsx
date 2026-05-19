import { useMemo, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const defaultValues = JSON.stringify(
  {
    glucose: 180,
    hemoglobin: 10.8,
    wbc: 12200,
  },
  null,
  2,
)

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Analyzing your report...</p>
  </div>
)

function App() {
  const [text, setText] = useState(
    'Patient reports chest pain, elevated glucose, and prescribed metformin. WBC remains high.',
  )
  const [values, setValues] = useState(defaultValues)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const summaryHint = useMemo(
    () => 'Paste a clinical note, lab report, or discharge summary to analyze it.',
    [],
  )

  const analyzeReport = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      let parsedValues = {}
      try {
        parsedValues = JSON.parse(values || '{}')
      } catch {
        throw new Error('Lab values must be valid JSON')
      }

      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_text: text, values: parsedValues }),
      })

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null)
        const message = errorPayload?.error || `Request failed with status ${response.status}`
        throw new Error(message)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to analyze report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <main className="dashboard">
        <section className="hero-card">
          <div>
            <p className="eyebrow">AI-based health report monitoring</p>
            <h1>Surface clinical risks before they become critical.</h1>
            <p className="hero-copy">
              FastAPI powers the analysis engine, while React provides an interactive
              triage dashboard for text, entities, summaries, and threshold alerts.
            </p>
          </div>
          <div className="status-pill">{summaryHint}</div>
        </section>

        <section className="grid-layout">
          <form className="panel editor-panel" onSubmit={analyzeReport}>
            <label>
              Clinical text
              <textarea value={text} onChange={(event) => setText(event.target.value)} rows={8} />
            </label>

            <label>
              Lab values JSON
              <textarea value={values} onChange={(event) => setValues(event.target.value)} rows={8} />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Analyzing...
                </>
              ) : (
                'Run analysis'
              )}
            </button>

            {error ? <p className="error-text">{error}</p> : null}
          </form>

          <aside className="panel result-panel">
            <h2>Analysis result</h2>
            {result ? (
              <div className="result-stack">
                <div>
                  <h3>Summary</h3>
                  <p>{result.summary}</p>
                </div>

                <div>
                  <h3>Classification</h3>
                  <p>
                    {result.classification?.label || 'unknown'}
                    {' '}
                    (
                    {typeof result.classification?.confidence === 'number'
                      ? `${(result.classification.confidence * 100).toFixed(1)}% confidence`
                      : 'confidence unavailable'}
                    )
                  </p>
                </div>

                <div>
                  <h3>Alerts</h3>
                  {(result.alert_flags || []).length ? (
                    <ul>
                      {result.alert_flags.map((flag, index) => (
                        <li key={`${flag.metric}-${index}`}>
                          {flag.metric}: {flag.triggered ? 'triggered' : 'normal'}
                          {typeof flag.value === 'number' ? ` (${flag.value})` : ''}
                        </li>
                      ))}
                    </ul>
                  ) : (result.alerts || []).length ? (
                    <ul>{result.alerts.map((alert, index) => <li key={`${alert}-${index}`}>{alert}</li>)}</ul>
                  ) : (
                    <p>No critical alerts triggered.</p>
                  )}
                </div>

                <div>
                  <h3>Extracted entities</h3>
                  {result.entities.length ? (
                    <ul>
                      {result.entities.map((entity, index) => (
                        <li key={`${entity.text}-${index}`}>
                          {entity.text} - {entity.label}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No entities detected.</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="muted-text">Run a report to see the extracted results here.</p>
            )}
          </aside>
        </section>
      </main>
    </div>
  )
}

export default App
