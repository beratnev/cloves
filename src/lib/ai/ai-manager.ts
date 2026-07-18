import { AIProvider, AIConfig, ChatMessage, ChatOptions, ChatResponse, GenerationOptions } from './providers/base';
import { OpenAIProvider } from './providers/openai';
import { GeminiProvider } from './providers/gemini';

export type ProviderType = 'openai' | 'gemini';
export type { ChatMessage, ChatOptions, ChatResponse, GenerationOptions, AIConfig };

export class AIManager {
  private provider: AIProvider;

  constructor(type: ProviderType, config: AIConfig) {
    switch (type) {
      case 'openai':
        this.provider = new OpenAIProvider(config);
        break;
      case 'gemini':
        this.provider = new GeminiProvider(config);
        break;
      default:
        throw new Error(`Unsupported AI provider: ${type}`);
    }
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    return this.provider.chat(messages, options);
  }

  async generateText(prompt: string, options?: GenerationOptions): Promise<string> {
    return this.provider.generateText(prompt, options);
  }

  getProviderName(): string {
    return this.provider.name;
  }
}

// Factory function to create AI manager based on environment
export function createAIManager(): AIManager {
  const providerType = (process.env.AI_PROVIDER as ProviderType) || 'openai';
  const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || '';
  
  if (!apiKey) {
    throw new Error('AI API key not found in environment variables');
  }

  return new AIManager(providerType, {
    apiKey,
    model: process.env.AI_MODEL,
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '1000'),
  });
}
