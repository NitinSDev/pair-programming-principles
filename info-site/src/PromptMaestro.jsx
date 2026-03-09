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
          <div className="maestro-error">
            <strong>Error:</strong> {error}
          </div>
        )}
        {analysis && (
          <div className="maestro-analysis">
            <div className="maestro-score-box">
              <span className="maestro-score-label">Overall Score:</span>
              <span className="maestro-score-value">{analysis.overallScore}/10</span>
            </div>
            
            <div className="maestro-section">
              <h3>Strengths:</h3>
              <ul className="maestro-list">
                {analysis.strengths.map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>
            </div>

            <div className="maestro-section">
              <h3>Weaknesses:</h3>
              <ul className="maestro-list">
                {analysis.weaknesses.map((weakness, i) => (
                  <li key={i}>{weakness}</li>
                ))}
              </ul>
            </div>

            <div className="maestro-section">
              <h3>Improvements:</h3>
              <ul className="maestro-list">
                {analysis.improvements.map((improvement, i) => (
                  <li key={i}>{improvement}</li>
                ))}
              </ul>
            </div>

            <div className="maestro-section">
              <h3>Improved Prompt:</h3>
              <div className="maestro-improved-prompt">
                {analysis.improvedPrompt}
              </div>
            </div>
          </div>
        )}
        {!analysis && !error && !loading && (
          <p className="maestro-placeholder">Enter a prompt and click "Analyze Prompt" to get feedback</p>
        )}
      </div>
    </div>
  )
}

export default PromptMaestro