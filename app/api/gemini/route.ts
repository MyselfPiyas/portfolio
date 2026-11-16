import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'

const MAX_PROMPT_LENGTH = 8000

function isPromptRequest(value: unknown): value is { prompt: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'prompt' in value &&
    typeof value.prompt === 'string'
  )
}

export async function GET() {
  return Response.json({ available: Boolean(process.env.GEMINI_API_KEY) })
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'Gemini is not configured.' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  if (!isPromptRequest(body) || !body.prompt.trim() || body.prompt.length > MAX_PROMPT_LENGTH) {
    return Response.json({ error: 'A valid prompt is required.' }, { status: 400 })
  }

  try {
    const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    })

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: "You are an AI assistant for Piyas Sarkar's portfolio website." }],
        },
        {
          role: 'model',
          parts: [{ text: "I'll help visitors navigate and explore Piyas Sarkar's portfolio. What would you like to know?" }],
        },
        {
          role: 'user',
          parts: [{ text: "Here are the sections available: Home, About, Skills, Projects, Blog, and Contact. The project section features RESQNET, Wayfarer, THREATLENS, GRoute, and Carpooling. You'll need to recognize user intent and provide specific JSON structured responses." }],
        },
        {
          role: 'model',
          parts: [{ text: "I understand. I'll help visitors navigate through the sections of Piyas Sarkar's portfolio and provide information about his projects. I'll structure my responses accordingly and recognize user intents." }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
    })

    const result = await chat.sendMessage(body.prompt)
    return Response.json({ text: result.response.text() })
  } catch (error) {
    console.error(
      'Gemini API request failed:',
      error instanceof Error ? error.name : 'Unknown error'
    )
    return Response.json({ error: 'Gemini request failed.' }, { status: 502 })
  }
}
