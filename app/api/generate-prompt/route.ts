import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, aiTool } = await request.json();

    // Validate required fields
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // For demonstration, we'll simulate the OpenAI API call
    // In production, you would replace this with actual OpenAI API integration
    
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      // If no API key is configured, return the formatted prompt directly
      return NextResponse.json({
        generatedPrompt: prompt,
        message: 'API key not configured. Returning formatted prompt.'
      });
    }

    // Real OpenAI API call (uncomment when you have an API key)
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful coding assistant that creates detailed, well-structured coding prompts for developers.'
          },
          {
            role: 'user',
            content: `Please enhance and optimize this coding prompt: "${prompt}". Make it more specific, include best practices, and ensure it provides clear guidance for ${aiTool} or any AI coding assistant.`
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const enhancedPrompt = data.choices[0].message.content;

    return NextResponse.json({
      generatedPrompt: enhancedPrompt,
      originalPrompt: prompt,
      aiTool
    });
    */

    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Enhanced prompt formatting based on AI tool
    let enhancedPrompt = prompt;
    
    if (aiTool === 'cursor') {
      enhancedPrompt = `${prompt}\n\nAdditional requirements for Cursor:\n- Use Cursor's built-in autocomplete features\n- Structure code for easy navigation\n- Include clear comments for AI assistance\n- Use modern TypeScript/JavaScript patterns`;
    } else if (aiTool === 'claude') {
      enhancedPrompt = `${prompt}\n\nAdditional requirements for Claude:\n- Provide step-by-step implementation guide\n- Include comprehensive error handling\n- Explain architectural decisions\n- Add unit test suggestions`;
    } else if (aiTool === 'chatgpt') {
      enhancedPrompt = `${prompt}\n\nAdditional requirements for ChatGPT:\n- Include detailed code documentation\n- Provide alternative implementation approaches\n- Add performance optimization tips\n- Include debugging strategies`;
    }

    return NextResponse.json({
      generatedPrompt: enhancedPrompt,
      originalPrompt: prompt,
      aiTool,
      message: 'Prompt enhanced successfully'
    });

  } catch (error) {
    console.error('Error in generate-prompt API:', error);
    return NextResponse.json(
      { error: 'Failed to generate prompt. Please try again.' },
      { status: 500 }
    );
  }
}