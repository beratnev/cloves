import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIProductRecommendation {
  productId: string;
  reason: string;
  matchScore: number;
}

export interface AIProductComparison {
  summary: string;
  bestValue: string;
  recommendations: {
    for: string[];
    product: string;
  }[];
  comparisons: {
    aspect: string;
    products: Record<string, string>;
  }[];
}

export async function searchProductsWithAI(query: string, products: any[]) {
  try {
    const productContext = products
      .map(
        (p) => `
ID: ${p.id}
Name: ${p.name}
Description: ${p.description}
Price: $${p.price}
Category: ${p.category?.name}
Tags: ${p.tags?.join(", ")}
`
      )
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI shopping assistant. Help users find the best products based on their natural language queries. 
          
          Available products:
          ${productContext}
          
          Return a JSON response with this structure:
          {
            "recommendations": [
              {
                "productId": "product_id",
                "reason": "Why this product matches their needs",
                "matchScore": 0-100
              }
            ],
            "summary": "Brief explanation of recommendations",
            "followUpQuestions": ["question1", "question2"]
          }`,
        },
        {
          role: "user",
          content: query,
        },
      ],
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(completion.choices[0].message.content || "{}");
    return response;
  } catch (error) {
    console.error("AI search error:", error);
    throw new Error("Failed to get AI recommendations");
  }
}

export async function compareProductsWithAI(productIds: string[], products: any[]) {
  const selectedProducts = products.filter((p) => productIds.includes(p.id));

  const productContext = selectedProducts
    .map(
      (p) => `
ID: ${p.id}
Name: ${p.name}
Description: ${p.description}
Price: $${p.price}
Category: ${p.category?.name}
`
    )
    .join("\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI product comparison expert. Compare the following products and provide detailed analysis.
          
          Products:
          ${productContext}
          
          Return a JSON response with this structure:
          {
            "summary": "Overall comparison summary",
            "bestValue": "product_id of best value",
            "recommendations": [
              {
                "for": ["students", "professionals"],
                "product": "product_id"
              }
            ],
            "comparisons": [
              {
                "aspect": "Performance",
                "products": {
                  "product_id_1": "description",
                  "product_id_2": "description"
                }
              }
            ]
          }`,
        },
        {
          role: "user",
          content: "Compare these products and tell me which one is best for different use cases.",
        },
      ],
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(completion.choices[0].message.content || "{}");
    return response as AIProductComparison;
  } catch (error) {
    console.error("AI comparison error:", error);
    throw new Error("Failed to compare products");
  }
}

export async function generateProductSummary(product: any) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI product description expert. Generate a concise, helpful product summary.
          
          Product: ${product.name}
          Description: ${product.description}
          Price: $${product.price}
          Category: ${product.category?.name}
          
          Return a JSON response with this structure:
          {
            "summary": "2-3 sentence summary",
            "advantages": ["pro1", "pro2"],
            "disadvantages": ["con1", "con2"],
            "bestFor": ["target audience 1", "target audience 2"]
          }`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(completion.choices[0].message.content || "{}");
    return response;
  } catch (error) {
    console.error("AI summary error:", error);
    throw new Error("Failed to generate product summary");
  }
}
