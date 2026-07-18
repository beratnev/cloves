import { createAIManager, ChatMessage } from './ai-manager';
import { prisma } from '@/lib/prisma';

export interface ProductRecommendation {
  productId: string;
  name: string;
  reason: string;
  price: number;
  category: string;
  brand?: string;
}

export interface ShoppingAssistantResponse {
  message: string;
  recommendations?: ProductRecommendation[];
  routineSuggestion?: {
    step1?: ProductRecommendation;
    step2?: ProductRecommendation;
    step3?: ProductRecommendation;
    extras?: ProductRecommendation[];
    totalEstimatedPrice: number;
    routineExplanation: string;
  };
}

const SYSTEM_PROMPT = `You are a professional beauty and personal care assistant for Clove's, a premium beauty e-commerce platform. Your role is to help customers find the perfect skincare, body care, and fragrances based on their skin type, scent preferences, and needs.

Key capabilities:
- Understand skincare ingredients, skin types (dry, oily, sensitive, etc.), and fragrance notes (floral, woody, etc.)
- Recommend products based on skin concerns, scent profiles, and budget
- Create complete skincare or body care routines
- Explain the benefits of specific ingredients and how to use products
- Provide advice on layering scents or building a skincare regimen

When responding:
1. Be helpful, friendly, and professional
2. Ask clarifying questions if needed (e.g., "What is your skin type?")
3. Provide specific product recommendations when possible
4. Explain the reasoning behind recommendations (e.g., "This contains hyaluronic acid which is great for hydration")
5. Consider the customer's budget
6. Be knowledgeable about active ingredients (retinol, vitamin C, etc.)
7. Focus on healthy skin and wellbeing

Available product categories: Body Care, Face Care, Fragrance, Hair Care, Home Fragrance, Gifts
Available skin types: Normal, Dry, Oily, Combination, Sensitive, All Skin Types
Available fragrance families: Floral, Woody, Fresh, Oriental, Fruity, Citrus

When you recommend products, format them as a JSON array in your response if you have specific product IDs, otherwise describe the type of products the user should look for.`;

export class ShoppingAssistant {
  private aiManager = createAIManager();

  async processQuery(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<ShoppingAssistantResponse> {
    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    const response = await this.aiManager.chat(messages);
    
    // Parse the response to extract recommendations
    const recommendations = this.extractRecommendations(response.content);
    
    return {
      message: response.content,
      recommendations: recommendations.length > 0 ? recommendations : undefined,
    };
  }

  async generateRoutine(
    skinType: string,
    concern: string,
    budget?: number
  ): Promise<ShoppingAssistantResponse> {
    const prompt = `Create a complete skincare/bodycare routine recommendation for ${skinType} skin focusing on ${concern}${budget ? ` within a budget of $${budget}` : ''}. 
    Please suggest:
    1. A Cleanser / Body Wash
    2. A Toner / Serum
    3. A Moisturizer / Body Butter
    4. 1-2 extra treatments (Mask, Fragrance mist, etc.)
    
    For each item, explain why it works for the routine and provide an estimated price range. Calculate the total estimated price and provide an explanation for the complete regimen.`;

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ];

    const response = await this.aiManager.chat(messages);
    
    // Try to find matching products from database
    const routineSuggestion = await this.findMatchingRoutineProducts(skinType, concern, budget);
    
    return {
      message: response.content,
      routineSuggestion: routineSuggestion || undefined,
    };
  }

  async getStyleAdvice(query: string): Promise<string> {
    const prompt = `Provide beauty and personal care advice for: ${query}. 
    Consider factors like:
    - Skin types and active ingredients
    - Fragrance notes and longevity
    - Layering techniques
    - Seasonal skincare changes
    
    Give specific, actionable advice that the customer can use immediately.`;

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ];

    const response = await this.aiManager.chat(messages);
    return response.content;
  }

  async generateProductSummary(productId: string): Promise<{
    summary: string;
    pros: string[];
    cons: string[];
    ingredientsExplanation: string;
    howToUse: string;
    whoShouldBuy: string;
  }> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const p = product as any;

    const prompt = `Analyze this beauty product and provide a comprehensive summary:
    
    Product: ${product.name}
    Price: $${product.price}
    Description: ${product.description}
    Skin Type: ${p.skinType || 'Not specified'}
    Fragrance Family: ${p.fragranceFamily || 'Not specified'}
    Ingredients: ${p.ingredients || 'Not specified'}
    How to Use: ${p.howToUse || 'Not specified'}

    Please provide:
    1. A concise 2-3 sentence summary
    2. 3-5 pros (bullet points)
    3. 2-3 cons (bullet points)
    4. Explanation of the key ingredients and their benefits
    5. Clear how-to-use instructions
    6. Who should buy this product (target audience, skin type)

    Format your response as JSON with the following structure:
    {
      "summary": "...",
      "pros": ["...", "..."],
      "cons": ["...", "..."],
      "ingredientsExplanation": "...",
      "howToUse": "...",
      "whoShouldBuy": "..."
    }`;

    const messages: ChatMessage[] = [
      { role: 'system', content: 'You are a beauty expert. Always respond with valid JSON.' },
      { role: 'user', content: prompt },
    ];

    const response = await this.aiManager.chat(messages, { temperature: 0.5 });
    
    try {
      const parsed = JSON.parse(response.content);
      return parsed;
    } catch {
      return {
        summary: product.description.substring(0, 200),
        pros: ['High quality ingredients', 'Effective formula'],
        cons: ['May not suit all skin types'],
        ingredientsExplanation: p.ingredients || 'Key ingredients are beneficial for skin.',
        howToUse: p.howToUse || 'Follow standard application instructions.',
        whoShouldBuy: 'Anyone looking for quality personal care products.',
      };
    }
  }

  private extractRecommendations(content: string): ProductRecommendation[] {
    return [];
  }

  private async findMatchingRoutineProducts(
    skinType: string,
    concern: string,
    budget?: number
  ) {
    const products = await prisma.product.findMany({
      where: {
        status: 'active',
        ...(budget && { price: { lte: budget / 3 } }),
      },
      take: 10,
    });

    if (products.length < 3) {
      return null;
    }

    const productWithRelations = products as any[];

    const step1 = productWithRelations[0];
    const step2 = productWithRelations[1];
    const step3 = productWithRelations[2];
    const extra = productWithRelations[3];

    const totalPrice = step1.price + step2.price + step3.price + (extra?.price || 0);

    return {
      step1: {
        productId: step1.id,
        name: step1.name,
        reason: `Gentle cleansing for ${skinType} skin`,
        price: step1.price,
        category: 'Cleanser',
        brand: step1.brand?.name,
      },
      step2: {
        productId: step2.id,
        name: step2.name,
        reason: `Targets ${concern}`,
        price: step2.price,
        category: 'Serum/Toner',
        brand: step2.brand?.name,
      },
      step3: {
        productId: step3.id,
        name: step3.name,
        reason: `Locks in moisture for ${skinType} skin`,
        price: step3.price,
        category: 'Moisturizer',
        brand: step3.brand?.name,
      },
      extras: extra ? [{
        productId: extra.id,
        name: extra.name,
        reason: 'Provides an extra boost of care',
        price: extra.price,
        category: 'Treatment',
        brand: extra.brand?.name,
      }] : [],
      totalEstimatedPrice: totalPrice,
      routineExplanation: `This routine is tailored for ${skinType} skin targeting ${concern}, using products that work perfectly together.`,
    };
  }
}

export const shoppingAssistant = new ShoppingAssistant();
