export const analyzePrompt = async (prompt) => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  
  const response = await fetch(`${API_URL}/api/analyze-prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to analyze prompt');
  }

  const data = await response.json();
  return data.analysis;
};