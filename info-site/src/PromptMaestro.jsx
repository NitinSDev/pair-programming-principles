import { useState } from 'react'

function PromptMaestro() {
  const [prompt, setPrompt] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyzePrompt = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to analyze')
      return
    }

    setLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const response = await fetch('/.netlify/functions/analyze-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to analyze prompt')
      }

      setAnalysis(data.analysis)
    } catch (err) {
      setError(err.message || 'Error analyzing prompt. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      analyzePrompt()
    }
  }

  return (
    <div className="playground">
      <div className="playground-editors">
        <div className="playground-panel">
          <h2>Your Prompt</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            className="playground-textarea"
            placeholder="Enter your coding prompt here... (Ctrl+Enter to analyze)"
          />
        </div>
      </div>
      <button 
        className="playground-run-button" 
        onClick={analyzePrompt}
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze Prompt'}
      </button>
      <div className="playground-output">
        <h2>Feedback</h2>
        {error && (
          <div style={{ color: '#fca5a5', padding: '10px', backgroundColor: '#7f1d1d', border: '1px solid #991b1b', borderRadius: '4px' }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        {analysis && (
          <div style={{ padding: '10px', color: '#e5e7eb' }}>
            <div style={{ marginBottom: '15px', color: '#f9fafb' }}>
              <strong style={{ color: '#38bdf8' }}>Overall Score:</strong> <span style={{ color: '#7dd3fc' }}>{analysis.overallScore}/10</span>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ color: '#f9fafb', marginBottom: '0.5rem' }}>Strengths:</h3>
              <ul style={{ color: '#e5e7eb' }}>
                {analysis.strengths.map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ color: '#f9fafb', marginBottom: '0.5rem' }}>Weaknesses:</h3>
              <ul style={{ color: '#e5e7eb' }}>
                {analysis.weaknesses.map((weakness, i) => (
                  <li key={i}>{weakness}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ color: '#f9fafb', marginBottom: '0.5rem' }}>Improvements:</h3>
              <ul style={{ color: '#e5e7eb' }}>
                {analysis.improvements.map((improvement, i) => (
                  <li key={i}>{improvement}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ color: '#f9fafb', marginBottom: '0.5rem' }}>Improved Prompt:</h3>
              <p style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', padding: '10px', borderRadius: '4px', whiteSpace: 'pre-wrap', color: '#f9fafb' }}>
                {analysis.improvedPrompt}
              </p>
            </div>
          </div>
        )}
        {!analysis && !error && !loading && (
          <p style={{ color: '#9ca3af' }}>Enter a prompt and click "Analyze Prompt" to get feedback</p>
        )}
      </div>
    </div>
  )
}

export default PromptMaestro