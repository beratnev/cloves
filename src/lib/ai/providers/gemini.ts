import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider, ChatMessage, ChatOptions, ChatResponse, GenerationOptions, AIConfig } from './base';

export class GeminiProvider implements AIProvider {
  name = 'Gemini';
  private client: GoogleGenerativeAI;
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
    this.client = new GoogleGenerativeAI(config.apiKey);
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    const model = this.client.getGenerativeModel({
      model: options?.model || this.config.model || 'gemini-3.5-flash',
    });

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];
    
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const text = response.text();

    return {
      content: text,
      usage: {
        promptTokens: response.usageMetadata?.promptTokenCount || 0,
        completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: response.usageMetadata?.totalTokenCount || 0,
      },
    };
  }

  async generateText(prompt: string, options?: GenerationOptions): Promise<string> {
    const model = this.client.getGenerativeModel({
      model: options?.model || this.config.model || 'gemini-3.5-flash',
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}
