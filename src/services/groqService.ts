import Groq from 'groq-sdk'
import type { Analysis, Exchange } from '../types/interview'
import { generateQuestionPrompt, generateAnalysisPrompt } from '../prompts/interviewPrompts'

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
})

export async function generateQuestion(
  topic: string,
  questionNumber: number,
  totalQuestions: number,
  previousExchanges: Exchange[]
): Promise<string> {
  try {
    const prompt = generateQuestionPrompt(topic, questionNumber, totalQuestions, previousExchanges)

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    })

    const text = response.choices[0].message.content?.trim() ?? ''
    if (!text) throw new Error('Groq returned an empty response for the question.')

    return text
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error('Failed to generate interview question.')
  }
}

export async function generateAnalysis(topic: string, exchanges: Exchange[]): Promise<Analysis> {
  try {
    const prompt = generateAnalysisPrompt(topic, exchanges)

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    })

    const text = response.choices[0].message.content?.trim() ?? ''
    console.log('RAW GROQ RESPONSE:', text)
    if (!text) throw new Error('Groq returned an empty response for the analysis.')

    // Strip all possible markdown code block variations
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    // Find JSON object boundaries as fallback
    const jsonStart = cleaned.indexOf('{')
    const jsonEnd = cleaned.lastIndexOf('}')
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('Failed to parse Groq analysis response as JSON. The model returned unexpected output.')
    }
    const jsonString = cleaned.slice(jsonStart, jsonEnd + 1)
    const parsed = JSON.parse(jsonString) as unknown as Analysis
    return parsed
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse Groq analysis response as JSON. The model returned unexpected output.')
    }
    if (error instanceof Error) throw error
    throw new Error('Failed to generate interview analysis.')
  }
}
