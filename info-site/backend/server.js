// Install dependencies first:
// npm install express cors dotenv @google/generative-ai
//TODO: Rewrite in a way I understand and can implement on my own (gain a better udnerstanding of the model)

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Main prompt analysis endpoint
app.post('/api/analyze-prompt', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Prompt is required and must be a non-empty string'
      });
    }

    if (prompt.length > 5000) {
      return res.status(400).json({
        error: 'Prompt too long',
        message: 'Prompt must be under 5000 characters'
      });
    }

    // Initialize the model (use gemini-1.5-pro)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Create the analysis prompt
    const analysisPrompt = `You are an expert at analyzing prompts for AI coding assistants. Analyze the following prompt and provide structured feedback in JSON format.

Prompt to analyze:
"""
${prompt}
"""

Respond with ONLY a valid JSON object (no markdown, no preamble, no backticks) with this exact structure:
{
  "overallScore": <number between 1-10>,
  "strengths": [<array of 2-3 strength strings>],
  "weaknesses": [<array of 2-3 weakness strings>],
  "improvements": [<array of 2-3 specific improvement suggestions>],
  "improvedPrompt": "<a rewritten version of the prompt that incorporates best practices>"
}

Focus on coding-specific prompt quality: clarity, specificity, context, expected output format, and technical requirements.`;

    // Generate response
    const result = await model.generateContent(analysisPrompt);
    const response = await result.response;
    const text = response.text();

    // Clean and parse the response
    let cleanText = text.trim();
    
    // Remove markdown code blocks if present
    cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Try to parse JSON
    let analysis;
    try {
      analysis = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw response:', text);
      
      return res.status(500).json({
        error: 'Failed to parse AI response',
        message: 'The AI returned an invalid format. Please try again.'
      });
    }

    // Validate the response structure
    if (!analysis.overallScore || !analysis.strengths || !analysis.weaknesses || 
        !analysis.improvements || !analysis.improvedPrompt) {
      return res.status(500).json({
        error: 'Invalid AI response structure',
        message: 'The AI response was missing required fields'
      });
    }

    // Return the analysis
    res.json({
      success: true,
      analysis: analysis
    });

  } catch (error) {
    console.error('Error analyzing prompt:', error);
    
    // Handle rate limiting
    if (error.message && error.message.includes('quota')) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'API quota exceeded. Please try again later.'
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to analyze prompt. Please try again.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Gemini API Key configured: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
});

export default app;
