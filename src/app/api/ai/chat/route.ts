import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    console.log("Received messages:", messages.length)

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set")
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      )
    }

    console.log("API key exists, initializing Gemini...")

    // Fetch products
    const products = await prisma.product.findMany({
      select: {
        name: true,
        category: true,
        price: true,
        discountPrice: true,
        attributes: true,
      }
    });

    const productsJson = JSON.stringify(products);

    const systemPrompt = `You are a helpful AI shopping assistant for a beauty and personal care e-commerce store called Clove's. 
    Your role is to help customers find skincare, body care, and fragrance products, provide beauty routines, answer questions about ingredients, and make personalized recommendations based on skin type and scent preferences.
    CRITICAL: Base your product recommendations ONLY on the following product data: ${productsJson}. Do not invent products.
    If asked about specific products that you don't have information about or are not in the list, suggest browsing the collection or ask for more details about their skin type or needs.
    Be friendly, helpful, and knowledgeable about active ingredients (like hyaluronic acid, retinol) and fragrance notes. Keep responses concise and conversational.`

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash",
      systemInstruction: systemPrompt
    })

    // Filter messages to ensure we only send user/model pairs, and skip the initial assistant greeting
    const chatHistory = messages
      .slice(1, -1) // Skip first message (initial greeting) and last message (current one)
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }))

    console.log("Starting chat with history length:", chatHistory.length)

    const chat = model.startChat({
      history: chatHistory.length > 0 ? chatHistory : undefined,
    })

    const lastMessage = messages[messages.length - 1]
    console.log("Sending message:", lastMessage.content)

    const result = await chat.sendMessage(lastMessage.content)
    console.log("Received response from Gemini")

    const response = await result.response
    const text = response.text()

    console.log("Generated response length:", text.length)

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Gemini API error:", error)
    return NextResponse.json(
      { 
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
