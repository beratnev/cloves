import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { departmentFilters } from '@/lib/config/filters'

// Helper to remove "All" from options for the AI prompt
const cleanFilters = Object.fromEntries(
  Object.entries(departmentFilters).map(([dept, filters]) => [
    dept,
    filters.map(f => ({
      id: f.id,
      label: f.label,
      options: f.options?.filter(o => o !== 'All') || [],
      ...(f.categories ? { categories: f.categories } : {})
    }))
  ])
)

const MODELS = [
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash'
]

// Global variables to persist state between requests in development
let currentModelIndex = 0;
let lastResetTime = Date.now();

function getCurrentModel() {
  const now = new Date();
  const resetTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0).getTime();
  
  if (now.getTime() >= resetTimeToday && lastResetTime < resetTimeToday) {
    currentModelIndex = 0;
    lastResetTime = now.getTime();
  } else if (now.getTime() < resetTimeToday) {
    const resetTimeYesterday = resetTimeToday - 24 * 60 * 60 * 1000;
    if (lastResetTime < resetTimeYesterday) {
      currentModelIndex = 0;
      lastResetTime = now.getTime();
    }
  }

  return MODELS[currentModelIndex];
}

function advanceModel() {
  if (currentModelIndex < MODELS.length - 1) {
    currentModelIndex++;
    return true;
  }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('image') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

    const prompt = `Analyze the provided product image(s). Extract or guess its details to be added to an e-commerce store. 
Return ONLY valid JSON without markdown wrapping. It must have this structure:
{
  "name": "Product Name (DO NOT include 'Clove\\'s' or 'Cloves' in the name)",
  "description": "A very detailed, compelling, and long product description in English (at least 2-3 paragraphs, describing notes, usage, and experience).",
  "sku": "A 6-character string of uppercase letters and numbers (e.g. A8X9B2)",
  "price": 50.00,
  "comparePrice": 70.00,
  "department": "Must be exactly one of: FRAGRANCE, BODY CARE, BATH & SHOWER, SKINCARE, HAIR CARE, HOME FRAGRANCE",
  "category": "Pick the most suitable from: Perfume, Eau de Parfum, Body Mist (if FRAGRANCE), Body Lotion, Body Cream, Body Oil, Body Scrub (if BODY CARE), Shower Gel, Body Wash, Soap, Bath Bombs (if BATH & SHOWER), Cleansers, Serums, Moisturizers, Peeling (if SKINCARE), Shampoo, Conditioner, Hair Oil (if HAIR CARE), Candles, Reed Diffusers, Room Sprays (if HOME FRAGRANCE).",
  "stock": 3,
  "featured": true, // Decide if this looks like a premium or highly attractive product (true/false)
  "lowStockAlert": 3,
  "attributes": {
    // Fill in as many attributes as possible from the allowed options for the selected department.
    // The keys must be the 'id' and the values MUST exactly match one of the provided 'options'.
    // ONLY include attributes that logically make sense for the specific product. 
    // Omit irrelevant attributes completely (e.g. do NOT set "spf" for cleansers, do NOT set "burnTime" for perfumes).
    // Example: "fragranceFamily": "Floral", "gender": "Women", "vegan": "Yes"
  },
  "aiAdvice": {
    "keyBenefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
    "usageTips": ["Tip 1", "Tip 2", "Tip 3"]
  }
}

CRITICAL RULES FOR ATTRIBUTES: 
1. Use the provided category to filter the valid attributes.
2. Only include attributes that are strictly logical for the product. Omit irrelevant attributes completely.
3. For 'options' like arrays, pick the single most suitable option string.

Here are the allowed attributes (ids and options) for each department:
${JSON.stringify(cleanFilters, null, 2)}
`

    const inlineDataArray = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const base64 = buffer.toString('base64')
        return {
          inlineData: {
            data: base64,
            mimeType: file.type
          }
        }
      })
    )

    let parsed: any;

    while (true) {
      const modelName = getCurrentModel();
      const model = genAI.getGenerativeModel({ model: modelName });
      
      try {
        const result = await model.generateContent([
          prompt,
          ...inlineDataArray
        ])
        const text = result.response.text()
        const cleanText = text.replace(/```json\n?|\n?```/g, '').trim()
        parsed = JSON.parse(cleanText)
        break; // Success
      } catch (error: any) {
        const isQuotaError = error.status === 429 || (error.message && error.message.includes('429')) || (error.message && error.message.toLowerCase().includes('quota'));
        const isModelError = error.status === 404 || error.status === 400 || (error.message && error.message.toLowerCase().includes('not found')) || (error.message && error.message.toLowerCase().includes('invalid'));

        if (isQuotaError || isModelError) {
          console.warn(`[AI Route] Model ${modelName} failed (${isQuotaError ? 'Quota' : 'Invalid/Not Found'}). Attempting fallback...`);
          const canAdvance = advanceModel();
          if (!canAdvance) {
            console.error('[AI Route] All models exhausted or failed.');
            return NextResponse.json({ error: 'Tüm AI modelleri geçersiz veya kotaları doldu. Lütfen yarına kadar bekleyin.' }, { status: 429 })
          }
        } else {
          throw error;
        }
      }
    }

    return NextResponse.json({ product: parsed })
  } catch (error: any) {
    console.error('AI parse error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to parse image', stack: error?.stack }, { status: 500 })
  }
}
