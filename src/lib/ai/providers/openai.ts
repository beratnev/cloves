import OpenAI from 'openai';
import { AIProvider, ChatMessage, ChatOptions, ChatResponse, GenerationOptions, AIConfig } from './base';

export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  private client: OpenAI;
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    const response = await this.client.chat.completions.create({
      model: options?.model || this.config.model || 'gpt-4',
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      temperature: options?.temperature ?? this.config.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? this.config.maxTokens ?? 1000,
    });

    return {
      content: response.choices[0]?.message?.content || '',
      usage: response.usage ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      } : undefined,
    };
  }

  async generateText(prompt: string, options?: GenerationOptions): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: options?.model || this.config.model || 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: options?.temperature ?? this.config.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? this.config.maxTokens ?? 1000,
    });

    return response.choices[0]?.message?.content || '';
  }
}
