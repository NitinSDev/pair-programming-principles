import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async (req, context) => {
  console.log('GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY);
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { prompt } = await req.json();

    // Validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request',
          message: 'Prompt is required and must be a non-empty string'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (prompt.length > 5000) {
      return new Response(
        JSON.stringify({
          error: 'Prompt too long',
          message: 'Prompt must be under 5000 characters'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize the model
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
    cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    let analysis;
    try {
      analysis = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw response:', text);

      return new Response(
        JSON.stringify({
          error: 'Failed to parse AI response',
          message: 'The AI returned an invalid format. Please try again.'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate the response structure
    if (!analysis.overallScore || !analysis.strengths || !analysis.weaknesses ||
      !analysis.improvements || !analysis.improvedPrompt) {
      return new Response(
        JSON.stringify({
          error: 'Invalid AI response structure',
          message: 'The AI response was missing required fields'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return the analysis
    return new Response(
      JSON.stringify({ success: true, analysis }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error analyzing prompt:', error);

    // Handle rate limiting
    if (error.message && error.message.includes('quota')) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'API quota exceeded. Please try again later.'
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generic error response
    return new Response(
      JSON.stringify({
        error: 'Server error',
        message: error.message || 'Failed to analyze prompt. Please try again.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
