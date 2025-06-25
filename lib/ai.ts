// OpenAI Integration
export class OpenAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(prompt: string, maxTokens: number = 150) {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo-instruct',
        prompt,
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    });

    return response.json();
  }

  async createChatCompletion(messages: any[]) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
      }),
    });

    return response.json();
  }
}

// Anthropic Claude Integration
export class ClaudeService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(prompt: string, maxTokens: number = 150) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    return response.json();
  }
}

// AI Integration Factory
export class AIIntegrationFactory {
  static createOpenAI(apiKey: string) {
    return new OpenAIService(apiKey);
  }

  static createClaude(apiKey: string) {
    return new ClaudeService(apiKey);
  }
}