const { GoogleGenerativeAI } = require('@google/generative-ai')
require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env' })

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    
    // Using a simple fetch since SDK might not expose listModels easily
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`)
    const data = await res.json()
    console.log(data.models.map(m => m.name).join('\\n'))
  } catch (e) {
    console.error(e)
  }
}

test()
